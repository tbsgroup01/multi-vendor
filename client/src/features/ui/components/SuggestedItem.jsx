import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Check,
  Zap,
  Loader2,
  Sparkles,
  Plus,
  Minus,
} from "lucide-react";
import { productService, getUploadUrl } from "../../../services";
import { useCart } from "../../../context/CartContext";
const resolveProductImage = (item) => {
  if (!item) return "";
  let img = item.image;
  if (!img && item.images) {
    if (Array.isArray(item.images) && item.images.length > 0) {
      img = item.images[0];
    } else if (typeof item.images === "string") {
      try {
        const parsed = JSON.parse(item.images);
        if (Array.isArray(parsed) && parsed.length > 0) img = parsed[0];
        else img = item.images;
      } catch (e) {
        img = item.images.split(",")[0]?.trim();
      }
    }
  }
  return (
    getUploadUrl(img) ||
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&h=500&fit=crop&q=80"
  );
};

export default function SuggestedItem() {
  const { addToCart, updateQuantity, cartItems, getItemQuantity } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchSuggestedProducts = async () => {
      try {
        setLoading(true);
        const res = await productService.getAllProducts({
          limit: 12,
          status: "active",
        });
        if (isMounted) {
          if (res && Array.isArray(res.products) && res.products.length > 0) {
            setProducts(res.products);
          } else if (Array.isArray(res) && res.length > 0) {
            setProducts(res);
          }
        }
      } catch (err) {
        console.error("Failed to load suggested products from DB:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSuggestedProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAdd = (item, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    addToCart(item, 1);
  };

  const handleRemove = (item, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const cartItem = cartItems.find(
      (i) => String(i.productId || i.id) === String(item.id)
    );
    if (cartItem) {
      updateQuantity(cartItem.id, -1);
    }
  };

  return (
    <section className="w-full py-6">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/65 backdrop-blur-2xl rounded-3xl border border-white/80 p-5 sm:p-7 shadow-[0_8px_32px_0_rgba(16,185,129,0.06)] relative overflow-hidden transition-all">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

          {/* Header */}
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
                Handpicked fresh groceries, daily essentials & top-selling items
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/shop"
                className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-100/60 hover:bg-emerald-100/90 border border-emerald-200/50 px-4 py-1.5 rounded-full backdrop-blur-md transition-all tracking-wide uppercase shadow-2xs"
              >
                VIEW ALL
              </Link>
            </div>
          </div>

          {/* Loading Skeleton */}
          {loading && products.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
              <p className="text-xs font-semibold text-slate-600">
                Loading suggested products from database...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm font-medium">
              No products found in the database.
            </div>
          ) : (
            /* Products Grid Showcase */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-5">
              {products.map((item) => {
                const qty = getItemQuantity(item.id);
                const title = item.name || item.title || "Product";
                const imgUrl = resolveProductImage(item);
                const sellingPrice =
                  item.discountPrice && Number(item.discountPrice) > 0
                    ? Number(item.discountPrice)
                    : Number(item.price);
                const mrp =
                  item.discountPrice && Number(item.discountPrice) > 0
                    ? Number(item.price)
                    : item.mrp
                    ? Number(item.mrp)
                    : Math.round(Number(item.price) * 1.15);
                const rating = Number(item.rating)
                  ? Number(item.rating).toFixed(1)
                  : "4.8";
                const reviewCount = item.reviewCount
                  ? Number(item.reviewCount).toLocaleString("en-IN")
                  : "120+";
                const categorySlug = item.category?.name
                  ? item.category.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                  : "grocery";
                const specs =
                  item.description ||
                  item.unit ||
                  (item.category?.name
                    ? `${item.category.name} Essential`
                    : "Top Pick");

                return (
                  <Link
                    key={item.id}
                    to={`/product/${item.id}`}
                    state={{
                      product: {
                        ...item,
                        title,
                        name: title,
                        price: sellingPrice,
                        mrp,
                        image: imgUrl,
                        categorySlug,
                        categoryName: item.category?.name || "Grocery",
                      },
                      categoryName: item.category?.name || "Grocery",
                    }}
                    className="group relative w-full bg-white/70 backdrop-blur-xl rounded-xl sm:rounded-xl border border-white/85 p-3 sm:p-4 flex flex-col justify-between hover:shadow-xl  hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-xs overflow-hidden"
                  >
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                    <div>
                      {/* Image Frame */}
                      <div className="w-full h-36 sm:h-40 lg:h-44 rounded-2xl bg-white/75 backdrop-blur-md border border-white/90 p-2.5 sm:p-3 flex items-center justify-center overflow-hidden mb-3 shadow-2xs">
                        <img
                          src={imgUrl}
                          alt={title}
                          className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>

                      {/* Product Title */}
                      <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug line-clamp-2 min-h-[34px] group-hover:text-emerald-700 transition-colors">
                        {title}
                      </h3>

                      {/* Specs / Description */}
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        {specs}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-1.5 sm:gap-2 mt-2">
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-600 text-white font-bold text-[10px] sm:text-[11px] shadow-2xs">
                          <span>{rating}</span>
                          <Star className="w-2.5 h-2.5 fill-white text-white" />
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400">
                          ({reviewCount})
                        </span>
                      </div>
                    </div>

                    {/* Price & Action (Blinkit Style) */}
                    <div className="pt-2.5 sm:pt-3 border-t border-emerald-100/60 mt-3 flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-sm sm:text-base font-black text-slate-900 leading-none">
                          ₹{sellingPrice.toLocaleString("en-IN")}
                        </span>
                        {mrp > sellingPrice && (
                          <span className="text-[10px] sm:text-xs text-slate-400 line-through font-normal mt-0.5">
                            ₹{mrp.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>

                      {qty === 0 ? (
                        <button
                          type="button"
                          onClick={(e) => handleAdd(item, e)}
                          className="min-w-[66px] h-8 px-3 rounded-lg font-black text-xs uppercase tracking-wider transition-all duration-150 flex items-center justify-center cursor-pointer shadow-xs active:scale-95 bg-[#f7fcf8] hover:bg-[#0c831f] text-[#0c831f] hover:text-white border border-[#0c831f]"
                        >
                          ADD
                        </button>
                      ) : (
                        <div
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          className="min-w-[66px] h-8 px-1.5 rounded-lg bg-[#0c831f] text-white flex items-center justify-between shadow-xs font-black text-xs"
                        >
                          <button
                            type="button"
                            onClick={(e) => handleRemove(item, e)}
                            className="p-1 hover:bg-[#096918] active:scale-90 rounded transition-colors cursor-pointer"
                            title="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5 stroke-[3]" />
                          </button>
                          <span className="px-1.5 font-black text-xs min-w-[16px] text-center">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleAdd(item, e)}
                            className="p-1 hover:bg-[#096918] active:scale-90 rounded transition-colors cursor-pointer"
                            title="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[3]" />
                          </button>
                        </div>
                      )}
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
