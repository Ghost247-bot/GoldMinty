import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  ArrowLeft, 
  Shield, 
  Truck, 
  RotateCcw,
  Award,
  Plus,
  Minus
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { parseGoldProductsCSV } from "@/utils/csvParser";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // First try to get product from navigation state
    if (location.state?.product) {
      setProduct(location.state.product);
      setLoading(false);
      return;
    }

    // If no state, try to load from CSV if it's a CSV product
    if (id?.startsWith('csv-gold-')) {
      setLoading(true);
      parseGoldProductsCSV('/data/gold-products.csv')
        .then((products) => {
          const foundProduct = products.find(p => p.id === id);
          if (foundProduct) {
            setProduct(foundProduct);
          } else {
            // Fallback to mock data
            setProduct(mockProduct);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error loading product:', error);
          setProduct(mockProduct);
          setLoading(false);
        });
    } else {
      // Use mock data for non-CSV products
      setProduct(mockProduct);
      setLoading(false);
    }
  }, [id, location.state]);

  // Mock product data - fallback for non-CSV products
  const mockProduct = {
    id: id,
    name: "1 oz American Gold Eagle",
    price: 2089.50,
    originalPrice: 2150.00,
    images: [
      "/api/placeholder/500/500",
      "/api/placeholder/500/500",
      "/api/placeholder/500/500",
      "/api/placeholder/500/500"
    ],
    metal: "gold",
    weight: "1 oz",
    purity: "22 karat",
    mint: "US Mint",
    year: "2024",
    inStock: true,
    stockQuantity: 25,
    rating: 4.9,
    reviews: 1250,
    description: "The American Gold Eagle is one of the most popular and recognizable gold coins in the world. Produced by the United States Mint since 1986, these coins contain one troy ounce of 22-karat gold and are backed by the U.S. government for weight, content, and purity.",
    specifications: {
      "Metal Content": "1 oz Gold",
      "Purity": "91.67% (22 karat)",
      "Diameter": "32.70 mm",
      "Thickness": "2.87 mm",
      "Face Value": "$50 USD",
      "Mint": "United States Mint",
      "Designer": "Augustus Saint-Gaudens / Miley Busiek",
      "IRA Eligible": "Yes"
    },
    features: [
      "Government-backed for weight and purity",
      "Highly liquid and recognized worldwide",
      "Beautiful artistic design",
      "IRA approved for precious metals investments"
    ]
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Loading product...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Product not found</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate('/products')}
            >
              Back to Products
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Ensure product has required properties with fallbacks
  const displayProduct = {
    ...product,
    images: product.images || [product.image || "/api/placeholder/500/500"],
    stockQuantity: product.stockQuantity || 10,
    year: product.year || "2024",
    specifications: product.specifications || {
      "Metal Content": `${product.weight} ${product.metal}`,
      "Purity": product.purity,
      "Mint": product.mint,
      "Weight": product.weight,
      "Metal": product.metal.charAt(0).toUpperCase() + product.metal.slice(1)
    },
    features: product.features || [
      "Certified precious metal",
      "Investment grade quality", 
      "Secure packaging and delivery",
      "Buyback guarantee available"
    ]
  };

  const addToCart = () => {
    toast({
      title: "Added to cart",
      description: `${quantity} x ${displayProduct.name} added to your cart.`,
    });
  };

  const addToWishlist = () => {
    toast({
      title: "Added to wishlist",
      description: "Product added to your wishlist.",
    });
  };

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= displayProduct.stockQuantity) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={displayProduct.images[selectedImage]}
                alt={displayProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {displayProduct.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-gold' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${displayProduct.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{displayProduct.metal.toUpperCase()}</Badge>
                <Badge variant="outline">{displayProduct.year}</Badge>
                {displayProduct.originalPrice && <Badge className="bg-red-500">Sale</Badge>}
              </div>
              <h1 className="text-3xl font-bold text-primary mb-4">{displayProduct.name}</h1>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(displayProduct.rating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {displayProduct.rating} ({displayProduct.reviews} reviews)
                </span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-gold">
                  ${displayProduct.price.toFixed(2)}
                </span>
                {displayProduct.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${displayProduct.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-muted-foreground mb-6">{displayProduct.description}</p>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="font-medium">Quantity:</label>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-16 text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateQuantity(quantity + 1)}
                    disabled={quantity >= displayProduct.stockQuantity}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  ({displayProduct.stockQuantity} available)
                </span>
              </div>

              <div className="flex gap-3">
                <Button 
                  size="lg" 
                  variant="gold" 
                  className="flex-1"
                  onClick={addToCart}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart - ${(displayProduct.price * quantity).toFixed(2)}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={addToWishlist}
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <p className="text-sm font-medium">Secure Storage</p>
              </div>
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-medium">Free Shipping</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <p className="text-sm font-medium">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(displayProduct.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b">
                        <span className="font-medium">{key}:</span>
                        <span className="text-muted-foreground">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="features" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    {displayProduct.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <Award className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Reviews feature coming soon...</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Current rating: {displayProduct.rating}/5 based on {displayProduct.reviews} reviews
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;