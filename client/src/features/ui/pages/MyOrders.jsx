import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Package,
  MapPin,
  Clock,
  RotateCcw,
  CheckCircle2,
  FileText,
  ChevronRight,
  Plus,
  Home as HomeIcon,
  Briefcase,
  Building2,
  Trash2,
  Edit2,
  Zap,
  ArrowRight,
  Sparkles,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import Footer from "../components/Footer";
import { orderService, authService, getUploadUrl } from "../../../services";
import { getStoredUser } from "../../auth/RoleMiddleware";

export default function MyOrders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "orders";
  const [activeTab, setActiveTab] = useState(initialTab);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = getStoredUser();
  const userName = user?.name || "Customer";
  const userPhone = user?.phone || "+91 9800000000";
  const userInitial = (userName[0] || "C").toUpperCase();

  // Synchronize query param
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Fetch Real Orders from Database
  useEffect(() => {
    let isMounted = true;
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await orderService.getMyOrders({ limit: 50 });
        if (!isMounted) return;

        if (res && res.orders && Array.isArray(res.orders)) {
          const mapped = res.orders.map((ord) => {
            let parsedAddr = "";
            try {
              const a =
                typeof ord.shippingAddress === "string"
                  ? JSON.parse(ord.shippingAddress)
                  : ord.shippingAddress;
              if (a) {
                parsedAddr = [
                  a.addressLine1 || a.addressLine,
                  a.city,
                  a.state,
                  a.postalCode || a.pincode,
                ]
                  .filter(Boolean)
                  .join(", ");
              }
            } catch (e) {
              parsedAddr = ord.shippingAddress || "";
            }

            const dateObj = new Date(ord.createdAt);
            const dateStr = !isNaN(dateObj.getTime())
              ? dateObj.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Recent";

            const items = (ord.items || []).map((item) => {
              let img = item.productImage;
              if (!img && item.product?.images) {
                const imgs = item.product.images;
                if (Array.isArray(imgs) && imgs.length > 0) img = imgs[0];
                else if (typeof imgs === "string") {
                  try {
                    const p = JSON.parse(imgs);
                    if (Array.isArray(p)) img = p[0];
                    else img = imgs;
                  } catch (e) {
                    img = imgs.split(",")[0]?.trim();
                  }
                }
              }

              return {
                name: item.productName || item.product?.name || "Product",
                unit: item.variantName || "1 unit",
                quantity: item.quantity || 1,
                price: Number(item.productPrice || 0),
                image:
                  getUploadUrl(img) ||
                  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop&q=80",
              };
            });

            const rawStatus = (ord.orderStatus || ord.status || "placed").toLowerCase();
            const statusFormatted =
              rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);

            let statusColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
            if (rawStatus === "cancelled") {
              statusColor = "bg-rose-50 text-rose-700 border-rose-200";
            } else if (rawStatus === "processing" || rawStatus === "placed") {
              statusColor = "bg-blue-50 text-blue-700 border-blue-200";
            } else if (rawStatus === "shipped") {
              statusColor = "bg-amber-50 text-amber-700 border-amber-200";
            }

            const paymentDisplay =
              ord.paymentMethod === "cod"
                ? "Cash on Delivery"
                : ord.paymentStatus === "completed"
                ? "Paid Online"
                : "Payment Pending";

            return {
              id: ord.orderNumber || `ORD-${ord.id}`,
              date: dateStr,
              status: statusFormatted,
              statusColor,
              deliveryTime:
                rawStatus === "delivered"
                  ? "Delivered"
                  : "Order Confirmed",
              address: parsedAddr || "Saved Delivery Address",
              total: Number(ord.totalAmount || 0),
              itemsCount:
                items.length > 0
                  ? items.reduce((sum, it) => sum + it.quantity, 0)
                  : 1,
              paymentMethod: paymentDisplay,
              items,
            };
          });
          setOrders(mapped);
        } else {
          setOrders([]);
        }
      } catch (err) {
        if (isMounted) {
          console.warn("Could not load orders from DB:", err);
          setError("Failed to load orders from database");
          setOrders([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrders();
    return () => {
      isMounted = false;
    };
  }, []);

  // Saved Addresses with database & fallback persistence
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchAddresses = async () => {
      try {
        setLoadingAddresses(true);
        const data = await authService.getAddresses();
        if (!isMounted) return;
        if (Array.isArray(data) && data.length > 0) {
          setAddresses(data);
          try {
            localStorage.setItem("user_addresses", JSON.stringify(data));
          } catch (e) {}
        } else {
          // If DB returned empty, check localStorage cache
          const cached = localStorage.getItem("user_addresses");
          if (cached) {
            try {
              const parsed = JSON.parse(cached);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setAddresses(parsed);
              }
            } catch (e) {}
          }
        }
      } catch (err) {
        console.warn("Could not fetch addresses:", err);
      } finally {
        if (isMounted) setLoadingAddresses(false);
      }
    };

    fetchAddresses();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDeleteAddress = async (id) => {
    try {
      await authService.deleteAddress(id);
    } catch (e) {
      console.warn("Delete address API failed:", e);
    }
    setAddresses((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      try {
        localStorage.setItem("user_addresses", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const [reorderSuccess, setReorderSuccess] = useState(null);

  const handleReorder = (orderId) => {
    setReorderSuccess(orderId);
    setTimeout(() => {
      setReorderSuccess(null);
    }, 2500);
  };

  return (
    <div className="w-full min-h-screen bg-[#F6F8FD] flex flex-col font-sans">
      
      {/* Breadcrumb Header */}
      <div className="w-full bg-white border-b border-slate-100 shadow-2xs">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Link to="/" className="hover:text-emerald-700 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900">
              {activeTab === "orders" ? "My Orders" : "My Addresses"}
            </span>
          </div>

          <Link
            to="/cart"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            Go to Cart &rarr;
          </Link>
        </div>
      </div>

      {/* Main Account / Orders Content */}
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* ================= LEFT SIDEBAR (TABS) ================= */}
          <aside className="md:col-span-4 lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-xs sticky top-[90px]">
            {/* User Profile Card */}
            <div className="flex items-center gap-3 p-3 mb-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-800 font-black text-base flex items-center justify-center shrink-0">
                {userInitial}
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-slate-900 truncate">{userName}</h2>
                <p className="text-xs text-slate-500 truncate">{userPhone}</p>
              </div>
            </div>

            {/* Navigation Tabs (Blinkit Style) */}
            <nav className="space-y-1">
              <button
                onClick={() => handleTabChange("orders")}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "orders"
                    ? "bg-emerald-50 text-emerald-800 shadow-2xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4" />
                  <span>My Orders</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white font-extrabold text-emerald-800 border border-emerald-200">
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => handleTabChange("addresses")}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "addresses"
                    ? "bg-emerald-50 text-emerald-800 shadow-2xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4" />
                  <span>My Addresses</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white font-extrabold text-slate-600 border border-slate-200">
                  {addresses.length}
                </span>
              </button>
            </nav>
          </aside>

          {/* ================= RIGHT MAIN AREA ================= */}
          <section className="md:col-span-8 lg:col-span-9">
            
            {/* TAB 1: MY ORDERS */}
            {activeTab === "orders" && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex items-center justify-between">
                  <div>
                    <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                      Past Orders
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {loading
                        ? "Loading orders from database..."
                        : `Showing ${orders.length} order${orders.length === 1 ? "" : "s"}`}
                    </p>
                  </div>
                </div>

                {loading ? (
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-7 h-7 text-emerald-600 animate-spin" />
                    <p className="text-xs font-semibold text-slate-500">
                      Fetching your orders from database...
                    </p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-10 sm:p-14 text-center shadow-xs flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                      <ShoppingBag className="w-7 h-7" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">
                      No orders placed yet
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mb-4">
                      Looks like you haven't placed any orders yet. Discover fresh groceries and daily essentials!
                    </p>
                    <Link
                      to="/shop"
                      className="px-5 py-2.5 rounded-xl bg-[#0c831f] hover:bg-[#096918] text-white font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-700/20 active:scale-95"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  orders.map((ord) => {
                    const isReordered = reorderSuccess === ord.id;

                    return (
                      <article
                        key={ord.id}
                        className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-xs hover:border-slate-300 transition-all"
                      >
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                              <Zap className="w-5 h-5 fill-emerald-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-slate-900">
                                  Order #{ord.id}
                                </span>
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${ord.statusColor}`}
                                >
                                  <CheckCircle2 className="w-3 h-3" />
                                  {ord.status}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                                <span>{ord.date}</span> &bull; <span>{ord.deliveryTime}</span>
                              </p>
                            </div>
                          </div>

                          {/* Order Total */}
                          <div className="text-left sm:text-right">
                            <span className="text-base sm:text-lg font-black text-slate-900">
                              ₹{ord.total}
                            </span>
                            <span className="text-[11px] text-slate-400 block">
                              {ord.itemsCount} items &bull; {ord.paymentMethod}
                            </span>
                          </div>
                        </div>

                        {/* Items Preview */}
                        <div className="py-4 space-y-3">
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-11 h-11 rounded-lg bg-slate-50 border border-slate-200/70 p-1 shrink-0 overflow-hidden">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-contain mix-blend-multiply rounded p-0.5"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <span className="font-semibold text-slate-800 block truncate">
                                    {item.name}
                                  </span>
                                  <span className="text-[11px] text-slate-400">
                                    {item.unit} &times; {item.quantity}
                                  </span>
                                </div>
                              </div>
                              <span className="font-black text-slate-800 shrink-0">
                                ₹{item.price * item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Footer Actions & Address */}
                        <div className="pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{ord.address}</span>
                          </p>
                        </div>

                      </article>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB 2: MY ADDRESSES */}
            {activeTab === "addresses" && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex items-center justify-between">
                  <div>
                    <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                      Saved Addresses
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Manage your delivery locations 
                    </p>
                  </div>
                  
                  <Link
                    to="/add-address"
                    className="px-3.5 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Add New Address</span>
                  </Link>
                </div>

                {loadingAddresses ? (
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-8 flex items-center justify-center gap-2 text-slate-500 shadow-xs">
                    <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                    <span className="text-xs font-bold">Loading saved addresses...</span>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center shadow-xs">
                    <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-2.5" />
                    <h3 className="text-sm sm:text-base font-bold text-slate-800">
                      No Saved Addresses Yet
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Add your home or work delivery address for fast doorstep delivery.
                    </p>
                    <Link
                      to="/add-address"
                      className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Add New Address</span>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
                      >
                        <div>
                          {/* Tag & Default Badge */}
                          <div className="flex items-center justify-between mb-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-extrabold text-xs border border-emerald-200">
                              {addr.tag === "Home" ? (
                                <HomeIcon className="w-3.5 h-3.5" />
                              ) : (
                                <Briefcase className="w-3.5 h-3.5" />
                              )}
                              {addr.tag}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                Default
                              </span>
                            )}
                          </div>

                          {/* Full Address Details */}
                          <h3 className="text-sm font-bold text-slate-900 leading-snug">
                            {addr.addressLine}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            {addr.area} - <span className="font-semibold text-slate-700">{addr.pincode}</span>
                          </p>
                          <p className="text-xs text-slate-400 mt-2 font-medium">
                            Receiver: <span className="text-slate-700 font-semibold">{addr.receiver}</span> ({addr.phone})
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                          <span className="text-[11px] text-slate-400 font-medium">
                            {addr.city}, {addr.state}
                          </span>
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-slate-400 hover:text-red-600 flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}

