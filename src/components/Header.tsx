import { Search, Phone, Globe, ShoppingCart, User, ChevronDown, Menu, LogOut, Settings, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logoSymbol from "@/assets/logo-symbol.png";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("EN");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Safe cart access with fallback
  let cartState = { totalItems: 0 };
  try {
    const cartContext = useCart();
    cartState = cartContext.state;
  } catch (error) {
    console.warn('Cart context not available:', error);
  }

  // Safe auth access with fallback
  let authState = { user: null, userRole: null, signOut: () => {} };
  try {
    const authContext = useAuth();
    authState = authContext;
  } catch (error) {
    console.warn('Auth context not available:', error);
  }

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
        {/* Top bar - Hidden on mobile */}
        <div className="hidden md:flex items-center justify-between py-3 text-sm text-muted-foreground">
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
            {!authState.user ? (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/login")}
              >
                Sign in
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="max-w-[150px] truncate">{authState.user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <Settings className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  {authState.userRole === 'admin' && (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      <Settings className="w-4 h-4 mr-2" />
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={authState.signOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between py-3 md:py-4 gap-2 md:gap-4">
          {/* Mobile Menu Button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="sm" aria-label="Menu">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search products..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </form>

                {/* Mobile Navigation */}
                <nav className="flex flex-col space-y-3">
                  {navigationItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        navigate(item.href);
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-left px-3 py-2 text-sm font-medium text-foreground hover:text-gold hover:bg-muted rounded-md transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>

                {/* Mobile Top Bar Items */}
                <div className="pt-4 border-t space-y-3">
                  <div 
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:text-gold transition-colors"
                    onClick={handlePhoneClick}
                  >
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">+41 22 518 92 11</span>
                  </div>
                  <div 
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:text-gold transition-colors"
                    onClick={handleHelpClick}
                  >
                    <span className="text-sm">Need help?</span>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 w-full hover:text-gold transition-colors">
                      <Globe className="w-4 h-4" />
                      <span className="text-sm">{selectedLanguage}</span>
                      <ChevronDown className="w-3 h-3 ml-auto" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {languages.map((lang) => (
                        <DropdownMenuItem 
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code)}
                        >
                          {lang.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="px-3 py-2 text-sm">$ USD</div>

                  {!authState.user && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        navigate("/login");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Sign in
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <div 
            className="flex items-center gap-2 md:gap-3 cursor-pointer hover:opacity-80 transition-opacity flex-1 md:flex-initial"
            onClick={handleLogoClick}
          >
            <img src={logoSymbol} alt="Gold Avenue" className="w-8 h-8 md:w-10 md:h-10" />
            <div className="font-bold text-base md:text-xl tracking-wide">
              <span className="text-gold">GOLD</span>
              <span className="text-foreground"> AVENUE</span>
            </div>
          </div>

          {/* Desktop Search - Hidden on mobile and tablet */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative group w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search gold, silver, platinum..."
                className="pl-10 focus:ring-2 focus:ring-gold/20 w-full"
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

          {/* Wishlist, Cart and User Icons */}
          <div className="flex items-center gap-1 md:gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/wishlist")}
              aria-label="Wishlist"
              className="hidden sm:flex"
            >
              <Heart className="w-5 h-5" />
            </Button>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="relative"
                onClick={() => navigate("/cart")}
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartState.totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartState.totalItems}
                  </span>
                )}
              </Button>
            </div>
            {!authState.user ? (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/login")}
                aria-label="Sign in"
                className="hidden md:flex"
              >
                <User className="w-5 h-5" />
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" aria-label="User menu">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <Settings className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  {authState.userRole === 'admin' && (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      <Settings className="w-4 h-4 mr-2" />
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={authState.signOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Desktop Navigation - Hidden on mobile */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 py-4 border-t border-border overflow-x-auto">
          {navigationItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.href)}
              className="text-sm font-medium text-foreground hover:text-gold transition-colors whitespace-nowrap"
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