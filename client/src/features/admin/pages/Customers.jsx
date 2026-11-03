import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Cards from "../components/Cards";
import { adminService } from "../../../services";
import {
  Users,
  Search,
  Plus,
  Eye,
  Trash2,
  ChevronUp,
  ShoppingBag,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  CircleDollarSign,
  UserCheck,
  X,
  Check,
  Store,
  Package,
  Calendar,
  RefreshCw,
} from "lucide-react";
import bannerAdminCustomersImg from "../../../assets/banner-admin-customers-3d.png";

const INITIAL_CUSTOMERS = [
  {
    id: "cust-1",
    name: "Sneha Roy",
    email: "sneha.roy@gmail.com",
    phone: "9811233445",
    ordersCount: 28,
    totalSpent: "₹34,800",
    spentRaw: 34800,
    joinedDate: "Mar 12, 2026",
    lastActive: "Today, 11:20 AM",
    address: "B-402, Sea Green Heights, Andheri West, Mumbai 400053",
    purchases: [
      {
        product: "Aashirvaad Superior MP Atta (10kg)",
        vendor: "Best Deals Superstore",
        qty: 2,
        price: "₹920",
      },
      {
        product: "Fortune Sunlite Refined Oil (5L)",
        vendor: "Organic Bliss Farm",
        qty: 1,
        price: "₹680",
      },
    ],
  },
  {
    id: "cust-2",
    name: "Vikram Malhotra",
    email: "vikram.m@outlook.com",
    phone: "9822344556",
    ordersCount: 34,
    totalSpent: "₹48,250",
    spentRaw: 48250,
    joinedDate: "Jan 05, 2026",
    lastActive: "Today, 09:45 AM",
    address: "Flat 12A, DLF Phase 5, Gurgaon, Haryana 122002",
    purchases: [
      {
        product: "Amul Taaza Toned Milk (1L)",
        vendor: "Fresh Dairy Direct",
        qty: 6,
        price: "₹420",
      },
      {
        product: "Britannia Whole Wheat Bread (400g)",
        vendor: "Sweet Treats Patisserie",
        qty: 2,
        price: "₹110",
      },
    ],
  },
  {
    id: "cust-3",
    name: "Ananya Deshmukh",
    email: "ananya.d@gmail.com",
    phone: "9733455667",
    ordersCount: 16,
    totalSpent: "₹18,900",
    spentRaw: 18900,
    joinedDate: "May 20, 2026",
    lastActive: "Yesterday",
    address: "Row House 7, Baner Road, Pune 411045",
    purchases: [
      {
        product: "Dabur Chyawanprash Booster (1kg)",
        vendor: "Pure Wellness Ayurveda",
        qty: 1,
        price: "₹395",
      },
      {
        product: "Organic Pure Honey (500g)",
        vendor: "Organic Bliss Farm",
        qty: 2,
        price: "₹520",
      },
    ],
  },
  {
    id: "cust-4",
    name: "Mohit Verma",
    email: "mohit.verma@yahoo.com",
    phone: "9944566778",
    ordersCount: 8,
    totalSpent: "₹9,450",
    spentRaw: 9450,
    joinedDate: "Jul 18, 2026",
    lastActive: "2 days ago",
    address: "24, 1st Cross, Indiranagar, Bengaluru 560038",
    purchases: [
      {
        product: "Haldiram's Aloo Bhujia (400g)",
        vendor: "City Munchies & Snacks",
        qty: 4,
        price: "₹360",
      },
      {
        product: "Cadbury Celebrations Box",
        vendor: "Sweet Treats Patisserie",
        qty: 1,
        price: "₹350",
      },
    ],
  },
  {
    id: "cust-5",
    name: "Rohan Kulkarni",
    email: "rohan.kulkarni@gmail.com",
    phone: "9855677889",
    ordersCount: 22,
    totalSpent: "₹29,100",
    spentRaw: 29100,
    joinedDate: "Feb 14, 2026",
    lastActive: "Today, 01:10 PM",
    address: "Plot 89, Jubilee Hills, Hyderabad 500033",
    purchases: [
      {
        product: "Daawat Rozana Basmati Rice (5kg)",
        vendor: "Spice & Masala Heritage",
        qty: 2,
        price: "₹890",
      },
      {
        product: "Fresh Cow Milk Paneer (500g)",
        vendor: "Fresh Dairy Direct",
        qty: 2,
        price: "₹290",
      },
    ],
  },
  {
    id: "cust-6",
    name: "Pooja Reddy",
    email: "pooja.reddy@gmail.com",
    phone: "9766788990",
    ordersCount: 12,
    totalSpent: "₹14,200",
    spentRaw: 14200,
    joinedDate: "Jun 09, 2026",
    lastActive: "3 days ago",
    address: "Apt 501, Prestige Tech Park, Marathahalli, Bengaluru 560103",
    purchases: [
      {
        product: "Surf Excel Matic Liquid (2L)",
        vendor: "Daily Clean Essentials",
        qty: 1,
        price: "₹450",
      },
      {
        product: "Dettol Surface Spray (500ml)",
        vendor: "Daily Clean Essentials",
        qty: 2,
        price: "₹398",
      },
    ],
  },
  {
    id: "cust-7",
    name: "Aditya Sen",
    email: "aditya.sen@gmail.com",
    phone: "9877899001",
    ordersCount: 3,
    totalSpent: "₹2,850",
    spentRaw: 2850,
    joinedDate: "Sep 01, 2026",
    lastActive: "Oct 15, 2026",
    address: "56B, Salt Lake Sector 2, Kolkata 700091",
    purchases: [
      {
        product: "Lipton Green Tea Honey Lemon (100 Bags)",
        vendor: "Best Deals Superstore",
        qty: 1,
        price: "₹550",
      },
      {
        product: "Tata Salt Vacuum Evaporated (1kg)",
        vendor: "Spice & Masala Heritage",
        qty: 2,
        price: "₹56",
      },
    ],
  },
  {
    id: "cust-8",
    name: "Meera Nair",
    email: "meera.nair@gmail.com",
    phone: "9988900112",
    ordersCount: 19,
    totalSpent: "₹22,600",
    spentRaw: 22600,
    joinedDate: "Apr 04, 2026",
    lastActive: "Yesterday",
    address: "Tower 3, Hiranandani Estate, Thane, Mumbai 400607",
    purchases: [
      {
        product: "Fresh Gir Cow A2 Desi Ghee (1L)",
        vendor: "Fresh Dairy Direct",
        qty: 1,
        price: "₹1,450",
      },
      {
        product: "Artisan Chocolate Truffle Cake",
        vendor: "Sweet Treats Patisserie",
        qty: 1,
        price: "₹550",
      },
    ],
  },
];

export default function Customers() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingCustomer, setViewingCustomer] = useState(null);

  // New Customer Form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    product: "Aashirvaad Superior MP Atta (10kg)",
    vendor: "Best Deals Superstore",
  });

  // Scroll Animation State
  const scrollContainerRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Fetch customers from DB
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAllCustomers();
      const raw = Array.isArray(res) ? res : res?.customers || [];
      if (raw.length > 0) {
        setCustomers(raw);
      } else {
        setCustomers(INITIAL_CUSTOMERS);
      }
    } catch (err) {
      console.warn("Backend customers API unreachable, using initial dataset:", err);
      setCustomers(INITIAL_CUSTOMERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
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

  // Filter logic
  const filteredCustomers = customers.filter((c) => {
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchPurchases = c.purchases?.some(
        (p) =>
          p.product.toLowerCase().includes(q) ||
          p.vendor.toLowerCase().includes(q)
      );
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone && c.phone.toLowerCase().includes(q)) ||
        matchPurchases
      );
    }
    return true;
  });

  // Selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredCustomers.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Delete Customer
  const handleDeleteCustomer = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer account?")) {
      try {
        await adminService.deleteCustomer(id);
      } catch (err) {
        console.warn("Delete customer error:", err);
      } finally {
        setCustomers((prev) => prev.filter((c) => c.id !== id));
        setSelectedIds((prev) => prev.filter((item) => item !== id));
        if (viewingCustomer && viewingCustomer.id === id) setViewingCustomer(null);
      }
    }
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedIds.length} selected customer account(s)?`
      )
    ) {
      for (const id of selectedIds) {
        try {
          await adminService.deleteCustomer(id);
        } catch {}
      }
      setCustomers((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
      setSelectedIds([]);
    }
  };

  // Submit Add New Customer
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    const newCustomer = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone.replace(/\D/g, "").slice(0, 10) || "9800000000",
      ordersCount: 1,
      totalSpent: "₹920",
      spentRaw: 920,
      joinedDate: "Today",
      lastActive: "Just now",
      address: formData.address || "Marketplace Delivery Location",
      purchases: [
        {
          product: formData.product,
          vendor: formData.vendor,
          qty: 1,
          price: "₹920",
        },
      ],
    };

    setCustomers([newCustomer, ...customers]);
    setIsAddModalOpen(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      product: "Aashirvaad Superior MP Atta (10kg)",
      vendor: "Best Deals Superstore",
    });
  };

  // Metrics
  const totalCount = customers.length;
  const totalOrders = customers.reduce((acc, c) => acc + (c.ordersCount || 0), 0);
  const totalSpend = customers.reduce((acc, c) => acc + (c.spentRaw || 0), 0);

  const customerStats = [
    {
      id: "total-users",
      title: "Total Customers",
      value: String(totalCount),
      icon: Users,
      iconColor:
        "text-white bg-gradient-to-tr from-[#049669] to-[#10B981] border-emerald-400/40 shadow-md shadow-emerald-600/25",
      bgGradient: "from-emerald-50/90 via-white/85 to-white/60",
      accentBorder:
        "border-emerald-200/80 hover:border-emerald-400 hover:shadow-[0_16px_36px_rgba(4,150,105,0.15)]",
      glowColor: "bg-emerald-400/25",
      valueColor: "text-[#049669]",
    },
    {
      id: "total-orders",
      title: "Total Orders Placed",
      value: String(totalOrders),
      icon: ShoppingBag,
      iconColor:
        "text-white bg-gradient-to-tr from-[#059669] to-teal-500 border-teal-400/40 shadow-md shadow-teal-600/25",
      bgGradient: "from-teal-50/90 via-white/85 to-white/60",
      accentBorder:
        "border-teal-200/80 hover:border-teal-400 hover:shadow-[0_16px_36px_rgba(13,148,136,0.15)]",
      glowColor: "bg-teal-400/25",
      valueColor: "text-[#1E1B4B]",
    },
    {
      id: "active-buyers",
      title: "Active Buyers",
      value: String(totalCount),
      icon: UserCheck,
      iconColor:
        "text-white bg-gradient-to-tr from-amber-500 to-amber-400 border-amber-300 shadow-md shadow-amber-500/25",
      bgGradient: "from-amber-50/90 via-white/85 to-white/60",
      accentBorder:
        "border-amber-200/80 hover:border-amber-400 hover:shadow-[0_16px_36px_rgba(245,158,11,0.15)]",
      glowColor: "bg-amber-400/25",
      valueColor: "text-amber-600",
    },
    {
      id: "total-spend",
      title: "Total Customer Spend",
      value: `₹${(totalSpend / 100000).toFixed(2)}L`,
      icon: CircleDollarSign,
      iconColor:
        "text-white bg-gradient-to-tr from-[#049669] via-emerald-600 to-teal-600 border-emerald-400/40 shadow-md shadow-emerald-600/25",
      bgGradient: "from-emerald-50/70 via-white/85 to-white/60",
      accentBorder:
        "border-emerald-200/80 hover:border-emerald-400 hover:shadow-[0_16px_36px_rgba(4,150,105,0.15)]",
      glowColor: "bg-emerald-400/20",
      valueColor: "text-[#1E1B4B]",
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
                  <linearGradient id="custBannerBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1B744A" />
                    <stop offset="40%" stopColor="#228C52" />
                    <stop offset="100%" stopColor="#2CA85C" />
                  </linearGradient>
                </defs>
                <rect width="1024" height="200" fill="url(#custBannerBgGrad)" />
              </svg>

              <div className="absolute right-3 sm:right-6 lg:right-10 top-1/2 -translate-y-1/2 h-[90%] sm:h-[94%] lg:h-[98%] w-auto max-w-[38%] sm:max-w-[42%] lg:max-w-[45%] pointer-events-none select-none z-10 hidden sm:flex items-center justify-end">
                <img
                  src={bannerAdminCustomersImg}
                  alt="Customers Directory 3D artwork"
                  className="h-full w-auto object-contain object-right drop-shadow-[0_12px_24px_rgba(0,0,0,0.22)]"
                />
              </div>

              <div className="relative z-10 flex-1 flex flex-col justify-between max-w-xl">
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-emerald-100">
                      CUSTOMER RELATIONSHIP
                    </span>
                    <span className="w-7 h-[1.5px] bg-emerald-200/80 rounded-full inline-block" />
                  </div>

                  <h1 className="text-xl sm:text-2xl lg:text-[30px] font-black tracking-tight text-white leading-tight drop-shadow-sm">
                    Customers Directory
                  </h1>

                  <p className="text-xs sm:text-[13px] text-emerald-50/95 font-medium leading-relaxed max-w-md lg:max-w-lg">
                    Live database records. View customer purchase history, products bought from
                    respective vendor merchant stores, and total spending.
                  </p>
                </div>

                <div className="pt-3.5 sm:pt-4 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-white text-[#049669] hover:text-[#03704f] hover:bg-emerald-50 font-bold text-xs sm:text-sm shadow-md shadow-emerald-950/20 hover:shadow-lg hover:scale-[1.02] active:scale-98 transition-all duration-200 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Add New Customer</span>
                  </button>

                  <button
                    onClick={fetchCustomers}
                    title="Reload from Database"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/40 hover:bg-emerald-900/60 backdrop-blur-md border border-emerald-300/30 text-emerald-100 text-xs font-semibold cursor-pointer transition"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                    <span>Refresh DB</span>
                  </button>

                  <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/40 backdrop-blur-md border border-emerald-300/30 text-emerald-100 text-xs font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                    <span>{totalCount} Verified Buyers Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Cards */}
            <Cards stats={customerStats} />

            {/* Customers Directory Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-5">
              {/* Filter Controls Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-800">Customers List</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/60">
                    {filteredCustomers.length} Records
                  </span>
                </div>

                {/* Right: Search */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative min-w-[240px] sm:min-w-[320px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search customer, vendor, product..."
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
                    {selectedIds.length} customer{selectedIds.length > 1 ? "s" : ""} selected
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

              {/* Customers Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
                      <th className="py-3 px-3 w-8">
                        <input
                          type="checkbox"
                          checked={
                            filteredCustomers.length > 0 &&
                            selectedIds.length === filteredCustomers.length
                          }
                          onChange={handleSelectAll}
                          className="rounded text-[#049669] focus:ring-[#049669] cursor-pointer"
                        />
                      </th>
                      <th className="py-3 px-3">Customer Profile</th>
                      <th className="py-3 px-3">Contact Details</th>
                      <th className="py-3 px-3 text-center">Orders</th>
                      <th className="py-3 px-3">Total Spend</th>
                      <th className="py-3 px-3 min-w-[360px]">Purchased Products &amp; Vendor</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="py-12 text-center text-slate-400">
                          <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                          <p className="font-semibold text-slate-600">No customers found</p>
                          <p className="text-[11px]">Try searching with a different keyword or filter.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredCustomers.map((customer) => {
                        const isSelected = selectedIds.includes(customer.id);

                        return (
                          <tr
                            key={customer.id}
                            className={`hover:bg-slate-50/70 transition-colors ${
                              isSelected ? "bg-emerald-50/20" : ""
                            }`}
                          >
                            <td className="py-3.5 px-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleSelectRow(customer.id)}
                                className="rounded text-[#049669] focus:ring-[#049669] cursor-pointer"
                              />
                            </td>

                            {/* Customer Avatar & Name */}
                            <td className="py-3.5 px-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#049669]/15 to-teal-100 text-[#049669] font-black flex items-center justify-center shrink-0 border border-emerald-200/50 uppercase">
                                  {customer.name?.charAt(0) || "U"}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-bold text-slate-800 text-xs sm:text-[13px] truncate">
                                    {customer.name}
                                  </div>
                                  <span className="text-[11px] text-slate-400">
                                    Joined {customer.joinedDate}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Contact Details */}
                            <td className="py-3.5 px-3">
                              <div className="font-semibold text-slate-700">
                                {customer.email}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono">
                                {customer.phone}
                              </div>
                            </td>

                            {/* Orders count */}
                            <td className="py-3.5 px-3 text-center font-bold text-slate-700">
                              {customer.ordersCount}
                            </td>

                            {/* Total Spend */}
                            <td className="py-3.5 px-3 font-black text-slate-800">
                              {customer.totalSpent}
                            </td>

                            {/* Purchased Products & Which Vendor */}
                            <td className="py-3.5 px-3">
                              {customer.purchases && customer.purchases.length > 0 ? (
                                <div className="space-y-1.5 max-w-md">
                                  {customer.purchases.map((p, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-slate-50/80 border border-slate-100 hover:bg-emerald-50/40 transition"
                                    >
                                      <div className="min-w-0 flex items-center gap-1.5">
                                        <ShoppingBag className="w-3.5 h-3.5 text-[#049669] shrink-0" />
                                        <span
                                          className="font-bold text-slate-800 text-[11px] truncate"
                                          title={p.product}
                                        >
                                          {p.product}
                                        </span>
                                      </div>
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-emerald-700 text-[10px] font-bold shrink-0 shadow-2xs">
                                        <Store className="w-2.5 h-2.5 text-[#049669]" />
                                        <span className="truncate max-w-[130px]">{p.vendor}</span>
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-[11px] text-slate-400 italic">
                                  No purchase orders yet
                                </span>
                              )}
                            </td>

                            {/* Row Actions */}
                            <td className="py-3.5 px-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => setViewingCustomer(customer)}
                                  title="View Customer Profile & Purchase History"
                                  className="w-7 h-7 rounded-lg text-slate-400 hover:text-[#049669] hover:bg-emerald-50 flex items-center justify-center transition cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCustomer(customer.id)}
                                  title="Delete Customer"
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
                  Showing {filteredCustomers.length} of {totalCount} active buyers
                </span>
                <span className="text-[11px]">
                  All purchases verified across registered vendor stores
                </span>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* MODAL 1: Add New Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#049669] flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">Add New Customer</h3>
                  <p className="text-xs text-slate-400">Create a customer profile with initial order</p>
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
              <div>
                <label className="block font-bold text-slate-700 mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#049669]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="customer@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#049669]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">10-Digit Mobile *</label>
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

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 block">Initial Purchase Details:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Product Bought</label>
                    <input
                      type="text"
                      value={formData.product}
                      onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#049669]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Purchased From Vendor</label>
                    <input
                      type="text"
                      value={formData.vendor}
                      onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#049669]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Delivery Address</label>
                <textarea
                  rows="2"
                  placeholder="Street address, building, locality"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#049669]"
                />
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
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: View Customer Profile & Purchases Modal */}
      {viewingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#049669] to-[#10B981] text-white font-black text-xl flex items-center justify-center shadow-md shadow-emerald-600/25 uppercase">
                  {viewingCustomer.name?.charAt(0) || "U"}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">{viewingCustomer.name}</h3>
                  <span className="text-[11px] text-slate-400">ID: {viewingCustomer.id}</span>
                </div>
              </div>
              <button
                onClick={() => setViewingCustomer(null)}
                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Spent Summary */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Spent</span>
                <span className="text-base font-black text-[#049669]">{viewingCustomer.totalSpent}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Orders</span>
                <span className="text-base font-black text-slate-800">{viewingCustomer.ordersCount}</span>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Email Address
                </span>
                <span className="font-semibold text-slate-700">{viewingCustomer.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Phone Number
                </span>
                <span className="font-mono font-bold text-slate-800">{viewingCustomer.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Delivery Address
                </span>
                <span className="font-medium text-slate-700 max-w-xs text-right truncate">
                  {viewingCustomer.address || "Standard Delivery Location"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Member Since
                </span>
                <span className="font-medium text-slate-700">{viewingCustomer.joinedDate}</span>
              </div>
            </div>

            {/* Purchased Products & Vendors Breakdown */}
            <div className="space-y-2 pt-1 text-xs">
              <span className="font-black text-slate-800 text-xs block">
                Purchased Products &amp; Vendor Stores:
              </span>
              <div className="space-y-2">
                {viewingCustomer.purchases && viewingCustomer.purchases.length > 0 ? (
                  viewingCustomer.purchases.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#049669] flex items-center justify-center shrink-0">
                          <Package className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-800 text-xs truncate">
                            {p.product}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1">
                            <span>Qty: {p.qty}</span>
                            <span>•</span>
                            <span className="font-bold text-slate-700">{p.price}</span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                          <Store className="w-3 h-3 text-[#049669]" />
                          <span>{p.vendor}</span>
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-xs italic py-2">
                    No purchase history found for this account.
                  </p>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setViewingCustomer(null)}
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
