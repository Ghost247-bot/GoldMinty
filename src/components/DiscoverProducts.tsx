import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, ShoppingCart, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  price: number;
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

const DiscoverProducts = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(8); // Show only 8 products on home page

        if (error) throw error;

        // Map Supabase data to Product interface
        const mappedProducts: Product[] = (data || []).map((item) => ({
          id: item.id,
          name: item.name,
          price: Number(item.price_usd),
          image: item.image_url || "/api/placeholder/300/300",
          metal: (item.metal_type || 'gold') as "gold" | "silver" | "platinum" | "palladium",
          weight: item.weight || "N/A",
          purity: item.purity || "N/A",
          mint: item.brand || "N/A",
          inStock: true,
          rating: 4.8,
          reviews: Math.floor(Math.random() * 1000) + 100,
          description: item.description || item.name
        }));

        setProducts(mappedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
        toast({
          title: "Error loading products",
          description: "Failed to fetch products from database.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      metal: product.metal,
      weight: product.weight,
      purity: product.purity,
      mint: product.mint,
      quantity: 1
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      return newWishlist;
    });
  };

  const getMetalColor = (metal: string) => {
    switch (metal) {
      case 'gold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'silver':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'platinum':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'palladium':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Discover Our Products
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our premium collection of precious metals
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-0">
                  <div className="aspect-square bg-muted rounded-t-lg" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-6 bg-muted rounded w-1/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            Discover Our Products
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our premium collection of precious metals, carefully selected for quality and value
          </p>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Products Available</h3>
              <p>Check back soon for our latest precious metals collection.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {products.map((product, index) => (
              <Card 
                key={product.id} 
                className="group overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in hover-scale cursor-pointer"
                style={{animationDelay: `${index * 100}ms`}}
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <CardContent className="p-0">
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img 
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 bg-background/80 hover:bg-background"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                      >
                        <Heart 
                          className={`h-4 w-4 ${
                            wishlist.has(product.id) 
                              ? 'fill-red-500 text-red-500' 
                              : 'text-muted-foreground'
                          }`} 
                        />
                      </Button>
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getMetalColor(product.metal)}`}
                      >
                        {product.metal.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-sm leading-tight mb-1 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {product.weight} • {product.purity}
                      </p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(product.rating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({product.reviews})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-bold text-gold">
                          ${product.price.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {product.mint}
                        </div>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      className="w-full"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* View All Products Button */}
        <div className="text-center animate-fade-in [animation-delay:800ms]">
          <Button 
            size="lg" 
            className="bg-gold hover:bg-gold/90 text-white shadow-lg shadow-gold/20 hover:shadow-xl hover:shadow-gold/30 transition-all duration-300"
            onClick={() => navigate("/products")}
          >
            View All Products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DiscoverProducts;
