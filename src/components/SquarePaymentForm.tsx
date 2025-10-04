import React, { useState } from 'react';
import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard as CreditCardIcon, Shield, Lock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SquarePaymentFormProps {
  totalAmount: number;
  onPaymentSuccess: (paymentResult: any) => void;
  onPaymentError: (error: string) => void;
  isProcessing: boolean;
  customerInfo?: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

const SquarePaymentForm: React.FC<SquarePaymentFormProps> = ({
  totalAmount,
  onPaymentSuccess,
  onPaymentError,
  isProcessing,
  customerInfo
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if Square credentials are properly configured
  const squareAppId = import.meta.env.VITE_SQUARE_APPLICATION_ID;
  const squareLocationId = import.meta.env.VITE_SQUARE_LOCATION_ID;
  
  const isSquareConfigured = squareAppId && 
    squareLocationId && 
    squareAppId !== 'your_square_application_id' && 
    squareAppId !== 'sandbox-sq0idb-YourAppId' &&
    squareLocationId !== 'your_square_location_id' &&
    squareLocationId !== 'YourLocationId';

  const handlePaymentSuccess = async (token: any, verifiedBuyer: any) => {
    setIsLoading(true);
    
    try {
      console.log('Payment token received:', token);
      console.log('Verified buyer:', verifiedBuyer);
      
      // Call the success callback with the token
      onPaymentSuccess({
        token: token.token,
        verifiedBuyer,
        amount: totalAmount
      });
    } catch (error) {
      console.error('Payment processing error:', error);
      onPaymentError('Payment processing failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentError = (error: any) => {
    console.error('Square payment error:', error);
    onPaymentError('Payment failed. Please check your card information and try again.');
  };

  // Show configuration error if Square is not properly set up
  if (!isSquareConfigured) {
    return (
      <Card className="backdrop-blur-sm bg-card/95 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
              3
            </div>
            <CreditCardIcon className="h-5 w-5" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-6 bg-muted/50 rounded-lg border border-dashed border-muted-foreground/30">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Payment System Configuration Required</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Square payment integration is not configured. Please contact the administrator to set up payment processing.
            </p>
            <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded border">
              <p className="font-medium mb-1">Configuration needed:</p>
              <ul className="text-left space-y-1">
                <li>• VITE_SQUARE_APPLICATION_ID</li>
                <li>• VITE_SQUARE_LOCATION_ID</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-sm bg-card/95 border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
            3
          </div>
          <CreditCardIcon className="h-5 w-5" />
          Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground mb-2">
            Secure payment powered by Square
          </p>
          <div className="flex items-center justify-center space-x-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
            <Shield className="h-4 w-4 text-primary" />
            <Lock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">256-bit SSL Encryption</span>
          </div>
        </div>

        <PaymentForm
          applicationId={squareAppId}
          cardTokenizeResponseReceived={handlePaymentSuccess}
          onError={handlePaymentError}
          locationId={squareLocationId}
          createPaymentRequest={() => ({
            countryCode: 'US',
            currencyCode: 'USD',
            total: {
              amount: totalAmount.toString(),
              label: 'Total'
            },
            requestShippingContact: false,
            requestBillingContact: false
          })}
        >
          <div className="space-y-4">
            <CreditCard 
              buttonProps={{
                children: isLoading || isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : `Pay $${(totalAmount / 100).toFixed(2)}`,
                disabled: isLoading || isProcessing,
                className: "w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-lg py-6"
              }}
            />
            
            <div className="text-xs text-muted-foreground text-center">
              <p>Your payment information is secure and encrypted.</p>
              <p>We accept Visa, Mastercard, American Express, and Discover.</p>
            </div>
          </div>
        </PaymentForm>
      </CardContent>
    </Card>
  );
};

export default SquarePaymentForm;
