
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
      setError("Login API is not connected yet.");
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" className="h-6 w-6">
          <path d="M3 7h11v11H3zM14 11h4l3 4v3h-7" />
          <circle cx="7.5" cy="19" r="2" />
          <circle cx="18" cy="19" r="2" />
          <path d="M3 10h8" />
        </svg>
      ),
      title: "Fast & Reliable Delivery",
      description: "Track your orders and get them on time.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" className="h-6 w-6">
          <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
      title: "Secure Payments",
      description: "Safe and secure checkout experience.",
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" className="h-6 w-6">
          <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
        </svg>
      ),
      title: "Wide Product Range",
      description: "Discover products from trusted sellers.",
      color: "bg-violet-100 text-violet-600",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" className="h-6 w-6">
          <path d="M3 13v-2a9 9 0 0 1 18 0v2" />
          <path d="M3 13h3v6H5a2 2 0 0 1-2-2v-4Zm18 0h-3v6h1a2 2 0 0 0 2-2v-4Z" />
          <path d="M18 19c-1 2-3 2-6 2" />
        </svg>
      ),
      title: "Customer Support",
      description: "We're here to help whenever you need us.",
      color: "bg-orange-100 text-orange-500",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-72px)] overflow-y-auto bg-[#f4f8ff] font-sans text-slate-900">
   

      {/* Main Layout */}
      <main className="mx-auto grid min-h-[calc(100vh-72px)] max-w-[1800px] lg:grid-cols-2">
        {/* Left Hero Section */}
        <section className="relative flex h-full flex-col justify-center overflow-hidden bg-gradient-to-br from-white via-[#eff6ff] to-[#dce9ff] px-6 py-6 sm:px-10 lg:px-10 xl:px-14">
          {/* Background decoration */}
          <div className="pointer-events-none absolute -right-20 top-44 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-0 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl" />

          <div className="relative z-10">
            <h1 className="max-w-xl text-3xl font-extrabold leading-[1.14] tracking-tight text-slate-900 sm:text-4xl xl:text-[46px]">
              Shop Smarter,
              <br />
              <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                Every Day.
              </span>
            </h1>

            <p className="mt-2.5 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
              Discover amazing products, unbeatable prices,
              and trusted sellers — all in one place.
            </p>

            {/* Benefits */}
            <div className="mt-4 space-y-2.5 sm:space-y-3">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="flex items-center gap-3.5"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${benefit.color}`}
                  >
                    {benefit.icon}
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-800 sm:text-sm">
                      {benefit.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 sm:text-xs">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Image - Positioned right below benefits without large gap */}
          <div className="relative mt-4 sm:mt-5 flex items-center justify-center">
            <div className="absolute bottom-2 h-20 w-4/5 rounded-[50%] bg-blue-300/30 blur-2xl" />

            <img
              src={Img}
              alt="MarketPlace shopping collection with shopping bag, laptop, camera, shoes, phone and plant"
              className="relative z-10 max-h-[290px] sm:max-h-[330px] xl:max-h-[360px] w-auto max-w-full object-contain drop-shadow-xl"
            />
          </div>

      
        </section>

        {/* Right Login Section */}
        <section className="relative flex items-center justify-center overflow-hidden px-5 py-6 sm:px-10 lg:px-8 xl:px-12">
          <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />

          <div className="relative w-full max-w-[650px] rounded-[24px] border border-white/80 bg-white/95 p-6 shadow-[0_24px_80px_rgba(53,93,180,0.10)] sm:p-9 lg:p-8 xl:p-10">
            {/* Heading */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M18 8h-1V6a5 5 0 0 0-10 0v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2ZM9 6a3 3 0 0 1 6 0v2H9Zm4 10.7V19h-2v-2.3a2 2 0 1 1 2 0Z" />
                </svg>
                Welcome Back
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Sign in to your account
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
                Access your account and continue shopping with MarketPlace.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {/* Email or Phone */}
              <div>
                <label
                  htmlFor="emailOrPhone"
                  className="mb-2.5 block text-sm font-bold text-slate-800"
                >
                  Email or Phone Number
                </label>

                <div className="group relative">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-600"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>

                  <input
                    id="emailOrPhone"
                    name="emailOrPhone"
                    type="text"
                    autoComplete="username"
                    placeholder="Enter your email or phone number"
                    value={formData.emailOrPhone}
                    onChange={handleChange}
                    required
                    className="h-[54px] w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2.5 flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="text-sm font-bold text-slate-800"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-sm font-semibold text-blue-600 transition hover:text-indigo-700"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="group relative">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-600"
                  >
                    <rect x="4" y="10" width="16" height="11" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                    <circle cx="12" cy="15" r="1" />
                  </svg>

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="h-[54px] w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blue-600"
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="1.8" className="h-5 w-5">
                        <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                        <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5.5 0 9 7 9 7a16 16 0 0 1-3.1 3.8M6.2 6.2C4.1 7.7 3 10 3 12c0 0 3.5 7 9 7 1.1 0 2.1-.3 3-.7" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="1.8" className="h-5 w-5">
                        <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              {/* Error Message */}
              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                  {error}
                </p>
              )}

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-base font-bold text-white shadow-lg shadow-blue-500/20 transition duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-600 hover:shadow-xl hover:shadow-blue-500/25 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
                {!loading && <span className="text-lg">→</span>}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />

              <p className="whitespace-nowrap text-xs text-slate-500 sm:text-sm">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-blue-600 hover:text-indigo-700"
                >
                  Sign Up
                </Link>
              </p>

              <div className="h-px flex-1 bg-slate-200" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
