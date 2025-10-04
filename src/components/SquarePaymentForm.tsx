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
          applicationId={import.meta.env.VITE_SQUARE_APPLICATION_ID || 'sandbox-sq0idb-YourAppId'}
          cardTokenizeResponseReceived={handlePaymentSuccess}
          onError={handlePaymentError}
          locationId={import.meta.env.VITE_SQUARE_LOCATION_ID || 'YourLocationId'}
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
