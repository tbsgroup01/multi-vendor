import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authService, productService, getUploadUrl } from "../../../services";
import { useCart } from "../../../context/CartContext";
import {
  Search,
  ShoppingCart,
  X,
  CircleUserRound,
  Package,
  MapPin,
  LogOut,
  ChevronRight,
  Loader2,
  Sparkles,
} from "lucide-react";
import logo from "../../../assets/logo.png";

// Helper: resolve product image
const resolveProductImage = (item) => {
  if (!item) return "https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&h=100&fit=crop&q=80";
  let img = "";
  if (Array.isArray(item.images) && item.images.length > 0) img = item.images[0];
  else if (item.image) img = Array.isArray(item.image) ? item.image[0] : item.image;
  else if (typeof item.images === "string") {
    try {
      const p = JSON.parse(item.images);
      if (Array.isArray(p)) img = p[0];
      else img = item.images;
    } catch (e) {
      img = item.images.split(",")[0]?.trim();
    }
  }
  return getUploadUrl(img) || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&h=100&fit=crop&q=80";
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const desktopSearchContainerRef = useRef(null);
  const mobileSearchContainerRef = useRef(null);
  const searchDebounceRef = useRef(null);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const timeoutRef = useRef(null);

  // Sync searchQuery from URL when on /shop
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("search") || params.get("q") || "";
    if (location.pathname === "/shop") {
      setSearchQuery(q);
    }
  }, [location.search, location.pathname]);

  // Live product search as user types (Flipkart style)
  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    const trimmed = searchQuery.trim();
    if (trimmed.length < 1) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    searchDebounceRef.current = setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await productService.getAllProducts({
          search: trimmed,
          limit: 6,
          status: "active",
        });
        if (res && res.products && Array.isArray(res.products)) {
          setSearchResults(res.products);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.warn("Live search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [searchQuery]);

  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [hasToken, setHasToken] = useState(() => Boolean(localStorage.getItem("token")));

  useEffect(() => {
    const syncAuth = () => {
      const token = localStorage.getItem("token");
      setHasToken(Boolean(token));
      try {
        const saved = localStorage.getItem("user");
        setCurrentUser(saved ? JSON.parse(saved) : null);
      } catch {
        setCurrentUser(null);
      }
    };

    syncAuth();
    window.addEventListener("storage", syncAuth);
    window.addEventListener("auth_state_changed", syncAuth);
    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("auth_state_changed", syncAuth);
    };
  }, [location.pathname]);

  const isLoggedIn = Boolean(hasToken);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      const inDesktop =
        desktopSearchContainerRef.current &&
        desktopSearchContainerRef.current.contains(event.target);
      const inMobile =
        mobileSearchContainerRef.current &&
        mobileSearchContainerRef.current.contains(event.target);
      if (!inDesktop && !inMobile) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const trimmed = searchQuery.trim();
    setIsSearchOpen(false);
    if (trimmed) {
      navigate(`/shop?search=${encodeURIComponent(trimmed)}`);
    } else {
      navigate("/shop");
    }
  };

  const handleSelectProduct = (productId) => {
    setIsSearchOpen(false);
    navigate(`/product/${productId}`);
  };

  const handleMouseEnter = () => {
    if (!isLoggedIn) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsUserMenuOpen(true);
  };

  const handleMouseLeave = () => {
    if (!isLoggedIn) return;
    timeoutRef.current = setTimeout(() => {
      setIsUserMenuOpen(false);
    }, 200);
  };

  const handleAvatarClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setIsUserMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    authService.logout();
    setHasToken(false);
    setCurrentUser(null);
    setIsUserMenuOpen(false);
    navigate("/login", { replace: true });
  };

  // Reusable Search Box for Desktop (header middle) and Mobile (row 2)
  const renderSearchBox = (isMobile = false) => (
    <div
      ref={isMobile ? mobileSearchContainerRef : desktopSearchContainerRef}
      className={
        isMobile
          ? "block md:hidden pb-2.5 pt-1 relative w-full"
          : "hidden md:block flex-1 max-w-2xl mx-4 relative"
      }
    >
      <form onSubmit={handleSearchSubmit} className="w-full">
        <div className="relative flex items-center bg-[#F8FAFC] border border-slate-200/90 rounded-2xl p-1 sm:p-1.5 focus-within:border-[#059669] focus-within:ring-2 focus-within:ring-[#059669]/15 focus-within:bg-white transition-all shadow-2xs">
          <div className="pl-3 pr-2 text-slate-400 shrink-0">
            <Search className="w-4 h-4 stroke-[2]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setIsSearchOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") setIsSearchOpen(false);
            }}
            placeholder={
              isMobile
                ? "Search products, brands and more..."
                : "Search for products, brands and more..."
            }
            className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 font-medium outline-none px-1"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSearchResults([]);
              }}
              className="p-1 text-slate-400 hover:text-slate-600 mr-1 cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="shrink-0 h-8 sm:h-9 w-9 sm:w-11 bg-gradient-to-r from-[#059669] to-[#10B981] hover:from-[#047857] hover:to-[#059669] text-white rounded-xl flex items-center justify-center shadow-xs shadow-emerald-500/20 transition-all cursor-pointer"
            title="Search"
          >
            <Search className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>
      </form>

      {/* Flipkart-Style Search Dropdown */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[70vh] overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span>Searching products...</span>
            </div>
          ) : searchResults.length > 0 ? (
            <div>
              <div className="px-4 py-2 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <span>Products matching "{searchQuery}"</span>
                <span>{searchResults.length} found</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-[340px] overflow-y-auto">
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectProduct(item.id)}
                    className="px-4 py-2.5 flex items-center justify-between gap-3 hover:bg-emerald-50/60 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/70 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                        <img
                          src={resolveProductImage(item)}
                          alt={item.name}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate group-hover:text-emerald-700 transition-colors">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {item.category?.name || item.brand || "In Stock"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-slate-900 block">
                        ₹{item.discountPrice ? Number(item.discountPrice) : Number(item.price)}
                      </span>
                      {item.discountPrice && Number(item.price) > Number(item.discountPrice) && (
                        <span className="text-[10px] text-slate-400 line-through block">
                          ₹{Number(item.price)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer: View all results in shop */}
              <div className="p-2 bg-slate-50 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="w-full py-2 px-3 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800 border border-slate-200/80 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>See all results for "{searchQuery}" in Shop</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : searchQuery.trim() ? (
            <div className="p-6 text-center">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">
                No products found for "{searchQuery}"
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Try searching for milk, bread, butter, eggs, noodles, atta...
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(false);
                  navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                }}
                className="mt-3 text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                Search in All Categories &rarr;
              </button>
            </div>
          ) : (
            /* Popular Searches */
            <div className="p-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Popular Searches</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["Milk", "Bread", "Eggs", "Butter", "Maggi", "Aashirvaad Atta", "boAt", "Coca-Cola"].map((keyword) => (
                  <button
                    key={keyword}
                    type="button"
                    onClick={() => {
                      setSearchQuery(keyword);
                      navigate(`/shop?search=${encodeURIComponent(keyword)}`);
                      setIsSearchOpen(false);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-medium text-slate-700 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Search className="w-3 h-3 text-slate-400" />
                    <span>{keyword}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      <div className="max-w-[1800px] mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Main Row: Logo on left, Desktop Search in middle, Actions on right */}
        <div className="h-14 sm:h-16 md:h-[72px] flex items-center justify-between gap-3 sm:gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center transition-transform group-hover:scale-105">
                <img
                  src={logo}
                  alt="brand logo"
                  className="h-14 sm:h-9 md:h-10 w-auto max-w-[125px] sm:max-w-[160px] md:max-w-[190px] object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Search Bar (Hidden on Mobile < md) */}
          {renderSearchBox(false)}

          {/* Right Action Icons (Cart & User Avatar) */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">     
            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative flex items-center justify-center p-2 text-slate-700 hover:text-[#059669] transition-colors rounded-xl hover:bg-slate-50 cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2]" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#EF4444] text-white text-[10px] font-extrabold h-4 w-4 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Avatar: If not logged in -> Direct Redirect to /login. If logged in -> Account Dropdown */}
            <div
              ref={menuRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={handleAvatarClick}
                aria-label={isLoggedIn ? "User Account Menu" : "Sign In / Register"}
                aria-expanded={isLoggedIn ? isUserMenuOpen : false}
                title={isLoggedIn ? (currentUser?.name || "My Account") : "Sign In / Register"}
                className="p-1.5 text-slate-700 hover:text-[#059669] transition-colors flex items-center justify-center cursor-pointer rounded-full hover:bg-slate-50 focus:outline-none"
              >
                {isLoggedIn && currentUser?.name ? (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-xs flex items-center justify-center shadow-xs border border-white">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <CircleUserRound className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.8]" />
                )}
              </button>

              {/* Dropdown Menu (Only displayed when user is logged in) */}
              {isLoggedIn && isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-slate-200/90 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-black text-sm flex items-center justify-center shrink-0">
                      {(currentUser?.name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-slate-900 truncate">
                        {currentUser?.name || "Customer Account"}
                      </h3>
                      <p className="text-[11px] text-slate-500 truncate">
                        {currentUser?.phone || currentUser?.email || "Signed In"}
                      </p>
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
                      {cartCount > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                  </div>

                  {/* Log Out */}
                  <div className="p-1.5 pt-1 border-t border-slate-100">
                    <button
                      onClick={handleLogout}
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

        {/* Mobile Search Bar Row (Visible ONLY on Mobile < md) */}
        {renderSearchBox(true)}

      </div>
    </header>
  );
}
