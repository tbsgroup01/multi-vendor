import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Check,
  Zap,
} from "lucide-react";

export default function SuggestedItem() {
  const [wishlist, setWishlist] = useState({});
  const [addedItems, setAddedItems] = useState({});
  const scrollContainerRef = useRef(null);

  const products = [
    {
      id: "fk1",
      title: "Apple iPhone 15 (Blue, 128 GB)",
      brand: "Apple",
      rating: 4.6,
      ratingCount: "1,42,890",
      price: 58999,
      mrp: 79900,
      image:
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&q=80",
      assured: true,
      tag: "Free delivery",
      specs: "A16 Bionic Chip | 48MP Camera",
      categorySlug: "electronics",
    },
    {
      id: "fk2",
      title: "Sony WH-1000XM5 Wireless Active Noise Cancelling Headphones",
      brand: "Sony",
      rating: 4.8,
      ratingCount: "28,450",
      price: 26990,
      mrp: 34990,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&q=80",
      assured: true,
      tag: "Top Rated Audio",
      specs: "30 Hrs Battery | Multipoint Connect",
      categorySlug: "electronics",
    },
    {
      id: "fk3",
      title: "Apple Watch Series 9 GPS (Midnight Aluminium, 45mm)",
      brand: "Apple",
      rating: 4.7,
      ratingCount: "35,120",
      price: 38900,
      mrp: 44900,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop&q=80",
      assured: true,
      tag: "Free delivery",
      specs: "S9 SiP Chip | Double Tap Gesture",
      categorySlug: "electronics",
    },
    {
      id: "fk4",
      title: "Nike Air Force 1 '07 Premium Men's Casual Sneakers",
      brand: "Nike",
      rating: 4.6,
      ratingCount: "19,840",
      price: 7495,
      mrp: 9695,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop&q=80",
      assured: true,
      tag: "Best Seller",
      specs: "Genuine Leather | Air Sole Cushioning",
      categorySlug: "fashion",
    },
    {
      id: "fk5",
      title: "Apple MacBook Air M2 (13.6-inch Liquid Retina, 256 GB)",
      brand: "Apple",
      rating: 4.8,
      ratingCount: "12,980",
      price: 84990,
      mrp: 99900,
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop&q=80",
      assured: true,
      tag: "Free delivery",
      specs: "M2 8-Core CPU | 18 Hrs Battery",
      categorySlug: "electronics",
    },
    {
      id: "fk6",
      title: "Canon EOS R50 Mirrorless Camera Body with RF-S 18-45mm",
      brand: "Canon",
      rating: 4.7,
      ratingCount: "8,740",
      price: 54990,
      mrp: 65995,
      image:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop&q=80",
      assured: true,
      tag: "Free delivery",
      specs: "24.2 MP CMOS | 4K Uncropped Video",
      categorySlug: "electronics",
    },
    {
      id: "fk7",
      title: "JBL Flip 6 Portable Waterproof Bluetooth Speaker",
      brand: "JBL",
      rating: 4.6,
      ratingCount: "44,190",
      price: 9999,
      mrp: 13999,
      image:
        "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&h=500&fit=crop&q=80",
      assured: true,
      tag: "Popular Choice",
      specs: "IP67 Waterproof | 12 Hrs Playtime",
      categorySlug: "electronics",
    },
    {
      id: "fk8",
      title: "Ray-Ban Classic Aviator Polarized Sunglasses",
      brand: "Ray-Ban",
      rating: 4.7,
      ratingCount: "15,620",
      price: 8590,
      mrp: 10590,
      image:
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop&q=80",
      assured: true,
      tag: "Free delivery",
      specs: "100% UV Protection | Gold Metal Frame",
      categorySlug: "fashion",
    },
  ];

  const toggleWishlist = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddToCart = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setAddedItems((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -350 : 350;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full py-6">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/65 backdrop-blur-2xl rounded-3xl border border-white/80 p-5 sm:p-7 shadow-[0_8px_32px_0_rgba(16,185,129,0.06)] relative overflow-hidden transition-all">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-emerald-100/60">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Suggested for You
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-bold border border-emerald-200/60 backdrop-blur-md shadow-2xs">
                  <Zap className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                  Top Picks
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
                Based on your interest in electronics, gadgets & trending
                lifestyle
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/shop"
                className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-100/60 hover:bg-emerald-100/90 border border-emerald-200/50 px-3 py-1 rounded-full backdrop-blur-md transition-all tracking-wide uppercase"
              >
                VIEW ALL
              </Link>
              <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-emerald-100">
                <button
                  onClick={() => scroll("left")}
                  aria-label="Previous Products"
                  className="w-8 h-8 rounded-full border border-emerald-200/60 bg-white/70 backdrop-blur-md flex items-center justify-center text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer shadow-2xs"
                >
                  <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                </button>
                <button
                  onClick={() => scroll("right")}
                  aria-label="Next Products"
                  className="w-8 h-8 rounded-full border border-emerald-200/60 bg-white/70 backdrop-blur-md flex items-center justify-center text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer shadow-2xs"
                >
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>
          <div
            ref={scrollContainerRef}
            className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {products.map((item) => {
              const isWishlisted = !!wishlist[item.id];
              const isAdded = !!addedItems[item.id];

              return (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  state={{ product: item, categoryName: item.categorySlug }}
                  className="group relative flex-none w-[230px] sm:w-[260px] bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/85 p-3.5 sm:p-4 flex flex-col justify-between hover:shadow-xl hover:border-emerald-200 transition-all duration-300 cursor-pointer shadow-xs overflow-hidden"
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                  <div>
                    <div className="w-full h-44 sm:h-48 rounded-2xl bg-white/75 backdrop-blur-md border border-white/90 p-3 flex items-center justify-center overflow-hidden mb-3.5 shadow-2xs">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-108 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug line-clamp-2 min-h-[36px] group-hover:text-emerald-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                      {item.specs}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-600 text-white font-bold text-[11px] shadow-2xs">
                        <span>{item.rating}</span>
                        <Star className="w-2.5 h-2.5 fill-white text-white" />
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        ({item.ratingCount})
                      </span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-emerald-100/60 mt-3">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-base sm:text-lg font-black text-slate-900 leading-none">
                        ₹{item.price.toLocaleString("en-IN")}
                      </span>
                      {item.mrp > item.price && (
                        <span className="text-xs text-slate-400 line-through font-normal">
                          ₹{item.mrp.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(item.id, e)}
                      className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 ${
                        isAdded
                          ? "bg-emerald-600 text-white"
                          : "bg-emerald-50 hover:bg-[#059669] text-[#059669] hover:text-white border border-emerald-200/60 backdrop-blur-md"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Added to Cart</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
