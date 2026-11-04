import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services";
import { getRoleRedirectPath } from "./RoleMiddleware";
import {
  User,
  Store,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Truck,
  ShieldCheck,
  Sparkles,
  Headphones,
  ArrowRight,
  ShoppingBag,
  RotateCw,
  KeyRound,
  CheckCircle2,
  Shield,
  AlertCircle,
} from "lucide-react";
import Img from "../../assets/multi.png";

export default function Login() {
  const navigate = useNavigate();

  // Active Login Role Tab: "customer" (OTP) | "staff" (Vendor/Admin Password)
  const [activeTab, setActiveTab] = useState("customer");

  // Customer OTP Login States
  const [customerIdentifier, setCustomerIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [devOtpHint, setDevOtpHint] = useState("");

  // Vendor / Admin Password Login States
  const [passwordFormData, setPasswordFormData] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Common UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // OTP Resend Countdown Timer
  useEffect(() => {
    let timer;
    if (otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpCountdown]);

  // Tab switch handler
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setError("");
    setSuccessMsg("");
    setDevOtpHint("");
  };

  // 1. Send OTP for Customer
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const trimmed = customerIdentifier.trim();
    if (!trimmed) {
      setError("Please enter your registered mobile number.");
      return;
    }

    if (!trimmed.includes("@") && !/^\d{10}$/.test(trimmed.replace(/\D/g, ""))) {
      setError("Please enter a valid 10-digit registered mobile number.");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.sendCustomerLoginOtp({ identifier: trimmed });
      setOtpSent(true);
      setOtpCountdown(30);
      setSuccessMsg(res?.message || "OTP sent successfully!");
      if (res?.devOtp) {
        setDevOtpHint(res.devOtp);
      }
    } catch (err) {
      setError(err.message || "This mobile number is not registered with ShopMart.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify OTP & Log In Customer
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!otp || otp.trim().length < 4) {
      setError("Please enter the verification OTP code.");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.verifyCustomerLoginOtp({
        identifier: customerIdentifier.trim(),
        otp: otp.trim(),
      });

      setSuccessMsg("Logged in successfully! Redirecting...");
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 600);
    } catch (err) {
      setError(err.message || "Invalid or expired OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Vendor / Admin Password Login
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!passwordFormData.emailOrPhone.trim() || !passwordFormData.password) {
      setError("Please enter your email/phone and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.login({
        emailOrPhone: passwordFormData.emailOrPhone.trim(),
        password: passwordFormData.password,
      });

      const role = res?.user?.role;
      const targetPath = getRoleRedirectPath(role);

      setSuccessMsg(`Welcome back, ${res?.user?.name || "User"}! Redirecting...`);
      setTimeout(() => {
        navigate(targetPath, { replace: true });
      }, 600);
    } catch (err) {
      setError(err.message || "Unable to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      icon: <Truck className="h-5 w-5" />,
      title: "Fast & Reliable Delivery",
      description: "Track orders in real time and get items promptly.",
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      title: "100% Secure Checkout",
      description: "Encrypted transactions and fraud protection.",
      color: "bg-teal-100 text-teal-700",
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: "Wide Product Range",
      description: "Over 30,000+ items from verified local sellers.",
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: <Headphones className="h-5 w-5" />,
      title: "24/7 Dedicated Support",
      description: "We are always ready to assist your shopping.",
      color: "bg-emerald-100 text-[#059669]",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#F7FAF8] font-['Poppins',sans-serif] text-slate-800 flex items-center justify-center p-3 sm:p-6 lg:p-8 relative overflow-x-hidden">
      <div className="pointer-events-none absolute -left-20 top-10 w-96 h-96 rounded-full bg-emerald-300/15 blur-3xl z-0" />
      <div className="pointer-events-none absolute -right-20 bottom-10 w-96 h-96 rounded-full bg-orange-300/15 blur-3xl z-0" />

      <main className="relative z-10 w-full max-w-5xl bg-white/95 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Branding Column */}
        <section className="lg:col-span-5 bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-emerald-100/30 p-6 sm:p-8 xl:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-emerald-200/60 shadow-2xs text-xs font-bold text-emerald-800 mb-4">
              <ShoppingBag className="w-3.5 h-3.5 text-[#059669]" />
              <span>ShopMart Marketplace</span>
            </div>

            <h1 className="text-2xl sm:text-3xl xl:text-4xl font-black text-slate-900 tracking-tight leading-snug">
              Shop Smarter, <br />
              <span className="bg-gradient-to-r from-[#059669] to-[#10B981] bg-clip-text text-transparent">
                Every Single Day.
              </span>
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Discover amazing products at unbeatable prices from verified neighborhood merchants.
            </p>

            {/* Benefits List */}
            <div className="mt-6 space-y-3 hidden sm:block">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${benefit.color}`}
                  >
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">
                      {benefit.title}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Illustration */}
          <div className="mt-6 flex items-center justify-center">
            <img
              src={Img}
              alt="ShopMart Shopping Collection"
              className="max-h-[180px] sm:max-h-[220px] lg:max-h-[240px] w-auto object-contain drop-shadow-lg"
            />
          </div>
        </section>

        {/* Right Authentication Form Column */}
        <section className="lg:col-span-7 p-6 sm:p-8 xl:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            {/* Header */}
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-xs font-bold mb-2">
                <Lock className="w-3 h-3 text-[#059669]" />
                <span>Account Access</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Welcome Back
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Choose your login method to access your account.
              </p>
            </div>

            {/* Role / Method Switch Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100/90 rounded-2xl mb-6 border border-slate-200/70">
              <button
                type="button"
                onClick={() => handleTabSwitch("customer")}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "customer"
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <User className="w-4 h-4" />
                <span>Customer (OTP)</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabSwitch("staff")}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "staff"
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Vendor / Admin</span>
              </button>
            </div>

            {/* Error & Success Messages */}
            {error && (
              <div
                role="alert"
                className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 sm:p-3.5 text-xs text-rose-800 space-y-1.5 animate-in fade-in duration-200"
              >
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold text-rose-900 leading-snug">{error}</p>
                    {(error.toLowerCase().includes("not registered") ||
                      error.toLowerCase().includes("account") ||
                      error.toLowerCase().includes("mobile")) && (
                      <Link
                        to="/register"
                        className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-900 mt-1.5 underline"
                      >
                        <span>Create a new customer account with this number &rarr;</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}

            {successMsg && (
              <div
                role="status"
                className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-700 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* FLOW 1: CUSTOMER OTP LOGIN */}
            {activeTab === "customer" && (
              <div>
                {!otpSent ? (
                  /* Step 1: Request OTP */
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label
                        htmlFor="customerIdentifier"
                        className="block text-xs font-bold text-slate-700 mb-1.5"
                      >
                        Registered Mobile Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                          id="customerIdentifier"
                          name="customerIdentifier"
                          type="tel"
                          maxLength={10}
                          placeholder="Enter your 10-digit registered mobile number"
                          value={customerIdentifier}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                            setCustomerIdentifier(val);
                            if (error) setError("");
                          }}
                          required
                          autoFocus
                          className="w-full h-11 sm:h-12 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#059669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1.5 font-medium">
                        Enter the phone number you registered your account with.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-11 sm:h-12 rounded-xl bg-gradient-to-r from-[#059669] to-[#10B981] hover:from-[#047857] hover:to-[#059669] text-white font-bold text-sm shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <RotateCw className="w-4 h-4 animate-spin" />
                          <span>Sending OTP...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Login OTP</span>
                          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* Step 2: Verify OTP */
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-500 block">OTP sent to:</span>
                        <strong className="text-slate-900 font-bold">{customerIdentifier}</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false);
                          setOtp("");
                          setDevOtpHint("");
                        }}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
                      >
                        Change
                      </button>
                    </div>

                    <div>
                      <label
                        htmlFor="otpCode"
                        className="block text-xs font-bold text-slate-700 mb-1.5"
                      >
                        Enter 6-Digit Verification Code
                      </label>
                      <div className="relative">
                        <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                          id="otpCode"
                          name="otp"
                          type="text"
                          maxLength={6}
                          placeholder="• • • • • •"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          required
                          autoFocus
                          className="w-full h-12 pl-10 pr-4 text-center tracking-[0.5em] font-mono text-lg font-black rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-[#059669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                        />
                      </div>

                      {devOtpHint && (
                        <div className="mt-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-center justify-between">
                          <span>Demo/Test OTP Code: <strong>{devOtpHint}</strong></span>
                          <button
                            type="button"
                            onClick={() => setOtp(devOtpHint)}
                            className="font-bold underline text-amber-900 cursor-pointer"
                          >
                            Auto-fill
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-11 sm:h-12 rounded-xl bg-gradient-to-r from-[#059669] to-[#10B981] hover:from-[#047857] hover:to-[#059669] text-white font-bold text-sm shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <RotateCw className="w-4 h-4 animate-spin" />
                          <span>Verifying Code...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify & Sign In</span>
                          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-center pt-2 text-xs text-slate-500">
                      {otpCountdown > 0 ? (
                        <span>Resend OTP in <strong className="text-emerald-700">{otpCountdown}s</strong></span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={loading}
                          className="font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer flex items-center gap-1"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                          <span>Resend OTP Code</span>
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* FLOW 2: VENDOR & ADMIN PASSWORD LOGIN */}
            {activeTab === "staff" && (
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div>
                  <label
                    htmlFor="emailOrPhone"
                    className="block text-xs font-bold text-slate-700 mb-1.5"
                  >
                    Email or Mobile Number
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      id="emailOrPhone"
                      name="emailOrPhone"
                      type="text"
                      autoComplete="username"
                      placeholder="Enter registered email or mobile"
                      value={passwordFormData.emailOrPhone}
                      onChange={(e) =>
                        setPasswordFormData({ ...passwordFormData, emailOrPhone: e.target.value })
                      }
                      required
                      autoFocus
                      className="w-full h-11 sm:h-12 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#059669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="password"
                      className="text-xs font-bold text-slate-700"
                    >
                      Account Password
                    </label>
                    <Link
                      to="/login"
                      onClick={(e) => {
                        e.preventDefault();
                        alert("For password reset, please contact the Super Administrator or support.");
                      }}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={passwordFormData.password}
                      onChange={(e) =>
                        setPasswordFormData({ ...passwordFormData, password: e.target.value })
                      }
                      required
                      className="w-full h-11 sm:h-12 pl-10 pr-11 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#059669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 sm:h-12 rounded-xl bg-gradient-to-r from-[#059669] to-[#10B981] hover:from-[#047857] hover:to-[#059669] text-white font-bold text-sm shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In with Password</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Switch to Register */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-emerald-700 hover:text-emerald-800 transition ml-1"
                >
                  Create an Account &rarr;
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
