import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import paanCornerImg from "../../../assets/category/paan-corner.png";
import dairyBreadEggsImg from "../../../assets/category/dairy-bread-eggs.png";
import fruitsVegetablesImg from "../../../assets/category/fruits-vegetables.png";
import coldDrinksJuicesImg from "../../../assets/category/cold-drinks-juices.png";
import snacksMunchiesImg from "../../../assets/category/snacks-munchies.png";
import breakfastInstantFoodImg from "../../../assets/category/breakfast-instant-food.png";
import sweetToothImg from "../../../assets/category/sweet-tooth.png";
import bakeryBiscuitsImg from "../../../assets/category/bakery-biscuits.png";
import teaCoffeeDrinksImg from "../../../assets/category/tea-coffee-drinks.png";
import attaRiceDalImg from "../../../assets/category/atta-rice-dal.png";
import masalaOilMoreImg from "../../../assets/category/masala-oil-more.png";
import saucesSpreadsImg from "../../../assets/category/sauces-spreads.png";
import chickenMeatFishImg from "../../../assets/category/chicken-meat-fish.png";
import organicHealthyImg from "../../../assets/category/organic-healthy.png";
import babyCareImg from "../../../assets/category/baby-care.png";
import pharmaWellnessImg from "../../../assets/category/pharma-wellness.png";
import cleaningEssentialsImg from "../../../assets/category/cleaning-essentials.png";
import homeOfficeImg from "../../../assets/category/home-office.png";
import personalCareImg from "../../../assets/category/personal-care.png";
import petCareImg from "../../../assets/category/pet-care.png";

export default function ProductCategory() {
  const categories = [
    {
      id: 1,
      name: "Paan Corner",
      slug: "paan-corner",
      image: paanCornerImg,
      bgTint: "bg-[#eef8f2]",
    },
    {
      id: 2,
      name: "Dairy, Bread & Eggs",
      slug: "dairy-bread-eggs",
      image: dairyBreadEggsImg,
      bgTint: "bg-[#edf5fb]",
    },
    {
      id: 3,
      name: "Fruits & Vegetables",
      slug: "fruits-vegetables",
      image: fruitsVegetablesImg,
      bgTint: "bg-[#f1f8ee]",
    },
    {
      id: 4,
      name: "Cold Drinks & Juices",
      slug: "cold-drinks-juices",
      image: coldDrinksJuicesImg,
      bgTint: "bg-[#eaf4fc]",
    },
    {
      id: 5,
      name: "Snacks & Munchies",
      slug: "snacks-munchies",
      image: snacksMunchiesImg,
      bgTint: "bg-[#fff7ed]",
    },
    {
      id: 6,
      name: "Breakfast & Instant Food",
      slug: "breakfast-instant-food",
      image: breakfastInstantFoodImg,
      bgTint: "bg-[#fef9ee]",
    },
    {
      id: 7,
      name: "Sweet Tooth",
      slug: "sweet-tooth",
      image: sweetToothImg,
      bgTint: "bg-[#fdf2f4]",
    },
    {
      id: 8,
      name: "Bakery & Biscuits",
      slug: "bakery-biscuits",
      image: bakeryBiscuitsImg,
      bgTint: "bg-[#fdf5eb]",
    },
    {
      id: 9,
      name: "Tea, Coffee & Drinks",
      slug: "tea-coffee-drinks",
      image: teaCoffeeDrinksImg,
      bgTint: "bg-[#f7f5f0]",
    },
    {
      id: 10,
      name: "Atta, Rice & Dal",
      slug: "atta-rice-dal",
      image: attaRiceDalImg,
      bgTint: "bg-[#fbf6ed]",
    },
    {
      id: 11,
      name: "Masala, Oil & More",
      slug: "masala-oil-more",
      image: masalaOilMoreImg,
      bgTint: "bg-[#fdf3f0]",
    },
    {
      id: 12,
      name: "Sauces & Spreads",
      slug: "sauces-spreads",
      image: saucesSpreadsImg,
      bgTint: "bg-[#fef2f2]",
    },
    {
      id: 13,
      name: "Chicken, Meat & Fish",
      slug: "chicken-meat-fish",
      image: chickenMeatFishImg,
      bgTint: "bg-[#fef2f5]",
    },
    {
      id: 14,
      name: "Organic & Healthy",
      slug: "organic-healthy",
      image: organicHealthyImg,
      bgTint: "bg-[#edf7f2]",
    },
    {
      id: 15,
      name: "Baby Care",
      slug: "baby-care",
      image: babyCareImg,
      bgTint: "bg-[#fdf2f8]",
    },
    {
      id: 16,
      name: "Pharma & Wellness",
      slug: "pharma-wellness",
      image: pharmaWellnessImg,
      bgTint: "bg-[#eef8f8]",
    },
    {
      id: 17,
      name: "Cleaning Essentials",
      slug: "cleaning-essentials",
      image: cleaningEssentialsImg,
      bgTint: "bg-[#ecf9fb]",
    },
    {
      id: 18,
      name: "Home & Office",
      slug: "home-office",
      image: homeOfficeImg,
      bgTint: "bg-[#f0f2fd]",
    },
    {
      id: 19,
      name: "Personal Care",
      slug: "personal-care",
      image: personalCareImg,
      bgTint: "bg-[#f5f2fd]",
    },
    {
      id: 20,
      name: "Pet Care",
      slug: "pet-care",
      image: petCareImg,
      bgTint: "bg-[#fbf6ea]",
    },
  ];

  return (
    <section className="w-full py-5">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Glassmorphic Card Panel */}
        <div className="bg-white/65 backdrop-blur-2xl rounded-3xl p-5 sm:p-7 border border-white/80 shadow-[0_8px_32px_0_rgba(109,40,217,0.06)] relative overflow-hidden transition-all">
          {/* Glass Top Highlight Sheen */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-purple-100/60">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-6 rounded-full bg-gradient-to-b from-purple-500 to-indigo-600 block shadow-xs" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Shop by Category
              </h2>
            </div>

            <Link
              to="/category/all"
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-purple-600 hover:text-purple-700 bg-purple-100/60 hover:bg-purple-100/90 border border-purple-200/50 px-3.5 py-1.5 rounded-full backdrop-blur-md transition-all shadow-xs"
            >
              <span>See All</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* 10-column Responsive Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-x-3 gap-y-5 sm:gap-x-4 sm:gap-y-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="group flex flex-col items-center cursor-pointer transition-all duration-200 hover:-translate-y-1"
              >
                {/* Clean Frosted Cutout Card */}
                <div
                  className="w-full aspect-square rounded-2xl bg-white/70 backdrop-blur-md p-2 flex items-center justify-center overflow-hidden border border-white/85 shadow-xs group-hover:shadow-md group-hover:border-purple-300 group-hover:bg-white/95 transition-all duration-300"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>

                {/* Pixel-Perfect Aligned Label */}
                <div className="w-full min-h-[34px] flex items-start justify-center mt-2 px-0.5">
                  <span className="text-[12px] sm:text-[13px] font-semibold text-slate-700 text-center leading-snug line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {cat.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
