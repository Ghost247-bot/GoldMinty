import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import logoSymbol from "@/assets/logo-symbol.png";

const Footer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      toast({
        title: "Thank you for subscribing!",
        description: "You'll receive our latest market insights and exclusive offers.",
      });
      setEmail("");
    }
  };
  const productLinks = [
    { label: "Gold Bars", href: "/products/gold" },
    { label: "Gold Coins", href: "/products/gold" },
    { label: "Silver Bars", href: "/products/silver" },
    { label: "Silver Coins", href: "/products/silver" },
    { label: "Platinum Products", href: "/products/platinum" },
    { label: "Palladium Products", href: "/products/platinum" },
  ];

  const companyLinks = [
    { label: "About Us", href: "#" },
    { label: "Our Story", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Investors", href: "#" },
  ];

  const supportLinks = [
    { label: "Help Center", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "Shipping Info", href: "#" },
    { label: "Returns", href: "#" },
    { label: "Track Order", href: "#" },
    { label: "FAQ", href: "#" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Compliance", href: "#" },
    { label: "Security", href: "#" },
    { label: "Legal Notice", href: "#" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-navy-deep text-white">
      {/* Newsletter Section */}
      <div className="border-b border-navy-light">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated with Market Insights</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Get exclusive market analysis, precious metals insights, and early access to new products.
            </p>
            <form onSubmit={handleNewsletterSignup} className="flex max-w-md mx-auto gap-4">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-navy-light border-navy-light text-white placeholder:text-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button variant="gold" className="whitespace-nowrap" type="submit">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div 
              className="flex items-center gap-3 mb-6 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate("/")}
            >
              <img src={logoSymbol} alt="Gold Avenue" className="h-8 w-8" />
              <span className="text-xl font-bold">GOLD AVENUE</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-sm">
              Your trusted partner in precious metals investment. We provide secure storage, 
              instant buyback, and transparent pricing for gold, silver, platinum, and palladium.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="h-4 w-4" />
                <span>+41 22 518 92 11</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="h-4 w-4" />
                <span>support@goldavenue.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>Geneva, Switzerland</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Products</h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigate(link.href)}
                    className="text-gray-300 hover:text-gold transition-colors duration-200 text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Support</h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 pt-8 border-t border-navy-light">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-gold mb-2">🔒</div>
              <p className="text-gray-300">Swiss Bank-Level Security</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-gold mb-2">💎</div>
              <p className="text-gray-300">Certified Precious Metals</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-gold mb-2">📈</div>
              <p className="text-gray-300">Instant Market Pricing</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-navy-light">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center md:justify-start gap-6">
              {legalLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-gold transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">Follow us:</span>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="text-gray-400 hover:text-gold transition-colors duration-200"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <Separator className="my-4 bg-navy-light" />
          
          <div className="text-center text-sm text-gray-400">
            <p>© 2024 Gold Avenue. All rights reserved. | Regulated by Swiss Financial Market Supervisory Authority (FINMA)</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;