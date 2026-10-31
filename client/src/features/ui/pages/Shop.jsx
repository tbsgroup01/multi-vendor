import React, { useState, useMemo, useRef, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Home,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  Star,
  ShoppingCart,
  Plus,
  Minus,
  LayoutGrid,
  X,
} from "lucide-react";
import Footer from "../components/Footer";

// Real category packshots
import dairyBreadEggsImg from "../../../assets/category/dairy-bread-eggs.png";
import fruitsVegetablesImg from "../../../assets/category/fruits-vegetables.png";
import coldDrinksJuicesImg from "../../../assets/category/cold-drinks-juices.png";
import snacksMunchiesImg from "../../../assets/category/snacks-munchies.png";
import breakfastInstantFoodImg from "../../../assets/category/breakfast-instant-food.png";
import sweetToothImg from "../../../assets/category/sweet-tooth.png";
import bakeryBiscuitsImg from "../../../assets/category/bakery-biscuits.png";
import teaCoffeeDrinksImg from "../../../assets/category/tea-coffee-drinks.png";
import attaRiceDalImg from "../../../assets/category/atta-rice-dal.png";
import masalaOilMoreImg from "../../../assets/category/masala-oil-more.png";
import cleaningEssentialsImg from "../../../assets/category/cleaning-essentials.png";
import personalCareImg from "../../../assets/category/personal-care.png";

// Category definitions matching real packshot images
const CATEGORIES = [
  { id: "all", name: "All Products" },
  { id: "dairy-bread-eggs", name: "Dairy, Bread & Eggs", img: dairyBreadEggsImg },
  { id: "fruits-vegetables", name: "Fruits & Vegetables", img: fruitsVegetablesImg },
  { id: "cold-drinks-juices", name: "Cold Drinks & Juices", img: coldDrinksJuicesImg },
  { id: "snacks-munchies", name: "Snacks & Munchies", img: snacksMunchiesImg },
  { id: "breakfast-instant-food", name: "Breakfast & Instant Food", img: breakfastInstantFoodImg },
  { id: "sweet-tooth", name: "Sweet Tooth", img: sweetToothImg },
  { id: "bakery-biscuits", name: "Bakery & Biscuits", img: bakeryBiscuitsImg },
  { id: "tea-coffee-drinks", name: "Tea, Coffee & Drinks", img: teaCoffeeDrinksImg },
  { id: "atta-rice-dal", name: "Atta, Rice & Dal", img: attaRiceDalImg },
  { id: "masala-oil-more", name: "Masala & Oil", img: masalaOilMoreImg },
  { id: "cleaning-essentials", name: "Cleaning Essentials", img: cleaningEssentialsImg },
  { id: "personal-care", name: "Personal Care", img: personalCareImg },
  { id: "electronics", name: "Electronics", img: "https://pngimg.com/uploads/headphones/headphones_PNG7644.png" },
  { id: "fashion", name: "Fashion", img: "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5823.png" },
];

// Catalog matching exact products from screenshot followed by full variety
const ALL_PRODUCTS = [
  // 1. Maggi 2-Minute Masala Instant Noodles (Top 1)
  {
    id: "p1",
    name: "Maggi 2-Minute Masala Instant Noodles",
    categorySlug: "breakfast-instant-food",
    categoryName: "Breakfast & Instant Food",
    brand: "MAGGI",
    unit: "Pack of 4 (280 g)",
    price: 56,
    mrp: 70,
    rating: 4.5,
    inStock: true,
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&h=500&fit=crop&q=80",
  },
  // 2. boAt Airdopes 141 ANC Wireless Earbuds (Top 2)
  {
    id: "p2",
    name: "boAt Airdopes 141 ANC Wireless Earbuds",
    categorySlug: "electronics",
    categoryName: "Electronics",
    brand: "BOAT",
    unit: "1 Unit (Black)",
    price: 1299,
    mrp: 1599,
    rating: 4.3,
    inStock: true,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop&q=80",
  },
  // 3. Parle-G Original Glucose Biscuits (Top 3)
  {
    id: "p3",
    name: "Parle-G Original Glucose Biscuits",
    categorySlug: "bakery-biscuits",
    categoryName: "Bakery & Biscuits",
    unit: "250 g",
    price: 22,
    mrp: null,
    rating: 4.6,
    inStock: true,
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&h=500&fit=crop&q=80",
  },
  // 4. Aashirvaad Shudh Chakki Whole Wheat Atta (Top 4)
  {
    id: "p4",
    name: "Aashirvaad Shudh Chakki Whole Wheat Atta",
    categorySlug: "atta-rice-dal",
    categoryName: "Atta, Rice & Dal",
    unit: "5 kg",
    price: 265,
    mrp: 300,
    rating: 4.4,
    inStock: true,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=500&fit=crop&q=80",
  },
  // 5. Noise ColorFit Pulse 2 Max Smartwatch (Top 5)
  {
    id: "p5",
    name: "Noise ColorFit Pulse 2 Max Smartwatch",
    categorySlug: "electronics",
    categoryName: "Electronics",

    unit: "1.85\" Display",
    price: 1499,
    mrp: 2999,
    rating: 4.7,
    inStock: true,
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&h=500&fit=crop&q=80",
  },
  // 6. Haldiram's Classic Bhujia Sev (Top 6)
  {
    id: "p6",
    name: "Haldiram's Classic Bhujia Sev",
    categorySlug: "snacks-munchies",
    categoryName: "Snacks & Munchies",
    unit: "200 g",
    price: 55,
    mrp: null,
    rating: 4.5,
    inStock: true,
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&h=500&fit=crop&q=80",
  },

  // Additional rich products across categories
  {
    id: "d1",
    name: "Amul Taaza Fresh Toned Milk",
    categorySlug: "dairy-bread-eggs",
    categoryName: "Dairy, Bread & Eggs",
    unit: "1 L",
    price: 54,
    mrp: 56,
    rating: 4.8,
    inStock: true,
    image: "https://pngimg.com/uploads/milk/milk_PNG12734.png",
  },
  {
    id: "d2",
    name: "Harvest Gold White Sandwich Bread",
    categorySlug: "dairy-bread-eggs",
    categoryName: "Dairy, Bread & Eggs",
    unit: "400 g",
    price: 40,
    mrp: 45,
    rating: 4.7,
    inStock: true,
    image: "https://pngimg.com/uploads/bread/bread_PNG2301.png",
  },
  {
    id: "d3",
    name: "Farm Fresh Brown Table Eggs",
    categorySlug: "dairy-bread-eggs",
    categoryName: "Dairy, Bread & Eggs",
    brand: "Farm Fresh",
    unit: "Pack of 6",
    price: 68,
    mrp: 75,
    rating: 4.9,
    inStock: true,
    image: "https://pngimg.com/uploads/egg/egg_PNG40.png",
  },
  {
    id: "d4",
    name: "Amul Pasteurised Salted Table Butter",
    categorySlug: "dairy-bread-eggs",
    categoryName: "Dairy, Bread & Eggs",
    unit: "100 g",
    price: 58,
    mrp: 60,
    rating: 4.9,
    inStock: true,
    image: "https://pngimg.com/uploads/butter/butter_PNG26.png",
  },
  {
    id: "d5",
    name: "Mother Dairy Classic Creamy Curd",
    categorySlug: "dairy-bread-eggs",
    categoryName: "Dairy, Bread & Eggs",
    unit: "400 g",
    price: 35,
    mrp: 38,
    rating: 4.6,
    inStock: true,
    image: "https://pngimg.com/uploads/yogurt/yogurt_PNG15214.png",
  },
  {
    id: "d6",
    name: "Britannia Cheddar Cheese Slices",
    categorySlug: "dairy-bread-eggs",
    categoryName: "Dairy, Bread & Eggs",

    unit: "200 g (10 Slices)",
    price: 135,
    mrp: 145,
    rating: 4.8,
    inStock: true,
    image: "https://images.unsplash.com/photo-1624806992066-5ffcf7ca186b?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "fv1",
    name: "Fresh Robusta Yellow Bananas",
    categorySlug: "fruits-vegetables",
    categoryName: "Fruits & Vegetables",
    unit: "1 kg (~6-8 pcs)",
    price: 52,
    mrp: 65,
    rating: 4.8,
    inStock: true,
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "fv2",
    name: "Shimla Crisp Royal Gala Apples",
    categorySlug: "fruits-vegetables",
    categoryName: "Fruits & Vegetables",
    unit: "4 pcs (~600 g)",
    price: 140,
    mrp: 160,
    rating: 4.7,
    inStock: true,
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "cd1",
    name: "Coca-Cola Original Taste Can",
    categorySlug: "cold-drinks-juices",
    categoryName: "Cold Drinks & Juices",
    unit: "300 ml",
    price: 40,
    mrp: 40,
    rating: 4.8,
    inStock: true,
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "cd2",
    name: "Tropicana 100% Orange Fruit Juice",
    categorySlug: "cold-drinks-juices",
    categoryName: "Cold Drinks & Juices",
    unit: "1 L",
    price: 125,
    mrp: 135,
    rating: 4.7,
    inStock: true,
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "cd3",
    name: "Red Bull Energy Drink Can",
    categorySlug: "cold-drinks-juices",
    categoryName: "Cold Drinks & Juices",
    unit: "250 ml",
    price: 125,
    mrp: 125,
    rating: 4.9,
    inStock: true,
    image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "sn1",
    name: "Lay's Classic Salted Potato Chips",
    categorySlug: "snacks-munchies",
    categoryName: "Snacks & Munchies",
    unit: "50 g",
    price: 20,
    mrp: 20,
    rating: 4.8,
    inStock: true,
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "sn2",
    name: "Doritos Nacho Cheese Tortilla Chips",
    categorySlug: "snacks-munchies",
    categoryName: "Snacks & Munchies",
    unit: "60 g",
    price: 30,
    mrp: 30,
    rating: 4.7,
    inStock: true,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "sw1",
    name: "Cadbury Dairy Milk Silk Chocolate Bar",
    categorySlug: "sweet-tooth",
    categoryName: "Sweet Tooth",
    unit: "150 g",
    price: 175,
    mrp: 185,
    rating: 4.9,
    inStock: true,
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "sw2",
    name: "Nestlé KitKat 4-Finger Wafer Bar",
    categorySlug: "sweet-tooth",
    categoryName: "Sweet Tooth",
    unit: "38.5 g",
    price: 30,
    mrp: 30,
    rating: 4.8,
    inStock: true,
    image: "https://images.unsplash.com/photo-1575224300306-1b8da36134ec?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "el4",
    name: "JBL Go 3 Rugged Waterproof Speaker",
    categorySlug: "electronics",
    categoryName: "Electronics",
    unit: "1 Unit (Teal)",
    price: 2999,
    mrp: 3999,
    rating: 4.8,
    inStock: true,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "fk4",
    name: "Nike Air Force 1 '07 Men's Casual Sneakers",
    categorySlug: "fashion",
    categoryName: "Fashion",
    unit: "UK 8",
    price: 7495,
    mrp: 9695,
    rating: 4.6,
    inStock: true,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop&q=80",
  },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("Popularity");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [cartQuantities, setCartQuantities] = useState({});
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const categoryScrollRef = useRef(null);

  const checkScroll = () => {
    if (categoryScrollRef.current) {
      setCanScrollLeft(categoryScrollRef.current.scrollLeft > 10);
    }
  };

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const handleCategoryChange = (slug) => {
    setSelectedCategory(slug);
    if (slug === "all") {
      searchParams.delete("category");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: slug });
    }
  };

  const scrollLeft = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -260, behavior: "smooth" });
      setTimeout(checkScroll, 350);
    }
  };

  const scrollRight = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 260, behavior: "smooth" });
      setTimeout(checkScroll, 350);
    }
  };

  const handleIncrease = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setCartQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleDecrease = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setCartQuantities((prev) => {
      const current = prev[id] || 0;
      if (current <= 1) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: current - 1 };
    });
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((p) => {
      // Category filter
      if (selectedCategory !== "all" && p.categorySlug !== selectedCategory) {
        return false;
      }
      // In-stock filter
      if (inStockOnly && !p.inStock) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesBrand = p.brand.toLowerCase().includes(query);
        const matchesCategory = p.categoryName.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesCategory) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "Price: Low to High") return a.price - b.price;
      if (sortBy === "Price: High to Low") return b.price - a.price;
      if (sortBy === "Top Rated") return b.rating - a.rating;
      return 0; // Popularity default order
    });
  }, [selectedCategory, inStockOnly, searchQuery, sortBy]);

  return (
    <div className="w-full min-h-screen bg-[#FAF7FE] flex flex-col font-['Poppins',sans-serif] relative overflow-x-hidden text-slate-800">
      
      {/* Top-Right Soft Pink Ambient Glow (as shown in image) */}
      <div className="pointer-events-none absolute top-0 right-0 w-80 h-80 rounded-full bg-pink-300/25 blur-3xl" />
      <div className="pointer-events-none absolute top-40 left-0 w-72 h-72 rounded-full bg-purple-300/15 blur-3xl" />

      {/* Main Content Area */}
      <div className="flex-1 max-w-[1520px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-7 z-10">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-3">
          <Link to="/" className="flex items-center gap-1 text-slate-600 hover:text-purple-700 transition-colors">
            <Home className="w-3.5 h-3.5 stroke-[2]" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#1E1B4B] font-bold">Shop All Products</span>
          {selectedCategory !== "all" && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[#7C3AED] font-bold">
                {CATEGORIES.find((c) => c.id === selectedCategory)?.name || selectedCategory}
              </span>
            </>
          )}
        </div>

        {/* Heading Row: Title, Item Counter & Search Input */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-[30px] font-extrabold text-[#1A103C] tracking-tight">
                Shop All Categories
              </h1>
              <span className="px-3 py-0.5 rounded-full bg-[#EDE4FF] text-[#7C3AED] text-xs font-bold border border-purple-200/50">
                {filteredProducts.length} Items
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
              Explore farm-fresh groceries, daily pantry essentials, electronics, fashion and more.
            </p>
          </div>

          {/* Search Bar Input */}
          <div className="relative w-full md:w-80 lg:w-88">
            <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search in all products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-white border border-purple-100/80 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 focus:border-purple-400 shadow-[0_2px_12px_rgba(124,58,237,0.03)] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Rail */}
        <div className="relative flex items-center gap-2 mb-3.5">
          {/* Left Scroll Arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scrollLeft(categoryScrollRef)}
              className="w-9 h-9 rounded-full bg-white border border-purple-100 text-purple-600 shadow-xs flex items-center justify-center shrink-0 hover:bg-purple-50 transition-all cursor-pointer animate-in fade-in duration-150"
              aria-label="Scroll Categories Left"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}

          <div
            ref={categoryScrollRef}
            onScroll={checkScroll}
            className="flex items-center gap-2.5 overflow-x-auto pb-1 max-w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#9333EA] text-white shadow-md shadow-purple-500/25"
                      : "bg-white text-slate-700 hover:text-purple-700 border border-purple-100/70 hover:border-purple-300 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                  }`}
                >
                  {cat.id === "all" ? (
                    <LayoutGrid className="w-4 h-4 shrink-0" />
                  ) : (
                    <img
                      src={cat.img}
                      alt={cat.name}
                      className="w-8 h-8 object-contain shrink-0"
                    />
                  )}
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Right Scroll Arrow */}
          <button
            onClick={() => scrollRight(categoryScrollRef)}
            className="w-9 h-9 rounded-full bg-white border border-purple-100 text-purple-600 shadow-xs flex items-center justify-center shrink-0 hover:bg-purple-50 transition-colors cursor-pointer"
            aria-label="Scroll Categories"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Filter Controls Row: In Stock Only Checkbox & Popularity Dropdown */}
        <div className="flex items-center justify-end gap-4 mb-4 select-none">
          
          {/* In Stock Only Checkbox */}
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-4 h-4 rounded text-[#7C3AED] focus:ring-purple-500 border-slate-300 accent-[#7C3AED] cursor-pointer"
            />
            <span>In Stock Only</span>
          </label>

          {/* Popularity Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSortOpen((prev) => !prev)}
              className="bg-white border border-purple-100 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 flex items-center gap-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] cursor-pointer hover:border-purple-200"
            >
              <span>{sortBy}</span>
              <ChevronDown className="w-3.5 h-3.5 text-purple-600 stroke-[2.5]" />
            </button>

            {isSortOpen && (
              <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-purple-100 py-1.5 z-30">
                {["Popularity", "Price: Low to High", "Price: High to Low", "Top Rated"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSortBy(opt);
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-1.5 text-xs font-semibold cursor-pointer ${
                      sortBy === opt ? "bg-purple-50 text-purple-700 font-bold" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* 6-Column Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-purple-100 p-12 text-center my-6 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 mx-auto mb-4">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No products found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-5">
              We couldn't find any products matching your filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
                setInStockOnly(false);
                setSearchParams({});
              }}
              className="px-5 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-500/20 cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-4.5">
            {filteredProducts.map((product) => {
              const qty = cartQuantities[product.id] || 0;

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-3xl p-3 sm:p-3.5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-xl hover:border-purple-200 transition-all duration-300 flex flex-col justify-between relative"
                >
                  <Link
                    to={`/product/${product.id}`}
                    state={{ product, categoryName: product.categoryName }}
                    className="block cursor-pointer"
                  >
                    {/* Top Image Container */}
                    <div className="w-full aspect-square rounded-2xl overflow-hidden relative mb-2.5 bg-slate-50">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                        loading="lazy"
                      />

                    
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500 mb-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{product.rating}</span>
                    </div>

                    {/* Title */}
                    <h4 className="text-xs sm:text-[13px] font-bold text-[#1E1B4B] leading-snug line-clamp-2 min-h-[34px] group-hover:text-purple-600 transition-colors">
                      {product.name}
                    </h4>

                    {/* Unit / Weight */}
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                      {product.unit}
                    </p>
                  </Link>

                  {/* Price & Add to Cart Controls */}
                  <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100/80">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm sm:text-base font-bold text-[#1E1B4B]">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                      {product.mrp && product.mrp > product.price && (
                        <span className="text-[11px] text-slate-400 line-through">
                          ₹{product.mrp.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>

                    {/* Lavender Add Button or Interactive Stepper */}
                    {qty === 0 ? (
                      <button
                        onClick={(e) => handleIncrease(product.id, e)}
                        className="bg-[#F1EBFA] hover:bg-[#7C3AED] text-[#7C3AED] hover:text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer active:scale-95"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    ) : (
                      <div className="bg-[#7C3AED] text-white rounded-xl px-2 py-1 flex items-center gap-2 font-bold text-xs shadow-md shadow-purple-500/20">
                        <button
                          onClick={(e) => handleDecrease(product.id, e)}
                          aria-label="Decrease quantity"
                          className="hover:opacity-75 transition-opacity cursor-pointer"
                        >
                          <Minus className="w-3 h-3 stroke-[3]" />
                        </button>
                        <span className="min-w-[12px] text-center font-bold text-xs select-none">
                          {qty}
                        </span>
                        <button
                          onClick={(e) => handleIncrease(product.id, e)}
                          aria-label="Increase quantity"
                          className="hover:opacity-75 transition-opacity cursor-pointer"
                        >
                          <Plus className="w-3 h-3 stroke-[3]" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Footer */}
      <Footer />

    </div>
  );
}
