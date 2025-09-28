import { TrendingUp } from "lucide-react";

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
    <div className="bg-gradient-to-r from-primary via-navy-light to-primary text-primary-foreground py-4 px-4 overflow-hidden relative">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
      </div>
      <div className="container mx-auto relative z-10">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm">
              <TrendingUp className="w-4 h-4 text-success animate-pulse" />
              <span className="font-medium">Live Market Data</span>
            </div>
          </div>
          <div className="flex items-center gap-8">
            {priceData.map((data, index) => (
              <div 
                key={data.metal} 
                className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300 animate-fade-in hover-scale"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="font-medium text-white/80">{data.metal}</span>
                <span className="font-bold text-gold">{data.price}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${data.isPositive ? 'text-success bg-success/20' : 'text-destructive bg-destructive/20'}`}>
                  {data.change}
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