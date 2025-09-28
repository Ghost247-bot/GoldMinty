import { Search, Phone, Globe, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logoSymbol from "@/assets/logo-symbol.png";

const Header = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [cartCount, setCartCount] = useState(3);

  const navigationItems = [
    { label: "🔥 Deals", href: "/products?category=deals" },
    { label: "Gold", href: "/products/gold" },
    { label: "Silver", href: "/products/silver" },
    { label: "Platinum & Palladium", href: "/products/platinum" },
    { label: "Live Charts", href: "/charts" },
    { label: "Price List", href: "/prices" },
    { label: "Resources", href: "/resources" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>+41 22 518 92 11</span>
            </div>
            <span>|</span>
            <span>Need help?</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>EN</span>
            </div>
            <span>$ USD</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/auth")}
            >
              Sign in
            </Button>
          </div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleLogoClick}
          >
            <img src={logoSymbol} alt="Gold Avenue" className="w-10 h-10" />
            <div className="font-bold text-xl tracking-wide">
              <span className="text-gold">GOLD</span>
              <span className="text-foreground"> AVENUE</span>
            </div>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search a product"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>

          {/* Cart and User */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/cart")}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gold text-navy-deep text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/auth")}
            >
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-8 py-4 border-t border-border">
          {navigationItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.href)}
              className="text-sm font-medium text-foreground hover:text-gold transition-colors"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;