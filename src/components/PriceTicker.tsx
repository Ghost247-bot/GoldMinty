import { TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface PriceData {
  metal: string;
  price: string;
  change: string;
  isPositive: boolean;
}

const PriceTicker = () => {
  const [priceData, setPriceData] = useState<PriceData[]>([
    { metal: "Gold", price: "$3,774.30", change: "+$0.00", isPositive: true },
    { metal: "Silver", price: "$46.30", change: "+$0.00", isPositive: true },
    { metal: "Platinum", price: "$1,599.25", change: "+$0.00", isPositive: true },
    { metal: "Palladium", price: "$1,300.75", change: "+$0.00", isPositive: true },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPrices();
    // Refresh prices every 5 minutes
    const interval = setInterval(fetchPrices, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('fetch-metal-prices');
      
      if (error) throw error;
      
      if (data) {
        setPriceData([
          {
            metal: "Gold",
            price: `$${data.gold.price.toFixed(2)}`,
            change: `${data.gold.change >= 0 ? '+' : ''}$${data.gold.change.toFixed(2)}`,
            isPositive: data.gold.change >= 0,
          },
          {
            metal: "Silver",
            price: `$${data.silver.price.toFixed(2)}`,
            change: `${data.silver.change >= 0 ? '+' : ''}$${data.silver.change.toFixed(2)}`,
            isPositive: data.silver.change >= 0,
          },
          {
            metal: "Platinum",
            price: `$${data.platinum.price.toFixed(2)}`,
            change: `${data.platinum.change >= 0 ? '+' : ''}$${data.platinum.change.toFixed(2)}`,
            isPositive: data.platinum.change >= 0,
          },
          {
            metal: "Palladium",
            price: `$${data.palladium.price.toFixed(2)}`,
            change: `${data.palladium.change >= 0 ? '+' : ''}$${data.palladium.change.toFixed(2)}`,
            isPositive: data.palladium.change >= 0,
          },
        ]);
      }
    } catch (error) {
      console.error('Error fetching prices:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-primary text-primary-foreground py-3 px-4 border-b">
      <div className="container mx-auto">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="font-medium">Live Market Prices</span>
          </div>
          <div className="flex items-center gap-8 animate-fade-in">
            {priceData.map((data) => (
              <div key={data.metal} className="flex items-center gap-2 hover-scale transition-all duration-300"
                style={{
                  animationDelay: `${priceData.indexOf(data) * 100}ms`
                }}
              >
                <span className="font-medium">{data.metal}</span>
                <span className="font-bold text-gold">{data.price}</span>
                <span className={`text-xs ${data.isPositive ? 'text-success' : 'text-destructive'}`}>
                  ({data.change})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceTicker;