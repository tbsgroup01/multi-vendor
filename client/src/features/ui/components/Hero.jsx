import{ useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Zap,
  MapPin,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Img from "../../../assets/multi.png";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      badge: "MEGA TECH FESTIVAL",
      badgeColor: "bg-amber-400 text-slate-950 font-black",
      title: "Next-Gen Tech at",
      highlight: "Unbeatable Prices.",
      subtitle:
        "Flagship smartphones, high-performance laptops, 4K smart TVs, and premium audio.",
      ctaText: "Shop Electronics",
      ctaLink: "/category/electronics",
      gradient: "from-[#0F172A] via-[#064E3B] to-[#047857]",
      accentGlow: "bg-emerald-500/20",
      promoCode: "Use code TECH10 for extra savings",
      discount: "FESTIVE SPECIAL DEALS",
    },
    {
      id: 2,
      badge: "10-MIN EXPRESS GROCERY",
      badgeColor: "bg-emerald-400 text-slate-950 font-black",
      title: "Daily Fresh Essentials",
      highlight: "At Your Doorstep.",
      subtitle:
        "Farm fresh veggies, organic dairy, gourmet snacks, and beverages delivered ",
      ctaText: "Order Groceries",
      ctaLink: "/category/grocery",
      gradient: "from-[#064E3B] via-[#065F46] to-[#047857]",
      accentGlow: "bg-emerald-500/20",
      promoCode: "FREE Delivery on first 3 orders",
      discount: "INSTANT EXPRESS DELIVERY",
    },
    {
      id: 3,
      badge: "SUMMER FASHION CARNIVAL",
      badgeColor: "bg-rose-400 text-slate-950 font-black",
      title: "Upgrade Your Wardrobe",
      highlight: "With Top Brands.",
      subtitle:
        "Trending sneakers, oversized tees, luxury watches, and designer apparel.",
      ctaText: "Explore Fashion",
      ctaLink: "/category/fashion",
      gradient: "from-[#831843] via-[#701A75] to-[#4C1D95]",
      accentGlow: "bg-pink-500/20",
      promoCode: "Special Prices on Top 100+ Brands",
      discount: "NEW SEASON ARRIVALS",
    },
  ];
  const categories = [
    {
      name: "Vegetables & Fruits",
      image:
        "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=80&h=80&fit=crop&q=80",
    },
    {
      name: "Dairy, Bread & Eggs",
      image:
        "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=80&h=80&fit=crop&q=80",
    },
    {
      name: "Snacks & Munchies",
      image:
        "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=80&h=80&fit=crop&q=80",
    },
    {
      name: "Mobiles & Gadgets",
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=80&h=80&fit=crop&q=80",
    },
    {
      name: "Fashion & Apparel",
      image:
        "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=80&h=80&fit=crop&q=80",
    },
    {
      name: "Home & Kitchen",
      image:
        "https://images.unsplash.com/photo-1584990347449-397cf1e9ebc9?w=80&h=80&fit=crop&q=80",
    },
    {
      name: "Beauty & Grooming",
      image:
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=80&h=80&fit=crop&q=80",
    },
  ];
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5500);
    return () => clearInterval(slideTimer);
  }, [slides.length]);

  return (
    <div className="w-full bg-transparent">
      <div className="bg-white/65 backdrop-blur-xl border-b border-white/80 shadow-[0_4px_25px_rgba(109,40,217,0.03)] transition-all">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center gap-2.5 shrink-0 bg-emerald-50/80 backdrop-blur-md text-emerald-800 px-3.5 py-1.5 rounded-full border border-emerald-200/60 shadow-xs">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
              <MapPin className="w-3.5 h-3.5" />
              <span>Deliver to: <b>Delhi NCR - 110001</b></span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to="/register"
                className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/70 hover:bg-white/95 border border-white/80 hover:border-emerald-300 transition-all text-xs font-bold text-slate-700 hover:text-emerald-700 whitespace-nowrap backdrop-blur-md shadow-2xs"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-5 h-5 rounded-full object-contain mix-blend-multiply shrink-0 shadow-2xs"
                />
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-8 relative rounded-3xl overflow-hidden shadow-[0_15px_45px_rgba(76,29,149,0.35)] min-h-[460px] sm:min-h-[500px] flex flex-col justify-between p-6 sm:p-9 text-white transition-all border border-white/20 backdrop-blur-sm">
            {/* Glass Top Highlight Sheen */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent z-20" />

            <div
              className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].gradient} transition-all duration-700`}
            />
            <div
              className={`absolute -top-24 -right-24 h-96 w-96 rounded-full ${slides[currentSlide].accentGlow} blur-3xl pointer-events-none`}
            />
            <div className="absolute -bottom-20 left-10 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
            <div className="relative z-10 flex items-center justify-between gap-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider shadow-sm ${slides[currentSlide].badgeColor}`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {slides[currentSlide].badge}
              </span>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/20 text-xs font-black tracking-wide text-amber-300 shadow-xs">
                <span>{slides[currentSlide].discount}</span>
              </div>
            </div>
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center my-auto py-4">
              <div className="sm:col-span-7 space-y-3.5">
                <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black tracking-tight leading-[1.12]">
                  {slides[currentSlide].title}
                  <br />
                  <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-white bg-clip-text text-transparent">
                    {slides[currentSlide].highlight}
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-slate-200/90 max-w-md font-medium leading-relaxed">
                  {slides[currentSlide].subtitle}
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/15 backdrop-blur-sm border border-white/20 text-xs font-semibold text-amber-200">
                  <span>{slides[currentSlide].promoCode}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-slate-900 font-extrabold text-sm shadow-xl hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/40"
                  >
                    <span>{slides[currentSlide].ctaText}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </Link>
                </div>
              </div>
              <div className="sm:col-span-5 relative flex items-center justify-center">
                <div className="absolute inset-0 bg-emerald-500/25 rounded-full blur-2xl transform scale-90" />
                <img
                  src={Img}
                  alt="MarketPlace Deals Showcase"
                  className="relative z-10 w-full max-w-[320px] sm:max-w-none object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Link
              to="/register"
              className="group relative flex-1 min-h-[225px] sm:min-h-[235px] rounded-3xl overflow-hidden p-6 sm:p-7 flex items-center justify-between bg-gradient-to-br from-[#064E3B]/95 via-[#065F46]/95 to-[#047857]/95 border border-white/20 backdrop-blur-xl text-white shadow-[0_10px_35px_rgba(5,150,105,0.18)] hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              {/* Glass Top Highlight Sheen */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent z-20" />
              <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-emerald-500/25 blur-2xl pointer-events-none" />
              <div className="relative z-10 space-y-2 max-w-[58%]">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-black uppercase tracking-wider text-amber-300 border border-white/20">
                  <Sparkles className="w-3 h-3" />
                  Premium Audio
                </span>
                <h3 className="text-lg sm:text-xl font-black tracking-tight leading-snug">
                  Wireless Studio Pro ANC
                </h3>
                <p className="text-xs text-slate-300 font-medium line-clamp-2">
                  Active Noise Cancelling & 40H Battery
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <span className="text-xs font-extrabold text-amber-300">From ₹1,499</span>
                  <span className="inline-flex items-center gap-1 text-xs font-black text-white group-hover:translate-x-1 transition-transform">
                    Shop Now <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                </div>
              </div>
              <div className="relative z-10 w-[42%] h-full flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=360&h=360&fit=crop&q=80"
                  alt="Studio Headphones"
                  className="w-full max-h-[160px] object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </Link>
            <Link
              to="/register"
              className="group relative flex-1 min-h-[225px] sm:min-h-[235px] rounded-3xl overflow-hidden p-6 sm:p-7 flex items-center justify-between bg-gradient-to-br from-[#064E3B]/95 via-[#065F46]/95 to-[#047857]/95 border border-white/20 backdrop-blur-xl text-white shadow-[0_10px_35px_rgba(5,150,105,0.18)] hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              {/* Glass Top Highlight Sheen */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent z-20" />
              <div className="absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-emerald-400/25 blur-2xl pointer-events-none" />
              <div className="relative z-10 space-y-2 max-w-[58%]">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-black uppercase tracking-wider text-emerald-300 border border-white/20">
                  <Zap className="w-3 h-3 fill-emerald-300" />
                  10-Min Express
                </span>
                <h3 className="text-lg sm:text-xl font-black tracking-tight leading-snug">
                  Fresh Grocery & Kitchen
                </h3>
                <p className="text-xs text-emerald-100 font-medium line-clamp-2">
                  Farm Fresh Fruits, Dairy & Daily Snacks
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <span className="text-xs font-extrabold text-yellow-300">Fastest Delivery</span>
                  <span className="inline-flex items-center gap-1 text-xs font-black text-white group-hover:translate-x-1 transition-transform">
                    Order Now <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                </div>
              </div>
              <div className="relative z-10 w-[42%] h-full flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=360&h=360&fit=crop&q=80"
                  alt="Fresh Supermarket Produce"
                  className="w-full max-h-[160px] object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
