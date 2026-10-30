import React from "react";
import { Link } from "react-router-dom";

export default function ProductCategory() {
  const categories = [
    {
      id: 1,
      name: "Paan Corner",
      slug: "paan-corner",
      image:
        "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=240&h=240&fit=crop&q=80",
    },
    {
      id: 2,
      name: "Dairy, Bread & Eggs",
      slug: "dairy-bread-eggs",
      image:
        "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=240&h=240&fit=crop&q=80",
    },
    {
      id: 3,
      name: "Fruits & Vegetables",
      slug: "fruits-vegetables",
      image:
        "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=240&h=240&fit=crop&q=80",
    },
    {
      id: 4,
      name: "Cold Drinks & Juices",
      slug: "cold-drinks-juices",
      image:
        "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=240&h=240&fit=crop&q=80",
    },
    {
      id: 5,
      name: "Snacks & Munchies",
      slug: "snacks-munchies",
      image:
        "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=240&h=240&fit=crop&q=80",
    },
    {
      id: 6,
      name: "Breakfast & Instant Food",
      slug: "breakfast-instant-food",
      image:
        "https://images.unsplash.com/photo-1586985564150-11ee04838034?w=240&h=240&fit=crop&q=80",
    },
    {
      id: 7,
      name: "Sweet Tooth",
      slug: "sweet-tooth",
      image:
        "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=240&h=240&fit=crop&q=80",
    },
    {
      id: 8,
      name: "Bakery & Biscuits",
      slug: "bakery-biscuits",
      image:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=240&h=240&fit=crop&q=80",
    },
    {
      id: 9,
      name: "Tea, Coffee & Drinks",
      slug: "tea-coffee-drinks",
      image:
        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=240&h=240&fit=crop&q=80",
    },
    {
      id: 10,
      name: "Atta, Rice & Dal",
      slug: "atta-rice-dal",
      image:
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=240&h=240&fit=crop&q=80",
    },
    {
      id: 11,
      name: "Masala, Oil & More",
      slug: "masala-oil-more",
      image:
        "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=240&h=240&fit=crop&q=80",
    },
    {
      id: 12,
      name: "Sauces & Spreads",
      slug: "sauces-spreads",
      image:
        "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=240&h=240&fit=crop&q=80",
    },
    {
      id: 13,
      name: "Chicken, Meat & Fish",
      slug: "chicken-meat-fish",
      image:
        "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=240&h=240&fit=crop&q=80",
    },
    {
      id: 14,
      name: "Organic & Healthy",
      slug: "organic-healthy",
      image:
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=240&h=240&fit=crop&q=80",
    },
    {
      id: 15,
      name: "Baby Care",
      slug: "baby-care",
      image:
        "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=240&h=240&fit=crop&q=80",
    },
    {
      id: 16,
      name: "Pharma & Wellness",
      slug: "pharma-wellness",
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=240&h=240&fit=crop&q=80",
    },
    {
      id: 17,
      name: "Cleaning Essentials",
      slug: "cleaning-essentials",
      image:
        "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=240&h=240&fit=crop&q=80",
    },
    {
      id: 18,
      name: "Home & Office",
      slug: "home-office",
      image:
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=240&h=240&fit=crop&q=80",
    },
    {
      id: 19,
      name: "Personal Care",
      slug: "personal-care",
      image:
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=240&h=240&fit=crop&q=80",
    },
    {
      id: 20,
      name: "Pet Care",
      slug: "pet-care",
      image:
        "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=240&h=240&fit=crop&q=80",
    },
  ];

  return (
    <section className="w-full py-4">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Minimal White Container Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-100/90 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Shop by Category
              </h2>
            </div>
            <Link
              to="/category/all"
              className="text-xs sm:text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors"
            >
              See All &rarr;
            </Link>
          </div>

          {/* Minimal 10-column Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-x-3 gap-y-4 sm:gap-x-4 sm:gap-y-5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="group flex flex-col items-center cursor-pointer transition-transform duration-200 hover:-translate-y-0.5"
              >
                {/* Modern Minimal Card Box */}
                <div className="w-full aspect-square rounded-xl bg-slate-50  p-2 sm:p-2.5 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:bg-white group-hover:border-purple-300 group-hover:shadow-md">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Minimal Label */}
                <span className="mt-2 text-[12px] sm:text-[13px] font-medium text-slate-700 text-center leading-tight line-clamp-2 px-0.5 group-hover:text-purple-600 group-hover:font-semibold transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
