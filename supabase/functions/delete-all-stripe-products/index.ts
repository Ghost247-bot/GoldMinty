import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
      apiVersion: '2023-10-16',
    });

    console.log('Starting to delete all Stripe products...');

    // Fetch all products
    const products = await stripe.products.list({ limit: 100 });
    
    const deletionResults = {
      total: products.data.length,
      deleted: 0,
      failed: 0,
      errors: [] as string[]
    };

    console.log(`Found ${products.data.length} products to delete`);

    // Delete each product
    for (const product of products.data) {
      try {
        await stripe.products.del(product.id);
        deletionResults.deleted++;
        console.log(`Deleted product: ${product.id} - ${product.name}`);
      } catch (error: any) {
        deletionResults.failed++;
        const errorMsg = `Failed to delete ${product.id}: ${error.message}`;
        deletionResults.errors.push(errorMsg);
        console.error(errorMsg);
      }
    }

    console.log(`Deletion complete. Deleted: ${deletionResults.deleted}, Failed: ${deletionResults.failed}`);

    return new Response(
      JSON.stringify(deletionResults),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error: any) {
    console.error('Error in delete-all-stripe-products function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
