import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { subscriptionService, paymentService } from "../../../services";
import bannerSubscriptionImg from "../../../assets/banner-admin-subscription-3d.png";
import {
  Sparkles,
  Check,
  Zap,
  Crown,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Package,
  Layers,
  Lock,
} from "lucide-react";

export default function Plans() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [plans, setPlans] = useState([]);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [billingCycle, setBillingCycle] = useState("monthly"); // "monthly" | "annual"
  const [purchasingPlanId, setPurchasingPlanId] = useState(null);
  const [successToast, setSuccessToast] = useState("");
  const [errorToast, setErrorToast] = useState("");

  const showToast = (msg, isErr = false) => {
    if (isErr) {
      setErrorToast(msg);
      setTimeout(() => setErrorToast(""), 3500);
    } else {
      setSuccessToast(msg);
      setTimeout(() => setSuccessToast(""), 3500);
    }
  };

  const isStarterPlan = (plan) => {
    const name = (plan.name || "").toLowerCase();
    return name.includes("starter") || Number(plan.price) === 0 || plan.id === 1;
  };

  // Fetch real plans & vendor's active subscription directly from DB
  const loadPlansAndSubscription = async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const [plansRes, subRes] = await Promise.allSettled([
        subscriptionService.getPublicPlans(),
        subscriptionService.getMySubscription(),
      ]);

      if (plansRes.status === "fulfilled" && Array.isArray(plansRes.value?.plans)) {
        setPlans(plansRes.value.plans);
      } else {
        setPlans([]);
      }

      if (subRes.status === "fulfilled" && subRes.value?.hasActiveSubscription) {
        setActiveSubscription(subRes.value.subscription);
      } else {
        setActiveSubscription(null);
      }
    } catch (err) {
      console.error("Failed to load plans from DB:", err);
      setLoadError(err.message || "Failed to load subscription plans from database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPlansAndSubscription();
  }, []);

  // Starter Plan is activated automatically/free
  const handleStarterActivate = async (plan) => {
    if (activeSubscription && Number(activeSubscription.planId) === Number(plan.id)) {
      showToast("Starter plan is already active on your account!");
      return;
    }

    setPurchasingPlanId(plan.id);
    try {
      await subscriptionService.purchasePlan({
        planId: plan.id,
        paymentMethod: "free_starter",
        billingCycle,
      });
      showToast(`Starter plan activated successfully!`);
      await loadPlansAndSubscription();
    } catch (err) {
      showToast(err.message || "Could not activate Starter plan.", true);
    } finally {
      setPurchasingPlanId(null);
    }
  };

  // Higher tiers (Growth Pro, Enterprise) require Razorpay payment
  const handleRazorpayPayment = async (plan) => {
    setPurchasingPlanId(plan.id);
    const monthlyPrice = Number(plan.price || 0);
    const annualPrice = Math.round(monthlyPrice * 10);
    const finalAmount = billingCycle === "annual" ? annualPrice : monthlyPrice;

    try {
      const isScriptLoaded = await paymentService.loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
      }

      const orderData = await paymentService.createOrder(finalAmount);
      if (!orderData || !orderData.orderId) {
        throw new Error(orderData?.message || "Failed to create payment order with Razorpay");
      }

      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "ShopMart Marketplace",
        description: `Upgrade to ${plan.name} (${billingCycle.toUpperCase()})`,
        order_id: orderData.orderId,
        prefill: {
          name: storedUser.name || "Vendor Admin",
          email: storedUser.email || "vendor@shopmart.com",
          contact: storedUser.phone || "",
        },
        theme: {
          color: "#049669",
        },
        modal: {
          ondismiss: () => {
            setPurchasingPlanId(null);
            showToast("Razorpay payment cancelled. Plan was not activated.", true);
          },
        },
        handler: async (response) => {
          try {
            // Activate plan only after successful Razorpay verification
            await subscriptionService.purchasePlan({
              planId: plan.id,
              paymentMethod: "razorpay",
              transactionRef: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              billingCycle,
            });

            showToast(`🎉 Payment successful! You are now upgraded to '${plan.name}'!`);
            await loadPlansAndSubscription();
            setTimeout(() => {
              navigate("/vendor");
            }, 1800);
          } catch (activateErr) {
            showToast(activateErr?.message || "Payment verified but plan activation failed. Please contact support.", true);
          } finally {
            setPurchasingPlanId(null);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        setPurchasingPlanId(null);
        showToast(response.error?.description || "Razorpay payment failed at gateway", true);
      });
      rzp.open();
    } catch (err) {
      setPurchasingPlanId(null);
      showToast(err.message || "Failed to initialize Razorpay checkout", true);
    }
  };

  const getPlanTheme = (plan, index) => {
    const name = (plan.name || "").toLowerCase();
    if (name.includes("enterprise") || name.includes("platinum") || index === 2) {
      return {
        badge: "ENTERPRISE",
        badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
        accentBorder: "border-purple-200/90 hover:border-purple-400 hover:shadow-purple-500/10",
        buttonBg: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-purple-600/25",
        icon: Crown,
        iconBg: "bg-purple-50 text-purple-600",
        isPopular: false,
      };
    }
    if (name.includes("growth") || name.includes("pro") || index === 1) {
      return {
        badge: "MOST POPULAR",
        badgeColor: "bg-emerald-100 text-[#049669] border-emerald-200",
        accentBorder: "border-emerald-300 ring-2 ring-emerald-500/20 shadow-emerald-500/10 shadow-lg",
        buttonBg: "bg-gradient-to-r from-[#049669] to-[#10B981] hover:from-[#03704f] hover:to-[#059669] shadow-emerald-600/25",
        icon: Zap,
        iconBg: "bg-emerald-50 text-[#049669]",
        isPopular: true,
      };
    }
    return {
      badge: "FREE STARTER",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
      accentBorder: "border-emerald-200 hover:border-emerald-400 hover:shadow-emerald-500/10",
      buttonBg: "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-600/20",
      icon: Package,
      iconBg: "bg-emerald-50 text-emerald-700",
      isPopular: false,
    };
  };

  return (
    <div className="h-screen w-full bg-white flex flex-col font-['Poppins',sans-serif] text-slate-800 relative overflow-hidden">
      {/* Background Ambient Glow Orbs */}
      <div className="pointer-events-none absolute -left-20 top-0 w-[450px] h-[450px] rounded-full bg-gradient-to-br from-emerald-400/15 to-teal-300/10 blur-3xl z-0" />
      <div className="pointer-events-none absolute right-10 top-20 w-[420px] h-[420px] rounded-full bg-gradient-to-bl from-teal-400/15 to-emerald-300/10 blur-3xl z-0" />

      {/* Toast Notifications */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-[#049669] px-5 py-3.5 text-white shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="h-5 w-5 text-emerald-200 shrink-0" />
          <p className="text-xs sm:text-sm font-bold">{successToast}</p>
        </div>
      )}
      {errorToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-rose-600 px-5 py-3.5 text-white shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <AlertCircle className="h-5 w-5 text-rose-200 shrink-0" />
          <p className="text-xs sm:text-sm font-bold">{errorToast}</p>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar onToggleSidebar={() => setIsSidebarOpen(true)} />

      {/* Body Area */}
      <div className="flex-1 flex min-h-0 relative z-10 overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto relative z-10">
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 w-full mx-auto pb-16">
            {/* Header Banner */}
            <div className="relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 min-h-[175px] sm:min-h-[190px] flex flex-col justify-between overflow-hidden shadow-[0_16px_40px_rgba(4,150,105,0.22)] border border-emerald-400/30 group">
              <svg
                className="pointer-events-none absolute inset-0 w-full h-full object-cover"
                viewBox="0 0 1024 200"
                preserveAspectRatio="none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="plansBannerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1B744A" />
                    <stop offset="40%" stopColor="#228C52" />
                    <stop offset="100%" stopColor="#2CA85C" />
                  </linearGradient>
                </defs>
                <rect width="1024" height="200" fill="url(#plansBannerGrad)" />
                <path
                  d="M 0 200 C 240 185 380 130 620 160 C 800 182 920 150 1024 115 L 1024 200 Z"
                  fill="#114E30"
                  fillOpacity="0.8"
                />
              </svg>

              <div className="absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 h-[90%] w-auto max-w-[35%] pointer-events-none select-none z-10 hidden md:flex items-center justify-end">
                <img
                  src={bannerSubscriptionImg}
                  alt="Subscription Plans"
                  className="h-full w-auto object-contain drop-shadow-xl"
                />
              </div>

              <div className="relative z-10 max-w-xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-emerald-100">
                    MEMBERSHIP &amp; TIERS
                  </span>
                  <span className="w-7 h-[1.5px] bg-emerald-200/80 rounded-full inline-block" />
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-[28px] font-black tracking-tight text-white leading-tight">
                  Choose Your Vendor Membership Plan
                </h1>
                <p className="text-xs sm:text-sm text-emerald-50/95 font-medium leading-relaxed">
                  Your <strong>Starter Plan</strong> is already active by default. Upgrade anytime to unlock higher product listings, verified trust badge, and 24h settlements via Razorpay.
                </p>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <Link
                  to="/vendor"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition backdrop-blur-md"
                >
                  <span>Continue to Vendor Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Billing Cycle Switch */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur-xl p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Available Plans from Database</h3>
                <p className="text-xs text-slate-500">Starter Plan is complimentary. Paid tiers process securely with Razorpay.</p>
              </div>

              <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    billingCycle === "monthly"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle("annual")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    billingCycle === "annual"
                      ? "bg-[#049669] text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <span>Annual</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-200 text-emerald-900 font-extrabold uppercase">
                    Save 15%
                  </span>
                </button>
              </div>
            </div>

            {/* Loading / Error States */}
            {isLoading && (
              <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-500">
                <Loader2 className="w-8 h-8 text-[#049669] animate-spin" />
                <p className="text-sm font-semibold">Loading membership plans from database...</p>
              </div>
            )}

            {!isLoading && loadError && (
              <div className="p-6 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 shrink-0" />
                  <p className="text-sm font-semibold">{loadError}</p>
                </div>
                <button
                  onClick={loadPlansAndSubscription}
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition cursor-pointer"
                >
                  Retry Loading
                </button>
              </div>
            )}

            {/* Plans Grid */}
            {!isLoading && !loadError && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
                {plans.map((plan, index) => {
                  const theme = getPlanTheme(plan, index);
                  const Icon = theme.icon;
                  const isStarter = isStarterPlan(plan);
                  const isPlanActive =
                    activeSubscription
                      ? Number(activeSubscription.planId) === Number(plan.id)
                      : isStarter; // default starter active if no sub found

                  const monthlyPrice = Number(plan.price || 0);
                  const annualPrice = Math.round(monthlyPrice * 10);
                  const displayPrice = billingCycle === "annual" ? Math.round(annualPrice / 12) : monthlyPrice;
                  const finalAmount = billingCycle === "annual" ? annualPrice : monthlyPrice;

                  let featureList = [];
                  if (Array.isArray(plan.features)) {
                    featureList = plan.features;
                  } else if (typeof plan.features === "string") {
                    try {
                      const parsed = JSON.parse(plan.features);
                      featureList = Array.isArray(parsed) ? parsed : [plan.features];
                    } catch {
                      featureList = plan.features.split(",").map((s) => s.trim()).filter(Boolean);
                    }
                  }

                  const isPurchasing = purchasingPlanId === plan.id;

                  return (
                    <div
                      key={plan.id}
                      className={`relative rounded-3xl border bg-white p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-xl ${
                        isPlanActive
                          ? "border-emerald-500 ring-2 ring-emerald-500/25 shadow-emerald-600/10"
                          : theme.accentBorder
                      }`}
                    >
                      {/* Active Status Badge */}
                      {isPlanActive ? (
                        <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-black uppercase tracking-wider shadow-md shadow-emerald-700/30 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>ACTIVE PLAN</span>
                        </div>
                      ) : theme.isPopular ? (
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#049669] to-[#10B981] text-white text-[11px] font-black uppercase tracking-wider shadow-md shadow-emerald-600/30 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>RECOMMENDED</span>
                        </div>
                      ) : null}

                      <div>
                        {/* Top Plan Header */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div>
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-lg text-[11px] font-black border mb-2 uppercase ${
                                isPlanActive
                                  ? "bg-emerald-100 text-[#049669] border-emerald-300"
                                  : theme.badgeColor
                              }`}
                            >
                              {isPlanActive ? "CURRENT ACTIVE PLAN" : theme.badge}
                            </span>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">
                              {plan.name}
                            </h3>
                          </div>
                          <div
                            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                              isPlanActive ? "bg-emerald-100 text-[#049669]" : theme.iconBg
                            }`}
                          >
                            <Icon className="w-5 h-5 stroke-[2.2]" />
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed mb-5 min-h-[36px]">
                          {isStarter
                            ? "Complimentary Starter Plan assigned to every newly created vendor account with 50 product quota."
                            : plan.description || "Official marketplace membership plan for verified vendors."}
                        </p>

                        {/* Price Tag */}
                        <div className="pb-5 mb-5 border-b border-slate-100">
                          {isStarter ? (
                            <div>
                              <div className="flex items-baseline gap-1">
                                <span className="text-3xl sm:text-4xl font-black text-emerald-700 tracking-tight">
                                  FREE
                                </span>
                                <span className="text-xs font-semibold text-slate-400">/ Included</span>
                              </div>
                              <p className="text-[11px] text-emerald-700 font-bold mt-1">
                                Pre-activated for your store
                              </p>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-baseline gap-1">
                                <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                                  ₹{displayPrice.toLocaleString("en-IN")}
                                </span>
                                <span className="text-xs font-semibold text-slate-400">/ month</span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                                {billingCycle === "annual" ? (
                                  <span>
                                    Billed annually at{" "}
                                    <strong className="text-slate-800">
                                      ₹{annualPrice.toLocaleString("en-IN")}/yr
                                    </strong>{" "}
                                    (2 months free)
                                  </span>
                                ) : (
                                  <span>Billed monthly with cancel anytime flex</span>
                                )}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Product Quota Pill */}
                        <div className="mb-6 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#049669] flex items-center justify-center shrink-0">
                            <Layers className="w-4 h-4" />
                          </div>
                          <div className="leading-tight">
                            <span className="text-xs font-black text-slate-900 block">
                              {plan.productLimit >= 999999
                                ? "Unlimited Products"
                                : `Up to ${plan.productLimit} Products`}
                            </span>
                            <span className="text-[11px] text-slate-500">Live catalog listings quota</span>
                          </div>
                        </div>

                        {/* Features Checklist */}
                        <div className="space-y-3 mb-8">
                          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                            Included Capabilities
                          </span>
                          <ul className="space-y-2.5">
                            {featureList.map((feat, idx) => (
                              <li
                                key={idx}
                                className="text-xs flex items-start gap-2.5 text-slate-700 font-medium leading-relaxed"
                              >
                                <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </div>
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div>
                        {isPlanActive ? (
                          <div className="space-y-2">
                            <button
                              type="button"
                              disabled
                              className="w-full py-3.5 px-4 rounded-xl bg-emerald-50 text-[#049669] border border-emerald-300 font-bold text-xs sm:text-sm tracking-wide shadow-xs flex items-center justify-center gap-2 cursor-default"
                            >
                              <CheckCircle2 className="w-4 h-4 text-[#049669]" />
                              <span>Current Active Plan</span>
                            </button>
                            <p className="text-[11px] text-center text-emerald-600 font-semibold">
                              Currently enjoying {plan.productLimit} product listings
                            </p>
                          </div>
                        ) : isStarter ? (
                          <div className="space-y-2">
                            <button
                              type="button"
                              disabled={isPurchasing}
                              onClick={() => handleStarterActivate(plan)}
                              className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                            >
                              {isPurchasing ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  <span>Activating Starter...</span>
                                </>
                              ) : (
                                <>
                                  <span>Switch to Starter (Free)</span>
                                  <ArrowRight className="w-4 h-4" />
                                </>
                              )}
                            </button>
                            <p className="text-[11px] text-center text-slate-400 font-medium">
                              Free starter activation
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <button
                              type="button"
                              disabled={isPurchasing}
                              onClick={() => handleRazorpayPayment(plan)}
                              className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${theme.buttonBg}`}
                            >
                              {isPurchasing ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  <span>Processing Razorpay...</span>
                                </>
                              ) : (
                                <>
                                  <span>Pay ₹{finalAmount.toLocaleString("en-IN")} via Razorpay</span>
                                  <ArrowRight className="w-4 h-4" />
                                </>
                              )}
                            </button>
                            <p className="text-[11px] text-center text-slate-400 font-medium flex items-center justify-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Instant activation via Razorpay Secure</span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom Trust & Help Banner */}
            <div className="mt-8 rounded-2xl bg-slate-50 border border-slate-200/80 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#049669] shrink-0 shadow-2xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                    Razorpay 256-Bit Encrypted Payments &amp; Instant Activation
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Starter plan is complimentary for every vendor. Paid plans require successful Razorpay transaction to activate.
                  </p>
                </div>
              </div>
              <Link
                to="/vendor"
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs transition cursor-pointer shadow-2xs shrink-0"
              >
                Go to Vendor Dashboard
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
