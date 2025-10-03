import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart3, LineChart, Activity, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/lib/utils";
import { useMetalPrices } from "@/hooks/useMetalPrices";
import { Skeleton } from "@/components/ui/skeleton";

const Charts = () => {
  const navigate = useNavigate();
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D");
  const { prices, loading, refetch } = useMetalPrices();

  const metalData = prices ? [
    {
      metal: "Gold",
      symbol: "XAU",
      price: prices.gold.price,
      change: prices.gold.change,
      changePercent: prices.gold.change / prices.gold.price * 100,
      high: prices.gold.price * 1.003,
      low: prices.gold.price * 0.997,
      color: "text-gold"
    },
    {
      metal: "Silver", 
      symbol: "XAG",
      price: prices.silver.price,
      change: prices.silver.change,
      changePercent: prices.silver.change / prices.silver.price * 100,
      high: prices.silver.price * 1.003,
      low: prices.silver.price * 0.997,
      color: "text-gray-400"
    },
    {
      metal: "Platinum",
      symbol: "XPT", 
      price: prices.platinum.price,
      change: prices.platinum.change,
      changePercent: prices.platinum.change / prices.platinum.price * 100,
      high: prices.platinum.price * 1.003,
      low: prices.platinum.price * 0.997,
      color: "text-slate-300"
    },
    {
      metal: "Palladium",
      symbol: "XPD",
      price: prices.palladium.price,
      change: prices.palladium.change,
      changePercent: prices.palladium.change / prices.palladium.price * 100,
      high: prices.palladium.price * 1.003,
      low: prices.palladium.price * 0.997,
      color: "text-blue-400"
    }
  ] : [];

  const timeframes = ["1H", "1D", "1W", "1M", "3M", "1Y", "5Y"];

  return (
    <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">Live Market Charts</h1>
            <p className="text-muted-foreground">
              Real-time precious metals pricing and market analysis
            </p>
          </div>
          <Button variant="outline" onClick={refetch} size="sm" disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Market Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32 mb-2" />
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-4 w-20" />
                </CardContent>
              </Card>
            ))
          ) : metalData.map((metal) => (
            <Card 
              key={metal.symbol} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => {
                // In a real app, this would show detailed chart for this metal
                navigate(`/charts?metal=${metal.symbol.toLowerCase()}`);
              }}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{metal.metal}</CardTitle>
                  <Badge variant="outline">{metal.symbol}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className={`text-2xl font-bold ${metal.color}`}>
                    ${formatCurrency(metal.price)}
                  </div>
                  <div className="flex items-center gap-2">
                    {metal.change >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={metal.change >= 0 ? "text-green-600" : "text-red-600"}>
                      {metal.change >= 0 ? "+" : ""}{formatCurrency(metal.change)} 
                      ({metal.changePercent >= 0 ? "+" : ""}{formatCurrency(metal.changePercent)}%)
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div>H: ${formatCurrency(metal.high)}</div>
                    <div>L: ${formatCurrency(metal.low)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart Section */}
        <Tabs defaultValue="gold" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            {metalData.map((metal) => (
              <TabsTrigger key={metal.symbol} value={metal.metal.toLowerCase()}>
                {metal.metal}
              </TabsTrigger>
            ))}
          </TabsList>

          {metalData.map((metal) => (
            <TabsContent key={metal.symbol} value={metal.metal.toLowerCase()}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <LineChart className="w-5 h-5" />
                        {metal.metal} Price Chart ({metal.symbol})
                      </CardTitle>
                      <CardDescription>
                        Interactive price chart with technical indicators
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-1 md:gap-2">
                      {timeframes.map((timeframe) => (
                        <Button
                          key={timeframe}
                          variant={selectedTimeframe === timeframe ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTimeframe(timeframe)}
                          className="text-xs md:text-sm"
                        >
                          {timeframe}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-96 bg-muted rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
                    onClick={() => {
                      // In a real app, this would open a full-screen chart
                      navigate(`/charts?metal=${metal.metal.toLowerCase()}&timeframe=${selectedTimeframe}`);
                    }}
                  >
                    <div className="text-center">
                      <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-medium text-muted-foreground">
                        {metal.metal} Chart - {selectedTimeframe}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Interactive chart integration coming soon
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Market Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Market Highlights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-gold pl-4">
                  <h4 className="font-semibold">Gold Rally Continues</h4>
                  <p className="text-sm text-muted-foreground">
                    Gold prices surge as investors seek safe-haven assets amid market uncertainty.
                  </p>
                </div>
                <div className="border-l-4 border-gray-400 pl-4">
                  <h4 className="font-semibold">Silver Under Pressure</h4>
                  <p className="text-sm text-muted-foreground">
                    Industrial demand concerns weigh on silver prices despite strong fundamentals.
                  </p>
                </div>
                <div className="border-l-4 border-blue-400 pl-4">
                  <h4 className="font-semibold">Platinum Outlook Positive</h4>
                  <p className="text-sm text-muted-foreground">
                    Supply constraints and automotive demand support platinum prices.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Market News</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="pb-4 border-b">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Federal Reserve Policy Update</h4>
                    <span className="text-xs text-muted-foreground">2h ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Latest monetary policy decisions impact precious metals markets.
                  </p>
                </div>
                <div className="pb-4 border-b">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Mining Industry Report</h4>
                    <span className="text-xs text-muted-foreground">4h ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Global mining output affects supply dynamics for key metals.
                  </p>
                </div>
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Geopolitical Tensions</h4>
                    <span className="text-xs text-muted-foreground">6h ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    International developments drive safe-haven demand.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  );
};

export default Charts;