import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Truck, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const CTASection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Content */}
          <div className="mb-12 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
              {t('cta.subtitle')}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in [animation-delay:300ms]">
            <Button 
              size="lg" 
              className="bg-gold text-primary hover:bg-gold/90 text-lg px-8 py-3 hover-scale transition-all duration-300"
              onClick={() => navigate("/products")}
            >
              {t('cta.browse')}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-3 hover-scale transition-all duration-300"
              onClick={() => navigate("/auth")}
            >
              {t('cta.createAccount')}
            </Button>
          </div>

          {/* Trust Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in [animation-delay:600ms]">
            <div className="flex flex-col items-center text-center space-y-3 hover-scale transition-all duration-300">
              <Shield className="w-6 h-6 text-gold" />
              <h3 className="font-semibold text-white">{t('cta.feature1Title')}</h3>
              <p className="text-sm text-white/80">{t('cta.feature1Desc')}</p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-3 hover-scale transition-all duration-300">
              <Truck className="w-6 h-6 text-gold" />
              <h3 className="font-semibold text-white">{t('cta.feature2Title')}</h3>
              <p className="text-sm text-white/80">{t('cta.feature2Desc')}</p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-3 hover-scale transition-all duration-300">
              <Phone className="w-6 h-6 text-gold" />
              <h3 className="font-semibold text-white">{t('cta.feature3Title')}</h3>
              <p className="text-sm text-white/80">{t('cta.feature3Desc')}</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-white/80 mb-2">{t('cta.questions')}</p>
            <p 
              className="text-gold font-semibold text-lg cursor-pointer hover:text-gold/80 transition-colors"
              onClick={() => window.open("tel:+41225189211", "_self")}
            >
              +41 22 518 92 11
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;