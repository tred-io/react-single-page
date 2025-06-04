import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Products from "@/components/Products";
import SpecialServices from "@/components/SpecialServices";
import FeaturedBrands from "@/components/FeaturedBrands";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <Products />
      <SpecialServices />
      <FeaturedBrands />
      <Footer />
    </div>
  );
}
