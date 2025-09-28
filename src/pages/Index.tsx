import PriceTicker from "@/components/PriceTicker";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import ProductCategories from "@/components/ProductCategories";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <PriceTicker />
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <ProductCategories />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
