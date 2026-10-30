import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowRight } from "lucide-react";

export default function Latestcategories() {
  const categories = [
    {
      id: "electronics",
      title: "Electronics & Audio",
      subtitle: "Starting ₹499",
      link: "/category/electronics",
      bgColor: "bg-[#F0EEFF]",
      subColor: "text-[#7C3AED]",
      btnColor: "text-[#7C3AED]",
      image:
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=450&h=300&fit=crop&q=80",
      imageAlt: "Electronics and Audio - Laptop and Headphones",
    },
    {
      id: "grocery",
      title: "Grocery & Kitchen",
      subtitle: "Instant 10-min delivery",
      link: "/category/grocery",
      bgColor: "bg-[#EBFBF3]",
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
      bgColor: "bg-[#FDF0F4]",
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
      bgColor: "bg-[#FFF5EB]",
      subColor: "text-[#D97706]",
      btnColor: "text-[#D97706]",
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=450&h=300&fit=crop&q=80",
      imageAlt: "Home Decor and Appliances - Living Room Furniture and Plants",
    },
  ];

  return (
    <section className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Popular Categories
        </h2>
        <Link
          to="/category/electronics"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#4F46E5] hover:text-[#4338CA] transition-colors group cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={cat.link}
            className={`group relative flex items-center justify-between overflow-hidden rounded-2xl sm:rounded-3xl ${cat.bgColor} border border-black/5 p-4 sm:p-5 h-[135px] sm:h-[145px] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer`}
          >
            {/* Left Content */}
            <div className="flex flex-col justify-between h-full z-10 shrink-0 pr-2">
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-snug">
                  {cat.title}
                </h3>
                <p className={`text-xs font-semibold ${cat.subColor}`}>
                  {cat.subtitle}
                </p>
              </div>

              {/* Circular Action Arrow Button */}
              <div className="pt-2">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 shadow-xs flex items-center justify-center ${cat.btnColor} group-hover:bg-white group-hover:scale-110 transition-all duration-200`}
                >
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>
            </div>

            {/* Right Product Image */}
            <div className="relative h-full w-[48%] sm:w-[50%] flex items-center justify-end overflow-hidden">
              <img
                src={cat.image}
                alt={cat.imageAlt}
                loading="lazy"
                className="h-full w-full object-cover rounded-xl transform group-hover:scale-105 transition-transform duration-500 shadow-2xs"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

