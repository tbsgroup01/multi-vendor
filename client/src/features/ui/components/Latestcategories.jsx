import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowRight, Loader2 } from "lucide-react";
import { categoryService, getUploadUrl } from "../../../services";

import dairyBreadEggsImg from "../../../assets/category/dairy-bread-eggs.png";
import coldDrinksJuicesImg from "../../../assets/category/cold-drinks-juices.png";

const PRESET_IMAGE_MAP = {
  "dairy-bread-eggs": dairyBreadEggsImg,
  "cold-drinks-juices": coldDrinksJuicesImg,
};

const COLOR_THEMES = [
  {
    glowColor: "bg-emerald-500/20",
    subColor: "text-[#059669]",
    btnColor: "text-[#059669]",
  },
  {
    glowColor: "bg-blue-500/20",
    subColor: "text-[#2563EB]",
    btnColor: "text-[#2563EB]",
  },
  {
    glowColor: "bg-amber-500/20",
    subColor: "text-[#D97706]",
    btnColor: "text-[#D97706]",
  },
  {
    glowColor: "bg-pink-500/20",
    subColor: "text-[#DB2777]",
    btnColor: "text-[#DB2777]",
  },
  {
    glowColor: "bg-purple-500/20",
    subColor: "text-[#7C3AED]",
    btnColor: "text-[#7C3AED]",
  },
  {
    glowColor: "bg-teal-500/20",
    subColor: "text-[#0D9488]",
    btnColor: "text-[#0D9488]",
  },
];

const resolveCatImage = (cat) => {
  if (!cat) return dairyBreadEggsImg;
  if (cat.image && typeof cat.image === "string") {
    return getUploadUrl(cat.image);
  }
  const slug = cat.slug || cat.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  if (slug && PRESET_IMAGE_MAP[slug]) {
    return PRESET_IMAGE_MAP[slug];
  }
  return dairyBreadEggsImg;
};

export default function Latestcategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchPopularCategories = async () => {
      try {
        setLoading(true);
        const res = await categoryService.getAllCategories();
        if (isMounted && res && Array.isArray(res.categories)) {
          const activeOnly = res.categories.filter((c) => c.status !== "Inactive");
          setCategories(activeOnly.length > 0 ? activeOnly : res.categories);
        }
      } catch (err) {
        console.error("Failed to load popular categories from DB:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPopularCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-6 rounded-full bg-gradient-to-b from-emerald-500 to-teal-600 block shadow-xs" />
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Popular Categories
          </h2>
        </div>
        <Link
          to="/category/all"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#059669] hover:text-[#047857] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 px-3.5 py-1.5 rounded-full backdrop-blur-md transition-all shadow-xs group cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Loading Skeleton */}
      {loading && categories.length === 0 ? (
        <div className="py-10 flex flex-col items-center justify-center gap-2 text-slate-400">
          <Loader2 className="w-7 h-7 text-emerald-600 animate-spin" />
          <p className="text-xs font-semibold">Loading popular categories from database...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs font-semibold">
          No categories available.
        </div>
      ) : (
        /* Dynamic Category Cards Grid */
        <div
          className={`grid gap-4 sm:gap-5 ${
            categories.length === 1
              ? "grid-cols-1 max-w-md"
              : categories.length === 2
              ? "grid-cols-1 sm:grid-cols-2"
              : categories.length === 3
              ? "grid-cols-1 sm:grid-cols-3"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          }`}
        >
          {categories.map((cat, idx) => {
            const theme = COLOR_THEMES[idx % COLOR_THEMES.length];
            const targetSlug =
              cat.slug || cat.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            const imgUrl = resolveCatImage(cat);
            const subtitle = cat.description || "Daily Fresh & Best Quality";

            return (
              <Link
                key={cat.id || idx}
                to={`/category/${targetSlug}`}
                className="group relative flex items-center justify-between overflow-hidden rounded-2xl sm:rounded-3xl bg-white/65 backdrop-blur-2xl border border-white/80 p-4 sm:p-5 h-[135px] sm:h-[145px] shadow-[0_8px_32px_0_rgba(109,40,217,0.06)] hover:shadow-[0_12px_40px_0_rgba(109,40,217,0.12)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                {/* Top Glass Highlight Reflection */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

                {/* Soft Ambient Tint Glow Inside Card */}
                <div
                  className={`pointer-events-none absolute -left-10 -bottom-10 w-32 h-32 rounded-full ${theme.glowColor} blur-2xl`}
                />

                <div className="flex flex-col justify-between h-full z-10 shrink-0 pr-2 max-w-[55%]">
                  <div className="space-y-1">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-snug line-clamp-1">
                      {cat.name}
                    </h3>
                    <p className={`text-xs font-bold line-clamp-2 ${theme.subColor}`}>
                      {subtitle}
                    </p>
                  </div>
                  <div className="pt-2">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/80 backdrop-blur-md border border-white/90 shadow-xs flex items-center justify-center ${theme.btnColor} group-hover:bg-white group-hover:scale-110 transition-all duration-200`}
                    >
                      <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  </div>
                </div>

                {/* Right Product Image with Glass Tint */}
                <div className="relative h-full w-[45%] sm:w-[45%] flex items-center justify-center overflow-hidden z-10 p-1">
                  <img
                    src={imgUrl}
                    alt={cat.name}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain rounded-xl transform group-hover:scale-110 transition-transform duration-500 drop-shadow-md"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
