import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Cards from "../components/Cards";
import {
  Wallet,
  CircleDollarSign,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Filter,
  Grid,
  List,
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  Building2,
  CreditCard,
  Plus,
  X,
  FileText,
  Calendar,
  Check,
  RefreshCw,
  Trash2,
} from "lucide-react";

const INITIAL_PAYMENTS = [
  {
    id: "#PAY-89241",
    amount: "₹42,500",
    grossAmount: "₹43,814",
    commission: "₹876",
    tds: "₹438",
    method: "HDFC Bank (A/C **4921)",
    accountType: "Bank Transfer (NEFT)",
    accountHolder: "Best Deals Retail Pvt Ltd",
    ifsc: "HDFC0001244",
    utr: "HDFC9824117820",
    date: "Today, 11:20 AM",
    status: "Completed",
    cycle: "21 Oct - 27 Oct 2026",
  },
  {
    id: "#PAY-89218",
    amount: "₹18,200",
    grossAmount: "₹18,762",
    commission: "₹375",
    tds: "₹187",
    method: "UPI (vendor@okaxis)",
    accountType: "Instant UPI Payout",
    accountHolder: "Best Deals Store",
    ifsc: "UTIB0000000",
    utr: "AXIS9821877410",
    date: "Yesterday, 04:45 PM",
    status: "Completed",
    cycle: "Instant On-Demand",
  },
  {
    id: "#PAY-89190",
    amount: "₹35,000",
    grossAmount: "₹36,082",
    commission: "₹721",
    tds: "₹361",
    method: "ICICI Bank (A/C **8104)",
    accountType: "Weekly Direct Deposit",
    accountHolder: "Best Deals Retail Pvt Ltd",
    ifsc: "ICIC0008104",
    utr: "ICIC0089190122",
    date: "28 Oct, 2026",
    status: "Processing",
    cycle: "14 Oct - 20 Oct 2026",
  },
  {
    id: "#PAY-89145",
    amount: "₹64,800",
    grossAmount: "₹66,804",
    commission: "₹1,336",
    tds: "₹668",
    method: "State Bank of India (A/C **3392)",
    accountType: "Bank Transfer (RTGS)",
    accountHolder: "Best Deals Retail Pvt Ltd",
    ifsc: "SBIN0003392",
    utr: "SBIN0089145601",
    date: "24 Oct, 2026",
    status: "Completed",
    cycle: "07 Oct - 13 Oct 2026",
  },
  {
    id: "#PAY-89110",
    amount: "₹22,450",
    grossAmount: "₹23,144",
    commission: "₹462",
    tds: "₹232",
    method: "UPI (vendor@paytm)",
    accountType: "Instant UPI Payout",
    accountHolder: "Best Deals Store",
    ifsc: "PYTM0123456",
    utr: "PYTM0089110294",
    date: "20 Oct, 2026",
    status: "Completed",
    cycle: "Instant On-Demand",
  },
  {
    id: "#PAY-89088",
    amount: "₹18,500",
    grossAmount: "₹19,072",
    commission: "₹381",
    tds: "₹191",
    method: "HDFC Bank (A/C **4921)",
    accountType: "Weekly Direct Deposit",
    accountHolder: "Best Deals Retail Pvt Ltd",
    ifsc: "HDFC0001244",
    utr: "HDFC0089088210",
    date: "15 Oct, 2026",
    status: "Completed",
    cycle: "01 Oct - 07 Oct 2026",
  },
  {
    id: "#PAY-89045",
    amount: "₹12,000",
    grossAmount: "₹12,371",
    commission: "₹247",
    tds: "₹124",
    method: "Kotak Mahindra Bank (A/C **7719)",
    accountType: "Bank Transfer (NEFT)",
    accountHolder: "Best Deals Retail Pvt Ltd",
    ifsc: "KKBK0007719",
    utr: "KKBK0089045931",
    date: "10 Oct, 2026",
    status: "Failed",
    cycle: "Instant On-Demand",
  },
];

export default function Payments() {
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedMethod, setSelectedMethod] = useState("All");
  const [viewMode, setViewMode] = useState("table"); // "table" or "grid"
  const [toastMessage, setToastMessage] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  // Modal States
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestAmount, setRequestAmount] = useState("");
  const [requestMethod, setRequestMethod] = useState("HDFC Bank (A/C **4921)");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

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
      pay.utr.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === "All" || pay.status === selectedStatus;

    const matchesMethod =
      selectedMethod === "All" || pay.accountType.includes(selectedMethod);

    return matchesSearch && matchesStatus && matchesMethod;
  });

  // Bulk Selection & Delete Handlers
  const isAllSelected =
    filteredPayments.length > 0 &&
    filteredPayments.every((p) => selectedIds.includes(p.id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPayments.map((p) => p.id));
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
        `Are you sure you want to delete ${selectedIds.length} settlement record(s)?`
      )
    ) {
      setPayments((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
      showToast(`${selectedIds.length} settlement(s) deleted successfully.`);
      setSelectedIds([]);
    }
  };

  // Calculate Metrics for Shared Cards Component
  const totalCompletedSum = payments
    .filter((p) => p.status === "Completed")
    .reduce((sum, p) => sum + parseInt(p.amount.replace(/[^0-9]/g, ""), 10), 0);

  const pendingSettlementSum = payments
    .filter((p) => p.status === "Processing" || p.status === "Pending")
    .reduce((sum, p) => sum + parseInt(p.amount.replace(/[^0-9]/g, ""), 10), 0);

  const paymentStats = [
    {
      id: "total_payouts",
      title: "Total Paid Out",
      value: `₹${totalCompletedSum.toLocaleString("en-IN")}`,
      icon: Wallet,
      iconColor: "text-white bg-gradient-to-tr from-[#049669] to-[#10B981] border-emerald-400/40 shadow-md shadow-emerald-600/25",
      bgGradient: "from-emerald-50/90 via-white/85 to-white/60",
      accentBorder: "border-emerald-200/80 hover:border-emerald-400 hover:shadow-[0_16px_36px_rgba(4,150,105,0.15)]",
      glowColor: "bg-emerald-400/25",
      valueColor: "text-[#049669]",
    },
    {
      id: "available_balance",
      title: "Available Balance",
      value: "₹48,200",
      icon: CircleDollarSign,
      iconColor: "text-white bg-gradient-to-tr from-[#059669] to-teal-500 border-teal-400/40 shadow-md shadow-teal-600/25",
      bgGradient: "from-teal-50/90 via-white/85 to-white/60",
      accentBorder: "border-teal-200/80 hover:border-teal-400 hover:shadow-[0_16px_36px_rgba(13,148,136,0.15)]",
      glowColor: "bg-teal-400/25",
      valueColor: "text-[#1E1B4B]",
    },
    {
      id: "pending_payouts",
      title: "Processing Settlements",
      value: `₹${pendingSettlementSum.toLocaleString("en-IN")}`,
      valueColor: pendingSettlementSum > 0 ? "text-amber-600" : "text-[#1E1B4B]",
      icon: Clock,
      iconColor: "text-white bg-gradient-to-tr from-amber-500 to-amber-400 border-amber-300 shadow-md shadow-amber-500/25",
      bgGradient: "from-amber-50/90 via-white/85 to-white/60",
      accentBorder: "border-amber-200/80 hover:border-amber-400 hover:shadow-[0_16px_36px_rgba(245,158,11,0.15)]",
      glowColor: "bg-amber-400/25",
    },
    {
      id: "settlements_count",
      title: "Settlements Count",
      value: `${payments.length} Records`,
      icon: CheckCircle2,
      iconColor: "text-white bg-gradient-to-tr from-[#049669] via-emerald-600 to-teal-600 border-emerald-400/40 shadow-md shadow-emerald-600/25",
      bgGradient: "from-emerald-50/70 via-white/85 to-white/60",
      accentBorder: "border-emerald-200/80 hover:border-emerald-400 hover:shadow-[0_16px_36px_rgba(4,150,105,0.15)]",
      glowColor: "bg-emerald-400/20",
      valueColor: "text-[#1E1B4B]",
    },
  ];

  // Request Payout Submit
  const handleRequestPayout = (e) => {
    e.preventDefault();
    const amountVal = parseInt(requestAmount, 10);
    if (!amountVal || amountVal < 1000) {
      alert("Minimum payout amount is ₹1,000.");
      return;
    }
    if (amountVal > 48200) {
      alert("Amount cannot exceed available balance of ₹48,200.");
      return;
    }

    const newPayout = {
      id: `#PAY-${Math.floor(10000 + Math.random() * 90000)}`,
      amount: `₹${amountVal.toLocaleString("en-IN")}`,
      grossAmount: `₹${Math.round(amountVal * 1.03).toLocaleString("en-IN")}`,
      commission: `₹${Math.round(amountVal * 0.02).toLocaleString("en-IN")}`,
      tds: `₹${Math.round(amountVal * 0.01).toLocaleString("en-IN")}`,
      method: requestMethod,
      accountType: requestMethod.includes("UPI") ? "Instant UPI Payout" : "Bank Transfer (NEFT)",
      accountHolder: "Best Deals Retail Pvt Ltd",
      ifsc: "HDFC0001244",
      utr: `UTR${Date.now().toString().slice(-8)}`,
      date: "Just now",
      status: "Processing",
      cycle: "On-Demand Request",
    };

    setPayments([newPayout, ...payments]);
    setIsRequestModalOpen(false);
    setRequestAmount("");
    showToast(`Payout request of ₹${amountVal.toLocaleString("en-IN")} submitted successfully!`);
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
                Financial Settlements
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight drop-shadow-sm">
                Earnings &amp; Payout Settlements
              </h1>
              <p className="text-xs sm:text-sm text-emerald-50 max-w-xl font-medium">
                Monitor your store earnings, bank settlements, and withdrawal receipts.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 z-10 relative">
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(true)}
                className="px-4 py-2.5 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/40 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 cursor-pointer relative overflow-hidden group"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-200/70 to-transparent" />
                <Plus className="w-4 h-4 stroke-[2.5] transition-transform group-hover:rotate-90" />
                <span>Request Payout</span>
              </button>
            </div>
          </div>

          {/* Metric Stats Cards Reusing Shared Cards Component */}
          <Cards stats={paymentStats} />

          {/* Search, Filter & View Controls */}
          <div className="bg-white/60 backdrop-blur-2xl rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-white/80 shadow-[0_8px_30px_rgba(4,150,105,0.06)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 relative overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search settlements by ID, UTR, or bank..."
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
                <option value="Processing">Processing</option>
                <option value="Failed">Failed</option>
              </select>

              {/* Method Filter */}
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="h-10 px-3 rounded-lg border border-slate-200 bg-white/80 text-xs font-medium text-slate-700 focus:border-[#049669] focus:ring-2 focus:ring-emerald-500/15 outline-none cursor-pointer"
              >
                <option value="All">All Payout Modes</option>
                <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                <option value="UPI">Instant UPI</option>
                <option value="Weekly">Weekly Deposit</option>
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
                <span>Selected Settlements</span>
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

          {/* ================= PAYMENTS CONTENT: TABLE VIEW ================= */}
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
                          aria-label="Select all settlements"
                        />
                      </th>
                      <th className="py-3.5 px-4 sm:px-6">Settlement ID &amp; Date</th>
                      <th className="py-3.5 px-4">Method</th>
                      <th className="py-3.5 px-4">Net Credited</th>
                      <th className="py-3.5 px-4">UTR Reference</th>
                      <th className="py-3.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                    {filteredPayments.map((pay) => {
                      const isSelected = selectedIds.includes(pay.id);
                      return (
                        <tr
                          key={pay.id}
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
                              onChange={() => handleToggleSelect(pay.id)}
                              className="w-4 h-4 rounded text-[#049669] focus:ring-emerald-500 accent-[#049669] cursor-pointer"
                              aria-label={`Select settlement ${pay.id}`}
                            />
                          </td>

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
                              {pay.accountType}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-black text-[#049669] text-sm sm:text-base">
                              +{pay.amount}
                            </span>
                            <span className="text-[11px] text-slate-400 block">
                              Gross: {pay.grossAmount}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                            {pay.utr}
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
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* ================= PAYMENTS CONTENT: GRID / CARDS VIEW ================= */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {filteredPayments.map((pay) => {
                const isSelected = selectedIds.includes(pay.id);
                return (
                  <div
                    key={pay.id}
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

                    <div className="relative z-10">
                      {/* Header: Checkbox, ID, Date & Status */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-start gap-2.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(pay.id)}
                            className="w-4 h-4 mt-0.5 rounded text-[#049669] focus:ring-emerald-500 accent-[#049669] cursor-pointer"
                            aria-label={`Select settlement ${pay.id}`}
                          />
                          <div>
                            <span className="font-black text-[#1E1B4B] text-sm group-hover:text-[#049669] transition-colors block leading-tight">
                              {pay.id}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">
                              {pay.date}
                            </span>
                          </div>
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
                                : pay.status === "Processing"
                                ? "bg-teal-500"
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
                          +{pay.amount}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="text-xs font-bold text-[#1E1B4B] truncate">
                            {pay.method}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                          {pay.accountType}
                        </span>
                      </div>

                      {/* Financial Breakdown Panel */}
                      <div className="space-y-1.5 text-[11px] p-2.5 rounded-xl bg-slate-50/60 border border-slate-100/80">
                        <div className="flex justify-between items-center text-slate-500">
                          <span>Gross Sales:</span>
                          <span className="font-bold text-slate-800">{pay.grossAmount}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-500">
                          <span>Platform Fee (2%):</span>
                          <span className="font-bold text-rose-500">-{pay.commission}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-500 pt-1 border-t border-slate-200/60">
                          <span>UTR Code:</span>
                          <span className="font-mono font-bold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200/70 shadow-2xs text-[10px]">
                            {pay.utr}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between gap-2 relative z-10">
                      <span className="text-[10px] text-slate-400 font-medium">
                        Cycle: {pay.cycle}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredPayments.length === 0 && (
            <div className="text-center py-16 bg-white/60 backdrop-blur-2xl rounded-2xl border border-white/80 p-8 shadow-sm">
              <Wallet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">No settlements found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No payout records match your search or filter criteria.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>

      {/* ================= REQUEST PAYOUT MODAL ================= */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsRequestModalOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
          />

          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-lg font-black text-[#1E1B4B]">
                  Request Payout Withdrawal
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Available for withdrawal: <strong className="text-[#049669]">₹48,200</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(false)}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRequestPayout} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Withdrawal Amount (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="1000"
                  max="48200"
                  placeholder="e.g. 25000 (Min ₹1,000)"
                  value={requestAmount}
                  onChange={(e) => setRequestAmount(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#049669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Destination Account *
                </label>
                <select
                  value={requestMethod}
                  onChange={(e) => setRequestMethod(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 focus:border-[#049669] focus:ring-2 focus:ring-emerald-500/15 outline-none cursor-pointer"
                >
                  <option value="HDFC Bank (A/C **4921)">HDFC Bank (A/C **4921) - Primary</option>
                  <option value="UPI (vendor@okaxis)">UPI (vendor@okaxis) - Instant</option>
                  <option value="ICICI Bank (A/C **8104)">ICICI Bank (A/C **8104)</option>
                  <option value="State Bank of India (A/C **3392)">State Bank of India (A/C **3392)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500 space-y-1">
                <p>• Payouts to verified bank accounts settle within 1 business day.</p>
                <p>• UPI payouts settle within 30 minutes (24x7).</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#049669] via-[#059669] to-[#10B981] hover:from-[#03704f] hover:to-[#049669] text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition cursor-pointer"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

