import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import logoSymbol from "@/assets/logo-symbol.png";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const { t } = useLanguage();

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      toast({
        title: t('footer.newsletter.success'),
        description: t('footer.newsletter.successDesc'),
      });
      setEmail("");
    }
  };
  
  const productLinks = [
    { label: t('footer.products.goldBars'), href: "/products/gold" },
    { label: t('footer.products.goldCoins'), href: "/products/gold" },
    { label: t('footer.products.silverBars'), href: "/products/silver" },
    { label: t('footer.products.silverCoins'), href: "/products/silver" },
    { label: t('footer.products.platinum'), href: "/products/platinum" },
    { label: t('footer.products.palladium'), href: "/products/platinum" },
  ];

  const companyLinks = [
    { label: t('footer.company.about'), href: "/about" },
    { label: t('footer.company.story'), href: "/about" },
    { label: t('footer.company.careers'), href: "/careers" },
    { label: t('footer.company.press'), href: "/press" },
    { label: t('footer.company.blog'), href: "/blog" },
    { label: t('footer.company.investors'), href: "/contact" },
  ];

  const supportLinks = [
    { label: t('footer.support.helpCenter'), href: "/help-center" },
    { label: t('footer.support.contact'), href: "/contact" },
    { label: t('footer.support.shipping'), href: "/shipping" },
    { label: t('footer.support.returns'), href: "/returns" },
    { label: t('footer.support.track'), href: "/contact" },
    { label: t('footer.support.faq'), href: "/help-center" },
  ];

  const legalLinks = [
    { label: t('footer.legal.privacy'), href: "/privacy-policy" },
    { label: t('footer.legal.terms'), href: "/terms-of-service" },
    { label: t('footer.legal.cookies'), href: "/cookie-policy" },
    { label: t('footer.legal.compliance'), href: "/about" },
    { label: t('footer.legal.security'), href: "/about" },
    { label: t('footer.legal.notice'), href: "/legal-notice" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/Gold Mint", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com/Gold Mint", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com/Gold Mint", label: "Instagram" },
    { icon: Linkedin, href: "https://linkedin.com/company/Gold Mint", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-navy-deep text-white">
      {/* Newsletter Section */}
      <div className="border-b border-navy-light">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">{t('footer.newsletter.title')}</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              {t('footer.newsletter.subtitle')}
            </p>
            <form onSubmit={handleNewsletterSignup} className="flex max-w-md mx-auto gap-4">
              <Input
                type="email"
                placeholder={t('footer.newsletter.email')}
                className="bg-navy-light border-navy-light text-white placeholder:text-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button variant="gold" className="whitespace-nowrap" type="submit">
                {t('footer.newsletter.subscribe')}
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
              <img src={logoSymbol} alt="Gold Mint" className="h-8 w-8" />
              <span className="text-xl font-bold">Gold Mint</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-sm">
              {t('footer.description')}
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="h-4 w-4" />
                <span>+41 22 518 92 11</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="h-4 w-4" />
                <span>support@Gold Mint.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>Geneva, Switzerland</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-lg mb-6">{t('footer.products.title')}</h4>
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
            <h4 className="font-semibold text-lg mb-6">{t('footer.company.title')}</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigate(link.href)}
                    className="text-gray-300 hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-lg mb-6">{t('footer.support.title')}</h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigate(link.href)}
                    className="text-gray-300 hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </button>
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
              <p className="text-gray-300">{t('footer.trust.security')}</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-gold mb-2">💎</div>
              <p className="text-gray-300">{t('footer.trust.certified')}</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-gold mb-2">📈</div>
              <p className="text-gray-300">{t('footer.trust.pricing')}</p>
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
                <button
                  key={link.label}
                  onClick={() => navigate(link.href)}
                  className="text-sm text-gray-400 hover:text-gold transition-colors duration-200"
                >
                  {link.label}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">{t('footer.followUs')}</span>
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
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;