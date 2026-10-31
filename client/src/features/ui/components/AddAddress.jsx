import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Home,
  Briefcase,
  Building2,
  Navigation,
  User,
  Phone,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Check,
} from "lucide-react";

export default function AddAddress({ onSave, onClose }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    receiver: "",
    phone: "",
    addressLine: "",
    area: "",
    landmark: "",
    city: "Noida",
    state: "Uttar Pradesh",
    pincode: "",
    tag: "Home",
    isDefault: false,
  });

  const [errors, setErrors] = useState({});
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Address Type Options
  const addressTypes = [
    { id: "Home", label: "Home", icon: Home },
    { id: "Work", label: "Work", icon: Briefcase },
    { id: "Hotel", label: "Hotel", icon: Building2 },
    { id: "Other", label: "Other", icon: MapPin },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear field error on edit
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Auto-detect location
  const handleDetectLocation = () => {
    setDetectingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setTimeout(() => {
            setFormData((prev) => ({
              ...prev,
              area: "Sector 62, Electronic City",
              city: "Noida",
              state: "Uttar Pradesh",
              pincode: "201309",
            }));
            setDetectingLocation(false);
          }, 800);
        },
        () => {
          setTimeout(() => {
            setFormData((prev) => ({
              ...prev,
              area: "Sector 62, Electronic City",
              city: "Noida",
              state: "Uttar Pradesh",
              pincode: "201309",
            }));
            setDetectingLocation(false);
          }, 800);
        }
      );
    } else {
      setTimeout(() => {
        setFormData((prev) => ({
          ...prev,
          area: "Sector 63, Near Metro Station",
          city: "Noida",
          state: "Uttar Pradesh",
          pincode: "201301",
        }));
        setDetectingLocation(false);
      }, 800);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.receiver.trim()) {
      newErrors.receiver = "Receiver full name is required";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Enter a valid 10-digit mobile number";
    }
    if (!formData.addressLine.trim()) {
      newErrors.addressLine = "House / Flat / Building name is required";
    }
    if (!formData.area.trim()) {
      newErrors.area = "Area / Locality / Street is required";
    }
    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^[0-9]{6}$/.test(formData.pincode.trim())) {
      newErrors.pincode = "Enter a valid 6-digit postal pincode";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newAddress = {
      id: "addr-" + Date.now(),
      ...formData,
      receiver: formData.receiver.trim(),
      phone: "+91 " + formData.phone.replace(/\D/g, "").slice(-10),
    };

    // Save to localStorage for instant persistence across pages
    try {
      const stored = JSON.parse(localStorage.getItem("user_addresses") || "[]");
      let updated;
      if (formData.isDefault) {
        updated = stored.map((item) => ({ ...item, isDefault: false }));
        updated.unshift(newAddress);
      } else {
        updated = [newAddress, ...stored];
      }
      localStorage.setItem("user_addresses", JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save address to localStorage", err);
    }

    setIsSubmitted(true);

    if (onSave) {
      onSave(newAddress);
    }

    setTimeout(() => {
      if (onClose) {
        onClose();
      } else {
        navigate("/orders?tab=addresses");
      }
    }, 1200);
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-[#F6F8FD] py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-[720px] mx-auto">
        
        {/* Back Link & Header */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => {
              if (onClose) onClose();
              else navigate("/orders?tab=addresses");
            }}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-purple-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Addresses</span>
          </button>

          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Delivery Zone</span>
          </span>
        </div>

        {/* Form Main Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden">
          
          {/* Card Top Title Banner */}
          <div className="p-5 sm:p-7 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-50/60 to-white">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-5 rounded-full bg-purple-600 block" />
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Add Delivery Address
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 pl-4">
                Enter your complete address for instant, contactless grocery delivery
              </p>
            </div>

            {/* Quick GPS Location Detection Button */}
            {/* <button
              type="button"
              onClick={handleDetectLocation}
              disabled={detectingLocation}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-purple-200 bg-purple-50/80 hover:bg-purple-100/70 text-purple-700 text-xs font-bold transition-all shadow-2xs hover:shadow-xs disabled:opacity-60 cursor-pointer shrink-0"
            >
              <Navigation className={`w-3.5 h-3.5 ${detectingLocation ? "animate-spin text-purple-600" : ""}`} />
              <span>{detectingLocation ? "Detecting Location..." : "Use Current Location"}</span>
            </button> */}
          </div>

          {/* Success Message Banner */}
          {isSubmitted && (
            <div className="p-4 mx-6 mt-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 animate-in fade-in duration-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs sm:text-sm font-bold">Address saved successfully!</p>
                <p className="text-[11px] text-emerald-600">Redirecting to your saved addresses...</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2.5">
                Save Address As
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {addressTypes.map((item) => {
                  const Icon = item.icon;
                  const isSelected = formData.tag === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, tag: item.id }))}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? "border-purple-600 bg-purple-50/70 text-purple-700 shadow-2xs"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? "text-purple-600" : "text-slate-400"}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Receiver Personal Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Receiver Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="receiver"
                    value={formData.receiver}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50/60 border text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-purple-100 ${
                      errors.receiver ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-purple-600"
                    }`}
                  />
                </div>
                {errors.receiver && (
                  <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.receiver}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  10-Digit Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-xs font-bold text-slate-600">
                    +91
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    maxLength={10}
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9800000000"
                    className={`w-full px-3.5 py-2.5 rounded-r-xl bg-slate-50/60 border text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-purple-100 ${
                      errors.phone ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-purple-600"
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* 3. Flat / House / Building */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Flat / House No. / Building / Floor <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="addressLine"
                value={formData.addressLine}
                onChange={handleChange}
                placeholder="e.g. Flat 402, Tower B, Green Heights Apartment"
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-50/60 border text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-purple-100 ${
                  errors.addressLine ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-purple-600"
                }`}
              />
              {errors.addressLine && (
                <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.addressLine}</p>
              )}
            </div>

            {/* 4. Area / Locality / Street */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Area / Street / Sector <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <MapPin className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="e.g. Sector 62, Near Electronic City Metro"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50/60 border text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-purple-100 ${
                    errors.area ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-purple-600"
                  }`}
                />
              </div>
              {errors.area && (
                <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.area}</p>
              )}
            </div>

            {/* 5. Landmark (Optional) & Pincode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nearby Landmark <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  placeholder="e.g. Opposite City Hospital"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50/60 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  6-Digit Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="pincode"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="e.g. 201301"
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-50/60 border text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-purple-100 ${
                    errors.pincode ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-purple-600"
                  }`}
                />
                {errors.pincode && (
                  <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.pincode}</p>
                )}
              </div>
            </div>

            {/* 6. City & State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Noida"
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-50/60 border text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-purple-100 ${
                    errors.city ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-purple-600"
                  }`}
                />
                {errors.city && (
                  <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g. Uttar Pradesh"
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-50/60 border text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-purple-100 ${
                    errors.state ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-purple-600"
                  }`}
                />
                {errors.state && (
                  <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.state}</p>
                )}
              </div>
            </div>

            {/* 7. Default Address Checkbox */}
            <div className="pt-2">
              <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-700">
                  Make this my default delivery address
                </span>
              </label>
            </div>

            {/* 8. Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  if (onClose) onClose();
                  else navigate("/orders?tab=addresses");
                }}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs sm:text-sm hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitted}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer disabled:opacity-70"
              >
                {isSubmitted ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Address</span>
                )}
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}
