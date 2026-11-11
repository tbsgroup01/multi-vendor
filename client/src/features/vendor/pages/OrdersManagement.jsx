import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Cards from "../components/Cards";
import bannerOrdersImg from "../../../assets/banner-orders-3d.png";
import orderService from "../../../services/orderService";
import {
  ShoppingCart,
  Search,
  Grid,
  List,
  CheckCircle2,
  Clock,
  Truck,
  Eye,
  X,
  Phone,
  MapPin,
  PackageCheck,
  RefreshCw,
} from "lucide-react";

const formatStatus = (status) => {
  if (!status || status === "placed") return "Pending";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const formatPaymentStatus = (status) => {
  if (status === "completed") return "Paid";
  if (status === "failed") return "Failed";
  return formatStatus(status);
};

const formatAddress = (address) => {
  if (!address) return "Address unavailable";
  if (typeof address === "string") return address;
  return [
    address.addressLine1,
    address.addressLine2,
    address.city,
    address.state,
    address.postalCode,
  ]
    .filter(Boolean)
    .join(", ") || "Address unavailable";
};

const mapVendorOrderItems = (orderItems = []) => {
  const groupedOrders = new Map();

  orderItems.forEach((orderItem) => {
    const order = orderItem.order || {};
    const orderId = order.id ?? orderItem.orderId;
    if (orderId == null) return;

    if (!groupedOrders.has(orderId)) {
      const customer = order.user || {};
      groupedOrders.set(orderId, {
        id: order.orderNumber || `ORD-${orderId}`,
        orderItemIds: [],
        customer: {
          name: customer.name || "Customer",
          phone: customer.phone || "",
          email: customer.email || "",
          address: formatAddress(order.shippingAddress),
        },
        items: [],
        totalAmount: 0,
        paymentMethod: order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod || "N/A",
        paymentStatus: formatPaymentStatus(order.paymentStatus),
        statuses: new Set(),
        date: order.createdAt
          ? new Date(order.createdAt).toLocaleString("en-IN")
          : "Date unavailable",
        trackingId: "N/A",
      });
    }

    const groupedOrder = groupedOrders.get(orderId);
    const price = Number(orderItem.productPrice) || 0;
    const quantity = Number(orderItem.quantity) || 0;
    groupedOrder.orderItemIds.push(orderItem.id);
    groupedOrder.statuses.add(formatStatus(orderItem.status));
    groupedOrder.items.push({
      id: orderItem.id,
      name: orderItem.productName || orderItem.variantName || "Product",
      qty: quantity,
      price,
      totalPrice: Number(orderItem.totalPrice) || price * quantity,
    });
    groupedOrder.totalAmount += Number(orderItem.totalPrice) || price * quantity;
  });

  return Array.from(groupedOrders.values()).map((order) => ({
    ...order,
    status: order.statuses.size === 1 ? Array.from(order.statuses)[0] : "Mixed",
    totalAmount: `₹${order.totalAmount.toLocaleString("en-IN")}`,
  }));
};

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedPayment, setSelectedPayment] = useState("All");
  const [viewMode, setViewMode] = useState("table"); // "table" or "grid"
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Modal / Drawer state for Order Details
  const [activeOrder, setActiveOrder] = useState(null);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  }, []);

  const loadOrders = useCallback(async (showSuccess = false) => {
    setIsLoading(true);
    setLoadError("");
    try {
      const response = await orderService.getVendorOrders({ limit: 50 });
      const orderItems = [...(response.orderItems || [])];
      for (let page = 2; page <= (response.totalPages || 1); page += 1) {
        const nextPage = await orderService.getVendorOrders({ page, limit: 50 });
        orderItems.push(...(nextPage.orderItems || []));
      }
      setOrders(mapVendorOrderItems(orderItems));
      if (showSuccess) showToast("Orders refreshed successfully.");
    } catch (error) {
      setLoadError(error.message || "Failed to load orders.");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Status Pill Styling
  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-[#049669] border-emerald-200/80";
      case "Processing":
        return "bg-teal-50 text-[#059669] border-teal-200/80";
      case "Shipped":
        return "bg-sky-50 text-sky-700 border-sky-200/80";
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200/80";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200/80";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  // Filter logic
  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customer.phone.includes(searchQuery) ||
      ord.trackingId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === "All" || ord.status === selectedStatus;

    const matchesPayment =
      selectedPayment === "All" || ord.paymentStatus === selectedPayment;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Calculate Stats for Shared Cards Component
  const totalOrdersCount = orders.length;
  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const inTransitCount = orders.filter((o) => o.status === "Shipped" || o.status === "Processing").length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;

  const orderStats = [
    {
      id: "total_orders",
      title: "Total Orders",
      value: `${totalOrdersCount} Orders`,
      icon: ShoppingCart,
      iconColor: "text-white bg-gradient-to-tr from-[#049669] to-[#10B981] border-emerald-400/40 shadow-md shadow-emerald-600/25",
      bgGradient: "from-emerald-50/90 via-white/85 to-white/60",
      accentBorder: "border-emerald-200/80 hover:border-emerald-400 hover:shadow-[0_16px_36px_rgba(4,150,105,0.15)]",
      glowColor: "bg-emerald-400/25",
      valueColor: "text-[#049669]",
    },
    {
      id: "pending_orders",
      title: "Pending Dispatch",
      value: `${pendingCount} Pending`,
      valueColor: pendingCount > 0 ? "text-amber-600" : "text-slate-800",
      icon: Clock,
      iconColor: "text-white bg-gradient-to-tr from-amber-500 to-amber-400 border-amber-300 shadow-md shadow-amber-500/25",
      bgGradient: "from-amber-50/90 via-white/85 to-white/60",
      accentBorder: "border-amber-200/80 hover:border-amber-400 hover:shadow-[0_16px_36px_rgba(245,158,11,0.15)]",
      glowColor: "bg-amber-400/25",
    },
    {
      id: "in_transit",
      title: "In Transit / Shipped",
      value: `${inTransitCount} Active`,
      icon: Truck,
      iconColor: "text-white bg-gradient-to-tr from-[#059669] to-teal-500 border-teal-400/40 shadow-md shadow-teal-600/25",
      bgGradient: "from-teal-50/90 via-white/85 to-white/60",
      accentBorder: "border-teal-200/80 hover:border-teal-400 hover:shadow-[0_16px_36px_rgba(13,148,136,0.15)]",
      glowColor: "bg-teal-400/25",
      valueColor: "text-[#1E1B4B]",
    },
    {
      id: "delivered_orders",
      title: "Delivered & Done",
      value: `${deliveredCount} Delivered`,
      icon: CheckCircle2,
      iconColor: "text-white bg-gradient-to-tr from-[#049669] via-emerald-600 to-teal-600 border-emerald-400/40 shadow-md shadow-emerald-600/25",
      bgGradient: "from-emerald-50/70 via-white/85 to-white/60",
      accentBorder: "border-emerald-200/80 hover:border-emerald-400 hover:shadow-[0_16px_36px_rgba(4,150,105,0.15)]",
      glowColor: "bg-emerald-400/20",
      valueColor: "text-[#1E1B4B]",
    },
  ];

  const handleUpdateStatus = async (id, newStatus) => {
    const order = orders.find((item) => item.id === id);
    if (!order) return;

    setUpdatingOrderId(id);
    const results = await Promise.allSettled(
      order.orderItemIds.map((orderItemId) =>
        orderService.updateOrderItemStatus(orderItemId, newStatus.toLowerCase())
      )
    );
    const failedUpdate = results.find((result) => result.status === "rejected");

    if (failedUpdate) {
      await loadOrders();
      showToast(failedUpdate.reason?.message || "Failed to update order status.");
    } else {
      const updatedOrder = { ...order, status: newStatus };
      setOrders((prev) => prev.map((item) => item.id === id ? updatedOrder : item));
      setActiveOrder((prev) => prev?.id === id ? updatedOrder : prev);
      showToast(`Order ${id} updated to "${newStatus}".`);
    }
    setUpdatingOrderId(null);
  };

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
                <linearGradient id="ordersBannerBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1B744A" />
                  <stop offset="40%" stopColor="#228C52" />
                  <stop offset="100%" stopColor="#2CA85C" />
                </linearGradient>
                <linearGradient id="ordersWaveHighlight" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38C260" stopOpacity="0.5" />
                  <stop offset="60%" stopColor="#259452" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="ordersWaveDeep" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#114E30" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#186740" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </linearGradient>
              </defs>

              <rect width="1024" height="200" fill="url(#ordersBannerBgGrad)" />
              <path
                d="M 0 200 C 240 185 380 130 620 160 C 800 182 920 150 1024 115 L 1024 200 Z"
                fill="url(#ordersWaveDeep)"
              />
              <path
                d="M 280 0 C 420 75 600 40 740 100 C 870 155 945 85 1024 40 L 1024 0 Z"
                fill="url(#ordersWaveHighlight)"
              />
              <path
                d="M 0 0 C 300 0 420 120 670 80 C 850 50 930 20 1024 0 Z"
                fill="white"
                fillOpacity="0.07"
              />
            </svg>

            {/* Specular glass reflection */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-200/60 to-transparent" />

            {/* Right 3D Orders Artwork - Transparent PNG */}
            <div className="absolute right-2 sm:right-6 lg:right-10 top-1/2 -translate-y-1/2 h-[90%] sm:h-[94%] lg:h-[98%] w-auto max-w-[38%] sm:max-w-[42%] lg:max-w-[45%] pointer-events-none select-none z-10 hidden sm:flex items-center justify-end">
              <img
                src={bannerOrdersImg}
                alt="Orders 3D artwork"
                className="h-full w-auto object-contain object-right drop-shadow-[0_12px_24px_rgba(0,0,0,0.22)]"
              />
            </div>

            {/* Left Content Area */}
            <div className="relative z-10 flex-1 flex flex-col justify-between max-w-xl">
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-emerald-100">
                    STORE FULFILLMENT
                  </span>
                  <span className="w-7 h-[1.5px] bg-emerald-200/80 rounded-full inline-block" />
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-[30px] font-black tracking-tight text-white leading-tight drop-shadow-sm">
                  Orders &amp; Dispatch Management
                </h1>

                <p className="text-xs sm:text-[13px] text-emerald-50/95 font-medium leading-relaxed max-w-md lg:max-w-lg">
                  Monitor live customer orders, update delivery pipeline statuses, and track fulfillment.
                </p>
              </div>

              <div className="pt-3.5 sm:pt-4">
                <button
                  type="button"
                  onClick={() => loadOrders(true)}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-white text-[#049669] hover:text-[#03704f] hover:bg-emerald-50 font-bold text-xs sm:text-sm shadow-md shadow-emerald-950/20 hover:shadow-lg hover:scale-[1.02] active:scale-98 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-4 h-4 stroke-[2.5] ${isLoading ? "animate-spin" : ""}`} />
                  <span>Refresh Orders</span>
                </button>
              </div>
            </div>
          </div>

          {/* Metric Stats Cards Reusing Shared Cards Component */}
          <Cards stats={orderStats} />

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
                placeholder="Search by order ID, customer name, phone, or tracking..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 bg-white/80 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#049669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
              />
            </div>

            {/* Filter Dropdowns & View Mode Toggle */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Order Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-10 px-3 rounded-lg border border-slate-200 bg-white/80 text-xs font-medium text-slate-700 focus:border-[#049669] focus:ring-2 focus:ring-emerald-500/15 outline-none cursor-pointer"
              >
                <option value="All">All Statuses ({orders.length})</option>
                <option value="Pending">Pending ({pendingCount})</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered ({deliveredCount})</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              {/* Payment Filter */}
              <select
                value={selectedPayment}
                onChange={(e) => setSelectedPayment(e.target.value)}
                className="h-10 px-3 rounded-lg border border-slate-200 bg-white/80 text-xs font-medium text-slate-700 focus:border-[#049669] focus:ring-2 focus:ring-emerald-500/15 outline-none cursor-pointer"
              >
                <option value="All">All Payments</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending (COD)</option>
                <option value="Failed">Failed</option>
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

          {/* ================= ORDER CONTENT: TABLE VIEW ================= */}
          {viewMode === "table" ? (
            <div className="bg-white/60 backdrop-blur-2xl rounded-xl sm:rounded-2xl border border-white/80 shadow-[0_8px_30px_rgba(4,150,105,0.06)] overflow-hidden relative">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-emerald-50/40 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-4 sm:px-6">Order ID &amp; Date</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Items Summary</th>
                      <th className="py-3.5 px-4">Amount</th>
                      <th className="py-3.5 px-4">Payment</th>
                      <th className="py-3.5 px-4">Fulfillment Status</th>
                      <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                    {filteredOrders.map((ord) => {
                      return (
                        <tr
                          key={ord.id}
                          className="transition-colors group hover:bg-emerald-50/30"
                        >
                          <td className="py-3.5 px-4 sm:px-6">
                            <span className="font-extrabold text-[#1E1B4B] block group-hover:text-[#049669] transition-colors">
                              {ord.id}
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">
                              {ord.date}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <h4 className="font-bold text-[#1E1B4B]">
                              {ord.customer.name}
                            </h4>
                            <span className="text-[11px] text-slate-400 font-medium">
                              {ord.customer.phone}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-slate-700 block">
                              {ord.items.length} {ord.items.length === 1 ? "Item" : "Items"}
                            </span>
                            <span className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
                              {ord.items.map((it) => it.name).join(", ")}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-black text-[#1E1B4B]">
                            {ord.totalAmount}
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="text-xs font-semibold text-slate-700 block">
                              {ord.paymentMethod}
                            </span>
                            <span
                              className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                ord.paymentStatus === "Paid"
                                  ? "text-[#049669] bg-emerald-50"
                                  : ord.paymentStatus === "Cancelled"
                                  ? "text-rose-600 bg-rose-50"
                                  : "text-amber-600 bg-amber-50"
                              }`}
                            >
                              ● {ord.paymentStatus}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold border ${getStatusBadge(
                                ord.status
                              )}`}
                            >
                              {ord.status}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 sm:px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setActiveOrder(ord)}
                                title="View Order Details"
                                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white/90 text-slate-700 hover:text-[#049669] hover:bg-emerald-50 transition cursor-pointer shadow-2xs font-bold text-xs flex items-center gap-1"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Details</span>
                              </button>

                              {/* Quick Status Dropdown */}
                              <select
                                value={ord.status}
                                onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                                disabled={updatingOrderId === ord.id || ord.status === "Mixed"}
                                className="h-8 px-2 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-700 focus:border-[#049669] outline-none cursor-pointer"
                              >
                                {ord.status === "Mixed" && <option value="Mixed">Mixed</option>}
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>

                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* ================= ORDER CONTENT: GRID / CARDS VIEW ================= */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {filteredOrders.map((ord) => {
                return (
                  <div
                    key={ord.id}
                    className="backdrop-blur-2xl rounded-2xl p-4 sm:p-5 border shadow-[0_8px_30px_rgba(4,150,105,0.06)] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(4,150,105,0.12)] transition-all duration-300 relative overflow-hidden flex flex-col justify-between group bg-white/70 border-white/80 hover:border-emerald-300"
                  >
                    {/* Top glass edge highlight */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/90 to-transparent" />

                    {/* Ambient corner glow */}
                    <div className="pointer-events-none absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-emerald-400/10 blur-xl group-hover:scale-125 transition-transform duration-500" />

                    <div>
                      {/* Header: ID, Date & Status */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <span className="font-black text-[#1E1B4B] text-sm group-hover:text-[#049669] transition-colors block">
                            {ord.id}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {ord.date}
                          </span>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs ${getStatusBadge(
                            ord.status
                          )}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              ord.status === "Delivered"
                                ? "bg-[#049669]"
                                : ord.status === "Processing"
                                ? "bg-teal-500"
                                : ord.status === "Shipped"
                                ? "bg-sky-500"
                                : ord.status === "Cancelled"
                                ? "bg-rose-500"
                                : "bg-amber-500"
                            }`}
                          />
                          {ord.status}
                        </span>
                      </div>

                      {/* Customer Info */}
                      <div className="space-y-1 mb-3 pb-3 border-b border-slate-100">
                        <h4 className="font-bold text-xs sm:text-sm text-[#1E1B4B]">
                          {ord.customer.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                          {ord.customer.address}
                        </p>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          {ord.customer.phone}
                        </span>
                      </div>

                      {/* Items List */}
                      <div className="space-y-1.5 mb-3">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          {ord.items.length} {ord.items.length === 1 ? "Item" : "Items"}
                        </span>
                        <ul className="text-xs text-slate-600 space-y-1">
                          {ord.items.map((it, idx) => (
                            <li key={idx} className="flex justify-between text-[11px]">
                              <span className="truncate pr-2">{it.name}</span>
                              <span className="font-bold text-slate-800 shrink-0">x{it.qty}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Footer: Price & Actions */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-black text-[#1E1B4B] block">
                          {ord.totalAmount}
                        </span>
                        <span className="text-[10px] font-semibold text-[#049669]">
                          {ord.paymentStatus}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setActiveOrder(ord)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white/90 text-slate-700 hover:text-[#049669] hover:bg-emerald-50 transition cursor-pointer shadow-2xs font-bold text-xs"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {isLoading && filteredOrders.length === 0 && (
            <div className="text-center py-16 bg-white/60 backdrop-blur-2xl rounded-2xl border border-white/80 p-8 shadow-sm text-sm text-slate-500">
              Loading orders...
            </div>
          )}

          {!isLoading && filteredOrders.length === 0 && (
            <div className="text-center py-16 bg-white/60 backdrop-blur-2xl rounded-2xl border border-white/80 p-8 shadow-sm">
              <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">No orders found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No orders match your filter criteria. Try clearing filters or search terms.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>

      {/* ================= ORDER DETAILS MODAL / DRAWER ================= */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setActiveOrder(null)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
          />

          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-lg font-black text-[#1E1B4B]">
                    Order {activeOrder.id}
                  </h3>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${getStatusBadge(
                      activeOrder.status
                    )}`}
                  >
                    {activeOrder.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Placed on {activeOrder.date} • Tracking: <span className="font-mono text-slate-700">{activeOrder.trackingId}</span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveOrder(null)}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Status Bar */}
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-[#049669]" />
                <span className="text-xs font-bold text-[#1E1B4B]">
                  Update Fulfillment Status:
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleUpdateStatus(activeOrder.id, st)}
                    disabled={updatingOrderId === activeOrder.id}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      activeOrder.status === st
                        ? "bg-[#049669] text-white shadow-xs"
                        : "bg-white text-slate-700 border border-slate-200 hover:bg-emerald-100/60"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer & Delivery Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Customer Information
                </span>
                <h4 className="text-sm font-black text-[#1E1B4B]">
                  {activeOrder.customer.name}
                </h4>
                <div className="text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{activeOrder.customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="leading-snug">{activeOrder.customer.address}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Payment &amp; Logistics
                </span>
                <div className="text-xs text-slate-700 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payment Mode:</span>
                    <span className="font-bold">{activeOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payment Status:</span>
                    <span className="font-bold text-[#049669]">{activeOrder.paymentStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tracking Code:</span>
                    <span className="font-mono font-bold text-slate-800">{activeOrder.trackingId}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ordered Items Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden mb-5">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <th className="py-2.5 px-4">Item Name</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeOrder.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-4 font-semibold text-slate-800">{it.name}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-700">{it.qty}</td>
                      <td className="py-2.5 px-3 text-right text-slate-600">₹{it.price}</td>
                      <td className="py-2.5 px-4 text-right font-bold text-slate-900">
                        ₹{(it.price * it.qty).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50/70 font-black text-sm border-t border-slate-200">
                    <td colSpan="3" className="py-3 px-4 text-slate-700">Total Order Amount:</td>
                    <td className="py-3 px-4 text-right text-[#049669]">{activeOrder.totalAmount}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              

              <button
                type="button"
                onClick={() => setActiveOrder(null)}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#049669] via-[#059669] to-[#10B981] hover:from-[#03704f] hover:to-[#049669] text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
