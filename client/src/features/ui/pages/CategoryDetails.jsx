import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronRight,
  Star,
  Plus,
  Minus,
  ArrowUpDown,
  X,
  Check,
  Zap,
} from "lucide-react";
import Footer from "../components/Footer";
import dairyBreadEggsImg from "../../../assets/category/dairy-bread-eggs.png";

// Blinkit-style PLP Catalog Data with Visual Subcategories
const PLP_DATA = {
  "dairy-bread-eggs": {
    name: "Dairy, Bread & Eggs",
    description: "Farm-fresh milk, artisan bakery items, eggs, and dairy essentials.",
    subcategories: [
      {
        name: "All Products",
        image: dairyBreadEggsImg,
      },
      {
        name: "Milk & Cream",
        image:
          "https://pngimg.com/uploads/milk/milk_PNG12734.png",
      },
      {
        name: "Bread & Bakery",
        image:
          "https://pngimg.com/uploads/bread/bread_PNG2301.png",
      },
      {
        name: "Eggs",
        image:
          "https://pngimg.com/uploads/egg/egg_PNG40.png",
      },
      {
        name: "Butter & Cheese",
        image:
          "https://pngimg.com/uploads/cheese/cheese_PNG25313.png",
      },
      {
        name: "Curd & Yogurt",
        image:
          "https://pngimg.com/uploads/yogurt/yogurt_PNG15214.png",
      },
    ],
    brands: ["All Brands", "Amul", "Britannia", "Harvest Gold", "Mother Dairy", "Epigamia"],
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
          "https://pngimg.com/uploads/milk/milk_PNG12734.png",
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
          "https://pngimg.com/uploads/bread/bread_PNG2301.png",
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
          "https://pngimg.com/uploads/egg/egg_PNG40.png",
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
          "https://pngimg.com/uploads/butter/butter_PNG26.png",
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
          "https://pngimg.com/uploads/yogurt/yogurt_PNG15214.png",
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
        inStock: true,
        image:
          "https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=400&h=400&fit=crop&q=80",
      },
    ],
  },
  "fruits-vegetables": {
    name: "Fruits & Vegetables",
    description: "Hand-picked farm fresh produce, organic vegetables, and seasonal fruits.",
    subcategories: [
      {
        name: "All Products",
        image:
          "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=160&h=160&fit=crop&q=80",
      },
      {
        name: "Fresh Fruits",
        image:
          "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=160&h=160&fit=crop&q=80",
      },
      {
        name: "Daily Vegetables",
        image:
          "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=160&h=160&fit=crop&q=80",
      },
      {
        name: "Organic Greens",
        image:
          "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=160&h=160&fit=crop&q=80",
      },
      {
        name: "Exotics",
        image:
          "https://images.unsplash.com/photo-1585059895524-72359e06133a?w=160&h=160&fit=crop&q=80",
      },
    ],
    brands: ["All Brands", "Farm Fresh", "Organic India", "Fresh Pick"],
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
    subcategories: [
      {
        name: "All Products",
        image:
          "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=160&h=160&fit=crop&q=80",
      },
      {
        name: "Soft Drinks",
        image:
          "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=160&h=160&fit=crop&q=80",
      },
      {
        name: "Fruit Juices",
        image:
          "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=160&h=160&fit=crop&q=80",
      },
      {
        name: "Energy Drinks",
        image:
          "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=160&h=160&fit=crop&q=80",
      },
      {
        name: "Coconut Water",
        image:
          "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=160&h=160&fit=crop&q=80",
      },
    ],
    brands: ["All Brands", "Coca-Cola", "Tropicana", "Red Bull", "Real", "Raw Pressery"],
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
    subcategories: [
      {
        name: "All Products",
        image:
          "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=160&h=160&fit=crop&q=80",
      },
      {
        name: "Chips & Crisps",
        image:
          "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=160&h=160&fit=crop&q=80",
      },
      {
        name: "Namkeen & Bhujia",
        image:
          "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=160&h=160&fit=crop&q=80",
      },
      {
        name: "Popcorn",
        image:
          "https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=160&h=160&fit=crop&q=80",
      },
    ],
    brands: ["All Brands", "Lay's", "Doritos", "Haldiram's", "Act II"],
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
    subcategories: [
      {
        name: "All Products",
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=160&h=160&fit=crop&q=80",
      },
      {
        name: "Audio & Earbuds",
        image:
          "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=160&h=160&fit=crop&q=80",
      },
      {
        name: "Smart Watches",
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=160&h=160&fit=crop&q=80",
      },
      {
        name: "Storage & Cables",
        image:
          "https://images.unsplash.com/photo-1628135848208-a5b6f3a743ef?w=160&h=160&fit=crop&q=80",
      },
      {
        name: "Power Banks",
        image:
          "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=160&h=160&fit=crop&q=80",
      },
    ],
    brands: ["All Brands", "boAt", "Noise", "SanDisk", "JBL", "Portronics"],
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

  // State
  const [selectedSubcategory, setSelectedSubcategory] = useState("All Products");
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [cartQuantities, setCartQuantities] = useState({});

  // Dynamic Fallback Generator
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
      subcategories: [
        {
          name: "All Products",
          image:
            "https://images.unsplash.com/photo-1542838132-92c53300491e?w=160&h=160&fit=crop&q=80",
        },
        {
          name: "Popular Picks",
          image:
            "https://images.unsplash.com/photo-1506617420156-8e4536971650?w=160&h=160&fit=crop&q=80",
        },
        {
          name: "Best Sellers",
          image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=160&h=160&fit=crop&q=80",
        },
        {
          name: "New Arrivals",
          image:
            "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=160&h=160&fit=crop&q=80",
        },
      ],
      brands: ["All Brands", "MarketPlace Brand", "Premium Choice", "Daily Essentials"],
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

  // Reset states on category slug change
  React.useEffect(() => {
    setSelectedSubcategory("All Products");
    setSelectedBrand("All Brands");
    setOnlyInStock(false);
    setSortBy("popular");
  }, [currentSlug]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let list = [...categoryData.products];

    // Subcategory Filter
    if (selectedSubcategory !== "All Products") {
      list = list.filter((p) => p.subcategory === selectedSubcategory);
    }

    // Brand Filter
    if (selectedBrand !== "All Brands") {
      list = list.filter((p) => p.brand === selectedBrand);
    }

    // In Stock Filter
    if (onlyInStock) {
      list = list.filter((p) => p.inStock);
    }

    // Sorting
    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [categoryData, selectedSubcategory, selectedBrand, onlyInStock, sortBy]);

  // Cart actions
  const handleAdd = (id, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCartQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleRemove = (id, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
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
      {/* Clean Minimal Breadcrumb */}
      <div className="w-full bg-white border-b border-slate-100">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Link to="/" className="hover:text-emerald-700 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link to="/" className="hover:text-emerald-700 transition-colors">
              Categories
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900">{categoryData.name}</span>
            {selectedSubcategory !== "All Products" && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-emerald-700 font-bold">{selectedSubcategory}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-[1700px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* ================= BLINKIT-STYLE VISUAL SUBCATEGORY SIDEBAR ================= */}
          <aside className="w-full lg:w-[280px] shrink-0 lg:sticky lg:top-[90px]">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              
              {/* Sidebar Title */}
              <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Select Category
                </h3>
              </div>

              {/* Vertical Subcategory List with Thumbnails */}
              <div className="divide-y divide-slate-100 flex lg:flex-col overflow-x-auto lg:overflow-x-visible [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {categoryData.subcategories.map((sub) => {
                  const isActive = selectedSubcategory === sub.name;
                  const count =
                    sub.name === "All Products"
                      ? categoryData.products.length
                      : categoryData.products.filter((p) => p.subcategory === sub.name).length;

                  return (
                    <button
                      key={sub.name}
                      onClick={() => setSelectedSubcategory(sub.name)}
                      className={`relative flex items-center gap-3 p-3 text-left transition-all duration-200 shrink-0 lg:shrink cursor-pointer ${
                        isActive
                          ? "bg-emerald-50/80 text-emerald-950 font-bold"
                          : "bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-950 font-medium"
                      }`}
                    >
                      {/* Left Active Indicator Bar (Blinkit Style) */}
                      {isActive && (
                        <span className="hidden lg:block absolute left-0 top-0 bottom-0 w-1 bg-emerald-600 rounded-r" />
                      )}

                      {/* Real Image Thumbnail Box */}
                      <div
                        className={`w-12 h-12 rounded-xl shrink-0 p-1 flex items-center justify-center overflow-hidden border transition-all ${
                          isActive
                            ? "bg-white border-emerald-300 shadow-xs"
                            : "bg-slate-50 border-slate-200/80"
                        }`}
                      >
                        <img
                          src={sub.image}
                          alt={sub.name}
                          className="w-full h-full object-contain mix-blend-multiply rounded-lg p-0.5"
                          loading="lazy"
                        />
                      </div>

                      {/* Text & Count */}
                      <div className="min-w-0 pr-2">
                        <span className="block text-xs sm:text-[13px] leading-snug truncate">
                          {sub.name}
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          {count} items
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

            </div>
          </aside>

          {/* ================= RIGHT MAIN AREA: PRODUCTS & QUICK FILTER BAR ================= */}
          <main className="flex-1 min-w-0 w-full">
            
            {/* Header with Title, Quick Brand Pills & Sort Dropdown */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 mb-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {selectedSubcategory === "All Products" ? categoryData.name : selectedSubcategory}
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Showing <span className="font-bold text-slate-800">{filteredProducts.length}</span>{" "}
                    items available in {categoryData.name}
                  </p>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" /> Sort:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-emerald-600 focus:bg-white cursor-pointer shadow-2xs"
                  >
                    <option value="popular">Relevance</option>
                    <option value="price-asc">Price (Low to High)</option>
                    <option value="price-desc">Price (High to Low)</option>
                    <option value="rating">Customer Rating</option>
                  </select>
                </div>
              </div>

              {/* Quick Brand Filter Pills & In-Stock Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 mt-3.5 border-t border-slate-100">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  <span className="text-[11px] font-bold text-slate-400 shrink-0">Brand:</span>
                  {categoryData.brands.map((b) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBrand(b)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        selectedBrand === b
                          ? "bg-slate-900 text-white shadow-2xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>

                {/* In Stock Toggle */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-medium text-slate-600">In Stock</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyInStock}
                      onChange={(e) => setOnlyInStock(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4.5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>

            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
                <h3 className="text-base font-bold text-slate-800">No products found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                  Try selecting another subcategory from the left menu.
                </p>
                <button
                  onClick={() => {
                    setSelectedSubcategory("All Products");
                    setSelectedBrand("All Brands");
                    setOnlyInStock(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#059669] text-white font-bold text-xs hover:bg-[#047857] transition-colors shadow-xs cursor-pointer"
                >
                  Show All Products
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
                      {/* Top Product Section (Clickable Link to Product Details Page) */}
                      <Link
                        to={`/product/${prod.id}`}
                        state={{ product: prod, categoryName: categoryData.name }}
                        className="block cursor-pointer group/link"
                      >
                        {/* Image Box */}
                        <div className="relative w-full aspect-square rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden mb-3">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-contain group-hover/link:scale-108 transition-transform duration-300 p-2"
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
                        <h3 className="text-xs sm:text-[13px] font-semibold text-slate-900 leading-snug line-clamp-2 mb-2 group-hover/link:text-emerald-700 transition-colors">
                          {prod.name}
                        </h3>
                      </Link>

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
                              onClick={(e) => handleAdd(prod.id, e)}
                              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all duration-150 active:scale-95 flex items-center gap-1 ${
                                prod.inStock
                                  ? "bg-emerald-50 text-emerald-700 hover:bg-[#059669] hover:text-white border border-emerald-200 hover:border-emerald-600 cursor-pointer"
                                  : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                              }`}
                            >
                              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>Add</span>
                            </button>
                          ) : (
                            <div className="inline-flex items-center bg-[#059669] text-white rounded-lg px-1.5 py-1 text-xs font-bold shadow-xs">
                              <button
                                onClick={(e) => handleRemove(prod.id, e)}
                                className="p-0.5 hover:bg-[#047857] rounded transition-colors cursor-pointer"
                              >
                                <Minus className="w-3 h-3 stroke-[2.5]" />
                              </button>
                              <span className="px-2 min-w-[20px] text-center font-black">
                                {qty}
                              </span>
                              <button
                                onClick={(e) => handleAdd(prod.id, e)}
                                className="p-0.5 hover:bg-[#047857] rounded transition-colors cursor-pointer"
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
