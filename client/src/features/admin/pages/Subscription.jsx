import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Cards from "../components/Cards";
import {
  CreditCard,
  Crown,
  Sparkles,
  Zap,
  CheckCircle2,
  Check,
  X,
  TrendingUp,
  Store,
  ShieldCheck,
  Edit3,
  ChevronUp,
  Layers,
} from "lucide-react";
import bannerAdminSubscriptionImg from "../../../assets/banner-admin-subscription-3d.png";

// 3 Core Subscription Plans
const INITIAL_PLANS = [
  {
    id: "plan-starter",
    tierKey: "starter",
    name: "Starter Merchant",
    badge: "Basic Tier",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    description: "Ideal for new local shops, home businesses and boutique startups.",
    monthlyPrice: 999,
    annualPrice: 9590, // ~₹799/mo
    popular: false,
    colorTheme: "slate",
    accentBorder: "border-slate-200 hover:border-emerald-300",
    icon: Store,
    features: [
      "Up to 50 active product listings",
      "Standard merchant storefront profile",
      "Weekly scheduled bank payouts",
      "Basic order & sales analytics",
      "Standard email support (24-48h)",
    ],
    activeVendorsCount: 38,
  },
  {
    id: "plan-growth",
    tierKey: "growth",
    name: "Growth Pro",
    badge: "Most Popular • Best Value",
    badgeColor: "bg-emerald-500 text-white border-emerald-400 shadow-sm shadow-emerald-500/30",
    description: "Designed for established sellers scaling catalog, orders & revenue.",
    monthlyPrice: 2499,
    annualPrice: 23990,
    popular: true,
    colorTheme: "emerald",
    accentBorder: "border-emerald-500 ring-2 ring-emerald-500/20 shadow-xl shadow-emerald-600/10",
    icon: Zap,
    features: [
      "Up to 500 active product listings",
      "'Verified Merchant' trust badge",
      "24-Hour express settlement payouts",
      "Priority 24/7 in-app chat & ticket support",
    ],
    activeVendorsCount: 88,
  },
  {
    id: "plan-enterprise",
    tierKey: "enterprise",
    name: "Enterprise Platinum",
    badge: "Unlimited • VIP Partner",
    badgeColor: "bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-400 shadow-sm shadow-amber-500/30",
    description: "Built for top brands, large distributors & high-volume mega merchants.",
    monthlyPrice: 5999,
    annualPrice: 57590, 
    popular: false,
    colorTheme: "amber",
    accentBorder: "border-amber-300 hover:border-amber-500 hover:shadow-xl hover:shadow-amber-500/10",
    icon: Crown,
    features: [
      "Unlimited product listings & variants",
      "'Brand Partner' exclusive golden badge",
      "Instant same-day (24h) bank transfers",
 "Priority 24/7 in-app chat & ticket support", 
    ],
    activeVendorsCount: 16,
  },
];

export default function Subscription() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [plans, setPlans] = useState(INITIAL_PLANS);
  const [billingCycle, setBillingCycle] = useState("monthly"); // "monthly" | "annual"

  // Modals & Notifications
  const [editingPlan, setEditingPlan] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  // Edit Plan Form State
  const [editFormData, setEditFormData] = useState({
    name: "",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "",
  });

  // Scroll Parallax
  const scrollContainerRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const currentScroll = container.scrollTop;
      setScrollY(currentScroll);
      setShowScrollTop(currentScroll > 240);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3200);
  };

  // Handle Edit Plan
  const openEditPlan = (plan) => {
    setEditingPlan(plan);
    setEditFormData({
      name: plan.name,
      monthlyPrice: plan.monthlyPrice,
      annualPrice: plan.annualPrice,
      description: plan.description,
    });
  };

  const handleSavePlan = (e) => {
    e.preventDefault();
    if (!editingPlan) return;

    setPlans((prev) =>
      prev.map((p) => {
        if (p.id === editingPlan.id) {
          return {
            ...p,
            name: editFormData.name,
            monthlyPrice: Number(editFormData.monthlyPrice),
            annualPrice: Number(editFormData.annualPrice),
            description: editFormData.description,
          };
        }
        return p;
      })
    );

    setEditingPlan(null);
    showToast(`"${editFormData.name}" updated successfully.`);
  };

  // Top Metrics Calculation
  const totalSubscribers = plans.reduce((acc, p) => acc + p.activeVendorsCount, 0);
  const mrrValue =
    plans.reduce((acc, p) => acc + p.activeVendorsCount * p.monthlyPrice, 0) / 100000;
  const growthPlanShare = Math.round(
    ((plans.find((p) => p.tierKey === "growth")?.activeVendorsCount || 0) /
      (totalSubscribers || 1)) *
      100
  );

  const subscriptionStats = [
    {
      id: "active-subs",
      title: "Active Subscriptions",
      value: `${totalSubscribers} Vendors`,
      icon: CreditCard,
      iconColor: "text-white bg-gradient-to-tr from-[#049669] to-[#10B981] border-emerald-400/40 shadow-md shadow-emerald-600/25",
      bgGradient: "from-emerald-50/90 via-white/85 to-white/60",
      accentBorder: "border-emerald-200/80 hover:border-emerald-400 hover:shadow-[0_16px_36px_rgba(4,150,105,0.15)]",
      glowColor: "bg-emerald-400/25",
      valueColor: "text-[#049669]",
    },
    {
      id: "monthly-arr",
      title: "Monthly Sub Revenue (MRR)",
      value: `₹${mrrValue.toFixed(2)} Lakh`,
      icon: TrendingUp,
      iconColor: "text-white bg-gradient-to-tr from-teal-600 to-emerald-500 border-teal-400/40 shadow-md shadow-teal-600/25",
      bgGradient: "from-teal-50/90 via-white/85 to-white/60",
      accentBorder: "border-teal-200/80 hover:border-teal-400 hover:shadow-[0_16px_36px_rgba(13,148,136,0.15)]",
      glowColor: "bg-teal-400/25",
      valueColor: "text-[#1E1B4B]",
    },
    {
      id: "top-tier",
      title: "Growth Pro Adoption",
      value: `${growthPlanShare}% of Stores`,
      icon: Zap,
      iconColor: "text-white bg-gradient-to-tr from-[#059669] via-emerald-600 to-teal-600 border-emerald-400/40 shadow-md shadow-emerald-600/25",
      bgGradient: "from-emerald-50/70 via-white/85 to-white/60",
      accentBorder: "border-emerald-200/80 hover:border-emerald-400 hover:shadow-[0_16px_36px_rgba(4,150,105,0.15)]",
      glowColor: "bg-emerald-400/20",
      valueColor: "text-[#1E1B4B]",
    },
    {
      id: "retention-rate",
      title: "Renewal Retention Rate",
      value: "96.4%",
      icon: Crown,
      iconColor: "text-white bg-gradient-to-tr from-amber-500 to-amber-400 border-amber-300 shadow-md shadow-amber-500/25",
      bgGradient: "from-amber-50/90 via-white/85 to-white/60",
      accentBorder: "border-amber-200/80 hover:border-amber-400 hover:shadow-[0_16px_36px_rgba(245,158,11,0.15)]",
      glowColor: "bg-amber-400/25",
      valueColor: "text-[#1E1B4B]",
    },
  ];

  return (
    <div className="h-screen w-full flex flex-col bg-[#F4F9F5] text-slate-800 font-['Poppins',sans-serif] relative overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#1E1B4B] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500/30 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Background Ambient Glow Orbs */}
      <div
        style={{ transform: `translateY(${scrollY * 0.12}px)` }}
        className="pointer-events-none absolute -left-20 top-0 w-[450px] h-[450px] rounded-full bg-gradient-to-br from-emerald-400/15 to-teal-300/10 blur-3xl z-0 transition-transform duration-300 ease-out"
      />
      <div
        style={{ transform: `translateY(${scrollY * -0.08}px)` }}
        className="pointer-events-none absolute right-10 top-20 w-[420px] h-[420px] rounded-full bg-gradient-to-bl from-teal-400/15 to-emerald-300/10 blur-3xl z-0 transition-transform duration-300 ease-out"
      />
      <div
        style={{ transform: `translateY(${scrollY * 0.06}px)` }}
        className="pointer-events-none absolute left-1/3 bottom-10 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-emerald-300/15 to-teal-200/10 blur-3xl z-0 transition-transform duration-300 ease-out"
      />

      {/* Top Navbar */}
      <Navbar onToggleSidebar={() => setIsSidebarOpen(true)} />

      {/* Body Area */}
      <div className="flex-1 flex min-h-0 relative z-10 overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div
          ref={scrollContainerRef}
          className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto relative z-10 scroll-smooth [scrollbar-gutter:stable]"
        >
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 w-full mx-auto pb-16">
            {/* Super Admin Welcome Banner */}
            <div className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 min-h-[175px] sm:min-h-[190px] lg:min-h-[200px] flex flex-col justify-between overflow-hidden shadow-[0_16px_40px_rgba(4,150,105,0.22)] border border-emerald-400/30 group">
              {/* Background SVG Fluid Organic Waves */}
              <svg
                className="pointer-events-none absolute inset-0 w-full h-full object-cover"
                viewBox="0 0 1024 200"
                preserveAspectRatio="none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="subBannerBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1B744A" />
                    <stop offset="40%" stopColor="#228C52" />
                    <stop offset="100%" stopColor="#2CA85C" />
                  </linearGradient>
                  <linearGradient id="subWaveHighlight" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#38C260" stopOpacity="0.5" />
                    <stop offset="60%" stopColor="#259452" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="subWaveDeep" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#114E30" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#186740" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <rect width="1024" height="200" fill="url(#subBannerBgGrad)" />
                <path
                  d="M 0 200 C 240 185 380 130 620 160 C 800 182 920 150 1024 115 L 1024 200 Z"
                  fill="url(#subWaveDeep)"
                />
                <path
                  d="M 280 0 C 420 75 600 40 740 100 C 870 155 945 85 1024 40 L 1024 0 Z"
                  fill="url(#subWaveHighlight)"
                />
                <path
                  d="M 0 0 C 300 0 420 120 670 80 C 850 50 930 20 1024 0 Z"
                  fill="white"
                  fillOpacity="0.07"
                />
              </svg>

              {/* Specular glass reflection */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-200/60 to-transparent" />

              {/* Right 3D Artwork */}
              <div className="absolute right-3 sm:right-6 lg:right-10 top-1/2 -translate-y-1/2 h-[90%] sm:h-[94%] lg:h-[98%] w-auto max-w-[38%] sm:max-w-[42%] lg:max-w-[45%] pointer-events-none select-none z-10 hidden sm:flex items-center justify-end">
                <img
                  src={bannerAdminSubscriptionImg}
                  alt="Subscription Management 3D artwork"
                  className="h-full w-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.35)] group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="eager"
                />
              </div>

              {/* Banner Text Content */}
              <div className="relative z-10 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-semibold tracking-wide mb-2 sm:mb-3 shadow-sm">
                  <Crown className="w-3.5 h-3.5 text-amber-300" />
                  <span>MEMBERSHIP TIERS & REVENUE</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight drop-shadow-sm leading-tight">
                  Vendor Subscription Plans
                </h1>
                <p className="text-white/90 text-xs sm:text-sm font-medium mt-1.5 max-w-md leading-relaxed drop-shadow-xs">
                  Manage marketplace membership tiers, pricing models, and active store subscriptions.
                </p>
              </div>

              {/* Quick Status Pill */}
              <div className="relative z-10 pt-3 flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                  <span>3 Active Core Plans</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/15 backdrop-blur-md border border-white/20 text-white/95 text-xs font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Automated Tier Access & Renewal</span>
                </div>
              </div>
            </div>

            {/* 4 Cards Metrics Section */}
            <Cards stats={subscriptionStats} />

            {/* Three Plans Section with Monthly / Annual Switch */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/80 shadow-[0_8px_32px_0_rgba(16,185,129,0.06)] relative overflow-hidden">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />

              {/* Header with Title and Billing Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-emerald-100/60 mb-6 sm:mb-8">
                <div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                      Platform Membership Tiers
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
                    Click "Configure Plan" on any tier to customize plan details and subscription pricing.
                  </p>
                </div>

                {/* Billing Toggle Switch */}
                <div className="inline-flex items-center bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 self-start sm:self-auto shadow-inner">
                  <button
                    onClick={() => setBillingCycle("monthly")}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      billingCycle === "monthly"
                        ? "bg-white text-emerald-700 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Monthly Billing
                  </button>
                  <button
                    onClick={() => setBillingCycle("annual")}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      billingCycle === "annual"
                        ? "bg-white text-emerald-700 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <span>Annual Billing</span>
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-2xs">
                      SAVE 20%
                    </span>
                  </button>
                </div>
              </div>

              {/* 3 Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
                {plans.map((plan) => {
                  const Icon = plan.icon;
                  const currentPrice =
                    billingCycle === "annual"
                      ? Math.round(plan.annualPrice / 12)
                      : plan.monthlyPrice;
                  const totalCyclePrice =
                    billingCycle === "annual" ? plan.annualPrice : plan.monthlyPrice;

                  return (
                    <div
                      key={plan.id}
                      className={`relative rounded-3xl border bg-white p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${plan.accentBorder}`}
                    >
                      {/* Popular ribbon */}
                      {plan.popular && (
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black uppercase tracking-wider shadow-md shadow-emerald-600/30 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>MOST POPULAR</span>
                        </div>
                      )}

                      <div>
                        {/* Plan Header */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div>
                            <span
                              className={`inline-block px-2.5 py-1 rounded-lg text-xs font-extrabold border mb-2 ${plan.badgeColor}`}
                            >
                              {plan.badge}
                            </span>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">
                              {plan.name}
                            </h3>
                          </div>
                          <div
                            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                              plan.colorTheme === "emerald"
                                ? "bg-emerald-100 text-emerald-700"
                                : plan.colorTheme === "amber"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            <Icon className="w-5 h-5 stroke-[2.2]" />
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed mb-5 min-h-[36px]">
                          {plan.description}
                        </p>

                        {/* Price Tag */}
                        <div className="pb-5 mb-5 border-b border-slate-100">
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                              ₹{currentPrice.toLocaleString("en-IN")}
                            </span>
                            <span className="text-xs font-semibold text-slate-400">
                              / month
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 font-medium">
                            {billingCycle === "annual" ? (
                              <span>
                                Billed annually at{" "}
                                <strong className="text-slate-700">
                                  ₹{totalCyclePrice.toLocaleString("en-IN")}
                                </strong>
                                /yr (2 months free)
                              </span>
                            ) : (
                              <span>Billed monthly with cancel anytime flex</span>
                            )}
                          </p>
                        </div>

                        {/* Features Checklist */}
                        <div className="space-y-3 mb-6">
                          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                            Included Capabilities
                          </span>
                          <ul className="space-y-2.5">
                            {plan.features.map((featText, idx) => (
                              <li
                                key={idx}
                                className="text-xs flex items-start gap-2.5 text-slate-700 font-medium"
                              >
                                <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </div>
                                <span>{featText}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Card Bottom: Active Subscribers Count & Admin Edit Button */}
                      <div className="pt-4 border-t border-slate-100 space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                          <span>Subscribed Vendors:</span>
                          <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                            {plan.activeVendorsCount} Stores
                          </span>
                        </div>

                        <button
                          onClick={() => openEditPlan(plan)}
                          className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95 ${
                            plan.popular
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25"
                              : "bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300"
                          }`}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Configure {plan.name}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* MODAL: Edit Plan Settings */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-emerald-100 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    Configure {editingPlan.name}
                  </h3>
                  <span className="text-xs text-slate-500">
                    Adjust plan details and subscription price points
                  </span>
                </div>
              </div>
              <button
                onClick={() => setEditingPlan(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Plan Display Title
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Monthly Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editFormData.monthlyPrice}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        monthlyPrice: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Annual Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editFormData.annualPrice}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        annualPrice: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Plan Description
                </label>
                <textarea
                  rows={2}
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-md shadow-emerald-600/20 transition-all"
                >
                  Save Plan Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 w-11 h-11 rounded-2xl bg-emerald-600 text-white shadow-xl shadow-emerald-600/30 border border-emerald-400/40 flex items-center justify-center hover:bg-emerald-700 transition-all cursor-pointer z-40"
        >
          <ChevronUp className="w-5 h-5 stroke-[2.5]" />
        </button>
      )}
    </div>
  );
}
