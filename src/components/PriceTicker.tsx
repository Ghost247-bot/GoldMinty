import { TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface PriceData {
  metal: string;
  price: string;
  change: string;
  isPositive: boolean;
}

const PriceTicker = () => {
  const priceData: PriceData[] = [
    { metal: "Gold", price: "$3,774.30", change: "+$0.00", isPositive: true },
    { metal: "Silver", price: "$46.30", change: "+$0.00", isPositive: true },
    { metal: "Platinum", price: "$1,599.25", change: "+$0.00", isPositive: true },
    { metal: "Palladium", price: "$1,300.75", change: "+$0.00", isPositive: true },
  ];

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