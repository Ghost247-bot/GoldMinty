import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, Shield, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart, CartItem } from "@/contexts/CartContext";

const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state, updateQuantity, removeItem } = useCart();
  const [promoCode, setPromoCode] = useState("");

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    updateQuantity(id, newQuantity);
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart.",
    });
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "welcome10") {
      toast({
        title: "Promo code applied!",
        description: "You saved 10% on your order.",
      });
    } else {
      toast({
        title: "Invalid promo code",
        description: "Please check your promo code and try again.",
        variant: "destructive"
      });
    }
  };

  const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 25;
  const insurance = subtotal * 0.005; // 0.5%
  const tax = subtotal * 0.0875; // 8.75%
  const total = subtotal + shipping + insurance + tax;

  const proceedToCheckout = () => {
    navigate("/checkout");
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
          
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Start building your precious metals portfolio today
            </p>
            <Button 
              variant="gold" 
              size="lg"
              onClick={() => navigate("/products")}
            >
              Browse Products
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Continue Shopping
        </Button>

        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                 <div className="flex flex-col sm:flex-row gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full sm:w-20 h-32 sm:h-20 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div>
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline">{item.metal.toUpperCase()}</Badge>
                            <Badge variant="outline">{item.weight}</Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 self-start"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div className="flex items-center gap-3 justify-center sm:justify-start">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <div className="text-center sm:text-right">
                          <p className="text-lg font-bold text-gold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-600" : ""}>
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Insurance</span>
                  <span>${insurance.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-gold">${total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Promo Code */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Promo Code</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button variant="outline" onClick={applyPromoCode}>
                      Apply
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Secure Swiss Storage</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <span className="text-sm">Insured Shipping</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              variant="gold" 
              size="lg" 
              className="w-full"
              onClick={proceedToCheckout}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;