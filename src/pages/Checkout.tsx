import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { Shield, Truck, Lock, ArrowLeft } from 'lucide-react';
import Layout from '@/components/Layout';
import { formatCurrency } from '@/lib/utils';
import SquarePaymentForm from '@/components/SquarePaymentForm';

const checkoutSchema = z.object({
  // Billing Information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  
  // Billing Address
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'ZIP code must be at least 5 digits'),
  country: z.string().min(2, 'Country is required'),
  
  // Shipping
  sameAsShipping: z.boolean(),
  shippingAddress: z.string().optional(),
  shippingCity: z.string().optional(),
  shippingState: z.string().optional(),
  shippingZipCode: z.string().optional(),
  shippingCountry: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const navigate = useNavigate();
  const { state: cartState, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      sameAsShipping: true,
      country: 'United States',
      shippingCountry: 'United States',
    },
  });

  const sameAsShipping = form.watch('sameAsShipping');

  if (cartState.items.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
          <Card className="w-full max-w-md text-center">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Cart is Empty</h2>
              <p className="text-muted-foreground mb-6">
                Add some items to your cart before proceeding to checkout.
              </p>
              <Button onClick={() => navigate('/products')} className="w-full">
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const subtotal = cartState.totalAmount;
  const shipping = 29.99;
  const insurance = subtotal * 0.01; // 1% insurance
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + insurance + tax;

  const handlePaymentSuccess = async (paymentResult: any) => {
    setIsProcessing(true);
    
    try {
      const formData = form.getValues();
      
      // Process Square payment
      const { data: paymentData, error } = await supabase.functions.invoke('create-square-payment', {
        body: { 
          items: cartState.items,
          paymentToken: paymentResult.token,
          customerInfo: {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName
          }
        }
      });

      if (error) throw error;

      if (paymentData?.success) {
        // Clear cart and redirect to success page
        clearCart();
        navigate('/payment-success', { 
          state: { 
            paymentId: paymentData.paymentId,
            amount: paymentData.amount,
            status: paymentData.status
          }
        });
      } else {
        throw new Error(paymentData?.error || 'Payment processing failed');
      }
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Error",
      description: error,
      variant: "destructive",
    });
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
              onClick={() => navigate('/cart')}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cart
            </Button>
            
            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent mb-2">
                Secure Checkout
              </h1>
              <p className="text-muted-foreground">
                Complete your precious metals investment
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Left Column - Forms */}
            <div className="space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  {/* Step 1: Billing Information */}
                  <Card className="backdrop-blur-sm bg-card/95 border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                          1
                        </div>
                        Billing Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-background/50" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-background/50" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" className="bg-background/50" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input {...field} type="tel" className="bg-background/50" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Step 2: Billing Address */}
                  <Card className="backdrop-blur-sm bg-card/95 border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                          2
                        </div>
                        Billing Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-background/50" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-background/50" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-background/50" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ZIP Code</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-background/50" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                           <FormItem>
                             <FormLabel>Country</FormLabel>
                             <FormControl>
                               <Select onValueChange={field.onChange} value={field.value || "United States"}>
                                 <SelectTrigger className="bg-background/50">
                                   <SelectValue />
                                 </SelectTrigger>
                                 <SelectContent>
                                   <SelectItem value="United States">United States</SelectItem>
                                   <SelectItem value="Canada">Canada</SelectItem>
                                   <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                 </SelectContent>
                               </Select>
                             </FormControl>
                             <FormMessage />
                           </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="sameAsShipping"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Shipping address is the same as billing address
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Step 3: Payment Information */}
                  <SquarePaymentForm
                    totalAmount={Math.round(total * 100)} // Convert to cents
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                    isProcessing={isProcessing}
                    customerInfo={{
                      email: form.getValues('email') || '',
                      firstName: form.getValues('firstName') || '',
                      lastName: form.getValues('lastName') || ''
                    }}
                  />
                </form>
              </Form>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              <Card className="backdrop-blur-sm bg-card/95 border-border/50 sticky top-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-3">
                    {cartState.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 bg-background/50 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.metal} • {item.weight}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            ${(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Pricing Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1">
                        <Truck className="h-4 w-4" />
                        Shipping
                      </span>
                      <span>${formatCurrency(shipping)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1">
                        <Shield className="h-4 w-4" />
                        Insurance
                      </span>
                      <span>${formatCurrency(insurance)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${formatCurrency(tax)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${total.toLocaleString()}</span>
                    </div>
                  </div>


                  {/* Trust Badges */}
                  <div className="grid grid-cols-2 gap-2 pt-4">
                    <Badge variant="outline" className="justify-center py-2">
                      <Shield className="h-3 w-3 mr-1" />
                      Secure
                    </Badge>
                    <Badge variant="outline" className="justify-center py-2">
                      <Lock className="h-3 w-3 mr-1" />
                      Encrypted
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;