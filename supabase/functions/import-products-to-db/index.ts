import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper function to parse CSV data
function parseCSV(csvText: string, metalType: string = 'gold'): any[] {
  const lines = csvText.split('\n');
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
      const priceMatch = priceStr?.match(/[\d,]+\.?\d*/);
      if (priceMatch && name) {
        const price = parseFloat(priceMatch[0].replace(/,/g, ''));
        
        // Extract weight and brand information from name
        const weightMatch = name.match(/(\d+(?:\.\d+)?)\s*(gram|g|ounce|oz|kg|kilogram)/i);
        const weight = weightMatch ? `${weightMatch[1]} ${weightMatch[2]}` : null;
        
        const brandMatch = name.match(/(PAMP Suisse|Valcambi|Credit Suisse|Perth Mint|Canadian Maple|American Eagle|Royal Canadian Mint|Heraeus|Argor|Random Mint)/i);
        const brand = brandMatch ? brandMatch[1] : 'PAMP Suisse'; // Default brand
        
        const purityMatch = name.match(/(999\.?9|99\.99|24k|22k)/i);
        const purity = purityMatch ? purityMatch[1] : '999.9';
        
        const categoryMatch = name.match(/(bar|coin|round)/i);
        const category = categoryMatch ? categoryMatch[1].toLowerCase() : 'bar';

        products.push({
          name: name.replace(/"/g, ''),
          description: `Premium ${metalType} investment product - ${name.replace(/"/g, '')}`,
          image_url: imageUrl,
          product_url: productUrl,
          price_usd: price,
          weight: weight,
          metal_type: metalType,
          brand: brand,
          purity: purity,
          category: category,
          metadata: {
            original_price_currency: 'EUR',
            source: `${metalType}-products-csv`,
            imported_at: new Date().toISOString()
          }
        });
      }
    }
  }

  return products;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting bulk product import to Supabase...");

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Read CSV data and metal type from the request body
    const { csvData, metalType = 'gold' } = await req.json();
    
    if (!csvData) {
      throw new Error("No CSV data provided");
    }

    console.log(`Parsing CSV data for ${metalType} products...`);
    const products = parseCSV(csvData, metalType);
    console.log(`Found ${products.length} products to import`);

    const results: {
      success: Array<{
        name: string;
        id: string;
        price: number;
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

    // Check for existing products to avoid duplicates
    const { data: existingProducts, error: fetchError } = await supabaseClient
      .from('products')
      .select('name');

    if (fetchError) {
      console.error("Error fetching existing products:", fetchError);
    }

    const existingNames = new Set((existingProducts || []).map(p => p.name));

    // Process products in batches
    const batchSize = 10;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      console.log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(products.length/batchSize)}`);
      
      const batchPromises = batch.map(async (product) => {
        try {
          // Check if product already exists
          if (existingNames.has(product.name)) {
            console.log(`Product already exists: ${product.name}`);
            results.skipped.push({
              name: product.name,
              reason: "Product already exists in database"
            });
            return;
          }

          // Insert product into database
          const { data, error } = await supabaseClient
            .from('products')
            .insert([product])
            .select('id, name, price_usd')
            .single();

          if (error) {
            throw error;
          }

          console.log(`Created product: ${product.name} (${data.id})`);
          results.success.push({
            name: data.name,
            id: data.id,
            price: data.price_usd
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
      
      // Add delay between batches
      if (i + batchSize < products.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log("Bulk import completed:", {
      success: results.success.length,
      errors: results.errors.length,
      skipped: results.skipped.length
    });

    return new Response(JSON.stringify({
      message: "Bulk product import completed",
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
    console.error("Error in import-products-to-db function:", error);
    return new Response(JSON.stringify({ 
      error: error?.message || 'Unknown error occurred',
      details: "Check function logs for more information"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});