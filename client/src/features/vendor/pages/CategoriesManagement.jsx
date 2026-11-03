import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Cards from "../components/Cards";
import {
  Shapes,
  Plus,
  Search,
  Grid,
  List,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Eye,
  EyeOff,
  Layers,
} from "lucide-react";

// Packshot assets
import dairyBreadEggsImg from "../../../assets/category/dairy-bread-eggs.png";
import coldDrinksJuicesImg from "../../../assets/category/cold-drinks-juices.png";
import snacksMunchiesImg from "../../../assets/category/snacks-munchies.png";
import fruitsVegetablesImg from "../../../assets/category/fruits-vegetables.png";
import attaRiceDalImg from "../../../assets/category/atta-rice-dal.png";
import bakeryBiscuitsImg from "../../../assets/category/bakery-biscuits.png";
import breakfastInstantFoodImg from "../../../assets/category/breakfast-instant-food.png";
import sweetToothImg from "../../../assets/category/sweet-tooth.png";
import teaCoffeeDrinksImg from "../../../assets/category/tea-coffee-drinks.png";
import masalaOilMoreImg from "../../../assets/category/masala-oil-more.png";
import saucesSpreadsImg from "../../../assets/category/sauces-spreads.png";
import chickenMeatFishImg from "../../../assets/category/chicken-meat-fish.png";
import organicHealthyImg from "../../../assets/category/organic-healthy.png";
import babyCareImg from "../../../assets/category/baby-care.png";
import pharmaWellnessImg from "../../../assets/category/pharma-wellness.png";
import cleaningEssentialsImg from "../../../assets/category/cleaning-essentials.png";
import homeOfficeImg from "../../../assets/category/home-office.png";
import personalCareImg from "../../../assets/category/personal-care.png";
import petCareImg from "../../../assets/category/pet-care.png";
import paanCornerImg from "../../../assets/category/paan-corner.png";

const INITIAL_CATEGORIES = [
  {
    id: "CAT-01",
    name: "Dairy, Bread & Eggs",
    slug: "dairy-bread-eggs",
    image: dairyBreadEggsImg,
    status: "Active",
    description: "Fresh milk, daily bread, butter, cheese, and farm fresh eggs.",
  },
  {
    id: "CAT-02",
    name: "Cold Drinks & Juices",
    slug: "cold-drinks-juices",
    image: coldDrinksJuicesImg,
    status: "Active",
    description: "Refreshing carbonated sodas, natural fruit juices, and cold drinks.",
  },
  {
    id: "CAT-03",
    name: "Snacks & Munchies",
    slug: "snacks-munchies",
    image: snacksMunchiesImg,
    status: "Active",
    description: "Crispy potato chips, namkeen, roasted nuts, and light bites.",
  },
  {
    id: "CAT-04",
    name: "Fruits & Vegetables",
    slug: "fruits-vegetables",
    image: fruitsVegetablesImg,
    status: "Active",
    description: "Freshly harvested organic seasonal fruits and green farm vegetables.",
  },
  {
    id: "CAT-05",
    name: "Atta, Rice & Dal",
    slug: "atta-rice-dal",
    image: attaRiceDalImg,
    status: "Active",
    description: "Premium chakki whole wheat atta, basmati rice, and organic pulses.",
  },
  {
    id: "CAT-06",
    name: "Bakery & Biscuits",
    slug: "bakery-biscuits",
    image: bakeryBiscuitsImg,
    status: "Active",
    description: "Oven fresh cookies, buttery rusks, cakes, and whole grain biscuits.",
  },
  {
    id: "CAT-07",
    name: "Breakfast & Instant Food",
    slug: "breakfast-instant-food",
    image: breakfastInstantFoodImg,
    status: "Active",
    description: "Instant noodles, oats, crunchy corn flakes, and ready-to-eat meals.",
  },
  {
    id: "CAT-08",
    name: "Sweet Tooth & Chocolates",
    slug: "sweet-tooth",
    image: sweetToothImg,
    status: "Active",
    description: "Rich dark chocolates, traditional Indian sweets, and confectionery.",
  },
  {
    id: "CAT-09",
    name: "Tea, Coffee & Health Drinks",
    slug: "tea-coffee-drinks",
    image: teaCoffeeDrinksImg,
    status: "Active",
    description: "Assam tea leaves, instant aromatic coffee, and malt health drinks.",
  },
  {
    id: "CAT-10",
    name: "Masala, Oil & More",
    slug: "masala-oil-more",
    image: masalaOilMoreImg,
    status: "Active",
    description: "Aromatic ground spices, pure mustard oil, ghee, and whole seeds.",
  },
  {
    id: "CAT-11",
    name: "Sauces & Spreads",
    slug: "sauces-spreads",
    image: saucesSpreadsImg,
    status: "Active",
    description: "Tangy tomato ketchup, chocolate spreads, mayonnaise, and jams.",
  },
  {
    id: "CAT-12",
    name: "Chicken, Meat & Fish",
    slug: "chicken-meat-fish",
    image: chickenMeatFishImg,
    status: "Active",
    description: "Hygienically cut fresh antibiotic-free chicken, mutton, and sea fish.",
  },
  {
    id: "CAT-13",
    name: "Organic & Healthy Living",
    slug: "organic-healthy",
    image: organicHealthyImg,
    status: "Active",
    description: "Certified chemical-free organic groceries, honey, and chia seeds.",
  },
  {
    id: "CAT-14",
    name: "Baby Care Essentials",
    slug: "baby-care",
    image: babyCareImg,
    status: "Active",
    description: "Gentle baby diapers, nourishing lotions, feeding bottles, and wipes.",
  },
  {
    id: "CAT-15",
    name: "Pharma & Wellness",
    slug: "pharma-wellness",
    image: pharmaWellnessImg,
    status: "Active",
    description: "First aid kits, health supplements, ayurvedic care, and pain balms.",
  },
  {
    id: "CAT-16",
    name: "Cleaning & Household",
    slug: "cleaning-essentials",
    image: cleaningEssentialsImg,
    status: "Active",
    description: "Dishwashing gels, detergent powders, floor cleaners, and fresheners.",
  },
  {
    id: "CAT-17",
    name: "Home & Office Stationery",
    slug: "home-office",
    image: homeOfficeImg,
    status: "Inactive",
    description: "Desk accessories, notebooks, gel pens, batteries, and adhesives.",
  },
  {
    id: "CAT-18",
    name: "Personal Care & Grooming",
    slug: "personal-care",
    image: personalCareImg,
    status: "Active",
    description: "Fragrant body washes, shampoos, oral care, and skin moisturizers.",
  },
  {
    id: "CAT-19",
    name: "Pet Care Supplies",
    slug: "pet-care",
    image: petCareImg,
    status: "Inactive",
    description: "Nutritious dog food, kitten treats, shampoos, and chew toys.",
  },
  {
    id: "CAT-20",
    name: "Paan Corner",
    slug: "paan-corner",
    image: paanCornerImg,
    status: "Active",
    description: "Mouth fresheners, traditional digestive churan, and mint lozenges.",
  },
];

export default function CategoriesManagement() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "table"
  const [toastMessage, setToastMessage] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    image: dairyBreadEggsImg,
    status: "Active",
    description: "",
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Filter logic
  const filteredCategories = categories.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || cat.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Category Metrics Only (No products, items, or sales)
  const totalCategoriesCount = categories.length;
  const activeCount = categories.filter((c) => c.status === "Active").length;
  const inactiveCount = totalCategoriesCount - activeCount;

  const categoryStats = [
    {
      id: "total_categories",
      title: "Total Categories",
      value: `${totalCategoriesCount} Categories`,
      icon: Shapes,
      iconColor: "text-white bg-gradient-to-tr from-[#049669] to-[#10B981] border-emerald-400/40 shadow-md shadow-emerald-600/25",
      bgGradient: "from-emerald-50/90 via-white/85 to-white/60",
      accentBorder: "border-emerald-200/80 hover:border-emerald-400 hover:shadow-[0_16px_36px_rgba(4,150,105,0.15)]",
      glowColor: "bg-emerald-400/25",
      valueColor: "text-[#049669]",
    },
    {
      id: "active_categories",
      title: "Active Categories",
      value: `${activeCount} Live`,
      icon: CheckCircle2,
      iconColor: "text-white bg-gradient-to-tr from-[#059669] to-teal-500 border-teal-400/40 shadow-md shadow-teal-600/25",
      bgGradient: "from-teal-50/90 via-white/85 to-white/60",
      accentBorder: "border-teal-200/80 hover:border-teal-400 hover:shadow-[0_16px_36px_rgba(13,148,136,0.15)]",
      glowColor: "bg-teal-400/25",
      valueColor: "text-[#1E1B4B]",
    },
    {
      id: "inactive_categories",
      title: "Inactive / Hidden",
      value: `${inactiveCount} Hidden`,
      valueColor: inactiveCount > 0 ? "text-amber-600" : "text-slate-700",
      icon: EyeOff,
      iconColor: "text-white bg-gradient-to-tr from-amber-500 to-amber-400 border-amber-300 shadow-md shadow-amber-500/25",
      bgGradient: "from-amber-50/90 via-white/85 to-white/60",
      accentBorder: "border-amber-200/80 hover:border-amber-400 hover:shadow-[0_16px_36px_rgba(245,158,11,0.15)]",
      glowColor: "bg-amber-400/25",
    },
    {
      id: "catalog_type",
      title: "Catalog Type",
      value: "Packshots",
      icon: Layers,
      iconColor: "text-white bg-gradient-to-tr from-[#049669] via-emerald-600 to-teal-600 border-emerald-400/40 shadow-md shadow-emerald-600/25",
      bgGradient: "from-emerald-50/70 via-white/85 to-white/60",
      accentBorder: "border-emerald-200/80 hover:border-emerald-400 hover:shadow-[0_16px_36px_rgba(4,150,105,0.15)]",
      glowColor: "bg-emerald-400/20",
      valueColor: "text-[#1E1B4B]",
    },
  ];

  // Open Modal
  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      image: dairyBreadEggsImg,
      status: "Active",
      description: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      image: cat.image,
      status: cat.status,
      description: cat.description || "",
    });
    setIsModalOpen(true);
  };

  // Submit Modal
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id ? { ...c, ...formData } : c
        )
      );
      showToast(`Category "${formData.name}" updated successfully!`);
    } else {
      const newCategory = {
        id: `CAT-${Date.now().toString().slice(-4)}`,
        ...formData,
      };
      setCategories([newCategory, ...categories]);
      showToast(`Category "${formData.name}" added successfully!`);
    }
    setIsModalOpen(false);
  };

  // Toggle Category Status (Active/Inactive)
  const handleToggleStatus = (id) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newStatus = c.status === "Active" ? "Inactive" : "Active";
          showToast(`"${c.name}" status changed to ${newStatus}`);
          return { ...c, status: newStatus };
        }
        return c;
      })
    );
  };

  // Delete Category
  const handleDeleteCategory = (id, name) => {
    if (window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setSelectedIds((prev) => prev.filter((item) => item !== id));
      showToast(`Category "${name}" deleted.`);
    }
  };

  // Bulk Selection & Delete Handlers
  const isAllSelected =
    filteredCategories.length > 0 &&
    filteredCategories.every((c) => selectedIds.includes(c.id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCategories.map((c) => c.id));
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
        `Are you sure you want to delete ${selectedIds.length} categories?`
      )
    ) {
      setCategories((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
      showToast(`${selectedIds.length} categories deleted successfully.`);
      setSelectedIds([]);
    }
  };

  return (
    <div className="h-screen w-full bg-white flex flex-col font-['Poppins',sans-serif] text-slate-800 relative overflow-hidden">
      {/* Background Ambient Glow Orbs for Glassy Backdrop Blur */}
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
        {/* Persistent Stationary Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Right Main Content */}
        <div className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto relative z-10">

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6   w-full mx-auto">
          {/* Welcome Banner in Frosted Glassy Emerald Green #049669 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#049669]/95 via-[#059669]/90 to-[#10B981]/85 backdrop-blur-2xl rounded-xl sm:rounded-2xl p-5 sm:p-7 text-white border border-white/20 shadow-[0_12px_40px_rgba(4,150,105,0.25)] relative overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-black/15" />

            {/* Glowing inner glass ambient blobs */}
            <div className="pointer-events-none absolute -right-12 -top-12 w-48 h-48 rounded-full bg-emerald-400/20 blur-2xl" />
            <div className="pointer-events-none absolute right-1/4 -bottom-10 w-44 h-44 rounded-full bg-teal-400/20 blur-2xl" />

            <div className="space-y-1 z-10 relative">
              <span className="text-xs uppercase font-extrabold text-emerald-100 tracking-wider">
                Store Catalog
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight drop-shadow-sm">
                Category Management
              </h1>
              <p className="text-xs sm:text-sm text-emerald-50 max-w-xl font-medium">
                Add, organize, and manage store categories.
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
                <span>Add Category</span>
              </button>
            </div>
          </div>

          {/* Metric Stats Cards Reusing Shared Cards Component */}
          <Cards stats={categoryStats} />

          {/* Search, Filter & View Controls */}
          <div className="bg-white/60 backdrop-blur-2xl rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-white/80 shadow-[0_8px_30px_rgba(4,150,105,0.06)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 relative overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search categories by name or slug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 bg-white/80 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#049669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
              />
            </div>

            {/* Status Filter & View Mode Toggle */}
            <div className="flex flex-wrap items-center gap-2.5">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-10 px-3 rounded-lg border border-slate-200 bg-white/80 text-xs font-medium text-slate-700 focus:border-[#049669] focus:ring-2 focus:ring-emerald-500/15 outline-none cursor-pointer"
              >
                <option value="All">All Categories ({categories.length})</option>
                <option value="Active">Active Only ({activeCount})</option>
                <option value="Inactive">Inactive ({inactiveCount})</option>
              </select>

              {/* View Toggle */}
              <div className="flex items-center rounded-lg border border-slate-200 bg-white/80 p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-emerald-50 text-[#049669] shadow-2xs font-bold"
                      : "text-slate-400 hover:text-slate-700"
                  }`}
                  aria-label="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-md transition cursor-pointer ${
                    viewMode === "table"
                      ? "bg-emerald-50 text-[#049669] shadow-2xs font-bold"
                      : "text-slate-400 hover:text-slate-700"
                  }`}
                  aria-label="Table View"
                >
                  <List className="w-4 h-4" />
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
                <span>Selected Categories</span>
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

          {/* Category Content: Grid View */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {filteredCategories.map((cat) => {
                const isSelected = selectedIds.includes(cat.id);
                return (
                  <div
                    key={cat.id}
                    className={`backdrop-blur-2xl rounded-2xl p-4 sm:p-5 border shadow-[0_8px_30px_rgba(4,150,105,0.06)] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(4,150,105,0.12)] transition-all duration-300 relative overflow-hidden flex flex-col justify-between group ${
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
                      {/* Header: Checkbox, Packshot & Status */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-start gap-2.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(cat.id)}
                            className="w-4 h-4 mt-1 rounded text-[#049669] focus:ring-emerald-500 accent-[#049669] cursor-pointer"
                            aria-label={`Select category ${cat.name}`}
                          />
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-50/80 to-slate-50 border border-emerald-100/70 p-2 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform overflow-hidden">
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs ${
                            cat.status === "Active"
                              ? "bg-emerald-50 text-[#049669] border-emerald-200/80"
                              : "bg-slate-50 text-slate-500 border-slate-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              cat.status === "Active" ? "bg-[#049669]" : "bg-slate-400"
                            }`}
                          />
                          {cat.status}
                        </span>
                      </div>

                      {/* Category Title & Slug */}
                      <h3 className="text-sm sm:text-base font-black text-[#1E1B4B] tracking-tight group-hover:text-[#049669] transition-colors line-clamp-1">
                        {cat.name}
                      </h3>
                      <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                        /{cat.slug}
                      </span>

                      {/* Description */}
                      <p className="text-xs text-slate-500 font-medium mt-2 line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>

                    {/* Footer Actions Only (No products, items, or sales) */}
                    <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-400 font-medium">
                        Status: <strong className={cat.status === "Active" ? "text-[#049669]" : "text-slate-500"}>{cat.status}</strong>
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(cat.id)}
                          title={cat.status === "Active" ? "Mark Inactive" : "Mark Active"}
                          className="w-8 h-8 rounded-lg border border-slate-200 bg-white/90 text-slate-600 hover:text-amber-600 hover:bg-amber-50 flex items-center justify-center transition cursor-pointer shadow-2xs"
                        >
                          {cat.status === "Active" ? (
                            <Eye className="w-3.5 h-3.5" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(cat)}
                          title="Edit Category"
                          className="w-8 h-8 rounded-lg border border-slate-200 bg-white/90 text-slate-600 hover:text-[#049669] hover:bg-emerald-50 flex items-center justify-center transition cursor-pointer shadow-2xs"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat.id, cat.name)}
                          title="Delete Category"
                          className="w-8 h-8 rounded-lg border border-slate-200 bg-white/90 text-slate-600 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition cursor-pointer shadow-2xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Category Content: Table View */
            <div className="bg-white/60 backdrop-blur-2xl rounded-xl sm:rounded-2xl border border-white/80 shadow-[0_8px_30px_rgba(4,150,105,0.06)] overflow-hidden relative">
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
                          aria-label="Select all categories"
                        />
                      </th>
                      <th className="py-3.5 px-4 sm:px-6">Category</th>
                      <th className="py-3.5 px-4">Slug Identifier</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                    {filteredCategories.map((cat) => {
                      const isSelected = selectedIds.includes(cat.id);
                      return (
                        <tr
                          key={cat.id}
                          className={`transition-colors group ${
                            isSelected
                              ? "bg-emerald-50/60"
                              : "hover:bg-emerald-50/30"
                          }`}
                        >
                          <td className="py-3.5 px-4 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelect(cat.id)}
                              className="w-4 h-4 rounded text-[#049669] focus:ring-emerald-500 accent-[#049669] cursor-pointer"
                              aria-label={`Select category ${cat.name}`}
                            />
                          </td>

                          <td className="py-3.5 px-4 sm:px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-lg bg-emerald-50/80 border border-emerald-100/70 p-1 flex items-center justify-center shrink-0 shadow-2xs">
                                <img
                                  src={cat.image}
                                  alt={cat.name}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div>
                                <h4 className="font-bold text-[#1E1B4B] group-hover:text-[#049669] transition-colors">
                                  {cat.name}
                                </h4>
                                <p className="text-[11px] text-slate-400 font-medium line-clamp-1 max-w-sm">
                                  {cat.description}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-xs font-mono text-slate-500">
                            /{cat.slug}
                          </td>

                          <td className="py-3.5 px-4">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(cat.id)}
                              className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold border transition cursor-pointer ${
                                cat.status === "Active"
                                  ? "bg-emerald-50 text-[#049669] border-emerald-200/80 hover:bg-emerald-100"
                                  : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                              }`}
                            >
                              {cat.status}
                            </button>
                          </td>

                          <td className="py-3.5 px-4 sm:px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(cat)}
                                title="Edit Category"
                                className="p-1.5 rounded-lg border border-slate-200 hover:text-[#049669] hover:bg-emerald-50 text-slate-500 transition cursor-pointer shadow-2xs"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteCategory(cat.id, cat.name)}
                                title="Delete Category"
                                className="p-1.5 rounded-lg border border-slate-200 hover:text-rose-600 hover:bg-rose-50 text-slate-500 transition cursor-pointer shadow-2xs"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {filteredCategories.length === 0 && (
            <div className="text-center py-16 bg-white/60 backdrop-blur-2xl rounded-2xl border border-white/80 p-8 shadow-sm">
              <Shapes className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">No categories found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Try searching with a different keyword or add a new category.
              </p>
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-[#049669] via-[#059669] to-[#10B981] text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition cursor-pointer inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>
          )}
        </main>
      </div>
    </div>

      {/* ================= ADD / EDIT CATEGORY MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
          />

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-lg font-black text-[#1E1B4B]">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Enter category details to organize your store catalog.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dairy, Bread & Eggs"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-|-$/g, "");
                    setFormData({ ...formData, name, slug: editingCategory ? formData.slug : slug });
                  }}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#049669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Slug Identifier *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. dairy-bread-eggs"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#049669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 focus:border-[#049669] focus:ring-2 focus:ring-emerald-500/15 outline-none cursor-pointer"
                  >
                    <option value="Active">Active (Visible)</option>
                    <option value="Inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Packshot / Icon Preset
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200/80 p-1 flex items-center justify-center shrink-0">
                    <img
                      src={formData.image}
                      alt="Selected category"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <select
                    onChange={(e) => {
                      const selectedVal = e.target.value;
                      const imageMap = {
                        "dairy-bread-eggs": dairyBreadEggsImg,
                        "cold-drinks-juices": coldDrinksJuicesImg,
                        "snacks-munchies": snacksMunchiesImg,
                        "fruits-vegetables": fruitsVegetablesImg,
                        "atta-rice-dal": attaRiceDalImg,
                        "bakery-biscuits": bakeryBiscuitsImg,
                        "breakfast-instant-food": breakfastInstantFoodImg,
                        "sweet-tooth": sweetToothImg,
                        "tea-coffee-drinks": teaCoffeeDrinksImg,
                        "masala-oil-more": masalaOilMoreImg,
                        "sauces-spreads": saucesSpreadsImg,
                        "chicken-meat-fish": chickenMeatFishImg,
                        "organic-healthy": organicHealthyImg,
                        "baby-care": babyCareImg,
                        "pharma-wellness": pharmaWellnessImg,
                        "cleaning-essentials": cleaningEssentialsImg,
                        "home-office": homeOfficeImg,
                        "personal-care": personalCareImg,
                        "pet-care": petCareImg,
                        "paan-corner": paanCornerImg,
                      };
                      if (imageMap[selectedVal]) {
                        setFormData({ ...formData, image: imageMap[selectedVal] });
                      }
                    }}
                    className="flex-1 h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 focus:border-[#049669] focus:ring-2 focus:ring-emerald-500/15 outline-none cursor-pointer"
                  >
                    <option value="dairy-bread-eggs">Dairy, Bread &amp; Eggs</option>
                    <option value="cold-drinks-juices">Cold Drinks &amp; Juices</option>
                    <option value="snacks-munchies">Snacks &amp; Munchies</option>
                    <option value="fruits-vegetables">Fruits &amp; Vegetables</option>
                    <option value="atta-rice-dal">Atta, Rice &amp; Dal</option>
                    <option value="bakery-biscuits">Bakery &amp; Biscuits</option>
                    <option value="breakfast-instant-food">Breakfast &amp; Instant Food</option>
                    <option value="sweet-tooth">Sweet Tooth</option>
                    <option value="tea-coffee-drinks">Tea, Coffee &amp; Drinks</option>
                    <option value="masala-oil-more">Masala, Oil &amp; More</option>
                    <option value="sauces-spreads">Sauces &amp; Spreads</option>
                    <option value="chicken-meat-fish">Chicken, Meat &amp; Fish</option>
                    <option value="organic-healthy">Organic &amp; Healthy</option>
                    <option value="baby-care">Baby Care</option>
                    <option value="pharma-wellness">Pharma &amp; Wellness</option>
                    <option value="cleaning-essentials">Cleaning Essentials</option>
                    <option value="home-office">Home &amp; Office</option>
                    <option value="personal-care">Personal Care</option>
                    <option value="pet-care">Pet Care</option>
                    <option value="paan-corner">Paan Corner</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Short description of this category for store customers..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#049669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
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
                  {editingCategory ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
