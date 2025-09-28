import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import categoryGold from "@/assets/category-gold.jpg";
import categorySilver from "@/assets/category-silver.jpg";
import categoryPlatinum from "@/assets/category-platinum.jpg";

interface Category {
  title: string;
  subtitle: string;
  image: string;
  href: string;
}

const ProductCategories = () => {
  const categories: Category[] = [
    {
      title: "Gold",
      subtitle: "Bars & Coins",
      image: categoryGold,
      href: "#gold"
    },
    {
      title: "Silver",
      subtitle: "Premium Selection",
      image: categorySilver,
      href: "#silver"
    },
    {
      title: "Platinum & Palladium",
      subtitle: "Rare Metals",
      image: categoryPlatinum,
      href: "#platinum"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary">
            Discover our products
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our premium selection of precious metals from trusted mints worldwide
          </p>
        </div>

        {/* Categories Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-primary mb-8">Shop our categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Card key={index} className="group overflow-hidden cursor-pointer border-0 shadow-card hover:shadow-luxury transition-all duration-300">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden">
                    <img 
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white">
                      <h4 className="text-2xl font-bold mb-1">{category.title}</h4>
                      <p className="text-white/80">{category.subtitle}</p>
                    </div>
                    <Button 
                      variant="secondary"
                      size="sm"
                      className="absolute bottom-6 right-6 bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      Shop Now
                      <ArrowRight className="ml-2 w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Popular Products Preview */}
        <div className="text-center space-y-8">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-primary">Popular Products</h3>
            <p className="text-muted-foreground">
              Best-selling precious metals from our collection
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="p-4 bg-muted rounded-lg">
              <div className="font-semibold text-primary">1 oz Gold Eagle</div>
              <div className="text-gold font-bold">$2,089.50</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="font-semibold text-primary">1 oz Silver Eagle</div>
              <div className="text-gold font-bold">$48.75</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="font-semibold text-primary">1 oz Platinum Eagle</div>
              <div className="text-gold font-bold">$1,650.00</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="font-semibold text-primary">1/10 oz Gold Maple</div>
              <div className="text-gold font-bold">$215.30</div>
            </div>
          </div>
          
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            View All Products
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;