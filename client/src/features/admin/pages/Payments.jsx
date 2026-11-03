import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Cards from "../components/Cards";
import {
  CircleDollarSign,
  TrendingUp,
  Store,
  Wallet,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  Download,
  Building2,
  ChevronUp,
  CreditCard,
  Eye,
  Check,
  X,
  FileText,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import bannerAdminPaymentsImg from "../../../assets/banner-admin-payments-3d.png";

const INITIAL_SETTLEMENTS = [
  {
    id: "PAY-88210",
    storeName: "Best Deals Superstore",
    ownerName: "Rajesh Gupta",
    category: "Groceries & Daily Needs",
    grossAmount: "₹48,500",
    grossRaw: 48500,
    netPayout: "₹44,377.50",
    netRaw: 44377.5,
    method: "NEFT / RTGS",
    bankDetails: "HDFC Bank •••• 4829",
    utr: "HDFCN26308194820",
    status: "Completed",
    date: "Today, 11:30 AM",
  },
  {
    id: "PAY-88209",
    storeName: "Organic Bliss Farm",
    ownerName: "Devendra Patel",
    category: "Fruits & Vegetables",
    grossAmount: "₹24,800",
    grossRaw: 24800,
    netPayout: "₹23,064.00",
    netRaw: 23064,
    method: "UPI Auto-Payout",
    bankDetails: "ICICI Bank •••• 1920",
    utr: "UPI26308191240",
    status: "Completed",
    date: "Today, 09:15 AM",
  },
  {
    id: "PAY-88208",
    storeName: "Fresh Dairy Direct",
    ownerName: "Vikram Singh",
    category: "Dairy, Bread & Eggs",
    grossAmount: "₹18,400",
    grossRaw: 18400,
    netPayout: "₹17,204.00",
    netRaw: 17204,
    method: "IMPS Fast Pay",
    bankDetails: "SBI •••• 7741",
    utr: "SBIN26307184421",
    status: "Processing",
    date: "Today, 08:45 AM",
  },
  {
    id: "PAY-88207",
    storeName: "Spice & Masala Heritage",
    ownerName: "Anita Desai",
    category: "Atta, Rice & Dal",
    grossAmount: "₹36,200",
    grossRaw: 36200,
    netPayout: "₹33,304.00",
    netRaw: 33304,
    method: "NEFT / RTGS",
    bankDetails: "Axis Bank •••• 3310",
    utr: "Pending UTR",
    status: "Pending Release",
    date: "Yesterday, 04:20 PM",
  },
  {
    id: "PAY-88206",
    storeName: "City Munchies & Snacks",
    ownerName: "Sahil Khan",
    category: "Snacks & Munchies",
    grossAmount: "₹28,600",
    grossRaw: 28600,
    netPayout: "₹26,169.00",
    netRaw: 26169,
    method: "UPI Auto-Payout",
    bankDetails: "HDFC Bank •••• 5531",
    utr: "Pending UTR",
    status: "Pending Release",
    date: "Yesterday, 02:10 PM",
  },
  {
    id: "PAY-88205",
    storeName: "Sweet Treats Patisserie",
    ownerName: "Pooja Malhotra",
    category: "Bakery & Biscuits",
    grossAmount: "₹14,900",
    grossRaw: 14900,
    netPayout: "₹13,559.00",
    netRaw: 13559,
    method: "NEFT / RTGS",
    bankDetails: "Kotak Bank •••• 9928",
    utr: "KKBK26305149811",
    status: "Completed",
    date: "Nov 01, 2026",
  },
  {
    id: "PAY-88204",
    storeName: "Daily Clean Essentials",
    ownerName: "Rajesh Kulkarni",
    category: "Cleaning Essentials",
    grossAmount: "₹8,450",
    grossRaw: 8450,
    netPayout: "₹7,731.75",
    netRaw: 7731.75,
    method: "IMPS Fast Pay",
    bankDetails: "PNB •••• 8819",
    utr: "PNBN26304192019",
    status: "Completed",
    date: "Oct 31, 2026",
  },
];

export default function Payments() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [settlements, setSettlements] = useState(INITIAL_SETTLEMENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals state
  const [isInitiateModalOpen, setIsInitiateModalOpen] = useState(false);
  const [viewingSettlement, setViewingSettlement] = useState(null);

  // New Payout Form
  const [formData, setFormData] = useState({
    storeName: "Best Deals Superstore",
    grossAmount: "",
    method: "NEFT / RTGS",
    bankDetails: "HDFC Bank •••• 4829",
    note: "Weekly marketplace settlement disbursement",
  });

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

  // Filter Logic
  const filteredSettlements = settlements.filter((s) => {
    if (statusFilter !== "all" && s.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    if (methodFilter !== "all" && s.method !== methodFilter) {
      return false;
    }
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return (
        s.id.toLowerCase().includes(q) ||
        s.storeName.toLowerCase().includes(q) ||
        s.ownerName.toLowerCase().includes(q) ||
        s.utr.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredSettlements.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Approve / Release single payout
  const handleReleasePayout = (id) => {
    setSettlements((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: "Completed",
              utr: `UTR${Date.now().toString().slice(-10)}`,
            }
          : s
      )
    );
  };

  // Bulk Release
  const handleBulkRelease = () => {
    setSettlements((prev) =>
      prev.map((s) =>
        selectedIds.includes(s.id)
          ? {
              ...s,
              status: "Completed",
              utr: s.utr === "Pending UTR" ? `UTR${Date.now().toString().slice(-10)}` : s.utr,
            }
          : s
      )
    );
    setSelectedIds([]);
  };

  // Bulk Delete
  const handleBulkDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedIds.length} selected settlement record(s)?`
      )
    ) {
      setSettlements((prev) => prev.filter((s) => !selectedIds.includes(s.id)));
      setSelectedIds([]);
    }
  };

  // Submit Initiate Payout
  const handleInitiateSubmit = (e) => {
    e.preventDefault();
    const gross = parseFloat(formData.grossAmount) || 0;
    if (gross <= 0) return;

    const net = gross;

    const newPayout = {
      id: `PAY-${Math.floor(10000 + Math.random() * 90000)}`,
      storeName: formData.storeName,
      ownerName: "Store Merchant",
      category: "Marketplace Store",
      grossAmount: `₹${gross.toLocaleString("en-IN")}`,
      grossRaw: gross,
      netPayout: `₹${net.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      netRaw: net,
      method: formData.method,
      bankDetails: formData.bankDetails,
      utr: "Pending UTR",
      status: "Processing",
      date: "Just now",
    };

    setSettlements([newPayout, ...settlements]);
    setIsInitiateModalOpen(false);
    setFormData({
      storeName: "Best Deals Superstore",
      grossAmount: "",
      method: "NEFT / RTGS",
      bankDetails: "HDFC Bank •••• 4829",
      note: "Weekly marketplace settlement disbursement",
    });
  };

  // Metrics
  const totalGross = settlements.reduce((acc, s) => acc + (s.grossRaw || 0), 0);
  const completedCount = settlements.filter((s) => s.status === "Completed").length;
  const totalDisbursed = settlements
    .filter((s) => s.status === "Completed")
    .reduce((acc, s) => acc + (s.netRaw || 0), 0);
  const totalPending = settlements
    .filter((s) => s.status !== "Completed")
    .reduce((acc, s) => acc + (s.netRaw || 0), 0);

  const paymentStats = [
    {
      id: "platform-gmv",
      title: "Settlement Turnover",
      value: `₹${(totalGross / 100000).toFixed(2)}L`,
      icon: CircleDollarSign,
      iconColor: "text-white bg-gradient-to-tr from-[#049669] to-[#10B981] border-emerald-400/40 shadow-md shadow-emerald-600/25",
      bgGradient: "from-emerald-50/90 via-white/85 to-white/60",
      accentBorder: "border-emerald-200/80 hover:border-emerald-400 hover:shadow-[0_16px_36px_rgba(4,150,105,0.15)]",
      glowColor: "bg-emerald-400/25",
      valueColor: "text-[#049669]",
    },
    {
      id: "completed-payouts",
      title: "Completed Payouts",
      value: String(completedCount),
      icon: CheckCircle2,
      iconColor: "text-white bg-gradient-to-tr from-[#059669] to-teal-500 border-teal-400/40 shadow-md shadow-teal-600/25",
      bgGradient: "from-teal-50/90 via-white/85 to-white/60",
      accentBorder: "border-teal-200/80 hover:border-teal-400 hover:shadow-[0_16px_36px_rgba(13,148,136,0.15)]",
      glowColor: "bg-teal-400/25",
      valueColor: "text-[#1E1B4B]",
    },
    {
      id: "disbursed",
      title: "Disbursed to Stores",
      value: `₹${(totalDisbursed / 100000).toFixed(2)}L`,
      icon: Wallet,
      iconColor: "text-white bg-gradient-to-tr from-[#049669] via-emerald-600 to-teal-600 border-emerald-400/40 shadow-md shadow-emerald-600/25",
      bgGradient: "from-emerald-50/70 via-white/85 to-white/60",
      accentBorder: "border-emerald-200/80 hover:border-emerald-400 hover:shadow-[0_16px_36px_rgba(4,150,105,0.15)]",
      glowColor: "bg-emerald-400/20",
      valueColor: "text-[#1E1B4B]",
    },
    {
      id: "pending-payouts",
      title: "Pending Release",
      value: `₹${(totalPending / 1000).toFixed(1)}k`,
      icon: Clock,
      iconColor: "text-white bg-gradient-to-tr from-amber-500 to-amber-400 border-amber-300 shadow-md shadow-amber-500/25",
      bgGradient: "from-amber-50/90 via-white/85 to-white/60",
      accentBorder: "border-amber-200/80 hover:border-amber-400 hover:shadow-[0_16px_36px_rgba(245,158,11,0.15)]",
      glowColor: "bg-amber-400/25",
      valueColor: "text-amber-600",
    },
  ];

  const methodsList = ["NEFT / RTGS", "UPI Auto-Payout", "IMPS Fast Pay"];

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
            {/* Coded Welcome Banner */}
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
                  <linearGradient id="payBannerBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1B744A" />
                    <stop offset="40%" stopColor="#228C52" />
                    <stop offset="100%" stopColor="#2CA85C" />
                  </linearGradient>
                  <linearGradient id="payWaveHighlight" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#38C260" stopOpacity="0.5" />
                    <stop offset="60%" stopColor="#259452" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="payWaveDeep" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#114E30" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#186740" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <rect width="1024" height="200" fill="url(#payBannerBgGrad)" />
                <path
                  d="M 0 200 C 240 185 380 130 620 160 C 800 182 920 150 1024 115 L 1024 200 Z"
                  fill="url(#payWaveDeep)"
                />
                <path
                  d="M 280 0 C 420 75 600 40 740 100 C 870 155 945 85 1024 40 L 1024 0 Z"
                  fill="url(#payWaveHighlight)"
                />
                <path
                  d="M 0 0 C 300 0 420 120 670 80 C 850 50 930 20 1024 0 Z"
                  fill="white"
                  fillOpacity="0.07"
                />
              </svg>

              {/* Specular glass reflection */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-200/60 to-transparent" />

              {/* Right 3D Payments Artwork - Transparent PNG */}
              <div className="absolute right-3 sm:right-6 lg:right-10 top-1/2 -translate-y-1/2 h-[90%] sm:h-[94%] lg:h-[98%] w-auto max-w-[38%] sm:max-w-[42%] lg:max-w-[45%] pointer-events-none select-none z-10 hidden sm:flex items-center justify-end">
                <img
                  src={bannerAdminPaymentsImg}
                  alt="Payments Management 3D artwork"
                  className="h-full w-auto object-contain object-right drop-shadow-[0_12px_24px_rgba(0,0,0,0.22)]"
                />
              </div>

              {/* Left Content Area */}
              <div className="relative z-10 flex-1 flex flex-col justify-between max-w-xl">
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-emerald-100">
                      FINANCIAL SETTLEMENTS &amp; DISBURSEMENTS
                    </span>
                    <span className="w-7 h-[1.5px] bg-emerald-200/80 rounded-full inline-block" />
                  </div>

                  <h1 className="text-xl sm:text-2xl lg:text-[30px] font-black tracking-tight text-white leading-tight drop-shadow-sm">
                    Financial Settlements
                  </h1>

                  <p className="text-xs sm:text-[13px] text-emerald-50/95 font-medium leading-relaxed max-w-md lg:max-w-lg">
                    Monitor gross multi-vendor sales turnover, review merchant transactions, and manage bank settlement disbursements.
                  </p>
                </div>

                <div className="pt-3.5 sm:pt-4 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setIsInitiateModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-white text-[#049669] hover:text-[#03704f] hover:bg-emerald-50 font-bold text-xs sm:text-sm shadow-md shadow-emerald-950/20 hover:shadow-lg hover:scale-[1.02] active:scale-98 transition-all duration-200 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Initiate Vendor Payout</span>
                  </button>

                  <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/40 backdrop-blur-md border border-emerald-300/30 text-emerald-100 text-xs font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Auto-Settlement Gateway Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Cards Component */}
            <Cards stats={paymentStats} />

            {/* Settlements Directory Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-5">
              {/* Filter Controls Row */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Status Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 [scrollbar-width:none]">
                  {[
                    { id: "all", label: "All Settlements", count: settlements.length },
                    { id: "completed", label: "Completed", count: settlements.filter((s) => s.status === "Completed").length },
                    { id: "processing", label: "Processing", count: settlements.filter((s) => s.status === "Processing").length },
                    { id: "pending release", label: "Pending Release", count: settlements.filter((s) => s.status === "Pending Release").length },
                  ].map((tab) => {
                    const isActive = statusFilter === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setStatusFilter(tab.id)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                          isActive
                            ? "bg-[#049669] text-white shadow-sm shadow-emerald-700/20"
                            : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Right: Search and Method Filter */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <select
                    value={methodFilter}
                    onChange={(e) => setMethodFilter(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:bg-white focus:outline-none focus:border-[#049669] transition cursor-pointer"
                  >
                    <option value="all">All Channels</option>
                    {methodsList.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>

                  <div className="relative min-w-[200px] sm:min-w-[240px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search store, ID, UTR..."
                      className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-full border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:border-[#049669] focus:ring-1 focus:ring-[#049669] transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Bulk Actions Bar if items selected */}
              {selectedIds.length > 0 && (
                <div className="p-3 bg-red-50/70 border border-red-200/80 rounded-xl flex items-center justify-between gap-3 text-xs animate-in fade-in">
                  <span className="font-bold text-red-700">
                    {selectedIds.length} settlement{selectedIds.length > 1 ? "s" : ""} selected
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleBulkDelete}
                      className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                    <button
                      onClick={() => setSelectedIds([])}
                      className="px-2 py-1 text-slate-500 hover:text-slate-700 font-semibold cursor-pointer"
                    >
                      Deselect
                    </button>
                  </div>
                </div>
              )}

              {/* Settlements Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
                      <th className="py-3 px-3 w-8">
                        <input
                          type="checkbox"
                          checked={
                            filteredSettlements.length > 0 &&
                            selectedIds.length === filteredSettlements.length
                          }
                          onChange={handleSelectAll}
                          className="rounded text-[#049669] focus:ring-[#049669] cursor-pointer"
                        />
                      </th>
                      <th className="py-3 px-3">Payout ID</th>
                      <th className="py-3 px-3">Merchant Store</th>
                      <th className="py-3 px-3">Gross Sales</th>
                                            <th className="py-3 px-3">Net Disbursed</th>
                      <th className="py-3 px-3">Payout Channel</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredSettlements.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="py-12 text-center text-slate-400">
                          <CircleDollarSign className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                          <p className="font-semibold text-slate-600">No settlement records found</p>
                          <p className="text-[11px]">Try adjusting your search query or channel filter.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredSettlements.map((settlement) => {
                        const isSelected = selectedIds.includes(settlement.id);
                        const isPending = settlement.status === "Pending Release";

                        return (
                          <tr
                            key={settlement.id}
                            className={`hover:bg-slate-50/70 transition-colors ${
                              isSelected ? "bg-emerald-50/20" : ""
                            }`}
                          >
                            <td className="py-3.5 px-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleSelectRow(settlement.id)}
                                className="rounded text-[#049669] focus:ring-[#049669] cursor-pointer"
                              />
                            </td>

                            {/* Payout ID */}
                            <td className="py-3.5 px-3">
                              <span className="font-mono font-bold text-slate-800">
                                {settlement.id}
                              </span>
                              <div className="text-[10px] text-slate-400">
                                {settlement.date}
                              </div>
                            </td>

                            {/* Store Name & Initial Avatar */}
                            <td className="py-3.5 px-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#049669] font-black flex items-center justify-center shrink-0 border border-emerald-200/50">
                                  {settlement.storeName.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-bold text-slate-800 text-xs truncate">
                                    {settlement.storeName}
                                  </div>
                                  <span className="text-[10px] text-slate-400">
                                    {settlement.ownerName}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Gross Sales */}
                            <td className="py-3.5 px-3 font-semibold text-slate-700">
                              {settlement.grossAmount}
                            </td>



                            {/* Net Disbursed */}
                            <td className="py-3.5 px-3">
                              <span className="font-black text-xs sm:text-[13px] text-slate-900">
                                {settlement.netPayout}
                              </span>
                            </td>

                            {/* Method */}
                            <td className="py-3.5 px-3">
                              <div className="font-medium text-slate-700 flex items-center gap-1">
                                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                <span>{settlement.method}</span>
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                {settlement.bankDetails}
                              </div>
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-3">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                  settlement.status === "Completed"
                                    ? "bg-emerald-50 text-[#049669] border-emerald-200/80"
                                    : settlement.status === "Processing"
                                    ? "bg-teal-50 text-teal-700 border-teal-200/80"
                                    : "bg-amber-50 text-amber-700 border-amber-200/80"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    settlement.status === "Completed"
                                      ? "bg-[#049669]"
                                      : settlement.status === "Processing"
                                      ? "bg-teal-500"
                                      : "bg-amber-500 animate-pulse"
                                  }`}
                                />
                                <span>{settlement.status}</span>
                              </span>
                            </td>

                            {/* Row Actions */}
                            <td className="py-3.5 px-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                {isPending && (
                                  <button
                                    onClick={() => handleReleasePayout(settlement.id)}
                                    title="Release Payout Now"
                                    className="px-2 py-1 rounded-md text-[11px] font-bold bg-[#049669] hover:bg-[#03704f] text-white flex items-center gap-1 transition shadow-xs cursor-pointer"
                                  >
                                    <Check className="w-3 h-3 stroke-[3]" />
                                    <span>Release</span>
                                  </button>
                                )}
                                <button
                                  onClick={() => setViewingSettlement(settlement)}
                                  title="View Statement Details"
                                  className="w-7 h-7 rounded-lg text-slate-400 hover:text-[#049669] hover:bg-emerald-50 flex items-center justify-center transition cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>
                  Showing {filteredSettlements.length} of {settlements.length} disbursement records
                </span>
                <span className="text-[11px]">
                  Automated Gateway Protocol: RBI RTGS / IMPS API 2.0
                </span>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* MODAL 1: Initiate Vendor Payout Modal */}
      {isInitiateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#049669] flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">Initiate Vendor Settlement</h3>
                  <p className="text-xs text-slate-400">Disburse verified store revenues to merchant bank</p>
                </div>
              </div>
              <button
                onClick={() => setIsInitiateModalOpen(false)}
                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInitiateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Merchant Store *</label>
                <select
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#049669]"
                >
                  <option value="Best Deals Superstore">Best Deals Superstore (HDFC •••• 4829)</option>
                  <option value="Organic Bliss Farm">Organic Bliss Farm (ICICI •••• 1920)</option>
                  <option value="Fresh Dairy Direct">Fresh Dairy Direct (SBI •••• 7741)</option>
                  <option value="Spice & Masala Heritage">Spice & Masala Heritage (Axis •••• 3310)</option>
                  <option value="City Munchies & Snacks">City Munchies & Snacks (HDFC •••• 5531)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gross Sales Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={formData.grossAmount}
                    onChange={(e) => setFormData({ ...formData, grossAmount: e.target.value })}
                    placeholder="e.g. 25000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#049669]"
                  />
                </div>

              </div>

              {formData.grossAmount && (
                <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-slate-600 text-[11px]">
                  <div className="flex justify-between font-black text-xs text-slate-800 pt-1">
                    <span>Disbursed Payout Amount:</span>
                    <span className="text-[#049669]">
                      ₹{(parseFloat(formData.grossAmount) || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Disbursement Channel</label>
                  <select
                    value={formData.method}
                    onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#049669]"
                  >
                    {methodsList.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Destination Account</label>
                  <input
                    type="text"
                    value={formData.bankDetails}
                    onChange={(e) => setFormData({ ...formData, bankDetails: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#049669]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Settlement Memo / Notes</label>
                <input
                  type="text"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#049669]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsInitiateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#049669] hover:bg-[#03704f] text-white font-bold shadow-md shadow-emerald-700/20 transition cursor-pointer"
                >
                  Disburse Payout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: View Settlement Details Modal */}
      {viewingSettlement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#049669] to-[#10B981] text-white font-black text-lg flex items-center justify-center shadow-md shadow-emerald-600/25">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">Settlement Details</h3>
                  <span className="text-[11px] text-slate-400 font-mono">Reference: {viewingSettlement.id}</span>
                </div>
              </div>
              <button
                onClick={() => setViewingSettlement(null)}
                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Net Transferred to Store</span>
                <span className="text-xl font-black text-[#049669]">{viewingSettlement.netPayout}</span>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Merchant Store</span>
                  <span className="font-bold text-slate-700">{viewingSettlement.storeName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Store Owner</span>
                  <span className="font-semibold text-slate-700">{viewingSettlement.ownerName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Gross Sales Value</span>
                  <span className="font-bold text-slate-700">{viewingSettlement.grossAmount}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Disbursement Channel</span>
                  <span className="font-medium text-slate-700">{viewingSettlement.method}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Destination Account</span>
                  <span className="font-mono text-slate-700">{viewingSettlement.bankDetails}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Banking UTR Reference</span>
                  <span className="font-mono text-slate-700 font-bold">{viewingSettlement.utr}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Settlement Date</span>
                  <span className="font-medium text-slate-700">{viewingSettlement.date}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Settlement Status</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                      viewingSettlement.status === "Completed"
                        ? "bg-emerald-50 text-[#049669]"
                        : viewingSettlement.status === "Processing"
                        ? "bg-teal-50 text-teal-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {viewingSettlement.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setViewingSettlement(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-md transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
