import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  ChevronDown,
  Search,
  Heart,
  ShoppingCart,
  X,
} from "lucide-react";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const categories = [
    "All Categories",
    "Electronics & Gadgets",
    "Fashion & Clothing",
    "Home & Kitchen",
    "Beauty & Personal Care",
    "Books & Stationery",
    "Sports & Fitness",
    "Toys & Baby",
  ];

  return (
    <header className="sticky top-0 z-50 h-[72px] bg-white border-b border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      <div className="h-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-5 sm:gap-7 shrink-0">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#9333EA] flex items-center justify-center text-white shadow-md shadow-purple-500/25 transition-transform group-hover:scale-105">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
              >
                <path d="M6 7a4 4 0 0 1 8 0" />
                <path d="M4 7h12l1.5 12a2 2 0 0 1-2 2H4.5a2 2 0 0 1-2-2L4 7Z" />
                <path d="M8 13a2 2 0 0 0 4 0" strokeWidth="2.2" />
              </svg>
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              ShopMore
            </span>
          </Link>

       
        </div>

        <div className="flex-1 max-w-2xl mx-2 sm:mx-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="relative flex items-center w-full"
          >
            <div className="w-full flex items-center bg-[#F8FAFC] border border-slate-200/90 rounded-2xl p-1.5 focus-within:border-[#7C3AED] focus-within:ring-4 focus-within:ring-purple-500/10 transition-all">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands and more..."
                className="w-full bg-transparent px-3.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-1 text-slate-400 hover:text-slate-600 mr-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="shrink-0 h-9 w-10 sm:w-11 bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#6D28D9] hover:to-[#7C3AED] text-white rounded-xl flex items-center justify-center shadow-sm shadow-purple-500/20 transition-all cursor-pointer"
              >
                <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
              </button>
            </div>
          </form>
        </div>
        <div className="flex items-center gap-3 sm:gap-6 shrink-0">
          <Link
            to="/wishlist"
            className="hidden sm:flex items-center gap-2 text-slate-700 hover:text-[#7C3AED] transition-colors"
          >
            <Heart className="w-5 h-5 stroke-[2]" />
            <span className="text-xs sm:text-sm font-bold">Wishlist</span>
          </Link>
          <Link
            to="/cart"
            className="relative flex items-center p-1.5 text-slate-700 hover:text-[#7C3AED] transition-colors"
          >
            <ShoppingCart className="w-5 h-5 stroke-[2]" />
            <span className="absolute -top-1 -right-1 bg-[#EF4444] text-white text-[10px] font-extrabold h-4 w-4 rounded-full flex items-center justify-center shadow-sm">
              2
            </span>
          </Link>
          <Link
            to="/profile"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#E0E7FF] text-[#4F46E5] hover:ring-2 hover:ring-purple-400 flex items-center justify-center font-extrabold text-sm transition-all"
          >
            S
          </Link>
        </div>

      </div>
    </header>
  );
}
