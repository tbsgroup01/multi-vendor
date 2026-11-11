import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Cards from "../components/Cards";
import { adminService, vendorService } from "../../../services";
import {
  TrendingUp,
  Store,
  Users,
  CircleDollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronUp,
  Shield,
  ArrowRight,
  Filter,
  Eye,
  Check,
  X,
  Sparkles,
  ShoppingBag,
  RefreshCw,
  Loader2,
} from "lucide-react";
import bannerAdminImg from "../../../assets/banner-admin-dashboard-3d.png";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeDay, setActiveDay] = useState("Sat");
  const [timeRange, setTimeRange] = useState("weekly");
  const [loading, setLoading] = useState(true);

  // Live Database Statistics
  const [stats, setStats] = useState({
    totalGMV: 0,
    formattedGMV: "₹0",
    activeVendors: 0,
    registeredUsers: 0,
    pendingApprovals: 0,
  });

  const [pendingVendors, setPendingVendors] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [chartDays, setChartDays] = useState([
    { day: "Mon", sales: "₹0", heightPct: 20, x: 120, y: 155 },
    { day: "Tue", sales: "₹0", heightPct: 20, x: 260, y: 135 },
    { day: "Wed", sales: "₹0", heightPct: 20, x: 400, y: 145 },
    { day: "Thu", sales: "₹0", heightPct: 20, x: 540, y: 100 },
    { day: "Fri", sales: "₹0", heightPct: 20, x: 680, y: 65 },
    { day: "Sat", sales: "₹0", heightPct: 20, x: 820, y: 35 },
    { day: "Sun", sales: "₹0", heightPct: 20, x: 960, y: 80 },
  ]);

  // Fetch Dashboard Analytics from DB
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await adminService.getDashboardStats();
      if (res && res.success) {
        if (res.stats) setStats(res.stats);
        if (Array.isArray(res.pendingVendors)) setPendingVendors(res.pendingVendors);
        if (Array.isArray(res.recentOrders)) setRecentOrders(res.recentOrders);
        if (Array.isArray(res.chartDays) && res.chartDays.length > 0) {
          setChartDays(res.chartDays);
          setActiveDay(res.chartDays[res.chartDays.length - 1].day);
        }
      }
    } catch (err) {
      console.warn("Failed to load admin dashboard stats from DB:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Scroll Animation & Parallax State
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

  // Handle Live Vendor Approval directly from DB
  const handleApprove = async (id) => {
    try {
      await vendorService.approveVendor(id);
    } catch (err) {
      console.warn("Failed to approve vendor in DB:", err);
    }
    setPendingVendors((prev) => prev.filter((v) => v.id !== id));
    setStats((prev) => ({
      ...prev,
      activeVendors: (prev.activeVendors || 0) + 1,
      pendingApprovals: Math.max(0, (prev.pendingApprovals || 0) - 1),
    }));
  };

  // Handle Live Vendor Rejection in DB
  const handleReject = async (id) => {
    try {
      await vendorService.rejectVendor(id, "Rejected by admin from dashboard");
    } catch (err) {
      console.warn("Failed to reject vendor in DB:", err);
    }
    setPendingVendors((prev) => prev.filter((v) => v.id !== id));
    setStats((prev) => ({
      ...prev,
      pendingApprovals: Math.max(0, (prev.pendingApprovals || 0) - 1),
    }));
  };

  // Live Stats Cards Data
  const statsCardsData = [
    {
      id: "platform-gmv",
      title: "Platform GMV (Sales)",
      value: stats.formattedGMV || `₹${Number(stats.totalGMV || 0).toLocaleString("en-IN")}`,
      change: "Live DB Aggregate",
      isPositive: true,
      icon: CircleDollarSign,
      iconColor: "text-white bg-gradient-to-tr from-[#049669] to-[#10B981] border-emerald-400/40 shadow-md shadow-emerald-600/25",
      bgGradient: "from-emerald-50/90 via-white/85 to-white/60",
      accentBorder: "border-emerald-200/80 hover:border-emerald-400 hover:shadow-[0_16px_36px_rgba(4,150,105,0.15)]",
      glowColor: "bg-emerald-400/25",
      valueColor: "text-[#049669]",
    },
    {
      id: "vendors",
      title: "Active Vendors",
      value: String(stats.activeVendors ?? 0),
      change: "Approved store partners",
      isPositive: true,
      icon: Store,
      iconColor: "text-white bg-gradient-to-tr from-[#059669] to-teal-500 border-teal-400/40 shadow-md shadow-teal-600/25",
      bgGradient: "from-teal-50/90 via-white/85 to-white/60",
      accentBorder: "border-teal-200/80 hover:border-teal-400 hover:shadow-[0_16px_36px_rgba(13,148,136,0.15)]",
      glowColor: "bg-teal-400/25",
      valueColor: "text-[#1E1B4B]",
    },
    {
      id: "customers",
      title: "Registered Users",
      value: Number(stats.registeredUsers ?? 0).toLocaleString("en-IN"),
      change: "Platform accounts",
      isPositive: true,
      icon: Users,
      iconColor: "text-white bg-gradient-to-tr from-[#049669] via-emerald-600 to-teal-600 border-emerald-400/40 shadow-md shadow-emerald-600/25",
      bgGradient: "from-emerald-50/70 via-white/85 to-white/60",
      accentBorder: "border-emerald-200/80 hover:border-emerald-400 hover:shadow-[0_16px_36px_rgba(4,150,105,0.15)]",
      glowColor: "bg-emerald-400/20",
      valueColor: "text-[#1E1B4B]",
    },
    {
      id: "pending-approvals",
      title: "Pending Approvals",
      value: String(stats.pendingApprovals ?? pendingVendors.length),
      change: "Vendor KYC & Stores",
      isPositive: false,
      icon: Clock,
      iconColor: "text-white bg-gradient-to-tr from-amber-500 to-amber-400 border-amber-300 shadow-md shadow-amber-500/25",
      bgGradient: "from-amber-50/90 via-white/85 to-white/60",
      accentBorder: "border-amber-200/80 hover:border-amber-400 hover:shadow-[0_16px_36px_rgba(245,158,11,0.15)]",
      glowColor: "bg-amber-400/25",
      valueColor: "text-amber-600",
    },
  ];

  return (
    <div className="h-screen w-full bg-white flex flex-col font-['Poppins',sans-serif] text-slate-800 relative overflow-hidden">
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
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 w-full mx-auto pb-12">
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
                  <linearGradient id="adminBannerBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1B744A" />
                    <stop offset="40%" stopColor="#228C52" />
                    <stop offset="100%" stopColor="#2CA85C" />
                  </linearGradient>
                  <linearGradient id="adminWaveHighlight" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#38C260" stopOpacity="0.5" />
                    <stop offset="60%" stopColor="#259452" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="adminWaveDeep" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#114E30" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#186740" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <rect width="1024" height="200" fill="url(#adminBannerBgGrad)" />
                <path
                  d="M 0 200 C 240 185 380 130 620 160 C 800 182 920 150 1024 115 L 1024 200 Z"
                  fill="url(#adminWaveDeep)"
                />
                <path
                  d="M 280 0 C 420 75 600 40 740 100 C 870 155 945 85 1024 40 L 1024 0 Z"
                  fill="url(#adminWaveHighlight)"
                />
                <path
                  d="M 0 0 C 300 0 420 120 670 80 C 850 50 930 20 1024 0 Z"
                  fill="white"
                  fillOpacity="0.07"
                />
              </svg>

              {/* Specular glass reflection */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-200/60 to-transparent" />

              {/* Right 3D Admin Artwork - Transparent PNG */}
              <div className="absolute right-3 sm:right-6 lg:right-10 top-1/2 -translate-y-1/2 h-[90%] sm:h-[94%] lg:h-[98%] w-auto max-w-[38%] sm:max-w-[42%] lg:max-w-[45%] pointer-events-none select-none z-10 hidden sm:flex items-center justify-end">
                <img
                  src={bannerAdminImg}
                  alt="Super Admin 3D artwork"
                  className="h-full w-auto object-contain object-right drop-shadow-[0_12px_24px_rgba(0,0,0,0.22)]"
                />
              </div>

              {/* Left Content Area */}
              <div className="relative z-10 flex-1 flex flex-col justify-between max-w-xl">
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-emerald-100">
                      PLATFORM ADMINISTRATION
                    </span>
                    <span className="w-7 h-[1.5px] bg-emerald-200/80 rounded-full inline-block" />
                  </div>

                  <h1 className="text-xl sm:text-2xl lg:text-[30px] font-black tracking-tight text-white leading-tight drop-shadow-sm">
                    Welcome back, Super Admin!
                  </h1>

                  <p className="text-xs sm:text-[13px] text-emerald-50/95 font-medium leading-relaxed max-w-md lg:max-w-lg">
                    Real-time oversight for ShopMart Marketplace. Monitor multi-vendor growth, platform gross revenue, vendor settlements, and store applications.
                  </p>
                </div>

                <div className="pt-3.5 sm:pt-4 flex flex-wrap items-center gap-3">
                  <Link
                    to="/admin/vendors"
                    className="inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-white text-[#049669] hover:text-[#03704f] hover:bg-emerald-50 font-bold text-xs sm:text-sm shadow-md shadow-emerald-950/20 hover:shadow-lg hover:scale-[1.02] active:scale-98 transition-all duration-200 cursor-pointer"
                  >
                    <Store className="w-4 h-4" />
                    <span>Manage Vendors</span>
                  </Link>

                  <button
                    type="button"
                    onClick={fetchDashboardData}
                    className="inline-flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-full bg-emerald-900/40 hover:bg-emerald-900/60 backdrop-blur-md border border-emerald-300/30 text-emerald-100 font-semibold text-xs sm:text-sm cursor-pointer transition-all active:scale-95"
                    title="Reload Live Database Stats"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                    <span>Sync DB</span>
                  </button>

                  <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/40 backdrop-blur-md border border-emerald-300/30 text-emerald-100 text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>All Services Healthy</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Stats Cards */}
            <Cards stats={statsCardsData} />

            {/* Platform Analytics & Recent Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
              {/* Left 2 Cols: Sales & GMV Trends SVG Chart */}
              <div className="lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-800">
                      Marketplace GMV &amp; Sales Trends
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Cumulative sales volume across all active vendors
                    </p>
                  </div>

                  <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 text-xs font-semibold">
                    <button
                      onClick={() => setTimeRange("weekly")}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        timeRange === "weekly"
                          ? "bg-white text-[#049669] shadow-xs"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      Weekly Trends
                    </button>
                    <button
                      onClick={() => setTimeRange("monthly")}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        timeRange === "monthly"
                          ? "bg-white text-[#049669] shadow-xs"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      Monthly
                    </button>
                  </div>
                </div>

                {/* SVG Curve Chart */}
                <div className="relative pt-6">
                  {/* Floating active data tooltip */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#049669] text-white font-bold text-xs shadow-md shadow-emerald-700/20 mb-2">
                    <span>{chartDays.find((d) => d.day === activeDay)?.sales || chartDays[0]?.sales || "₹0"}</span>
                    <span className="text-[10px] font-normal text-emerald-100">on {activeDay}</span>
                  </div>

                  <div className="h-48 sm:h-56 w-full relative">
                    <svg
                      className="w-full h-full overflow-visible"
                      viewBox="0 0 1000 200"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient id="chartFillGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#049669" stopOpacity="0.22" />
                          <stop offset="100%" stopColor="#049669" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Horizontal Grid lines */}
                      <line x1="0" y1="50" x2="1000" y2="50" stroke="#f1f5f9" strokeDasharray="4 4" />
                      <line x1="0" y1="100" x2="1000" y2="100" stroke="#f1f5f9" strokeDasharray="4 4" />
                      <line x1="0" y1="150" x2="1000" y2="150" stroke="#f1f5f9" strokeDasharray="4 4" />

                      {/* Area Fill */}
                      <path
                        d={`M 120 ${chartDays[0]?.y ?? 155} ` +
                          chartDays.slice(1).map((pt) => `L ${pt.x} ${pt.y}`).join(" ") +
                          ` L ${chartDays[chartDays.length - 1]?.x ?? 960} 200 L 120 200 Z`}
                        fill="url(#chartFillGrad)"
                      />

                      {/* Smooth Curve Stroke */}
                      <path
                        d={`M 120 ${chartDays[0]?.y ?? 155} ` +
                          chartDays.slice(1).map((pt) => `L ${pt.x} ${pt.y}`).join(" ")}
                        fill="none"
                        stroke="#049669"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Interactive Dots */}
                      {chartDays.map((pt) => {
                        const isSelected = activeDay === pt.day;
                        return (
                          <g key={pt.day} className="cursor-pointer">
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r={isSelected ? "7" : "5"}
                              fill={isSelected ? "#049669" : "white"}
                              stroke="#049669"
                              strokeWidth={isSelected ? "3" : "2.5"}
                              className="transition-all duration-200"
                            />
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  {/* Day Buttons below chart */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs font-semibold text-slate-400">
                    {chartDays.map((item) => {
                      const isSelected = activeDay === item.day;
                      return (
                        <button
                          key={item.day}
                          onClick={() => setActiveDay(item.day)}
                          className={`px-2.5 py-1 rounded-md transition-colors ${
                            isSelected
                              ? "text-[#049669] font-black bg-emerald-50"
                              : "hover:text-slate-600"
                          }`}
                        >
                          {item.day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Col: Pending Store Applications & KYC */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base sm:text-lg font-black text-slate-800">
                      Store Approvals
                    </h3>
                    <span className="text-xs font-bold text-[#049669] bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      {pendingVendors.length} Pending
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Vendor KYC &amp; Marketplace onboarding queue
                  </p>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {pendingVendors.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      All vendor applications have been processed!
                    </div>
                  ) : (
                    pendingVendors.map((vendor) => (
                      <div
                        key={vendor.id}
                        className="p-3.5 rounded-xl border border-slate-100 hover:border-emerald-200 bg-slate-50/50 hover:bg-emerald-50/20 transition-all space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">
                              {vendor.storeName}
                            </h4>
                            <p className="text-[11px] text-slate-400">
                              Owner: {vendor.owner} • {vendor.category}
                            </p>
                          </div>
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md whitespace-nowrap">
                            {vendor.status}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-slate-400">
                            Applied: {vendor.appliedDate}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleReject(vendor.id)}
                              className="px-2 py-1 rounded-md text-[11px] font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleApprove(vendor.id)}
                              className="px-2.5 py-1 rounded-md text-[11px] font-bold text-white bg-[#049669] hover:bg-[#03704f] transition-all shadow-xs cursor-pointer flex items-center gap-1"
                            >
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>Approve</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <Link
                  to="/admin/vendors"
                  className="w-full py-2.5 rounded-xl border border-slate-200 text-center font-bold text-xs text-slate-600 hover:text-[#049669] hover:border-emerald-300 hover:bg-emerald-50/50 transition-all block"
                >
                  View All Registered Stores →
                </Link>
              </div>
            </div>

            {/* Bottom Row: Recent Cross-Marketplace Transactions */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-800">
                    Recent Marketplace Transactions
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Live orders routed across multiple store vendors
                  </p>
                </div>
                <Link
                  to="/admin/payments"
                  className="text-xs font-bold text-[#049669] hover:text-[#03704f] hover:underline inline-flex items-center gap-1"
                >
                  <span>View All Settlements</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
                      <th className="py-3 px-3">Order ID</th>
                      <th className="py-3 px-3">Customer</th>
                      <th className="py-3 px-3">Store Name</th>
                      <th className="py-3 px-3">Amount</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                          No recent transactions recorded in database yet.
                        </td>
                      </tr>
                    ) : (
                      recentOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-3 font-bold text-slate-800">{ord.id}</td>
                          <td className="py-3 px-3 text-slate-600">{ord.customer}</td>
                          <td className="py-3 px-3 text-slate-600 font-medium">{ord.store}</td>
                          <td className="py-3 px-3 font-black text-slate-800">{ord.amount}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${ord.statusColor}`}
                            >
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button className="text-slate-400 hover:text-[#049669] p-1 rounded-lg hover:bg-emerald-50 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-[#049669] text-white shadow-lg shadow-emerald-950/20 hover:bg-[#03704f] transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

