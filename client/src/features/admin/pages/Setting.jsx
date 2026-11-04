import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  User,
  Globe,
  CreditCard,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Upload,
  CheckCircle2,
  Save,
  Phone,
  ShieldCheck,
  ChevronUp,
  KeyRound,
  Sliders,
  HelpCircle,
  Loader2,
} from "lucide-react";
import bannerSettingsImg from "../../../assets/banner-settings-3d.png";
import shopMartLogo from "../../../assets/logo.png";
import { adminService, getUploadUrl } from "../../../services";

export default function Setting() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); // "profile" | "site" | "razorpay" | "email"
  const [toastMessage, setToastMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

  // Scroll Parallax State
  const scrollContainerRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const currentScroll = container.scrollTop;
      setScrollY(currentScroll);
      setShowScrollTop(currentScroll > 240);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3500);
  };

  // 1. Profile State
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("admin_profile_settings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      fullName: "Super Admin",
      email: "admin@shopmart.com",
      phone: "9876500000",
      role: "Super Administrator",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&q=80",
      newPassword: "",
      confirmPassword: "",
    };
  });
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Fetch live Admin Profile from Database
  const fetchAdminProfile = async () => {
    try {
      setLoadingProfile(true);
      const res = await adminService.getAdminProfile();
      if (res && res.user) {
        const u = res.user;
        const avatarUrl = u.avatar
          ? getUploadUrl(u.avatar)
          : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&q=80";

        setProfile((prev) => ({
          ...prev,
          fullName: u.fullName || u.name || "Super Admin",
          email: u.email || "",
          phone: u.phone || "",
          role: u.designation || "Super Administrator",
          avatar: avatarUrl,
          newPassword: "",
          confirmPassword: "",
        }));

        const userToSave = {
          ...u,
          role: "admin",
          designation: u.designation || "Super Administrator"
        };
        localStorage.setItem("user", JSON.stringify(userToSave));
      }
    } catch (err) {
      console.error("Failed to load admin profile from DB:", err);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  // 2. Site Setting State
  const [siteSettings, setSiteSettings] = useState(() => {
    const saved = localStorage.getItem("admin_site_settings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      brandName: "ShopMart",
      tagline: "India's Trusted Multi-Vendor Hyperlocal & Retail Marketplace",
      supportEmail: "support@shopmart.com",
      supportPhone: "9876543210",
      address: "DLF Cyber City, Tower B, Level 8, Gurugram, Haryana - 122002",
      gstNumber: "07AAAAA0000A1Z5",
      logoUrl: shopMartLogo,
    };
  });

  // 3. Razorpay Configuration State
  const [razorpayConfig, setRazorpayConfig] = useState(() => {
    const saved = localStorage.getItem("admin_razorpay_settings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      keyId: "rzp_test_9XyK82Mlw40Qop",
      keySecret: "s3cr3t_RzpKey_9918239478",
    };
  });
  const [showKeySecret, setShowKeySecret] = useState(false);

  // 4. Email Config State (Google Email & App Password)
  const [emailConfig, setEmailConfig] = useState(() => {
    const saved = localStorage.getItem("admin_email_settings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      googleEmail: "shopmart.notifications@gmail.com",
      googleAppPassword: "abcd efgh ijkl mnop", // 16-character Google App Password
    };
  });
  const [showAppPassword, setShowAppPassword] = useState(false);

  // Tab definitions
  const tabs = [
    {
      id: "profile",
      label: "Admin Profile",
      icon: User,
    },
    {
      id: "site",
      label: "Site Setting",
      icon: Globe,
    },
    {
      id: "razorpay",
      label: "Razorpay Configuration",
      icon: CreditCard,
    },
    {
      id: "email",
      label: "Email Config",
      icon: Mail,
    },
  ];

  // Save Handlers
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (profile.newPassword && profile.newPassword !== profile.confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }
    if (profile.newPassword && profile.newPassword.length < 6) {
      alert("New password must be at least 6 characters long!");
      return;
    }

    try {
      setIsSaving(true);
      let res;
      if (avatarFile) {
        const formData = new FormData();
        formData.append("fullName", profile.fullName);
        formData.append("email", profile.email);
        formData.append("phone", profile.phone);
        if (profile.newPassword) {
          formData.append("newPassword", profile.newPassword);
        }
        formData.append("avatar", avatarFile);
        res = await adminService.updateAdminProfile(formData);
      } else {
        const payload = {
          fullName: profile.fullName,
          email: profile.email,
          phone: profile.phone,
          avatar: profile.avatar,
        };
        if (profile.newPassword) {
          payload.newPassword = profile.newPassword;
        }
        res = await adminService.updateAdminProfile(payload);
      }

      if (res && res.user) {
        const updatedUser = res.user;
        const avatarUrl = updatedUser.avatar
          ? getUploadUrl(updatedUser.avatar)
          : profile.avatar;

        setProfile((prev) => ({
          ...prev,
          fullName: updatedUser.fullName || updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          avatar: avatarUrl,
          newPassword: "",
          confirmPassword: "",
        }));

        const savedAdmin = {
          ...updatedUser,
          role: "admin",
          designation: updatedUser.designation || "Super Administrator"
        };
        localStorage.setItem("user", JSON.stringify(savedAdmin));
        localStorage.setItem("admin_profile_settings", JSON.stringify({
          ...profile,
          fullName: updatedUser.fullName || updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          avatar: avatarUrl,
          newPassword: "",
          confirmPassword: "",
        }));
        setAvatarFile(null);
      }

      showToast("Admin profile details updated successfully in database!");
      window.dispatchEvent(new Event("admin_profile_updated"));
    } catch (err) {
      console.error("Failed to update admin profile in DB:", err);
      showToast(err.message || "Failed to update admin profile in database.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSiteSettings = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem("admin_site_settings", JSON.stringify(siteSettings));
      setIsSaving(false);
      showToast("Marketplace site settings saved!");
    }, 500);
  };

  const handleSaveRazorpay = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem(
        "admin_razorpay_settings",
        JSON.stringify(razorpayConfig)
      );
      setIsSaving(false);
      showToast("Razorpay API credentials updated successfully!");
    }, 500);
  };

  const handleSaveEmailConfig = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem("admin_email_settings", JSON.stringify(emailConfig));
      setIsSaving(false);
      showToast("Google email and password configuration saved!");
    }, 500);
  };

  // Avatar upload handler
  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setProfile((prev) => ({
          ...prev,
          avatar: uploadEvent.target?.result,
        }));
        showToast("Profile avatar selected! Click 'Save Profile' to persist to database.");
      };
      reader.readAsDataURL(file);
    }
  };

  // Logo file upload handler
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setSiteSettings((prev) => ({
          ...prev,
          logoUrl: uploadEvent.target?.result,
        }));
        showToast("New store logo loaded. Remember to save changes!");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#F4F9F5] text-slate-800 font-['Poppins',sans-serif] relative overflow-hidden">
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
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div
          ref={scrollContainerRef}
          className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto relative z-10 scroll-smooth [scrollbar-gutter:stable]"
        >
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 w-full mx-auto pb-16">
            {/* Super Admin Welcome Banner */}
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
                  <linearGradient id="setBannerBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1B744A" />
                    <stop offset="40%" stopColor="#228C52" />
                    <stop offset="100%" stopColor="#2CA85C" />
                  </linearGradient>
                  <linearGradient id="setWaveHighlight" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#38C260" stopOpacity="0.5" />
                    <stop offset="60%" stopColor="#259452" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="setWaveDeep" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#114E30" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#186740" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <rect width="1024" height="200" fill="url(#setBannerBgGrad)" />
                <path
                  d="M 0 200 C 240 185 380 130 620 160 C 800 182 920 150 1024 115 L 1024 200 Z"
                  fill="url(#setWaveDeep)"
                />
                <path
                  d="M 280 0 C 420 75 600 40 740 100 C 870 155 945 85 1024 40 L 1024 0 Z"
                  fill="url(#setWaveHighlight)"
                />
                <path
                  d="M 0 0 C 300 0 420 120 670 80 C 850 50 930 20 1024 0 Z"
                  fill="white"
                  fillOpacity="0.07"
                />
              </svg>

              {/* Specular glass reflection */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-200/60 to-transparent" />

              {/* Right 3D Artwork */}
              <div className="absolute right-3 sm:right-6 lg:right-10 top-1/2 -translate-y-1/2 h-[90%] sm:h-[94%] lg:h-[98%] w-auto max-w-[38%] sm:max-w-[42%] lg:max-w-[45%] pointer-events-none select-none z-10 hidden sm:flex items-center justify-end">
                <img
                  src={bannerSettingsImg}
                  alt="Platform Settings 3D artwork"
                  className="h-full w-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.35)] group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="eager"
                />
              </div>

              {/* Banner Text Content */}
              <div className="relative z-10 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-semibold tracking-wide mb-2 sm:mb-3 shadow-sm">
                  <Sliders className="w-3.5 h-3.5 text-amber-300" />
                  <span>PLATFORM PREFERENCES & INTEGRATIONS</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight drop-shadow-sm leading-tight">
                  Platform Settings
                </h1>
                <p className="text-white/90 text-xs sm:text-sm font-medium mt-1.5 max-w-md leading-relaxed drop-shadow-xs">
                  Manage administrator profile credentials, marketplace branding, Razorpay gateway keys, and Google email configuration.
                </p>
              </div>

              {/* Quick Status Pill */}
              <div className="relative z-10 pt-3 flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span>4 Configuration Modules</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/15 backdrop-blur-md border border-white/20 text-white/95 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                  <span>Active & Verified</span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs Bar */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-2 border border-white/80 shadow-[0_8px_32px_0_rgba(16,185,129,0.06)] flex flex-wrap sm:flex-nowrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-[140px] sm:min-w-0 py-3 px-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center sm:justify-start gap-2.5 cursor-pointer ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                        : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT 1: PROFILE */}
            {activeTab === "profile" && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/80 shadow-[0_8px_32px_0_rgba(16,185,129,0.06)] relative overflow-hidden animate-in fade-in duration-300">
                <div className="flex items-center justify-between pb-5 mb-6 border-b border-emerald-100/60">
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <User className="w-5 h-5 text-emerald-600" />
                      <span>Admin Profile Information</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
                      Update your administrator identity, contact phone, and account access password.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200/60">
                    {profile.role}
                  </span>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Avatar & Photo Upload */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70">
                    <img
                      src={profile.avatar}
                      alt="Admin Avatar"
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-sm"
                    />
                    <div className="flex-1 space-y-1">
                      <h4 className="text-sm font-bold text-slate-900">
                        Profile Avatar
                      </h4>
                      <p className="text-xs text-slate-500">
                        Upload your profile photo (PNG or JPG).
                      </p>
                      <div className="pt-1">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 text-xs font-bold transition cursor-pointer">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Change Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Admin Display Name
                      </label>
                      <input
                        type="text"
                        required
                        value={profile.fullName}
                        onChange={(e) =>
                          setProfile({ ...profile, fullName: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 text-xs sm:text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Administrator Email
                      </label>
                      <input
                        type="email"
                        required
                        value={profile.email}
                        onChange={(e) =>
                          setProfile({ ...profile, email: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 text-xs sm:text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Contact Phone
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={profile.phone}
                          maxLength={10}
                          onChange={(e) =>
                            setProfile({ ...profile, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })
                          }
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 text-xs sm:text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        System Role Designation
                      </label>
                      <input
                        type="text"
                        disabled
                        value={profile.role}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-xs sm:text-sm font-semibold cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Password Change Box (New Password & Confirm Password only) */}
                  <div className="pt-4 border-t border-slate-100">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Security & Password Update</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-600 block mb-1">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={profile.newPassword}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                newPassword: e.target.value,
                              })
                            }
                            placeholder="At least 8 characters"
                            className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-emerald-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showNewPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-600 block mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={profile.confirmPassword}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              confirmPassword: e.target.value,
                            })
                          }
                          placeholder="Re-type new password"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md shadow-emerald-600/25 flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>{isSaving ? "Saving to DB..." : "Save Profile"}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB CONTENT 2: SITE SETTING */}
            {activeTab === "site" && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/80 shadow-[0_8px_32px_0_rgba(16,185,129,0.06)] relative overflow-hidden animate-in fade-in duration-300">
                <div className="flex items-center justify-between pb-5 mb-6 border-b border-emerald-100/60">
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <Globe className="w-5 h-5 text-emerald-600" />
                      <span>Marketplace Site Settings & Branding</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
                      Configure marketplace brand identity, logo graphic, public support email and contact phone.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200/60">
                    Storefront
                  </span>
                </div>

                <form onSubmit={handleSaveSiteSettings} className="space-y-6">
                  {/* Logo Upload & Preview (without external URL input) */}
                  <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center gap-5">
                    <div className="w-24 h-24 rounded-2xl bg-white border border-slate-200 p-3 flex items-center justify-center shadow-xs overflow-hidden shrink-0">
                      <img
                        src={siteSettings.logoUrl}
                        alt="Brand Logo"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                        Marketplace Brand Logo
                      </span>
                      <p className="text-xs text-slate-500 max-w-md">
                        Displayed on customer storefront, emails, invoice headers, and admin dashboard.
                      </p>
                      <div className="pt-1">
                        <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 text-xs font-bold transition cursor-pointer shadow-2xs">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Logo File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Brand Name
                      </label>
                      <input
                        type="text"
                        required
                        value={siteSettings.brandName}
                        onChange={(e) =>
                          setSiteSettings({
                            ...siteSettings,
                            brandName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 text-xs sm:text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Tagline / Slogan
                      </label>
                      <input
                        type="text"
                        value={siteSettings.tagline}
                        onChange={(e) =>
                          setSiteSettings({
                            ...siteSettings,
                            tagline: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 text-xs sm:text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Customer Support Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={siteSettings.supportEmail}
                          onChange={(e) =>
                            setSiteSettings({
                              ...siteSettings,
                              supportEmail: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 text-xs sm:text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Customer Helpline / Phone
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={siteSettings.supportPhone}
                          maxLength={10}
                          onChange={(e) =>
                            setSiteSettings({
                              ...siteSettings,
                              supportPhone: e.target.value.replace(/\D/g, "").slice(0, 10),
                            })
                          }
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 text-xs sm:text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Registered Business Address
                      </label>
                      <textarea
                        rows={2}
                        value={siteSettings.address}
                        onChange={(e) =>
                          setSiteSettings({
                            ...siteSettings,
                            address: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 text-xs sm:text-sm font-semibold focus:outline-none focus:border-emerald-500 resize-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        GST / Business Tax ID
                      </label>
                      <input
                        type="text"
                        value={siteSettings.gstNumber}
                        onChange={(e) =>
                          setSiteSettings({
                            ...siteSettings,
                            gstNumber: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 text-xs sm:text-sm font-semibold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-3 border-t border-slate-100">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md shadow-emerald-600/25 flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? "Saving..." : "Save Site Settings"}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB CONTENT 3: RAZORPAY CONFIGURATION (API Key ID & Key Secret only) */}
            {activeTab === "razorpay" && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/80 shadow-[0_8px_32px_0_rgba(16,185,129,0.06)] relative overflow-hidden animate-in fade-in duration-300">
                <div className="pb-5 mb-6 border-b border-emerald-100/60">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                    <span>Razorpay API Configuration</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
                    Configure your official Razorpay API credentials for customer checkout payments.
                  </p>
                </div>

                <form onSubmit={handleSaveRazorpay} className="space-y-6">
                  <div className="space-y-5">
                    {/* Key ID */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-slate-700">
                          Razorpay Key ID
                        </label>
                        <span className="text-[11px] text-slate-400 font-mono">
                          rzp_test_... or rzp_live_...
                        </span>
                      </div>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={razorpayConfig.keyId}
                          onChange={(e) =>
                            setRazorpayConfig({
                              ...razorpayConfig,
                              keyId: e.target.value,
                            })
                          }
                          placeholder="rzp_test_xxxx or rzp_live_xxxx"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white font-mono text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    {/* Key Secret */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-slate-700">
                          Razorpay Key Secret
                        </label>
                        <span className="text-[11px] text-slate-400">
                          API Secret key from Razorpay dashboard
                        </span>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showKeySecret ? "text" : "password"}
                          required
                          value={razorpayConfig.keySecret}
                          onChange={(e) =>
                            setRazorpayConfig({
                              ...razorpayConfig,
                              keySecret: e.target.value,
                            })
                          }
                          placeholder="Enter Razorpay Key Secret"
                          className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-white font-mono text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowKeySecret(!showKeySecret)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showKeySecret ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-3 border-t border-slate-100">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md shadow-emerald-600/25 flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? "Saving..." : "Save Razorpay Keys"}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB CONTENT 4: EMAIL CONFIG (Google Email & App Password only) */}
            {activeTab === "email" && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/80 shadow-[0_8px_32px_0_rgba(16,185,129,0.06)] relative overflow-hidden animate-in fade-in duration-300">
                <div className="pb-5 mb-6 border-b border-emerald-100/60">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Mail className="w-5 h-5 text-emerald-600" />
                    <span>Google Email & Password Configuration</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
                    Configure your official Google Workspace / Gmail address and 16-character Google App Password.
                  </p>
                </div>

                <form onSubmit={handleSaveEmailConfig} className="space-y-6">
                  {/* Google Setup Guide Callout */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200 text-xs text-slate-700 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-emerald-900">
                      <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>How to obtain your Google App Password:</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed pl-6">
                      1. Go to your <strong>Google Account</strong> &gt; <strong>Security</strong> &gt; Enable <strong>2-Step Verification</strong>.<br />
                      2. Under <em>"App passwords"</em>, generate a new password with App name <strong>ShopMart</strong>.<br />
                      3. Copy the 16-character generated code and paste it into the <strong>Google App Password</strong> field below.
                    </p>
                  </div>

                  <div className="space-y-5">
                    {/* Google Email Address */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Google Email / Gmail Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={emailConfig.googleEmail}
                          onChange={(e) =>
                            setEmailConfig({
                              ...emailConfig,
                              googleEmail: e.target.value,
                            })
                          }
                          placeholder="youraccount@gmail.com"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    {/* Google App Password */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-slate-700">
                          Google App Password
                        </label>
                        <span className="text-[11px] text-slate-400 font-mono">
                          16-character password
                        </span>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showAppPassword ? "text" : "password"}
                          required
                          value={emailConfig.googleAppPassword}
                          onChange={(e) =>
                            setEmailConfig({
                              ...emailConfig,
                              googleAppPassword: e.target.value,
                            })
                          }
                          placeholder="xxxx xxxx xxxx xxxx"
                          className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-white font-mono text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowAppPassword(!showAppPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showAppPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-3 border-t border-slate-100">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md shadow-emerald-600/25 flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? "Saving..." : "Save Email Configuration"}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 w-11 h-11 rounded-2xl bg-emerald-600 text-white shadow-xl shadow-emerald-600/30 border border-emerald-400/40 flex items-center justify-center hover:bg-emerald-700 transition-all cursor-pointer z-40"
        >
          <ChevronUp className="w-5 h-5 stroke-[2.5]" />
        </button>
      )}
    </div>
  );
}
