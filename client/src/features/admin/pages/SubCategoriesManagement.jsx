import React, { useState, useEffect, useRef } from "react";
import { adminService, categoryService, getUploadUrl } from "../../../services";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Cards from "../components/Cards";
import bannerCategoriesImg from "../../../assets/banner-categories-3d.png";
import dairyBreadEggsImg from "../../../assets/category/dairy-bread-eggs.png";
import coldDrinksJuicesImg from "../../../assets/category/cold-drinks-juices.png";
import {
  FolderTree,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  ChevronDown,
  Layers,
  Sparkles,
  ArrowUpDown,
  RefreshCw,
  Upload,
  Image as ImageIcon,
  Tag,
  Building2,
  X,
  Loader2,
} from "lucide-react";

export default function SubCategoriesManagement() {
  const [subCategories, setSubCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedParentCategory, setSelectedParentCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "table"
  const [toastMessage, setToastMessage] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  // Parallax Scroll State
  const scrollContainerRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollY(container.scrollTop);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3500);
  };

  // Fetch Parent Categories & Sub-Categories from Database
  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch parent categories
      try {
        const catRes = await categoryService.getAllCategories();
        if (catRes && Array.isArray(catRes.categories)) {
          setParentCategories(catRes.categories);
        }
      } catch (catErr) {
        console.error("Failed to load parent categories:", catErr);
      }

      // Fetch subcategories
      const res = await adminService.getAllSubcategories();
      if (res && Array.isArray(res.subCategories)) {
        setSubCategories(res.subCategories);
      }
    } catch (err) {
      console.error("Failed to load subcategories from DB:", err);
      showToast("Error loading subcategories from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Modal & Image Upload State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    image: "",
    isActive: true,
    description: "",
  });

  const handleOpenAddModal = () => {
    setEditingSubCategory(null);
    setImageFile(null);
    setImagePreview("");
    setFormData({
      name: "",
      categoryId: parentCategories[0]?.id ? String(parentCategories[0].id) : "",
      image: "",
      isActive: true,
      description: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sub) => {
    setEditingSubCategory(sub);
    setImageFile(null);
    setImagePreview(sub.image ? getUploadUrl(sub.image) : "");
    setFormData({
      name: sub.name || "",
      categoryId: sub.categoryId ? String(sub.categoryId) : (sub.category?.id ? String(sub.category.id) : ""),
      image: sub.image || "",
      isActive: sub.isActive !== undefined ? Boolean(sub.isActive) : true,
      description: sub.description || "",
    });
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (uploadEv) => {
        setImagePreview(uploadEv.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData((prev) => ({ ...prev, image: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Sub-Category name is required.");
      return;
    }
    if (!formData.categoryId) {
      showToast("Please select a parent category.");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("name", formData.name.trim());
      payload.append("categoryId", formData.categoryId);
      payload.append("isActive", String(formData.isActive));
      payload.append("description", formData.description ? formData.description.trim() : "");

      if (imageFile) {
        payload.append("image", imageFile);
      } else if (formData.image) {
        payload.append("image", formData.image);
      }

      if (editingSubCategory) {
        await adminService.updateSubcategory(editingSubCategory.id, payload);
        showToast(`Sub-Category "${formData.name}" updated successfully!`);
      } else {
        await adminService.createSubcategory(payload);
        showToast(`Sub-Category "${formData.name}" created successfully in Database!`);
      }

      setIsModalOpen(false);
      setImageFile(null);
      setImagePreview("");
      await fetchData();
    } catch (err) {
      console.error("Save SubCategory failed:", err);
      showToast(err.message || "Failed to save sub-category. Please try again.");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await adminService.updateSubcategory(id, { isActive: newStatus });
      setSubCategories((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isActive: newStatus } : s))
      );
      showToast(`Sub-category status updated to ${newStatus ? "Active" : "Inactive"}`);
    } catch (e) {
      showToast("Failed to update status.");
    }
  };

  const handleDeleteSubCategory = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete sub-category "${name}"?`)) {
      try {
        await adminService.deleteSubcategory(id);
        setSubCategories((prev) => prev.filter((s) => s.id !== id));
        setSelectedIds((prev) => prev.filter((item) => item !== id));
        showToast(`Sub-Category "${name}" deleted from Database.`);
      } catch (e) {
        showToast(e.message || "Failed to delete sub-category.");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} sub-categories?`)) {
      for (const id of selectedIds) {
        try {
          await adminService.deleteSubcategory(id);
        } catch (e) {}
      }
      setSubCategories((prev) => prev.filter((s) => !selectedIds.includes(s.id)));
      showToast(`${selectedIds.length} sub-categories deleted from Database.`);
      setSelectedIds([]);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredSubCategories.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter Sub-Categories
  const filteredSubCategories = subCategories.filter((sub) => {
    const q = searchQuery.toLowerCase().trim();
    const parentName = sub.category?.name || "";
    const matchesSearch =
      !q ||
      sub.name.toLowerCase().includes(q) ||
      parentName.toLowerCase().includes(q) ||
      (sub.description && sub.description.toLowerCase().includes(q));

    const matchesParent =
      selectedParentCategory === "All" ||
      String(sub.categoryId) === String(selectedParentCategory) ||
      parentName === selectedParentCategory;

    const matchesStatus =
      selectedStatus === "All" ||
      (selectedStatus === "Active" && sub.isActive) ||
      (selectedStatus === "Inactive" && !sub.isActive);

    return matchesSearch && matchesParent && matchesStatus;
  });

  // Dynamic Metrics for Cards
  const totalCount = subCategories.length;
  const activeCount = subCategories.filter((s) => s.isActive).length;
  const inactiveCount = totalCount - activeCount;
  const distinctParentsCount = new Set(subCategories.map((s) => s.categoryId)).size;

  const subCategoryStats = [
    {
      id: "total-subs",
      title: "Total Sub-Categories",
      value: String(totalCount),
      change: `${activeCount} currently active`,
      isPositive: true,
      icon: FolderTree,
      iconColor: "text-white bg-gradient-to-tr from-[#049669] to-[#10B981] border-emerald-400/40 shadow-md shadow-emerald-600/25",
      bgGradient: "from-emerald-50/90 via-white/85 to-white/60",
      accentBorder: "border-emerald-200/80 hover:border-emerald-400 hover:shadow-[0_16px_36px_rgba(4,150,105,0.15)]",
      glowColor: "bg-emerald-400/25",
      valueColor: "text-[#049669]",
    },
    {
      id: "active-subs",
      title: "Active Sub-Categories",
      value: `${activeCount} Live`,
      change: "Visible in customer store",
      isPositive: true,
      icon: CheckCircle2,
      iconColor: "text-white bg-gradient-to-tr from-[#059669] to-teal-500 border-teal-400/40 shadow-md shadow-teal-600/25",
      bgGradient: "from-teal-50/90 via-white/85 to-white/60",
      accentBorder: "border-teal-200/80 hover:border-teal-400 hover:shadow-[0_16px_36px_rgba(13,148,136,0.15)]",
      glowColor: "bg-teal-400/25",
      valueColor: "text-[#1E1B4B]",
    },
    {
      id: "inactive-subs",
      title: "Inactive / Hidden",
      value: `${inactiveCount} Hidden`,
      change: "Temporarily disabled",
      isPositive: inactiveCount === 0,
      icon: EyeOff,
      iconColor: "text-white bg-gradient-to-tr from-amber-500 to-amber-400 border-amber-300 shadow-md shadow-amber-500/25",
      bgGradient: "from-amber-50/90 via-white/85 to-white/60",
      accentBorder: "border-amber-200/80 hover:border-amber-400 hover:shadow-[0_16px_36px_rgba(245,158,11,0.15)]",
      glowColor: "bg-amber-400/25",
      valueColor: "text-amber-600",
    },
    {
      id: "parent-cats",
      title: "Parent Categories",
      value: `${distinctParentsCount} Linked`,
      change: `${parentCategories.length} total categories`,
      isPositive: true,
      icon: Layers,
      iconColor: "text-white bg-gradient-to-tr from-[#049669] via-emerald-600 to-teal-600 border-emerald-400/40 shadow-md shadow-emerald-600/25",
      bgGradient: "from-emerald-50/70 via-white/85 to-white/60",
      accentBorder: "border-emerald-200/80 hover:border-emerald-400 hover:shadow-[0_16px_36px_rgba(4,150,105,0.15)]",
      glowColor: "bg-emerald-400/20",
      valueColor: "text-[#1E1B4B]",
    },
  ];

  return (
    <div className="h-screen w-full bg-white flex flex-col font-['Poppins',sans-serif] text-slate-800 relative overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#1E1B4B] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500/30 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Background Ambient Glow Orbs */}
      <div
        style={{ transform: `translateY(${scrollY * 0.12}px)` }}
        className="pointer-events-none absolute -left-20 top-0 w-[450px] h-[450px] rounded-full bg-gradient-to-br from-emerald-400/15 to-teal-300/10 blur-3xl z-0 transition-transform duration-300 ease-out"
      />
      <div
        style={{ transform: `translateY(${scrollY * -0.08}px)` }}
        className="pointer-events-none absolute right-10 top-20 w-[420px] h-[420px] rounded-full bg-gradient-to-bl from-teal-400/15 to-emerald-300/10 blur-3xl z-0 transition-transform duration-300 ease-out"
      />
      <div
        style={{ transform: `translateY(${scrollY * 0.06}px)` }}
        className="pointer-events-none absolute left-1/3 bottom-10 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-emerald-300/15 to-teal-200/10 blur-3xl z-0 transition-transform duration-300 ease-out"
      />

      {/* Top Navbar */}
      <Navbar onToggleSidebar={() => setIsSidebarOpen(true)} />

      {/* Body Area */}
      <div className="flex-1 flex min-h-0 relative z-10 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div
          ref={scrollContainerRef}
          className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto relative z-10 scroll-smooth [scrollbar-gutter:stable]"
        >
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 w-full mx-auto">
            {/* Header Banner */}
            <div className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 min-h-[175px] sm:min-h-[190px] lg:min-h-[200px] flex flex-col justify-between overflow-hidden shadow-[0_16px_40px_rgba(4,150,105,0.22)] border border-emerald-400/30 group">
              <svg
                className="pointer-events-none absolute inset-0 w-full h-full object-cover"
                viewBox="0 0 1024 200"
                preserveAspectRatio="none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="subcatBannerBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1B744A" />
                    <stop offset="40%" stopColor="#228C52" />
                    <stop offset="100%" stopColor="#2CA85C" />
                  </linearGradient>
                  <linearGradient id="subcatWaveHighlight" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#38C260" stopOpacity="0.5" />
                    <stop offset="60%" stopColor="#259452" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <rect width="1024" height="200" fill="url(#subcatBannerBgGrad)" />
                <path
                  d="M0,130 C200,80 340,165 520,110 C700,55 860,140 1024,85 L1024,200 L0,200 Z"
                  fill="url(#subcatWaveHighlight)"
                />
              </svg>

              {/* 3D Illustration */}
              <div className="pointer-events-none absolute right-4 sm:right-8 lg:right-12 bottom-1 sm:bottom-2 z-10 w-44 sm:w-56 md:w-64 lg:w-72 xl:w-80 select-none">
                <img
                  src={bannerCategoriesImg}
                  alt="Sub-Categories 3D Illustration"
                  className="w-full h-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.35)] transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>

              {/* Banner Text Content */}
              <div className="relative z-10 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-emerald-100 text-[11px] font-extrabold uppercase tracking-wider mb-2 sm:mb-3 shadow-inner">
                  <FolderTree className="w-3.5 h-3.5 text-emerald-300" />
                  <span>STORE CATALOG — HIERARCHY</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight drop-shadow-sm leading-tight">
                  Sub-Categories Management
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-emerald-50/90 font-normal leading-relaxed max-w-lg">
                  Organize sub-departments, map them to parent categories, and maintain catalog precision.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="relative z-10 mt-4 sm:mt-5 flex flex-wrap items-center gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white hover:bg-emerald-50 text-[#049669] font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Add Sub-Category</span>
                </button>

                <button
                  type="button"
                  onClick={fetchData}
                  title="Reload from Database"
                  className="inline-flex items-center gap-2 px-3.5 py-2 sm:py-2.5 rounded-full bg-emerald-900/40 hover:bg-emerald-900/60 backdrop-blur-md border border-emerald-300/30 text-emerald-100 text-xs font-semibold cursor-pointer transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                  <span>Refresh DB</span>
                </button>
              </div>
            </div>

            {/* 4 Cards Metrics Section */}
            <Cards stats={subCategoryStats} />

            {/* Controls Bar: Search, Filters, View Toggle */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3.5">
              {/* Search Bar */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search sub-categories by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#049669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Filters & View Modes */}
              <div className="w-full md:w-auto flex flex-wrap items-center justify-between md:justify-end gap-2.5">
                {/* Parent Category Filter Dropdown */}
                <div className="relative">
                  <select
                    value={selectedParentCategory}
                    onChange={(e) => setSelectedParentCategory(e.target.value)}
                    className="h-10 pl-3.5 pr-8 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 focus:border-[#049669] focus:ring-2 focus:ring-emerald-500/15 outline-none cursor-pointer appearance-none"
                  >
                    <option value="All">All Categories ({parentCategories.length})</option>
                    {parentCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="h-10 pl-3.5 pr-8 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 focus:border-[#049669] focus:ring-2 focus:ring-emerald-500/15 outline-none cursor-pointer appearance-none"
                  >
                    <option value="All">All Status</option>
                    <option value="Active">Active Only</option>
                    <option value="Inactive">Inactive Only</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                </div>

                {/* View Mode Toggle */}
                <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/80">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      viewMode === "grid"
                        ? "bg-white text-emerald-700 shadow-2xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                    title="Grid View"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      viewMode === "table"
                        ? "bg-white text-emerald-700 shadow-2xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                    title="Table View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bulk Selection Bar */}
            {selectedIds.length > 0 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs font-bold text-emerald-900 animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{selectedIds.length} sub-categories selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBulkDelete}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Selected</span>
                  </button>
                  <button
                    onClick={() => setSelectedIds([])}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs transition cursor-pointer"
                  >
                    Deselect All
                  </button>
                </div>
              </div>
            )}

            {/* Main Listing View (Grid vs Table) */}
            {loading && subCategories.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                <p className="text-sm font-semibold">Loading sub-categories from database...</p>
              </div>
            ) : filteredSubCategories.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-12 text-center border border-slate-200/80">
                <FolderTree className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No Sub-Categories Found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {searchQuery || selectedParentCategory !== "All" || selectedStatus !== "All"
                    ? "Try adjusting your search or filters to see matching sub-categories."
                    : "Get started by adding your first sub-category to organize your store."}
                </p>
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#049669] to-[#10B981] text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Create Sub-Category</span>
                </button>
              </div>
            ) : viewMode === "grid" ? (
              /* GRID VIEW */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {filteredSubCategories.map((sub) => {
                  const isSelected = selectedIds.includes(sub.id);
                  const parentName = sub.category?.name || "Uncategorized";
                  const imgUrl = sub.image ? getUploadUrl(sub.image) : dairyBreadEggsImg;

                  return (
                    <div
                      key={sub.id}
                      className={`relative rounded-2xl bg-white border p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-lg group ${
                        isSelected
                          ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-md shadow-emerald-600/10"
                          : "border-slate-200/80 hover:border-emerald-300"
                      }`}
                    >
                      <div>
                        {/* Card Header: Checkbox & Status */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectOne(sub.id)}
                            className="w-4 h-4 rounded text-[#049669] focus:ring-emerald-500 accent-[#049669] cursor-pointer"
                          />
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(sub.id, sub.isActive)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition cursor-pointer ${
                              sub.isActive
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                sub.isActive ? "bg-emerald-500" : "bg-slate-400"
                              }`}
                            />
                            <span>{sub.isActive ? "Active" : "Inactive"}</span>
                          </button>
                        </div>

                        {/* Image & Title */}
                        <div className="flex items-center gap-3.5 my-3.5">
                          <div className="w-16 h-16 rounded-xl bg-emerald-50/50 border border-emerald-100/70 p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs group-hover:scale-105 transition-transform">
                            <img
                              src={imgUrl}
                              alt={sub.name}
                              onError={(e) => {
                                e.target.src = dairyBreadEggsImg;
                              }}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                              {sub.name}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/70 text-[10px] font-bold truncate max-w-[170px]">
                                {parentName}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {sub.description || "No description provided for this sub-category."}
                        </p>
                      </div>

                      {/* Card Actions */}
                      <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] font-mono text-slate-400">
                          ID: #{sub.id}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(sub)}
                            className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 flex items-center justify-center transition cursor-pointer shadow-2xs"
                            title="Edit Sub-Category"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSubCategory(sub.id, sub.name)}
                            className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-300 flex items-center justify-center transition cursor-pointer shadow-2xs"
                            title="Delete Sub-Category"
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
              /* TABLE VIEW */
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-bold tracking-wider">
                      <tr>
                        <th className="py-3 px-4 text-center w-12">
                          <input
                            type="checkbox"
                            checked={
                              filteredSubCategories.length > 0 &&
                              selectedIds.length === filteredSubCategories.length
                            }
                            onChange={handleSelectAll}
                            className="w-4 h-4 rounded text-[#049669] focus:ring-emerald-500 accent-[#049669] cursor-pointer"
                          />
                        </th>
                        <th className="py-3 px-4">Sub-Category</th>
                        <th className="py-3 px-4">Parent Category</th>
                        <th className="py-3 px-4">Description</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredSubCategories.map((sub) => {
                        const isSelected = selectedIds.includes(sub.id);
                        const parentName = sub.category?.name || "Uncategorized";
                        const imgUrl = sub.image ? getUploadUrl(sub.image) : dairyBreadEggsImg;

                        return (
                          <tr
                            key={sub.id}
                            className={`transition-colors hover:bg-emerald-50/30 ${
                              isSelected ? "bg-emerald-50/60" : ""
                            }`}
                          >
                            <td className="py-3 px-4 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleSelectOne(sub.id)}
                                className="w-4 h-4 rounded text-[#049669] focus:ring-emerald-500 accent-[#049669] cursor-pointer"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-emerald-50/50 border border-emerald-100 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                                  <img
                                    src={imgUrl}
                                    alt={sub.name}
                                    onError={(e) => {
                                      e.target.src = dairyBreadEggsImg;
                                    }}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <div>
                                  <span className="font-bold text-slate-900 block">
                                    {sub.name}
                                  </span>
                                  <span className="text-[11px] font-mono text-slate-400">
                                    ID: #{sub.id}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/70 text-xs font-bold">
                                {parentName}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-500 max-w-xs truncate text-xs">
                              {sub.description || "—"}
                            </td>
                            <td className="py-3 px-4">
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(sub.id, sub.isActive)}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border transition cursor-pointer ${
                                  sub.isActive
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                    : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    sub.isActive ? "bg-emerald-500" : "bg-slate-400"
                                  }`}
                                />
                                <span>{sub.isActive ? "Active" : "Inactive"}</span>
                              </button>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditModal(sub)}
                                  className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 flex items-center justify-center transition cursor-pointer"
                                  title="Edit"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSubCategory(sub.id, sub.name)}
                                  className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-300 flex items-center justify-center transition cursor-pointer"
                                  title="Delete"
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
          </main>
        </div>
      </div>

      {/* Add / Edit Sub-Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
          />

          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 z-10 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-[#049669] flex items-center justify-center">
                  <FolderTree className="w-5 h-5 stroke-[2.3]" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                    {editingSubCategory ? "Edit Sub-Category" : "Add New Sub-Category"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Enter sub-category details to organize your store catalog.
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

            <form onSubmit={handleFormSubmit} className="space-y-4 pt-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sub-Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Milk & Cream, Fruit Juices, etc."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#049669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                />
              </div>

              {/* Parent Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Parent Category *
                  </label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:border-[#049669] focus:ring-2 focus:ring-emerald-500/15 outline-none cursor-pointer"
                  >
                    <option value="" disabled>Select Parent Category</option>
                    {parentCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Status *
                  </label>
                  <select
                    value={formData.isActive ? "true" : "false"}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "true" })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:border-[#049669] focus:ring-2 focus:ring-emerald-500/15 outline-none cursor-pointer"
                  >
                    <option value="true">Active (Visible)</option>
                    <option value="false">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Sub-Category Image / Icon
                </label>
                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/40">
                  {imagePreview ? (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 bg-white shrink-0 group shadow-xs">
                      <img
                        src={imagePreview}
                        alt="Subcategory Preview"
                        className="w-full h-full object-contain p-1"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute inset-0 bg-slate-900/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Remove Image"
                      >
                        <Trash2 className="w-4 h-4 text-rose-300" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl border border-slate-200 bg-white flex flex-col items-center justify-center text-slate-400 shrink-0">
                      <ImageIcon className="w-6 h-6 text-emerald-600 stroke-[2]" />
                      <span className="text-[9px] font-semibold mt-1">No Image</span>
                    </div>
                  )}

                  <div className="flex-1">
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 text-xs font-bold text-slate-700 hover:text-emerald-700 shadow-2xs hover:shadow-xs transition cursor-pointer">
                      <Upload className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{imagePreview ? "Change Image" : "Upload Image"}</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="text-[11px] text-slate-500 mt-1.5 leading-tight">
                      PNG or JPG packshot icon. Clear transparent icon recommended.
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Enter a brief description of this sub-category..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#049669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition resize-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#049669] via-[#059669] to-[#10B981] hover:from-[#03704f] hover:to-[#049669] text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition cursor-pointer"
                >
                  {editingSubCategory ? "Save Changes" : "Create Sub-Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

