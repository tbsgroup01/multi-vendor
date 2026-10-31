import { useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BadgePercent,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  LayoutGrid,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import Footer from "../components/Footer";

const customerReviews = [
  {
    rating: 5,
    title: "Fabulous!",
    date: "3 months ago",
    comment: "Really happy with this purchase. Great quality and works exactly as expected.",
    author: "Chandan Kumar Das",
    likes: 2,
    dislikes: 0,
  },
  {
    rating: 4,
    title: "Delightful",
    date: "7 days ago",
    comment: "Good product and quick delivery. The quality is better than I expected.",
    author: "Duvvu Kiran",
    likes: 1,
    dislikes: 0,
  },
  {
    rating: 5,
    title: "Best in the range",
    date: "17 days ago",
    comment: "Good product, feels premium and is easy to use. Would recommend it.",
    author: "Srinivasan R",
    likes: 1,
    dislikes: 0,
  },
  {
    rating: 4,
    title: "Really Nice",
    date: "4 months ago",
    comment: "Works well overall. Sound and display quality could be a little better.",
    author: "Rajesh Allada",
    likes: 1,
    dislikes: 1,
  },
];

// Comprehensive catalog database for direct navigation or page refresh
const PRODUCT_CATALOG = {
  d1: {
    name: "Amul Taaza Fresh Toned Milk",
    brand: "Amul",
    unit: "1 L",
    price: 54,
    mrp: 56,
    rating: 4.8,
    reviews: 2420,
    categoryName: "Dairy, Bread & Eggs",
    categorySlug: "dairy-bread-eggs",
    image: "https://pngimg.com/uploads/milk/milk_PNG12734.png",
    description: "Amul Taaza pasteurised toned milk is rich in calcium and essential vitamins, perfect for tea, coffee, and daily nutrition.",
    healthBenefits: "High calcium, rich in protein, low fat.",
  },
  d2: {
    name: "Harvest Gold White Sandwich Bread",
    brand: "Harvest Gold",
    unit: "400 g",
    price: 40,
    mrp: 45,
    rating: 4.7,
    reviews: 1840,
    categoryName: "Dairy, Bread & Eggs",
    categorySlug: "dairy-bread-eggs",
    image: "https://pngimg.com/uploads/bread/bread_PNG2301.png",
    description: "Soft and fresh sandwich bread made with premium grains. Perfect for breakfast sandwiches and toast.",
    healthBenefits: "Zero trans fat, fortified with vitamins.",
  },
  d3: {
    name: "Farm Fresh Brown Table Eggs",
    brand: "Amul",
    unit: "Pack of 6",
    price: 68,
    mrp: 75,
    rating: 4.9,
    reviews: 950,
    categoryName: "Dairy, Bread & Eggs",
    categorySlug: "dairy-bread-eggs",
    image: "https://pngimg.com/uploads/egg/egg_PNG40.png",
    description: "Naturally laid farm fresh brown eggs with rich golden yolks. Packed with high quality protein.",
    healthBenefits: "Rich in omega-3, 6g protein per egg.",
  },
  d4: {
    name: "Amul Pasteurised Salted Table Butter",
    brand: "Amul",
    unit: "100 g",
    price: 58,
    mrp: 60,
    rating: 4.9,
    reviews: 3200,
    categoryName: "Dairy, Bread & Eggs",
    categorySlug: "dairy-bread-eggs",
    image: "https://pngimg.com/uploads/butter/butter_PNG26.png",
    description: "India's beloved butter with the iconic taste and rich golden texture.",
  },
  d5: {
    name: "Mother Dairy Classic Creamy Curd",
    brand: "Mother Dairy",
    unit: "400 g",
    price: 35,
    mrp: 38,
    rating: 4.6,
    reviews: 1120,
    categoryName: "Dairy, Bread & Eggs",
    categorySlug: "dairy-bread-eggs",
    image: "https://pngimg.com/uploads/yogurt/yogurt_PNG15214.png",
    description: "Creamy curd prepared from pasteurised milk, rich in gut-friendly probiotics.",
  },
  d6: {
    name: "Britannia Cheddar Cheese Slices",
    brand: "Britannia",
    unit: "200 g (10 Slices)",
    price: 135,
    mrp: 145,
    rating: 4.8,
    reviews: 840,
    categoryName: "Dairy, Bread & Eggs",
    categorySlug: "dairy-bread-eggs",
    image: "https://pngimg.com/uploads/cheese/cheese_PNG25313.png",
    description: "Classic processed cheese slices made with real cow's milk. Melts beautifully on burgers and toast.",
  },
  fv1: {
    name: "Fresh Robusta Yellow Bananas",
    brand: "Farm Fresh",
    unit: "1 kg (~6-8 pcs)",
    price: 52,
    mrp: 65,
    rating: 4.8,
    reviews: 1980,
    categoryName: "Fruits & Vegetables",
    categorySlug: "fruits-vegetables",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&h=600&fit=crop&q=80",
    description: "Naturally ripened, sweet and creamy bananas full of potassium and dietary fibre.",
  },
  fv2: {
    name: "Shimla Crisp Royal Gala Apples",
    brand: "Farm Fresh",
    unit: "4 pcs (~600 g)",
    price: 140,
    mrp: 160,
    rating: 4.7,
    reviews: 1420,
    categoryName: "Fruits & Vegetables",
    categorySlug: "fruits-vegetables",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&h=600&fit=crop&q=80",
    description: "Crisp, sweet and juicy apples directly sourced from high-altitude Himachal orchards.",
  },
  cd1: {
    name: "Coca-Cola Original Taste Can",
    brand: "Coca-Cola",
    unit: "300 ml",
    price: 40,
    mrp: 40,
    rating: 4.8,
    reviews: 2900,
    categoryName: "Cold Drinks & Juices",
    categorySlug: "cold-drinks-juices",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&h=600&fit=crop&q=80",
    description: "Crisp, cold and refreshing sparkling cola to uplift any moment.",
  },
  sn1: {
    name: "Lay's Classic Salted Potato Chips",
    brand: "Lay's",
    unit: "50 g",
    price: 20,
    mrp: 20,
    rating: 4.8,
    reviews: 3100,
    categoryName: "Snacks & Munchies",
    categorySlug: "snacks-munchies",
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&h=600&fit=crop&q=80",
    description: "Crispy golden thinly sliced potato chips with the iconic light salted flavor.",
  },
  fk1: {
    name: "Apple iPhone 15 (Blue, 128 GB)",
    brand: "Apple",
    unit: "128 GB",
    price: 58999,
    mrp: 79900,
    rating: 4.6,
    reviews: "1,42,890",
    categoryName: "Electronics",
    categorySlug: "electronics",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop&q=80",
    description: "iPhone 15 brings you Dynamic Island, a 48MP Main camera, and USB-C, all in a durable color-infused glass and aluminum design.",
  },
  fk2: {
    name: "Sony WH-1000XM5 Wireless Active Noise Cancelling Headphones",
    brand: "Sony",
    unit: "1 unit",
    price: 26990,
    mrp: 34990,
    rating: 4.8,
    reviews: "28,450",
    categoryName: "Electronics",
    categorySlug: "electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&q=80",
    description: "Industry leading noise cancellation with two processors and eight microphones for unprecedented noise cancelling and call quality.",
  },
  fk3: {
    name: "Apple Watch Series 9 GPS (Midnight Aluminium, 45mm)",
    brand: "Apple",
    unit: "45 mm",
    price: 38900,
    mrp: 44900,
    rating: 4.7,
    reviews: "35,120",
    categoryName: "Electronics",
    categorySlug: "electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&q=80",
    description: "The most powerful chip in Apple Watch ever with the magical new Double Tap gesture.",
  },
  fk4: {
    name: "Nike Air Force 1 '07 Premium Men's Casual Sneakers",
    brand: "Nike",
    unit: "UK 8",
    price: 7495,
    mrp: 9695,
    rating: 4.6,
    reviews: "19,840",
    categoryName: "Fashion",
    categorySlug: "fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&q=80",
    description: "The radiance lives on with pristine leather and legendary Nike Air cushioning.",
  },
};

export default function ProductDetailspage() {
  const { id } = useParams();
  const { state } = useLocation();

  // Resolve product from state, catalog or fallback
  const product =
    state?.product ||
    PRODUCT_CATALOG[id] || {
      id: id || "item-1",
      name: "Fresh Premium Market Choice",
      unit: "1 unit",
      price: 99,
      mrp: 120,
      rating: 4.8,
      reviews: 420,
      categoryName: state?.categoryName || "Shop",
      categorySlug: "dairy-bread-eggs",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=600&fit=crop&q=80",
      description: "Carefully selected and freshly packaged for guaranteed quality and superior taste.",
    };

  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [expandedReviews, setExpandedReviews] = useState({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedUnitIndex, setSelectedUnitIndex] = useState(0);
  const reviewsRef = useRef(null);

  const name = product.name || product.title;
  const categoryName = state?.categoryName || product.categoryName || "Shop";
  const images = product.images?.length ? product.images : [product.image];
  const units = product.variants?.length
    ? product.variants
    : [{ unit: product.unit || "1 unit", price: product.price, mrp: product.mrp }];
  const selectedUnit = units[selectedUnitIndex] || units[0];
  const price = selectedUnit.price ?? product.price;
  const mrp = selectedUnit.mrp ?? product.mrp ?? price;
  const unit = selectedUnit.unit || product.unit;
  const savings = mrp > price ? mrp - price : 0;
  const reviews = product.reviews ?? product.ratingCount ?? "0";
  const rating = product.rating || 4.8;
  const inStock = product.inStock !== false;
  const formattedReviews =
    typeof reviews === "number" ? reviews.toLocaleString("en-IN") : reviews;

  return (
    <>
      <main className="min-h-screen bg-[#F6F8FD] text-slate-900 font-sans">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
          <section className="grid min-h-[calc(100vh-150px)] lg:grid-cols-2 bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
            
            {/* Left Column: Image Viewer */}
            <div className="p-5 sm:p-8 lg:p-10 lg:border-r border-slate-100 flex flex-col justify-between">
              <div>
                <div className="mx-auto flex aspect-square max-h-[500px] items-center justify-center bg-white p-4">
                  <img
                    src={images[selectedImageIndex] || product.image}
                    alt={name}
                    className="h-full w-full object-contain"
                  />
                </div>
                {images.length > 1 && (
                  <div className="mt-4 flex justify-center gap-3">
                    {images.map((image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        aria-label={`View product image ${index + 1}`}
                        aria-pressed={selectedImageIndex === index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`h-16 w-16 rounded-xl border p-1 transition-all ${
                          selectedImageIndex === index ? "border-purple-600 bg-purple-50/30" : "border-slate-200"
                        }`}
                      >
                        <img src={image} alt="" className="h-full w-full object-contain" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mx-auto mt-8 w-full border-t border-slate-100 pt-6">
                <h2 className="text-base font-bold text-slate-900">Product Details</h2>
                {product.healthBenefits && (
                  <div className="mt-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Health Benefits</h3>
                    <p className="mt-1 text-sm text-slate-600">{product.healthBenefits}</p>
                  </div>
                )}
                <div className="mt-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Description</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {product.description || product.specs || `Enjoy ${name}, carefully selected for quality and freshness.`}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Product Meta & Purchase */}
            <div className="p-5 sm:p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500">
                    <Link to="/" className="shrink-0 hover:text-purple-600">Home</Link>
                    <ChevronRight className="h-3 w-3 shrink-0 text-slate-400" />
                    <Link to={`/category/${product.categorySlug || "dairy-bread-eggs"}`} className="truncate hover:text-purple-600">
                      {categoryName}
                    </Link>
                    <ChevronRight className="h-3 w-3 shrink-0 text-slate-400" />
                    <span className="truncate text-slate-400">{name}</span>
                  </nav>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <ShoppingBag className="h-4 w-4" />
                  </span>
                </div>

                <h1 className="mt-4 text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">{name}</h1>
                
                <div className="mt-2.5 flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-700 px-2 py-0.5 font-bold text-white shadow-2xs">
                    {rating}<Star className="h-3 w-3 fill-white text-white" />
                  </span>
                  <span className="text-slate-500 font-medium">{formattedReviews} ratings</span>
                  <span className="text-slate-300">•</span>
                  <span className={inStock ? "font-bold text-emerald-700" : "font-bold text-rose-600"}>
                    {inStock ? "In stock" : "Out of stock"}
                  </span>
                </div>

                <div className="mt-6">
                  <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Select Unit</h2>
                  <div className="mt-3 flex flex-wrap gap-2.5">
                    {units.map((option, index) => {
                      const optionPrice = option.price ?? product.price;
                      const optionMrp = option.mrp ?? product.mrp ?? optionPrice;
                      const optionSavings = optionMrp > optionPrice ? optionMrp - optionPrice : 0;

                      return (
                        <button
                          key={`${option.unit}-${index}`}
                          type="button"
                          aria-pressed={selectedUnitIndex === index}
                          onClick={() => setSelectedUnitIndex(index)}
                          className={`relative min-w-[96px] rounded-xl border px-3 pb-2.5 pt-3.5 text-left transition cursor-pointer ${
                            selectedUnitIndex === index
                              ? "border-purple-600 bg-purple-50/50 shadow-2xs"
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          {optionSavings > 0 && (
                            <span className="absolute -top-2 left-2 rounded-md bg-purple-600 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-2xs">
                              Save ₹{optionSavings}
                            </span>
                          )}
                          <span className="block text-xs font-semibold text-slate-700">{option.unit || "1 unit"}</span>
                          <span className="mt-0.5 block text-sm font-black text-slate-900">
                            ₹{optionPrice.toLocaleString("en-IN")}
                          </span>
                          {optionMrp > optionPrice && (
                            <span className="block text-[11px] text-slate-400 line-through">
                              ₹{optionMrp.toLocaleString("en-IN")}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">{unit}</p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-xl font-black text-slate-900">₹{price.toLocaleString("en-IN")}</span>
                      {mrp > price && (
                        <span className="text-xs text-slate-400 line-through">MRP ₹{mrp.toLocaleString("en-IN")}</span>
                      )}
                      {savings > 0 && (
                        <span className="rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 text-[10px] font-bold">
                          Save ₹{savings}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-400">(Inclusive of all taxes)</p>
                  </div>

                  {!isAdded ? (
                    <button
                      type="button"
                      disabled={!inStock}
                      onClick={() => {
                        setQuantity(1);
                        setIsAdded(true);
                      }}
                      className="h-11 min-w-32 rounded-xl bg-purple-600 px-6 text-sm font-bold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-slate-300 shadow-xs cursor-pointer"
                    >
                      Add to cart
                    </button>
                  ) : (
                    <div className="inline-flex h-11 items-center rounded-xl bg-purple-600 px-1 text-white shadow-xs">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => {
                          if (quantity <= 1) {
                            setQuantity(1);
                            setIsAdded(false);
                          } else {
                            setQuantity((value) => value - 1);
                          }
                        }}
                        className="flex h-9 w-8 items-center justify-center rounded-lg hover:bg-purple-700 cursor-pointer"
                      >
                        <Minus className="h-4 w-4 stroke-[2.5]" />
                      </button>
                      <span className="w-8 text-center text-sm font-black">{quantity}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => setQuantity((value) => value + 1)}
                        className="flex h-9 w-8 items-center justify-center rounded-lg hover:bg-purple-700 cursor-pointer"
                      >
                        <Plus className="h-4 w-4 stroke-[2.5]" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Service Badges */}
              <div className="mt-8 border-t border-slate-100 pt-6">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4">Why shop with us?</h2>
                <div className="space-y-3.5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                      <Clock3 className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-slate-800">Express Delivery</h3>
                      <p className="mt-0.5 text-xs text-slate-500">Delivered straight to your doorstep fast and fresh.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                      <BadgePercent className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-slate-800">Best Prices &amp; Assured Quality</h3>
                      <p className="mt-0.5 text-xs text-slate-500">Authentic products directly sourced from verified sellers.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Customer Reviews Section */}
          <section className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-xs">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Customer reviews</h2>
                <p className="mt-0.5 text-xs text-slate-500">Verified buyer ratings &amp; feedback</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous reviews"
                  onClick={() => reviewsRef.current?.scrollBy({ left: -300, behavior: "smooth" })}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next reviews"
                  onClick={() => reviewsRef.current?.scrollBy({ left: 300, behavior: "smooth" })}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div
              ref={reviewsRef}
              className="flex gap-3 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {customerReviews.map((review) => (
                <article
                  key={review.author}
                  className="flex w-[270px] shrink-0 flex-col rounded-xl border border-slate-100 bg-slate-50 p-4 sm:w-[290px]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="inline-flex shrink-0 items-center gap-1 rounded bg-emerald-700 px-1.5 py-0.5 text-xs font-bold text-white">
                        {review.rating}
                        <Star className="h-3 w-3 fill-current" />
                      </span>
                      <h3 className="truncate text-sm font-bold text-slate-800">{review.title}</h3>
                    </div>
                    <time className="shrink-0 text-[11px] text-slate-500">{review.date}</time>
                  </div>
                  <p className={`mt-3 text-sm leading-5 text-slate-600 ${
                    review.comment.length > 70 && !expandedReviews[review.author] ? "line-clamp-2" : ""
                  }`}>
                    {review.comment}
                  </p>
                  {review.comment.length > 70 && (
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedReviews((current) => ({
                          ...current,
                          [review.author]: !current[review.author],
                        }))
                      }
                      className="mt-1 self-start text-xs font-bold text-purple-600 hover:text-purple-700 cursor-pointer"
                    >
                      {expandedReviews[review.author] ? "less" : "more"}
                    </button>
                  )}
                  <div className="mt-auto flex items-end justify-between gap-2 pt-4">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-slate-700">{review.author}</p>
                      <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-slate-500">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        Verified Buyer
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 text-[11px] text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <ThumbsUp className="h-3.5 w-3.5" />
                        {review.likes}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <ThumbsDown className="h-3.5 w-3.5" />
                        {review.dislikes}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
