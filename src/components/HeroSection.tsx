import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Award, TrendingUp, CheckCircle2, Star, Users, DollarSign, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroGoldBars from "@/assets/hero-gold-bars.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Buy & Sell",
      subtitle: "Precious Metals",
      description: "with Confidence",
      content: "Secure your wealth with physical gold, silver, and platinum. Professional storage, insurance, and 24/7 market access.",
      cta: "Start Investing",
      ctaSecondary: "View Live Prices",
      badge: "Trusted by 50,000+ investors worldwide",
      image: heroGoldBars,
      stats: [
        { value: "$2.5B+", label: "Assets Under Management" },
        { value: "50K+", label: "Happy Customers" },
        { value: "4.9/5", label: "Customer Rating" },
        { value: "24/7", label: "Market Access" }
      ],
      features: [
        { icon: Shield, text: "Fully Insured Storage" },
        { icon: Award, text: "LBMA Certified" },
        { icon: TrendingUp, text: "Live Market Prices" },
        { icon: CheckCircle2, text: "Instant Liquidity" }
      ]
    },
    {
      id: 2,
      title: "Secure",
      subtitle: "Storage Solutions",
      description: "for Your Wealth",
      content: "Professional vault storage with full insurance coverage. Your precious metals are protected in state-of-the-art facilities.",
      cta: "Learn More",
      ctaSecondary: "View Storage",
      badge: "Fully Insured & LBMA Certified",
      image: heroGoldBars,
      stats: [
        { value: "$1M", label: "Insurance Coverage" },
        { value: "99.9%", label: "Purity Guarantee" },
        { value: "24/7", label: "Security Monitoring" },
        { value: "Global", label: "Storage Network" }
      ],
      features: [
        { icon: Shield, text: "Bank-Grade Security" },
        { icon: Award, text: "LBMA Approved" },
        { icon: TrendingUp, text: "Real-Time Tracking" },
        { icon: CheckCircle2, text: "Instant Access" }
      ]
    },
    {
      id: 3,
      title: "Live",
      subtitle: "Market Prices",
      description: "Updated 24/7",
      content: "Get real-time precious metals prices and market insights. Make informed investment decisions with our professional tools.",
      cta: "View Prices",
      ctaSecondary: "Market Analysis",
      badge: "Real-Time Market Data",
      image: heroGoldBars,
      stats: [
        { value: "+2.4%", label: "Gold Today" },
        { value: "+1.8%", label: "Silver Today" },
        { value: "+3.2%", label: "Platinum Today" },
        { value: "Live", label: "Price Updates" }
      ],
      features: [
        { icon: TrendingUp, text: "Live Price Feeds" },
        { icon: Award, text: "Market Analysis" },
        { icon: TrendingUp, text: "Price Alerts" },
        { icon: CheckCircle2, text: "Historical Data" }
      ]
    }
  ];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section className="relative bg-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white"></div>
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f3f4f6' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}></div>
      </div>
      
      <div className="relative container mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-2 text-sm font-medium text-amber-800 mb-6">
                <Star className="h-4 w-4 text-amber-600" />
                {currentSlideData.badge}
              </div>

              {/* Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                {currentSlideData.title}
                <span className="block text-amber-600">{currentSlideData.subtitle}</span>
                <span className="block text-gray-700">{currentSlideData.description}</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
                {currentSlideData.content}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button 
                  size="lg" 
                  className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
                  onClick={() => navigate("/products")}
                >
                  {currentSlideData.cta}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300"
                  onClick={() => navigate("/prices")}
                >
                  {currentSlideData.ctaSecondary}
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {currentSlideData.stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-amber-600 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentSlideData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <feature.icon className="h-5 w-5 text-amber-600" />
                    </div>
                    <span className="font-medium text-gray-700">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={currentSlideData.image}
                  alt="Premium gold bars and precious metals investment"
                  className="w-full h-[500px] object-cover"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                
                {/* Floating Cards */}
                <div className="absolute top-6 right-6">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">{currentSlideData.stats[0].value}</div>
                        <div className="text-xs text-gray-600">{currentSlideData.stats[0].label}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-6 left-6">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Shield className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">{currentSlideData.stats[1].value}</div>
                        <div className="text-xs text-gray-600">{currentSlideData.stats[1].label}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={prevSlide}
          className="w-10 h-10 rounded-full bg-white/80 hover:bg-white border-gray-300 shadow-lg"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Dots */}
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-amber-600 w-8' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={nextSlide}
          className="w-10 h-10 rounded-full bg-white/80 hover:bg-white border-gray-300 shadow-lg"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;