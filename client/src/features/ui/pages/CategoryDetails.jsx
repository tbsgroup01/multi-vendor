import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronRight,
  Star,
  Plus,
  Minus,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  RotateCcw,
  Check,
  ChevronDown,
} from "lucide-react";
import Footer from "../components/Footer";

// Structured PLP Catalog Data with Subcategories, Brands, and Attributes
const PLP_DATA = {
  "dairy-bread-eggs": {
    name: "Dairy, Bread & Eggs",
    description: "Farm-fresh dairy, artisan bakery items, eggs, and organic spreads.",
    subcategories: [
      "All",
      "Milk & Cream",
      "Bread & Bakery",
      "Eggs",
      "Butter & Cheese",
      "Curd & Yogurt",
    ],
    brands: ["Amul", "Britannia", "Harvest Gold", "Mother Dairy", "Epigamia", "Nestle"],
    products: [
      {
        id: "d1",
        name: "Amul Taaza Fresh Toned Milk",
        subcategory: "Milk & Cream",
        brand: "Amul",
        unit: "1 L",
        price: 54,
        mrp: 56,
        rating: 4.8,
        reviews: 2420,
        inStock: true,
        image:
          "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop&q=80",
      },
      {
        id: "d2",
        name: "Harvest Gold White Sandwich Bread",
        subcategory: "Bread & Bakery",
        brand: "Harvest Gold",
        unit: "400 g",
        price: 40,
        mrp: 45,
        rating: 4.7,
        reviews: 1840,
        inStock: true,
        image:
          "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop&q=80",
      },
      {
        id: "d3",
        name: "Farm Fresh Brown Table Eggs",
        subcategory: "Eggs",
        brand: "Amul",
        unit: "Pack of 6",
        price: 68,
        mrp: 75,
        rating: 4.9,
        reviews: 950,
        inStock: true,
        image:
          "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop&q=80",
      },
      {
        id: "d4",
        name: "Amul Pasteurised Salted Table Butter",
        subcategory: "Butter & Cheese",
        brand: "Amul",
        unit: "100 g",
        price: 58,
        mrp: 60,
        rating: 4.9,
        reviews: 3200,
        inStock: true,
        image:
          "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=400&fit=crop&q=80",
      },
      {
        id: "d5",
        name: "Mother Dairy Classic Creamy Curd",
        subcategory: "Curd & Yogurt",
        brand: "Mother Dairy",
        unit: "400 g",
        price: 35,
        mrp: 38,
        rating: 4.6,
        reviews: 1120,
        inStock: true,
        image:
          "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop&q=80",
      },
      {
        id: "d6",
        name: "Britannia Cheddar Cheese Slices",
        subcategory: "Butter & Cheese",
        brand: "Britannia",
        unit: "200 g (10 Slices)",
        price: 135,
        mrp: 145,
        rating: 4.8,
        reviews: 840,
        inStock: true,
        image:
          "https://images.unsplash.com/photo-1624806992066-5ffcf7ca186b?w=400&h=400&fit=crop&q=80",
      },
      {
        id: "d7",
        name: "Epigamia Greek Yogurt Natural Strawberry",
        subcategory: "Curd & Yogurt",
        brand: "Epigamia",
        unit: "100 g",
        price: 60,
        mrp: 65,
        rating: 4.7,
        reviews: 620,
        inStock: true,
        image:
          "https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=400&h=400&fit=crop&q=80",
      },
      {
        id: "d8",
        name: "Nestle Everyday Dairy Milk Whitener",
        subcategory: "Milk & Cream",
        brand: "Nestle",
        unit: "400 g",
        price: 215,
        mrp: 230,
        rating: 4.6,
        reviews: 490,
        inStock: false,
        image:
          "https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=400&h=400&fit=crop&q=80",
      },
    ],
  },
  "fruits-vegetables": {
    name: "Fruits & Vegetables",
    description: "Hand-picked farm fresh produce, organic vegetables, and seasonal fruits.",
    subcategories: ["All", "Fresh Fruits", "Daily Vegetables", "Organic Greens", "Exotics"],
    brands: ["Farm Fresh", "Organic India", "Fresh Pick"],
    products: [
      {
        id: "fv1",
        name: "Fresh Robusta Yellow Bananas",
        subcategory: "Fresh Fruits",
        brand: "Farm Fresh",
        unit: "1 kg (~6-8 pcs)",
        price: 52,
        mrp: 65,
        rating: 4.8,
        reviews: 1980,
        inStock: true,
        image:
          "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop&q=80",
      },
      {
        id: "fv2",
        name: "Shimla Crisp Royal Gala Apples",
        subcategory: "Fresh Fruits",
        brand: "Farm Fresh",
        unit: "4 pcs (~600 g)",
        price: 140,
        mrp: 160,
        rating: 4.7,
        reviews: 1420,
        inStock: true,
        image:
          "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop&q=80",
      },
      {
        id: "fv3",
        name: "Hybrid Juicy Red Tomatoes",
        subcategory: "Daily Vegetables",
        brand: "Fresh Pick",
        unit: "1 kg",
        price: 36,
        mrp: 45,
        rating: 4.6,
        reviews: 2100,
        inStock: true,
        image:
          "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=400&fit=crop&q=80",
      },
      {
        id: "fv4",
        name: "Fresh Farm Red Onion",
        subcategory: "Daily Vegetables",
        brand: "Fresh Pick",
        unit: "1 kg",
        price: 42,
        mrp: 50,
        rating: 4.8,
        reviews: 3400,
        inStock: true,
        image:
          "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=400&fit=crop&q=80",
      },
      {
        id: "fv5",
        name: "Tender Green Spinach (Palak)",
        subcategory: "Organic Greens",
        brand: "Organic India",
        unit: "250 g bunch",
        price: 22,
        mrp: 28,
        rating: 4.7,
        reviews: 820,
        inStock: true,
        image:
          "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop&q=80",
      },
      {
        id: "fv6",
        name: "Organic Sweet Green Kiwi",
        subcategory: "Exotics",
        brand: "Organic India",
        unit: "Pack of 3",
        price: 95,
        mrp: 110,
        rating: 4.9,
        reviews: 580,
        inStock: true,
        image:
          "https://images.unsplash.com/photo-1585059895524-72359e06133a?w=400&h=400&fit=crop&q=80",
      },
    ],
  },
  "cold-drinks-juices": {
    name: "Cold Drinks & Juices",
    description: "Chilled soft drinks, 100% natural juices, cold brews, and energy cans.",
    subcategories: ["All", "Soft Drinks", "Fruit Juices", "Energy Drinks", "Coconut Water"],
    brands: ["Coca-Cola", "Tropicana", "Red Bull", "Real", "Raw Pressery"],
    products: [
      {
        id: "cd1",
        name: "Coca-Cola Original Taste Can",
        subcategory: "Soft Drinks",
        brand: "Coca-Cola",
        unit: "300 ml",
        price: 40,
        mrp: 40,
        rating: 4.8,
        reviews: 2900,
        inStock: true,
        image:
          "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop&q=80",
      },
      {
        id: "cd2",
        name: "Tropicana 100% Orange Fruit Juice",
        subcategory: "Fruit Juices",
        brand: "Tropicana",
        unit: "1 L",
        price: 125,
        mrp: 135,
        rating: 4.7,
        reviews: 1450,
        inStock: true,
        image:
          "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=400&fit=crop&q=80",
      },
      {
        id: "cd3",
        name: "Red Bull Energy Drink Can",
        subcategory: "Energy Drinks",
        brand: "Red Bull",
        unit: "250 ml",
        price: 125,
        mrp: 125,
        rating: 4.9,
        reviews: 3100,
        inStock: true,
        image:
          "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&h=400&fit=crop&q=80",
      },
      {
        id: "cd4",
        name: "Raw Pressery Tender Coconut Water",
        subcategory: "Coconut Water",
        brand: "Raw Pressery",
        unit: "200 ml",
        price: 60,
        mrp: 65,
        rating: 4.8,
        reviews: 780,
        inStock: true,
        image:
          "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop&q=80",
      },
      {
        id: "cd5",
        name: "Real Fruit Power Mixed Fruit Juice",
        subcategory: "Fruit Juices",
        brand: "Real",
        unit: "1 L",
        price: 118,
        mrp: 130,
        rating: 4.6,
        reviews: 1620,
        inStock: true,
        image:
          "https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=400&fit=crop&q=80",
      },
    ],
  },
  "snacks-munchies": {
    name: "Snacks & Munchies",
    description: "Crispy snacks, gourmet chips, traditional namkeen, and popcorn.",
    subcategories: ["All", "Chips & Crisps", "Namkeen & Bhujia", "Popcorn"],
    brands: ["Lay's", "Doritos", "Haldiram's", "Act II", "Pringles"],
    products: [
      {
        id: "sn1",
        name: "Lay's Classic Salted Potato Chips",
        subcategory: "Chips & Crisps",
        brand: "Lay's",
        unit: "50 g",
        price: 20,
        mrp: 20,
        rating: 4.8,
        reviews: 3100,
        inStock: true,
        image:
          "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop&q=80",
      },
      {
        id: "sn2",
        name: "Doritos Nacho Cheese Tortilla Chips",
        subcategory: "Chips & Crisps",
        brand: "Doritos",
        unit: "60 g",
        price: 30,
        mrp: 30,
        rating: 4.7,
        reviews: 1840,
        inStock: true,
        image:
          "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop&q=80",
      },
      {
        id: "sn3",
        name: "Haldiram's Classic Bhujia Sev",
        subcategory: "Namkeen & Bhujia",
        brand: "Haldiram's",
        unit: "200 g",
        price: 55,
        mrp: 60,
        rating: 4.9,
        reviews: 4200,
        inStock: true,
        image:
          "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=400&fit=crop&q=80",
      },
      {
        id: "sn4",
        name: "Act II Instant Golden Butter Popcorn",
        subcategory: "Popcorn",
        brand: "Act II",
        unit: "70 g",
        price: 35,
        mrp: 35,
        rating: 4.8,
        reviews: 1670,
        inStock: true,
        image:
          "https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=400&h=400&fit=crop&q=80",
      },
    ],
  },
  electronics: {
    name: "Electronics & Audio",
    description: "Premium wireless audio, smartwatches, cables, and charging tech.",
    subcategories: ["All", "Audio & Earbuds", "Smart Watches", "Storage & Cables", "Power Banks"],
    brands: ["boAt", "Noise", "SanDisk", "JBL", "Portronics", "Mi"],
    products: [
      {
        id: "el1",
        name: "boAt Airdopes 141 ANC Wireless Earbuds",
        subcategory: "Audio & Earbuds",
        brand: "boAt",
        unit: "1 unit (Black)",
        price: 1299,
        mrp: 2499,
        rating: 4.8,
        reviews: 5800,
        inStock: true,
        image:
          "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop&q=80",
      },
      {
        id: "el2",
        name: "Noise ColorFit Pulse 2 Max Smartwatch",
        subcategory: "Smart Watches",
        brand: "Noise",
        unit: "1.85\" Display",
        price: 1499,
        mrp: 3999,
        rating: 4.7,
        reviews: 4300,
        inStock: true,
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&q=80",
      },
      {
        id: "el3",
        name: "SanDisk Ultra Dual 64GB USB 3.0 Pen Drive",
        subcategory: "Storage & Cables",
        brand: "SanDisk",
        unit: "64 GB",
        price: 549,
        mrp: 900,
        rating: 4.9,
        reviews: 8200,
        inStock: true,
        image:
          "https://images.unsplash.com/photo-1628135848208-a5b6f3a743ef?w=400&h=400&fit=crop&q=80",
      },
      {
        id: "el4",
        name: "JBL Go 3 Rugged Waterproof Speaker",
        subcategory: "Audio & Earbuds",
        brand: "JBL",
        unit: "1 unit (Teal)",
        price: 2999,
        mrp: 3999,
        rating: 4.8,
        reviews: 2100,
        inStock: true,
        image:
          "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=400&fit=crop&q=80",
      },
      {
        id: "el5",
        name: "Portronics Fast Charging 65W GaN Type-C",
        subcategory: "Storage & Cables",
        brand: "Portronics",
        unit: "Fast Adapter",
        price: 799,
        mrp: 1499,
        rating: 4.7,
        reviews: 1350,
        inStock: true,
        image:
          "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=400&fit=crop&q=80",
      },
    ],
  },
};

export default function CategoryDetails() {
  const { slug } = useParams();
  const currentSlug = slug || "dairy-bread-eggs";

  // State: Subcategories, Filters, Sorting, and Cart
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState("all");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("popular");
  const [cartQuantities, setCartQuantities] = useState({});
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Dynamic Fallback Generator for any unlisted category
  const categoryData = useMemo(() => {
    if (PLP_DATA[currentSlug]) {
      return PLP_DATA[currentSlug];
    }

    const title = currentSlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    return {
      name: title,
      description: `Explore all products and top brands in ${title}.`,
      subcategories: ["All", "Popular Picks", "Best Sellers", "New Arrivals"],
      brands: ["MarketPlace Brand", "Premium Choice", "Daily Essentials"],
      products: [
        {
          id: `${currentSlug}-1`,
          name: `${title} Fresh Standard Pack`,
          subcategory: "Popular Picks",
          brand: "MarketPlace Brand",
          unit: "500 g",
          price: 99,
          mrp: 120,
          rating: 4.8,
          reviews: 320,
          inStock: true,
          image:
            "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&q=80",
        },
        {
          id: `${currentSlug}-2`,
          name: `${title} Premium Choice Selection`,
          subcategory: "Best Sellers",
          brand: "Premium Choice",
          unit: "1 kg",
          price: 180,
          mrp: 210,
          rating: 4.7,
          reviews: 210,
          inStock: true,
          image:
            "https://images.unsplash.com/photo-1506617420156-8e4536971650?w=400&h=400&fit=crop&q=80",
        },
        {
          id: `${currentSlug}-3`,
          name: `${title} Value Combo Saver`,
          subcategory: "New Arrivals",
          brand: "Daily Essentials",
          unit: "Pack of 2",
          price: 240,
          mrp: 299,
          rating: 4.9,
          reviews: 480,
          inStock: true,
          image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&q=80",
        },
      ],
    };
  }, [currentSlug]);

  // Reset filters when changing category slug
  React.useEffect(() => {
    setSelectedSubcategory("All");
    setSelectedBrands([]);
    setPriceRange("all");
    setOnlyInStock(false);
    setMinRating(0);
    setSortBy("popular");
  }, [currentSlug]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let list = [...categoryData.products];

    // 1. Subcategory filter
    if (selectedSubcategory !== "All") {
      list = list.filter((p) => p.subcategory === selectedSubcategory);
    }

    // 2. Brand filter
    if (selectedBrands.length > 0) {
      list = list.filter((p) => selectedBrands.includes(p.brand));
    }

    // 3. Price Range filter
    if (priceRange === "under-50") {
      list = list.filter((p) => p.price < 50);
    } else if (priceRange === "50-100") {
      list = list.filter((p) => p.price >= 50 && p.price <= 100);
    } else if (priceRange === "100-500") {
      list = list.filter((p) => p.price > 100 && p.price <= 500);
    } else if (priceRange === "above-500") {
      list = list.filter((p) => p.price > 500);
    }

    // 4. In Stock filter
    if (onlyInStock) {
      list = list.filter((p) => p.inStock);
    }

    // 5. Min Rating filter
    if (minRating > 0) {
      list = list.filter((p) => p.rating >= minRating);
    }

    // 6. Sorting
    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [categoryData, selectedSubcategory, selectedBrands, priceRange, onlyInStock, minRating, sortBy]);

  // Helper: toggle brand
  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Helper: clear all filters
  const clearAllFilters = () => {
    setSelectedSubcategory("All");
    setSelectedBrands([]);
    setPriceRange("all");
    setOnlyInStock(false);
    setMinRating(0);
  };

  const hasActiveFilters =
    selectedSubcategory !== "All" ||
    selectedBrands.length > 0 ||
    priceRange !== "all" ||
    onlyInStock ||
    minRating > 0;

  // Cart quantity actions
  const handleAdd = (id) => {
    setCartQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleRemove = (id) => {
    setCartQuantities((prev) => {
      const cur = prev[id] || 0;
      if (cur <= 1) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: cur - 1 };
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#F6F8FD] flex flex-col font-sans">
      {/* Breadcrumb Bar */}
      <div className="w-full bg-white border-b border-slate-100">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Link to="/" className="hover:text-purple-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link to="/" className="hover:text-purple-600 transition-colors">
              Categories
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900">{categoryData.name}</span>
            {selectedSubcategory !== "All" && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-purple-600 font-bold">{selectedSubcategory}</span>
              </>
            )}
          </div>

          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 bg-white"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main PLP 2-Column Layout */}
      <div className="flex-1 max-w-[1700px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-7 items-start">
          
          {/* ================= LEFT SIDEBAR: SUBCATEGORIES & FILTERS ================= */}
          <aside
            className={`${
              mobileFilterOpen ? "block fixed inset-0 z-50 bg-black/40 p-4 lg:p-0" : "hidden"
            } lg:block lg:static w-full lg:w-[270px] shrink-0 space-y-5`}
          >
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm max-h-[90vh] overflow-y-auto lg:max-h-none">
              
              {/* Sidebar Header & Clear All */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <SlidersHorizontal className="w-4 h-4 text-purple-600" />
                  <span>Filters & Categories</span>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-[11px] font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
                {/* Mobile close button */}
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="lg:hidden text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* SECTION 1: SUBCATEGORIES */}
              <div className="py-4 border-b border-slate-100">
                <span className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                  Subcategories
                </span>
                <div className="space-y-1">
                  {categoryData.subcategories.map((sub) => {
                    const isActive = selectedSubcategory === sub;
                    const count =
                      sub === "All"
                        ? categoryData.products.length
                        : categoryData.products.filter((p) => p.subcategory === sub).length;

                    return (
                      <button
                        key={sub}
                        onClick={() => {
                          setSelectedSubcategory(sub);
                          setMobileFilterOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isActive
                            ? "bg-purple-50 text-purple-700 font-bold border border-purple-200"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        <span>{sub}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full ${
                            isActive
                              ? "bg-purple-600 text-white font-bold"
                              : "bg-slate-100 text-slate-500 font-medium"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 2: PRICE RANGE FILTER */}
              <div className="py-4 border-b border-slate-100">
                <span className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                  Price Range
                </span>
                <div className="space-y-2">
                  {[
                    { id: "all", label: "All Prices" },
                    { id: "under-50", label: "Under ₹50" },
                    { id: "50-100", label: "₹50 - ₹100" },
                    { id: "100-500", label: "₹100 - ₹500" },
                    { id: "above-500", label: "Above ₹500" },
                  ].map((p) => (
                    <label
                      key={p.id}
                      className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer hover:text-slate-900"
                    >
                      <input
                        type="radio"
                        name="priceRange"
                        checked={priceRange === p.id}
                        onChange={() => setPriceRange(p.id)}
                        className="w-3.5 h-3.5 text-purple-600 focus:ring-purple-500 cursor-pointer"
                      />
                      <span>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* SECTION 3: BRANDS FILTER */}
              <div className="py-4 border-b border-slate-100">
                <span className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                  Brands
                </span>
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {categoryData.brands.map((brand) => {
                    const isChecked = selectedBrands.includes(brand);
                    return (
                      <label
                        key={brand}
                        className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer hover:text-slate-900"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleBrand(brand)}
                          className="w-3.5 h-3.5 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                        <span>{brand}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 4: MINIMUM CUSTOMER RATING */}
              <div className="py-4 border-b border-slate-100">
                <span className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                  Customer Rating
                </span>
                <div className="space-y-1.5">
                  {[
                    { stars: 4.8, label: "4.8★ & above" },
                    { stars: 4.5, label: "4.5★ & above" },
                    { stars: 4.0, label: "4.0★ & above" },
                    { stars: 0, label: "Any Rating" },
                  ].map((r) => (
                    <button
                      key={r.stars}
                      onClick={() => setMinRating(r.stars)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        minRating === r.stars
                          ? "bg-amber-50 text-amber-900 font-bold"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        {r.stars > 0 && <Star className="w-3 h-3 fill-amber-400 text-amber-400" />}
                        {r.label}
                      </span>
                      {minRating === r.stars && <Check className="w-3.5 h-3.5 text-amber-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION 5: IN STOCK TOGGLE */}
              <div className="pt-4 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700">In Stock Only</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

            </div>
          </aside>

          {/* ================= RIGHT MAIN AREA: PLP HEADER & PRODUCTS GRID ================= */}
          <main className="flex-1 min-w-0">
            
            {/* Header & Sorting Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 mb-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {categoryData.name}
                    {selectedSubcategory !== "All" && (
                      <span className="text-purple-600 font-extrabold text-base sm:text-lg ml-2">
                        &bull; {selectedSubcategory}
                      </span>
                    )}
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Showing <span className="font-bold text-slate-800">{filteredProducts.length}</span>{" "}
                    items available
                  </p>
                </div>

                {/* Minimal Sorting Bar */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" /> Sort By:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-purple-500 focus:bg-white cursor-pointer shadow-2xs"
                  >
                    <option value="popular">Relevance / Popular</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Top Customer Rated</option>
                  </select>
                </div>
              </div>

              {/* Active Filter Chips */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 pt-3.5 mt-3.5 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400">Active Filters:</span>
                  
                  {selectedSubcategory !== "All" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-[11px] font-semibold border border-purple-200">
                      Sub: {selectedSubcategory}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-purple-900"
                        onClick={() => setSelectedSubcategory("All")}
                      />
                    </span>
                  )}

                  {selectedBrands.map((b) => (
                    <span
                      key={b}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold"
                    >
                      Brand: {b}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-slate-900"
                        onClick={() => toggleBrand(b)}
                      />
                    </span>
                  ))}

                  {priceRange !== "all" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                      Price: {priceRange}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-slate-900"
                        onClick={() => setPriceRange("all")}
                      />
                    </span>
                  )}

                  {minRating > 0 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-semibold border border-amber-200">
                      ★ {minRating}+
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-amber-950"
                        onClick={() => setMinRating(0)}
                      />
                    </span>
                  )}

                  {onlyInStock && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                      In Stock Only
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-emerald-950"
                        onClick={() => setOnlyInStock(false)}
                      />
                    </span>
                  )}

                  <button
                    onClick={clearAllFilters}
                    className="text-[11px] font-bold text-red-500 hover:text-red-700 underline ml-1 cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* Products Grid or Empty State */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <SlidersHorizontal className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">No products match your filters</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
                  Try changing your subcategory or clearing your selected filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition-colors shadow-sm cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 pb-12">
                {filteredProducts.map((prod) => {
                  const qty = cartQuantities[prod.id] || 0;

                  return (
                    <div
                      key={prod.id}
                      className="group relative bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-3.5 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all duration-200"
                    >
                      {/* Top Product Section */}
                      <div>
                        {/* Image Box */}
                        <div className="relative w-full aspect-square rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden mb-3">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          {!prod.inStock && (
                            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center">
                              <span className="px-2 py-1 rounded-md bg-slate-800 text-white text-[10px] font-bold">
                                Out of Stock
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Brand & Unit */}
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                          <span className="font-semibold text-slate-500">{prod.brand}</span>
                          <span>{prod.unit}</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xs sm:text-[13px] font-semibold text-slate-900 leading-snug line-clamp-2 mb-2 group-hover:text-purple-700 transition-colors">
                          {prod.name}
                        </h3>
                      </div>

                      {/* Bottom Section: Rating, Price, Add Button */}
                      <div className="pt-2 border-t border-slate-100 mt-2">
                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-2">
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                            <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                            {prod.rating}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ({prod.reviews.toLocaleString()})
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          {/* Price */}
                          <div className="flex flex-col">
                            <span className="text-sm sm:text-base font-black text-slate-900 leading-none">
                              ₹{prod.price}
                            </span>
                            {prod.mrp > prod.price && (
                              <span className="text-[11px] text-slate-400 line-through mt-0.5">
                                ₹{prod.mrp}
                              </span>
                            )}
                          </div>

                          {/* Minimal Add Button or Counter */}
                          {qty === 0 ? (
                            <button
                              disabled={!prod.inStock}
                              onClick={() => handleAdd(prod.id)}
                              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all duration-150 active:scale-95 flex items-center gap-1 ${
                                prod.inStock
                                  ? "bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white border border-purple-200 hover:border-purple-600 cursor-pointer"
                                  : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                              }`}
                            >
                              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>Add</span>
                            </button>
                          ) : (
                            <div className="inline-flex items-center bg-purple-600 text-white rounded-lg px-1.5 py-1 text-xs font-bold shadow-sm">
                              <button
                                onClick={() => handleRemove(prod.id)}
                                className="p-0.5 hover:bg-purple-700 rounded transition-colors cursor-pointer"
                              >
                                <Minus className="w-3 h-3 stroke-[2.5]" />
                              </button>
                              <span className="px-2 min-w-[20px] text-center font-black">
                                {qty}
                              </span>
                              <button
                                onClick={() => handleAdd(prod.id)}
                                className="p-0.5 hover:bg-purple-700 rounded transition-colors cursor-pointer"
                              >
                                <Plus className="w-3 h-3 stroke-[2.5]" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </main>

        </div>
      </div>

      <Footer />
    </div>
  );
}
