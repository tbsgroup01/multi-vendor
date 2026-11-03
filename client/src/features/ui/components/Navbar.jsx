import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../../services";
import {
  Search,
  ShoppingCart,
  X,
  CircleUserRound,
  Package,
  MapPin,
  LogOut,
  ChevronRight,
  User,
} from "lucide-react";
import logo from "../../../assets/logo.png";
export default function Navbar() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const timeoutRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsUserMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsUserMenuOpen(false);
    }, 200);
  };

  return (
    <header className="sticky top-0 z-50 h-[72px] bg-white border-b border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      <div className="h-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-5 sm:gap-7 shrink-0">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="   flex items-center justify-center text-white transition-transform group-hover:scale-105">
          <img src={logo} alt="brand logo" className="w-50" />
            </div>
         
          </Link>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-2xl mx-2 sm:mx-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="w-full"
          >
            <div className="relative flex items-center bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-1.5 focus-within:border-[#059669] focus-within:ring-2 focus-within:ring-[#059669]/15 transition-all">
              <div className="pl-3 pr-2 text-slate-400">
                <Search className="w-4 h-4 stroke-[2]" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands and more..."
                className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 font-medium outline-none px-1"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-1 text-slate-400 hover:text-slate-600 mr-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="shrink-0 h-9 w-10 sm:w-11 bg-gradient-to-r from-[#059669] to-[#10B981] hover:from-[#047857] hover:to-[#059669] text-white rounded-xl flex items-center justify-center shadow-sm shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
              </button>
            </div>
          </form>
        </div>

        {/* Right Action Icons (Cart & Interactive User Avatar Dropdown) */}
        <div className="flex items-center gap-3 sm:gap-5 shrink-0">     
          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative flex items-center p-1.5 text-slate-700 hover:text-[#059669] transition-colors"
          >
            <ShoppingCart className="w-5 h-5 stroke-[2]" />
            <span className="absolute -top-1 -right-1 bg-[#EF4444] text-white text-[10px] font-extrabold h-4 w-4 rounded-full flex items-center justify-center shadow-sm">
              2
            </span>
          </Link>

          {/* Interactive User Avatar Dropdown (Hover or Click) */}
          <div
            ref={menuRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              aria-label="User Account Menu"
              aria-expanded={isUserMenuOpen}
              className="p-1 text-slate-700 hover:text-[#059669] transition-colors flex items-center justify-center cursor-pointer rounded-full focus:outline-none"
            >
              <CircleUserRound className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.8]" />
            </button>

            {/* Dropdown Menu (Blinkit Style) */}
            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-slate-200/90 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-black text-sm flex items-center justify-center shrink-0">
                    S
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-slate-900 truncate">Shashank</h3>
                    <p className="text-[11px] text-slate-500 truncate">+91 9800000000</p>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-1.5 space-y-0.5">
                  <Link
                    to="/orders?tab=orders"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <Package className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                      <span>My Orders</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  <Link
                    to="/orders?tab=addresses"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                      <span>My Addresses</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  <Link
                    to="/cart"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                      <span>My Cart</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                      2
                    </span>
                  </Link>
                </div>

                {/* Log Out */}
                <div className="p-1.5 pt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      authService.logout();
                      setIsUserMenuOpen(false);
                      navigate("/login", { replace: true });
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
