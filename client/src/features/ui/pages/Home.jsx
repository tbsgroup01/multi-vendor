import Hero from "../components/Hero";
import ProductCategory from "../components/ProductCategory";
import Latestcategories from "../components/Latestcategories";
import SuggestedItem from "../components/SuggestedItem";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="w-full flex flex-col bg-[#F4F6FC]">
      <Hero />
      <Latestcategories />
      <SuggestedItem />
      <ProductCategory />
      <Footer />
    </main>
  );
}
