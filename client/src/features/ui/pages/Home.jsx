import Hero from "../components/Hero";
import ProductCategory from "../components/ProductCategory";
import Latestcategories from "../components/Latestcategories";
import SuggestedItem from "../components/SuggestedItem";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="w-full min-h-screen flex flex-col bg-[#F7FAF8] font-['Poppins',sans-serif] relative overflow-x-hidden text-slate-800">
      <div className="relative z-10 w-full flex flex-col">
        <Hero />
        <Latestcategories />
        <SuggestedItem />
        <ProductCategory />
        <Footer />
      </div>
    </main>
  );
}
