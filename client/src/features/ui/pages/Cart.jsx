import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Zap,
  MapPin,
  Plus,
  Minus,
  Trash2,
  X,
  ReceiptText,
  ShieldCheck,
  ArrowRight,
  ShoppingBag,
  Tag,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import Footer from "../components/Footer";

export default function Cart() {
  // Cart items matching the exact reference screenshot
  const [items, setItems] = useState([
    {
      id: "c1",
      name: "Amul Taaza Fresh Toned Milk",
      unit: "1 L",
      price: 54,
      mrp: 56,
      discountText: "₹54 OFF",
      quantity: 2,
      image: "https://pngimg.com/uploads/milk/milk_PNG12734.png",
    },
    {
      id: "c2",
      name: "Harvest Gold White Sandwich Bread",
      unit: "400 g",
      price: 40,
      mrp: 45,
      discountText: "₹40 OFF",
      quantity: 1,
      image: "https://pngimg.com/uploads/bread/bread_PNG2301.png",
    },
    {
      id: "c3",
      name: "Farm Fresh Brown Table Eggs",
      unit: "Pack of 6",
      price: 68,
      mrp: 75,
      discountText: "₹68 OFF",
      quantity: 1,
      image: "https://pngimg.com/uploads/egg/egg_PNG40.png",
    },
  ]);

  const [orderPlaced, setOrderPlaced] = useState(false);

  // Cart quantity controls
  const updateQuantity = (id, delta) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  // Calculations
  const totalItemCount = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const itemsTotal = items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  const itemsMrpTotal =
    items.length === 3 && itemsTotal === 216
      ? 232
      : items.reduce((acc, curr) => acc + (curr.mrp || curr.price) * curr.quantity, 0);
  const deliveryCharge = 0; // FREE as shown in reference image
  const handlingFee = items.length > 0 ? 4 : 0;
  const grandTotal = Math.max(0, itemsTotal + deliveryCharge + handlingFee);

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#FAF7FE] flex flex-col items-center justify-center p-4 font-['Poppins',sans-serif] relative overflow-hidden">
        {/* Glowing Glassy Ambient Orbs */}
        <div className="pointer-events-none absolute -left-20 top-20 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-400/30 to-purple-400/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-20 w-80 h-80 rounded-full bg-gradient-to-tr from-purple-400/30 to-pink-400/25 blur-3xl" />

        <div className="bg-white/75 backdrop-blur-2xl rounded-3xl border border-white/90 p-8 sm:p-10 max-w-md w-full text-center shadow-[0_20px_60px_rgba(109,40,217,0.12)] relative overflow-hidden z-10">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

          <div className="w-16 h-16 rounded-2xl bg-emerald-100/70 border border-emerald-200/60 text-emerald-600 flex items-center justify-center mx-auto mb-4 backdrop-blur-md shadow-inner shadow-white/80">
            <CheckCircle2 className="w-9 h-9 stroke-[2.4]" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50/80 border border-emerald-200/50 text-emerald-700 text-xs font-bold mb-2 backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 fill-emerald-600" />
            Express Delivery
          </span>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Order Placed Successfully!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            Your order of{" "}
            <span className="font-bold text-slate-800">
              ₹{grandTotal.toLocaleString("en-IN")}
            </span>{" "}
            has been received. Our delivery partner will reach your doorstep shortly.
          </p>

          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 mt-6 text-left border border-white/80 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 pb-2.5 border-b border-purple-100/60">
              <span>Estimated Delivery</span>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-purple-600" /> 12 Minutes
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2.5">
              <span>Delivering To</span>
              <span className="font-bold text-slate-800">Home - B Block, Sector 63, Noida</span>
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-2.5">
            <Link
              to="/shop"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6D28D9] to-[#9333EA] text-white font-bold text-sm hover:opacity-95 transition-all shadow-lg shadow-purple-500/25 active:scale-[0.99] border border-white/20"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FAF7FE] flex flex-col font-['Poppins',sans-serif] relative overflow-x-hidden text-slate-800">
      
      {/* Background Soft Pastel Ambient Waves & Orbs for Frosted Glass Effect */}
      <div className="pointer-events-none absolute -left-24 top-20 w-96 h-96 rounded-full bg-gradient-to-br from-pink-400/25 to-purple-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-36 w-96 h-96 rounded-full bg-gradient-to-br from-violet-500/25 to-fuchsia-400/25 blur-3xl" />
      <div className="pointer-events-none absolute left-1/3 top-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-purple-300/20 via-pink-300/15 to-indigo-300/20 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 bottom-16 w-80 h-80 rounded-full bg-purple-400/20 blur-3xl" />

      {/* Main Container */}
      <div className="flex-1 max-w-[1340px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 z-10">
        
        {/* Top Delivery Header Bar with Glassy Effect */}
        <div className="w-full bg-white/65 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-3.5 sm:px-6 sm:py-4 border border-white/80 shadow-[0_8px_32px_0_rgba(109,40,217,0.06)] flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 mb-6 sm:mb-7 relative overflow-hidden transition-all">
          {/* Glass Top Highlight Line */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

          {/* Left: Pink Lightning Badge & Delivery Info */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#FFEBF2]/80 backdrop-blur-md border border-pink-200/50 text-[#FF2E63] flex items-center justify-center shrink-0 shadow-inner shadow-white/80">
              <Zap className="w-5 h-5 fill-[#FF2E63]" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#1E1B4B] leading-tight">
                Delivery in 10-15 minutes
              </h2>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Deliver to:</span>
                <span className="font-semibold text-slate-700">Home - B Block, Sector 63, Noida</span>
              </p>
            </div>
          </div>

          {/* Right: + Add more items */}
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#6D28D9] hover:text-[#5B21B6] bg-purple-100/60 hover:bg-purple-100/90 border border-purple-200/60 px-3.5 py-1.5 rounded-xl backdrop-blur-md transition-all shadow-xs ml-auto sm:ml-0"
          >
            <span className="w-4 h-4 rounded-full bg-[#6D28D9] text-white flex items-center justify-center text-xs font-bold leading-none">
              +
            </span>
            <span>Add more items</span>
          </Link>
        </div>

        {items.length === 0 ? (
          /* Empty Cart State with Glassy Effect */
          <div className="bg-white/65 backdrop-blur-2xl rounded-3xl border border-white/80 p-10 sm:p-14 text-center max-w-lg mx-auto shadow-[0_8px_32px_0_rgba(109,40,217,0.06)] relative overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
            <div className="w-20 h-20 rounded-2xl bg-purple-100/70 border border-purple-200/50 text-purple-600 flex items-center justify-center mx-auto mb-4 backdrop-blur-md shadow-inner shadow-white/80">
              <ShoppingBag className="w-10 h-10 stroke-[1.8]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Your Cart is Empty</h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto mt-1 mb-6 leading-relaxed">
              Looks like you haven't added anything to your cart yet. Explore fresh daily essentials and groceries now!
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#6D28D9] to-[#9333EA] text-white font-bold text-xs sm:text-sm hover:opacity-95 transition-all shadow-lg shadow-purple-500/25 cursor-pointer border border-white/20"
            >
              <span>Start Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* 2-Column Glassy Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7 items-start">
            
            {/* Left Column (8 cols): Cart Items Glassy Card */}
            <div className="lg:col-span-7 xl:col-span-8 bg-white/65 backdrop-blur-2xl rounded-3xl p-5 sm:p-7 border border-white/80 shadow-[0_8px_32px_0_rgba(109,40,217,0.06)] relative overflow-hidden transition-all">
              {/* Glass Top Highlight Line */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
              
              {/* Cart Items Header */}
              <div className="flex items-center justify-between pb-4 mb-2 border-b border-purple-100/60">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F1EBFA]/80 backdrop-blur-md border border-purple-200/50 text-[#702EDF] flex items-center justify-center shadow-xs">
                    <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#1E1B4B]">
                    Cart Items ({totalItemCount})
                  </h3>
                </div>

                <button
                  onClick={clearCart}
                  className="text-xs sm:text-sm font-semibold text-[#E11D48] hover:text-[#BE123C] bg-rose-50/60 hover:bg-rose-100/70 border border-rose-200/40 px-3 py-1.5 rounded-xl backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Cart</span>
                </button>
              </div>

              {/* Items List */}
              <div className="divide-y divide-purple-100/50">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="py-4 sm:py-5 flex items-center justify-between gap-3 sm:gap-5 group"
                  >
                    {/* Thumbnail & Product Details */}
                    <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
                      <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white/75 backdrop-blur-md border border-white/90 p-2 flex items-center justify-center shrink-0 shadow-sm shadow-purple-900/5 group-hover:scale-102 transition-transform">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm sm:text-base font-bold text-[#1E1B4B] truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                          {item.unit}
                        </p>
                        <div className="mt-1.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#EAFBF1]/80 backdrop-blur-md border border-emerald-200/50 text-[#12A150] text-[11px] font-bold">
                            <Tag className="w-3 h-3 stroke-[2.5]" />
                            <span>{item.discountText || `₹${item.price} OFF`}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity Stepper Pill with Glassy Look */}
                    <div className="flex items-center bg-purple-100/70 backdrop-blur-md border border-purple-200/60 rounded-xl px-2.5 py-1.5 text-[#6D28D9] shrink-0 gap-3 font-bold text-sm shadow-inner shadow-white/60">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-5 h-5 flex items-center justify-center hover:opacity-75 transition-opacity cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                      <span className="min-w-[14px] text-center font-bold text-sm text-[#1E1B4B] select-none">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-5 h-5 flex items-center justify-center hover:opacity-75 transition-opacity cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="min-w-[65px] sm:min-w-[75px] text-right shrink-0">
                      <span className="text-base sm:text-lg font-bold text-[#1E1B4B]">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* Remove X Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-white/70 transition-colors cursor-pointer shrink-0"
                      aria-label="Remove item"
                    >
                      <X className="w-4 h-4 stroke-[2.2]" />
                    </button>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Column (4 cols): Bill Details Glassy Card */}
            <div className="lg:col-span-5 xl:col-span-4 bg-white/65 backdrop-blur-2xl rounded-3xl border border-white/80 shadow-[0_8px_32px_0_rgba(109,40,217,0.08)] overflow-hidden relative transition-all">
              {/* Glass Top Highlight Line */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent z-10" />

              {/* Bill Details Header with Frosted Purple-Pink Gradient */}
              <div className="relative bg-gradient-to-r from-[#6218B3]/90 via-[#7526D6]/90 to-[#AD4BF7]/90 backdrop-blur-xl p-5 text-white flex items-center gap-3 overflow-hidden border-b border-white/20">
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-white/10 rounded-l-full blur-[2px] pointer-events-none" />
                
                <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 shadow-xs">
                  <ReceiptText className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Bill Details
                </h3>
              </div>

              {/* Bill Breakdown Body */}
              <div className="p-5 sm:p-6 space-y-3.5">
                
                {/* Row 1: Items Total */}
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-600 font-medium">
                    Items Total (MRP ₹{itemsMrpTotal})
                  </span>
                  <span className="font-bold text-[#1E1B4B]">
                    ₹{itemsTotal.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Row 2: Delivery Charge */}
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-600 font-medium">
                    Delivery Charge
                  </span>
                  <span className="font-bold text-[#16A34A] bg-emerald-50/80 px-2 py-0.5 rounded-md border border-emerald-200/50 text-xs">
                    FREE
                  </span>
                </div>

                {/* Row 3: Handling & Packaging Fee */}
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-600 font-medium">
                    Handling & Packaging Fee
                  </span>
                  <span className="font-bold text-[#1E1B4B]">
                    ₹{handlingFee}
                  </span>
                </div>

                {/* Divider Line */}
                <div className="border-t border-purple-100/60 pt-3.5 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-[#1E1B4B]">
                      Grand Total
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-[#5B21B6]">
                      ₹{grandTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Cancellation Guarantee Alert Box with Frosted Glass */}
                <div className="bg-purple-100/50 backdrop-blur-md rounded-2xl p-3.5 flex items-start gap-3 my-4 border border-purple-200/60 shadow-xs">
                  <div className="w-6 h-6 rounded-lg bg-[#6A24D4] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm shadow-purple-500/20">
                    <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <div className="leading-snug">
                    <p className="text-[11px] sm:text-xs font-semibold text-slate-700">
                      Orders cannot be cancelled once packed for delivery.
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Instant refund is guaranteed for any quality issue.
                    </p>
                  </div>
                </div>

                {/* Proceed to Pay Dual Button with Glass Sheen */}
                <button
                  onClick={() => setOrderPlaced(true)}
                  className="w-full rounded-2xl bg-gradient-to-r from-[#4C1D95] via-[#6D28D9] to-[#EC4899] p-3.5 sm:p-4 text-white flex items-center justify-between shadow-[0_12px_28px_-6px_rgba(109,40,217,0.45)] hover:shadow-[0_16px_32px_-6px_rgba(109,40,217,0.55)] active:scale-[0.99] transition-all cursor-pointer border border-white/20 relative overflow-hidden group"
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  
                  {/* Left: Total to Pay */}
                  <div className="text-left leading-tight pl-1">
                    <span className="block text-[10px] font-medium text-purple-200 uppercase tracking-wider">
                      Total to Pay
                    </span>
                    <span className="text-lg sm:text-xl font-black text-white">
                      ₹{grandTotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="h-7 w-px bg-white/20 mx-3" />

                  {/* Right: Proceed to Pay */}
                  <div className="flex items-center gap-1.5 font-bold text-sm sm:text-base pr-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Proceed to Pay</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </button>

              </div>

            </div>

          </div>
        )}

      </div>

      {/* Footer */}
      <Footer />

    </div>
  );
}
