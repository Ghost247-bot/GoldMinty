import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper function to parse CSV data
function parseCSV(csvText: string): any[] {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const products = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle CSV parsing with quoted fields containing commas
    const values = [];
    let currentValue = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim());

    if (values.length >= 3) {
      const imageUrl = values[0];
      const productUrl = values[1];
      const name = values[2];
      const priceStr = values[4];

      // Extract price from string like "€ 2,134.34"
      const priceMatch = priceStr.match(/[\d,]+\.?\d*/);
      if (priceMatch) {
        const price = parseFloat(priceMatch[0].replace(/,/g, ''));
        
        products.push({
          name: name.replace(/"/g, ''),
          description: `Premium gold investment product - ${name.replace(/"/g, '')}`,
          image: imageUrl,
          productUrl: productUrl,
          price: Math.round(price * 100), // Convert to cents
          currency: 'usd' // Convert EUR to USD for consistency
        });
      }
    }
  }

  return products;
}

// Helper function to generate product ID from name
function generateProductId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 40);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting bulk product upload to Stripe...");

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Read CSV data from the request body
    const { csvData } = await req.json();
    
    if (!csvData) {
      throw new Error("No CSV data provided");
    }

    console.log("Parsing CSV data...");
    const products = parseCSV(csvData);
    console.log(`Found ${products.length} products to upload`);

    const results: {
      success: Array<{
        name: string;
        productId: string;
        priceId: string;
        amount: number;
      }>;
      errors: Array<{
        name: string;
        error: string;
      }>;
      skipped: Array<{
        name: string;
        reason: string;
      }>;
    } = {
      success: [],
      errors: [],
      skipped: []
    };

    // Process products in batches to avoid rate limits
    const batchSize = 5;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      console.log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(products.length/batchSize)}`);
      
      const batchPromises = batch.map(async (product) => {
        try {
          const productId = generateProductId(product.name);
          
          // Check if product already exists
          try {
            const existingProducts = await stripe.products.search({
              query: `name:"${product.name.substring(0, 50)}"`,
              limit: 1
            });
            
            if (existingProducts.data.length > 0) {
              console.log(`Product already exists: ${product.name}`);
              results.skipped.push({
                name: product.name,
                reason: "Product already exists"
              });
              return;
            }
          } catch (searchError) {
            console.log(`Search failed for ${product.name}, proceeding with creation`);
          }

          // Create Stripe product
          const stripeProduct = await stripe.products.create({
            name: product.name,
            description: product.description,
            images: product.image ? [product.image] : [],
            metadata: {
              source: "gold-products-csv",
              product_url: product.productUrl,
              imported_at: new Date().toISOString()
            }
          });

          // Create price for the product
          const stripePrice = await stripe.prices.create({
            product: stripeProduct.id,
            unit_amount: product.price,
            currency: product.currency,
            metadata: {
              source: "gold-products-csv"
            }
          });

          console.log(`Created product: ${product.name} (${stripeProduct.id})`);
          results.success.push({
            name: product.name,
            productId: stripeProduct.id,
            priceId: stripePrice.id,
            amount: product.price
          });

        } catch (error: any) {
          console.error(`Failed to create product ${product.name}:`, error);
          results.errors.push({
            name: product.name,
            error: error?.message || 'Unknown error'
          });
        }
      });

      await Promise.all(batchPromises);
      
      // Add delay between batches to respect rate limits
      if (i + batchSize < products.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log("Bulk upload completed:", {
      success: results.success.length,
      errors: results.errors.length,
      skipped: results.skipped.length
    });

    return new Response(JSON.stringify({
      message: "Bulk product upload completed",
      summary: {
        total: products.length,
        success: results.success.length,
        errors: results.errors.length,
        skipped: results.skipped.length
      },
      results
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    console.error("Error in bulk-upload-products function:", error);
    return new Response(JSON.stringify({ 
      error: error?.message || 'Unknown error occurred',
      details: "Check function logs for more information"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});