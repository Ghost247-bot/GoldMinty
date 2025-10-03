import { TrendingUp, TrendingDown, Clock, Coins } from "lucide-react";
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
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

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
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="bg-card border-b shadow-sm">
      <div className="container mx-auto px-4 py-2">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          {/* Header Section */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-lg">
              <Coins className="w-4 h-4 text-gold" />
              <span className="text-sm font-semibold text-foreground">Live Prices</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>Updated {formatTime(lastUpdated)}</span>
            </div>
          </div>

          {/* Price Cards - Scrollable on mobile */}
          <div className="w-full lg:w-auto overflow-x-auto">
            <div className="flex items-center gap-3 min-w-max pb-1">
              {priceData.map((data, index) => (
                <div 
                  key={data.metal} 
                  className="flex items-center gap-2 px-3 py-1.5 bg-muted/30 rounded-lg hover:bg-muted/50 transition-all duration-300 hover-scale animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="text-sm font-medium text-foreground">{data.metal}</span>
                  <span className="text-sm font-bold text-gold">{data.price}</span>
                  <div className="flex items-center gap-1">
                    {data.isPositive ? (
                      <TrendingUp className="w-3 h-3 text-success" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-destructive" />
                    )}
                    <span className={`text-xs font-medium ${data.isPositive ? 'text-success' : 'text-destructive'}`}>
                      {data.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceTicker;