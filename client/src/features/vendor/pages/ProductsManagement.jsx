import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Cards from "../components/Cards";
import {
  Package,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  ArrowUpDown,
  X,
  Upload,
  IndianRupee,
  Layers,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

const INITIAL_PRODUCTS = [
  {
    id: "PRD-101",
    name: "Amul Taaza Fresh Toned Milk",
    category: "Dairy, Bread & Eggs",
    unit: "1 L",
    price: 54,
    mrp: 56,
    stock: 42,
    sales: 320,
    status: "In Stock",
    image: "https://pngimg.com/uploads/milk/milk_PNG12734.png",
  },
  {
    id: "PRD-102",
    name: "Harvest Gold White Sandwich Bread",
    category: "Dairy, Bread & Eggs",
    unit: "400 g",
    price: 40,
    mrp: 45,
    stock: 28,
    sales: 245,
    status: "In Stock",
    image: "https://pngimg.com/uploads/bread/bread_PNG2301.png",
  },
  {
    id: "PRD-103",
    name: "Farm Fresh Brown Table Eggs",
    category: "Dairy, Bread & Eggs",
    unit: "Pack of 6",
    price: 68,
    mrp: 75,
    stock: 6,
    sales: 190,
    status: "Low Stock",
    image: "https://pngimg.com/uploads/egg/egg_PNG40.png",
  },
  {
    id: "PRD-104",
    name: "Amul Pasteurised Salted Table Butter",
    category: "Dairy, Bread & Eggs",
    unit: "100 g",
    price: 58,
    mrp: 60,
    stock: 35,
    sales: 410,
    status: "In Stock",
    image: "https://pngimg.com/uploads/butter/butter_PNG26.png",
  },
  {
    id: "PRD-105",
    name: "Fresh Robusta Yellow Bananas",
    category: "Fruits & Vegetables",
    unit: "1 kg (~6-8 pcs)",
    price: 52,
    mrp: 65,
    stock: 18,
    sales: 280,
    status: "In Stock",
    image:
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop&q=80",
  },
  {
    id: "PRD-106",
    name: "Shimla Crisp Royal Gala Apples",
    category: "Fruits & Vegetables",
    unit: "4 pcs (~600 g)",
    price: 140,
    mrp: 160,
    stock: 4,
    sales: 135,
    status: "Low Stock",
    image:
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop&q=80",
  },
  {
    id: "PRD-107",
    name: "Coca-Cola Original Taste Can",
    category: "Cold Drinks & Juices",
    unit: "300 ml",
    price: 40,
    mrp: 40,
    stock: 50,
    sales: 512,
    status: "In Stock",
    image:
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&h=300&fit=crop&q=80",
  },
  {
    id: "PRD-108",
    name: "Lay's Classic Salted Potato Chips",
    category: "Snacks & Munchies",
    unit: "50 g",
    price: 20,
    mrp: 20,
    stock: 0,
    sales: 340,
    status: "Out of Stock",
    image:
      "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&h=300&fit=crop&q=80",
  },
  {
    id: "PRD-109",
    name: "Sony WH-1000XM5 Wireless Headphones",
    category: "Electronics",
    unit: "1 unit",
    price: 26990,
    mrp: 34990,
    stock: 12,
    sales: 85,
    status: "In Stock",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop&q=80",
  },
  {
    id: "PRD-110",
    name: "Nike Air Force 1 '07 Sneakers",
    category: "Fashion",
    unit: "UK 8",
    price: 7495,
    mrp: 9695,
    stock: 0,
    sales: 64,
    status: "Out of Stock",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop&q=80",
  },
];

export default function ProductsManagement() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStockStatus, setSelectedStockStatus] = useState("All");
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'grid'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  // New / Edit Product Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "Dairy, Bread & Eggs",
    unit: "1 unit",
    price: "",
    mrp: "",
    stock: "",
    image: "",
  });

  const categories = [
    "All",
    "Dairy, Bread & Eggs",
    "Fruits & Vegetables",
    "Snacks & Munchies",
    "Cold Drinks & Juices",
    "Electronics",
    "Fashion",
  ];

  // Quick Stats
  const totalProducts = products.length;
  const inStockCount = products.filter((p) => p.stock > 10).length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Filter products based on search, category, and stock
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;
    const matchesStock =
      selectedStockStatus === "All" ||
      (selectedStockStatus === "In Stock" && p.stock > 10) ||
      (selectedStockStatus === "Low Stock" && p.stock > 0 && p.stock <= 10) ||
      (selectedStockStatus === "Out of Stock" && p.stock === 0);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "Dairy, Bread & Eggs",
      unit: "1 unit",
      price: "",
      mrp: "",
      stock: "",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=300&fit=crop&q=80",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      unit: product.unit,
      price: product.price,
      mrp: product.mrp,
      stock: product.stock,
      image: product.image,
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    showNotification("Product removed from inventory.");
  };

  // Bulk Selection & Delete Handlers
  const isAllSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((p) => selectedIds.includes(p.id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map((p) => p.id));
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedIds.length} products?`
      )
    ) {
      setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
      showNotification(`${selectedIds.length} products deleted successfully.`);
      setSelectedIds([]);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const stockNum = Number(formData.stock) || 0;
    const priceNum = Number(formData.price) || 0;
    const mrpNum = Number(formData.mrp) || priceNum;

    const statusStr =
      stockNum === 0
        ? "Out of Stock"
        : stockNum <= 10
        ? "Low Stock"
        : "In Stock";

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((item) =>
          item.id === editingProduct.id
            ? {
                ...item,
                ...formData,
                price: priceNum,
                mrp: mrpNum,
                stock: stockNum,
                status: statusStr,
              }
            : item
        )
      );
      showNotification("Product updated successfully!");
    } else {
      const newProduct = {
        id: `PRD-${Math.floor(100 + Math.random() * 900)}`,
        ...formData,
        price: priceNum,
        mrp: mrpNum,
        stock: stockNum,
        sales: 0,
        status: statusStr,
      };
      setProducts((prev) => [newProduct, ...prev]);
      showNotification("New product added to store!");
    }

    setIsModalOpen(false);
  };

  return (
    <div className="h-screen w-full bg-white flex flex-col font-['Poppins',sans-serif] text-slate-800 relative overflow-hidden">
      {/* Background Ambient Glow Orbs */}
      <div className="pointer-events-none absolute -left-20 top-0 w-[450px] h-[450px] rounded-full bg-gradient-to-br from-emerald-400/15 to-teal-300/10 blur-3xl z-0" />
      <div className="pointer-events-none absolute right-10 top-20 w-[420px] h-[420px] rounded-full bg-gradient-to-bl from-teal-400/15 to-emerald-300/10 blur-3xl z-0" />
      <div className="pointer-events-none absolute left-1/3 bottom-10 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-emerald-300/15 to-teal-200/10 blur-3xl z-0" />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-[#049669] px-5 py-3.5 text-white shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="h-5 w-5 text-emerald-200 shrink-0" />
          <p className="text-xs sm:text-sm font-bold">{toastMessage}</p>
        </div>
      )}

      {/* Full Top Navbar */}
      <Navbar onToggleSidebar={() => setIsSidebarOpen(true)} />

      {/* Body Area below Navbar: Sidebar on left, Content on right */}
      <div className="flex-1 flex min-h-0 relative z-10 overflow-hidden">
        {/* Persistent Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Right Main Content */}
        <div className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto relative z-10">

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6   w-full mx-auto">
          {/* Welcome Banner in Frosted Glassy Emerald Green */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#049669]/95 via-[#059669]/90 to-[#10B981]/85 backdrop-blur-2xl rounded-xl sm:rounded-2xl p-5 sm:p-7 text-white border border-white/20 shadow-[0_12px_40px_rgba(4,150,105,0.25)] relative overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-black/15" />

            {/* Glowing inner glass ambient blobs */}
            <div className="pointer-events-none absolute -right-12 -top-12 w-48 h-48 rounded-full bg-emerald-400/20 blur-2xl" />
            <div className="pointer-events-none absolute right-1/4 -bottom-10 w-44 h-44 rounded-full bg-teal-400/20 blur-2xl" />

            <div className="space-y-1 z-10 relative">
              <span className="text-xs uppercase font-extrabold text-emerald-100 tracking-wider">
                Store Inventory
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight drop-shadow-sm">
                Products &amp; Catalog Management
              </h1>
              <p className="text-xs sm:text-sm text-emerald-50 max-w-xl font-medium">
                Manage, add, edit, and keep track of live inventory stock across your store.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 z-10 relative">
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="px-4 py-2.5 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/40 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 cursor-pointer relative overflow-hidden group"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-200/70 to-transparent" />
                <Plus className="w-4 h-4 stroke-[2.5] transition-transform group-hover:rotate-90" />
                <span>Add New Product</span>
              </button>
            </div>
          </div>

          {/* Metric Stats Cards Reusing Shared Cards Component */}
          <Cards
            stats={[
              {
                id: "catalog",
                title: "Total Catalog",
                value: `${totalProducts} Items`,
                icon: Package,
                iconColor: "text-white bg-gradient-to-tr from-[#049669] to-[#10B981] border-emerald-400/40 shadow-md shadow-emerald-600/25",
                bgGradient: "from-emerald-50/90 via-white/85 to-white/60",
                accentBorder: "border-emerald-200/80 hover:border-emerald-400 hover:shadow-[0_16px_36px_rgba(4,150,105,0.15)]",
                glowColor: "bg-emerald-400/25",
                valueColor: "text-[#049669]",
              },
              {
                id: "instock",
                title: "Available in Stock",
                value: inStockCount,
                icon: CheckCircle2,
                iconColor: "text-white bg-gradient-to-tr from-[#059669] to-teal-500 border-teal-400/40 shadow-md shadow-teal-600/25",
                bgGradient: "from-teal-50/90 via-white/85 to-white/60",
                accentBorder: "border-teal-200/80 hover:border-teal-400 hover:shadow-[0_16px_36px_rgba(13,148,136,0.15)]",
                glowColor: "bg-teal-400/25",
                valueColor: "text-[#1E1B4B]",
              },
              {
                id: "lowstock",
                title: "Low Stock Alert",
                value: lowStockCount,
                valueColor: "text-amber-600",
                icon: AlertTriangle,
                iconColor: "text-white bg-gradient-to-tr from-amber-500 to-amber-400 border-amber-300 shadow-md shadow-amber-500/25",
                bgGradient: "from-amber-50/90 via-white/85 to-white/60",
                accentBorder: "border-amber-200/80 hover:border-amber-400 hover:shadow-[0_16px_36px_rgba(245,158,11,0.15)]",
                glowColor: "bg-amber-400/25",
              },
              {
                id: "outofstock",
                title: "Out of Stock",
                value: outOfStockCount,
                valueColor: "text-rose-600",
                icon: XCircle,
                iconColor: "text-white bg-gradient-to-tr from-rose-600 to-rose-400 border-rose-300 shadow-md shadow-rose-500/25",
                bgGradient: "from-rose-50/80 via-white/85 to-white/60",
                accentBorder: "border-rose-200/80 hover:border-rose-400 hover:shadow-[0_16px_36px_rgba(225,29,72,0.15)]",
                glowColor: "bg-rose-400/25",
              },
            ]}
          />

          {/* Search, Filter & View Controls */}
          <div className="bg-white/60 backdrop-blur-2xl rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-white/80 shadow-[0_8px_30px_rgba(4,150,105,0.06)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 relative overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search products by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 bg-white/80 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#049669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
              />
            </div>

            {/* Filter Dropdowns & View Mode Toggle */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-10 px-3 rounded-lg border border-slate-200 bg-white/80 text-xs font-medium text-slate-700 focus:border-[#049669] focus:ring-2 focus:ring-emerald-500/15 outline-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === "All" ? "All Categories" : c}
                  </option>
                ))}
              </select>

              {/* Stock Status Filter */}
              <select
                value={selectedStockStatus}
                onChange={(e) => setSelectedStockStatus(e.target.value)}
                className="h-10 px-3 rounded-lg border border-slate-200 bg-white/80 text-xs font-medium text-slate-700 focus:border-[#049669] focus:ring-2 focus:ring-emerald-500/15 outline-none cursor-pointer"
              >
                <option value="All">All Stock Status</option>
                <option value="In Stock">In Stock (&gt;10)</option>
                <option value="Low Stock">Low Stock (&le;10)</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>

              {/* View Toggle */}
              <div className="flex items-center rounded-lg border border-slate-200 bg-white/80 p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-md transition cursor-pointer ${
                    viewMode === "table"
                      ? "bg-emerald-50 text-[#049669] shadow-2xs"
                      : "text-slate-400 hover:text-slate-700"
                  }`}
                  aria-label="Table View"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-emerald-50 text-[#049669] shadow-2xs"
                      : "text-slate-400 hover:text-slate-700"
                  }`}
                  aria-label="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ================= BULK ACTIONS FLOATING BAR ================= */}
          {selectedIds.length > 0 && (
            <div className="bg-slate-900/90 backdrop-blur-xl text-white px-4 sm:px-5 py-3 rounded-xl sm:rounded-2xl shadow-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200 border border-slate-700/60 mb-5">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
                <span className="w-6 h-6 rounded-lg bg-[#049669] flex items-center justify-center font-bold text-xs text-white">
                  {selectedIds.length}
                </span>
                <span>Selected Products</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                >
                  Deselect All
                </button>
                <button
                  type="button"
                  onClick={handleBulkDelete}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Bulk Delete ({selectedIds.length})</span>
                </button>
              </div>
            </div>
          )}

          {/* Products Content: Table View */}
          {viewMode === "table" ? (
            <div className="bg-white/60 backdrop-blur-2xl rounded-xl sm:rounded-2xl border border-white/80 shadow-[0_8px_30px_rgba(5,150,105,0.04)] overflow-hidden relative">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-emerald-50/40 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-4 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={isAllSelected}
                          onChange={handleToggleSelectAll}
                          className="w-4 h-4 rounded text-[#049669] focus:ring-emerald-500 accent-[#049669] cursor-pointer"
                          aria-label="Select all products"
                        />
                      </th>
                      <th className="py-3.5 px-4 sm:px-6">Product</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Stock</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Sales</th>
                      <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-medium">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center py-12 text-slate-400">
                          <Package className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
                          <p className="font-bold text-slate-600">No products found</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Try adjusting your search or filter options.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => {
                        const isLowStock = p.stock > 0 && p.stock <= 10;
                        const isOutOfStock = p.stock === 0;
                        const isSelected = selectedIds.includes(p.id);

                        return (
                          <tr
                            key={p.id}
                            className={`transition-colors group ${
                              isSelected
                                ? "bg-emerald-50/60"
                                : "hover:bg-emerald-50/30"
                            }`}
                          >
                            <td className="py-3 px-4 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSelect(p.id)}
                                className="w-4 h-4 rounded text-[#049669] focus:ring-emerald-500 accent-[#049669] cursor-pointer"
                                aria-label={`Select product ${p.name}`}
                              />
                            </td>

                            <td className="py-3 px-4 sm:px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-emerald-50/50 border border-emerald-100/60 p-1 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
                                  <img
                                    src={p.image}
                                    alt={p.name}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate max-w-xs sm:max-w-sm">
                                    {p.name}
                                  </h4>
                                  <p className="text-[11px] text-slate-400 mt-0.5">
                                    SKU: {p.id} • {p.unit}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                                {p.category}
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              <div className="flex items-baseline gap-1.5">
                                <span className="font-black text-slate-900">
                                  ₹{p.price.toLocaleString("en-IN")}
                                </span>
                                {p.mrp > p.price && (
                                  <span className="text-[11px] text-slate-400 line-through">
                                    ₹{p.mrp.toLocaleString("en-IN")}
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              <span className="font-bold text-slate-700">{p.stock} units</span>
                            </td>

                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${
                                  isOutOfStock
                                    ? "bg-rose-50 text-rose-700 border-rose-200/60"
                                    : isLowStock
                                    ? "bg-amber-50 text-amber-700 border-amber-200/60"
                                    : "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                                }`}
                              >
                                {p.status}
                              </span>
                            </td>

                            <td className="py-3 px-4 text-slate-600">
                              {p.sales} sold
                            </td>

                            <td className="py-3 px-4 sm:px-6 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditModal(p)}
                                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 text-slate-600 flex items-center justify-center transition shadow-2xs cursor-pointer"
                                  title="Edit product"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:border-rose-500 hover:text-rose-600 text-slate-400 flex items-center justify-center transition shadow-2xs cursor-pointer"
                                  title="Delete product"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="p-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium bg-slate-50/50">
                <span>
                  Showing {filteredProducts.length} of {totalProducts} products
                </span>
                <span className="text-[11px] text-slate-400">
                  Live synced with customer store
                </span>
              </div>
            </div>
          ) : (
            /* Products Content: Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((p) => {
                const isLowStock = p.stock > 0 && p.stock <= 10;
                const isOutOfStock = p.stock === 0;
                const isSelected = selectedIds.includes(p.id);

                return (
                  <div
                    key={p.id}
                    className={`backdrop-blur-2xl rounded-2xl p-4 border shadow-[0_8px_30px_rgba(5,150,105,0.06)] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(4,150,105,0.12)] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
                      isSelected
                        ? "border-[#049669] ring-2 ring-emerald-500/25 bg-emerald-50/40"
                        : "bg-white/70 border-white/80 hover:border-emerald-300"
                    }`}
                  >
                    {/* Top glass edge highlight */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/90 to-transparent" />

                    {/* Ambient corner glow */}
                    <div className="pointer-events-none absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-emerald-400/10 blur-xl group-hover:scale-125 transition-transform duration-500" />

                    <div>
                      {/* Image & Status Tag & Checkbox */}
                      <div className="relative aspect-square rounded-xl bg-gradient-to-br from-emerald-50/60 to-slate-50 border border-emerald-100/60 p-3 flex items-center justify-center overflow-hidden mb-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(p.id)}
                          className="absolute top-2.5 right-2.5 z-10 w-4 h-4 rounded text-[#049669] focus:ring-emerald-500 accent-[#049669] cursor-pointer"
                          aria-label={`Select product ${p.name}`}
                        />
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-full w-full object-contain group-hover:scale-105 transition-transform"
                        />
                        <span
                          className={`absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[9px] font-bold border shadow-2xs ${
                            isOutOfStock
                              ? "bg-rose-50 text-rose-700 border-rose-200/60"
                              : isLowStock
                              ? "bg-amber-50 text-amber-700 border-amber-200/60"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>

                      {/* Category & Name */}
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                        {p.category}
                      </span>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm mt-1 line-clamp-2">
                        {p.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {p.unit} • Stock: {p.stock}
                      </p>
                    </div>

                    {/* Price & Actions */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-base font-black text-slate-900 block leading-tight">
                          ₹{p.price.toLocaleString("en-IN")}
                        </span>
                        {p.mrp > p.price && (
                          <span className="text-[10px] text-slate-400 line-through">
                            ₹{p.mrp.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(p)}
                          className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 text-slate-600 flex items-center justify-center transition shadow-2xs cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.id)}
                          className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:border-rose-500 hover:text-rose-600 text-slate-400 flex items-center justify-center transition shadow-2xs cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
          />

          <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-2xl border border-white/80 p-6 sm:p-7 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center border border-emerald-200/50">
                  <Package className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {editingProduct ? "Edit Product Details" : "Add New Store Product"}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Fill in details to update the live catalog.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fresh Organic Strawberries"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#049669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 focus:border-[#049669] focus:ring-2 focus:ring-emerald-500/15 outline-none cursor-pointer"
                  >
                    {categories
                      .filter((c) => c !== "All")
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Unit / Size *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1 kg, 500 ml, 1 unit"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#049669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 99"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#049669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    MRP (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 120"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#049669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Stock Units *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 25"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#049669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Product Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#049669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#049669] via-[#059669] to-[#10B981] hover:from-[#03704f] hover:to-[#049669] text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition cursor-pointer"
                >
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

