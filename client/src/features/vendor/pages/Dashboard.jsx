import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Cards from "../components/Cards";
import {
  TrendingUp,
  Package,
  ShoppingCart,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  ExternalLink,
  Shapes,
  CreditCard,
  Building2,
  Wallet,
  ArrowUpRight,
  ChevronUp,
} from "lucide-react";

// Real Category Packshots
import dairyBreadEggsImg from "../../../assets/category/dairy-bread-eggs.png";
import coldDrinksJuicesImg from "../../../assets/category/cold-drinks-juices.png";
import snacksMunchiesImg from "../../../assets/category/snacks-munchies.png";
import fruitsVegetablesImg from "../../../assets/category/fruits-vegetables.png";
import vendorBannerIllustration from "../../../assets/vendor-banner-illustration.png";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeDay, setActiveDay] = useState("Sat");

  // Scroll Animation & Parallax State
  const scrollContainerRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isChartInView, setIsChartInView] = useState(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const currentScroll = container.scrollTop;
      setScrollY(currentScroll);
      setShowScrollTop(currentScroll > 240);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });

    // IntersectionObserver for elements revealing on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            if (entry.target.getAttribute("data-section") === "chart") {
              setIsChartInView(true);
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.08,
        rootMargin: "0px 0px -20px 0px",
      }
    );

    const revealElements = container.querySelectorAll(".scroll-reveal");
    revealElements.forEach((el) => observer.observe(el));

    // Reveal top elements immediately
    const timer = setTimeout(() => {
      revealElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          el.classList.add("is-revealed");
        }
      });
    }, 60);

    return () => {
      clearTimeout(timer);
      container.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  // Chart data for Sales Overview matching the reference image
  const chartData = [
    { day: "Mon", x: 60, y: 145, value: "₹36,200" },
    { day: "Tue", x: 130, y: 125, value: "₹52,400" },
    { day: "Wed", x: 200, y: 80, value: "₹85,000" },
    { day: "Thu", x: 270, y: 98, value: "₹69,800" },
    { day: "Fri", x: 340, y: 48, value: "₹1,11,500" },
    { day: "Sat", x: 410, y: 35, value: "₹72,500" },
    { day: "Sun", x: 480, y: 68, value: "₹95,200" },
  ];

  // Recent Orders matching the screenshot
  const recentOrders = [
    {
      id: "#ORD1001",
      status: "Delivered",
      statusColor: "bg-emerald-50 text-[#049669] border-emerald-200/80",
      price: "₹2,499",
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=140&h=140&fit=crop&q=80",
      title: "Leather Travel Backpack",
    },
    {
      id: "#ORD1000",
      status: "Processing",
      statusColor: "bg-teal-50 text-[#049669] border-teal-200/80",
      price: "₹1,799",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=140&h=140&fit=crop&q=80",
      title: "Active Smartwatch 2 Max",
    },
    {
      id: "#ORD0999",
      status: "Shipped",
      statusColor: "bg-emerald-50 text-[#049669] border-emerald-200/80",
      price: "₹3,299",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=140&h=140&fit=crop&q=80",
      title: "Sport Running Sneakers",
    },
  ];

  // Latest Categories for Vendor Shop
  const latestCategories = [
    {
      id: "dairy",
      name: "Dairy, Bread & Eggs",
      image: dairyBreadEggsImg,
      productsCount: "24 Products",
      sales: "₹46,200",
      change: "+18%",
    },
    {
      id: "drinks",
      name: "Cold Drinks & Juices",
      image: coldDrinksJuicesImg,
      productsCount: "18 Products",
      sales: "₹32,800",
      change: "+12%",
    },
    {
      id: "snacks",
      name: "Snacks & Munchies",
      image: snacksMunchiesImg,
      productsCount: "35 Products",
      sales: "₹28,450",
      change: "+24%",
    },
    {
      id: "produce",
      name: "Fruits & Vegetables",
      image: fruitsVegetablesImg,
      productsCount: "16 Products",
      sales: "₹19,200",
      change: "+9%",
    },
  ];

  // Recent Vendor Payout Settlements
  const recentPayments = [
    {
      id: "#PAY-89241",
      method: "HDFC Bank (A/C **4921)",
      type: "Bank Transfer",
      date: "Today, 11:20 AM",
      amount: "₹42,500",
      status: "Completed",
      statusColor: "bg-emerald-50 text-[#049669] border-emerald-200/80",
    },
    {
      id: "#PAY-89218",
      method: "UPI (vendor@okaxis)",
      type: "Instant Payout",
      date: "Yesterday, 04:45 PM",
      amount: "₹18,200",
      status: "Completed",
      statusColor: "bg-emerald-50 text-[#049669] border-emerald-200/80",
    },
    {
      id: "#PAY-89190",
      method: "ICICI Bank (A/C **8104)",
      type: "Weekly Settlement",
      date: "28 Oct, 2026",
      amount: "₹35,000",
      status: "Processing",
      statusColor: "bg-teal-50 text-[#049669] border-teal-200/80",
    },
  ];

  return (
    <div className="h-screen w-full bg-white flex flex-col font-['Poppins',sans-serif] text-slate-800 relative overflow-hidden">
      {/* Background Ambient Glow Orbs with Parallax Scroll Effect */}
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

      {/* Full Top Navbar */}
      <Navbar onToggleSidebar={() => setIsSidebarOpen(true)} />

      {/* Body Area below Navbar: Sidebar on left, Content on right */}
      <div className="flex-1 flex min-h-0 relative z-10 overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <div
          ref={scrollContainerRef}
          className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto relative z-10 scroll-smooth [scrollbar-gutter:stable]"
        >
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6   w-full mx-auto">
          {/* Welcome Banner Created with pure Code & SVG (High-Resolution Coded Banner) */}
          <div className="scroll-reveal relative rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 min-h-[175px] sm:min-h-[190px] lg:min-h-[200px] flex flex-col justify-between overflow-hidden shadow-[0_16px_40px_rgba(4,150,105,0.22)] border border-emerald-400/30 group">
            {/* Background SVG Fluid Organic Waves */}
            <svg
              className="pointer-events-none absolute inset-0 w-full h-full object-cover"
              viewBox="0 0 1024 200"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="bannerBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1B744A" />
                  <stop offset="40%" stopColor="#228C52" />
                  <stop offset="100%" stopColor="#2CA85C" />
                </linearGradient>
                <linearGradient id="waveHighlight" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38C260" stopOpacity="0.5" />
                  <stop offset="60%" stopColor="#259452" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="waveDeep" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#114E30" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#186740" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Base gradient fill */}
              <rect width="1024" height="200" fill="url(#bannerBgGrad)" />

              {/* Bottom organic curve wave */}
              <path
                d="M 0 200 C 240 185 380 130 620 160 C 800 182 920 150 1024 115 L 1024 200 Z"
                fill="url(#waveDeep)"
              />

              {/* Top-right sweeping vibrant lime curve */}
              <path
                d="M 280 0 C 420 75 600 40 740 100 C 870 155 945 85 1024 40 L 1024 0 Z"
                fill="url(#waveHighlight)"
              />

              {/* Middle subtle fluid ribbon */}
              <path
                d="M 0 0 C 300 0 420 120 670 80 C 850 50 930 20 1024 0 Z"
                fill="white"
                fillOpacity="0.07"
              />
            </svg>

            {/* Ambient specular glass reflection & glowing flares */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-200/60 to-transparent" />

            {/* Right 3D E-Commerce Shopping Cart Artwork - Ultra High-Resolution Transparent PNG */}
            <div className="absolute right-2 sm:right-6 lg:right-10 top-1/2 -translate-y-1/2 h-[90%] sm:h-[94%] lg:h-[98%] w-auto max-w-[38%] sm:max-w-[42%] lg:max-w-[45%] pointer-events-none select-none z-10 hidden sm:flex items-center justify-end">
              <img
                src={vendorBannerIllustration}
                alt="Store 3D artwork"
                className="h-full w-auto object-contain object-right drop-shadow-[0_12px_24px_rgba(0,0,0,0.22)]"
              />
            </div>

            {/* Left Content Area (Pure Selectable HTML & Interactive Button) */}
            <div className="relative z-10 flex-1 flex flex-col justify-between max-w-xl">
              <div className="space-y-1.5 sm:space-y-2">
                {/* Store Overview Tag with Horizontal Line Accent */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-emerald-100">
                    STORE OVERVIEW
                  </span>
                  <span className="w-7 h-[1.5px] bg-emerald-200/80 rounded-full inline-block" />
                </div>

                {/* Main Heading */}
                <h1 className="text-xl sm:text-2xl lg:text-[30px] font-black tracking-tight text-white leading-tight drop-shadow-sm">
                  Welcome back, Best Deals Store!
                </h1>

                {/* Subtitle */}
                <p className="text-xs sm:text-[13px] text-emerald-50/95 font-medium leading-relaxed max-w-md lg:max-w-lg">
                  Here's what is happening with your store today. You have 14 orders pending for dispatch.
                </p>
              </div>

          
            </div>
          </div>

          {/* Metric Stats Cards with Staggered Scroll Reveal */}
          <div className="scroll-reveal scroll-reveal-delay-1">
            <Cards />
          </div>

          {/* ================= ROW 1: Sales Overview + Recent Orders (Scroll Reveal) ================= */}
          <div
            data-section="chart"
            className="scroll-reveal scroll-reveal-delay-1 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch"
          >
            
            {/* Left: Sales Overview Chart (Glassy & Reduced Radius) */}
            <div className="lg:col-span-7 xl:col-span-7 bg-white/60 backdrop-blur-2xl rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-white/80 shadow-[0_8px_30px_rgba(4,150,105,0.06)] relative overflow-hidden flex flex-col justify-between">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

              {/* Chart Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-black text-[#1E1B4B] tracking-tight">
                  Sales Overview
                </h3>

                <span className="text-xs font-bold text-[#049669] bg-emerald-50/90 border border-emerald-200/80 px-3 py-1 rounded-full shadow-2xs">
                  Weekly Trends
                </span>
              </div>

              {/* Chart Canvas */}
              <div className="relative w-full aspect-[16/8] sm:aspect-[16/7] min-h-[200px]">
                <svg
                  viewBox="0 0 520 200"
                  className="w-full h-full overflow-visible"
                >
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#049669" stopOpacity="0.28" />
                      <stop offset="60%" stopColor="#10B981" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="#049669" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid Lines */}
                  {[
                    { y: 20, label: "150k" },
                    { y: 73, label: "100k" },
                    { y: 126, label: "50k" },
                    { y: 175, label: "0" },
                  ].map((grid) => (
                    <g key={grid.label}>
                      <text
                        x="34"
                        y={grid.y + 4}
                        textAnchor="end"
                        className="text-[11px] fill-slate-400 font-semibold select-none font-['Poppins']"
                      >
                        {grid.label}
                      </text>
                      <line
                        x1="48"
                        y1={grid.y}
                        x2="495"
                        y2={grid.y}
                        stroke="#F1F5F9"
                        strokeWidth="1.2"
                      />
                    </g>
                  ))}

                  {/* Vertical Subtle Grid Lines */}
                  {chartData.map((pt) => (
                    <line
                      key={pt.day}
                      x1={pt.x}
                      y1="20"
                      x2={pt.x}
                      y2="175"
                      stroke="#F8FAFC"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Gradient Area Under Curve */}
                  <path
                    d="M 60 145 C 95 135, 95 125, 130 125 C 165 125, 165 80, 200 80 C 235 80, 235 98, 270 98 C 305 98, 305 48, 340 48 C 375 48, 375 35, 410 35 C 445 35, 445 68, 480 68 L 480 175 L 60 175 Z"
                    fill="url(#salesGradient)"
                  />

                  {/* Smooth Curved Line in Emerald Green #049669 with Scroll Draw Animation */}
                  <path
                    d="M 60 145 C 95 135, 95 125, 130 125 C 165 125, 165 80, 200 80 C 235 80, 235 98, 270 98 C 305 98, 305 48, 340 48 C 375 48, 375 35, 410 35 C 445 35, 445 68, 480 68"
                    fill="none"
                    stroke="#049669"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={isChartInView ? "animate-draw-curve" : "opacity-40"}
                  />

                  {/* Interactive Points on Line */}
                  {chartData.map((pt) => {
                    const isSat = pt.day === activeDay;
                    return (
                      <g
                        key={pt.day}
                        onClick={() => setActiveDay(pt.day)}
                        className="cursor-pointer"
                      >
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isSat ? "6" : "4.5"}
                          fill={isSat ? "#049669" : "#10B981"}
                          stroke="#FFFFFF"
                          strokeWidth="2.5"
                          className="transition-all hover:scale-125"
                        />
                      </g>
                    );
                  })}

                  {/* Emerald Green Pill Tooltip */}
                  {(() => {
                    const activePt = chartData.find((p) => p.day === activeDay) || chartData[5];
                    return (
                      <g transform={`translate(${activePt.x}, ${activePt.y - 12})`}>
                        <rect
                          x="-35"
                          y="-26"
                          width="70"
                          height="23"
                          rx="6"
                          fill="#049669"
                          className="drop-shadow-md"
                        />
                        <text
                          x="0"
                          y="-10"
                          textAnchor="middle"
                          fill="#FFFFFF"
                          fontSize="11"
                          fontWeight="800"
                          fontFamily="Poppins"
                        >
                          {activePt.value}
                        </text>
                        <polygon
                          points="-5,-4 5,-4 0,1"
                          fill="#049669"
                        />
                      </g>
                    );
                  })()}
                </svg>

                {/* X-axis Day Labels */}
                <div className="flex items-center justify-between pl-10 pr-2 pt-1 select-none">
                  {chartData.map((pt) => (
                    <button
                      key={pt.day}
                      onClick={() => setActiveDay(pt.day)}
                      className={`text-[11px] sm:text-xs transition-colors cursor-pointer ${
                        pt.day === activeDay
                          ? "text-[#049669] font-extrabold"
                          : "text-slate-400 hover:text-slate-600 font-semibold"
                      }`}
                    >
                      {pt.day}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Recent Orders Card (Glassy & Reduced Radius) */}
            <div className="lg:col-span-5 xl:col-span-5 bg-white/60 backdrop-blur-2xl rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-white/80 shadow-[0_8px_30px_rgba(4,150,105,0.06)] relative overflow-hidden flex flex-col justify-between">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-3">
                <h3 className="text-base sm:text-lg font-black text-[#1E1B4B] tracking-tight">
                  Recent Orders
                </h3>
                <Link
                  to="/vendor/orders"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#049669] hover:text-[#03704f] transition-colors"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Orders List */}
              <div className="divide-y divide-slate-100 flex-1 flex flex-col justify-around">
                {recentOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="py-3 sm:py-3.5 flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Product Thumbnail */}
                      <div className="w-12 h-12 rounded-xl bg-emerald-50/50 border border-emerald-100/60 p-1.5 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform overflow-hidden">
                        <img
                          src={ord.image}
                          alt={ord.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      {/* Order ID & Status Pill */}
                      <div className="space-y-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-[#1E1B4B]">
                          {ord.id}
                        </h4>
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${ord.statusColor}`}
                        >
                          {ord.status}
                        </span>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="text-right shrink-0">
                      <span className="text-sm sm:text-base font-black text-[#1E1B4B]">
                        {ord.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ================= ROW 2: Latest Categories + Recent Payments (Scroll Reveal) ================= */}
          <div className="scroll-reveal scroll-reveal-delay-2 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
            
            {/* Left: Latest Categories Card (Glassy & Reduced Radius) */}
            <div className="lg:col-span-7 xl:col-span-7 bg-white/60 backdrop-blur-2xl rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-white/80 shadow-[0_8px_30px_rgba(4,150,105,0.06)] relative overflow-hidden flex flex-col justify-between">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#049669] flex items-center justify-center border border-emerald-200/80 shadow-2xs">
                    <Shapes className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#1E1B4B] tracking-tight leading-snug">
                      Latest Categories
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Active inventory categories in your shop
                    </p>
                  </div>
                </div>

                <Link
                  to="/vendor/categories"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#049669] hover:text-[#03704f] transition-colors"
                >
                  <span>Manage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {latestCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/60 backdrop-blur-md border border-slate-100 hover:border-[#049669]/40 hover:shadow-xs transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-lg bg-emerald-50/80 border border-emerald-100/60 p-1 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-[13px] font-bold text-[#1E1B4B] truncate">
                          {cat.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                          {cat.productsCount}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pl-2">
                      <span className="text-xs sm:text-sm font-bold text-[#1E1B4B] block">
                        {cat.sales}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Recent Payments / Settlements Card (Glassy & Reduced Radius) */}
            <div className="lg:col-span-5 xl:col-span-5 bg-white/60 backdrop-blur-2xl rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-white/80 shadow-[0_8px_30px_rgba(4,150,105,0.06)] relative overflow-hidden flex flex-col justify-between">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#049669] flex items-center justify-center border border-emerald-200/80 shadow-2xs">
                    <Wallet className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#1E1B4B] tracking-tight leading-snug">
                      Recent Payments
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Payout settlements & bank transfers
                    </p>
                  </div>
                </div>

                <Link
                  to="/vendor/payments"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#049669] hover:text-[#03704f] transition-colors"
                >
                  <span>History</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Payments List */}
              <div className="divide-y divide-slate-100 flex-1 flex flex-col justify-around">
                {recentPayments.map((pay) => (
                  <div
                    key={pay.id}
                    className="py-3 flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50/90 border border-emerald-200/80 text-[#049669] flex items-center justify-center shrink-0 shadow-2xs group-hover:bg-emerald-100 transition-colors">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-[13px] font-bold text-[#1E1B4B] truncate">
                            {pay.id}
                          </h4>
                          <span
                            className={`inline-block px-2 py-0.2 rounded-md text-[9px] font-bold border ${pay.statusColor}`}
                          >
                            {pay.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs sm:text-sm font-black text-[#049669]">
                        +{pay.amount}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {pay.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </main>

        {/* Floating Glass Back-to-Top Button on Scroll */}
        {showScrollTop && (
          <button
            type="button"
            onClick={() => scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Scroll to top"
            className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-white/90 backdrop-blur-xl border border-white/80 text-[#049669] shadow-lg shadow-emerald-950/15 flex items-center justify-center hover:bg-[#049669] hover:text-white transition-all cursor-pointer animate-in fade-in zoom-in-75 duration-300 group"
          >
            <ChevronUp className="w-5 h-5 stroke-[2.5] transition-transform group-hover:-translate-y-0.5" />
          </button>
        )}
      </div>
    </div>
  </div>
);
}
