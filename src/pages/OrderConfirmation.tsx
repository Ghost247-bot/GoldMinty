import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Package, Truck, Download, ArrowLeft, Home } from 'lucide-react';
import Layout from '@/components/Layout';
import { formatCurrency } from '@/lib/utils';
import { Tables } from '@/integrations/supabase/types';

type Order = Tables<'orders'>;

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Get order data from location state or URL params
        const orderId = location.state?.orderId || new URLSearchParams(location.search).get('orderId');
        
        if (!orderId) {
          setError('No order ID provided');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (error) throw error;
        setOrder(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [location]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading order details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !order) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
          <Card className="w-full max-w-md text-center">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
              <p className="text-muted-foreground mb-6">
                {error || 'The order you are looking for could not be found.'}
              </p>
              <div className="space-y-2">
                <Button onClick={() => navigate('/')} className="w-full">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
                <Button variant="outline" onClick={() => navigate('/products')} className="w-full">
                  Continue Shopping
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const orderItems = Array.isArray(order.order_items) ? order.order_items : [];

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
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent mb-2">
                Order Confirmed!
              </h1>
              <p className="text-muted-foreground">
                Thank you for your purchase. Your order has been successfully placed.
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {/* Order Summary Card */}
            <Card className="backdrop-blur-sm bg-card/95 border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Summary
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                    <Badge className={getPaymentStatusColor(order.payment_status)}>
                      {order.payment_status}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Order #{order.order_number} • Placed on {new Date(order.created_at).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Items */}
                <div>
                  <h3 className="font-semibold mb-3">Items Ordered</h3>
                  <div className="space-y-3">
                    {orderItems.map((item: any, index: number) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-background/50 rounded-lg">
                        <img
                          src={item.image || '/placeholder.svg'}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium">{item.name}</h4>
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
                </div>

                <Separator />

                {/* Pricing Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${order.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <Truck className="h-4 w-4" />
                      Shipping
                    </span>
                    <span>${formatCurrency(order.shipping_cost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Insurance</span>
                    <span>${formatCurrency(order.insurance_cost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${formatCurrency(order.tax_amount)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${order.total_amount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="backdrop-blur-sm bg-card/95 border-border/50">
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">{order.customer_first_name} {order.customer_last_name}</p>
                    <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                    {order.customer_phone && (
                      <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                    )}
                    <div className="pt-2">
                      <p className="text-sm">{order.billing_address}</p>
                      <p className="text-sm">
                        {order.billing_city}, {order.billing_state} {order.billing_zip_code}
                      </p>
                      <p className="text-sm">{order.billing_country}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {order.shipping_address && (
                <Card className="backdrop-blur-sm bg-card/95 border-border/50">
                  <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-medium">{order.customer_first_name} {order.customer_last_name}</p>
                      <div className="pt-2">
                        <p className="text-sm">{order.shipping_address}</p>
                        <p className="text-sm">
                          {order.shipping_city}, {order.shipping_state} {order.shipping_zip_code}
                        </p>
                        <p className="text-sm">{order.shipping_country}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Next Steps */}
            <Card className="backdrop-blur-sm bg-card/95 border-border/50">
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Order Confirmation</h4>
                      <p className="text-sm text-muted-foreground">
                        You'll receive an email confirmation with your order details.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Processing</h4>
                      <p className="text-sm text-muted-foreground">
                        We'll process your order and prepare it for shipment.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Shipping</h4>
                      <p className="text-sm text-muted-foreground">
                        You'll receive tracking information once your order ships.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/products')} className="flex-1 sm:flex-none">
                Continue Shopping
              </Button>
              <Button variant="outline" onClick={() => navigate('/')} className="flex-1 sm:flex-none">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
              <Button variant="outline" className="flex-1 sm:flex-none">
                <Download className="mr-2 h-4 w-4" />
                Download Receipt
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
