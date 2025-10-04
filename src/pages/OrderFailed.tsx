import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { XCircle, ArrowLeft, Home, RefreshCw, Phone } from 'lucide-react';
import Layout from '@/components/Layout';

const OrderFailed = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get error details from location state or URL params
  const errorMessage = location.state?.error || new URLSearchParams(location.search).get('error') || 'Payment processing failed';
  const orderId = location.state?.orderId || new URLSearchParams(location.search).get('orderId');

  const handleRetryPayment = () => {
    // Navigate back to checkout with the same cart items
    navigate('/checkout');
  };

  const handleContactSupport = () => {
    // Navigate to contact page or open support chat
    navigate('/contact');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-red-400 bg-clip-text text-transparent mb-2">
                Order Failed
              </h1>
              <p className="text-muted-foreground">
                We encountered an issue processing your payment.
              </p>
            </div>
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            {/* Error Details Card */}
            <Card className="backdrop-blur-sm bg-card/95 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  Payment Error
                </CardTitle>
                {orderId && (
                  <p className="text-sm text-muted-foreground">
                    Reference ID: {orderId}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <Alert className="border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {errorMessage}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* What Happened Card */}
            <Card className="backdrop-blur-sm bg-card/95 border-border/50">
              <CardHeader>
                <CardTitle>What Happened?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-red-600">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Payment Processing Error</h4>
                      <p className="text-sm text-muted-foreground">
                        Your payment could not be processed due to a technical issue or insufficient funds.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-red-600">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium">No Charges Made</h4>
                      <p className="text-sm text-muted-foreground">
                        Your card was not charged. Your items are still in your cart.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-red-600">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Try Again</h4>
                      <p className="text-sm text-muted-foreground">
                        You can retry your payment or contact support for assistance.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Common Solutions Card */}
            <Card className="backdrop-blur-sm bg-card/95 border-border/50">
              <CardHeader>
                <CardTitle>Common Solutions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-background/50 rounded-lg">
                    <h4 className="font-medium mb-1">Check Your Payment Method</h4>
                    <p className="text-sm text-muted-foreground">
                      Ensure your card has sufficient funds and is not expired.
                    </p>
                  </div>
                  <div className="p-3 bg-background/50 rounded-lg">
                    <h4 className="font-medium mb-1">Try a Different Card</h4>
                    <p className="text-sm text-muted-foreground">
                      Sometimes using a different payment method resolves the issue.
                    </p>
                  </div>
                  <div className="p-3 bg-background/50 rounded-lg">
                    <h4 className="font-medium mb-1">Check Your Internet Connection</h4>
                    <p className="text-sm text-muted-foreground">
                      A stable internet connection is required for secure payments.
                    </p>
                  </div>
                  <div className="p-3 bg-background/50 rounded-lg">
                    <h4 className="font-medium mb-1">Contact Your Bank</h4>
                    <p className="text-sm text-muted-foreground">
                      Your bank may have blocked the transaction for security reasons.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleRetryPayment} className="flex-1">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button variant="outline" onClick={handleContactSupport} className="flex-1">
                  <Phone className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" onClick={() => navigate('/cart')} className="flex-1">
                  Review Cart
                </Button>
                <Button variant="outline" onClick={() => navigate('/products')} className="flex-1">
                  Continue Shopping
                </Button>
                <Button variant="outline" onClick={() => navigate('/')} className="flex-1">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
              </div>
            </div>

            {/* Support Information */}
            <Card className="backdrop-blur-sm bg-card/95 border-border/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Need Help?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our support team is here to help you complete your purchase.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="outline" onClick={handleContactSupport}>
                      <Phone className="mr-2 h-4 w-4" />
                      Contact Support
                    </Button>
                    <Button variant="outline" onClick={() => window.open('mailto:support@goldmint.com')}>
                      Email Support
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderFailed;
