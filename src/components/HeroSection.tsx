import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Award, Globe, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroGoldBars from "@/assets/hero-gold-bars.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-b from-background to-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight animate-fade-in [animation-delay:200ms]">
                  Premium <span className="text-gold">Precious Metals</span> for Smart Investors
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed animate-fade-in [animation-delay:400ms]">
                  Discover our carefully curated selection of gold, silver, platinum, and palladium from the world's most trusted mints. Build your wealth with confidence.
                </p>
                
                {/* Key Features */}
                <div className="flex flex-wrap gap-4 text-sm animate-fade-in [animation-delay:600ms]">
                  <div className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg border hover-scale transition-all duration-300">
                    <Shield className="w-4 h-4 text-gold" />
                    <span>Swiss-Grade Security</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg border hover-scale transition-all duration-300">
                    <Award className="w-4 h-4 text-gold" />
                    <span>Certified Authentic</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg border hover-scale transition-all duration-300">
                    <Globe className="w-4 h-4 text-gold" />
                    <span>Worldwide Delivery</span>
                  </div>
                </div>
              </div>
              
              {/* Call to Action */}
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in [animation-delay:800ms]">
                <Button 
                  size="lg" 
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => navigate("/products")}
                >
                  Browse Collection
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate("/prices")}
                >
                  View Live Prices
                </Button>
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={() => navigate("/login")}
                >
                  Login to Dashboard
                </Button>
              </div>
              
              {/* Trust Indicators */}
              <div className="pt-6 border-t">
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-gold text-gold" />
                    <span className="font-semibold text-foreground">4.9/5</span>
                    <span>Customer Rating</span>
                  </div>
                  <div className="w-px h-4 bg-border"></div>
                  <span><strong>151,000+</strong> Satisfied Customers</span>
                </div>
              </div>
            </div>
            
            {/* Hero Image */}
            <div className="relative animate-fade-in [animation-delay:300ms]">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gold/10 to-gold/5 border">
                <img 
                  src={heroGoldBars}
                  alt="Premium gold bars and coins"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-card border rounded-xl p-4 shadow-lg animate-scale-in [animation-delay:1000ms] hover-scale">
                <div className="text-2xl font-bold text-gold">$550M+</div>
                <div className="text-sm text-muted-foreground">Total Sales</div>
              </div>
              
              <div className="absolute -top-6 -right-6 bg-card border rounded-xl p-4 shadow-lg animate-scale-in [animation-delay:1200ms] hover-scale">
                <div className="text-2xl font-bold text-gold">20+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;