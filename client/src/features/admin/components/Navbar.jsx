import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  Bell,
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
} from "lucide-react";
import logo from "../../../assets/logo.png";

export default function Navbar({ onToggleSidebar }) {
  const location = useLocation();

  const isVendors = location.pathname.includes("/vendors");
  const isCustomers = location.pathname.includes("/customers");
  const isPayments = location.pathname.includes("/payments");
  const isSettings = location.pathname.includes("/settings") || location.pathname.includes("/setting");

  const pageTitle = isVendors
    ? "Vendors Management"
    : isCustomers
    ? "Customers Directory"
    : isPayments
    ? "Financial Settlements"
    : isSettings
    ? "Platform Settings"
    : "Super Admin Dashboard";

  return (
    <header className="sticky top-0 z-30 w-full h-16 sm:h-[72px] bg-white/85 backdrop-blur-2xl border-b border-slate-200/80 shadow-[0_4px_24px_rgba(4,150,105,0.05)] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 font-['Poppins',sans-serif] shrink-0">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle admin sidebar"
          className="lg:hidden w-10 h-10 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#049669] flex items-center justify-center transition-colors cursor-pointer shadow-2xs shrink-0"
        >
          <Menu className="w-5 h-5 stroke-[2.3]" />
        </button>

        <Link
          to="/admin"
          className="flex items-center gap-3 group cursor-pointer shrink-0"
          title="ShopMart Admin Panel"
        >
          <div className="flex items-center justify-center relative overflow-hidden">
            <img src={logo} className="w-40 sm:w-48 object-cover" alt="ShopMart Logo" />
          </div>
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-[#049669] border border-emerald-200/70">
            Admin
          </span>
        </Link>

        <div className="hidden lg:block h-6 w-px bg-slate-200/90 mx-2" />

        <div className="hidden md:block truncate">
          <h2 className="text-sm sm:text-base font-semibold text-[#1E1B4B] tracking-tight leading-tight truncate">
            {pageTitle}
          </h2>
        </div>
      </div>

      {/* Right: Actions & Super Admin Profile */}
      <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
        <Link
          to="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-2 text-xs sm:text-[13px] font-bold text-[#049669] hover:text-[#03704f] bg-emerald-50/90 hover:bg-emerald-100 border border-emerald-200/80 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl transition-all shadow-2xs hover:shadow-sm"
        >
          <span>View Customer Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <Link
          to="/vendor"
          className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#049669] bg-white border border-slate-200/80 hover:bg-emerald-50 px-3 py-2 rounded-xl transition-all shadow-2xs"
        >
          <Layers className="w-3.5 h-3.5 text-[#049669]" />
          <span>Vendor Portal</span>
        </Link>

        <button
          className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 text-slate-600 hover:text-[#049669] hover:bg-emerald-50 flex items-center justify-center relative transition-colors cursor-pointer shadow-2xs hover:shadow-sm"
          aria-label="Admin Notifications"
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#049669] ring-2 ring-white" />
        </button>

        <div className="flex items-center gap-2.5 sm:gap-3 pl-2.5 sm:pl-3 border-l border-slate-200/80">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#049669] via-[#059669] to-[#10B981] text-white font-black text-sm sm:text-base flex items-center justify-center shadow-md shadow-emerald-600/25 shrink-0 border border-white/30">
            A
          </div>
          <div className="hidden xl:block text-left leading-tight">
            <h5 className="text-xs sm:text-sm font-bold text-[#1E1B4B] flex items-center gap-1">
              <span>Super Admin</span>
              <Shield className="w-3 h-3 text-[#049669] fill-emerald-100" />
            </h5>
            <span className="text-[11px] text-slate-400 font-medium">admin@shopmart.com</span>
          </div>
        </div>
      </div>
    </header>
  );
}

