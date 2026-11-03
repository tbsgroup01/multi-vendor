import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  Headphones,
  ChevronRight,
  Mail,
  Check,
} from "lucide-react";
import logo from "../../../assets/logo.png";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 3000);
  };

  const socialLinks = [
    {
      id: "facebook",
      label: "Facebook",
      href: "https://facebook.com",
      icon: (
        <span className="font-bold text-[19px] text-[#1877F2] select-none leading-none">
          f
        </span>
      ),
    },
    {
      id: "instagram",
      label: "Instagram",
      href: "https://instagram.com",
      icon: (
        <span className="w-[18px] h-[18px] rounded-[5px] border-[2px] border-[#E4405F] flex items-center justify-center relative select-none">
          <span className="w-2 h-2 rounded-full border-[1.5px] border-[#E4405F]"></span>
          <span className="absolute top-[1.5px] right-[1.5px] w-[2px] h-[2px] rounded-full bg-[#E4405F]"></span>
        </span>
      ),
    },
    {
      id: "youtube",
      label: "YouTube",
      href: "https://youtube.com",
      icon: (
        <span className="w-[19px] h-[14px] rounded-[3.5px] bg-[#FF0000] flex items-center justify-center select-none shadow-sm">
          <span className="w-0 h-0 border-t-[3.5px] border-t-transparent border-b-[3.5px] border-b-transparent border-l-[6px] border-l-white ml-0.5"></span>
        </span>
      ),
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: "https://linkedin.com",
      icon: (
        <span className="font-bold text-[17px] text-[#0A66C2] select-none leading-none tracking-tight">
          in
        </span>
      ),
    },
    {
      id: "twitter",
      label: "X (Twitter)",
      href: "https://twitter.com",
      icon: (
        <span className="font-black text-[17px] text-black select-none leading-none">
          𝕏
        </span>
      ),
    },
  ];

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "About Us", href: "/about" },
    { label: "FAQs", href: "/faqs" },
    { label: "Contact Us", href: "/contact" },
  ];

  const shopCategories = [
    { label: "Electronics", href: "/category/electronics" },
    { label: "Fashion", href: "/category/fashion" },
    { label: "Home & Living", href: "/category/home-office" },
    { label: "Beauty & Personal Care", href: "/category/personal-care" },
    { label: "Sports & Fitness", href: "/category/sports" },
  ];

  const customerCare = [
    { label: "Track Your Order", href: "/orders?tab=orders" },
    { label: "Returns & Refunds", href: "/returns" },
    { label: "Shipping Policy", href: "/shipping" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ];

  return (
    <footer className="w-full bg-[#070A1E] text-slate-300 pt-14 pb-8 font-sans border-t border-[#121838]">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Top 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 pb-12">
          
          {/* Column 1: Brand Info & Badges (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-2.5 group">
          <img src={logo} alt="brand logo" className="w-50" />  
            </Link>

            {/* Tagline */}
            <p className="text-xs sm:text-base text-slate-400 max-w-sm leading-relaxed">
              Your one-stop destination for the best products at unbeatable prices.
            </p>

            {/* Feature Highlights Row */}
            <div className="flex items-center py-2 text-slate-300">
              
              {/* 1. Free Shipping */}
              <div className="flex items-center gap-2.5 pr-4 sm:pr-5 border-r border-slate-700/60">
                <Truck className="w-8 h-8 text-[#059669] shrink-0" />
                <div className="leading-tight">
                  <h5 className="text-[14px] font-semibold text-white">Free Shipping</h5>
                  <p className="text-[12px] text-slate-400">All Over India</p>
                </div>
              </div>

              {/* 2. Secure Payments */}
              <div className="flex items-center gap-2.5 px-4 sm:px-5 border-r border-slate-700/60">
                <ShieldCheck className="w-8 h-8 text-[#059669] shrink-0" />
                <div className="leading-tight">
                  <h5 className="text-[14px] font-semibold text-white">Secure</h5>
                  <p className="text-[12px] text-slate-400">Payments</p>
                </div>
              </div>

              {/* 3. 24/7 Support */}
              <div className="flex items-center gap-2.5 pl-4 sm:pl-5">
                <Headphones className="w-8 h-8 text-[#059669] shrink-0" />
                <div className="leading-tight">
                  <h5 className="text-[14px] font-semibold text-white">24/7</h5>
                  <p className="text-[12px] text-slate-400">Support</p>
                </div>
              </div>

            </div>

            {/* Social Media Circular Buttons (Array Mapping with clean React code) */}
            <div className="flex items-center gap-2.5 pt-1">
              {socialLinks.map((item) => (
                <Link
                  key={item.id}
                  to={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  className="w-10 h-10 rounded-full bg-white hover:scale-110 flex items-center justify-center transition-transform shadow-md shadow-black/30 cursor-pointer"
                >
                  {item.icon}
                </Link>
              ))}
            </div>

          </div>

          {/* Column 2: Quick Links (2 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold text-base tracking-wide">
              Quick Links
            </h4>
            <div className="w-8 h-[2.5px] bg-[#059669] rounded-full mt-2 mb-4" />
            <ul className="space-y-2.5 text-base text-slate-300">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="group inline-flex items-center gap-1.5 hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#059669] group-hover:translate-x-0.5 transition-transform" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Shop Categories (2 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold text-base tracking-wide">
              Shop Categories
            </h4>
            <div className="w-8 h-[2.5px] bg-[#059669] rounded-full mt-2 mb-4" />
            <ul className="space-y-2.5 text-base text-slate-300">
              {shopCategories.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="group inline-flex items-center gap-1.5 hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#059669] group-hover:translate-x-0.5 transition-transform" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Customer Care (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-base tracking-wide">
              Customer Care
            </h4>
            <div className="w-8 h-[2.5px] bg-[#059669] rounded-full mt-2 mb-4" />
            <ul className="space-y-2.5 text-base text-slate-300">
              {customerCare.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="group inline-flex items-center gap-1.5 hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#059669] group-hover:translate-x-0.5 transition-transform" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

      

        </div>

        {/* ================= SUB-FOOTER BOTTOM BAR ================= */}
        <div className="pt-6 border-t border-[#151D42] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          
          {/* Copyright */}
          <p className="tracking-wide">
            © 2025 <span className="text-[#059669] font-bold">ShopMart</span>. All rights reserved.
          </p>

          {/* Center Links */}
          <div className="flex items-center gap-3 text-slate-400">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-slate-600">|</span>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
           
          </div>

          {/* Right Payment Badges */}
          <div className="flex items-center gap-2">
            
            {/* VISA */}
            <div className="h-6 px-2.5 rounded bg-white flex items-center justify-center shadow-xs">
              <span className="text-[#1A1F71] font-black italic text-xs tracking-tighter">
                VISA
              </span>
            </div>

            {/* Mastercard */}
            <div className="h-6 px-2 rounded bg-[#18181B] border border-slate-700/60 flex items-center justify-center shadow-xs">
              <div className="flex items-center -space-x-1.5">
                <div className="w-3.5 h-3.5 rounded-full bg-[#EB001B]" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] opacity-90" />
              </div>
            </div>

            {/* RuPay */}
            <div className="h-6 px-2.5 rounded bg-white flex items-center justify-center shadow-xs">
              <span className="font-extrabold text-[11px] tracking-tight text-[#0971B8]">
                Ru<span className="text-[#F37021]">Pay</span>
              </span>
            </div>

            {/* UPI */}
            <div className="h-6 px-2 rounded bg-white flex items-center justify-center shadow-xs">
              <span className="font-black text-[11px] tracking-tight text-[#097939]">
                U<span className="text-[#097939]">P</span><span className="text-[#ED6B22]">I</span>
              </span>
            </div>

            {/* AMEX */}
            <div className="h-6 px-2 rounded bg-[#006FCF] flex items-center justify-center shadow-xs">
              <span className="text-white font-bold text-[9px] tracking-tighter uppercase leading-none">
                AMEX
              </span>
            </div>

          </div>

        </div>

      </div>
    </footer>
  );
}
