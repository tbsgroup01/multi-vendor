import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  Bell,
  ExternalLink,
  Store,
  User,
} from "lucide-react";
import logo from "../../../assets/logo.png";
import { vendorService, getUploadUrl } from "../../../services";

export default function Navbar({ onToggleSidebar }) {
  const location = useLocation();
  const [sidebarLogo, setSidebarLogo] = useState(() => {
    return (
      localStorage.getItem("vendor_sidebar_logo") ||
      localStorage.getItem("brand_sidebar_logo") ||
      null
    );
  });

  const [profileUser, setProfileUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  // 1. Fetch vendor store logo and profile user directly from DB on mount
  useEffect(() => {
    let isMounted = true;
    const fetchDbProfile = async () => {
      try {
        const res = await vendorService.getMySettings();
        if (res && res.vendor) {
          // Store Logo
          let settings = res.vendor.storeSettings;
          if (typeof settings === "string") {
            try {
              settings = JSON.parse(settings);
            } catch (e) {
              settings = null;
            }
          }
          const dbLogo = settings?.logo || null;
          if (isMounted && dbLogo) {
            setSidebarLogo(dbLogo);
            localStorage.setItem("vendor_sidebar_logo", dbLogo);
            localStorage.setItem("brand_sidebar_logo", dbLogo);
          }

          // Vendor Profile User (Avatar, Name, Email)
          if (isMounted && res.vendor.user) {
            setProfileUser(res.vendor.user);
            try {
              const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
              localStorage.setItem("user", JSON.stringify({ ...storedUser, ...res.vendor.user }));
            } catch {
              // ignore
            }
          }
        }
      } catch (err) {
        console.warn("Could not fetch vendor profile from DB:", err);
      }
    };
    fetchDbProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Real-time update when logo or profile is updated in Settings
  useEffect(() => {
    const handleLogoUpdate = () => {
      const stored =
        localStorage.getItem("vendor_sidebar_logo") ||
        localStorage.getItem("brand_sidebar_logo") ||
        null;
      setSidebarLogo(stored);
    };

    const handleProfileUpdate = () => {
      try {
        setProfileUser(JSON.parse(localStorage.getItem("user") || "null"));
      } catch {
        setProfileUser(null);
      }
    };

    window.addEventListener("vendor_logo_updated", handleLogoUpdate);
    window.addEventListener("brand_logo_updated", handleLogoUpdate);
    window.addEventListener("vendor_profile_updated", handleProfileUpdate);
    window.addEventListener("storage", handleLogoUpdate);
    window.addEventListener("storage", handleProfileUpdate);

    return () => {
      window.removeEventListener("vendor_logo_updated", handleLogoUpdate);
      window.removeEventListener("brand_logo_updated", handleLogoUpdate);
      window.removeEventListener("vendor_profile_updated", handleProfileUpdate);
      window.removeEventListener("storage", handleLogoUpdate);
      window.removeEventListener("storage", handleProfileUpdate);
    };
  }, []);

  // 3. Fetch real unread notifications count (Orders & Payments)
  useEffect(() => {
    let isMounted = true;
    const fetchUnreadCount = async () => {
      try {
        const res = await vendorService.getMyNotifications();
        if (isMounted && res && Array.isArray(res.notifications)) {
          const readIds = new Set(JSON.parse(localStorage.getItem("vendor_read_notifications") || "[]"));
          const deletedIds = new Set(JSON.parse(localStorage.getItem("vendor_deleted_notifications") || "[]"));
          const unread = res.notifications.filter((n) => !deletedIds.has(n.id) && !readIds.has(n.id)).length;
          setUnreadNotificationsCount(unread);
        }
      } catch {
        // ignore
      }
    };

    fetchUnreadCount();
    const intervalId = setInterval(fetchUnreadCount, 30000);

    const handleNotificationsUpdate = () => {
      fetchUnreadCount();
    };

    window.addEventListener("vendor_notifications_updated", handleNotificationsUpdate);
    window.addEventListener("storage", handleNotificationsUpdate);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
      window.removeEventListener("vendor_notifications_updated", handleNotificationsUpdate);
      window.removeEventListener("storage", handleNotificationsUpdate);
    };
  }, []);

  const isProducts = location.pathname.includes("/products");
  const isOrders = location.pathname.includes("/orders");
  const isCategories = location.pathname.includes("/categories");
  const isPayments = location.pathname.includes("/payments");
  const isPlans = location.pathname.includes("/plans");
  const isSettings = location.pathname.includes("/settings");
  const isNotifications = location.pathname.includes("/notifications");
  const isShipping = location.pathname.includes("/shipping");

  const pageTitle = isProducts
    ? "Products Management"
    : isOrders
    ? "Orders Management"
    : isCategories
    ? "Category Catalog"
    : isPayments
    ? "Earnings & Payouts"
    : isPlans
    ? "Membership Plans"
    : isSettings
    ? "Settings & Preferences"
    : isNotifications
    ? "Notifications"
    : isShipping
    ? "Shipping & Logistics"
    : "Dashboard Overview";

  return (
    <header className="sticky top-0 z-30 w-full h-16 sm:h-[72px] bg-white/85 backdrop-blur-2xl border-b border-slate-200/80 shadow-[0_4px_24px_rgba(4,150,105,0.05)] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 font-['Poppins',sans-serif] shrink-0">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle vendor sidebar"
          className="lg:hidden w-10 h-10 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#049669] flex items-center justify-center transition-colors cursor-pointer shadow-2xs shrink-0"
        >
          <Menu className="w-5 h-5 stroke-[2.3]" />
        </button>

        <Link
          to="/vendor"
          className="flex items-center gap-3 group cursor-pointer shrink-0"
          title="brand logo"
        >
          <div className="flex items-center justify-center relative overflow-hidden h-10 max-w-[200px]">
            {sidebarLogo ? (
              <img
                src={getUploadUrl(sidebarLogo)}
                alt="Store Logo"
                className="h-14 sm:h-16 w-auto max-w-[190px] object-contain rounded-md transition-transform group-hover:scale-105"
              />
            ) : (
              <div>
                <img src={logo} className="w-44 sm:w-48 h-auto object-contain" alt="brand-logo" />
              </div>
            )}
          </div>
        </Link>

        <div className="hidden lg:block h-6 w-px bg-slate-200/90 mx-2" />

        <div className="hidden md:block truncate">
          <h2 className="text-sm sm:text-base font-semibold text-[#1E1B4B] tracking-tight leading-tight truncate">
            {pageTitle}
          </h2>
        </div>
      </div>

      {/* Right: Actions, Notifications & Profile */}
      <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
     

        <Link
          to="/vendor/notifications"
          className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 text-slate-600 hover:text-[#049669] hover:bg-emerald-50 flex items-center justify-center relative transition-colors cursor-pointer shadow-2xs hover:shadow-sm"
          aria-label="Vendor Notifications"
          title={unreadNotificationsCount > 0 ? `${unreadNotificationsCount} unread notification${unreadNotificationsCount > 1 ? "s" : ""}` : "Vendor Notifications"}
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 px-1.5 min-w-[18px] h-[18px] rounded-full bg-[#049669] text-white font-black text-[10px] flex items-center justify-center ring-2 ring-white shadow-xs">
              {unreadNotificationsCount > 9 ? "9+" : unreadNotificationsCount}
            </span>
          )}
        </Link>

        {/* User Profile Avatar & Identity from DB */}
        <Link
          to="/vendor/settings"
          className="flex items-center gap-2.5 sm:gap-3 pl-2.5 sm:pl-3 border-l border-slate-200/80 group cursor-pointer"
          title="Manage Profile Settings"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden text-white font-black text-sm sm:text-base flex items-center justify-center  shrink-0 group-hover:scale-105 transition-transform">
            {profileUser?.avatar ? (
              <img
                src={getUploadUrl(profileUser.avatar)}
                alt={profileUser.name || "Vendor Avatar"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>
                {profileUser?.name ? profileUser.name.charAt(0).toUpperCase() : "V"}
              </span>
            )}
          </div>
          <div className="hidden lg:block text-left leading-tight">
            <h5 className="text-xs sm:text-sm font-bold text-[#1E1B4B] group-hover:text-[#049669] transition-colors">
              {profileUser?.name || "Vendor Admin"}
            </h5>
            <span className="text-[11px] text-slate-400 font-medium truncate block max-w-[150px]">
              {profileUser?.email || "vendor@shopmart.com"}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
