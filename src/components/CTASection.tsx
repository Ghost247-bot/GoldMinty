import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Truck, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Content */}
          <div className="mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Start Investing in Precious Metals?
            </h2>
            <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
              Join thousands of investors who trust Gold Avenue for their precious metal investments. 
              Build your portfolio with confidence.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-gold text-primary hover:bg-gold/90 text-lg px-8 py-3"
              onClick={() => navigate("/products")}
            >
              Browse Products
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-3"
              onClick={() => navigate("/auth")}
            >
              Create Account
            </Button>
          </div>

          {/* Trust Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-3">
              <Shield className="w-6 h-6 text-gold" />
              <h3 className="font-semibold text-white">Secure & Insured</h3>
              <p className="text-sm text-white/80">All shipments fully insured</p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-3">
              <Truck className="w-6 h-6 text-gold" />
              <h3 className="font-semibold text-white">Fast Delivery</h3>
              <p className="text-sm text-white/80">Quick worldwide shipping</p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-3">
              <Phone className="w-6 h-6 text-gold" />
              <h3 className="font-semibold text-white">Expert Support</h3>
              <p className="text-sm text-white/80">Dedicated specialists</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-white/80 mb-2">Questions? Contact our experts</p>
            <p className="text-gold font-semibold text-lg">+41 22 518 92 11</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;