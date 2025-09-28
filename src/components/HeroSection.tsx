import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight, Play, Pause, TrendingUp, Shield, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import heroGoldBars from "@/assets/hero-gold-bars.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const slides = [
    {
      title: "TRUSTED MINTS,",
      titleHighlight: "GLOBAL PRESTIGE",
      subtitle: "Gold Bars",
      description: "Discover premium gold bars from the world's most trusted mints. Secure your wealth with internationally recognized precious metals.",
      image: heroGoldBars,
      ctaText: "SHOP GOLD BARS",
      ctaAction: () => navigate("/products/gold"),
      stats: { label: "Gold Spot Price", value: "$2,089.50", change: "+0.74%" }
    },
    {
      title: "SECURE VAULT",
      titleHighlight: "STORAGE",
      subtitle: "Swiss Security",
      description: "Store your precious metals in our certified Swiss vaults with bank-level security and full insurance coverage.",
      image: heroGoldBars,
      ctaText: "LEARN MORE",
      ctaAction: () => navigate("/about"),
      stats: { label: "Assets Secured", value: "$2.5B+", change: "100% Insured" }
    },
    {
      title: "INSTANT",
      titleHighlight: "BUYBACK",
      subtitle: "Liquidity",
      description: "Sell your precious metals instantly at competitive market rates. Access your investment when you need it most.",
      image: heroGoldBars,
      ctaText: "START TRADING",
      ctaAction: () => navigate("/products"),
      stats: { label: "Avg. Processing", value: "< 24hrs", change: "Guaranteed" }
    },
    {
      title: "MARKET",
      titleHighlight: "INSIGHTS",
      subtitle: "Expert Analysis",
      description: "Stay ahead with our comprehensive market analysis and expert commentary on precious metals trends.",
      image: heroGoldBars,
      ctaText: "VIEW CHARTS",
      ctaAction: () => navigate("/charts"),
      stats: { label: "Market Cap", value: "$15.7T", change: "+12.3%" }
    },
    {
      title: "GLOBAL",
      titleHighlight: "DELIVERY",
      subtitle: "Worldwide Shipping",
      description: "Secure delivery to 40+ countries with full insurance and tracking. Your investment, delivered safely.",
      image: heroGoldBars,
      ctaText: "SHIPPING INFO",
      ctaAction: () => navigate("/shipping"),
      stats: { label: "Countries Served", value: "40+", change: "Free Shipping" }
    }
  ];

  const totalSlides = slides.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && !isHovered) {
      const interval = setInterval(() => {
        nextSlide();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, isHovered, currentSlide]);

  const currentSlideData = slides[currentSlide];

  return (
    <section 
      className="relative bg-gradient-to-r from-navy-deep to-navy-light overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white space-y-8">
            {/* Animated Badge */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <Award className="w-4 h-4 text-gold" />
                <p className="text-gold text-sm font-medium tracking-wide">
                  {currentSlideData.subtitle}
                </p>
              </div>
            </div>

            {/* Main Title with Animation */}
            <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="block">{currentSlideData.title}</span>
                <span className="text-gold bg-gradient-to-r from-gold to-yellow-400 bg-clip-text text-transparent">
                  {currentSlideData.titleHighlight}
                </span>
              </h1>
              
              {/* Stats Display */}
              <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <div>
                  <span className="text-sm text-white/60">{currentSlideData.stats.label}: </span>
                  <span className="font-bold text-lg">{currentSlideData.stats.value}</span>
                  <span className="text-green-400 text-sm ml-2">{currentSlideData.stats.change}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-white/80 max-w-lg leading-relaxed animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {currentSlideData.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <Button 
                size="lg"
                variant="hero"
                onClick={currentSlideData.ctaAction}
                className="hover-scale group"
              >
                {currentSlideData.ctaText}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate("/contact")}
                className="border-white/30 text-white hover:bg-white/10"
              >
                <Shield className="mr-2 w-4 h-4" />
                Get Expert Advice
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <div className="flex items-center gap-2 text-white/60">
                <Shield className="w-4 h-4" />
                <span className="text-sm">FINMA Regulated</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Award className="w-4 h-4" />
                <span className="text-sm">25+ Years Experience</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="aspect-video rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <img 
                src={currentSlideData.image} 
                alt="Premium Precious Metals"
                className="w-full h-full object-cover"
              />
              {/* Overlay with gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/50 to-transparent"></div>
              
              {/* Floating Stats Card */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm">Current Spot Price</p>
                      <p className="text-white font-bold text-lg">Gold: $2,089.50</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 text-sm">+0.74%</p>
                      <p className="text-white/80 text-xs">24h Change</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation */}
        <div className="flex items-center justify-center mt-12 gap-6 animate-fade-in" style={{ animationDelay: '1s' }}>
          {/* Previous Button */}
          <button 
            onClick={prevSlide}
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors hover-scale"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Slide Indicators */}
          <div className="flex items-center gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`transition-all duration-300 rounded-full ${
                  i === currentSlide 
                    ? 'w-8 h-2 bg-gold' 
                    : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                }`}
                onClick={() => goToSlide(i)}
              />
            ))}
          </div>

          {/* Next Button */}
          <button 
            onClick={nextSlide}
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors hover-scale"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Auto-play Toggle */}
          <button 
            onClick={toggleAutoPlay}
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors ml-4 hover-scale"
            title={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
          >
            {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 max-w-xs mx-auto">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-gold to-yellow-400 transition-all duration-300 ease-out"
              style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;