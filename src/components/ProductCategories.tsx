import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import categoryGold from "@/assets/category-gold.jpg";
import categorySilver from "@/assets/category-silver.jpg";
import categoryPlatinum from "@/assets/category-platinum.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

interface Category {
  title: string;
  subtitle: string;
  image: string;
  href: string;
}

const ProductCategories = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const categories: Category[] = [
    {
      title: t('categories.gold'),
      subtitle: t('categories.goldSub'),
      image: categoryGold,
      href: "/products/gold"
    },
    {
      title: t('categories.silver'),
      subtitle: t('categories.silverSub'),
      image: categorySilver,
      href: "/products/silver"
    },
    {
      title: t('categories.platinum'),
      subtitle: t('categories.platinumSub'),
      image: categoryPlatinum,
      href: "/products/platinum"
    }
  ];

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-8 md:mb-12 animate-fade-in">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary">
            {t('categories.title')}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto px-4">
            {t('categories.subtitle')}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-primary mb-8 text-center animate-fade-in [animation-delay:200ms]">{t('categories.sectionTitle')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Card 
                key={index} 
                className="group overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 animate-fade-in hover-scale"
                onClick={() => navigate(category.href)}
                style={{animationDelay: `${400 + index * 200}ms`}}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="text-xl font-bold mb-1">{category.title}</h4>
                      <p className="text-white/90 text-sm">{category.subtitle}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <Button 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(category.href);
                      }}
                    >
                      {t('categories.shopButton')} {category.title}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Popular Products Preview */}
        <div className="text-center space-y-8 animate-fade-in [animation-delay:1000ms]">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-primary">{t('categories.popular')}</h3>
            <p className="text-muted-foreground">
              {t('categories.popularSub')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div 
              className="p-4 bg-muted rounded-lg hover-scale transition-all duration-300 cursor-pointer"
              onClick={() => navigate("/product/1")}
            >
              <div className="font-semibold text-primary">1 oz Gold Eagle</div>
              <div className="text-gold font-bold">$2,089.50</div>
            </div>
            <div 
              className="p-4 bg-muted rounded-lg hover-scale transition-all duration-300 cursor-pointer"
              onClick={() => navigate("/product/2")}
            >
              <div className="font-semibold text-primary">1 oz Silver Eagle</div>
              <div className="text-gold font-bold">$48.75</div>
            </div>
            <div 
              className="p-4 bg-muted rounded-lg hover-scale transition-all duration-300 cursor-pointer"
              onClick={() => navigate("/product/4")}
            >
              <div className="font-semibold text-primary">1 oz Platinum Eagle</div>
              <div className="text-gold font-bold">$1,650.00</div>
            </div>
            <div 
              className="p-4 bg-muted rounded-lg hover-scale transition-all duration-300 cursor-pointer"
              onClick={() => navigate("/product/3")}
            >
              <div className="font-semibold text-primary">1/10 oz Gold Maple</div>
              <div className="text-gold font-bold">$215.30</div>
            </div>
          </div>
          
          <Button 
            size="lg" 
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover-scale transition-all duration-300"
            onClick={() => navigate("/products")}
          >
            {t('categories.viewAll')}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;