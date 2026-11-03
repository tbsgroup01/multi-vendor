import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services";
import {
  Store,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Tag,
  ShoppingCart,
  Star,
  ShieldCheck,
  TrendingUp,
  Megaphone,
  IndianRupee,
  Building2,
  FileText,
  Grid,
  ChevronDown,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import customerImage from "../../assets/multi.png";
import vendorImage from "../../assets/multi.png";

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    storeName: "",
    gstNumber: "",
    category: "",
    agreeTerms: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!/^\d{10}$/.test(formData.phone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please verify your password.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      if (role === "customer") {
        const res = await authService.registerCustomer({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        });

        setSuccessMsg(res?.message || "Account created successfully! Redirecting...");
        setSubmitted(true);
        setTimeout(() => {
          navigate("/");
        }, 800);
      } else {
        const res = await authService.registerVendor({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          businessName: formData.businessName,
          storeName: formData.storeName,
          gstNumber: formData.gstNumber,
          category: formData.category,
        });

        setSuccessMsg(res?.message || "Vendor account created successfully! Redirecting to Vendor Panel...");
        setSubmitted(true);
        setTimeout(() => {
          navigate("/vendor");
        }, 800);
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please check your information.");
    } finally {
      setLoading(false);
    }
  };

  const customerBenefits = [
    {
      icon: <Tag className="h-4 w-4 sm:h-5 sm:w-5" />,
      title: "Best Daily Deals",
      description: "Exclusive member discounts & savings",
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      icon: <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />,
      title: "100+ Categories",
      description: "Groceries, tech, fresh foods & fashion",
      color: "bg-teal-100 text-teal-700",
    },
    {
      icon: <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-amber-500 text-amber-500" />,
      title: "Verified Sellers",
      description: "Trusted local merchants & top ratings",
      color: "bg-amber-100 text-amber-700",
    },
    {
      icon: <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />,
      title: "Instant Support & Returns",
      description: "Hassle-free guarantee on all orders",
      color: "bg-orange-100 text-orange-600",
    },
  ];

  const vendorBenefits = [
    {
      icon: <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />,
      title: "High Customer Reach",
      description: "Sell to thousands of hyper-local buyers",
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      icon: <Store className="h-4 w-4 sm:h-5 sm:w-5" />,
      title: "Simple Store Management",
      description: "List products & track sales with ease",
      color: "bg-teal-100 text-teal-700",
    },
    {
      icon: <Megaphone className="h-4 w-4 sm:h-5 sm:w-5" />,
      title: "Zero Setup Fee",
      description: "Start selling immediately with 0 upfront cost",
      color: "bg-amber-100 text-amber-700",
    },
    {
      icon: <IndianRupee className="h-4 w-4 sm:h-5 sm:w-5" />,
      title: "Fast Payouts",
      description: "Direct bank settlements within 24-48 hours",
      color: "bg-orange-100 text-orange-600",
    },
  ];

  const benefits = role === "customer" ? customerBenefits : vendorBenefits;

  return (
    <div className="min-h-[calc(100vh-72px)] w-full bg-[#F7FAF8] font-['Poppins',sans-serif] text-slate-800 flex items-center justify-center p-3 sm:p-6 lg:p-8 relative overflow-x-hidden">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -left-20 top-10 w-96 h-96 rounded-full bg-emerald-300/15 blur-3xl z-0" />
      <div className="pointer-events-none absolute -right-20 bottom-10 w-96 h-96 rounded-full bg-orange-300/15 blur-3xl z-0" />

      {/* Floating Success Notification */}
      {submitted && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-[#059669] px-5 py-3.5 text-white shadow-2xl animate-bounce">
          <CheckCircle2 className="h-5 w-5 text-emerald-200 shrink-0" />
          <div>
            <p className="text-xs sm:text-sm font-bold">
              {role === "customer" ? "Account Created Successfully!" : "Vendor Registered Successfully!"}
            </p>
            <p className="text-[11px] text-emerald-100">
              {successMsg || `Welcome to ShopMart as a ${role === "customer" ? "Customer" : "Vendor"}.`}
            </p>
          </div>
        </div>
      )}

      {/* Main Container Card */}
      <main className="relative z-10 w-full max-w-5xl bg-white/95 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Hero Column */}
        <section className="lg:col-span-5 bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-emerald-100/30 p-6 sm:p-8 xl:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-emerald-200/60 shadow-2xs text-xs font-bold text-emerald-800 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
              <span>{role === "customer" ? "Join ShopMart" : "Sell on ShopMart"}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl xl:text-4xl font-black text-slate-900 tracking-tight leading-snug">
              {role === "customer" ? (
                <>
                  Join the Future of <br />
                  <span className="bg-gradient-to-r from-[#059669] to-[#10B981] bg-clip-text text-transparent">
                    Smart Shopping.
                  </span>
                </>
              ) : (
                <>
                  Grow Your Store <br />
                  <span className="bg-gradient-to-r from-[#059669] to-[#10B981] bg-clip-text text-transparent">
                    Reach Millions.
                  </span>
                </>
              )}
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {role === "customer"
                ? "Sign up in 30 seconds to unlock exclusive flash sales, express delivery, and rewards."
                : "Create your merchant profile, list your inventory, and scale your local retail business."}
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

          {/* Product / Merchant Illustration */}
          <div className="mt-6 flex items-center justify-center">
            <img
              src={role === "customer" ? customerImage : vendorImage}
              alt="ShopMart Registration"
              className="max-h-[170px] sm:max-h-[210px] lg:max-h-[230px] w-auto object-contain drop-shadow-lg"
            />
          </div>
        </section>

        {/* Right Form Column */}
        <section className="lg:col-span-7 p-5 sm:p-8 xl:p-10 flex flex-col justify-center">
          <div className="w-full max-w-lg mx-auto">
            {/* Header */}
            <div className="mb-4 sm:mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-xs font-bold mb-2">
                <User className="w-3 h-3 text-[#059669]" />
                <span>
                  {role === "customer" ? "Customer Sign Up" : "Vendor Partner Registration"}
                </span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Get Started Now
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Choose your account role and fill in your details.
              </p>
            </div>

            {/* Role Switcher Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-5 border border-slate-200/60">
              <button
                type="button"
                onClick={() => { setRole("customer"); setError(""); }}
                className={`flex items-center justify-center gap-2 py-2 sm:py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  role === "customer"
                    ? "bg-[#059669] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                <User className="w-4 h-4" />
                <span>Customer</span>
              </button>
              <button
                type="button"
                onClick={() => { setRole("vendor"); setError(""); }}
                className={`flex items-center justify-center gap-2 py-2 sm:py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  role === "vendor"
                    ? "bg-[#059669] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Vendor / Seller</span>
              </button>
            </div>

            {/* Error Notification */}
            {error && (
              <div
                role="alert"
                className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-700"
              >
                {error}
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
              {role === "customer" ? (
                <>
                  {/* Customer: Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#059669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                          type="email"
                          name="email"
                          placeholder="name@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#059669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                          type="tel"
                          name="phone"
                          placeholder="10-digit mobile"
                          value={formData.phone}
                          maxLength={10}
                          onChange={handleChange}
                          required
                          className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#059669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password & Confirm */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Min 6 characters"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#059669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          placeholder="Re-type password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#059669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Vendor: Business & Store Names */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Business Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                          type="text"
                          name="businessName"
                          placeholder="Registered company name"
                          value={formData.businessName}
                          onChange={handleChange}
                          required={role === "vendor"}
                          className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#059669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Public Store Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                          type="text"
                          name="storeName"
                          placeholder="Store name on website"
                          value={formData.storeName}
                          onChange={handleChange}
                          required={role === "vendor"}
                          className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#059669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* GST Number & Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        GST Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                          type="text"
                          name="gstNumber"
                          placeholder="15-digit GSTIN"
                          value={formData.gstNumber}
                          onChange={handleChange}
                          required={role === "vendor"}
                          className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-800 uppercase placeholder:text-slate-400 focus:bg-white focus:border-[#059669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Primary Category <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Grid className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          required={role === "vendor"}
                          className="w-full h-11 pl-10 pr-8 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-[#059669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition appearance-none cursor-pointer"
                        >
                          <option value="">Select Category</option>
                          <option value="Electronics">Electronics & Tech</option>
                          <option value="Fashion">Fashion & Apparel</option>
                          <option value="Groceries">Daily Groceries</option>
                          <option value="Home & Kitchen">Home & Kitchen</option>
                          <option value="Beauty">Beauty & Cosmetics</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Owner Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Owner Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                          type="text"
                          name="fullName"
                          placeholder="Authorized person name"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#059669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Owner Email <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                          type="email"
                          name="email"
                          placeholder="business@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#059669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone & Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                          type="tel"
                          name="phone"
                          placeholder="10-digit mobile"
                          maxLength={10}
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#059669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Password <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Min 6 characters"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#059669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Confirm Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Re-type password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#059669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Terms and Policies */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  required
                  className="mt-0.5 h-4 w-4 rounded-md border-slate-300 text-[#059669] focus:ring-emerald-500 cursor-pointer accent-[#059669]"
                />
                <label
                  htmlFor="agreeTerms"
                  className="text-xs text-slate-600 leading-snug cursor-pointer select-none"
                >
                  I agree to ShopMart's{" "}
                  <Link
                    to="/terms"
                    className="font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
                  >
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 sm:h-12 mt-2 rounded-xl bg-gradient-to-r from-[#059669] to-[#10B981] hover:from-[#047857] hover:to-[#059669] text-white font-bold text-sm shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>
                  {loading
                    ? "Creating Account..."
                    : role === "customer"
                    ? "Create Account"
                    : "Register Store & Start Selling"}
                </span>
                {!loading && <ArrowRight className="w-4 h-4 stroke-[2.5]" />}
              </button>
            </form>

            {/* Switch to Login */}
            <div className="mt-5 pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                Already registered?{" "}
                <Link
                  to="/login"
                  className="font-bold text-emerald-700 hover:text-emerald-800 transition ml-1"
                >
                  Sign In Here &rarr;
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
