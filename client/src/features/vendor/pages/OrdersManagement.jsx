import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Cards from "../components/Cards";
import {
  ShoppingCart,
  Search,
  Filter,
  Grid,
  List,
  CheckCircle2,
  Clock,
  Truck,
  AlertTriangle,
  XCircle,
  Eye,
  FileText,
  X,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  ChevronDown,
  ArrowRight,
  PackageCheck,
  RefreshCw,
  Printer,
  Download,
  Trash2,
} from "lucide-react";

const INITIAL_ORDERS = [
  {
    id: "#ORD-1001",
    customer: {
      name: "Aarav Sharma",
      phone: "",
      email: "aarav.sharma@example.com",
      address: "Flat 402, Green Meadows, Andheri West, Mumbai, MH - 400053",
    },
    items: [
      { name: "Amul Taaza Fresh Toned Milk (1 L)", qty: 2, price: 54 },
      { name: "Harvest Gold White Sandwich Bread (400 g)", qty: 1, price: 40 },
      { name: "Farm Fresh Brown Table Eggs (Pack of 6)", qty: 2, price: 68 },
    ],
    totalAmount: "₹2,499",
    paymentMethod: "UPI (Google Pay)",
    paymentStatus: "Paid",
    status: "Delivered",
    date: "Today, 11:30 AM",
    trackingId: "TRK-982144",
  },
  {
    id: "#ORD-1000",
    customer: {
      name: "Priya Patel",
      phone: "+91 94280 11982",
      email: "priya.patel@example.com",
      address: "12, Shanti Niketan Society, Satellite, Ahmedabad, GJ - 380015",
    },
    items: [
      { name: "Shimla Crisp Royal Gala Apples (4 pcs)", qty: 2, price: 140 },
      { name: "Cold Drinks & Juices Pack (1 L)", qty: 1, price: 99 },
    ],
    totalAmount: "₹1,799",
    paymentMethod: "Net Banking (HDFC)",
    paymentStatus: "Paid",
    status: "Processing",
    date: "Today, 09:15 AM",
    trackingId: "TRK-982103",
  },
  {
    id: "#ORD-0999",
    customer: {
      name: "Rohan Verma",
      phone: "+91 97410 88204",
      email: "rohan.v@example.com",
      address: "B-204, Palm Grove Apts, Koramangala 4th Block, Bengaluru, KA - 560034",
    },
    items: [
      { name: "Sport Running Sneakers", qty: 1, price: 3299 },
    ],
    totalAmount: "₹3,299",
    paymentMethod: "Credit Card (Visa)",
    paymentStatus: "Paid",
    status: "Shipped",
    date: "Yesterday, 06:40 PM",
    trackingId: "TRK-981944",
  },
  {
    id: "#ORD-0998",
    customer: {
      name: "Ananya Singh",
      phone: "+91 98112 33491",
      email: "ananya.s@example.com",
      address: "House 54, Sector 15, Gurugram, HR - 122001",
    },
    items: [
      { name: "Aashirvaad Superior MP Sharbati Whole Wheat Atta (5 kg)", qty: 1, price: 345 },
      { name: "Amul Pasteurised Salted Table Butter (100 g)", qty: 2, price: 58 },
    ],
    totalAmount: "₹850",
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending",
    status: "Pending",
    date: "Today, 01:20 PM",
    trackingId: "TRK-982310",
  },
  {
    id: "#ORD-0997",
    customer: {
      name: "Rajesh Nair",
      phone: "+91 98470 55198",
      email: "rajesh.nair@example.com",
      address: "TC 14/204, Rose Gardens, Panampilly Nagar, Kochi, KL - 682036",
    },
    items: [
      { name: "Dairy, Bread & Grocery Combo", qty: 3, price: 1100 },
      { name: "Organic Honey (500 g)", qty: 1, price: 420 },
    ],
    totalAmount: "₹4,150",
    paymentMethod: "UPI (PhonePe)",
    paymentStatus: "Paid",
    status: "Delivered",
    date: "30 Oct, 04:10 PM",
    trackingId: "TRK-980421",
  },
  {
    id: "#ORD-0996",
    customer: {
      name: "Sneha Kulkarni",
      phone: "+91 98220 77319",
      email: "sneha.k@example.com",
      address: "Flat 101, Galaxy Heights, Kothrud, Pune, MH - 411038",
    },
    items: [
      { name: "Snacks & Munchies Festival Hamper", qty: 1, price: 1290 },
    ],
    totalAmount: "₹1,290",
    paymentMethod: "UPI (Paytm)",
    paymentStatus: "Paid",
    status: "Shipped",
    date: "30 Oct, 02:45 PM",
    trackingId: "TRK-980199",
  },
  {
    id: "#ORD-0995",
    customer: {
      name: "Vikram Choudhary",
      phone: "+91 94140 22891",
      email: "vikram.c@example.com",
      address: "Plot 88, Shyam Nagar, Ajmer Road, Jaipur, RJ - 302019",
    },
    items: [
      { name: "Personal Care Grooming Essentials", qty: 2, price: 450 },
    ],
    totalAmount: "₹999",
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Cancelled",
    status: "Cancelled",
    date: "29 Oct, 11:20 AM",
    trackingId: "TRK-979920",
  },
  {
    id: "#ORD-0994",
    customer: {
      name: "Meera Sengupta",
      phone: "+91 98300 44102",
      email: "meera.s@example.com",
      address: "24/1, Ballygunge Circular Road, Kolkata, WB - 700019",
    },
    items: [
      { name: "Assam Royal CTC Tea (1 kg)", qty: 2, price: 420 },
      { name: "Bakery & Biscuits Gift Tin", qty: 2, price: 380 },
    ],
    totalAmount: "₹2,100",
    paymentMethod: "Debit Card (SBI)",
    paymentStatus: "Paid",
    status: "Delivered",
    date: "28 Oct, 05:15 PM",
    trackingId: "TRK-978450",
  },
];

export default function OrdersManagement() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedPayment, setSelectedPayment] = useState("All");
  const [viewMode, setViewMode] = useState("table"); // "table" or "grid"
  const [toastMessage, setToastMessage] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  // Modal / Drawer state for Order Details
  const [activeOrder, setActiveOrder] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

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

  // Update Status Handler
  const handleUpdateStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === id ? { ...ord, status: newStatus } : ord))
    );
    if (activeOrder && activeOrder.id === id) {
      setActiveOrder((prev) => ({ ...prev, status: newStatus }));
    }
    showToast(`Order ${id} updated to "${newStatus}"!`);
  };

  // Delete Order
  const handleDeleteOrder = (id) => {
    if (window.confirm(`Are you sure you want to delete order ${id}?`)) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
      setSelectedIds((prev) => prev.filter((item) => item !== id));
      showToast(`Order ${id} deleted successfully.`);
    }
  };

  // Bulk Selection & Delete Handlers
  const isAllSelected =
    filteredOrders.length > 0 &&
    filteredOrders.every((o) => selectedIds.includes(o.id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredOrders.map((o) => o.id));
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedIds.length} orders?`
      )
    ) {
      setOrders((prev) => prev.filter((o) => !selectedIds.includes(o.id)));
      showToast(`${selectedIds.length} orders deleted successfully.`);
      setSelectedIds([]);
    }
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
          {/* Welcome Banner in Frosted Glassy Emerald Green #049669 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#049669]/95 via-[#059669]/90 to-[#10B981]/85 backdrop-blur-2xl rounded-xl sm:rounded-2xl p-5 sm:p-7 text-white border border-white/20 shadow-[0_12px_40px_rgba(4,150,105,0.25)] relative overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-black/15" />

            {/* Glowing inner glass ambient blobs */}
            <div className="pointer-events-none absolute -right-12 -top-12 w-48 h-48 rounded-full bg-emerald-400/20 blur-2xl" />
            <div className="pointer-events-none absolute right-1/4 -bottom-10 w-44 h-44 rounded-full bg-teal-400/20 blur-2xl" />

            <div className="space-y-1 z-10 relative">
              <span className="text-xs uppercase font-extrabold text-emerald-100 tracking-wider">
                Store Fulfillment
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight drop-shadow-sm">
                Orders &amp; Dispatch Management
              </h1>
              <p className="text-xs sm:text-sm text-emerald-50 max-w-xl font-medium">
                Monitor live customer orders, update delivery pipeline statuses, and print invoices.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 z-10 relative">
              <button
                type="button"
                onClick={() => {
                  setOrders(INITIAL_ORDERS);
                  showToast("Orders refreshed with live data!");
                }}
                className="px-4 py-2.5 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/40 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 cursor-pointer relative overflow-hidden group"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-200/70 to-transparent" />
                <RefreshCw className="w-4 h-4 stroke-[2.3] transition-transform group-hover:rotate-180" />
                <span>Refresh Orders</span>
              </button>
            </div>
          </div>

          {/* Metric Stats Cards Reusing Shared Cards Component */}
          <Cards stats={orderStats} />

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
                <option value="Cancelled">Cancelled</option>
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

          {/* ================= BULK ACTIONS FLOATING BAR ================= */}
          {selectedIds.length > 0 && (
            <div className="bg-slate-900/90 backdrop-blur-xl text-white px-4 sm:px-5 py-3 rounded-xl sm:rounded-2xl shadow-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200 border border-slate-700/60 mb-5">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
                <span className="w-6 h-6 rounded-lg bg-[#049669] flex items-center justify-center font-bold text-xs text-white">
                  {selectedIds.length}
                </span>
                <span>Selected Orders</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                >
                  Deselect All
                </button>
                <button
                  type="button"
                  onClick={handleBulkDelete}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Bulk Delete ({selectedIds.length})</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= ORDER CONTENT: TABLE VIEW ================= */}
          {viewMode === "table" ? (
            <div className="bg-white/60 backdrop-blur-2xl rounded-xl sm:rounded-2xl border border-white/80 shadow-[0_8px_30px_rgba(4,150,105,0.06)] overflow-hidden relative">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-emerald-50/40 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-4 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={isAllSelected}
                          onChange={handleToggleSelectAll}
                          className="w-4 h-4 rounded text-[#049669] focus:ring-emerald-500 accent-[#049669] cursor-pointer"
                          aria-label="Select all orders"
                        />
                      </th>
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
                      const isSelected = selectedIds.includes(ord.id);
                      return (
                        <tr
                          key={ord.id}
                          className={`transition-colors group ${
                            isSelected
                              ? "bg-emerald-50/60"
                              : "hover:bg-emerald-50/30"
                          }`}
                        >
                          <td className="py-3.5 px-4 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelect(ord.id)}
                              className="w-4 h-4 rounded text-[#049669] focus:ring-emerald-500 accent-[#049669] cursor-pointer"
                              aria-label={`Select order ${ord.id}`}
                            />
                          </td>

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
                                className="h-8 px-2 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-700 focus:border-[#049669] outline-none cursor-pointer"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>

                              {/* Delete Order Button */}
                              <button
                                type="button"
                                onClick={() => handleDeleteOrder(ord.id)}
                                title="Delete Order"
                                className="p-1.5 rounded-lg border border-slate-200 hover:text-rose-600 hover:bg-rose-50 text-slate-400 transition cursor-pointer shadow-2xs"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
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
                const isSelected = selectedIds.includes(ord.id);
                return (
                  <div
                    key={ord.id}
                    className={`backdrop-blur-2xl rounded-2xl p-4 sm:p-5 border shadow-[0_8px_30px_rgba(4,150,105,0.06)] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(4,150,105,0.12)] transition-all duration-300 relative overflow-hidden flex flex-col justify-between group ${
                      isSelected
                        ? "border-[#049669] ring-2 ring-emerald-500/25 bg-emerald-50/40"
                        : "bg-white/70 border-white/80 hover:border-emerald-300"
                    }`}
                  >
                    {/* Top glass edge highlight */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/90 to-transparent" />

                    {/* Ambient corner glow */}
                    <div className="pointer-events-none absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-emerald-400/10 blur-xl group-hover:scale-125 transition-transform duration-500" />

                    <div>
                      {/* Header: Checkbox, ID, Date & Status */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-start gap-2.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(ord.id)}
                            className="w-4 h-4 mt-0.5 rounded text-[#049669] focus:ring-emerald-500 accent-[#049669] cursor-pointer"
                            aria-label={`Select order ${ord.id}`}
                          />
                          <div>
                            <span className="font-black text-[#1E1B4B] text-sm group-hover:text-[#049669] transition-colors block">
                              {ord.id}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {ord.date}
                            </span>
                          </div>
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
                        <button
                          type="button"
                          onClick={() => handleDeleteOrder(ord.id)}
                          title="Delete Order"
                          className="p-1.5 rounded-lg border border-slate-200 hover:text-rose-600 hover:bg-rose-50 text-slate-400 transition cursor-pointer shadow-2xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredOrders.length === 0 && (
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
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      activeOrder.status === st
                        ? "bg-[#049669] text-white shadow-xs"
                        : "bg-white text-slate-700 border border-slate-200 hover:bg-emerald-100/60"
                    }`}
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
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>

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

