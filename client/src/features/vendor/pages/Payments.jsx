import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Cards from "../components/Cards";
import bannerPaymentsImg from "../../../assets/banner-payments-3d.png";
import orderService from "../../../services/orderService";
import {
  Wallet,
  Clock,
  CheckCircle2,
  Search,
  Grid,
  List,
  RefreshCw,
} from "lucide-react";

const formatPaymentStatus = (status) => {
  if (status?.toLowerCase() === "completed") return "Completed";
  if (status?.toLowerCase() === "failed") return "Failed";
  return "Pending";
};

const formatPaymentMethod = (method) => {
  if (method?.toLowerCase() === "cod") return "Cash on Delivery";
  if (method?.toLowerCase() === "razorpay") return "Razorpay";
  return method || "Unavailable";
};

const mapVendorPayments = (orderItems = []) => {
  const groupedPayments = new Map();

  orderItems.forEach((item) => {
    const order = item.order || {};
    const orderId = order.id ?? item.orderId;
    if (orderId == null) return;

    if (!groupedPayments.has(orderId)) {
      groupedPayments.set(orderId, {
        id: order.orderNumber || `ORD-${orderId}`,
        amount: 0,
        itemCount: 0,
        method: formatPaymentMethod(order.paymentMethod),
        status: formatPaymentStatus(order.paymentStatus),
        date: order.createdAt ? new Date(order.createdAt).toLocaleString("en-IN") : "Date unavailable",
        items: [],
        customer: order.user?.name || "Customer",
      });
    }

    const payment = groupedPayments.get(orderId);
    const itemTotal = Number(item.totalPrice) || 0;
    payment.amount += itemTotal;
    payment.itemCount += Number(item.quantity) || 0;
    payment.items.push(item.productName || item.variantName || "Product");
  });

  return Array.from(groupedPayments.values()).map((payment) => ({
    ...payment,
    amountLabel: `₹${payment.amount.toLocaleString("en-IN")}`,
  }));
};

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedMethod, setSelectedMethod] = useState("All");
  const [viewMode, setViewMode] = useState("table"); // "table" or "grid"
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  }, []);

  const loadPayments = useCallback(async (showSuccess = false) => {
    if (showSuccess) {
      setIsLoading(true);
      setLoadError("");
    }
    try {
      const response = await orderService.getVendorOrders({ limit: 50 });
      const orderItems = [...(response.orderItems || [])];
      for (let page = 2; page <= (response.totalPages || 1); page += 1) {
        const nextPage = await orderService.getVendorOrders({ page, limit: 50 });
        orderItems.push(...(nextPage.orderItems || []));
      }
      setPayments(mapVendorPayments(orderItems));
      if (showSuccess) showToast("Payment records refreshed.");
    } catch (error) {
      setLoadError(error.message || "Failed to load payment records.");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  // Status Pill Styling
  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-50 text-[#049669] border-emerald-200/80";
      case "Processing":
        return "bg-teal-50 text-[#059669] border-teal-200/80";
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200/80";
      case "Failed":
        return "bg-rose-50 text-rose-700 border-rose-200/80";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  // Filter Logic
  const filteredPayments = payments.filter((pay) => {
    const matchesSearch =
      pay.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pay.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pay.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pay.items.some((item) => item.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      selectedStatus === "All" || pay.status === selectedStatus;

    const matchesMethod = selectedMethod === "All" || pay.method === selectedMethod;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  const completedPaymentSum = payments
    .filter((p) => p.status === "Completed")
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPaymentSum = payments
    .filter((p) => p.status === "Pending")
    .reduce((sum, p) => sum + p.amount, 0);

  const paymentStats = [
    {
      id: "completed_payments",
      title: "Completed Order Payments",
      value: `₹${completedPaymentSum.toLocaleString("en-IN")}`,
      icon: Wallet,
      iconColor: "text-white bg-gradient-to-tr from-[#049669] to-[#10B981] border-emerald-400/40 shadow-md shadow-emerald-600/25",
      bgGradient: "from-emerald-50/90 via-white/85 to-white/60",
      accentBorder: "border-emerald-200/80 hover:border-emerald-400 hover:shadow-[0_16px_36px_rgba(4,150,105,0.15)]",
      glowColor: "bg-emerald-400/25",
      valueColor: "text-[#049669]",
    },
    {
      id: "vendor_orders",
      title: "Orders with Payments",
      value: `${payments.length} Orders`,
      icon: CheckCircle2,
      iconColor: "text-white bg-gradient-to-tr from-[#059669] to-teal-500 border-teal-400/40 shadow-md shadow-teal-600/25",
      bgGradient: "from-teal-50/90 via-white/85 to-white/60",
      accentBorder: "border-teal-200/80 hover:border-teal-400 hover:shadow-[0_16px_36px_rgba(13,148,136,0.15)]",
      glowColor: "bg-teal-400/25",
      valueColor: "text-[#1E1B4B]",
    },
    {
      id: "pending_payments",
      title: "Pending Customer Payments",
      value: `₹${pendingPaymentSum.toLocaleString("en-IN")}`,
      valueColor: pendingPaymentSum > 0 ? "text-amber-600" : "text-[#1E1B4B]",
      icon: Clock,
      iconColor: "text-white bg-gradient-to-tr from-amber-500 to-amber-400 border-amber-300 shadow-md shadow-amber-500/25",
      bgGradient: "from-amber-50/90 via-white/85 to-white/60",
      accentBorder: "border-amber-200/80 hover:border-amber-400 hover:shadow-[0_16px_36px_rgba(245,158,11,0.15)]",
      glowColor: "bg-amber-400/25",
    },
    {
      id: "failed_payments",
      title: "Failed Customer Payments",
      value: `${payments.filter((payment) => payment.status === "Failed").length} Orders`,
      icon: Clock,
      iconColor: "text-white bg-gradient-to-tr from-[#049669] via-emerald-600 to-teal-600 border-emerald-400/40 shadow-md shadow-emerald-600/25",
      bgGradient: "from-emerald-50/70 via-white/85 to-white/60",
      accentBorder: "border-emerald-200/80 hover:border-emerald-400 hover:shadow-[0_16px_36px_rgba(4,150,105,0.15)]",
      glowColor: "bg-emerald-400/20",
      valueColor: "text-[#1E1B4B]",
    },
  ];

  return (
    <div className="h-screen w-full bg-white flex flex-col font-['Poppins',sans-serif] text-slate-800 relative overflow-hidden">
      {/* Background Ambient Glow Orbs for Glassy Backdrop Blur */}
      <div className="pointer-events-none absolute -left-20 top-0 w-[450px] h-[450px] rounded-full bg-gradient-to-br from-emerald-400/15 to-teal-300/10 blur-3xl z-0" />
      <div className="pointer-events-none absolute right-10 top-20 w-[420px] h-[420px] rounded-full bg-gradient-to-bl from-teal-400/15 to-emerald-300/10 blur-3xl z-0" />
      <div className="pointer-events-none absolute left-1/3 bottom-10 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-emerald-300/15 to-teal-200/10 blur-3xl z-0" />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-[#049669] px-5 py-3.5 text-white shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="h-5 w-5 text-emerald-200 shrink-0" />
          <p className="text-xs sm:text-sm font-bold">{toastMessage}</p>
        </div>
      )}

      {/* Full Top Navbar */}
      <Navbar onToggleSidebar={() => setIsSidebarOpen(true)} />

      {/* Body Area below Navbar: Sidebar on left, Content on right */}
      <div className="flex-1 flex min-h-0 relative z-10 overflow-hidden">
        {/* Persistent Stationary Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Right Main Content */}
        <div className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto relative z-10">

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6   w-full mx-auto">
          {/* Welcome Banner Created with pure Code & SVG (High-Resolution Coded Banner) */}
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
                <linearGradient id="paymentsBannerBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1B744A" />
                  <stop offset="40%" stopColor="#228C52" />
                  <stop offset="100%" stopColor="#2CA85C" />
                </linearGradient>
                <linearGradient id="paymentsWaveHighlight" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38C260" stopOpacity="0.5" />
                  <stop offset="60%" stopColor="#259452" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="paymentsWaveDeep" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#114E30" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#186740" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </linearGradient>
              </defs>

              <rect width="1024" height="200" fill="url(#paymentsBannerBgGrad)" />
              <path
                d="M 0 200 C 240 185 380 130 620 160 C 800 182 920 150 1024 115 L 1024 200 Z"
                fill="url(#paymentsWaveDeep)"
              />
              <path
                d="M 280 0 C 420 75 600 40 740 100 C 870 155 945 85 1024 40 L 1024 0 Z"
                fill="url(#paymentsWaveHighlight)"
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
            <div className="absolute right-2 sm:right-6 lg:right-10 top-1/2 -translate-y-1/2 h-[90%] sm:h-[94%] lg:h-[98%] w-auto max-w-[38%] sm:max-w-[42%] lg:max-w-[45%] pointer-events-none select-none z-10 hidden sm:flex items-center justify-end">
              <img
                src={bannerPaymentsImg}
                alt="Payments 3D artwork"
                className="h-full w-auto object-contain object-right drop-shadow-[0_12px_24px_rgba(0,0,0,0.22)]"
              />
            </div>

            {/* Left Content Area */}
            <div className="relative z-10 flex-1 flex flex-col justify-between max-w-xl">
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-emerald-100">
                    FINANCIAL SETTLEMENTS
                  </span>
                  <span className="w-7 h-[1.5px] bg-emerald-200/80 rounded-full inline-block" />
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-[30px] font-black tracking-tight text-white leading-tight drop-shadow-sm">
                  Order Payment History
                </h1>

                <p className="text-xs sm:text-[13px] text-emerald-50/95 font-medium leading-relaxed max-w-md lg:max-w-lg">
                  View payment status and your product total for orders from your store.
                </p>
              </div>
              <button
                type="button"
                onClick={() => loadPayments(true)}
                disabled={isLoading}
                className="relative z-10 inline-flex items-center gap-2 self-start px-4 py-2 rounded-full bg-white text-[#049669] font-bold text-xs shadow-md transition hover:bg-emerald-50 disabled:opacity-60"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                Refresh Payments
              </button>
            </div>
          </div>

          {/* Metric Stats Cards Reusing Shared Cards Component */}
          <Cards stats={paymentStats} />

          {loadError && (
            <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {loadError}
            </div>
          )}

          {/* Search, Filter & View Controls */}
          <div className="bg-white/60 backdrop-blur-2xl rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-white/80 shadow-[0_8px_30px_rgba(4,150,105,0.06)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 relative overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by order, customer, product, or payment method..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 bg-white/80 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#049669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
              />
            </div>

            {/* Filter Dropdowns & View Mode Toggle */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-10 px-3 rounded-lg border border-slate-200 bg-white/80 text-xs font-medium text-slate-700 focus:border-[#049669] focus:ring-2 focus:ring-emerald-500/15 outline-none cursor-pointer"
              >
                <option value="All">All Statuses ({payments.length})</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>

              {/* Method Filter */}
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="h-10 px-3 rounded-lg border border-slate-200 bg-white/80 text-xs font-medium text-slate-700 focus:border-[#049669] focus:ring-2 focus:ring-emerald-500/15 outline-none cursor-pointer"
              >
                <option value="All">All Payment Methods</option>
                <option value="Cash on Delivery">Cash on Delivery</option>
                <option value="Razorpay">Razorpay</option>
              </select>

              {/* View Toggle */}
              <div className="flex items-center rounded-lg border border-slate-200 bg-white/80 p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-md transition cursor-pointer ${
                    viewMode === "table"
                      ? "bg-emerald-50 text-[#049669] shadow-2xs font-bold"
                      : "text-slate-400 hover:text-slate-700"
                  }`}
                  aria-label="Table View"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-emerald-50 text-[#049669] shadow-2xs font-bold"
                      : "text-slate-400 hover:text-slate-700"
                  }`}
                  aria-label="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ================= PAYMENTS CONTENT: TABLE VIEW ================= */}
          {viewMode === "table" ? (
            <div className="bg-white/60 backdrop-blur-2xl rounded-xl sm:rounded-2xl border border-white/80 shadow-[0_8px_30px_rgba(4,150,105,0.06)] overflow-hidden relative">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-emerald-50/40 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-4 sm:px-6">Order ID &amp; Date</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Payment Method</th>
                      <th className="py-3.5 px-4">Your Items Total</th>
                      <th className="py-3.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                    {filteredPayments.map((pay) => (
                        <tr
                          key={pay.id}
                          className="transition-colors group hover:bg-emerald-50/30"
                        >
                          <td className="py-3.5 px-4 sm:px-6">
                            <span className="font-extrabold text-[#1E1B4B] block group-hover:text-[#049669] transition-colors">
                              {pay.id}
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">
                              {pay.date}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="text-xs font-semibold text-slate-700">
                              {pay.customer}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="text-xs font-semibold text-slate-700">
                              {pay.method}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-black text-[#049669] text-sm sm:text-base">
                              {pay.amountLabel}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold border ${getStatusBadge(
                                pay.status
                              )}`}
                            >
                              {pay.status}
                            </span>
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* ================= PAYMENTS CONTENT: GRID / CARDS VIEW ================= */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {filteredPayments.map((pay) => (
                  <div
                    key={pay.id}
                    className="backdrop-blur-2xl rounded-2xl p-4 sm:p-5 border shadow-[0_8px_30px_rgba(4,150,105,0.06)] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(4,150,105,0.12)] transition-all duration-300 relative overflow-hidden flex flex-col justify-between group bg-white/70 border-white/80 hover:border-emerald-300"
                  >
                    {/* Top glass edge highlight */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/90 to-transparent" />

                    {/* Ambient corner glow */}
                    <div className="pointer-events-none absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-emerald-400/10 blur-xl group-hover:scale-125 transition-transform duration-500" />

                    <div className="relative z-10">
                      {/* Header: Order ID, Date & Status */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <span className="font-black text-[#1E1B4B] text-sm group-hover:text-[#049669] transition-colors block leading-tight">
                            {pay.id}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">
                            {pay.date}
                          </span>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs ${getStatusBadge(
                            pay.status
                          )}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              pay.status === "Completed"
                                ? "bg-[#049669]"
                                : pay.status === "Failed"
                                ? "bg-rose-500"
                                : "bg-amber-500"
                            }`}
                          />
                          {pay.status}
                        </span>
                      </div>

                      {/* Prominent Amount Box with Gradient Glow */}
                      <div className="my-3 p-3.5 rounded-xl bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-transparent border border-emerald-100/70 shadow-2xs">
                        <span className="text-2xl sm:text-3xl font-black text-[#049669] tracking-tight block">
                          {pay.amountLabel}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="text-xs font-bold text-[#1E1B4B] truncate">
                            {pay.method}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                          {pay.customer}
                        </span>
                      </div>

                      {/* Order payment details */}
                      <div className="space-y-1.5 text-[11px] p-2.5 rounded-xl bg-slate-50/60 border border-slate-100/80">
                        <div className="flex justify-between items-center text-slate-500">
                          <span>Your items:</span>
                          <span className="font-bold text-slate-800">{pay.itemCount}</span>
                        </div>
                        <div className="pt-1 border-t border-slate-200/60 text-slate-500">
                          <span className="font-semibold">Products: </span>
                          <span className="text-slate-700">{pay.items.join(", ")}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between gap-2 relative z-10">
                      <span className="text-[10px] text-slate-400 font-medium">
                        Order payment • {pay.status}
                      </span>
                    </div>
                  </div>
              ))}
            </div>
          )}

          {isLoading && filteredPayments.length === 0 && (
            <div className="text-center py-16 bg-white/60 backdrop-blur-2xl rounded-2xl border border-white/80 p-8 shadow-sm text-sm text-slate-500">
              Loading payment records...
            </div>
          )}

          {!isLoading && filteredPayments.length === 0 && (
            <div className="text-center py-16 bg-white/60 backdrop-blur-2xl rounded-2xl border border-white/80 p-8 shadow-sm">
              <Wallet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">No order payments found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No payment records from your store's orders match your search or filter criteria.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>

    </div>
  );
}
