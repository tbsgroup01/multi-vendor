import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Cards from "../components/Cards";
import {
  Bell,
  CheckCircle2,
  Clock,
  ShoppingBag,
  Wallet,
  AlertTriangle,
  Info,
  ChevronUp,
  Search,
  CheckCheck,
  Trash2,
  ExternalLink,
  Filter,
  Sparkles,
  ArrowRight,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";
import bannerNotificationsImg from "../../../assets/banner-notifications-3d.png";

const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    type: "order",
    title: "New Order Received #ORD-1024",
    message: "Customer 'Aarav Sharma' placed a new order for 3 items worth ₹2,499. Please review and pack.",
    time: "5 mins ago",
    date: "Today, 12:28 PM",
    isUnread: true,
    link: "/vendor/orders",
    linkText: "View Order",
    category: "orders",
  },
  {
    id: "notif-2",
    type: "payout",
    title: "Payout Disbursed ₹18,450",
    message: "Weekly settlement payout has been processed successfully to your registered HDFC Bank account.",
    time: "42 mins ago",
    date: "Today, 11:51 AM",
    isUnread: true,
    link: "/vendor/payments",
    linkText: "View Settlement",
    category: "payouts",
  },
  {
    id: "notif-3",
    type: "stock",
    title: "Low Stock Alert: Organic Cow Ghee (1L)",
    message: "Current stock level is 3 units, which is below your safety threshold of 5 units. Replenish soon.",
    time: "2 hours ago",
    date: "Today, 10:30 AM",
    isUnread: true,
    link: "/vendor/products",
    linkText: "Update Stock",
    category: "stock",
  },
  {
    id: "notif-4",
    type: "order",
    title: "Order Delivered Successfully #ORD-0998",
    message: "Order #ORD-0998 has been marked as Delivered by the logistics partner. Payment credited to pending balance.",
    time: "5 hours ago",
    date: "Today, 07:15 AM",
    isUnread: false,
    link: "/vendor/orders",
    linkText: "Order Details",
    category: "orders",
  },
  {
    id: "notif-5",
    type: "system",
    title: "Category 'Fresh Farm Organics' Approved",
    message: "Your requested category addition has been verified and approved by the ShopMart Marketplace Team.",
    time: "Yesterday",
    date: "Nov 02, 05:40 PM",
    isUnread: false,
    link: "/vendor/categories",
    linkText: "View Categories",
    category: "system",
  },
  {
    id: "notif-8",
    type: "stock",
    title: "Out of Stock: Whole Farm Milk (500ml)",
    message: "Inventory reached zero. The product listing is temporarily hidden from customer store search.",
    time: "3 days ago",
    date: "Oct 31, 04:22 PM",
    isUnread: false,
    link: "/vendor/products",
    linkText: "Restock Now",
    category: "stock",
  },
];

export default function Notifications() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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

  // Notification Operations
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isUnread: false } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearReadNotifications = () => {
    setNotifications((prev) => prev.filter((n) => n.isUnread));
  };

  // Filtered Notifications
  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === "unread" && !notif.isUnread) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return (
        notif.title.toLowerCase().includes(q) ||
        notif.message.toLowerCase().includes(q) ||
        notif.date.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const unreadCount = notifications.filter((n) => n.isUnread).length;
  const readCount = notifications.filter((n) => !n.isUnread).length;
  const todayCount = notifications.filter(
    (n) => n.date.startsWith("Today") || n.time.includes("min") || n.time.includes("hour")
  ).length;

  const notificationStats = [
    {
      id: "total",
      title: "Total Notifications",
      value: String(notifications.length),
      change: "All recorded",
      isPositive: true,
      icon: Bell,
      iconColor: "text-white bg-gradient-to-tr from-[#049669] to-[#10B981] border-emerald-400/40 shadow-md shadow-emerald-600/25",
      bgGradient: "from-emerald-50/90 via-white/85 to-white/60",
      accentBorder: "border-emerald-200/80 hover:border-emerald-400 hover:shadow-[0_16px_36px_rgba(4,150,105,0.15)]",
      glowColor: "bg-emerald-400/25",
      valueColor: "text-[#049669]",
    },
    {
      id: "unread",
      title: "Unread Alerts",
      value: String(unreadCount),
      change: "Needs attention",
      isPositive: false,
      icon: Sparkles,
      iconColor: "text-white bg-gradient-to-tr from-amber-500 to-amber-400 border-amber-300 shadow-md shadow-amber-500/25",
      bgGradient: "from-amber-50/90 via-white/85 to-white/60",
      accentBorder: "border-amber-200/80 hover:border-amber-400 hover:shadow-[0_16px_36px_rgba(245,158,11,0.15)]",
      glowColor: "bg-amber-400/25",
      valueColor: "text-amber-600",
    },
    {
      id: "read",
      title: "Read Notifications",
      value: String(readCount),
      change: "Acknowledged",
      isPositive: true,
      icon: CheckCheck,
      iconColor: "text-white bg-gradient-to-tr from-[#059669] to-teal-500 border-teal-400/40 shadow-md shadow-teal-600/25",
      bgGradient: "from-teal-50/90 via-white/85 to-white/60",
      accentBorder: "border-teal-200/80 hover:border-teal-400 hover:shadow-[0_16px_36px_rgba(13,148,136,0.15)]",
      glowColor: "bg-teal-400/25",
      valueColor: "text-[#1E1B4B]",
    },
    {
      id: "today",
      title: "Today's Alerts",
      value: String(todayCount),
      change: "Received today",
      isPositive: true,
      icon: Clock,
      iconColor: "text-white bg-gradient-to-tr from-[#049669] via-emerald-600 to-teal-600 border-emerald-400/40 shadow-md shadow-emerald-600/25",
      bgGradient: "from-emerald-50/70 via-white/85 to-white/60",
      accentBorder: "border-emerald-200/80 hover:border-emerald-400 hover:shadow-[0_16px_36px_rgba(4,150,105,0.15)]",
      glowColor: "bg-emerald-400/20",
      valueColor: "text-[#1E1B4B]",
    },
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case "order":
        return {
          icon: ShoppingBag,
          color: "text-[#049669]",
          bg: "bg-emerald-50",
          border: "border-emerald-200/60",
        };
      case "payout":
        return {
          icon: Wallet,
          color: "text-teal-600",
          bg: "bg-teal-50",
          border: "border-teal-200/60",
        };
      case "stock":
        return {
          icon: AlertTriangle,
          color: "text-amber-600",
          bg: "bg-amber-50",
          border: "border-amber-200/60",
        };
      case "system":
      default:
        return {
          icon: ShieldCheck,
          color: "text-sky-600",
          bg: "bg-sky-50",
          border: "border-sky-200/60",
        };
    }
  };

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
                  <linearGradient id="notifBannerBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1B744A" />
                    <stop offset="40%" stopColor="#228C52" />
                    <stop offset="100%" stopColor="#2CA85C" />
                  </linearGradient>
                  <linearGradient id="notifWaveHighlight" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#38C260" stopOpacity="0.5" />
                    <stop offset="60%" stopColor="#259452" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="notifWaveDeep" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#114E30" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#186740" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <rect width="1024" height="200" fill="url(#notifBannerBgGrad)" />
                <path
                  d="M 0 200 C 240 185 380 130 620 160 C 800 182 920 150 1024 115 L 1024 200 Z"
                  fill="url(#notifWaveDeep)"
                />
                <path
                  d="M 280 0 C 420 75 600 40 740 100 C 870 155 945 85 1024 40 L 1024 0 Z"
                  fill="url(#notifWaveHighlight)"
                />
                <path
                  d="M 0 0 C 300 0 420 120 670 80 C 850 50 930 20 1024 0 Z"
                  fill="white"
                  fillOpacity="0.07"
                />
              </svg>

              {/* Specular glass reflection */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-200/60 to-transparent" />

              {/* Right 3D Notifications Artwork - Transparent PNG */}
              <div className="absolute right-3 sm:right-6 lg:right-10 top-1/2 -translate-y-1/2 h-[90%] sm:h-[94%] lg:h-[98%] w-auto max-w-[38%] sm:max-w-[42%] lg:max-w-[45%] pointer-events-none select-none z-10 hidden sm:flex items-center justify-end">
                <img
                  src={bannerNotificationsImg}
                  alt="Notifications 3D artwork"
                  className="h-full w-auto object-contain object-right drop-shadow-[0_12px_24px_rgba(0,0,0,0.22)]"
                />
              </div>

              {/* Left Content Area */}
              <div className="relative z-10 flex-1 flex flex-col justify-between max-w-xl">
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-emerald-100">
                      COMMUNICATIONS &amp; ALERTS
                    </span>
                    <span className="w-7 h-[1.5px] bg-emerald-200/80 rounded-full inline-block" />
                  </div>

                  <h1 className="text-xl sm:text-2xl lg:text-[30px] font-black tracking-tight text-white leading-tight drop-shadow-sm">
                    Store Notifications
                  </h1>

                  <p className="text-xs sm:text-[13px] text-emerald-50/95 font-medium leading-relaxed max-w-md lg:max-w-lg">
                    Stay updated with real-time customer orders, payout settlements, inventory alerts, and official marketplace notices.
                  </p>
                </div>

                <div className="pt-3.5 sm:pt-4 flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                    className={`inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-md transition-all duration-200 cursor-pointer ${
                      unreadCount > 0
                        ? "bg-white text-[#049669] hover:text-[#03704f] hover:bg-emerald-50 hover:shadow-lg hover:scale-[1.02] active:scale-98"
                        : "bg-white/70 text-emerald-800/60 cursor-not-allowed"
                    }`}
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span>Mark All as Read ({unreadCount})</span>
                  </button>

                  {unreadCount > 0 && (
                    <span className="text-[11px] font-semibold text-emerald-100/90 hidden md:inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                      {unreadCount} unread alert{unreadCount > 1 ? "s" : ""} requiring attention
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Modern Animated Dashboard Stats Cards Component */}
            <Cards stats={notificationStats} />

            {/* Notification Filter Bar & Search */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 [scrollbar-width:none]">
                  {[
                    { id: "all", label: "All Alerts", count: notifications.length },
                    { id: "unread", label: "Unread", count: unreadCount },
                  ].map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                          isActive
                            ? "bg-[#049669] text-white shadow-sm shadow-emerald-700/20"
                            : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <span>{tab.label}</span>
                        {tab.count !== undefined && (
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {tab.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Search Bar */}
                <div className="relative min-w-[200px] sm:min-w-[240px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search notifications..."
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

              {/* Notification List */}
              <div className="space-y-2.5 pt-1">
                {filteredNotifications.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-[#049669] flex items-center justify-center">
                      <Bell className="w-7 h-7 stroke-[1.5]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-700">No Notifications Found</h3>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                        {searchQuery
                          ? `No notifications matching "${searchQuery}". Try a different keyword.`
                          : "You're all caught up! There are no alerts in this category."}
                      </p>
                    </div>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="text-xs font-bold text-[#049669] hover:underline"
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                ) : (
                  filteredNotifications.map((notif) => {
                    const iconConfig = getNotificationIcon(notif.type);
                    const IconComponent = iconConfig.icon;

                    return (
                      <div
                        key={notif.id}
                        className={`group relative rounded-xl sm:rounded-2xl p-4 sm:p-5 border transition-all duration-200 ${
                          notif.isUnread
                            ? "bg-emerald-50/30 border-emerald-200/80 shadow-[0_2px_12px_rgba(4,150,105,0.06)]"
                            : "bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          {/* Left Icon */}
                          <div
                            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex-shrink-0 flex items-center justify-center border ${iconConfig.bg} ${iconConfig.border} ${iconConfig.color} shadow-sm`}
                          >
                            <IconComponent className="w-5 h-5" />
                          </div>

                          {/* Content Body */}
                          <div className="flex-1 min-w-0 pr-6">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h4
                                className={`text-xs sm:text-sm font-bold ${
                                  notif.isUnread ? "text-slate-900" : "text-slate-700"
                                }`}
                              >
                                {notif.title}
                              </h4>
                              {notif.isUnread && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#049669] text-white">
                                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                  New
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-500 leading-relaxed mb-3">
                              {notif.message}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                              <span className="flex items-center gap-1 font-medium text-slate-500">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                {notif.date}
                              </span>

                              <span className="text-slate-300">•</span>

                              <span className="capitalize font-semibold text-emerald-700/80 bg-emerald-50 px-2 py-0.5 rounded-md text-[10px]">
                                {notif.category}
                              </span>

                              {notif.link && (
                                <Link
                                  to={notif.link}
                                  className="inline-flex items-center gap-1 font-bold text-[#049669] hover:text-[#03704f] hover:underline ml-auto"
                                >
                                  <span>{notif.linkText}</span>
                                  <ArrowRight className="w-3 h-3" />
                                </Link>
                              )}
                            </div>
                          </div>

                          {/* Action Menu Buttons */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {notif.isUnread && (
                              <button
                                onClick={() => markAsRead(notif.id)}
                                title="Mark as read"
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#049669] hover:bg-emerald-50 transition-colors cursor-pointer"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              onClick={() => deleteNotification(notif.id)}
                              title="Delete notification"
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Bottom Quick Tools */}
              {notifications.length > 0 && (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>
                    Showing {filteredNotifications.length} of {notifications.length} alerts
                  </span>
                  <button
                    onClick={clearReadNotifications}
                    className="font-medium text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    Clear Read Notifications
                  </button>
                </div>
              )}
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

