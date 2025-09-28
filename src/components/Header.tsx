import { Search, Phone, Globe, ShoppingCart, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logoSymbol from "@/assets/logo-symbol.png";
import { useCart } from "@/contexts/CartContext";

const Header = () => {
  const navigate = useNavigate();
  const { state } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("EN");

  const languages = [
    { code: "EN", name: "English" },
    { code: "FR", name: "Français" },
    { code: "DE", name: "Deutsch" },
    { code: "IT", name: "Italiano" }
  ];

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
      setSearchTerm(""); // Clear search after navigation
    }
  };

  const handleQuickSearch = (term: string) => {
    navigate(`/products?search=${encodeURIComponent(term)}`);
    setSearchTerm("");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handlePhoneClick = () => {
    window.open("tel:+41225189211", "_self");
  };

  const handleHelpClick = () => {
    navigate("/help-center");
  };

  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode);
    // Here you would typically update the app's language context
  };

  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div 
              className="flex items-center gap-2 cursor-pointer hover:text-gold transition-colors"
              onClick={handlePhoneClick}
            >
              <Phone className="w-4 h-4" />
              <span>+41 22 518 92 11</span>
            </div>
            <span>|</span>
            <span 
              className="cursor-pointer hover:text-gold transition-colors"
              onClick={handleHelpClick}
            >
              Need help?
            </span>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer hover:text-gold transition-colors">
                <Globe className="w-4 h-4" />
                <span>{selectedLanguage}</span>
                <ChevronDown className="w-3 h-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem 
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className="cursor-pointer"
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search gold, silver, platinum..."
                className="pl-10 focus:ring-2 focus:ring-gold/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              {/* Quick search suggestions */}
              {searchTerm && (
                <div className="absolute top-full left-0 right-0 bg-background border border-border rounded-md shadow-lg mt-1 z-50">
                  <div className="p-2 space-y-1">
                    <button
                      type="button"
                      onClick={() => handleQuickSearch("gold eagle")}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-sm flex items-center gap-2"
                    >
                      <Search className="w-3 h-3" />
                      Gold American Eagle
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickSearch("silver bar")}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-sm flex items-center gap-2"
                    >
                      <Search className="w-3 h-3" />
                      Silver Bars
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickSearch("platinum")}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-sm flex items-center gap-2"
                    >
                      <Search className="w-3 h-3" />
                      Platinum Coins
                    </button>
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* Cart and User */}
          <div className="flex items-center gap-4">
            <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className="w-5 h-5" />
              {state.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.totalItems}
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