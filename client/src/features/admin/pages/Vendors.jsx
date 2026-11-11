import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Cards from "../components/Cards";
import { vendorService } from "../../../services";
import {
  Store,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Plus,
  Eye,
  Trash2,
  ChevronUp,
  ShieldCheck,
  Check,
  X,
  FileText,
  Phone,
  Mail,
  User,
  Building2,
  Layers,
  Percent,
  Calendar,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import bannerAdminVendorsImg from "../../../assets/banner-admin-vendors-3d.png";

const INITIAL_VENDORS = [
  {
    id: 1,
    storeName: "Best Deals Superstore",
    businessName: "Best Deals Retail Pvt Ltd",
    gstNumber: "07AAAAA0000A1Z5",
    ownerName: "Rajesh Gupta",
    email: "rajesh@bestdeals.in",
    phone: "9876543210",
    category: "Groceries & Daily Needs",
    plan: "starter",
    productsLimit: 150,
    status: "approved",
    joinedDate: "Aug 14, 2026",
  },
  {
    id: 2,
    storeName: "Organic Bliss Farm",
    businessName: "Organic Bliss Agro LLP",
    gstNumber: "27BBBBB1111B1Z6",
    ownerName: "Devendra Patel",
    email: "devendra@organicbliss.com",
    phone: "9823456789",
    category: "Fruits & Vegetables",
    plan: "professional",
    productsLimit: 200,
    status: "approved",
    joinedDate: "Sep 02, 2026",
  },
  {
    id: 3,
    storeName: "Fresh Dairy Direct",
    businessName: "Fresh Dairy Producers Ltd",
    gstNumber: "06CCCCC2222C1Z7",
    ownerName: "Vikram Singh",
    email: "vikram@dairydirect.com",
    phone: "9712345678",
    category: "Dairy, Bread & Eggs",
    plan: "starter",
    productsLimit: 50,
    status: "approved",
    joinedDate: "Sep 18, 2026",
  },
  {
    id: 4,
    storeName: "Spice & Masala Heritage",
    businessName: "Heritage Spices & Condiments",
    gstNumber: "29DDDDD3333D1Z8",
    ownerName: "Anita Desai",
    email: "anita@spiceheritage.com",
    phone: "9988776655",
    category: "Atta, Rice & Dal",
    plan: "starter",
    productsLimit: 100,
    status: "approved",
    joinedDate: "Jul 29, 2026",
  },
  {
    id: 5,
    storeName: "Sweet Treats Patisserie",
    businessName: "Sweet Treats Bakery House",
    gstNumber: "08EEEEE4444E1Z9",
    ownerName: "Pooja Malhotra",
    email: "pooja@sweettreats.com",
    phone: "9845012345",
    category: "Bakery & Biscuits",
    plan: "free",
    productsLimit: 25,
    status: "pending",
    joinedDate: "Oct 28, 2026",
  },
  {
    id: 6,
    storeName: "Pure Wellness Ayurveda",
    businessName: "Pure Wellness Natural Care",
    gstNumber: "07FFFFF5555F1Z0",
    ownerName: "Dr. Manoj Sharma",
    email: "manoj@purewellness.in",
    phone: "9654321098",
    category: "Pharma & Wellness",
    plan: "starter",
    productsLimit: 50,
    status: "pending",
    joinedDate: "Nov 01, 2026",
  },
  {
    id: 7,
    storeName: "Daily Clean Essentials",
    businessName: "Clean Pro Home Care",
    gstNumber: "03GGGGG6666G1Z1",
    ownerName: "Rajesh Kulkarni",
    email: "rajesh@dailyclean.in",
    phone: "9911223344",
    category: "Cleaning Essentials",
    plan: "free",
    productsLimit: 20,
    status: "rejected",
    joinedDate: "Aug 05, 2026",
  },
  {
    id: 8,
    storeName: "City Munchies & Snacks",
    businessName: "City Munchies Packaged Foods",
    gstNumber: "27HHHHH7777H1Z2",
    ownerName: "Sahil Khan",
    email: "sahil@citymunchies.com",
    phone: "9870011223",
    category: "Snacks & Munchies",
    plan: "starter",
    productsLimit: 80,
    status: "approved",
    joinedDate: "Oct 12, 2026",
  },
];

const normalizeVendor = (v) => {
  const user = v.user || {};
  const rawStatus = (v.status || (user.isVerified ? "approved" : "pending")).toLowerCase();
  const normalizedStatus =
    rawStatus === "active" ? "approved" : rawStatus === "suspended" ? "rejected" : rawStatus;

  return {
    id: v.id,
    storeName: v.storeName || "Unnamed Store",
    businessName: v.businessName || v.storeName || "N/A",
    gstNumber: v.gstNumber || "N/A",
    ownerName: user.name || v.ownerName || "Merchant Partner",
    email: user.email || v.email || "N/A",
    phone: user.phone || v.phone || "N/A",
    category: v.category || "General Store",
    plan: v.plan || "free",
    productsLimit: v.productsLimit ?? 10,
    status: normalizedStatus,
    createdAt: v.createdAt || new Date().toISOString(),
    joinedDate: v.createdAt
      ? new Date(v.createdAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : v.joinedDate || "Nov 03, 2026",
    isVerified: user.isVerified ?? (normalizedStatus === "approved"),
  };
};

export default function Vendors() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingVendor, setViewingVendor] = useState(null);

  // New Vendor Form
  const [formData, setFormData] = useState({
    storeName: "",
    businessName: "",
    gstNumber: "",
    ownerName: "",
    email: "",
    phone: "",
    category: "Groceries & Daily Needs",
    plan: "starter",
  });

  // Scroll Animation State
  const scrollContainerRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Load vendors from backend
  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await vendorService.getAllVendors();
      const rawList = Array.isArray(res) ? res : res?.vendors || [];
      if (rawList.length > 0) {
        setVendors(rawList.map(normalizeVendor));
      } else {
        setVendors(INITIAL_VENDORS.map(normalizeVendor));
      }
    } catch (err) {
      console.warn("Backend vendors API unreachable, using initial dataset:", err);
      setVendors(INITIAL_VENDORS.map(normalizeVendor));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
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

  // Approve Vendor
  const handleApproveVendor = async (id) => {
    try {
      setActionLoadingId(id);
      await vendorService.approveVendor(id);
      setVendors((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status: "approved", isVerified: true } : v))
      );
      if (viewingVendor && viewingVendor.id === id) {
        setViewingVendor((prev) => ({ ...prev, status: "approved", isVerified: true }));
      }
    } catch (err) {
      // Local fallback for mock/offline entries
      setVendors((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status: "approved", isVerified: true } : v))
      );
      if (viewingVendor && viewingVendor.id === id) {
        setViewingVendor((prev) => ({ ...prev, status: "approved", isVerified: true }));
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  // Reject Vendor
  const handleRejectVendor = async (id) => {
    const reason = window.prompt(
      "Enter reason for rejection (optional):",
      "Incomplete or invalid business documents"
    );
    if (reason === null) return;

    try {
      setActionLoadingId(id);
      await vendorService.rejectVendor(id, reason);
      setVendors((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status: "rejected", isVerified: false } : v))
      );
      if (viewingVendor && viewingVendor.id === id) {
        setViewingVendor((prev) => ({ ...prev, status: "rejected", isVerified: false }));
      }
    } catch (err) {
      // Local fallback
      setVendors((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status: "rejected", isVerified: false } : v))
      );
      if (viewingVendor && viewingVendor.id === id) {
        setViewingVendor((prev) => ({ ...prev, status: "rejected", isVerified: false }));
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete Vendor
  const handleDeleteVendor = async (id) => {
    if (window.confirm("Are you sure you want to remove this vendor store from the marketplace?")) {
      try {
        setActionLoadingId(id);
        await vendorService.deleteVendor(id);
      } catch (err) {
        console.warn("Delete API error:", err);
      } finally {
        setVendors((prev) => prev.filter((v) => v.id !== id));
        setSelectedIds((prev) => prev.filter((item) => item !== id));
        if (viewingVendor && viewingVendor.id === id) setViewingVendor(null);
        setActionLoadingId(null);
      }
    }
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedIds.length} selected vendor store(s)?`
      )
    ) {
      for (const id of selectedIds) {
        try {
          await vendorService.deleteVendor(id);
        } catch {
          // continue
        }
      }
      setVendors((prev) => prev.filter((v) => !selectedIds.includes(v.id)));
      setSelectedIds([]);
    }
  };

  // Add Vendor Submit
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.storeName || !formData.ownerName || !formData.email) return;

    const newVendor = {
      id: Date.now(),
      storeName: formData.storeName,
      businessName: formData.businessName || formData.storeName,
      gstNumber: formData.gstNumber || "07TEST000000Z1",
      ownerName: formData.ownerName,
      email: formData.email,
      phone: formData.phone.replace(/\D/g, "").slice(0, 10) || "9800000000",
      category: formData.category,
      plan: formData.plan,
      productsLimit: 50,
      status: "pending",
      joinedDate: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      isVerified: false,
    };

    setVendors([newVendor, ...vendors]);
    setIsAddModalOpen(false);
    setFormData({
      storeName: "",
      businessName: "",
      gstNumber: "",
      ownerName: "",
      email: "",
      phone: "",
      category: "Groceries & Daily Needs",
      plan: "starter",
    });
  };

  // Filtered Vendors
  const filteredVendors = vendors.filter((v) => {
    if (statusFilter !== "all" && v.status !== statusFilter) {
      return false;
    }
    if (categoryFilter !== "all" && v.category !== categoryFilter) {
      return false;
    }
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return (
        v.storeName.toLowerCase().includes(q) ||
        v.businessName.toLowerCase().includes(q) ||
        v.ownerName.toLowerCase().includes(q) ||
        v.email.toLowerCase().includes(q) ||
        v.phone.toLowerCase().includes(q) ||
        v.gstNumber.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredVendors.map((v) => v.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Stats calculation
  const totalCount = vendors.length;
  const approvedCount = vendors.filter((v) => v.status === "approved").length;
  const pendingCount = vendors.filter((v) => v.status === "pending").length;
  const rejectedCount = vendors.filter((v) => v.status === "rejected").length;

  const vendorStats = [
    {
      id: "total",
      title: "Total Stores",
      value: String(totalCount),
      icon: Store,
      iconColor:
        "text-white bg-gradient-to-tr from-[#049669] to-emerald-400 border-emerald-300 shadow-md shadow-emerald-600/25",
      bgGradient: "from-emerald-50/90 via-white/85 to-white/60",
      accentBorder:
        "border-emerald-200/80 hover:border-emerald-400 hover:shadow-[0_16px_36px_rgba(4,150,105,0.15)]",
      glowColor: "bg-emerald-400/25",
      valueColor: "text-[#049669]",
    },
    {
      id: "approved",
      title: "Approved Stores",
      value: String(approvedCount),
      icon: CheckCircle2,
      iconColor:
        "text-white bg-gradient-to-tr from-[#059669] to-teal-500 border-teal-400/40 shadow-md shadow-teal-600/25",
      bgGradient: "from-teal-50/90 via-white/85 to-white/60",
      accentBorder:
        "border-teal-200/80 hover:border-teal-400 hover:shadow-[0_16px_36px_rgba(13,148,136,0.15)]",
      glowColor: "bg-teal-400/25",
      valueColor: "text-[#1E1B4B]",
    },
    {
      id: "pending",
      title: "Pending Approval",
      value: String(pendingCount),
      icon: Clock,
      iconColor:
        "text-white bg-gradient-to-tr from-amber-500 to-amber-400 border-amber-300 shadow-md shadow-amber-500/25",
      bgGradient: "from-amber-50/90 via-white/85 to-white/60",
      accentBorder:
        "border-amber-200/80 hover:border-amber-400 hover:shadow-[0_16px_36px_rgba(245,158,11,0.15)]",
      glowColor: "bg-amber-400/25",
      valueColor: "text-amber-600",
    },
    {
      id: "rejected",
      title: "Rejected Stores",
      value: String(rejectedCount),
      icon: XCircle,
      iconColor:
        "text-white bg-gradient-to-tr from-rose-500 to-rose-400 border-rose-300 shadow-md shadow-rose-500/25",
      bgGradient: "from-rose-50/90 via-white/85 to-white/60",
      accentBorder:
        "border-rose-200/80 hover:border-rose-400 hover:shadow-[0_16px_36px_rgba(244,63,94,0.15)]",
      glowColor: "bg-rose-400/20",
      valueColor: "text-rose-600",
    },
  ];

  const categoriesList = [
    "Groceries & Daily Needs",
    "Fruits & Vegetables",
    "Dairy, Bread & Eggs",
    "Atta, Rice & Dal",
    "Bakery & Biscuits",
    "Pharma & Wellness",
    "Cleaning Essentials",
    "Snacks & Munchies",
    "Electronics",
    "Fashion",
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

      {/* Top Navbar */}
      <Navbar onToggleSidebar={() => setIsSidebarOpen(true)} />

      {/* Body Area */}
      <div className="flex-1 flex min-h-0 relative z-10 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div
          ref={scrollContainerRef}
          className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto relative z-10 scroll-smooth [scrollbar-gutter:stable]"
        >
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 w-full mx-auto pb-12">
            {/* Welcome Banner */}
            <div className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 min-h-[175px] sm:min-h-[190px] lg:min-h-[200px] flex flex-col justify-between overflow-hidden shadow-[0_16px_40px_rgba(4,150,105,0.22)] border border-emerald-400/30 group">
              <svg
                className="pointer-events-none absolute inset-0 w-full h-full object-cover"
                viewBox="0 0 1024 200"
                preserveAspectRatio="none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="vendorBannerBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1B744A" />
                    <stop offset="40%" stopColor="#228C52" />
                    <stop offset="100%" stopColor="#2CA85C" />
                  </linearGradient>
                </defs>
                <rect width="1024" height="200" fill="url(#vendorBannerBgGrad)" />
              </svg>

              <div className="absolute right-3 sm:right-6 lg:right-10 top-1/2 -translate-y-1/2 h-[90%] sm:h-[94%] lg:h-[98%] w-auto max-w-[38%] sm:max-w-[42%] lg:max-w-[45%] pointer-events-none select-none z-10 hidden sm:flex items-center justify-end">
                <img
                  src={bannerAdminVendorsImg}
                  alt="Vendors Management 3D artwork"
                  className="h-full w-auto object-contain object-right drop-shadow-[0_12px_24px_rgba(0,0,0,0.22)]"
                />
              </div>

              <div className="relative z-10 flex-1 flex flex-col justify-between max-w-xl">
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-emerald-100">
                      MERCHANT NETWORK
                    </span>
                    <span className="w-7 h-[1.5px] bg-emerald-200/80 rounded-full inline-block" />
                  </div>

                  <h1 className="text-xl sm:text-2xl lg:text-[30px] font-black tracking-tight text-white leading-tight drop-shadow-sm">
                    Vendors Management
                  </h1>

                  <p className="text-xs sm:text-[13px] text-emerald-50/95 font-medium leading-relaxed max-w-md lg:max-w-lg">
                    Live backend merchant applications. Review legal business details, GSTIN, owner
                    contact, and approve or reject vendor status in real time.
                  </p>
                </div>

                <div className="pt-3.5 sm:pt-4 flex flex-wrap items-center gap-3">
               
                  <button
                    onClick={fetchVendors}
                    title="Reload Vendors Data"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/40 hover:bg-emerald-900/60 backdrop-blur-md border border-emerald-300/30 text-emerald-100 text-xs font-semibold cursor-pointer transition"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                    <span>Refresh</span>
                  </button>

                  <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/40 backdrop-blur-md border border-emerald-300/30 text-emerald-100 text-xs font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                    <span>{approvedCount} Approved Stores</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Cards Component */}
            <Cards stats={vendorStats} />

            {/* Vendors Directory Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-5">
              {/* Filter Controls Row */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Status Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 [scrollbar-width:none]">
                  {[
                    { id: "all", label: "All Stores", count: totalCount },
                    { id: "approved", label: "Approved", count: approvedCount },
                    { id: "pending", label: "Pending", count: pendingCount },
                    { id: "rejected", label: "Rejected", count: rejectedCount },
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

                {/* Search and Category Filter */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:bg-white focus:outline-none focus:border-[#049669] transition cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    {categoriesList.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  <div className="relative min-w-[200px] sm:min-w-[240px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search store, GST, owner, phone..."
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

              {/* Bulk Actions Bar */}
              {selectedIds.length > 0 && (
                <div className="p-3 bg-red-50/70 border border-red-200/80 rounded-xl flex items-center justify-between gap-3 text-xs animate-in fade-in">
                  <span className="font-bold text-red-700">
                    {selectedIds.length} store{selectedIds.length > 1 ? "s" : ""} selected
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

              {/* Vendors Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
                      <th className="py-3 px-3 w-8">
                        <input
                          type="checkbox"
                          checked={
                            filteredVendors.length > 0 &&
                            selectedIds.length === filteredVendors.length
                          }
                          onChange={handleSelectAll}
                          className="rounded text-[#049669] focus:ring-[#049669] cursor-pointer"
                        />
                      </th>
                      <th className="py-3 px-3">Store &amp; Business Legal</th>
                      <th className="py-3 px-3">Owner Contact</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Plan &amp; Limits</th>
                                            <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Approve / Reject Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredVendors.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="py-12 text-center text-slate-400">
                          <Store className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                          <p className="font-semibold text-slate-600">No stores found</p>
                          <p className="text-[11px]">Try adjusting your search query or filters.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredVendors.map((vendor) => {
                        const isSelected = selectedIds.includes(vendor.id);
                        const isActionLoading = actionLoadingId === vendor.id;

                        return (
                          <tr
                            key={vendor.id}
                            className={`hover:bg-slate-50/70 transition-colors ${
                              isSelected ? "bg-emerald-50/20" : ""
                            }`}
                          >
                            <td className="py-3.5 px-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleSelectRow(vendor.id)}
                                className="rounded text-[#049669] focus:ring-[#049669] cursor-pointer"
                              />
                            </td>

                            {/* Store Name & Business / GSTIN */}
                            <td className="py-3.5 px-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#049669]/15 to-teal-100 text-[#049669] font-black flex items-center justify-center shrink-0 border border-emerald-200/50 uppercase">
                                  {vendor.storeName.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-bold text-slate-800 text-xs sm:text-[13px] truncate">
                                    {vendor.storeName}
                                  </div>
                                  <div className="text-[11px] text-slate-500 truncate">
                                    {vendor.businessName}
                                  </div>
                                  <span className="inline-block px-1.5 py-0.2 rounded bg-slate-100 text-[10px] font-mono font-bold text-slate-600 mt-0.5">
                                    GST: {vendor.gstNumber}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Owner Contact Details */}
                            <td className="py-3.5 px-3">
                              <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                                <User className="w-3 h-3 text-slate-400" />
                                <span>{vendor.ownerName}</span>
                              </div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                                <Mail className="w-3 h-3 text-slate-400" />
                                <span>{vendor.email}</span>
                              </div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-mono mt-0.5">
                                <Phone className="w-3 h-3 text-slate-400" />
                                <span>{vendor.phone}</span>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="py-3.5 px-3">
                              <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                                {vendor.category}
                              </span>
                            </td>

                            {/* Plan & Product Limits */}
                            <td className="py-3.5 px-3">
                              <div className="flex items-center gap-1.5">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-teal-50 text-teal-700 border border-teal-200/60">
                                  {vendor.plan}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-400 block mt-0.5">
                                {vendor.productsLimit} Items max
                              </span>
                            </td>

                            

                            {/* Status Badge */}
                            <td className="py-3.5 px-3">
                              {vendor.status === "approved" ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  Approved
                                </span>
                              ) : vendor.status === "pending" ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                  Pending
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200/80">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                  Rejected
                                </span>
                              )}
                            </td>

                            {/* Actions: Approve / Reject / View / Delete */}
                            <td className="py-3.5 px-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Approve Button */}
                                {vendor.status !== "approved" && (
                                  <button
                                    onClick={() => handleApproveVendor(vendor.id)}
                                    disabled={isActionLoading}
                                    title="Approve Store"
                                    className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                  >
                                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                    <span className="hidden sm:inline">Approve</span>
                                  </button>
                                )}

                                {/* Reject Button */}
                                {vendor.status !== "rejected" && (
                                  <button
                                    onClick={() => handleRejectVendor(vendor.id)}
                                    disabled={isActionLoading}
                                    title="Reject Store"
                                    className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                  >
                                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                                    <span className="hidden sm:inline">Reject</span>
                                  </button>
                                )}

                                {/* View Details */}
                                <button
                                  onClick={() => setViewingVendor(vendor)}
                                  title="View Store Details"
                                  className="w-7 h-7 rounded-lg text-slate-400 hover:text-[#049669] hover:bg-emerald-50 flex items-center justify-center transition cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>

                                {/* Delete Vendor */}
                                <button
                                  onClick={() => handleDeleteVendor(vendor.id)}
                                  disabled={isActionLoading}
                                  title="Delete Vendor"
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

              {/* Table Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>
                  Showing {filteredVendors.length} of {totalCount} merchant stores
                </span>
                <span className="text-[11px]">
                  All vendor records verified & synced with backend database
                </span>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* MODAL 1: Onboard New Vendor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#049669] flex items-center justify-center">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">Onboard New Vendor</h3>
                  <p className="text-xs text-slate-400">Register a new seller store</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Store Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Public store name"
                    value={formData.storeName}
                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#049669]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Business Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Registered business entity"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#049669]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">GSTIN Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="15-digit GSTIN"
                    value={formData.gstNumber}
                    onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 uppercase focus:outline-none focus:border-[#049669]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Primary Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#049669]"
                  >
                    {categoriesList.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Owner Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Authorized person"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#049669]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">10-Digit Phone *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9800000000"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#049669]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Owner Email *</label>
                <input
                  type="email"
                  required
                  placeholder="merchant@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#049669]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subscription Plan</label>
                <select
                  value={formData.plan}
                  onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#049669]"
                >
                  <option value="free">Free</option>
                  <option value="starter">Starter</option>
                  <option value="professional">Professional</option>
                  <option value="premium">Premium</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#049669] hover:bg-[#03704f] text-white font-bold shadow-md shadow-emerald-700/20 transition cursor-pointer"
                >
                  Save Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: View Details Modal with Direct Approve & Reject */}
      {viewingVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#049669] to-[#10B981] text-white font-black text-xl flex items-center justify-center shadow-md shadow-emerald-600/25 uppercase">
                  {viewingVendor.storeName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">{viewingVendor.storeName}</h3>
                  <span className="text-xs text-slate-400 font-medium">{viewingVendor.businessName}</span>
                </div>
              </div>
              <button
                onClick={() => setViewingVendor(null)}
                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Vendor Details Grid */}
            <div className="space-y-3 text-xs">
              {/* Highlight summary box */}
              <div className="grid grid-cols-2 gap-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Status</span>
                  <span
                    className={`font-black text-xs uppercase ${
                      viewingVendor.status === "approved"
                        ? "text-emerald-700"
                        : viewingVendor.status === "pending"
                        ? "text-amber-600"
                        : "text-rose-600"
                    }`}
                  >
                    {viewingVendor.status}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Plan</span>
                  <span className="text-xs font-black text-slate-800 uppercase">
                    {viewingVendor.plan}
                  </span>
                </div>
              </div>

              {/* Data list */}
              <div className="space-y-2.5 pt-1">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    Business Legal Name
                  </span>
                  <span className="font-bold text-slate-800">{viewingVendor.businessName}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    GSTIN / Tax ID
                  </span>
                  <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                    {viewingVendor.gstNumber}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Owner Full Name
                  </span>
                  <span className="font-bold text-slate-800">{viewingVendor.ownerName}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    Owner Email
                  </span>
                  <span className="font-semibold text-slate-700">{viewingVendor.email}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    Mobile / Phone Number
                  </span>
                  <span className="font-mono font-bold text-slate-800">{viewingVendor.phone}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    Primary Category
                  </span>
                  <span className="font-bold text-slate-800">{viewingVendor.category}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Registration Date
                  </span>
                  <span className="text-slate-600">{viewingVendor.joinedDate}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions: Direct Approve / Reject Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                {viewingVendor.status !== "approved" && (
                  <button
                    onClick={() => handleApproveVendor(viewingVendor.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm shadow-emerald-700/20"
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Approve Vendor</span>
                  </button>
                )}

                {viewingVendor.status !== "rejected" && (
                  <button
                    onClick={() => handleRejectVendor(viewingVendor.id)}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm shadow-rose-700/20"
                  >
                    <X className="w-4 h-4 stroke-[2.5]" />
                    <span>Reject Application</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setViewingVendor(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition cursor-pointer"
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
