import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Award, TrendingUp, CheckCircle2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroGoldBars from "@/assets/hero-gold-bars.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 py-12 md:py-20 lg:py-24">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--gold)/0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.03),transparent_50%)]" />
      
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Content */}
            <div className="space-y-6 md:space-y-8 animate-fade-in text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-gold/10 px-3 py-1.5 text-xs md:text-sm font-medium text-gold border border-gold/20 animate-fade-in [animation-delay:100ms]">
                <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span className="hidden sm:inline">{t('hero.badge')}</span>
                <span className="sm:hidden">{t('hero.badgeShort')}</span>
              </div>

              {/* Headline */}
              <div className="space-y-3 md:space-y-4 animate-fade-in [animation-delay:200ms]">
                <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                  {t('hero.title1')}
                  <span className="block bg-gradient-to-r from-gold via-gold/80 to-gold/60 bg-clip-text text-transparent">
                    {t('hero.title2')}
                  </span>
                  <span className="block">{t('hero.title3')}</span>
                </h1>
                
                <p className="text-base text-muted-foreground md:text-lg lg:text-xl max-w-xl mx-auto lg:mx-0">
                  {t('hero.subtitle')}
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 animate-fade-in [animation-delay:300ms] max-w-2xl mx-auto lg:mx-0">
                {[
                  { icon: Shield, text: t('hero.feature1') },
                  { icon: Award, text: t('hero.feature2') },
                  { icon: TrendingUp, text: t('hero.feature3') },
                  { icon: CheckCircle2, text: t('hero.feature4') },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 md:gap-3 rounded-lg md:rounded-xl bg-card/50 backdrop-blur-sm px-3 py-2.5 md:px-4 md:py-3 border border-border/50 hover:border-gold/30 hover:bg-card transition-all duration-300 hover-scale"
                  >
                    <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg bg-gold/10 shrink-0">
                      <feature.icon className="h-4 w-4 md:h-5 md:w-5 text-gold" />
                    </div>
                    <span className="font-medium text-xs md:text-sm leading-tight">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 animate-fade-in [animation-delay:400ms] max-w-md mx-auto lg:mx-0">
                <Button 
                  size="lg" 
                  className="bg-gold hover:bg-gold/90 text-white shadow-lg shadow-gold/20 hover:shadow-xl hover:shadow-gold/30 transition-all duration-300 group w-full sm:w-auto"
                  onClick={() => navigate("/products")}
                >
                  {t('hero.cta1')}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 hover:bg-accent w-full sm:w-auto"
                  onClick={() => navigate("/prices")}
                >
                  {t('hero.cta2')}
                </Button>
              </div>

              {/* Trust Stats */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-4 md:pt-6 border-t border-border/50 animate-fade-in [animation-delay:500ms]">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="h-4 w-4 md:h-5 md:w-5 text-gold fill-gold"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs md:text-sm">
                    <strong className="font-bold">4.9/5</strong>
                    <span className="text-muted-foreground hidden sm:inline"> {t('hero.rating')}</span>
                    <span className="text-muted-foreground sm:hidden"> {t('hero.ratingShort')}</span>
                  </span>
                </div>
                <div className="hidden sm:block h-4 w-px bg-border" />
                <div className="text-xs md:text-sm">
                  <strong className="font-bold">$550M+</strong>
                  <span className="text-muted-foreground"> {t('hero.sold')}</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative animate-fade-in [animation-delay:300ms] lg:order-last max-w-lg mx-auto lg:max-w-none">
              <div className="relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden border border-border/50 shadow-2xl">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold/20 via-transparent to-primary/10 mix-blend-overlay" />
                
                <img 
                  src={heroGoldBars}
                  alt="Premium gold bars and precious metals investment"
                  className="h-full w-full object-cover"
                />
                
                {/* Floating card - Top */}
                <div className="absolute top-3 right-3 md:top-6 md:right-6 animate-scale-in [animation-delay:600ms]">
                  <div className="rounded-xl md:rounded-2xl bg-background/95 backdrop-blur-md p-3 md:p-4 shadow-xl border border-border/50 hover-scale">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg md:rounded-xl bg-gradient-to-br from-gold to-gold/70">
                        <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xl md:text-2xl font-bold text-gold">+12.5%</p>
                        <p className="text-[10px] md:text-xs text-muted-foreground">{t('hero.growthCard')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating card - Bottom */}
                <div className="absolute bottom-3 left-3 md:bottom-6 md:left-6 animate-scale-in [animation-delay:700ms]">
                  <div className="rounded-xl md:rounded-2xl bg-background/95 backdrop-blur-md p-3 md:p-4 shadow-xl border border-border/50 hover-scale">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg md:rounded-xl bg-gradient-to-br from-primary to-primary/70">
                        <Shield className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-xl md:text-2xl font-bold">20+</p>
                        <p className="text-[10px] md:text-xs text-muted-foreground">{t('hero.trustCard')}</p>
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