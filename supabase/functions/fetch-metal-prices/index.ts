import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('TWELVE_DATA_API_KEY');
    
    if (!apiKey) {
      throw new Error('TWELVE_DATA_API_KEY not configured');
    }

    // Fetch prices for all metals
    const symbols = ['XAU/USD', 'XAG/USD', 'XPT/USD', 'XPD/USD'];
    const prices = await Promise.all(
      symbols.map(async (symbol) => {
        const response = await fetch(
          `https://api.twelvedata.com/price?symbol=${symbol}&apikey=${apiKey}`
        );
        const data = await response.json();
        return { symbol, ...data };
      })
    );

    // Transform data for the frontend
    const priceData = {
      gold: {
        price: parseFloat(prices[0].price),
        change: 0, // Twelve Data free tier doesn't provide change data
      },
      silver: {
        price: parseFloat(prices[1].price),
        change: 0,
      },
      platinum: {
        price: parseFloat(prices[2].price),
        change: 0,
      },
      palladium: {
        price: parseFloat(prices[3].price),
        change: 0,
      },
    };

    console.log('Fetched metal prices:', priceData);

    return new Response(JSON.stringify(priceData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching metal prices:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
