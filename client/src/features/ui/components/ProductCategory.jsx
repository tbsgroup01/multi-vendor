import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { categoryService, getUploadUrl } from "../../../services";

import dairyBreadEggsImg from "../../../assets/category/dairy-bread-eggs.png";
import coldDrinksJuicesImg from "../../../assets/category/cold-drinks-juices.png";

// Preset packshots map as fallback
const PRESET_MAP = {
  "dairy-bread-eggs": dairyBreadEggsImg,
  "cold-drinks-juices": coldDrinksJuicesImg,
};

// Resolver for DB category image URLs
const resolveCategoryImage = (cat) => {
  if (!cat) return dairyBreadEggsImg;
  const img = cat.image;
  if (img && typeof img === "string") {
    return getUploadUrl(img);
  }
  if (cat.slug && PRESET_MAP[cat.slug]) {
    return PRESET_MAP[cat.slug];
  }
  return dairyBreadEggsImg;
};

export default function ProductCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchCategoriesFromDb = async () => {
      try {
        setLoading(true);
        const res = await categoryService.getAllCategories();
        if (isMounted && res && Array.isArray(res.categories) && res.categories.length > 0) {
          // Filter to show active categories
          const activeList = res.categories.filter((c) => c.status !== "Inactive");
          setCategories(activeList.length > 0 ? activeList : res.categories);
        }
      } catch (err) {
        console.error("Failed to load categories from DB:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCategoriesFromDb();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="w-full py-5">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Glassmorphic Card Panel */}
        <div className="bg-white/65 backdrop-blur-2xl rounded-3xl p-5 sm:p-7 border border-white/80 shadow-[0_8px_32px_0_rgba(16,185,129,0.06)] relative overflow-hidden transition-all">
          {/* Glass Top Highlight Sheen */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-emerald-100/60">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-6 rounded-full bg-gradient-to-b from-emerald-500 to-teal-600 block shadow-xs" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Shop by Category
              </h2>
            </div>

            <Link
              to="/category/all"
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 px-3.5 py-1.5 rounded-full backdrop-blur-md transition-all shadow-xs"
            >
              <span>See All</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Dynamic Categories Grid from Database */}
          {loading && categories.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2.5 text-slate-400">
              <Loader2 className="w-7 h-7 text-emerald-600 animate-spin" />
              <p className="text-xs font-semibold">Loading categories from database...</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-x-3 gap-y-5 sm:gap-x-4 sm:gap-y-6">
              {categories.map((cat) => {
                const imgUrl = resolveCategoryImage(cat);
                const targetSlug = cat.slug || cat.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-");

                return (
                  <Link
                    key={cat.id}
                    to={`/category/${targetSlug}`}
                    className="group flex flex-col items-center cursor-pointer transition-all duration-200 hover:-translate-y-1"
                  >
                    {/* Clean Frosted Cutout Card */}
                    <div className="w-full aspect-square rounded-2xl bg-white/70 backdrop-blur-md p-2 flex items-center justify-center overflow-hidden border border-white/85 shadow-xs group-hover:shadow-md  group-hover:bg-white/95 transition-all duration-300">
                      <img
                        src={imgUrl}
                        alt={cat.name}
                        onError={(e) => {
                          const fallback = (cat.slug && PRESET_MAP[cat.slug]) || dairyBreadEggsImg;
                          if (e.currentTarget.src !== fallback) {
                            e.currentTarget.src = fallback;
                          }
                        }}
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>

                    {/* Pixel-Perfect Aligned Label */}
                    <div className="w-full min-h-[34px] flex items-start justify-center mt-2 px-0.5">
                      <span className="text-[12px] sm:text-[13px] font-semibold text-slate-700 text-center leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
                        {cat.name}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
