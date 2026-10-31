import React, { useState } from "react";
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
} from "lucide-react";
import Footer from "../components/Footer";

export default function MyOrders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "orders";
  const [activeTab, setActiveTab] = useState(initialTab);

  // Synchronize query param
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Mock Orders Data (Blinkit Style)
  const [orders, setOrders] = useState([
    {
      id: "ORD-982314",
      date: "Today, 11:42 AM",
      status: "Delivered",
      statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      deliveryTime: "Delivered in 12 mins",
      address: "Home - B Block, Sector 63, Noida",
      total: 190,
      itemsCount: 3,
      items: [
        {
          name: "Amul Taaza Fresh Toned Milk",
          unit: "1 L",
          quantity: 2,
          price: 54,
          image:
            "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop&q=80",
        },
        {
          name: "Harvest Gold White Sandwich Bread",
          unit: "400 g",
          quantity: 1,
          price: 40,
          image:
            "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop&q=80",
        },
        {
          name: "Farm Fresh Brown Table Eggs",
          unit: "Pack of 6",
          quantity: 1,
          price: 68,
          image:
            "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200&h=200&fit=crop&q=80",
        },
      ],
    },
    {
      id: "ORD-741289",
      date: "Yesterday, 6:15 PM",
      status: "Delivered",
      statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      deliveryTime: "Delivered in 14 mins",
      address: "Home - B Block, Sector 63, Noida",
      total: 155,
      itemsCount: 2,
      items: [
        {
          name: "Coca-Cola Original Taste Can",
          unit: "300 ml",
          quantity: 2,
          price: 40,
          image:
            "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200&h=200&fit=crop&q=80",
        },
        {
          name: "Haldiram's Classic Bhujia Sev",
          unit: "200 g",
          quantity: 1,
          price: 55,
          image:
            "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=200&h=200&fit=crop&q=80",
        },
      ],
    },
    {
      id: "ORD-519842",
      date: "24 Oct 2026, 8:30 PM",
      status: "Delivered",
      statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      deliveryTime: "Delivered in 11 mins",
      address: "Office - Tech Park, Sector 62, Noida",
      total: 320,
      itemsCount: 2,
      items: [
        {
          name: "Shimla Crisp Royal Gala Apples",
          unit: "4 pcs (~600 g)",
          quantity: 1,
          price: 140,
          image:
            "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop&q=80",
        },
        {
          name: "Tropicana 100% Orange Fruit Juice",
          unit: "1 L",
          quantity: 1,
          price: 125,
          image:
            "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=200&h=200&fit=crop&q=80",
        },
      ],
    },
  ]);

  // Saved Addresses with localStorage persistence
  const [addresses, setAddresses] = useState(() => {
    try {
      const stored = localStorage.getItem("user_addresses");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    const defaults = [
      {
        id: "addr-1",
        tag: "Home",
        isDefault: true,
        addressLine: "B-42, 2nd Floor, Sector 63",
        area: "Noida, Gautam Buddha Nagar, Uttar Pradesh",
        pincode: "201301",
        receiver: "Shashank",
        phone: "+91 9800000000",
      },
      {
        id: "addr-2",
        tag: "Work",
        isDefault: false,
        addressLine: "Tech Park, Tower C, 4th Floor",
        area: "Sector 62, Noida, Uttar Pradesh",
        pincode: "201309",
        receiver: "Shashank",
        phone: "+91 9800000000",
      },
    ];
    try {
      localStorage.setItem("user_addresses", JSON.stringify(defaults));
    } catch (e) {}
    return defaults;
  });

  const handleDeleteAddress = (id) => {
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
            <Link to="/" className="hover:text-purple-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900">
              {activeTab === "orders" ? "My Orders" : "My Addresses"}
            </span>
          </div>

          <Link
            to="/cart"
            className="text-xs font-bold text-purple-600 hover:text-purple-700 transition-colors"
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
              <div className="w-11 h-11 rounded-full bg-purple-100 text-purple-700 font-black text-base flex items-center justify-center shrink-0">
                S
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-slate-900 truncate">Shashank</h2>
                <p className="text-xs text-slate-500 truncate">+91 9800000000</p>
              </div>
            </div>

            {/* Navigation Tabs (Blinkit Style) */}
            <nav className="space-y-1">
              <button
                onClick={() => handleTabChange("orders")}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "orders"
                    ? "bg-purple-50 text-purple-700 shadow-2xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4" />
                  <span>My Orders</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white font-extrabold text-purple-700 border border-purple-200">
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => handleTabChange("addresses")}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "addresses"
                    ? "bg-purple-50 text-purple-700 shadow-2xs"
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
                      Showing {orders.length} delivered fast
                    </p>
                  </div>
                </div>

                {orders.map((ord) => {
                  const isReordered = reorderSuccess === ord.id;

                  return (
                    <article
                      key={ord.id}
                      className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-xs hover:border-slate-300 transition-all"
                    >
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                            <Zap className="w-5 h-5 fill-purple-600" />
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
                            {ord.itemsCount} items &bull; Paid Online
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
                })}
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
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Add New Address</span>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
                    >
                      <div>
                        {/* Tag & Default Badge */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 font-extrabold text-xs border border-purple-200">
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
                        <button className="text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer">
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
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
              </div>
            )}

          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}

