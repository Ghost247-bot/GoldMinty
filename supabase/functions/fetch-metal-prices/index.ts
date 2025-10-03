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
      console.error('TWELVE_DATA_API_KEY not configured');
      throw new Error('API key not configured');
    }

    // Fetch prices for all metals
    const symbols = ['XAU/USD', 'XAG/USD', 'XPT/USD', 'XPD/USD'];
    const metalNames = ['gold', 'silver', 'platinum', 'palladium'];
    
    const prices = await Promise.all(
      symbols.map(async (symbol, index) => {
        try {
          const url = `https://api.twelvedata.com/price?symbol=${symbol}&apikey=${apiKey}`;
          console.log(`Fetching ${metalNames[index]} price from: ${symbol}`);
          
          const response = await fetch(url);
          const data = await response.json();
          
          console.log(`${metalNames[index]} API response:`, data);
          
          // Check for API errors
          if (data.code && data.code !== 200) {
            console.error(`API error for ${symbol}:`, data.message);
            return { symbol, price: null, error: data.message };
          }
          
          // Check if we got valid data
          if (data.price && !isNaN(parseFloat(data.price))) {
            const price = parseFloat(data.price);
            console.log(`✓ ${metalNames[index]}: $${price}`);
            return { symbol, price, error: null };
          }
          
          console.warn(`Invalid price data for ${symbol}`);
          return { symbol, price: null, error: 'Invalid price data' };
        } catch (error) {
          console.error(`Error fetching ${symbol}:`, error);
          return { symbol, price: null, error: error.message };
        }
      })
    );

    // Transform data for the frontend
    const priceData = {
      gold: {
        price: prices[0].price || 3800,
        change: 0,
        isLive: prices[0].price !== null,
      },
      silver: {
        price: prices[1].price || 46,
        change: 0,
        isLive: prices[1].price !== null,
      },
      platinum: {
        price: prices[2].price || 1600,
        change: 0,
        isLive: prices[2].price !== null,
      },
      palladium: {
        price: prices[3].price || 1300,
        change: 0,
        isLive: prices[3].price !== null,
      },
    };

    // Log summary
    const liveCount = Object.values(priceData).filter(p => p.isLive).length;
    console.log(`✓ Successfully fetched ${liveCount}/4 live prices`);
    console.log('Final price data:', priceData);

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
