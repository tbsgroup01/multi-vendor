import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import bannerSettingsImg from "../../../assets/banner-settings-3d.png";
import vendorService from "../../../services/vendorService";
import { getUploadUrl } from "../../../services";
import {
  User,
  Store,
  MapPin,
  Upload,
  CheckCircle2,
  Save,
  Building2,
  BadgeCheck,
  Camera,
} from "lucide-react";

export default function Settings() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("store"); // "profile" | "store"
  const [toastMessage, setToastMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loadError, setLoadError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [savingSection, setSavingSection] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const logoFileInputRef = useRef(null);
  const avatarFileInputRef = useRef(null);

  // Profile Settings State
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    avatar: "",
    isVerified: false,
  });
  const [savedProfileData, setSavedProfileData] = useState(profileData);

  // Store Settings State
  const [storeData, setStoreData] = useState({
    storeName: "",
    storeSlug: "",
    tagline: "",
    logo: "",
    banner: "",
    supportEmail: "",
    supportPhone: "",
    companyName: "",
    gstin: "",
    pan: "",
    businessType: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [savedStoreData, setSavedStoreData] = useState(storeData);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3200);
  };

  useEffect(() => {
    let isMounted = true;
    vendorService.getMySettings()
      .then(({ vendor }) => {
        if (!isMounted) return;
        setLoadError("");
        const user = vendor.user || {};
        const profile = {
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          designation: user.designation || "",
          avatar: user.avatar || "",
          isVerified: Boolean(user.isVerified),
        };
        const settings = vendor.storeSettings || {};
        const store = {
          storeName: vendor.storeName || "",
          storeSlug: settings.storeSlug || "",
          tagline: settings.tagline || "",
          logo: settings.logo || "",
          banner: settings.banner || "",
          supportEmail: settings.supportEmail || "",
          supportPhone: settings.supportPhone || "",
          companyName: vendor.businessName || "",
          gstin: vendor.gstNumber || "",
          pan: settings.pan || "",
          businessType: vendor.category || "",
          address: settings.address || "",
          city: settings.city || "",
          state: settings.state || "",
          pincode: settings.pincode || "",
        };
        setProfileData(profile);
        setSavedProfileData(profile);
        setStoreData(store);
        setSavedStoreData(store);
        if (store.logo) {
          localStorage.setItem("vendor_sidebar_logo", store.logo);
          localStorage.setItem("brand_sidebar_logo", store.logo);
          window.dispatchEvent(new Event("vendor_logo_updated"));
          window.dispatchEvent(new Event("brand_logo_updated"));
        }
      })
      .catch((error) => {
        if (isMounted) setLoadError(error.message || "Failed to load settings.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

  const handleLogoFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("Store logo must be smaller than 2 MB.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      setStoreData((prev) => ({ ...prev, logo: dataUrl }));
      setErrorMessage("");
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("Profile photo must be smaller than 2 MB.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      setProfileData((prev) => ({ ...prev, avatar: dataUrl }));
      setErrorMessage("");
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingSection("profile");
    setErrorMessage("");
    try {
      const { vendor } = await vendorService.updateMySettings({ profile: profileData });
      const user = vendor.user;
      const savedProfile = {
        ...profileData,
        name: user.name,
        email: user.email,
        phone: user.phone,
        designation: user.designation || "",
        avatar: user.avatar || "",
        isVerified: Boolean(user.isVerified),
      };
      setProfileData(savedProfile);
      setSavedProfileData(savedProfile);
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...storedUser, ...user }));
      window.dispatchEvent(new Event("vendor_profile_updated"));
      window.dispatchEvent(new Event("storage"));
      showToast("Profile settings saved successfully!");
    } catch (error) {
      setErrorMessage(
        error.details
          ? `${error.message || "Failed to save profile settings."}: ${error.details}`
          : error.message || "Failed to save profile settings."
      );
    } finally {
      setSavingSection("");
    }
  };

  const storeSectionFields = {
    branding: ["storeName", "storeSlug", "tagline", "logo", "banner"],
    legal: ["companyName", "businessType", "gstin", "pan"],
    address: ["address", "city", "state", "pincode"],
  };

  const mapSavedStore = (vendor) => {
    const settings = vendor.storeSettings || {};
    return {
      storeName: vendor.storeName || "",
      storeSlug: settings.storeSlug || "",
      tagline: settings.tagline || "",
      logo: settings.logo || "",
      banner: settings.banner || "",
      supportEmail: settings.supportEmail || "",
      supportPhone: settings.supportPhone || "",
      companyName: vendor.businessName || "",
      gstin: vendor.gstNumber || "",
      pan: settings.pan || "",
      businessType: vendor.category || "",
      address: settings.address || "",
      city: settings.city || "",
      state: settings.state || "",
      pincode: settings.pincode || "",
    };
  };

  const handleSaveStore = async (section) => {
    const fields = storeSectionFields[section];
    const store = Object.fromEntries(fields.map((field) => [field, storeData[field]]));
    setSavingSection(section);
    setErrorMessage("");
    try {
      const { vendor } = await vendorService.updateMySettings({ store });
      const persistedStore = mapSavedStore(vendor);
      const savedSection = Object.fromEntries(fields.map((field) => [field, persistedStore[field]]));
      setStoreData((prev) => ({ ...prev, ...savedSection }));
      setSavedStoreData((prev) => ({ ...prev, ...savedSection }));
      if (section === "branding") {
        if (persistedStore.logo) {
          localStorage.setItem("vendor_sidebar_logo", persistedStore.logo);
          localStorage.setItem("brand_sidebar_logo", persistedStore.logo);
        } else {
          localStorage.removeItem("vendor_sidebar_logo");
          localStorage.removeItem("brand_sidebar_logo");
        }
        window.dispatchEvent(new Event("vendor_logo_updated"));
        window.dispatchEvent(new Event("brand_logo_updated"));
      }
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({
        ...storedUser,
        vendorProfile: {
          ...storedUser.vendorProfile,
          storeName: persistedStore.storeName,
          businessName: persistedStore.companyName,
          gstNumber: persistedStore.gstin,
          category: persistedStore.businessType,
        },
      }));
      const sectionLabels = {
        branding: "Store branding",
        legal: "Business details",
        address: "Dispatch address",
      };
      showToast(`${sectionLabels[section]} saved successfully!`);
    } catch (error) {
      setErrorMessage(
        error.details
          ? `${error.message || "Failed to save store settings."}: ${error.details}`
          : error.message || "Failed to save store settings."
      );
    } finally {
      setSavingSection("");
    }
  };

  const discardStoreSection = (section) => {
    const fields = storeSectionFields[section];
    setStoreData((prev) => ({
      ...prev,
      ...Object.fromEntries(fields.map((field) => [field, savedStoreData[field]])),
    }));
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
          {/* Welcome Banner Created with pure Code & SVG (High-Resolution Coded Banner) */}
          <div className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 min-h-[175px] sm:min-h-[190px] lg:min-h-[200px] flex flex-col justify-between overflow-hidden shadow-[0_16px_40px_rgba(4,150,105,0.22)] border border-emerald-400/30 group">
            {/* Background SVG Fluid Organic Waves */}
            <svg
              className="pointer-events-none absolute inset-0 w-full h-full object-cover"
              viewBox="0 0 1024 200"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="settingsBannerBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1B744A" />
                  <stop offset="40%" stopColor="#228C52" />
                  <stop offset="100%" stopColor="#2CA85C" />
                </linearGradient>
                <linearGradient id="settingsWaveHighlight" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38C260" stopOpacity="0.5" />
                  <stop offset="60%" stopColor="#259452" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="settingsWaveDeep" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#114E30" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#186740" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </linearGradient>
              </defs>

              <rect width="1024" height="200" fill="url(#settingsBannerBgGrad)" />
              <path
                d="M 0 200 C 240 185 380 130 620 160 C 800 182 920 150 1024 115 L 1024 200 Z"
                fill="url(#settingsWaveDeep)"
              />
              <path
                d="M 280 0 C 420 75 600 40 740 100 C 870 155 945 85 1024 40 L 1024 0 Z"
                fill="url(#settingsWaveHighlight)"
              />
              <path
                d="M 0 0 C 300 0 420 120 670 80 C 850 50 930 20 1024 0 Z"
                fill="white"
                fillOpacity="0.07"
              />
            </svg>

            {/* Specular glass reflection */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-200/60 to-transparent" />

            {/* Right 3D Settings Artwork - Transparent PNG */}
            <div className="absolute right-2 sm:right-6 lg:right-10 top-1/2 -translate-y-1/2 h-[90%] sm:h-[94%] lg:h-[98%] w-auto max-w-[38%] sm:max-w-[42%] lg:max-w-[45%] pointer-events-none select-none z-10 hidden sm:flex items-center justify-end">
              <img
                src={bannerSettingsImg}
                alt="Settings 3D artwork"
                className="h-full w-auto object-contain object-right drop-shadow-[0_12px_24px_rgba(0,0,0,0.22)]"
              />
            </div>

            {/* Left Content Area */}
            <div className="relative z-10 flex-1 flex flex-col justify-between max-w-xl">
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-emerald-100">
                    CONFIGURATION &amp; CONTROLS
                  </span>
                  <span className="w-7 h-[1.5px] bg-emerald-200/80 rounded-full inline-block" />
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-[30px] font-black tracking-tight text-white leading-tight drop-shadow-sm">
                  Settings &amp; Preferences
                </h1>

                <p className="text-xs sm:text-[13px] text-emerald-50/95 font-medium leading-relaxed max-w-md lg:max-w-lg">
                  Manage your personal vendor admin profile and configure your customer-facing store settings.
                </p>
              </div>

              <div className="pt-3.5 sm:pt-4">
                <div className="inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-white text-[#049669] font-bold text-xs sm:text-sm shadow-md shadow-emerald-950/20">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#049669] animate-pulse" />
                  <span>Store is Live</span>
                </div>
              </div>
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
          {isLoading && (
            <div className="rounded-xl border border-emerald-100 bg-white/70 px-4 py-3 text-sm text-slate-600">
              Loading settings...
            </div>
          )}
          {(loadError || errorMessage) && (
            <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {loadError || errorMessage}
              {loadError && (
                <button
                  type="button"
                  onClick={() => {
                    setIsLoading(true);
                    setReloadKey((key) => key + 1);
                  }}
                  className="ml-3 font-bold underline"
                >
                  Retry
                </button>
              )}
            </div>
          )}
          {!isLoading && !loadError && activeTab === "profile" && (
            <form onSubmit={handleSaveProfile} className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-white/70 backdrop-blur-2xl rounded-2xl border border-white/80 p-5 sm:p-7 shadow-[0_8px_30px_rgba(4,150,105,0.06)]">
                <h3 className="text-base font-black text-[#1E1B4B] mb-1 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#049669]" />
                  <span>Personal Profile &amp; Identity</span>
                </h3>
                <p className="text-xs text-slate-400 mb-6">
                  Manage your personal account credentials, contact information, and display avatar.
                </p>
                <input
                  ref={avatarFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileUpload}
                  className="hidden"
                />
                <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-slate-100">
                  <div
                    onClick={() => avatarFileInputRef.current?.click()}
                    className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md group shrink-0 cursor-pointer"
                    title="Click to change profile photo"
                  >
                    {profileData.avatar ? (
                      <img
                        src={getUploadUrl(profileData.avatar)}
                        alt={profileData.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-600 font-bold text-2xl">
                        {profileData.name ? profileData.name.charAt(0).toUpperCase() : <User className="w-8 h-8" />}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
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
                        onClick={() => avatarFileInputRef.current?.click()}
                        className="px-3 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-bold text-slate-700 transition cursor-pointer shadow-2xs"
                      >
                        Change Photo
                      </button>
                      {profileData.avatar && (
                        <button
                          type="button"
                          onClick={() =>
                            setProfileData((prev) => ({
                              ...prev,
                              avatar: "",
                            }))
                          }
                          className="px-3 py-1 rounded-lg text-[11px] font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        >
                          Remove Photo
                        </button>
                      )}
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
                      <span className={`absolute right-2.5 top-2.5 px-2 py-0.5 rounded-md border text-[10px] font-bold inline-flex items-center gap-1 ${
                        profileData.isVerified
                          ? "bg-emerald-50 text-[#049669] border-emerald-200/80"
                          : "bg-amber-50 text-amber-700 border-amber-200/80"
                      }`}>
                        <BadgeCheck className="w-3 h-3" />
                        {profileData.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={profileData.phone}       
                      onChange={(e) =>
                        setProfileData({ ...profileData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })
                      }
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white/90 text-xs sm:text-sm font-semibold text-slate-800 focus:border-[#049669] focus:ring-4 focus:ring-emerald-500/15 outline-none transition"
                      placeholder="10-digit mobile number"
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
                  onClick={() => setProfileData(savedProfileData)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition cursor-pointer"
                  disabled={Boolean(savingSection)}
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#049669] via-[#059669] to-[#10B981] hover:from-[#03704f] hover:to-[#049669] text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/25 flex items-center gap-2 transition cursor-pointer"
                  disabled={Boolean(savingSection)}
                >
                  <Save className="w-4 h-4" />
                  <span>{savingSection === "profile" ? "Saving..." : "Save Profile"}</span>
                </button>
              </div>
            </form>
          )}
          {!isLoading && !loadError && activeTab === "store" && (
            <div className="space-y-6 animate-in fade-in duration-200">
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
                        {storeData.logo ? (
                          <img
                            src={getUploadUrl(storeData.logo)}
                            alt="Sidebar Logo Preview"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Store className="w-7 h-7 text-emerald-600" />
                        )}
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
                          setErrorMessage("");
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

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => discardStoreSection("branding")}
                  disabled={Boolean(savingSection)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition disabled:opacity-60"
                >
                  Discard Branding
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveStore("branding")}
                  disabled={Boolean(savingSection)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#049669] via-[#059669] to-[#10B981] hover:from-[#03704f] hover:to-[#049669] text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/25 flex items-center gap-2 transition disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingSection === "branding" ? "Saving..." : "Save Store Branding"}</span>
                </button>
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

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => discardStoreSection("legal")}
                  disabled={Boolean(savingSection)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition disabled:opacity-60"
                >
                  Discard Business Details
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveStore("legal")}
                  disabled={Boolean(savingSection)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#049669] via-[#059669] to-[#10B981] hover:from-[#03704f] hover:to-[#049669] text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/25 flex items-center gap-2 transition disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingSection === "legal" ? "Saving..." : "Save Business Details"}</span>
                </button>
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

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => discardStoreSection("address")}
                  disabled={Boolean(savingSection)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition cursor-pointer"
                >
                  Discard Address
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveStore("address")}
                  disabled={Boolean(savingSection)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#049669] via-[#059669] to-[#10B981] hover:from-[#03704f] hover:to-[#049669] text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/25 flex items-center gap-2 transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingSection === "address" ? "Saving..." : "Save Dispatch Address"}</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  </div>
);
}
