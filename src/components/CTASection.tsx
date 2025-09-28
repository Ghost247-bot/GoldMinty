import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Truck, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-20 bg-gradient-to-br from-primary via-navy-light to-primary overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5"></div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-gold/10 blur-2xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-gold/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Content */}
          <div className="mb-12 animate-fade-in">
            <h2 className="font-display text-4xl lg:text-6xl font-bold text-white mb-6">
              Start Your <span className="text-gold">Precious Metal</span> Journey Today
            </h2>
            <p className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
              Join thousands of investors who trust Gold Avenue for their precious metal investments. 
              Secure your financial future with our premium selection of gold, silver, and platinum.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <Button 
              size="lg" 
              className="bg-gold text-navy-deep hover:bg-gold-dark text-lg px-8 py-4 h-auto font-semibold shadow-glow hover-scale"
              onClick={() => navigate("/products")}
            >
              Shop Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4 h-auto font-semibold backdrop-blur-sm hover-scale"
              onClick={() => navigate("/auth")}
            >
              Create Account
            </Button>
          </div>

          {/* Trust Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover-scale">
              <Shield className="w-8 h-8 text-gold" />
              <h3 className="font-semibold text-white">Secure & Insured</h3>
              <p className="text-sm text-white/70">All shipments fully insured with tracking</p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover-scale">
              <Truck className="w-8 h-8 text-gold" />
              <h3 className="font-semibold text-white">Fast Delivery</h3>
              <p className="text-sm text-white/70">Quick processing and worldwide shipping</p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover-scale">
              <Phone className="w-8 h-8 text-gold" />
              <h3 className="font-semibold text-white">Expert Support</h3>
              <p className="text-sm text-white/70">Dedicated precious metals specialists</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-12 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 animate-fade-in" style={{ animationDelay: '0.9s' }}>
            <p className="text-white/80 mb-2">Need help getting started?</p>
            <p className="text-gold font-semibold text-lg">Call our experts: +41 22 518 92 11</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;