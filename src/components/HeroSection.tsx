import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import heroGoldBars from "@/assets/hero-gold-bars.jpg";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-navy-deep to-navy-light overflow-hidden">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white space-y-6">
            <div className="space-y-2">
              <p className="text-gold text-sm font-medium tracking-wide uppercase">
                Gold Bars
              </p>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                TRUSTED MINTS,<br />
                <span className="text-gold">GLOBAL PRESTIGE</span>
              </h1>
            </div>
            <p className="text-lg text-white/80 max-w-md">
              Discover premium gold bars from the world's most trusted mints. 
              Secure your wealth with internationally recognized precious metals.
            </p>
            <Button 
              size="lg"
              variant="hero"
            >
              SHOP NOW
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="aspect-video rounded-lg overflow-hidden shadow-2xl">
              <img 
                src={heroGoldBars} 
                alt="Premium Gold Bars"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Navigation dots */}
        <div className="flex items-center justify-center mt-12 gap-2">
          <ChevronLeft className="w-6 h-6 text-white/50 hover:text-white cursor-pointer transition-colors" />
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === 0 ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
          <ChevronRight className="w-6 h-6 text-white/50 hover:text-white cursor-pointer transition-colors" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;