import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Client, Environment } from "https://esm.sh/square@41.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  weight?: string;
  image?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { items, paymentToken, customerInfo } = await req.json();
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("No items provided for checkout");
    }

    if (!paymentToken) {
      throw new Error("Payment token is required");
    }

    console.log("Processing Square payment for items:", items);

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Check if user is authenticated
    let user = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      try {
        const token = authHeader.replace("Bearer ", "");
        const { data } = await supabaseClient.auth.getUser(token);
        user = data.user;
      } catch (error) {
        console.log("User not authenticated, proceeding with guest checkout");
      }
    }

    // Initialize Square client
    const squareClient = new Client({
      accessToken: Deno.env.get("SQUARE_ACCESS_TOKEN") || "",
      environment: Deno.env.get("SQUARE_ENVIRONMENT") === "production" 
        ? Environment.Production 
        : Environment.Sandbox,
    });

    // Calculate total amount in cents
    const subtotal = items.reduce((sum: number, item: CartItem) => 
      sum + (item.price * item.quantity), 0
    );
    const shipping = 29.99;
    const insurance = subtotal * 0.01; // 1% insurance
    const tax = subtotal * 0.08; // 8% tax
    const totalAmount = Math.round((subtotal + shipping + insurance + tax) * 100); // Convert to cents

    console.log(`Processing payment for $${(totalAmount / 100).toFixed(2)}`);

    // Create payment request
    const paymentRequest = {
      sourceId: paymentToken,
      idempotencyKey: crypto.randomUUID(),
      amountMoney: {
        amount: totalAmount,
        currency: 'USD',
      },
      buyerEmailAddress: customerInfo?.email || user?.email,
      note: `Order for ${items.length} items`,
      metadata: {
        user_id: user?.id || "guest",
        total_items: items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0).toString(),
        cart_items: JSON.stringify(items.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })))
      }
    };

    // Process payment with Square
    const { result, ...httpResponse } = await squareClient.paymentsApi.createPayment(paymentRequest);

    if (result.payment) {
      console.log(`Payment successful: ${result.payment.id}`);
      
      // Store transaction in database
      const { error: insertError } = await supabaseClient
        .from('transactions')
        .insert({
          id: result.payment.id,
          user_id: user?.id || null,
          amount: totalAmount,
          currency: 'USD',
          status: result.payment.status,
          payment_method: 'square',
          customer_email: customerInfo?.email || user?.email,
          items: items,
          square_payment_id: result.payment.id,
          created_at: new Date().toISOString()
        });

      if (insertError) {
        console.error("Error storing transaction:", insertError);
      }

      return new Response(JSON.stringify({ 
        success: true,
        paymentId: result.payment.id,
        status: result.payment.status,
        amount: totalAmount,
        currency: 'USD'
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      throw new Error("Payment processing failed");
    }

  } catch (error: any) {
    console.error("Error in create-square-payment function:", error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error?.message || 'Unknown error occurred' 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
