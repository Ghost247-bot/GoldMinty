import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Product mapping for cart items to Stripe prices
const PRODUCT_MAPPING: Record<string, string> = {
  "1oz-gold-bar": "price_1SCfulF7R4NOS6oQwhP0lsPQ", // 1 oz Gold Bar - PAMP Suisse
  "20g-gold-bar": "price_1SCfuxF7R4NOS6oQuKVAkFjY", // 20g Gold Bar - PAMP Suisse
  "10g-gold-bar": "price_1SCfviF7R4NOS6oQVJWAi6Qd", // 10g Gold Bar - PAMP Suisse
};

// Default price for unmapped products (using 10g gold bar as fallback)
const DEFAULT_PRICE_ID = "price_1SCfviF7R4NOS6oQVJWAi6Qd";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  weight: string;
  image: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Create Supabase client using the anon key for user authentication
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const { items } = await req.json();
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("No items provided for checkout");
    }

    // Check if user is authenticated (optional for guest checkout)
    let user = null;
    let customerId = undefined;
    let customerEmail = undefined;

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

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // If user is authenticated, check for existing customer
    if (user?.email) {
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      } else {
        customerEmail = user.email;
      }
    }

    // Convert cart items to Stripe line items
    const lineItems = items.map((item: CartItem) => {
      // Try to map product ID to Stripe price, fallback to default
      const priceId = PRODUCT_MAPPING[item.id] || DEFAULT_PRICE_ID;
      
      return {
        price: priceId,
        quantity: item.quantity,
      };
    });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : customerEmail,
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/checkout`,
      payment_intent_data: {
        metadata: {
          cart_items: JSON.stringify(items.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })))
        }
      },
      metadata: {
        user_id: user?.id || "guest",
        total_items: items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0).toString()
      }
    });

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in create-payment function:", error);
    return new Response(JSON.stringify({ error: error?.message || 'Unknown error occurred' }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});