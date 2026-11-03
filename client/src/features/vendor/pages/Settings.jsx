import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  User,
  Store,
  Mail,
  Phone,
  MapPin,
  Upload,
  CheckCircle2,
  Save,
  Building2,
  BadgeCheck,
  Camera,
  RefreshCw,
} from "lucide-react";

export default function Settings() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("store"); // "profile" | "store"
  const [toastMessage, setToastMessage] = useState("");

  const logoFileInputRef = useRef(null);

  // Profile Settings State
  const [profileData, setProfileData] = useState({
    name: "Vendor Admin",
    email: "vendor@shopmart.com",
    phone: "+91 98201 44521",
    designation: "Store Owner & Managing Partner",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&q=80",
  });

  // Store Settings State
  const [storeData, setStoreData] = useState({
    storeName: "Best Deals Superstore",
    storeSlug: "best-deals-superstore",
    tagline: "Fresh groceries & daily household essentials at wholesale prices.",
    logo:
      localStorage.getItem("vendor_sidebar_logo") ||
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=300&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1200&h=400&fit=crop&q=80",
    supportEmail: "support@bestdealstore.com",
    supportPhone: "+91 1800 200 4567",
    companyName: "Best Deals Retail Private Limited",
    gstin: "27AAACB2234P1Z3",
    pan: "AAACB2234P",
    businessType: "Supermarket / FMCG Retail",
    address: "Plot 42, Marol Industrial Area, Andheri East",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400059",
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3200);
  };

  const handleLogoFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      setStoreData((prev) => ({ ...prev, logo: dataUrl }));
      localStorage.setItem("vendor_sidebar_logo", dataUrl);
      window.dispatchEvent(new Event("vendor_logo_updated"));
      showToast("Sidebar logo uploaded successfully!");
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    showToast("Profile settings saved successfully!");
  };

  const handleSaveStore = (e) => {
    e.preventDefault();
    localStorage.setItem("vendor_sidebar_logo", storeData.logo);
    window.dispatchEvent(new Event("vendor_logo_updated"));
    showToast("Store settings & sidebar logo updated successfully!");
  };

  return (
    <div className="h-screen w-full bg-white flex flex-col font-['Poppins',sans-serif] text-slate-800 relative overflow-hidden">
      {/* Background Ambient Glow Orbs for Glassy Backdrop Blur */}
      <div className="pointer-events-none absolute -left-20 top-0 w-[450px] h-[450px] rounded-full bg-gradient-to-br from-emerald-400/15 to-teal-300/10 blur-3xl z-0" />
      <div className="pointer-events-none absolute right-10 top-20 w-[420px] h-[420px] rounded-full bg-gradient-to-bl from-teal-400/15 to-emerald-300/10 blur-3xl z-0" />
      <div className="pointer-events-none absolute left-1/3 bottom-10 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-emerald-300/15 to-teal-200/10 blur-3xl z-0" />
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
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto relative z-10">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6   w-full mx-auto pb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#049669]/95 via-[#059669]/90 to-[#10B981]/85 backdrop-blur-2xl rounded-xl sm:rounded-2xl p-5 sm:p-7 text-white border border-white/20 shadow-[0_12px_40px_rgba(4,150,105,0.25)] relative overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-black/15" />
            <div className="space-y-1 z-10 relative">
              <span className="text-xs uppercase font-extrabold text-emerald-100 tracking-wider">
                Configuration &amp; Controls
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight drop-shadow-sm">
                Settings
              </h1>
              <p className="text-xs sm:text-sm text-emerald-50 max-w-xl font-medium">
                Manage your personal vendor admin profile and configure your customer-facing store settings.
              </p>
            </div>
            <div className="z-10 self-start sm:self-auto flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/30 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              <span>Store is Live</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/70 backdrop-blur-xl p-1.5 rounded-xl sm:rounded-2xl border border-white/80 shadow-[0_4px_20px_rgba(4,150,105,0.06)] w-full sm:w-fit">
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeTab === "profile"
                  ? "bg-gradient-to-r from-[#049669] via-[#059669] to-[#10B981] text-white shadow-md shadow-emerald-600/25 scale-[1.02]"
                  : "text-slate-600 hover:text-[#049669] hover:bg-emerald-50/60"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile Setting</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("store")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeTab === "store"
                  ? "bg-gradient-to-r from-[#049669] via-[#059669] to-[#10B981] text-white shadow-md shadow-emerald-600/25 scale-[1.02]"
                  : "text-slate-600 hover:text-[#049669] hover:bg-emerald-50/60"
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Store Setting</span>
            </button>
          </div>
          {activeTab === "profile" && (
            <form onSubmit={handleSaveProfile} className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-white/70 backdrop-blur-2xl rounded-2xl border border-white/80 p-5 sm:p-7 shadow-[0_8px_30px_rgba(4,150,105,0.06)]">
                <h3 className="text-base font-black text-[#1E1B4B] mb-1 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#049669]" />
                  <span>Personal Profile &amp; Identity</span>
                </h3>
                <p className="text-xs text-slate-400 mb-6">
                  Manage your personal account credentials, contact information, and display avatar.
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-slate-100">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md group shrink-0">
                    <img
                      src={profileData.avatar}
                      alt={profileData.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer">
                      <Camera className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-[#1E1B4B]">
                      {profileData.name || "Vendor Admin"}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      JPG, PNG or WEBP. Max 2MB recommended.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() =>
                          setProfileData({
                            ...profileData,
                            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop&q=80",
                          })
                        }
                        className="px-3 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-bold text-slate-700 transition cursor-pointer shadow-2xs"
                      >
                        Change Photo
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setProfileData({
                            ...profileData,
                            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&q=80",
                          })
                        }
                        className="px-3 py-1 rounded-lg text-[11px] font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white/90 text-xs sm:text-sm font-semibold text-slate-800 focus:border-[#049669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                      placeholder="e.g. Rajesh Kumar"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({ ...profileData, email: e.target.value })
                        }
                        className="w-full h-11 pl-3.5 pr-24 rounded-xl border border-slate-200 bg-white/90 text-xs sm:text-sm font-semibold text-slate-800 focus:border-[#049669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                        placeholder="vendor@shopmart.com"
                      />
                      <span className="absolute right-2.5 top-2.5 px-2 py-0.5 rounded-md bg-emerald-50 text-[#049669] border border-emerald-200/80 text-[10px] font-bold inline-flex items-center gap-1">
                        <BadgeCheck className="w-3 h-3" />
                        Verified
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({ ...profileData, phone: e.target.value })
                      }
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white/90 text-xs sm:text-sm font-semibold text-slate-800 focus:border-[#049669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                      placeholder="+91 98201 44521"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Role / Designation
                    </label>
                    <input
                      type="text"
                      value={profileData.designation}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          designation: e.target.value,
                        })
                      }
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white/90 text-xs sm:text-sm font-semibold text-slate-800 focus:border-[#049669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                      placeholder="e.g. Store Owner & Super Admin"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setProfileData({
                      ...profileData,
                      name: "Vendor Admin",
                      phone: "+91 98201 44521",
                      designation: "Store Owner & Managing Partner",
                    })
                  }
                  className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition cursor-pointer"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#049669] via-[#059669] to-[#10B981] hover:from-[#03704f] hover:to-[#049669] text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/25 flex items-center gap-2 transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          )}
          {activeTab === "store" && (
            <form onSubmit={handleSaveStore} className="space-y-6 animate-in fade-in duration-200">
              {/* Store Identity & Banner Card */}
              <div className="bg-white/70 backdrop-blur-2xl rounded-2xl border border-white/80 p-5 sm:p-7 shadow-[0_8px_30px_rgba(4,150,105,0.06)]">
                <h3 className="text-base font-black text-[#1E1B4B] mb-1 flex items-center gap-2">
                  <Store className="w-5 h-5 text-[#049669]" />
                  <span>Store Branding &amp; Identity</span>
                </h3>
                <p className="text-xs text-slate-400 mb-6">
                  Manage how your store appears to customers on the marketplace and public links.
                </p>

                {/* Hidden File Input for logo upload */}
                <input
                  type="file"
                  ref={logoFileInputRef}
                  accept="image/*"
                  onChange={handleLogoFileUpload}
                  className="hidden"
                />

                {/* ================= DEDICATED SIDEBAR LOGO UPLOAD FIELD ================= */}
                <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100/80 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white border border-emerald-200/80 shadow-sm p-1.5 shrink-0 overflow-hidden relative flex items-center justify-center">
                        <img
                          src={storeData.logo}
                          alt="Sidebar Logo Preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-800 tracking-tight">
                            Sidebar &amp; Store Logo
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-[#049669] font-extrabold uppercase">
                            Active
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Yeh logo aapke vendor sidebar, top navbar, aur store branding par show hoga.
                        </p>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          Supports PNG, JPG, SVG, WebP (Square 1:1 ratio recommended).
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => logoFileInputRef.current?.click()}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#049669] via-[#059669] to-[#10B981] hover:from-[#03704f] hover:to-[#049669] text-white text-xs font-bold shadow-md shadow-emerald-600/25 flex items-center gap-1.5 transition cursor-pointer active:scale-95"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Logo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const defaultLogo = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=300&fit=crop&q=80";
                          setStoreData({ ...storeData, logo: defaultLogo });
                          localStorage.setItem("vendor_sidebar_logo", defaultLogo);
                          window.dispatchEvent(new Event("vendor_logo_updated"));
                          showToast("Logo reset to default");
                        }}
                        className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold transition cursor-pointer"
                        title="Reset to default logo"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>

                {/* Identity Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Store Display Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={storeData.storeName}
                      onChange={(e) =>
                        setStoreData({ ...storeData, storeName: e.target.value })
                      }
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white/90 text-xs sm:text-sm font-semibold text-slate-800 focus:border-[#049669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                      placeholder="e.g. Best Deals Superstore"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Public Store Handle (URL Slug) *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={storeData.storeSlug}
                        onChange={(e) =>
                          setStoreData({
                            ...storeData,
                            storeSlug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                          })
                        }
                        className="w-full h-11 pl-28 pr-3.5 rounded-xl border border-slate-200 bg-white/90 text-xs sm:text-sm font-mono text-slate-800 focus:border-[#049669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                      />
                      <span className="absolute left-3 top-3 text-xs font-mono text-slate-400">
                        /store/
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Store Tagline / Bio
                    </label>
                    <input
                      type="text"
                      value={storeData.tagline}
                      onChange={(e) =>
                        setStoreData({ ...storeData, tagline: e.target.value })
                      }
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white/90 text-xs sm:text-sm font-semibold text-slate-800 focus:border-[#049669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                      placeholder="Short catchy description shown on search & profile"
                    />
                  </div>
                </div>
              </div>

              {/* Business Registration & Tax Legal Details */}
              <div className="bg-white/70 backdrop-blur-2xl rounded-2xl border border-white/80 p-5 sm:p-7 shadow-[0_8px_30px_rgba(4,150,105,0.06)]">
                <h3 className="text-base font-black text-[#1E1B4B] mb-1 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#049669]" />
                  <span>Business Legal &amp; Tax Information</span>
                </h3>
                <p className="text-xs text-slate-400 mb-6">
                  Official company incorporation and tax IDs used for GST invoicing.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Registered Legal Entity Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={storeData.companyName}
                      onChange={(e) =>
                        setStoreData({ ...storeData, companyName: e.target.value })
                      }
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white/90 text-xs sm:text-sm font-semibold text-slate-800 focus:border-[#049669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                      placeholder="e.g. Best Deals Retail Pvt Ltd"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Business Type / Industry
                    </label>
                    <input
                      type="text"
                      value={storeData.businessType}
                      onChange={(e) =>
                        setStoreData({ ...storeData, businessType: e.target.value })
                      }
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white/90 text-xs sm:text-sm font-semibold text-slate-800 focus:border-[#049669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                      placeholder="e.g. Supermarket / Retailer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      GSTIN Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={storeData.gstin}
                      onChange={(e) =>
                        setStoreData({
                          ...storeData,
                          gstin: e.target.value.toUpperCase(),
                        })
                      }
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white/90 text-xs sm:text-sm font-mono font-bold text-slate-800 focus:border-[#049669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                      placeholder="27AAACB2234P1Z3"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      PAN Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={storeData.pan}
                      onChange={(e) =>
                        setStoreData({
                          ...storeData,
                          pan: e.target.value.toUpperCase(),
                        })
                      }
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white/90 text-xs sm:text-sm font-mono font-bold text-slate-800 focus:border-[#049669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                      placeholder="AAACB2234P"
                    />
                  </div>
                </div>
              </div>

              {/* Physical Warehouse & Dispatch Location */}
              <div className="bg-white/70 backdrop-blur-2xl rounded-2xl border border-white/80 p-5 sm:p-7 shadow-[0_8px_30px_rgba(4,150,105,0.06)]">
                <h3 className="text-base font-black text-[#1E1B4B] mb-1 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#049669]" />
                  <span>Store Dispatch &amp; Pickup Address</span>
                </h3>
                <p className="text-xs text-slate-400 mb-6">
                  Delivery riders will pick up prepared orders from this address.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Street Address / Unit No. *
                    </label>
                    <input
                      type="text"
                      required
                      value={storeData.address}
                      onChange={(e) =>
                        setStoreData({ ...storeData, address: e.target.value })
                      }
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white/90 text-xs sm:text-sm font-semibold text-slate-800 focus:border-[#049669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                      placeholder="Plot 42, Marol Industrial Area"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={storeData.city}
                      onChange={(e) =>
                        setStoreData({ ...storeData, city: e.target.value })
                      }
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white/90 text-xs sm:text-sm font-semibold text-slate-800 focus:border-[#049669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                      placeholder="Mumbai"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={storeData.state}
                      onChange={(e) =>
                        setStoreData({ ...storeData, state: e.target.value })
                      }
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white/90 text-xs sm:text-sm font-semibold text-slate-800 focus:border-[#049669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                      placeholder="Maharashtra"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setStoreData({
                      ...storeData,
                      storeName: "Best Deals Superstore",
                    })
                  }
                  className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition cursor-pointer"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#049669] via-[#059669] to-[#10B981] hover:from-[#03704f] hover:to-[#049669] text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/25 flex items-center gap-2 transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Store Settings</span>
                </button>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  </div>
);
}
