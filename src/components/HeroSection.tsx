import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Award, TrendingUp, CheckCircle2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroGoldBars from "@/assets/hero-gold-bars.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 py-16 md:py-24">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--gold)/0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.03),transparent_50%)]" />
      
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Content */}
            <div className="space-y-8 animate-fade-in">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-gold/10 px-4 py-2 text-sm font-medium text-gold border border-gold/20 animate-fade-in [animation-delay:100ms]">
                <Sparkles className="h-4 w-4" />
                <span>Trusted by 151,000+ Investors Worldwide</span>
              </div>

              {/* Headline */}
              <div className="space-y-4 animate-fade-in [animation-delay:200ms]">
                <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl xl:text-7xl">
                  Invest in
                  <span className="block bg-gradient-to-r from-gold via-gold/80 to-gold/60 bg-clip-text text-transparent">
                    Precious Metals
                  </span>
                  <span className="block">with Confidence</span>
                </h1>
                
                <p className="text-lg text-muted-foreground md:text-xl max-w-xl">
                  Build lasting wealth with certified gold, silver, platinum, and palladium from the world's most trusted mints.
                </p>
              </div>

              {/* Features */}
              <div className="grid gap-3 sm:grid-cols-2 animate-fade-in [animation-delay:300ms]">
                {[
                  { icon: Shield, text: "Bank-Grade Security" },
                  { icon: Award, text: "100% Authentic" },
                  { icon: TrendingUp, text: "Live Market Prices" },
                  { icon: CheckCircle2, text: "Insured Delivery" },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-xl bg-card/50 backdrop-blur-sm px-4 py-3 border border-border/50 hover:border-gold/30 hover:bg-card transition-all duration-300 hover-scale"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
                      <feature.icon className="h-5 w-5 text-gold" />
                    </div>
                    <span className="font-medium text-sm">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row animate-fade-in [animation-delay:400ms]">
                <Button 
                  size="lg" 
                  className="bg-gold hover:bg-gold/90 text-white shadow-lg shadow-gold/20 hover:shadow-xl hover:shadow-gold/30 transition-all duration-300 group"
                  onClick={() => navigate("/products")}
                >
                  Start Investing
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 hover:bg-accent"
                  onClick={() => navigate("/prices")}
                >
                  View Live Prices
                </Button>
              </div>

              {/* Trust Stats */}
              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-border/50 animate-fade-in [animation-delay:500ms]">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="h-5 w-5 text-gold fill-gold"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm">
                    <strong className="font-bold">4.9/5</strong>
                    <span className="text-muted-foreground"> from 12,500+ reviews</span>
                  </span>
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="text-sm">
                  <strong className="font-bold">$550M+</strong>
                  <span className="text-muted-foreground"> in precious metals sold</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative animate-fade-in [animation-delay:300ms] lg:order-last">
              <div className="relative aspect-square rounded-3xl overflow-hidden border border-border/50 shadow-2xl">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold/20 via-transparent to-primary/10 mix-blend-overlay" />
                
                <img 
                  src={heroGoldBars}
                  alt="Premium gold bars and precious metals investment"
                  className="h-full w-full object-cover"
                />
                
                {/* Floating card - Top */}
                <div className="absolute top-6 right-6 animate-scale-in [animation-delay:600ms]">
                  <div className="rounded-2xl bg-background/95 backdrop-blur-md p-4 shadow-xl border border-border/50 hover-scale">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-gold/70">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gold">+12.5%</p>
                        <p className="text-xs text-muted-foreground">Annual Growth</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating card - Bottom */}
                <div className="absolute bottom-6 left-6 animate-scale-in [animation-delay:700ms]">
                  <div className="rounded-2xl bg-background/95 backdrop-blur-md p-4 shadow-xl border border-border/50 hover-scale">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70">
                        <Shield className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">20+</p>
                        <p className="text-xs text-muted-foreground">Years Trusted</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;