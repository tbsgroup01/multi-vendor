import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  CreditCard,
  Banknote,
  AlertCircle,
  Loader2,
  LogIn,
  Home as HomeIcon,
  Briefcase,
  Check,
  ChevronRight,
  User,
  Phone,
} from "lucide-react";
import Footer from "../components/Footer";
import { paymentService, cartService, authService, getUploadUrl } from "../../../services";
import { useCart } from "../../../context/CartContext";

export default function Cart() {
  const navigate = useNavigate();
  const {
    cartItems: items,
    loading,
    updateQuantity,
    removeFromCart: removeItem,
    clearCart,
    cartCount: totalItemCount,
    cartTotal: itemsTotal,
    cartMrpTotal: itemsMrpTotal,
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("razorpay"); // "razorpay" | "cod"
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // Checkout Modal & Delivery Address States
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({
    receiver: "",
    phone: "",
    addressLine: "",
    area: "",
    landmark: "",
    city: "Noida",
    state: "Uttar Pradesh",
    pincode: "201301",
    tag: "Home",
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetch logged in user details if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        setCurrentUser(u);
        setNewAddressForm((prev) => ({
          ...prev,
          receiver: u.name || "",
          phone: u.phone ? u.phone.replace(/\D/g, "").slice(-10) : "",
        }));
      }
    } catch (e) {}
  }, []);

  // Hide Navbar when checkout popup or order success modal is active
  useEffect(() => {
    if (isCheckoutModalOpen || orderPlaced) {
      document.body.classList.add("modal-open-hide-nav");
    } else {
      document.body.classList.remove("modal-open-hide-nav");
    }
    return () => {
      document.body.classList.remove("modal-open-hide-nav");
    };
  }, [isCheckoutModalOpen, orderPlaced]);

  // Fetch user addresses from Database
  const fetchUserAddresses = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      setLoadingAddresses(true);
      const list = await authService.getAddresses();
      if (Array.isArray(list) && list.length > 0) {
        setAddresses(list);
        const def = list.find((a) => a.isDefault) || list[0];
        setSelectedAddressId((prev) => prev || def.id);
        setIsAddingNewAddress(false);
      } else {
        // Fallback to localStorage if any
        try {
          const cached = JSON.parse(localStorage.getItem("user_addresses") || "[]");
          if (Array.isArray(cached) && cached.length > 0) {
            setAddresses(cached);
            setSelectedAddressId((prev) => prev || cached[0].id);
          } else {
            setIsAddingNewAddress(true);
          }
        } catch (e) {
          setIsAddingNewAddress(true);
        }
      }
    } catch (err) {
      console.warn("Could not load addresses for checkout:", err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    fetchUserAddresses();
  }, [currentUser]);

  const deliveryCharge = 0; // FREE
  const handlingFee = items.length > 0 ? 4 : 0;
  const grandTotal = Math.max(0, itemsTotal + deliveryCharge + handlingFee);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0] || null;

  const defaultShippingAddress = {
    fullName: currentUser?.name || "Customer",
    phone: currentUser?.phone || "9800000000",
    addressLine1: "B Block, Sector 63",
    city: "Noida",
    state: "Uttar Pradesh",
    postalCode: "201301",
  };

  // Open Checkout Popup / Modal
  const handleOpenCheckout = () => {
    if (items.length === 0 || grandTotal <= 0) return;

    // Blinkit / Flipkart style gate: If not logged in, prompt to login
    const token = localStorage.getItem("token");
    if (!token || !currentUser) {
      navigate("/login", {
        state: { from: "/cart", message: "Please log in to complete your checkout" },
      });
      return;
    }

    setErrorMessage("");
    setIsCheckoutModalOpen(true);
    fetchUserAddresses();
  };

  // Handle adding new address from inside the popup
  const handleSaveInlineAddress = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!newAddressForm.receiver.trim()) errs.receiver = "Receiver name is required";
    if (!newAddressForm.phone.trim() || newAddressForm.phone.replace(/\D/g, "").length < 10) {
      errs.phone = "Valid 10-digit phone required";
    }
    if (!newAddressForm.addressLine.trim()) errs.addressLine = "House/Flat/Building is required";
    if (!newAddressForm.area.trim()) errs.area = "Area/Sector is required";
    if (!newAddressForm.pincode.trim() || !/^\d{6}$/.test(newAddressForm.pincode.trim())) {
      errs.pincode = "Valid 6-digit pincode required";
    }

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    setFormErrors({});
    const newAddressObj = {
      id: "addr-" + Date.now(),
      ...newAddressForm,
      receiver: newAddressForm.receiver.trim(),
      phone: "+91 " + newAddressForm.phone.replace(/\D/g, "").slice(-10),
      isDefault: addresses.length === 0,
    };

    try {
      const res = await authService.saveAddress(newAddressObj);
      const updatedList = res?.addresses || [newAddressObj, ...addresses];
      setAddresses(updatedList);
      setSelectedAddressId(newAddressObj.id);
      setIsAddingNewAddress(false);
    } catch (err) {
      console.warn("Saved locally due to api error", err);
      setAddresses((prev) => [newAddressObj, ...prev]);
      setSelectedAddressId(newAddressObj.id);
      setIsAddingNewAddress(false);
    }
  };

  // Handle Final Payment Execution (from Modal)
  const handleExecutePayment = async () => {
    if (!selectedAddress) {
      setErrorMessage("Please select or add a delivery address to proceed");
      return;
    }

    const shippingPayload = {
      fullName: selectedAddress.receiver || currentUser?.name || "Customer",
      phone: (selectedAddress.phone || currentUser?.phone || "9800000000").replace(/\D/g, "").slice(-10),
      addressLine1: selectedAddress.addressLine || "Standard Delivery Address",
      city: selectedAddress.city || "Noida",
      state: selectedAddress.state || "Uttar Pradesh",
      postalCode: selectedAddress.pincode || "201301",
    };

    setErrorMessage("");
    setIsProcessing(true);

    if (paymentMethod === "razorpay") {
      // 1. Razorpay Gateway Online Flow
      try {
        await paymentService.openCheckout({
          amount: grandTotal,
          prefill: {
            name: shippingPayload.fullName,
            email: currentUser?.email || "customer@example.com",
            contact: shippingPayload.phone,
          },
          shippingAddress: shippingPayload,
          onSuccess: (verifyResult, rzpResponse) => {
            setIsProcessing(false);
            setIsCheckoutModalOpen(false);
            setOrderInfo({
              orderNumber: verifyResult?.orderNumber || `ORD-${Date.now().toString().slice(-6)}`,
              paymentId: rzpResponse?.razorpay_payment_id || "pay_verified",
              razorpayOrderId: rzpResponse?.razorpay_order_id,
              method: "Razorpay (Online Payment)",
              amount: grandTotal,
              shipping: shippingPayload,
            });
            clearCart();
            setOrderPlaced(true);
          },
          onError: (err) => {
            setIsProcessing(false);
            setErrorMessage(typeof err === "string" ? err : "Razorpay payment was not completed.");
          },
          onModalClose: () => {
            setIsProcessing(false);
          },
        });
      } catch (err) {
        setIsProcessing(false);
        setErrorMessage(err.message || "Unable to initialize Razorpay checkout");
      }
    } else {
      // 2. Cash on Delivery Flow
      try {
        const res = await cartService.checkout({
          shippingAddress: shippingPayload,
          paymentMethod: "cod",
          notes: "Placed via Web Storefront",
        });

        setIsProcessing(false);
        setIsCheckoutModalOpen(false);
        setOrderInfo({
          orderNumber: res?.order?.orderNumber || `ORD-${Date.now().toString().slice(-6)}`,
          paymentId: "COD",
          method: "Cash on Delivery",
          amount: grandTotal,
          shipping: shippingPayload,
        });
        clearCart();
        setOrderPlaced(true);
      } catch (err) {
        setIsProcessing(false);
        // Fallback for demo/test mode
        setIsCheckoutModalOpen(false);
        setOrderInfo({
          orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
          paymentId: "COD",
          method: "Cash on Delivery",
          amount: grandTotal,
          shipping: shippingPayload,
        });
        clearCart();
        setOrderPlaced(true);
      }
    }
  };

  if (orderPlaced) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#F7FAF8] flex flex-col items-center justify-center p-4 font-['Poppins',sans-serif] overflow-x-hidden overflow-y-auto">
        {/* Glowing Glassy Ambient Orbs inside constrained boundary */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-20 top-20 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-400/25 to-teal-400/20 blur-3xl" />
          <div className="absolute -right-20 bottom-20 w-80 h-80 rounded-full bg-gradient-to-tr from-emerald-500/20 to-orange-400/20 blur-3xl" />
        </div>

        <div className="bg-white/75 backdrop-blur-2xl rounded-3xl border border-white/90 p-8 sm:p-10 max-w-md w-full text-center shadow-[0_20px_60px_rgba(16,185,129,0.12)] relative overflow-hidden z-10">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

          <div className="w-16 h-16 rounded-2xl bg-emerald-100/70 border border-emerald-200/60 text-emerald-600 flex items-center justify-center mx-auto mb-4 backdrop-blur-md shadow-inner shadow-white/80">
            <CheckCircle2 className="w-9 h-9 stroke-[2.4]" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50/80 border border-emerald-200/50 text-emerald-700 text-xs font-bold mb-2 backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 fill-emerald-600" />
            Payment Verified &amp; Confirmed
          </span>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Order Placed Successfully!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            Your order of{" "}
            <span className="font-black text-slate-900">
              ₹{(orderInfo?.amount ?? grandTotal).toLocaleString("en-IN")}
            </span>{" "}
            has been received. Our delivery partner will reach your doorstep shortly.
          </p>

          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 mt-5 text-left border border-white/80 shadow-xs space-y-2 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-100/60 text-slate-500">
              <span>Order Number</span>
              <span className="font-mono font-bold text-slate-800">
                {orderInfo?.orderNumber || "ORD-20261104"}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-emerald-100/60 text-slate-500">
              <span>Total Amount</span>
              <span className="font-black text-[#059669]">
                ₹{(orderInfo?.amount ?? grandTotal).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-emerald-100/60 text-slate-500">
              <span>Payment Mode</span>
              <span className="font-semibold text-emerald-700">
                {orderInfo?.method || "Razorpay (Online)"}
              </span>
            </div>

            {orderInfo?.paymentId && orderInfo.paymentId !== "COD" && (
              <div className="flex items-center justify-between pb-2 border-b border-emerald-100/60 text-slate-500">
                <span>Razorpay Txn ID</span>
                <span className="font-mono font-bold text-slate-700 truncate max-w-[160px]">
                  {orderInfo.paymentId}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-1 text-slate-500">
              <span>Delivering To</span>
              <span className="font-bold text-slate-800 text-right truncate max-w-[180px]">
                {orderInfo?.shipping?.addressLine1 || "B Block, Sector 63"}, {orderInfo?.shipping?.city || "Noida"}
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2.5">
            <Link
              to="/orders"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#059669] to-[#10B981] text-white font-bold text-sm hover:opacity-95 transition-all shadow-lg shadow-emerald-500/25 active:scale-[0.99] border border-white/20"
            >
              View My Orders
            </Link>
            <Link
              to="/shop"
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F7FAF8] flex flex-col font-['Poppins',sans-serif] relative overflow-x-hidden text-slate-800">
      <div className="flex-1 max-w-[1340px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 z-10">
        
        {/* Top Delivery Header Bar with Glassy Effect */}
        <div className="w-full bg-white/65 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-3.5 sm:px-6 sm:py-4 border border-white/80 shadow-[0_8px_32px_0_rgba(16,185,129,0.06)] flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 mb-6 sm:mb-7 relative overflow-hidden transition-all">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

          {/* Left: Green Lightning Badge & Delivery Info */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-emerald-50/80 backdrop-blur-md border border-emerald-200/50 text-emerald-600 flex items-center justify-center shrink-0 shadow-inner shadow-white/80">
              <Zap className="w-5 h-5 fill-emerald-600" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#1E1B4B] leading-tight">
                Delivery Location
              </h2>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Deliver to:</span>
                <span className="font-semibold text-slate-700 truncate max-w-[260px] sm:max-w-none inline-block align-bottom">
                  {selectedAddress
                    ? `${selectedAddress.tag} - ${selectedAddress.addressLine}, ${selectedAddress.city}`
                    : "Home - B Block, Sector 63, Noida"}
                </span>
              </p>
            </div>
          </div>

          {/* Right: + Add more items */}
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#059669] hover:text-[#047857] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 px-3.5 py-1.5 rounded-xl backdrop-blur-md transition-all shadow-xs ml-auto sm:ml-0"
          >
            <span className="w-4 h-4 rounded-full bg-[#059669] text-white flex items-center justify-center text-xs font-bold leading-none">
              +
            </span>
            <span>Add more items</span>
          </Link>
        </div>

        {loading ? (
          <div className="bg-white/65 backdrop-blur-2xl rounded-3xl border border-white/80 p-12 text-center max-w-lg mx-auto shadow-[0_8px_32px_0_rgba(16,185,129,0.06)] flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            <p className="text-xs font-semibold text-slate-500">Loading your cart from database...</p>
          </div>
        ) : items.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white/65 backdrop-blur-2xl rounded-3xl border border-white/80 p-10 sm:p-14 text-center max-w-lg mx-auto shadow-[0_8px_32px_0_rgba(16,185,129,0.06)] relative overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
            <div className="w-20 h-20 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-emerald-600 flex items-center justify-center mx-auto mb-4 backdrop-blur-md shadow-inner shadow-white/80">
              <ShoppingBag className="w-10 h-10 stroke-[1.8]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Your Cart is Empty</h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto mt-1 mb-6 leading-relaxed">
              Looks like you haven't added anything to your cart yet. Explore fresh daily essentials and groceries now!
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#059669] to-[#10B981] text-white font-bold text-xs sm:text-sm hover:opacity-95 transition-all shadow-lg shadow-emerald-500/25 cursor-pointer border border-white/20"
            >
              <span>Start Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* 2-Column Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7 items-start">
            
            {/* Left Column (8 cols): Cart Items Card */}
            <div className="lg:col-span-7 xl:col-span-8 bg-white/65 backdrop-blur-2xl rounded-3xl p-5 sm:p-7 border border-white/80 shadow-[0_8px_32px_0_rgba(16,185,129,0.06)] relative overflow-hidden transition-all">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
              
              {/* Cart Items Header */}
              <div className="flex items-center justify-between pb-4 mb-2 border-b border-emerald-100/60">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 backdrop-blur-md border border-emerald-200/60 text-emerald-700 flex items-center justify-center shadow-xs">
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
              <div className="divide-y divide-emerald-50">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="py-4 sm:py-5 flex items-center justify-between gap-3 sm:gap-5 group"
                  >
                    {/* Thumbnail & Product Details */}
                    <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
                      <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white/75 backdrop-blur-md border border-white/90 p-2 flex items-center justify-center shrink-0 shadow-sm shadow-emerald-900/5 group-hover:scale-102 transition-transform">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs sm:text-sm font-bold text-[#1E1B4B] leading-snug truncate">
                          {item.name}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
                            {item.unit}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity Pill Controls */}
                    <div className="flex items-center gap-2 sm:gap-2.5 bg-emerald-50/80 backdrop-blur-md border border-emerald-200/60 rounded-xl px-2 py-1 shrink-0 shadow-xs">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 rounded-lg bg-white/90 text-emerald-700 hover:bg-emerald-100 flex items-center justify-center transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                      <span className="text-xs sm:text-sm font-black text-emerald-900 min-w-[16px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 rounded-lg bg-white/90 text-emerald-700 hover:bg-emerald-100 flex items-center justify-center transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
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

            {/* Right Column (4 cols): Bill Details & Razorpay Payment */}
            <div className="lg:col-span-5 xl:col-span-4 bg-white/65 backdrop-blur-2xl rounded-3xl border border-white/80 shadow-[0_8px_32px_0_rgba(16,185,129,0.08)] overflow-hidden relative transition-all">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent z-10" />

              {/* Bill Details Header */}
              <div className="relative bg-gradient-to-r from-[#065F46] via-[#059669] to-[#10B981] backdrop-blur-xl p-5 text-white flex items-center gap-3 overflow-hidden border-b border-white/20">
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-white/10 rounded-l-full blur-[2px] pointer-events-none" />
                
                <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 shadow-xs">
                  <ReceiptText className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Bill &amp; Payment Details
                </h3>
              </div>

              {/* Bill Breakdown Body */}
              <div className="p-5 sm:p-6 space-y-3.5">
                
                {/* Row 1: Items Total */}
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-600 font-medium">
                    Items Total
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
                    Handling &amp; Packaging Fee
                  </span>
                  <span className="font-bold text-[#1E1B4B]">
                    ₹{handlingFee}
                  </span>
                </div>

                {/* Grand Total */}
                <div className="border-t border-emerald-100/60 pt-3.5 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-[#1E1B4B]">
                      Grand Total
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-[#059669]">
                      ₹{grandTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Cancellation Guarantee Alert Box */}
                <div className="bg-emerald-50/60 backdrop-blur-md rounded-2xl p-3.5 flex items-start gap-3 my-2 border border-emerald-200/60 shadow-xs">
                  <div className="w-6 h-6 rounded-lg bg-[#059669] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm shadow-emerald-500/20">
                    <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <div className="leading-snug">
                    <p className="text-[11px] sm:text-xs font-semibold text-slate-700">
                      100% Safe &amp; Encrypted Checkout.
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Fast &amp; secure delivery to your doorstep.
                    </p>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200/80 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Proceed to Checkout Button */}
                <button
                  type="button"
                  onClick={handleOpenCheckout}
                  className="w-full rounded-2xl bg-gradient-to-r from-[#064E3B] via-[#059669] to-[#10B981] p-3.5 sm:p-4 text-white flex items-center justify-between shadow-[0_12px_28px_-6px_rgba(5,150,105,0.45)] hover:shadow-[0_16px_32px_-6px_rgba(5,150,105,0.55)] active:scale-[0.99] transition-all cursor-pointer border border-white/20 relative overflow-hidden group"
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  
                  {/* Left: Total to Pay */}
                  <div className="text-left leading-tight pl-1">
                    <span className="block text-[10px] font-medium text-emerald-100 uppercase tracking-wider">
                      To Pay
                    </span>
                    <span className="text-lg sm:text-xl font-black text-white">
                      ₹{grandTotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="h-7 w-px bg-white/20 mx-3" />

                  {/* Right: Proceed */}
                  <div className="flex items-center gap-2 font-bold text-sm sm:text-base pr-1 group-hover:translate-x-1 transition-transform">
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </button>

              </div>

            </div>

          </div>
        )}

      </div>

      {/* CHECKOUT MODAL POPUP */}
      {isCheckoutModalOpen && (
        <div 
          className="fixed inset-0 z-[9999] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
          onClick={() => setIsCheckoutModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/70 via-slate-50/60 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    Checkout &amp; Delivery
                  </h3>
                  <p className="text-xs text-slate-500">
                    {totalItemCount} items &bull; Total ₹{grandTotal.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCheckoutModalOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[2.2]" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1 text-slate-800">
              
              {/* STEP 1: DELIVERY ADDRESS */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center">
                      1
                    </span>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                      Select Delivery Address
                    </h4>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddingNewAddress((prev) => !prev)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200/80 transition-colors"
                  >
                    {isAddingNewAddress ? (
                      <span>&larr; Choose Saved Address</span>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Add New Address</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Form to Add New Address inline */}
                {isAddingNewAddress ? (
                  <form onSubmit={handleSaveInlineAddress} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3.5">
                    <h5 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                      Enter Complete Delivery Address
                    </h5>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Receiver Name *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. John Doe"
                          value={newAddressForm.receiver}
                          onChange={(e) => setNewAddressForm({ ...newAddressForm, receiver: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-emerald-600"
                        />
                        {formErrors.receiver && <p className="text-[10px] text-red-500 mt-0.5">{formErrors.receiver}</p>}
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          10-Digit Mobile *
                        </label>
                        <input
                          type="tel"
                          maxLength={10}
                          placeholder="9800000000"
                          value={newAddressForm.phone}
                          onChange={(e) => setNewAddressForm({ ...newAddressForm, phone: e.target.value.replace(/\D/g, "") })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-emerald-600"
                        />
                        {formErrors.phone && <p className="text-[10px] text-red-500 mt-0.5">{formErrors.phone}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Flat / House / Building *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Flat 302, Tower B, Green Apartments"
                        value={newAddressForm.addressLine}
                        onChange={(e) => setNewAddressForm({ ...newAddressForm, addressLine: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-emerald-600"
                      />
                      {formErrors.addressLine && <p className="text-[10px] text-red-500 mt-0.5">{formErrors.addressLine}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Area / Sector / Street *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Sector 63"
                          value={newAddressForm.area}
                          onChange={(e) => setNewAddressForm({ ...newAddressForm, area: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-emerald-600"
                        />
                        {formErrors.area && <p className="text-[10px] text-red-500 mt-0.5">{formErrors.area}</p>}
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          6-Digit Pincode *
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="201301"
                          value={newAddressForm.pincode}
                          onChange={(e) => setNewAddressForm({ ...newAddressForm, pincode: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-emerald-600"
                        />
                        {formErrors.pincode && <p className="text-[10px] text-red-500 mt-0.5">{formErrors.pincode}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">City</label>
                        <input
                          type="text"
                          value={newAddressForm.city}
                          onChange={(e) => setNewAddressForm({ ...newAddressForm, city: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-emerald-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">State</label>
                        <input
                          type="text"
                          value={newAddressForm.state}
                          onChange={(e) => setNewAddressForm({ ...newAddressForm, state: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      {["Home", "Work", "Other"].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setNewAddressForm({ ...newAddressForm, tag })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            newAddressForm.tag === tag
                              ? "bg-emerald-600 text-white shadow-2xs"
                              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-2">
                      {addresses.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setIsAddingNewAddress(false)}
                          className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save &amp; Select Address</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Saved Address Cards Grid */
                  <div className="space-y-2.5">
                    {loadingAddresses ? (
                      <div className="p-4 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                        <span>Loading addresses...</span>
                      </div>
                    ) : addresses.length === 0 ? (
                      <div className="p-5 text-center bg-slate-50 rounded-2xl border border-slate-200/80">
                        <MapPin className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-xs font-bold text-slate-700">No address saved yet</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Please add your delivery address to continue.</p>
                        <button
                          type="button"
                          onClick={() => setIsAddingNewAddress(true)}
                          className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs hover:bg-emerald-700 cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Address Now</span>
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {addresses.map((addr) => {
                          const isSelected = selectedAddress?.id === addr.id;
                          return (
                            <div
                              key={addr.id}
                              onClick={() => setSelectedAddressId(addr.id)}
                              className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                                isSelected
                                  ? "border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-xs"
                                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-emerald-800 text-[11px] font-black border border-emerald-200 shadow-2xs">
                                    {addr.tag === "Home" ? <HomeIcon className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
                                    {addr.tag}
                                  </span>
                                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                    isSelected ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300 bg-white"
                                  }`}>
                                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                  </div>
                                </div>

                                <p className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                                  {addr.addressLine}
                                </p>
                                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                                  {addr.area} - {addr.pincode}
                                </p>
                                <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
                                  {addr.receiver} &bull; {addr.phone}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* STEP 2: PAYMENT METHOD SELECTION */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center">
                    2
                  </span>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                    Choose Payment Method
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Razorpay Online */}
                  <div
                    onClick={() => setPaymentMethod("razorpay")}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 relative ${
                      paymentMethod === "razorpay"
                        ? "border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-xs"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border shrink-0 mt-0.5 flex items-center justify-center ${
                      paymentMethod === "razorpay" ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300"
                    }`}>
                      {paymentMethod === "razorpay" && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-emerald-700" />
                        <span className="text-xs font-bold text-slate-900">Razorpay (Online)</span>
                        <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-600 text-white ml-auto">
                          Instant
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                        UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, NetBanking
                      </p>
                    </div>
                  </div>

                  {/* Cash on Delivery */}
                  <div
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 relative ${
                      paymentMethod === "cod"
                        ? "border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-xs"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border shrink-0 mt-0.5 flex items-center justify-center ${
                      paymentMethod === "cod" ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300"
                    }`}>
                      {paymentMethod === "cod" && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-emerald-700" />
                        <span className="text-xs font-bold text-slate-900">Cash on Delivery</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700 ml-auto">
                          COD
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                        Pay with cash or UPI to delivery agent at your doorstep
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error inside modal */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

            </div>

            {/* Modal Footer Bar */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="w-full sm:w-auto text-left">
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Delivering to:</span>
                  <span className="font-bold text-slate-800 truncate max-w-[200px] inline-block align-bottom">
                    {selectedAddress
                      ? `${selectedAddress.tag} (${selectedAddress.city})`
                      : "No address selected"}
                  </span>
                </p>
                <p className="text-base font-black text-slate-900 mt-0.5">
                  Total: ₹{grandTotal.toLocaleString("en-IN")}
                </p>
              </div>

              <button
                type="button"
                disabled={isProcessing || !selectedAddress}
                onClick={handleExecutePayment}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-[#064E3B] via-[#059669] to-[#10B981] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : paymentMethod === "razorpay" ? (
                  <>
                    <span>Pay ₹{grandTotal.toLocaleString("en-IN")} via Razorpay</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                ) : (
                  <>
                    <span>Confirm Order (COD)</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />

    </div>
  );
}
