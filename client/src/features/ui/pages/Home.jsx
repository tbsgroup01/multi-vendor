import Hero from "../components/Hero";
import ProductCategory from "../components/ProductCategory";
import Latestcategories from "../components/Latestcategories";
import SuggestedItem from "../components/SuggestedItem";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="w-full min-h-screen flex flex-col bg-[#FAF7FE] font-['Poppins',sans-serif] relative overflow-x-hidden text-slate-800">
      {/* Background Ambient Glowing Orbs for Frosted Glass Effect */}
      <div className="pointer-events-none absolute -left-28 top-16 w-[480px] h-[480px] rounded-full bg-gradient-to-br from-pink-400/25 to-purple-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 top-52 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-violet-500/25 to-fuchsia-400/20 blur-3xl" />
      <div className="pointer-events-none absolute left-1/4 top-[900px] w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-purple-300/20 via-pink-300/15 to-indigo-300/20 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 top-[1550px] w-[480px] h-[480px] rounded-full bg-gradient-to-br from-emerald-400/15 via-teal-300/15 to-purple-400/20 blur-3xl" />
      <div className="pointer-events-none absolute left-1/3 bottom-32 w-[550px] h-[550px] rounded-full bg-purple-400/20 blur-3xl" />

      {/* Main Content Layers */}
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
