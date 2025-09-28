import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Heart, Star, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { parseGoldProductsCSV } from "@/utils/csvParser";
import { useCart } from "@/contexts/CartContext";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  metal: "gold" | "silver" | "platinum" | "palladium";
  weight: string;
  purity: string;
  mint: string;
  inStock: boolean;
  rating: number;
  reviews: number;
  description: string;
}

const Products = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItem } = useCart();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [csvProducts, setCsvProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 25;

  // Initialize search term from URL params
  useEffect(() => {
    const urlSearchTerm = searchParams.get('search');
    if (urlSearchTerm) {
      setSearchTerm(urlSearchTerm);
    }
  }, [searchParams]);

  // Load CSV products for gold category
  useEffect(() => {
    if (category === 'gold') {
      setLoading(true);
      parseGoldProductsCSV('/data/gold-products.csv')
        .then((products) => {
          setCsvProducts(products);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error loading CSV products:', error);
          setLoading(false);
        });
    }
  }, [category]);

  const mockProducts: Product[] = [
    {
      id: "1",
      name: "1 oz American Gold Eagle",
      price: 2089.50,
      originalPrice: 2150.00,
      image: "/api/placeholder/300/300",
      metal: "gold",
      weight: "1 oz",
      purity: "22 karat",
      mint: "US Mint",
      inStock: true,
      rating: 4.9,
      reviews: 1250,
      description: "The American Gold Eagle is one of the most popular gold coins in the world."
    },
    {
      id: "2",
      name: "1 oz Silver American Eagle",
      price: 48.75,
      image: "/api/placeholder/300/300",
      metal: "silver",
      weight: "1 oz",
      purity: "99.9% fine",
      mint: "US Mint",
      inStock: true,
      rating: 4.8,
      reviews: 892,
      description: "The Silver American Eagle is the official silver bullion coin of the United States."
    },
    {
      id: "3",
      name: "1/10 oz Gold Canadian Maple Leaf",
      price: 215.30,
      image: "/api/placeholder/300/300",
      metal: "gold",
      weight: "1/10 oz",
      purity: "24 karat",
      mint: "Royal Canadian Mint",
      inStock: true,
      rating: 4.7,
      reviews: 456,
      description: "The Gold Maple Leaf is the official gold bullion coin of Canada."
    },
    {
      id: "4",
      name: "1 oz Platinum American Eagle",
      price: 1650.00,
      image: "/api/placeholder/300/300",
      metal: "platinum",
      weight: "1 oz",
      purity: "99.95% fine",
      mint: "US Mint",
      inStock: false,
      rating: 4.6,
      reviews: 234,
      description: "The Platinum American Eagle is the official platinum bullion coin of the United States."
    },
    {
      id: "5",
      name: "10 oz Silver Bar - PAMP Suisse",
      price: 487.50,
      image: "/api/placeholder/300/300",
      metal: "silver",
      weight: "10 oz",
      purity: "99.9% fine",
      mint: "PAMP Suisse",
      inStock: true,
      rating: 4.9,
      reviews: 678,
      description: "PAMP Suisse silver bars are known for their exceptional quality and design."
    },
    {
      id: "6",
      name: "1 oz Gold Bar - Credit Suisse",
      price: 2045.00,
      image: "/api/placeholder/300/300",
      metal: "gold",
      weight: "1 oz",
      purity: "99.99% fine",
      mint: "Credit Suisse",
      inStock: true,
      rating: 4.8,
      reviews: 543,
      description: "Credit Suisse gold bars are recognized worldwide for their purity and authenticity."
    }
  ];

  // Use CSV products for gold category, mock products for others
  const allProducts = category === 'gold' && csvProducts.length > 0 ? csvProducts : mockProducts;
  
  const filteredProducts = allProducts.filter(product => {
    const matchesCategory = !category || category === "all" || product.metal === category;
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.metal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.mint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return b.id.localeCompare(a.id);
      default:
        return 0;
    }
  });

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, category]);

  // Pagination calculations
  const totalProducts = sortedProducts.length;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPaginationPages = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      metal: product.metal,
      weight: product.weight,
      mint: product.mint,
      purity: product.purity,
      inStock: product.inStock,
      description: product.description
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
    
    const isInWishlist = wishlist.includes(productId);
    toast({
      title: isInWishlist ? "Removed from wishlist" : "Added to wishlist",
      description: isInWishlist ? "Product removed from your wishlist." : "Product added to your wishlist.",
    });
  };

  const getCategoryTitle = () => {
    switch (category) {
      case "gold": return "Gold Products";
      case "silver": return "Silver Products";
      case "platinum": return "Platinum Products";
      case "palladium": return "Palladium Products";
      default: return "All Products";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">{getCategoryTitle()}</h1>
          <p className="text-muted-foreground">
            Discover our premium selection of precious metals from trusted mints worldwide
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Results Info */}
        {!loading && totalProducts > 0 && (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
            <p className="text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, totalProducts)} of {totalProducts} products
            </p>
            <p className="text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {currentProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-luxury transition-all duration-300 hover-scale">
                <CardHeader className="p-0">
                  <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.originalPrice && (
                      <Badge className="absolute top-3 left-3 bg-red-500">
                        Sale
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-3 right-3 bg-white/80 hover:bg-white"
                      onClick={() => toggleWishlist(product.id)}
                    >
                      <Heart 
                        className={`w-4 h-4 ${
                          wishlist.includes(product.id) 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-gray-600'
                        }`} 
                      />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(product.rating) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">
                      ({product.reviews})
                    </span>
                  </div>
                  
                  <CardTitle className="text-sm md:text-lg mb-2 line-clamp-2 leading-tight">{product.name}</CardTitle>
                  <CardDescription className="text-xs md:text-sm mb-3 line-clamp-1">
                    {product.weight} • {product.purity} • {product.mint}
                  </CardDescription>
                  
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-lg md:text-2xl font-bold text-gold">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs md:text-sm text-muted-foreground line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <Badge variant={product.inStock ? "default" : "destructive"} className="text-xs">
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 text-xs md:text-sm"
                        variant="gold"
                        disabled={!product.inStock}
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/product/${product.id}`, { 
                          state: { product } 
                        })}
                        className="px-2 md:px-3"
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-full sm:w-auto"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {getPaginationPages().map((page, index) => (
                <div key={index}>
                  {page === '...' ? (
                    <span className="px-3 py-2 text-muted-foreground">...</span>
                  ) : (
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page as number)}
                      className="min-w-[40px]"
                    >
                      {page}
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-full sm:w-auto"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {sortedProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchTerm("");
                setSortBy("featured");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Products;