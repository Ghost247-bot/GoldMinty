import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
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
    const { items } = await req.json();
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("No items provided for checkout");
    }

    console.log("Processing checkout for items:", items);

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Check if user is authenticated
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

    // Create dynamic line items for checkout
    const lineItems = [];
    
    for (const item of items) {
      try {
        // Create a product for this cart item
        const product = await stripe.products.create({
          name: item.name,
          description: item.description || item.name,
          images: item.image ? [item.image] : [],
          metadata: {
            weight: item.weight || '',
            metal: item.metal || 'gold',
            mint: item.mint || '',
            purity: item.purity || ''
          }
        });

        console.log(`Created Stripe product: ${product.id} for ${item.name}`);

        // Create a price for this product
        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: Math.round(item.price * 100), // Convert to cents
          currency: 'usd',
        });

        console.log(`Created Stripe price: ${price.id} for ${item.name} at $${item.price}`);

        lineItems.push({
          price: price.id,
          quantity: item.quantity,
        });
      } catch (error) {
        console.error(`Error creating Stripe product/price for ${item.name}:`, error);
        throw new Error(`Failed to create product for ${item.name}`);
      }
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : customerEmail,
      line_items: lineItems,
      mode: "payment",
      payment_method_types: ["card", "us_bank_account"],
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

    console.log(`Created checkout session: ${session.id}`);

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