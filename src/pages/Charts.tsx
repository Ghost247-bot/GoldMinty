import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart3, LineChart, Activity } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Charts = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D");

  const metalData = [
    {
      metal: "Gold",
      symbol: "XAU",
      price: 2089.50,
      change: 15.30,
      changePercent: 0.74,
      high: 2095.00,
      low: 2078.40,
      color: "text-gold"
    },
    {
      metal: "Silver", 
      symbol: "XAG",
      price: 48.75,
      change: -0.85,
      changePercent: -1.71,
      high: 49.80,
      low: 48.20,
      color: "text-gray-400"
    },
    {
      metal: "Platinum",
      symbol: "XPT", 
      price: 1650.00,
      change: 12.50,
      changePercent: 0.76,
      high: 1658.00,
      low: 1642.30,
      color: "text-slate-300"
    },
    {
      metal: "Palladium",
      symbol: "XPD",
      price: 2245.80,
      change: -18.70,
      changePercent: -0.83,
      high: 2268.50,
      low: 2240.10,
      color: "text-blue-400"
    }
  ];

  const timeframes = ["1H", "1D", "1W", "1M", "3M", "1Y", "5Y"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Live Market Charts</h1>
          <p className="text-muted-foreground">
            Real-time precious metals pricing and market analysis
          </p>
        </div>

        {/* Market Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metalData.map((metal) => (
            <Card key={metal.symbol} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{metal.metal}</CardTitle>
                  <Badge variant="outline">{metal.symbol}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className={`text-2xl font-bold ${metal.color}`}>
                    ${metal.price.toFixed(2)}
                  </div>
                  <div className="flex items-center gap-2">
                    {metal.change >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={metal.change >= 0 ? "text-green-600" : "text-red-600"}>
                      {metal.change >= 0 ? "+" : ""}{metal.change.toFixed(2)} 
                      ({metal.changePercent >= 0 ? "+" : ""}{metal.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div>H: ${metal.high.toFixed(2)}</div>
                    <div>L: ${metal.low.toFixed(2)}</div>
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
                    <div className="flex gap-2">
                      {timeframes.map((timeframe) => (
                        <Button
                          key={timeframe}
                          variant={selectedTimeframe === timeframe ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTimeframe(timeframe)}
                        >
                          {timeframe}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
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
      <Footer />
    </div>
  );
};

export default Charts;