import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Truck,
  ShieldCheck,
  Sparkles,
  Headphones,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import Img from "../../assets/multi.png";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await authService.login(formData);
      if (res?.user?.role === "vendor") {
        navigate("/vendor");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Unable to sign in. Please try again.");
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
    <div className="min-h-[calc(100vh-72px)] w-full bg-[#F7FAF8] font-['Poppins',sans-serif] text-slate-800 flex items-center justify-center p-3 sm:p-6 lg:p-8 relative overflow-x-hidden">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -left-20 top-10 w-96 h-96 rounded-full bg-emerald-300/15 blur-3xl z-0" />
      <div className="pointer-events-none absolute -right-20 bottom-10 w-96 h-96 rounded-full bg-orange-300/15 blur-3xl z-0" />

      {/* Main Container Card */}
      <main className="relative z-10 w-full max-w-5xl bg-white/95 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Hero Section (Desktop & Tablet) */}
        <section className="lg:col-span-5 bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-emerald-100/30 p-6 sm:p-8 xl:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-emerald-200/60 shadow-2xs text-xs font-bold text-emerald-800 mb-4">
              <ShoppingBag className="w-3.5 h-3.5 text-[#059669]" />
              <span>ShopMart Shopping</span>
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

        {/* Right Form Section */}
        <section className="lg:col-span-7 p-6 sm:p-8 xl:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-xs font-bold mb-2">
                <Lock className="w-3 h-3 text-[#059669]" />
                <span>Secure Sign In</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Welcome Back
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Enter your credentials to access your orders and saved wishlist.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Email / Phone Field */}
              <div>
                <label
                  htmlFor="emailOrPhone"
                  className="block text-xs font-bold text-slate-700 mb-1.5"
                >
                  Email or Phone Number
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    id="emailOrPhone"
                    name="emailOrPhone"
                    type="text"
                    autoComplete="username"
                    placeholder="Enter your email or phone number"
                    value={formData.emailOrPhone}
                    onChange={handleChange}
                    required
                    className="w-full h-11 sm:h-12 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#059669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="text-xs font-bold text-slate-700"
                  >
                    Password
                  </label>
                  <Link
                    to="/login"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Please contact support to reset your password.");
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
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full h-11 sm:h-12 pl-10 pr-11 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#059669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-700"
                >
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 sm:h-12 rounded-xl bg-gradient-to-r from-[#059669] to-[#10B981] hover:from-[#047857] hover:to-[#059669] text-white font-bold text-sm shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign In"}
                {!loading && <ArrowRight className="w-4 h-4 stroke-[2.5]" />}
              </button>
            </form>

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
