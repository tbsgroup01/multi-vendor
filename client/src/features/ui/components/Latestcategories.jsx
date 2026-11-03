import { Link } from "react-router-dom";
import { ChevronRight, ArrowRight } from "lucide-react";

export default function Latestcategories() {
  const categories = [
    {
      id: "electronics",
      title: "Electronics & Audio",
      subtitle: "Starting ₹499",
      link: "/category/electronics",
      glowColor: "bg-emerald-500/20",
      subColor: "text-[#059669]",
      btnColor: "text-[#059669]",
      image:
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=450&h=300&fit=crop&q=80",
      imageAlt: "Electronics and Audio - Laptop and Headphones",
    },
    {
      id: "grocery",
      title: "Grocery & Kitchen",
      subtitle: "Instant 10-min delivery",
      link: "/category/grocery",
      glowColor: "bg-emerald-500/20",
      subColor: "text-[#059669]",
      btnColor: "text-[#059669]",
      image:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=450&h=300&fit=crop&q=80",
      imageAlt: "Grocery and Kitchen - Fresh produce and pantry essentials",
    },
    {
      id: "fashion",
      title: "Trendy Fashion",
      subtitle: "Top Brands",
      link: "/category/fashion",
      glowColor: "bg-pink-500/20",
      subColor: "text-[#DB2777]",
      btnColor: "text-[#DB2777]",
      image:
        "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=450&h=300&fit=crop&q=80",
      imageAlt: "Trendy Fashion - Apparel, Bag and Sneakers",
    },
    {
      id: "home",
      title: "Home Decor & Appliances",
      subtitle: "Upgrade Your Space",
      link: "/category/home",
      glowColor: "bg-amber-500/20",
      subColor: "text-[#D97706]",
      btnColor: "text-[#D97706]",
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=450&h=300&fit=crop&q=80",
      imageAlt: "Home Decor and Appliances - Living Room Furniture and Plants",
    },
  ];

  return (
    <section className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Popular Categories
        </h2>
        <Link
          to="/category/electronics"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#059669] hover:text-[#047857] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 px-3.5 py-1.5 rounded-full backdrop-blur-md transition-all shadow-xs group cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={cat.link}
            className="group relative flex items-center justify-between overflow-hidden rounded-2xl sm:rounded-3xl bg-white/65 backdrop-blur-2xl border border-white/80 p-4 sm:p-5 h-[135px] sm:h-[145px] shadow-[0_8px_32px_0_rgba(109,40,217,0.06)] hover:shadow-[0_12px_40px_0_rgba(109,40,217,0.12)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            {/* Top Glass Highlight Reflection */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
            
            {/* Soft Ambient Tint Glow Inside Card */}
            <div className={`pointer-events-none absolute -left-10 -bottom-10 w-32 h-32 rounded-full ${cat.glowColor} blur-2xl`} />

            <div className="flex flex-col justify-between h-full z-10 shrink-0 pr-2">
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-snug">
                  {cat.title}
                </h3>
                <p className={`text-xs font-bold ${cat.subColor}`}>
                  {cat.subtitle}
                </p>
              </div>
              <div className="pt-2">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/80 backdrop-blur-md border border-white/90 shadow-xs flex items-center justify-center ${cat.btnColor} group-hover:bg-white group-hover:scale-110 transition-all duration-200`}
                >
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>
            </div>

            {/* Right Product Image with Glass Tint */}
            <div className="relative h-full w-[48%] sm:w-[50%] flex items-center justify-end overflow-hidden z-10">
              <img
                src={cat.image}
                alt={cat.imageAlt}
                loading="lazy"
                className="h-full w-full object-cover rounded-2xl transform group-hover:scale-105 transition-transform duration-500 shadow-xs border border-white/60"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
