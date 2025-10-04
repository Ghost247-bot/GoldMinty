import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Search, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatCurrency } from "@/lib/utils";
import { useMetalPrices } from "@/hooks/useMetalPrices";
import { Skeleton } from "@/components/ui/skeleton";

const Prices = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { prices, loading, refetch } = useMetalPrices();

  // Use live prices for spot rates and calculate product prices
  const goldSpot = prices?.gold.price || 3800;
  const silverSpot = prices?.silver.price || 46;
  const platinumSpot = prices?.platinum.price || 1600;
  const palladiumSpot = prices?.palladium.price || 1300;

  const priceData = [
    // Gold Products
    { id: "1", name: "1 oz Gold American Eagle", category: "gold", buyPrice: goldSpot * 1.05, sellPrice: goldSpot * 1.02, change: prices?.gold.change || 0, mint: "US Mint", weight: "1 oz" },
    { id: "2", name: "1 oz Gold Canadian Maple Leaf", category: "gold", buyPrice: goldSpot * 1.04, sellPrice: goldSpot * 1.01, change: prices?.gold.change || 0, mint: "Royal Canadian Mint", weight: "1 oz" },
    { id: "3", name: "1/2 oz Gold American Eagle", category: "gold", buyPrice: goldSpot * 0.525, sellPrice: goldSpot * 0.51, change: prices?.gold.change ? prices.gold.change * 0.5 : 0, mint: "US Mint", weight: "1/2 oz" },
    { id: "4", name: "1/4 oz Gold American Eagle", category: "gold", buyPrice: goldSpot * 0.265, sellPrice: goldSpot * 0.255, change: prices?.gold.change ? prices.gold.change * 0.25 : 0, mint: "US Mint", weight: "1/4 oz" },
    { id: "5", name: "1/10 oz Gold American Eagle", category: "gold", buyPrice: goldSpot * 0.108, sellPrice: goldSpot * 0.103, change: prices?.gold.change ? prices.gold.change * 0.1 : 0, mint: "US Mint", weight: "1/10 oz" },
    { id: "6", name: "1 oz Gold Krugerrand", category: "gold", buyPrice: goldSpot * 1.03, sellPrice: goldSpot * 1.0, change: prices?.gold.change || 0, mint: "South African Mint", weight: "1 oz" },
    
    // Silver Products  
    { id: "7", name: "1 oz Silver American Eagle", category: "silver", buyPrice: silverSpot * 1.06, sellPrice: silverSpot * 1.0, change: prices?.silver.change || 0, mint: "US Mint", weight: "1 oz" },
    { id: "8", name: "1 oz Silver Canadian Maple Leaf", category: "silver", buyPrice: silverSpot * 1.04, sellPrice: silverSpot * 0.98, change: prices?.silver.change || 0, mint: "Royal Canadian Mint", weight: "1 oz" },
    { id: "9", name: "10 oz Silver Bar PAMP Suisse", category: "silver", buyPrice: silverSpot * 10.5, sellPrice: silverSpot * 9.9, change: prices?.silver.change ? prices.silver.change * 10 : 0, mint: "PAMP Suisse", weight: "10 oz" },
    { id: "10", name: "100 oz Silver Bar", category: "silver", buyPrice: silverSpot * 104, sellPrice: silverSpot * 98, change: prices?.silver.change ? prices.silver.change * 100 : 0, mint: "Generic", weight: "100 oz" },
    
    // Platinum Products
    { id: "11", name: "1 oz Platinum American Eagle", category: "platinum", buyPrice: platinumSpot * 1.03, sellPrice: platinumSpot * 0.99, change: prices?.platinum.change || 0, mint: "US Mint", weight: "1 oz" },
    { id: "12", name: "1 oz Platinum Canadian Maple Leaf", category: "platinum", buyPrice: platinumSpot * 1.025, sellPrice: platinumSpot * 0.985, change: prices?.platinum.change || 0, mint: "Royal Canadian Mint", weight: "1 oz" },
    
    // Palladium Products
    { id: "13", name: "1 oz Palladium Canadian Maple Leaf", category: "palladium", buyPrice: palladiumSpot * 1.04, sellPrice: palladiumSpot * 0.98, change: prices?.palladium.change || 0, mint: "Royal Canadian Mint", weight: "1 oz" },
  ];

  const filteredPrices = priceData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const downloadPriceList = () => {
    toast({
      title: t('prices.download'),
      description: t('prices.updatedDesc'),
    });
  };

  const refreshPrices = async () => {
    await refetch();
    toast({
      title: t('prices.updated'),
      description: t('prices.updatedDesc'),
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">Price List</h1>
            <p className="text-muted-foreground">
              Current buy and sell prices for all precious metals products
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
            <Button variant="outline" onClick={refreshPrices} size="sm" className="w-full sm:w-auto" disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="gold" onClick={downloadPriceList} size="sm" className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Download PDF</span>
              <span className="sm:hidden">Download</span>
            </Button>
          </div>
        </div>

        {/* Market Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-6 w-28" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Gold Spot</p>
                      <p className="text-xl font-bold text-gold">${formatCurrency(goldSpot)}</p>
                    </div>
                    {prices && prices.gold.change >= 0 ? (
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    ) : (
                      <TrendingDown className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Silver Spot</p>
                      <p className="text-xl font-bold text-gray-400">${formatCurrency(silverSpot)}</p>
                    </div>
                    {prices && prices.silver.change >= 0 ? (
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    ) : (
                      <TrendingDown className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Platinum Spot</p>
                      <p className="text-xl font-bold text-slate-300">${formatCurrency(platinumSpot)}</p>
                    </div>
                    {prices && prices.platinum.change >= 0 ? (
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    ) : (
                      <TrendingDown className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Palladium Spot</p>
                      <p className="text-xl font-bold text-blue-400">${formatCurrency(palladiumSpot)}</p>
                    </div>
                    {prices && prices.palladium.change >= 0 ? (
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    ) : (
                      <TrendingDown className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="gold">Gold</TabsTrigger>
              <TabsTrigger value="silver">Silver</TabsTrigger>
              <TabsTrigger value="platinum">Platinum</TabsTrigger>
              <TabsTrigger value="palladium">Palladium</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Price Table */}
        <Card>
          <CardHeader>
            <CardTitle>Current Prices</CardTitle>
            <CardDescription>
              Prices updated every 15 minutes during market hours. All prices in USD.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Mint</TableHead>
                    <TableHead className="text-right">Buy Price</TableHead>
                    <TableHead className="text-right">Sell Price</TableHead>
                    <TableHead className="text-right">24h Change</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrices.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="capitalize">
                            {item.category}
                          </Badge>
                          <span className="font-medium">{item.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{item.weight}</TableCell>
                      <TableCell>{item.mint}</TableCell>
                      <TableCell className="text-right font-mono">
                        ${formatCurrency(item.buyPrice)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        ${formatCurrency(item.sellPrice)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className={`flex items-center justify-end gap-1 ${
                          item.change >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.change >= 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          <span className="font-mono">
                            {item.change >= 0 ? '+' : ''}{formatCurrency(item.change)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/product/${item.id}`, { 
                            state: { 
                              product: {
                                id: item.id,
                                name: item.name,
                                price: item.buyPrice,
                                weight: item.weight,
                                mint: item.mint,
                                metal: item.category,
                                image: "/api/placeholder/300/300",
                                inStock: true,
                                rating: 4.8,
                                reviews: 245,
                                description: `High-quality ${item.category} from ${item.mint}`,
                                purity: "Investment grade"
                              }
                            }
                          })}
                        >
                          Buy Now
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredPrices.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No products found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">Important Pricing Information</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Prices are subject to market volatility and may change without notice</p>
              <p>• Buy prices include our premium over spot price</p>
              <p>• Sell prices are our buyback rates for products in good condition</p>
              <p>• Minimum order quantities may apply for certain products</p>
              <p>• Large quantity discounts available upon request</p>
              <p>• All transactions are subject to verification and approval</p>
            </div>
          </CardContent>
        </Card>
    </div>
  );
};

export default Prices;