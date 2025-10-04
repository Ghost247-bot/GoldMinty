import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useCart();
  
  // Get payment data from navigation state
  const paymentData = location.state as {
    paymentId?: string;
    amount?: number;
    status?: string;
  } | null;

  useEffect(() => {
    // Clear the cart after successful payment
    dispatch({ type: "CLEAR_CART" });
  }, [dispatch]);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Payment Successful!
              </h1>
              <p className="text-muted-foreground">
                Thank you for your purchase. Your order has been confirmed.
              </p>
            </div>

            {paymentData?.paymentId && (
              <div className="mb-6 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Payment ID:</p>
                <p className="font-mono text-xs break-all">{paymentData.paymentId}</p>
                {paymentData.amount && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Amount: ${(paymentData.amount / 100).toFixed(2)}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-3">
              <Button 
                onClick={() => navigate("/")} 
                className="w-full"
              >
                Continue Shopping
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/dashboard")} 
                className="w-full"
              >
                View Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}