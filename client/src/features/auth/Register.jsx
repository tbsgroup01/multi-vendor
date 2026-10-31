import React, { useState } from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";
import customerImage from "../../assets/multi.png";
import vendorImage from "../../assets/multi.png";

export default function Register() {
  const [role, setRole] = useState("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  const customerBenefits = [
    {
      icon: <Tag className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2]" />,
      title: "Best Deals",
      description: "Exclusive offers and discounts",
      color: "bg-rose-100 text-rose-600",
    },
    {
      icon: <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2]" />,
      title: "Multiple Categories",
      description: "Shop from 100+ categories",
      color: "bg-violet-100 text-violet-600",
    },
    {
      icon: <Star className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2] fill-amber-500" />,
      title: "Top Rated Sellers",
      description: "Trusted by millions",
      color: "bg-amber-100 text-amber-600",
    },
    {
      icon: <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2]" />,
      title: "Easy Returns",
      description: "Hassle-free return policy",
      color: "bg-emerald-100 text-emerald-600",
    },
  ];

  const vendorBenefits = [
    {
      icon: <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2]" />,
      title: "Wide Customer Reach",
      description: "Sell to millions of buyers",
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      icon: <Store className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2]" />,
      title: "Easy Store Management",
      description: "List and manage products easily",
      color: "bg-violet-100 text-violet-600",
    },
    {
      icon: <Megaphone className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2]" />,
      title: "Zero Technical Hassle",
      description: "Focus on your business, we handle the rest",
      color: "bg-amber-100 text-amber-600",
    },
    {
      icon: <IndianRupee className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2]" />,
      title: "Secure Payments",
      description: "Get timely and transparent payments",
      color: "bg-blue-100 text-blue-600",
    },
  ];

  const benefits = role === "customer" ? customerBenefits : vendorBenefits;

  return (
    <div className="h-[calc(100vh-72px)] w-full overflow-hidden bg-[#f4f8ff] font-sans text-slate-900 select-none">
      {submitted && (
        <div className="fixed top-6 right-6 z-50 flex items-center space-x-3 rounded-2xl bg-emerald-600 px-6 py-4 text-white shadow-2xl animate-bounce">
          <CheckCircle2 className="h-6 w-6 text-emerald-200" />
          <div>
            <p className="text-sm font-bold">Account Created Successfully!</p>
            <p className="text-xs text-emerald-100">
              Welcome to MarketPlace as a{" "}
              {role === "customer" ? "Customer" : "Vendor"}.
            </p>
          </div>
        </div>
      )}
      <main className="h-full w-full max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        <section className="relative hidden lg:flex h-full flex-col justify-between overflow-hidden bg-gradient-to-br from-white via-[#eff6ff] to-[#dce9ff] px-8 py-6 lg:px-10 xl:px-14">
          <div className="pointer-events-none absolute -right-20 top-40 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-0 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl" />
          <div className="relative z-10 shrink-0">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs sm:text-sm font-semibold text-blue-600">
              <Sparkles className="h-4 w-4" />
              {role === "customer" ? "Join Our Community" : "Sell with MarketPlace"}
            </div>
            <h1 className="max-w-xl text-3xl sm:text-4xl xl:text-[44px] font-extrabold leading-[1.14] tracking-tight text-slate-900">
              {role === "customer" ? (
                <>
                  Create Your
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Account.
                  </span>
                </>
              ) : (
                <>
                  Grow Your
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Business Online.
                  </span>
                </>
              )}
            </h1>
            <p className="mt-2.5 max-w-lg text-sm sm:text-base leading-relaxed text-slate-500">
              {role === "customer"
                ? "Start shopping or become a seller — your journey begins here."
                : "Join thousands of sellers and reach millions of customers across India."}
            </p>
            <div className="mt-4 sm:mt-5 space-y-2.5 sm:space-y-3">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex items-center gap-3.5">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${benefit.color}`}
                  >
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                      {benefit.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-snug">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Hero Illustration */}
          <div className="relative flex flex-1 items-end justify-center min-h-0 -translate-y-4 sm:-translate-y-6 w-full max-w-[560px] mx-auto">
            <div className="absolute bottom-2 h-20 w-4/5 rounded-[50%] bg-blue-300/30 blur-3xl pointer-events-none" />

            {/* Main Image with Smooth Drop-Shadow */}
            <img
              src={role === "customer" ? customerImage : vendorImage}
              alt={role === "customer" ? "Customer Registration" : "Vendor Registration"}
              className="relative z-10 max-h-[300px] sm:max-h-[340px] xl:max-h-[380px] w-auto max-w-full object-contain drop-shadow-2xl transition duration-500 hover:scale-[1.02]"
            />
          </div>
        </section>
        <section className="relative flex h-full items-center justify-center overflow-hidden px-6 py-4 sm:px-10 lg:px-8 xl:px-12">
          <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl" />
          <div
            className={`relative w-full rounded-[24px] border border-white/80 bg-white/95 p-5 sm:p-6 lg:p-7 shadow-[0_24px_80px_rgba(53,93,180,0.10)] transition-all max-h-[calc(100vh-92px)] overflow-y-auto [scrollbar-width:none] ${
              role === "vendor" ? "max-w-[700px]" : "max-w-[620px]"
            }`}
          >
            <div>
              <div className="mb-2.5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs sm:text-sm font-semibold text-blue-600">
                <User className="h-4 w-4" />
                {role === "customer" ? "Customer Registration" : "Vendor Registration"}
              </div>

              <h2 className="text-2xl sm:text-3xl xl:text-[34px] font-extrabold tracking-tight text-slate-900 leading-tight">
                Create an Account
              </h2>

              <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
                Join MarketPlace and start your journey today.
              </p>
            </div>
            <div className="mt-4 sm:mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100/80 p-1.5 border border-slate-200/60">
              <button
                type="button"
                onClick={() => setRole("customer")}
                className={`flex items-center justify-center gap-3 rounded-xl py-2.5 sm:py-3 px-4 font-bold text-sm transition-all duration-200 cursor-pointer ${
                  role === "customer"
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/25"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                <User className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.2]" />
                <div className="text-left leading-tight">
                  <span className="block text-xs sm:text-sm font-black">Customer</span>
                  <span
                    className={`text-[10px] sm:text-xs font-normal ${
                      role === "customer" ? "text-blue-100" : "text-slate-400"
                    }`}
                  >
                    Shop products
                  </span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setRole("vendor")}
                className={`flex items-center justify-center gap-3 rounded-xl py-2.5 sm:py-3 px-4 font-bold text-sm transition-all duration-200 cursor-pointer ${
                  role === "vendor"
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/25"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                <Store className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.2]" />
                <div className="text-left leading-tight">
                  <span className="block text-xs sm:text-sm font-black">Vendor</span>
                  <span
                    className={`text-[10px] sm:text-xs font-normal ${
                      role === "vendor" ? "text-blue-100" : "text-slate-400"
                    }`}
                  >
                    Sell your products
                  </span>
                </div>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 sm:mt-5 space-y-3 sm:space-y-3.5">
              {role === "customer" && (
                <>
                  <div>
                    <label className="mb-1.5 block text-xs sm:text-sm font-bold text-slate-800">
                      Full Name
                    </label>
                    <div className="group relative">
                      <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-600" />
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="h-[46px] sm:h-[50px] w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="mb-1.5 block text-xs sm:text-sm font-bold text-slate-800">
                        Email Address
                      </label>
                      <div className="group relative">
                        <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-600" />
                        <input
                          type="email"
                          name="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="h-[46px] sm:h-[50px] w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs sm:text-sm font-bold text-slate-800">
                        Phone Number
                      </label>
                      <div className="group relative">
                        <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-600" />
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Enter phone number"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="h-[46px] sm:h-[50px] w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="mb-1.5 block text-xs sm:text-sm font-bold text-slate-800">
                        Password
                      </label>
                      <div className="group relative">
                        <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-600" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Create password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="h-[46px] sm:h-[50px] w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-11 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blue-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs sm:text-sm font-bold text-slate-800">
                        Confirm Password
                      </label>
                      <div className="group relative">
                        <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-600" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          placeholder="Confirm password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          className="h-[46px] sm:h-[50px] w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-11 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blue-600 cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {role === "vendor" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-800">
                        Business Name <span className="text-red-500">*</span>
                      </label>
                      <div className="group relative">
                        <Building2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-600" />
                        <input
                          type="text"
                          name="businessName"
                          placeholder="Business name"
                          value={formData.businessName}
                          onChange={handleChange}
                          required={role === "vendor"}
                          className="h-[44px] w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-3 text-xs sm:text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-800">
                        Store Name <span className="text-red-500">*</span>
                      </label>
                      <div className="group relative">
                        <Store className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-600" />
                        <input
                          type="text"
                          name="storeName"
                          placeholder="Store name (public)"
                          value={formData.storeName}
                          onChange={handleChange}
                          required={role === "vendor"}
                          className="h-[44px] w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-3 text-xs sm:text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* GST & Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-800">
                        GST Number <span className="text-red-500">*</span>
                      </label>
                      <div className="group relative">
                        <FileText className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-600" />
                        <input
                          type="text"
                          name="gstNumber"
                          placeholder="GST number"
                          value={formData.gstNumber}
                          onChange={handleChange}
                          required={role === "vendor"}
                          className="h-[44px] w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-3 text-xs sm:text-sm text-slate-800 uppercase outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-800">
                        Primary Category <span className="text-red-500">*</span>
                      </label>
                      <div className="group relative">
                        <Grid className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-600 pointer-events-none" />
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          required={role === "vendor"}
                          className="h-[44px] w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-11 pr-9 text-xs sm:text-sm text-slate-800 outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 cursor-pointer"
                        >
                          <option value="">Select category</option>
                          <option value="electronics">Electronics & Gadgets</option>
                          <option value="fashion">Fashion & Apparel</option>
                          <option value="home">Home & Kitchen</option>
                          <option value="beauty">Beauty & Personal Care</option>
                          <option value="grocery">Grocery & Essentials</option>
                        </select>
                        <ChevronDown className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Owner Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-800">
                        Owner Name <span className="text-red-500">*</span>
                      </label>
                      <div className="group relative">
                        <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-600" />
                        <input
                          type="text"
                          name="fullName"
                          placeholder="Owner full name"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          className="h-[44px] w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-3 text-xs sm:text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-800">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="group relative">
                        <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-600" />
                        <input
                          type="email"
                          name="email"
                          placeholder="Owner email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="h-[44px] w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-3 text-xs sm:text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone & Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-800">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <div className="group relative">
                        <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-600" />
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Phone number"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="h-[44px] w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-3 text-xs sm:text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-800">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="group relative">
                        <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-600" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="h-[44px] w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-10 text-xs sm:text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blue-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-800">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="group relative">
                      <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-600" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="h-[44px] w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-10 text-xs sm:text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blue-600 cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Terms Checkbox */}
              <div className="flex items-center gap-2.5 pt-1.5">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  required
                  className="h-4 w-4 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                />
                <label
                  htmlFor="agreeTerms"
                  className="text-xs sm:text-sm font-medium text-slate-600 cursor-pointer select-none"
                >
                  I agree to the{" "}
                  <a
                    href="#terms"
                    onClick={(e) => e.preventDefault()}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#privacy"
                    onClick={(e) => e.preventDefault()}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="flex h-[48px] sm:h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-base font-bold text-white shadow-lg shadow-blue-500/20 transition duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-600 hover:shadow-xl hover:shadow-blue-500/25 focus:outline-none focus:ring-4 focus:ring-blue-500/20 cursor-pointer mt-3"
              >
                {role === "customer" ? "Create Account" : "Create Vendor Account"}
                <span className="text-lg">→</span>
              </button>
            </form>

            {/* Sign In Link */}
            <p className="text-center text-xs sm:text-sm text-slate-500 mt-4 font-medium">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-blue-600 hover:text-indigo-700 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
