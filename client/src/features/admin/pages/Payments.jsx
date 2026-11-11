import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Cards from "../components/Cards";
import { adminService } from "../../../services";
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
  Package,
  ShoppingBag,
  RefreshCw,
  Banknote,
  User,
  MapPin,
  Calendar,
} from "lucide-react";
import bannerAdminPaymentsImg from "../../../assets/banner-admin-payments-3d.png";

export default function Payments() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const [viewMode, setViewMode] = useState("orders"); // "orders" | "customer"

  // Viewing transaction detail modal
  const [viewingTransaction, setViewingTransaction] = useState(null);

  // Scroll Animation & Parallax State
  const scrollContainerRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Fetch Live Database Product Purchase Payments
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAllPayments();
      if (res && Array.isArray(res.payments)) {
        setTransactions(res.payments);
      } else {
        setTransactions([]);
      }
    } catch (err) {
      console.error("Failed to load payments from DB:", err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

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
  const filteredTransactions = transactions.filter((t) => {
    if (statusFilter !== "all" && t.paymentStatus.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    if (methodFilter !== "all") {
      if (methodFilter === "razorpay" && !t.method.toLowerCase().includes("razorpay")) return false;
      if (methodFilter === "cod" && !t.method.toLowerCase().includes("cash")) return false;
    }
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const productMatches = (t.products || []).some(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.vendorName && p.vendorName.toLowerCase().includes(q))
      );
      return (
        t.id.toLowerCase().includes(q) ||
        (t.customerName && t.customerName.toLowerCase().includes(q)) ||
        (t.customerEmail && t.customerEmail.toLowerCase().includes(q)) ||
        (t.transactionId && t.transactionId.toLowerCase().includes(q)) ||
        (t.razorpayPaymentId && t.razorpayPaymentId.toLowerCase().includes(q)) ||
        productMatches
      );
    }
    return true;
  });

  // Selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredTransactions.map((t) => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Delete Transaction Record
  const handleDeleteTransaction = async (id, orderNumber) => {
    if (window.confirm(`Are you sure you want to delete purchase record "${orderNumber || id}"?`)) {
      try {
        await adminService.deletePayment(id);
      } catch (err) {
        // Fallback for UI state
      }
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} purchase record(s)?`)) {
      for (const id of selectedIds) {
        try {
          await adminService.deletePayment(id);
        } catch (e) {}
      }
      setTransactions((prev) => prev.filter((t) => !selectedIds.includes(t.id)));
      setSelectedIds([]);
    }
  };

  // Metrics Calculations
  const totalRevenue = transactions.reduce((acc, t) => acc + (t.grossRaw || 0), 0);
  const completedCount = transactions.filter((t) => t.paymentStatus === "completed").length;
  
  const razorpayTransactions = transactions.filter((t) =>
    t.method.toLowerCase().includes("razorpay")
  );
  const razorpayTotal = razorpayTransactions.reduce((acc, t) => acc + (t.grossRaw || 0), 0);

  const codTransactions = transactions.filter((t) =>
    t.method.toLowerCase().includes("cash")
  );
  const codTotal = codTransactions.reduce((acc, t) => acc + (t.grossRaw || 0), 0);

  const paymentStats = [
    {
      id: "platform-gmv",
      title: "Total Purchases (GMV)",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      change: `${transactions.length} Orders Placed`,
      isPositive: true,
      icon: CircleDollarSign,
      iconColor: "text-white bg-gradient-to-tr from-[#049669] to-[#10B981] border-emerald-400/40 shadow-md shadow-emerald-600/25",
      bgGradient: "from-emerald-50/90 via-white/85 to-white/60",
      accentBorder: "border-emerald-200/80 hover:border-emerald-400 hover:shadow-[0_16px_36px_rgba(4,150,105,0.15)]",
      glowColor: "bg-emerald-400/25",
      valueColor: "text-[#049669]",
    },
    {
      id: "razorpay-online",
      title: "Razorpay Online Paid",
      value: `₹${razorpayTotal.toLocaleString("en-IN")}`,
      change: `${razorpayTransactions.length} Verified Online`,
      isPositive: true,
      icon: CreditCard,
      iconColor: "text-white bg-gradient-to-tr from-[#059669] to-teal-500 border-teal-400/40 shadow-md shadow-teal-600/25",
      bgGradient: "from-teal-50/90 via-white/85 to-white/60",
      accentBorder: "border-teal-200/80 hover:border-teal-400 hover:shadow-[0_16px_36px_rgba(13,148,136,0.15)]",
      glowColor: "bg-teal-400/25",
      valueColor: "text-[#1E1B4B]",
    },
    {
      id: "cod-payments",
      title: "Cash on Delivery",
      value: `₹${codTotal.toLocaleString("en-IN")}`,
      change: `${codTransactions.length} COD Orders`,
      isPositive: true,
      icon: Banknote,
      iconColor: "text-white bg-gradient-to-tr from-amber-500 to-amber-400 border-amber-300 shadow-md shadow-amber-500/25",
      bgGradient: "from-amber-50/90 via-white/85 to-white/60",
      accentBorder: "border-amber-200/80 hover:border-amber-400 hover:shadow-[0_16px_36px_rgba(245,158,11,0.15)]",
      glowColor: "bg-amber-400/25",
      valueColor: "text-amber-600",
    },
    {
      id: "completed-orders",
      title: "Completed Orders",
      value: String(completedCount),
      change: `${transactions.length - completedCount} Pending`,
      isPositive: true,
      icon: CheckCircle2,
      iconColor: "text-white bg-gradient-to-tr from-[#049669] via-emerald-600 to-teal-600 border-emerald-400/40 shadow-md shadow-emerald-600/25",
      bgGradient: "from-emerald-50/70 via-white/85 to-white/60",
      accentBorder: "border-emerald-200/80 hover:border-emerald-400 hover:shadow-[0_16px_36px_rgba(4,150,105,0.15)]",
      glowColor: "bg-emerald-400/20",
      valueColor: "text-[#1E1B4B]",
    },
  ];

  // Customer-wise Aggregated Order Payments
  const customerPayments = React.useMemo(() => {
    const map = {};
    transactions.forEach((tx) => {
      const key = tx.customerEmail || tx.customerName || `cust_${tx.dbId}`;
      if (!map[key]) {
        map[key] = {
          key,
          name: tx.customerName || "Customer",
          email: tx.customerEmail || "N/A",
          phone: tx.customerPhone || "N/A",
          totalPaid: 0,
          ordersCount: 0,
          onlinePaid: 0,
          codPaid: 0,
          lastOrderDate: tx.date,
          latestOrderNumber: tx.orderNumber || tx.id,
          orders: [],
        };
      }
      const amt = tx.grossRaw || 0;
      map[key].totalPaid += amt;
      map[key].ordersCount += 1;
      if (tx.method.toLowerCase().includes("razorpay")) {
        map[key].onlinePaid += amt;
      } else {
        map[key].codPaid += amt;
      }
      map[key].orders.push(tx);
    });

    const list = Object.values(map);
    if (!searchQuery.trim()) return list.sort((a, b) => b.totalPaid - a.totalPaid);

    const q = searchQuery.toLowerCase();
    return list
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q)
      )
      .sort((a, b) => b.totalPaid - a.totalPaid);
  }, [transactions, searchQuery]);

  const statusTabs = [
    { id: "all", label: "All Transactions", count: transactions.length },
    {
      id: "completed",
      label: "Completed",
      count: transactions.filter((t) => t.paymentStatus === "completed").length,
    },
    {
      id: "pending",
      label: "Pending",
      count: transactions.filter((t) => t.paymentStatus === "pending").length,
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
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Right Main Content */}
        <div
          ref={scrollContainerRef}
          className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto relative z-10"
        >
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 w-full mx-auto">
            {/* Header Banner */}
            <div className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 min-h-[175px] sm:min-h-[190px] lg:min-h-[200px] flex flex-col justify-between overflow-hidden shadow-[0_16px_40px_rgba(4,150,105,0.22)] border border-emerald-400/30 group">
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
                </defs>
                <rect width="1024" height="200" fill="url(#payBannerBgGrad)" />
              </svg>

              <div className="absolute right-3 sm:right-6 lg:right-10 top-1/2 -translate-y-1/2 h-[90%] sm:h-[94%] lg:h-[98%] w-auto max-w-[38%] sm:max-w-[42%] lg:max-w-[45%] pointer-events-none select-none z-10 hidden sm:flex items-center justify-end">
                <img
                  src={bannerAdminPaymentsImg}
                  alt="Product Purchase Payments 3D artwork"
                  className="h-full w-auto object-contain object-right drop-shadow-[0_12px_24px_rgba(0,0,0,0.22)]"
                />
              </div>

              <div className="relative z-10 flex-1 flex flex-col justify-between max-w-xl">
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-emerald-100">
                      FINANCIAL REVENUES &amp; TRANSACTIONS
                    </span>
                    <span className="w-7 h-[1.5px] bg-emerald-200/80 rounded-full inline-block" />
                  </div>

                  <h1 className="text-xl sm:text-2xl lg:text-[30px] font-black tracking-tight text-white leading-tight drop-shadow-sm">
                    Product Purchase Transactions
                  </h1>

                  <p className="text-xs sm:text-[13px] text-emerald-50/95 font-medium leading-relaxed max-w-md lg:max-w-lg">
                    Live database records. Monitor customer product checkouts, Razorpay online
                    payments, Cash on Delivery receipts, and order breakdowns.
                  </p>
                </div>

                <div className="pt-3.5 sm:pt-4 flex flex-wrap items-center gap-3">
                  <button
                    onClick={fetchPayments}
                    title="Reload from Database"
                    className="inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-white text-[#049669] hover:text-[#03704f] hover:bg-emerald-50 font-bold text-xs sm:text-sm shadow-md shadow-emerald-950/20 hover:shadow-lg hover:scale-[1.02] active:scale-98 transition-all duration-200 cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 stroke-[2.5] ${loading ? "animate-spin" : ""}`} />
                    <span>Refresh DB Records</span>
                  </button>

                  <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/40 backdrop-blur-md border border-emerald-300/30 text-emerald-100 text-xs font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Razorpay API 2.0 &amp; COD Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Cards */}
            <Cards stats={paymentStats} />

            {/* Transactions Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-5">
              
              {/* View Mode Switcher Header: Customer Summary vs Order Payments */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/70 w-fit">
                  <button
                    type="button"
                    onClick={() => setViewMode("orders")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      viewMode === "orders"
                        ? "bg-[#049669] text-white shadow-sm shadow-emerald-700/25"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>Order-wise Payments ({transactions.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("customer")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      viewMode === "customer"
                        ? "bg-[#049669] text-white shadow-sm shadow-emerald-700/25"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Customer-wise Summary ({customerPayments.length})</span>
                  </button>
                </div>

                <div className="text-xs font-medium text-slate-500">
                  {viewMode === "customer" ? (
                    <span>Grouped by customer: Total payment received per customer</span>
                  ) : (
                    <span>Individual order payment transactions from database</span>
                  )}
                </div>
              </div>

              {/* Filter Controls Row */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Status Tabs (shown for orders view) */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                  {statusTabs.map((tab) => {
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

                {/* Right: Method Filter and Search */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <select
                    value={methodFilter}
                    onChange={(e) => setMethodFilter(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:bg-white focus:outline-none focus:border-[#049669] transition cursor-pointer"
                  >
                    <option value="all">All Payment Methods</option>
                    <option value="razorpay">Razorpay (Online)</option>
                    <option value="cod">Cash on Delivery</option>
                  </select>

                  <div className="relative min-w-[220px] sm:min-w-[280px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search customer, order, product, txn..."
                      className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-full border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:border-[#049669] focus:ring-1 focus:ring-[#049669] transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Bulk Actions Bar if items selected */}
              {selectedIds.length > 0 && viewMode === "orders" && (
                <div className="p-3 bg-red-50/70 border border-red-200/80 rounded-xl flex items-center justify-between gap-3 text-xs animate-in fade-in">
                  <span className="font-bold text-red-700">
                    {selectedIds.length} transaction{selectedIds.length > 1 ? "s" : ""} selected
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

              {/* VIEW 1: CUSTOMER-WISE SUMMARY TABLE */}
              {viewMode === "customer" ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
                        <th className="py-3 px-3">Customer Details</th>
                        <th className="py-3 px-3">Orders Count</th>
                        <th className="py-3 px-3">Total Payment Received</th>
                        <th className="py-3 px-3">Payment Mode Breakdown</th>
                        <th className="py-3 px-3">Orders Placed</th>
                        <th className="py-3 px-3 text-right">Latest Payment Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {loading ? (
                        <tr>
                          <td colSpan="6" className="py-14 text-center text-slate-400">
                            <RefreshCw className="w-7 h-7 mx-auto text-[#049669] animate-spin mb-2" />
                            <p className="font-bold text-slate-700 text-xs">Loading Customer Payments...</p>
                            <p className="text-[11px] text-slate-400">Fetching customer purchase breakdown</p>
                          </td>
                        </tr>
                      ) : customerPayments.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="py-14 text-center text-slate-400">
                            <User className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                            <p className="font-semibold text-slate-600 text-xs">No customer payment records found</p>
                          </td>
                        </tr>
                      ) : (
                        customerPayments.map((cp) => (
                          <tr key={cp.key} className="hover:bg-slate-50/70 transition-colors">
                            {/* Customer Profile */}
                            <td className="py-3.5 px-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#049669] font-black flex items-center justify-center shrink-0 border border-emerald-200/60 uppercase text-xs">
                                  {cp.name?.charAt(0) || "C"}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900 text-xs sm:text-[13px]">
                                    {cp.name}
                                  </div>
                                  <div className="text-[11px] text-slate-500">
                                    {cp.email}
                                  </div>
                                  {cp.phone && cp.phone !== "N/A" && (
                                    <div className="text-[10px] text-slate-400 font-mono">
                                      {cp.phone}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Total Orders */}
                            <td className="py-3.5 px-3">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-700 border border-slate-200/80">
                                <Package className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{cp.ordersCount} Order{cp.ordersCount > 1 ? "s" : ""}</span>
                              </span>
                            </td>

                            {/* Total Payment Received */}
                            <td className="py-3.5 px-3">
                              <div className="text-sm sm:text-base font-black text-[#049669]">
                                ₹{cp.totalPaid.toLocaleString("en-IN")}
                              </div>
                              <div className="text-[10px] text-slate-400 font-semibold">
                                Total Payment Received
                              </div>
                            </td>

                            {/* Payment Mode Breakdown */}
                            <td className="py-3.5 px-3">
                              <div className="space-y-1">
                                {cp.onlinePaid > 0 && (
                                  <div className="flex items-center gap-1.5 text-[11px]">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                    <span className="font-medium text-slate-600">Online:</span>
                                    <span className="font-black text-emerald-700">₹{cp.onlinePaid.toLocaleString("en-IN")}</span>
                                  </div>
                                )}
                                {cp.codPaid > 0 && (
                                  <div className="flex items-center gap-1.5 text-[11px]">
                                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                                    <span className="font-medium text-slate-600">COD:</span>
                                    <span className="font-black text-amber-700">₹{cp.codPaid.toLocaleString("en-IN")}</span>
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Orders Placed Pills */}
                            <td className="py-3.5 px-3">
                              <div className="flex flex-wrap gap-1.5 max-w-[260px]">
                                {cp.orders.map((ord) => (
                                  <button
                                    key={ord.id}
                                    type="button"
                                    onClick={() => setViewingTransaction(ord)}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-50/90 text-emerald-800 text-[11px] font-bold border border-emerald-200/60 hover:bg-emerald-100 transition-colors cursor-pointer flex items-center gap-1"
                                    title="Click to view order details"
                                  >
                                    <span className="font-mono">{ord.orderNumber || ord.id}:</span>
                                    <span className="text-[#049669] font-black">{ord.grossAmount}</span>
                                  </button>
                                ))}
                              </div>
                            </td>

                            {/* Latest Payment Date */}
                            <td className="py-3.5 px-3 text-right">
                              <div className="text-xs font-semibold text-slate-700">
                                {cp.lastOrderDate}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* VIEW 2: ORDER TRANSACTIONS TABLE */
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
                        <th className="py-3 px-3 w-8">
                          <input
                            type="checkbox"
                            checked={
                              filteredTransactions.length > 0 &&
                              selectedIds.length === filteredTransactions.length
                            }
                            onChange={handleSelectAll}
                            className="rounded text-[#049669] focus:ring-[#049669] cursor-pointer"
                          />
                        </th>
                        <th className="py-3 px-3">Order &amp; Txn ID</th>
                        <th className="py-3 px-3">Customer Details</th>
                        <th className="py-3 px-3 min-w-[240px]">Products Purchased</th>
                        <th className="py-3 px-3">Payment Mode</th>
                        <th className="py-3 px-3">Payment Received (₹)</th>
                        <th className="py-3 px-3">Payment Status</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {loading ? (
                        <tr>
                          <td colSpan="8" className="py-14 text-center text-slate-400">
                            <RefreshCw className="w-7 h-7 mx-auto text-[#049669] animate-spin mb-2" />
                            <p className="font-bold text-slate-700 text-xs">Loading Database Transactions...</p>
                            <p className="text-[11px] text-slate-400">Fetching live purchase records</p>
                          </td>
                        </tr>
                      ) : filteredTransactions.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="py-14 text-center text-slate-400">
                            <CircleDollarSign className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                            <p className="font-semibold text-slate-600 text-xs">No product purchase transactions in database</p>
                            <p className="text-[11px] text-slate-400">When customers place orders with Razorpay or COD, real transactions will appear here.</p>
                          </td>
                        </tr>
                      ) : (
                        filteredTransactions.map((tx) => {
                          const isSelected = selectedIds.includes(tx.id);
                          const isRazorpay = tx.method.toLowerCase().includes("razorpay");
                          const isCompleted = tx.paymentStatus === "completed";

                          return (
                            <tr
                              key={tx.id}
                              className={`hover:bg-slate-50/70 transition-colors ${
                                isSelected ? "bg-emerald-50/20" : ""
                              }`}
                            >
                              <td className="py-3.5 px-3">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleSelectRow(tx.id)}
                                  className="rounded text-[#049669] focus:ring-[#049669] cursor-pointer"
                                />
                              </td>

                              {/* Order & Txn ID */}
                              <td className="py-3.5 px-3">
                                <div className="font-mono font-bold text-slate-800 text-xs">
                                  {tx.orderNumber || tx.id}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                  {tx.razorpayPaymentId ? (
                                    <span className="text-emerald-700 font-semibold">
                                      {tx.razorpayPaymentId}
                                    </span>
                                  ) : (
                                    tx.transactionId
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-400 mt-0.5">
                                  {tx.date}
                                </div>
                              </td>

                              {/* Customer Profile */}
                              <td className="py-3.5 px-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#049669] font-black flex items-center justify-center shrink-0 border border-emerald-200/50 uppercase text-xs">
                                    {tx.customerName?.charAt(0) || "C"}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="font-bold text-slate-800 text-xs truncate max-w-[150px]">
                                      {tx.customerName}
                                    </div>
                                    <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                                      {tx.customerEmail}
                                    </div>
                                    {tx.customerPhone && tx.customerPhone !== "N/A" && (
                                      <div className="text-[10px] text-slate-500 font-mono">
                                        {tx.customerPhone}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* Products Purchased & Vendor Store */}
                              <td className="py-3.5 px-3">
                                <div className="space-y-1 max-w-[280px]">
                                  {tx.products && tx.products.length > 0 ? (
                                    tx.products.map((p, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-center justify-between gap-1 text-[11px] bg-slate-50/80 rounded-md px-2 py-0.5 border border-slate-100"
                                      >
                                        <span className="font-semibold text-slate-700 truncate max-w-[160px]">
                                          {p.name} <span className="text-slate-400">×{p.qty}</span>
                                        </span>
                                        <span className="text-[10px] text-emerald-700 font-medium shrink-0">
                                          {p.vendorName}
                                        </span>
                                      </div>
                                    ))
                                  ) : (
                                    <span className="text-slate-400 text-[11px]">
                                      Product Order Items
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Payment Mode */}
                              <td className="py-3.5 px-3">
                                <div className="flex items-center gap-1.5">
                                  {isRazorpay ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#049669] border border-emerald-200/80">
                                      <CreditCard className="w-3 h-3" />
                                      <span>Razorpay (Online)</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80">
                                      <Banknote className="w-3 h-3" />
                                      <span>Cash on Delivery</span>
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Payment Received (Gross Amount) */}
                              <td className="py-3.5 px-3">
                                <div className="font-black text-[#049669] text-xs sm:text-[14px]">
                                  {tx.grossAmount}
                                </div>
                                <div className="text-[10px] text-slate-400 font-medium">
                                  Order Payment
                                </div>
                              </td>

                              {/* Payment Status */}
                              <td className="py-3.5 px-3">
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                    isCompleted
                                      ? "bg-emerald-50 text-[#049669] border-emerald-200/80"
                                      : "bg-amber-50 text-amber-700 border-amber-200/80"
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      isCompleted ? "bg-[#049669]" : "bg-amber-500 animate-pulse"
                                    }`}
                                  />
                                  <span className="capitalize">{tx.paymentStatus}</span>
                                </span>
                              </td>

                              {/* Actions */}
                              <td className="py-3.5 px-3 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => setViewingTransaction(tx)}
                                    title="View Order Details"
                                    className="w-7 h-7 rounded-lg text-slate-400 hover:text-[#049669] hover:bg-emerald-50 flex items-center justify-center transition cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTransaction(tx.id, tx.orderNumber)}
                                    title="Delete Transaction Record"
                                    className="w-7 h-7 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
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
              )}

              {/* Table Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>
                  Showing {filteredTransactions.length} of {transactions.length} product purchase records
                </span>
                <span className="text-[11px] font-medium text-emerald-700">
                  ShopMart MultiVendor Gateway Protocol v2.0
                </span>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* VIEW ORDER DETAILS MODAL */}
      {viewingTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#049669] to-[#10B981] text-white flex items-center justify-center shadow-md shadow-emerald-600/25">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">
                    Purchase Transaction Details
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Order Ref: {viewingTransaction.orderNumber || viewingTransaction.id}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setViewingTransaction(null)}
                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Grand Total Box */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">
                    Gross Order Amount
                  </span>
                  <span className="text-xl font-black text-[#049669]">
                    {viewingTransaction.grossAmount}
                  </span>
                </div>
                <span
                  className={`font-bold px-3 py-1 rounded-full text-xs uppercase ${
                    viewingTransaction.paymentStatus === "completed"
                      ? "bg-[#049669] text-white"
                      : "bg-amber-500 text-white"
                  }`}
                >
                  {viewingTransaction.paymentStatus}
                </span>
              </div>

              {/* Customer Info */}
              <div className="bg-slate-50/80 p-3 rounded-2xl space-y-1.5 border border-slate-100">
                <span className="block font-bold text-slate-700 text-[11px] uppercase">
                  Customer &amp; Shipping
                </span>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-400">Customer Name:</span>
                  <span className="font-bold text-slate-800">
                    {viewingTransaction.customerName}
                  </span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-semibold text-slate-700">
                    {viewingTransaction.customerEmail}
                  </span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-400">Phone:</span>
                  <span className="font-mono text-slate-700">
                    {viewingTransaction.customerPhone}
                  </span>
                </div>
                {(() => {
                  let addr = viewingTransaction.shippingAddress;
                  if (typeof addr === "string") {
                    try { addr = JSON.parse(addr); } catch(e) { return null; }
                  }
                  if (!addr) return null;
                  return (
                    <div className="flex justify-between py-0.5 border-t border-slate-200/60 pt-1 text-slate-500">
                      <span className="text-slate-400 shrink-0">Address:</span>
                      <span className="text-right font-medium text-slate-700 max-w-[240px]">
                        {[addr.addressLine1, addr.city, addr.state, addr.postalCode].filter(Boolean).join(", ")}
                      </span>
                    </div>
                  );
                })()}
              </div>

              {/* Payment Details */}
              <div className="bg-slate-50/80 p-3 rounded-2xl space-y-1.5 border border-slate-100">
                <span className="block font-bold text-slate-700 text-[11px] uppercase">
                  Payment Gateway Info
                </span>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-400">Payment Channel:</span>
                  <span className="font-bold text-emerald-800">
                    {viewingTransaction.method}
                  </span>
                </div>
                {viewingTransaction.razorpayPaymentId && (
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-400">Razorpay Payment ID:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {viewingTransaction.razorpayPaymentId}
                    </span>
                  </div>
                )}
                {viewingTransaction.razorpayOrderId && (
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-400">Razorpay Order ID:</span>
                    <span className="font-mono text-slate-700">
                      {viewingTransaction.razorpayOrderId}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-400">Transaction Date:</span>
                  <span className="font-medium text-slate-700">{viewingTransaction.date}</span>
                </div>
              </div>

              {/* Purchased Products List */}
              <div className="bg-slate-50/80 p-3 rounded-2xl space-y-2 border border-slate-100">
                <span className="block font-bold text-slate-700 text-[11px] uppercase">
                  Items Purchased ({viewingTransaction.products?.length || 0})
                </span>
                <div className="divide-y divide-slate-200/60 max-h-40 overflow-y-auto">
                  {viewingTransaction.products && viewingTransaction.products.length > 0 ? (
                    viewingTransaction.products.map((item, idx) => (
                      <div key={idx} className="py-1.5 flex items-center justify-between text-xs">
                        <div className="min-w-0 flex-1 pr-2">
                          <div className="font-bold text-slate-800 truncate">{item.name}</div>
                          <div className="text-[10px] text-slate-400">
                            Qty: {item.qty} × {item.price} • Vendor: {item.vendorName}
                          </div>
                        </div>
                        <span className="font-bold text-slate-800 shrink-0">
                          {item.total || item.price}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-400 py-1">No items details recorded</div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setViewingTransaction(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-md transition cursor-pointer"
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
