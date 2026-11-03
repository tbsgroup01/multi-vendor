import React, { useState, useEffect } from "react";
import { authService } from "../../../services";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Store,
  Shapes,
  ShoppingCart,
  Truck,
  CircleDollarSign,
  Settings as SettingsIcon,
  Bell,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("vendor_sidebar_collapsed") === "true";
  });
  const [sidebarLogo, setSidebarLogo] = useState(() => {
    return localStorage.getItem("vendor_sidebar_logo") || null;
  });

  useEffect(() => {
    const handleLogoUpdate = () => {
      setSidebarLogo(localStorage.getItem("vendor_sidebar_logo") || null);
    };
    window.addEventListener("vendor_logo_updated", handleLogoUpdate);
    window.addEventListener("storage", handleLogoUpdate);
    return () => {
      window.removeEventListener("vendor_logo_updated", handleLogoUpdate);
      window.removeEventListener("storage", handleLogoUpdate);
    };
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("vendor_sidebar_collapsed", String(next));
      return next;
    });
  };

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      path: "/vendor",
    },
    {
      id: "products",
      label: "Products",
      icon: Store,
      path: "/vendor/products",
    },
    {
      id: "categories",
      label: "Categories",
      icon: Shapes,
      path: "/vendor/categories",
    },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingCart,
      path: "/vendor/orders",
    },
    {
      id: "earnings",
      label: "Payments",
      icon: CircleDollarSign,
      path: "/vendor/payments",
    },
    {
      id: "settings",
      label: "Setting",
      icon: SettingsIcon,
      path: "/vendor/settings",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      path: "/vendor/notifications",
    },
  ];

  const handleLogout = () => {
    authService.logout();
    navigate("/login", { replace: true });
  };

  const renderSidebarContent = (collapsed = false, isMobile = false) => (
    <div
      className={`h-full flex flex-col justify-between select-none font-['Poppins',sans-serif] relative overflow-hidden z-10 ${
        collapsed ? "p-3" : "p-4"
      }`}
    >
      <div className="space-y-4 relative z-10 flex-1 flex flex-col min-h-0">
        {/* Mobile Header only */}
        {isMobile && (
          <div className="flex items-center justify-between pb-3 shrink-0 min-h-[52px] border-b border-slate-100">
            <Link
              to="/vendor"
              onClick={onClose}
              className="flex items-center gap-3 group cursor-pointer"
              title="ShopMart Vendor Panel"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#049669] via-[#059669] to-[#10B981] backdrop-blur-md flex items-center justify-center text-white shadow-md shadow-emerald-600/25 border border-white/30 transition-transform group-hover:scale-105 shrink-0 overflow-hidden">
                {sidebarLogo ? (
                  <img
                    src={sidebarLogo}
                    alt="Sidebar Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Store className="w-5 h-5 stroke-[2.2]" />
                )}
              </div>
              <div>
                <h2 className="text-base font-black text-[#1E1B4B] tracking-tight leading-none">
                  Shop<span className="text-[#049669]">Mart</span>
                </h2>
                <span className="text-[10px] text-[#049669] font-extrabold uppercase tracking-wider block mt-0.5">
                  Vendor Panel
                </span>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-emerald-100/70 hover:bg-emerald-200/80 text-emerald-700 flex items-center justify-center transition-colors cursor-pointer border border-emerald-200/50 backdrop-blur-md"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="space-y-1.5 overflow-y-auto flex-1 pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path === "/vendor" &&
                (location.pathname === "/vendor" ||
                  location.pathname === "/vendor/dashboard"));

            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={onClose}
                title={collapsed ? item.label : undefined}
                className={`relative flex items-center rounded-xl font-semibold transition-all cursor-pointer overflow-hidden ${
                  collapsed
                    ? "w-11 h-11 mx-auto justify-center p-0"
                    : "gap-3.5 px-3.5 py-2.5 text-xs sm:text-[15px]"
                } ${
                  isActive
                    ? "bg-gradient-to-r from-[#049669] via-[#059669] to-[#10B981] backdrop-blur-xl text-white shadow-[0_6px_20px_rgba(4,150,105,0.30)] border border-white/25 scale-[1.01]"
                    : "text-[#1E1B4B] hover:text-[#049669] hover:bg-white/70 hover:backdrop-blur-md hover:border-white/80 border border-transparent hover:shadow-xs hover:translate-x-0.5"
                }`}
              >
                {isActive && (
                  <>
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent" />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                  </>
                )}
                <Icon
                  className={`w-7 h-7 shrink-0 stroke-[2.2] transition-colors relative z-10 ${
                    isActive
                      ? "text-white"
                      : "text-[#475569] group-hover:text-[#049669]"
                  }`}
                />
                {!collapsed && (
                  <span className="truncate relative z-10">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="pt-3 mt-auto border-t border-slate-100 relative z-10">
        <button
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          className={`rounded-lg bg-emerald-50/90 hover:bg-emerald-100 text-[#049669] hover:text-[#03704f] border border-emerald-200/70 backdrop-blur-md font-bold text-xs transition-all duration-200 flex items-center justify-center cursor-pointer shadow-2xs active:scale-98 ${
            collapsed
              ? "w-11 h-11 p-0 mx-auto"
              : "w-full py-2.5 px-4 gap-2"
          }`}
        >
          <LogOut className="w-4 h-4 stroke-[2.3]" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={`hidden lg:flex flex-col h-full bg-white/70 backdrop-blur-2xl border-r border-slate-200/80 shadow-[0_8px_32px_rgba(4,150,105,0.06)] z-20 shrink-0 transition-[width] duration-300 ease-in-out relative ${
          isCollapsed ? "w-20" : "w-64 xl:w-72"
        }`}
      >
        {/* Floating Chevron Toggle Button on right border */}
        <button
          type="button"
          onClick={toggleCollapse}
          className="hidden lg:flex absolute -right-3.5 top-4 z-40 w-7 h-7 rounded-full bg-white border border-slate-200/90 shadow-md text-slate-600 hover:text-[#049669] hover:bg-emerald-50 hover:border-emerald-300 items-center justify-center cursor-pointer transition-all duration-200 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-emerald-400"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 stroke-[2.5] text-slate-600 group-hover:text-[#049669] group-hover:translate-x-0.5 transition-transform" />
          ) : (
            <ChevronLeft className="w-4 h-4 stroke-[2.5] text-slate-600 group-hover:text-[#049669] group-hover:-translate-x-0.5 transition-transform" />
          )}
        </button>

        {renderSidebarContent(isCollapsed, false)}
      </aside>

      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/35 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            aria-hidden="true"
          />
          <aside className="relative w-[280px] sm:w-[300px] h-full bg-white/95 backdrop-blur-2xl border-r border-white/80 shadow-2xl z-10 flex flex-col animate-in slide-in-from-left duration-300 overflow-hidden rounded-r-2xl">
            {renderSidebarContent(false, true)}
          </aside>
        </div>
      )}
    </>
  );
}
