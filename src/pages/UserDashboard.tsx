import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency, formatOz } from '@/lib/utils';
import { 
  User, 
  Settings, 
  CreditCard, 
  TrendingUp, 
  Wallet, 
  AlertCircle, 
  Activity, 
  BarChart3, 
  Download, 
  Plus, 
  Minus, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  PieChart, 
  DollarSign,
  Target,
  Bell,
  Phone,
  X,
  FileText,
  Mail,
  Calculator,
  BookOpen,
  Shield,
  Zap,
  Eye,
  RefreshCw,
  TrendingDown,
  Award,
  LineChart,
  RotateCcw,
  Lightbulb,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Menu
} from 'lucide-react';

export default function UserDashboard() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [investmentAccounts, setInvestmentAccounts] = useState<any[]>([]);
  const [userBanners, setUserBanners] = useState<any[]>([]);
  const [expandedBanners, setExpandedBanners] = useState<Set<string>>(new Set());
  const [portfolioAllocations, setPortfolioAllocations] = useState<Map<string, any>>(new Map());
  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionsPage, setTransactionsPage] = useState(1);
  const [transactionsTotalCount, setTransactionsTotalCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editAllocationDialogOpen, setEditAllocationDialogOpen] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState<any>(null);
  
  // Dialog states for quick actions
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [withdrawalDialogOpen, setWithdrawalDialogOpen] = useState(false);
  const [reportsDialogOpen, setReportsDialogOpen] = useState(false);
  const [statementsDialogOpen, setStatementsDialogOpen] = useState(false);
  const [alertsDialogOpen, setAlertsDialogOpen] = useState(false);
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [goalsDialogOpen, setGoalsDialogOpen] = useState(false);
  
  // New dialog states for enhanced features
  const [rebalanceDialogOpen, setRebalanceDialogOpen] = useState(false);
  const [calculatorDialogOpen, setCalculatorDialogOpen] = useState(false);
  const [riskDialogOpen, setRiskDialogOpen] = useState(false);
  const [recommendationsDialogOpen, setRecommendationsDialogOpen] = useState(false);
  const [priceAlertsDialogOpen, setPriceAlertsDialogOpen] = useState(false);
  const [watchlistDialogOpen, setWatchlistDialogOpen] = useState(false);
  const [guidesDialogOpen, setGuidesDialogOpen] = useState(false);
  const [marketAnalysisDialogOpen, setMarketAnalysisDialogOpen] = useState(false);
  const [withdrawalDetailsDialogOpen, setWithdrawalDetailsDialogOpen] = useState(false);
  const [selectedWithdrawalRequest, setSelectedWithdrawalRequest] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Form states
  const [depositForm, setDepositForm] = useState({
    amount: '',
    method: 'bank_transfer',
    notes: ''
  });
  const [withdrawalForm, setWithdrawalForm] = useState({
    withdrawalType: 'cash',
    metalType: 'gold',
    amountOz: '',
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
    shippingCountry: 'United States'
  });
  const [withdrawalRequests, setWithdrawalRequests] = useState<any[]>([]);
  const [supportForm, setSupportForm] = useState({
    subject: '',
    category: 'general',
    message: ''
  });
  const [alertSettings, setAlertSettings] = useState({
    priceAlerts: true,
    accountUpdates: true,
    marketNews: false,
    promotions: false
  });
  const [goalSettings, setGoalSettings] = useState({
    goldTarget: '100',
    portfolioTarget: '15000000',
    silverTarget: '500',
    targetDate: ''
  });
  
  // New form states for enhanced features
  const [calculatorForm, setCalculatorForm] = useState({
    initialInvestment: '',
    monthlyContribution: '',
    timeHorizon: '10',
    expectedReturn: '8',
    metalAllocation: {
      gold: '60',
      silver: '25',
      platinum: '15'
    }
  });
  const [rebalanceSettings, setRebalanceSettings] = useState({
    targetGold: '60',
    targetSilver: '25',
    targetPlatinum: '15',
    rebalanceThreshold: '5'
  });
  const [priceAlerts, setPriceAlerts] = useState({
    goldPrice: '',
    silverPrice: '',
    platinumPrice: '',
    emailAlerts: true,
    pushNotifications: true
  });
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchInvestmentAccounts();
      fetchUserBanners();
      fetchTransactions(1);
      checkAdminRole();
      fetchUserToolSettings();
      fetchWishlist();
      fetchProducts();
      fetchWithdrawalRequests();
    }
  }, [user]);

  useEffect(() => {
    if (investmentAccounts.length > 0) {
      const accountIds = investmentAccounts.map(acc => acc.id);
      fetchPortfolioAllocations(accountIds);
    }
  }, [investmentAccounts]);

  const checkAdminRole = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();
    
    if (!error && data) {
      setIsAdmin(true);
    }
  };

  const fetchPortfolioAllocations = async (accountIds: string[]) => {
    if (accountIds.length === 0) return;
    
    const { data, error } = await supabase
      .from('portfolio_allocations')
      .select('*')
      .in('account_id', accountIds);
    
    if (error) {
      console.error('Error fetching portfolio allocations:', error);
      return;
    }
    
    if (data) {
      const allocationsMap = new Map();
      data.forEach(allocation => {
        allocationsMap.set(allocation.account_id, allocation);
      });
      setPortfolioAllocations(allocationsMap);
      console.log('Portfolio allocations loaded:', data);
    }
  };

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (data) {
      setProfile(data);
    }
  };

  const fetchInvestmentAccounts = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('investment_accounts')
      .select('*')
      .eq('user_id', user.id);
    
    if (data) {
      setInvestmentAccounts(data);
    }
  };

  const fetchUserBanners = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('user_banners')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('priority', { ascending: false });
    
    if (data) {
      setUserBanners(data);
    }
  };

  const fetchTransactions = async (page: number = 1) => {
    if (!user) return;
    
    const itemsPerPage = 15;
    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;
    
    // Get total count
    const { count } = await supabase
      .from('user_transactions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);
    
    if (count !== null) {
      setTransactionsTotalCount(count);
    }
    
    // Get paginated data
    const { data, error } = await supabase
      .from('user_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('transaction_date', { ascending: false })
      .range(from, to);
    
    if (error) {
      console.error('Error fetching transactions:', error);
      return;
    }
    
    if (data) {
      setTransactions(data);
    }
  };

  const fetchUserToolSettings = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('user_tool_settings')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (data) {
      setPriceAlerts({
        goldPrice: data.gold_price_alert?.toString() || '',
        silverPrice: data.silver_price_alert?.toString() || '',
        platinumPrice: data.platinum_price_alert?.toString() || '',
        emailAlerts: data.email_alerts_enabled ?? true,
        pushNotifications: data.push_notifications_enabled ?? true
      });
    }
  };

  const fetchWishlist = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('wishlist')
      .select('*, products(*)')
      .eq('user_id', user.id);
    
    if (data) {
      setWishlistItems(data);
    }
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .limit(20);
    
    if (data) {
      setProducts(data);
    }
  };

  const totalBalance = investmentAccounts.reduce((sum, acc) => sum + Number(acc.balance), 0);
  const totalGoldHoldings = investmentAccounts.reduce((sum, acc) => sum + Number(acc.gold_holdings), 0);
  const totalSilverHoldings = investmentAccounts.reduce((sum, acc) => sum + Number(acc.silver_holdings), 0);
  const totalPlatinumHoldings = investmentAccounts.reduce((sum, acc) => sum + Number(acc.platinum_holdings), 0);

  // Quick action handlers
  const handleDepositRequest = async () => {
    if (!depositForm.amount) {
      toast({ title: "Error", description: "Please enter deposit amount", variant: "destructive" });
      return;
    }
    
    // In a real app, this would create a deposit request in the database
    toast({
      title: "Deposit Request Submitted",
      description: `Your deposit request for $${depositForm.amount} has been submitted and is pending review.`
    });
    
    setDepositDialogOpen(false);
    setDepositForm({ amount: '', method: 'bank_transfer', notes: '' });
  };

  const fetchWithdrawalRequests = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('withdrawal_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching withdrawal requests:', error);
      return;
    }
    
    setWithdrawalRequests(data || []);
  };

  const handleWithdrawalRequest = async () => {
    console.log('=== WITHDRAWAL REQUEST STARTED ===');
    console.log('User:', user?.id);
    console.log('Form data:', withdrawalForm);
    
    if (!user) {
      console.log('No user found');
      return;
    }
    
    if (!withdrawalForm.amountOz || Number(withdrawalForm.amountOz) <= 0) {
      console.log('Invalid amount:', withdrawalForm.amountOz);
      toast({ title: "Error", description: "Please enter a valid amount", variant: "destructive" });
      return;
    }

    // Check if user has enough holdings
    const metalHoldings = {
      gold: totalGoldHoldings,
      silver: totalSilverHoldings,
      platinum: totalPlatinumHoldings
    };
    
    console.log('Metal holdings:', metalHoldings);
    console.log('Requested amount:', withdrawalForm.amountOz, 'of', withdrawalForm.metalType);
    
    if (Number(withdrawalForm.amountOz) > metalHoldings[withdrawalForm.metalType as keyof typeof metalHoldings]) {
      console.log('Insufficient holdings');
      toast({ 
        title: "Error", 
        description: `Insufficient ${withdrawalForm.metalType} holdings. Available: ${formatOz(metalHoldings[withdrawalForm.metalType as keyof typeof metalHoldings])} oz`,
        variant: "destructive" 
      });
      return;
    }

    // Validate shipping address if physical withdrawal
    if (withdrawalForm.withdrawalType === 'physical') {
      console.log('Physical withdrawal - checking shipping address');
      if (!withdrawalForm.shippingAddress || !withdrawalForm.shippingCity || 
          !withdrawalForm.shippingState || !withdrawalForm.shippingZip) {
        console.log('Missing shipping address fields');
        toast({ title: "Error", description: "Please complete all shipping address fields", variant: "destructive" });
        return;
      }
    }

    // Get current metal prices for estimated value
    const metalPrices = {
      gold: 2650,
      silver: 31.50,
      platinum: 990
    };
    const estimatedValue = Number(withdrawalForm.amountOz) * metalPrices[withdrawalForm.metalType as keyof typeof metalPrices];

    console.log('Estimated value:', estimatedValue);
    console.log('Submitting to database...');

    const insertData = {
      user_id: user.id,
      metal_type: withdrawalForm.metalType,
      amount_oz: Number(withdrawalForm.amountOz),
      withdrawal_type: withdrawalForm.withdrawalType,
      shipping_address: withdrawalForm.withdrawalType === 'physical' ? withdrawalForm.shippingAddress : null,
      shipping_city: withdrawalForm.withdrawalType === 'physical' ? withdrawalForm.shippingCity : null,
      shipping_state: withdrawalForm.withdrawalType === 'physical' ? withdrawalForm.shippingState : null,
      shipping_zip: withdrawalForm.withdrawalType === 'physical' ? withdrawalForm.shippingZip : null,
      shipping_country: withdrawalForm.withdrawalType === 'physical' ? withdrawalForm.shippingCountry : null,
      estimated_value: estimatedValue,
      created_by: user.id,
      status: 'pending'
    };

    console.log('Insert data:', insertData);

    const { data, error } = await supabase
      .from('withdrawal_requests')
      .insert(insertData)
      .select();
    
    if (error) {
      console.error('Database error:', error);
      toast({ 
        title: "Error", 
        description: `Failed to submit: ${error.message}`,
        variant: "destructive" 
      });
      return;
    }
    
    console.log('Success! Inserted data:', data);
    
    toast({
      title: "Withdrawal Request Submitted", 
      description: `Your ${withdrawalForm.withdrawalType === 'physical' ? 'physical shipment' : 'cash withdrawal'} request for ${withdrawalForm.amountOz} oz of ${withdrawalForm.metalType} has been submitted.`
    });
    
    setWithdrawalDialogOpen(false);
    setWithdrawalForm({ 
      withdrawalType: 'cash',
      metalType: 'gold',
      amountOz: '',
      shippingAddress: '',
      shippingCity: '',
      shippingState: '',
      shippingZip: '',
      shippingCountry: 'United States'
    });
    fetchWithdrawalRequests();
  };

  const handleDownloadStatements = () => {
    // Generate mock PDF data
    const pdfData = `Account Statement
    Account: ${investmentAccounts[0]?.account_number || 'N/A'}
    Period: ${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString()} - ${new Date().toLocaleDateString()}
    
    Holdings Summary:
    Gold: ${formatOz(totalGoldHoldings)} oz
    Silver: ${formatOz(totalSilverHoldings)} oz
    Platinum: ${formatOz(totalPlatinumHoldings)} oz
    
    Total Balance: $${formatCurrency(totalBalance)}`;
    
    const blob = new Blob([pdfData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `statement_${new Date().getFullYear()}_${new Date().getMonth() + 1}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    toast({ title: "Statement Downloaded", description: "Your account statement has been downloaded." });
  };

  const handleSupportSubmit = async () => {
    if (!supportForm.subject || !supportForm.message) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    
    // In a real app, this would create a support ticket
    toast({
      title: "Support Request Submitted",
      description: "Your support request has been submitted. We'll get back to you within 24 hours."
    });
    
    setSupportDialogOpen(false);
    setSupportForm({ subject: '', category: 'general', message: '' });
  };

  const handleAlertSettingsUpdate = async () => {
    // In a real app, this would update user preferences in the database
    toast({
      title: "Alert Settings Updated",
      description: "Your notification preferences have been saved."
    });
    setAlertsDialogOpen(false);
  };

  const handleGoalSettingsUpdate = async () => {
    if (!goalSettings.goldTarget || !goalSettings.portfolioTarget) {
      toast({ title: "Error", description: "Please enter valid targets", variant: "destructive" });
      return;
    }
    
    toast({
      title: "Investment Goals Updated",
      description: "Your investment goals have been saved successfully."
    });
    setGoalsDialogOpen(false);
  };
  
  const handleSaveAllocation = async () => {
    if (!editingAllocation || !user) return;
    
    const total = Number(editingAllocation.gold_percentage) + 
                  Number(editingAllocation.silver_percentage) + 
                  Number(editingAllocation.platinum_percentage) + 
                  Number(editingAllocation.cash_percentage);
    
    if (total !== 100) {
      toast({ 
        title: "Error", 
        description: "Total allocation must equal 100%", 
        variant: "destructive" 
      });
      return;
    }
    
    const { data: existing } = await supabase
      .from('portfolio_allocations')
      .select('id')
      .eq('account_id', editingAllocation.account_id)
      .maybeSingle();
    
    let error;
    if (existing) {
      ({ error } = await supabase
        .from('portfolio_allocations')
        .update({
          gold_percentage: editingAllocation.gold_percentage,
          silver_percentage: editingAllocation.silver_percentage,
          platinum_percentage: editingAllocation.platinum_percentage,
          cash_percentage: editingAllocation.cash_percentage,
        })
        .eq('id', existing.id));
    } else {
      ({ error } = await supabase
        .from('portfolio_allocations')
        .insert({
          account_id: editingAllocation.account_id,
          gold_percentage: editingAllocation.gold_percentage,
          silver_percentage: editingAllocation.silver_percentage,
          platinum_percentage: editingAllocation.platinum_percentage,
          cash_percentage: editingAllocation.cash_percentage,
          created_by: user.id,
        }));
    }
    
    if (error) {
      console.error('Error saving allocation:', error);
      toast({ 
        title: "Error", 
        description: "Failed to save portfolio allocation", 
        variant: "destructive" 
      });
      return;
    }
    
    toast({ 
      title: "Success", 
      description: "Portfolio allocation updated successfully" 
    });
    
    setEditAllocationDialogOpen(false);
    setEditingAllocation(null);
    fetchInvestmentAccounts();
  };

  // Enhanced feature handlers
  const handlePortfolioRebalance = async () => {
    const currentAllocation = {
      gold: formatOz((totalGoldHoldings * 2456.80 / totalBalance * 100), 1),
      silver: formatOz((totalSilverHoldings * 31.24 / totalBalance * 100), 1),
      platinum: formatOz((totalPlatinumHoldings * 952.10 / totalBalance * 100), 1)
    };
    
    toast({
      title: "Rebalancing Recommended",
      description: `Current allocation: Gold ${currentAllocation.gold}%, Silver ${currentAllocation.silver}%, Platinum ${currentAllocation.platinum}%. Target: Gold ${rebalanceSettings.targetGold}%, Silver ${rebalanceSettings.targetSilver}%, Platinum ${rebalanceSettings.targetPlatinum}%`
    });
    setRebalanceDialogOpen(false);
  };

  const calculateInvestmentProjection = () => {
    const initial = parseFloat(calculatorForm.initialInvestment) || 0;
    const monthly = parseFloat(calculatorForm.monthlyContribution) || 0;
    const years = parseFloat(calculatorForm.timeHorizon) || 10;
    const returnRate = parseFloat(calculatorForm.expectedReturn) / 100 || 0.08;
    
    const futureValue = initial * Math.pow(1 + returnRate, years) + 
                       monthly * (Math.pow(1 + returnRate, years) - 1) / returnRate * 12;
    
    return formatCurrency(futureValue);
  };

  const getRiskLevel = () => {
    const portfolioValue = totalBalance;
    const goldPercentage = (totalGoldHoldings * 2456.80 / portfolioValue * 100);
    
    if (goldPercentage > 80) return { level: "Conservative", color: "text-green-600" };
    if (goldPercentage > 50) return { level: "Moderate", color: "text-yellow-600" };
    return { level: "Aggressive", color: "text-red-600" };
  };

  const getRecommendations = () => [
    {
      type: "Diversification",
      title: "Consider increasing silver allocation",
      description: "Your portfolio is heavily weighted in gold. Consider diversifying with silver for better risk management.",
      priority: "Medium",
      action: "Rebalance Portfolio"
    },
    {
      type: "Market Timing",
      title: "Gold prices are near yearly highs",
      description: "Consider taking some profits or dollar-cost averaging your next purchases.",
      priority: "High",
      action: "Review Positions"
    },
    {
      type: "Tax Optimization",
      title: "Review tax-loss harvesting opportunities",
      description: "Some positions may be eligible for tax-loss harvesting to optimize your tax situation.",
      priority: "Low",
      action: "Consult Advisor"
    }
  ];

  const handleSavePriceAlerts = async () => {
    if (!user) return;

    const { data: existing } = await supabase
      .from('user_tool_settings')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    let error;
    if (existing) {
      ({ error } = await supabase
        .from('user_tool_settings')
        .update({
          gold_price_alert: priceAlerts.goldPrice ? parseFloat(priceAlerts.goldPrice) : null,
          silver_price_alert: priceAlerts.silverPrice ? parseFloat(priceAlerts.silverPrice) : null,
          platinum_price_alert: priceAlerts.platinumPrice ? parseFloat(priceAlerts.platinumPrice) : null,
          email_alerts_enabled: priceAlerts.emailAlerts,
          push_notifications_enabled: priceAlerts.pushNotifications,
        })
        .eq('id', existing.id));
    } else {
      ({ error } = await supabase
        .from('user_tool_settings')
        .insert({
          user_id: user.id,
          gold_price_alert: priceAlerts.goldPrice ? parseFloat(priceAlerts.goldPrice) : null,
          silver_price_alert: priceAlerts.silverPrice ? parseFloat(priceAlerts.silverPrice) : null,
          platinum_price_alert: priceAlerts.platinumPrice ? parseFloat(priceAlerts.platinumPrice) : null,
          email_alerts_enabled: priceAlerts.emailAlerts,
          push_notifications_enabled: priceAlerts.pushNotifications,
          created_by: user.id,
        }));
    }

    if (error) {
      toast({ title: "Error", description: "Failed to save price alerts", variant: "destructive" });
      return;
    }

    toast({ title: "Success", description: "Price alerts saved successfully" });
    setPriceAlertsDialogOpen(false);
  };

  const handleRemoveFromWishlist = async (wishlistId: string) => {
    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('id', wishlistId);

    if (error) {
      toast({ title: "Error", description: "Failed to remove item from wishlist", variant: "destructive" });
      return;
    }

    toast({ title: "Success", description: "Item removed from wishlist" });
    fetchWishlist();
  };

  const handleAddToWishlist = async (productId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('wishlist')
      .insert({
        user_id: user.id,
        product_id: productId,
      });

    if (error) {
      if (error.code === '23505') {
        toast({ title: "Info", description: "Item already in wishlist", variant: "default" });
      } else {
        toast({ title: "Error", description: "Failed to add item to wishlist", variant: "destructive" });
      }
      return;
    }

    toast({ title: "Success", description: "Item added to wishlist" });
    fetchWishlist();
  };

  const toggleBannerExpansion = (bannerId: string) => {
    setExpandedBanners(prev => {
      const newSet = new Set(prev);
      if (newSet.has(bannerId)) {
        newSet.delete(bannerId);
      } else {
        newSet.add(bannerId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl lg:text-2xl font-display font-bold text-foreground">
                GoldMint Dashboard
              </h1>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                User
              </Badge>
            </div>
            <div className="flex items-center gap-3 lg:gap-4">
              <span className="hidden md:inline-flex text-sm text-muted-foreground">
                Welcome, {profile?.full_name || user?.email?.split('@')[0] || 'User'}
              </span>
              <Button variant="outline" size="sm" onClick={signOut} className="h-9">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* User Banners */}
        {userBanners.length > 0 && (
          <div className="space-y-3 mb-8">
            {userBanners.map((banner) => {
              const isExpanded = expandedBanners.has(banner.id);
              return (
                <div
                  key={banner.id}
                  className="group relative bg-card border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
                  onClick={() => toggleBannerExpansion(banner.id)}
                >
                  {/* Status Indicator Line */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 ${
                      banner.banner_type === 'error'
                        ? 'bg-destructive'
                        : banner.banner_type === 'warning'
                        ? 'bg-amber-500'
                        : banner.banner_type === 'success'
                        ? 'bg-success'
                        : 'bg-primary'
                    }`}
                  />
                  
                  <div className="pl-5 pr-4 py-4">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 w-9 h-9 rounded-md flex items-center justify-center ${
                          banner.banner_type === 'error'
                            ? 'bg-destructive/10 text-destructive'
                            : banner.banner_type === 'warning'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-500'
                            : banner.banner_type === 'success'
                            ? 'bg-success/10 text-success'
                            : 'bg-primary/10 text-primary'
                        }`}
                      >
                        {banner.banner_type === 'error' ? (
                          <AlertTriangle className="h-4 w-4" />
                        ) : banner.banner_type === 'warning' ? (
                          <AlertCircle className="h-4 w-4" />
                        ) : banner.banner_type === 'success' ? (
                          <Award className="h-4 w-4" />
                        ) : (
                          <Lightbulb className="h-4 w-4" />
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3 mb-1">
                          <h4 className="font-semibold text-sm text-foreground">
                            {banner.title}
                          </h4>
                          <ChevronDown
                            className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                        
                        {isExpanded && (
                          <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                            <p className="text-sm text-muted-foreground leading-relaxed pr-6">
                              {banner.message}
                            </p>
                            {banner.expires_at && (
                              <div className="flex items-center gap-1.5 pt-2 mt-2 border-t text-xs text-muted-foreground">
                                <Clock className="h-3.5 w-3.5" />
                                <span>Expires {new Date(banner.expires_at).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  year: 'numeric' 
                                })}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${formatCurrency(totalBalance)}</div>
              <p className="text-xs text-muted-foreground">
                {investmentAccounts.length > 0 ? `${investmentAccounts.length} account(s)` : 'No investment accounts'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gold Holdings</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatOz(totalGoldHoldings)} oz</div>
              <p className="text-xs text-muted-foreground">
                Silver: {formatOz(totalSilverHoldings)} oz | Platinum: {formatOz(totalPlatinumHoldings)} oz
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Status</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Active</div>
              <p className="text-xs text-muted-foreground">
                Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Investment Accounts Section */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Investment Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {investmentAccounts.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground">No Investment Accounts</h3>
                  <p className="text-sm text-muted-foreground">
                    You don't have any investment accounts yet. Contact an administrator to set up your investment account.
                  </p>
                </div>
              ) : (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  {/* Mobile Hamburger Menu */}
                  <div className="lg:hidden mb-4">
                    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="lg" className="w-full justify-start gap-2">
                          <Menu className="h-5 w-5" />
                          <span className="font-medium">Navigation Menu</span>
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-[280px] sm:w-[350px]">
                        <SheetHeader>
                          <SheetTitle>Dashboard Navigation</SheetTitle>
                        </SheetHeader>
                        <nav className="mt-6 flex flex-col gap-2">
                          <Button
                            variant={activeTab === 'overview' ? 'default' : 'ghost'}
                            className="w-full justify-start gap-3 h-12"
                            onClick={() => {
                              setActiveTab('overview');
                              setIsMenuOpen(false);
                            }}
                          >
                            <Activity className="h-5 w-5" />
                            <span>Overview</span>
                          </Button>
                          <Button
                            variant={activeTab === 'transactions' ? 'default' : 'ghost'}
                            className="w-full justify-start gap-3 h-12"
                            onClick={() => {
                              setActiveTab('transactions');
                              setIsMenuOpen(false);
                            }}
                          >
                            <ArrowUpRight className="h-5 w-5" />
                            <span>Transactions</span>
                          </Button>
                          <Button
                            variant={activeTab === 'withdrawals' ? 'default' : 'ghost'}
                            className="w-full justify-start gap-3 h-12"
                            onClick={() => {
                              setActiveTab('withdrawals');
                              setIsMenuOpen(false);
                            }}
                          >
                            <ArrowDownRight className="h-5 w-5" />
                            <span>Withdrawals</span>
                          </Button>
                          <Button
                            variant={activeTab === 'performance' ? 'default' : 'ghost'}
                            className="w-full justify-start gap-3 h-12"
                            onClick={() => {
                              setActiveTab('performance');
                              setIsMenuOpen(false);
                            }}
                          >
                            <TrendingUp className="h-5 w-5" />
                            <span>Performance</span>
                          </Button>
                          <Button
                            variant={activeTab === 'analysis' ? 'default' : 'ghost'}
                            className="w-full justify-start gap-3 h-12"
                            onClick={() => {
                              setActiveTab('analysis');
                              setIsMenuOpen(false);
                            }}
                          >
                            <Shield className="h-5 w-5" />
                            <span>Risk Analysis</span>
                          </Button>
                          <Button
                            variant={activeTab === 'recommendations' ? 'default' : 'ghost'}
                            className="w-full justify-start gap-3 h-12"
                            onClick={() => {
                              setActiveTab('recommendations');
                              setIsMenuOpen(false);
                            }}
                          >
                            <Lightbulb className="h-5 w-5" />
                            <span>AI Insights</span>
                          </Button>
                          <Button
                            variant={activeTab === 'tools' ? 'default' : 'ghost'}
                            className="w-full justify-start gap-3 h-12"
                            onClick={() => {
                              setActiveTab('tools');
                              setIsMenuOpen(false);
                            }}
                          >
                            <Settings className="h-5 w-5" />
                            <span>Tools</span>
                          </Button>
                          <Button
                            variant={activeTab === 'actions' ? 'default' : 'ghost'}
                            className="w-full justify-start gap-3 h-12"
                            onClick={() => {
                              setActiveTab('actions');
                              setIsMenuOpen(false);
                            }}
                          >
                            <Zap className="h-5 w-5" />
                            <span>Actions</span>
                          </Button>
                        </nav>
                      </SheetContent>
                    </Sheet>
                  </div>

                  {/* Desktop Tabs */}
                  <div className="hidden lg:block border-b border-border bg-card rounded-lg p-2 shadow-sm mb-4">
                    <TabsList className="w-full h-auto flex gap-1 bg-transparent p-0">
                      <TabsTrigger 
                        value="overview"
                        className="flex-1 flex items-center gap-2 justify-center px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all hover:bg-muted/50"
                      >
                        <Activity className="h-4 w-4" />
                        <span>Overview</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="transactions"
                        className="flex-1 flex items-center gap-2 justify-center px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all hover:bg-muted/50"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                        <span>Transactions</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="withdrawals"
                        className="flex-1 flex items-center gap-2 justify-center px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all hover:bg-muted/50"
                      >
                        <ArrowDownRight className="h-4 w-4" />
                        <span>Withdrawals</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="performance"
                        className="flex-1 flex items-center gap-2 justify-center px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all hover:bg-muted/50"
                      >
                        <TrendingUp className="h-4 w-4" />
                        <span>Performance</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="analysis"
                        className="flex-1 flex items-center gap-2 justify-center px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all hover:bg-muted/50"
                      >
                        <Shield className="h-4 w-4" />
                        <span>Risk Analysis</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="recommendations"
                        className="flex-1 flex items-center gap-2 justify-center px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all hover:bg-muted/50"
                      >
                        <Lightbulb className="h-4 w-4" />
                        <span>AI Insights</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="tools"
                        className="flex-1 flex items-center gap-2 justify-center px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all hover:bg-muted/50"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Tools</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="actions"
                        className="flex-1 flex items-center gap-2 justify-center px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all hover:bg-muted/50"
                      >
                        <Zap className="h-4 w-4" />
                        <span>Actions</span>
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="overview" className="space-y-4 mt-6">
                    {investmentAccounts.map((account) => (
                      <div key={account.id} className="border rounded-lg p-6 bg-gradient-to-r from-background to-muted/20">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-semibold">{account.account_number}</h4>
                            <Badge variant={account.status === 'active' ? 'default' : 'secondary'} className="mt-1">
                              {account.status}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">${formatCurrency(account.balance)}</div>
                            <div className="text-sm text-muted-foreground capitalize">{account.account_type} Account</div>
                          </div>
                        </div>
                        
                        {/* Holdings Breakdown */}
                        <div className="grid grid-cols-3 gap-6 mt-6 p-4 bg-card rounded-lg">
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                              <span className="text-sm font-medium text-muted-foreground">Gold</span>
                            </div>
                            <div className="text-xl font-bold">{formatOz(account.gold_holdings)} oz</div>
                            <div className="text-xs text-green-600">+2.3% this week</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                              <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                              <span className="text-sm font-medium text-muted-foreground">Silver</span>
                            </div>
                            <div className="text-xl font-bold">{formatOz(account.silver_holdings)} oz</div>
                            <div className="text-xs text-red-600">-0.8% this week</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                              <div className="w-3 h-3 bg-gray-600 rounded-full mr-2"></div>
                              <span className="text-sm font-medium text-muted-foreground">Platinum</span>
                            </div>
                            <div className="text-xl font-bold">{formatOz(account.platinum_holdings)} oz</div>
                            <div className="text-xs text-green-600">+1.5% this week</div>
                          </div>
                        </div>

                        {/* Portfolio Allocation */}
                        <div className="mt-6 p-4 bg-card rounded-lg">
                          <div className="flex justify-between items-center mb-3">
                            <h5 className="font-medium flex items-center gap-2">
                              <PieChart className="h-4 w-4" />
                              Portfolio Allocation
                            </h5>
                          </div>
                            <div className="space-y-3">
                              {(() => {
                                const allocation = portfolioAllocations.get(account.id);
                                const goldPct = Number(allocation?.gold_percentage || 0);
                               const cashPct = Number(allocation?.cash_percentage || 0);
                               const silverPct = Number(allocation?.silver_percentage || 0);
                               const platinumPct = Number(allocation?.platinum_percentage || 0);
                               
                               const hasData = goldPct + cashPct + silverPct + platinumPct > 0;
                               
                               if (!hasData) {
                                 return (
                                   <div className="text-center py-4 text-muted-foreground text-sm">
                                     No allocation data set. Contact your administrator.
                                   </div>
                                 );
                               }
                               
                               return (
                                 <>
                                   <div>
                                     <div className="flex justify-between text-sm mb-1">
                                       <span>Gold</span>
                                       <span>{goldPct.toFixed(1)}%</span>
                                     </div>
                                     <Progress value={goldPct} className="h-2" />
                                   </div>
                                   <div>
                                     <div className="flex justify-between text-sm mb-1">
                                       <span>Cash</span>
                                       <span>{cashPct.toFixed(1)}%</span>
                                     </div>
                                     <Progress value={cashPct} className="h-2" />
                                   </div>
                                   <div>
                                     <div className="flex justify-between text-sm mb-1">
                                       <span>Silver</span>
                                       <span>{silverPct.toFixed(1)}%</span>
                                     </div>
                                     <Progress value={silverPct} className="h-2" />
                                   </div>
                                   <div>
                                     <div className="flex justify-between text-sm mb-1">
                                       <span>Platinum</span>
                                       <span>{platinumPct.toFixed(1)}%</span>
                                     </div>
                                     <Progress value={platinumPct} className="h-2" />
                                   </div>
                                 </>
                               );
                             })()}
                           </div>
                        </div>
                        
                        {account.notes && (
                          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                            <div className="text-sm font-medium text-muted-foreground mb-1">Account Notes</div>
                            <div className="text-sm">{account.notes}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="transactions" className="mt-6">
                    <div className="space-y-4">
                      {/* Transaction Summary Cards */}
                      <div className="grid gap-4 md:grid-cols-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              ${formatCurrency(
                                transactions
                                  .filter(t => t.status === 'completed')
                                  .reduce((sum, t) => sum + Number(t.total_value || 0), 0)
                              )}
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Gold Holdings</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {formatOz(
                                transactions
                                  .filter(t => t.metal_type === 'gold' && t.status === 'completed')
                                  .reduce((sum, t) => {
                                    if (t.transaction_type === 'buy' || t.transaction_type === 'dividend' || t.transaction_type === 'transfer') {
                                      return sum + Number(t.amount);
                                    } else if (t.transaction_type === 'sell') {
                                      return sum - Number(t.amount);
                                    }
                                    return sum;
                                  }, 0)
                              )} oz
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Silver Holdings</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {formatOz(
                                transactions
                                  .filter(t => t.metal_type === 'silver' && t.status === 'completed')
                                  .reduce((sum, t) => {
                                    if (t.transaction_type === 'buy' || t.transaction_type === 'dividend' || t.transaction_type === 'transfer') {
                                      return sum + Number(t.amount);
                                    } else if (t.transaction_type === 'sell') {
                                      return sum - Number(t.amount);
                                    }
                                    return sum;
                                  }, 0)
                              )} oz
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Platinum Holdings</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {formatOz(
                                transactions
                                  .filter(t => t.metal_type === 'platinum' && t.status === 'completed')
                                  .reduce((sum, t) => {
                                    if (t.transaction_type === 'buy' || t.transaction_type === 'dividend' || t.transaction_type === 'transfer') {
                                      return sum + Number(t.amount);
                                    } else if (t.transaction_type === 'sell') {
                                      return sum - Number(t.amount);
                                    }
                                    return sum;
                                  }, 0)
                              )} oz
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Recent Transactions</h3>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                      <Card>
                        <CardContent className="p-0">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Metal</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {transactions.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                                    No transactions found
                                  </TableCell>
                                </TableRow>
                              ) : (
                                transactions.map((transaction) => (
                                  <TableRow key={transaction.id}>
                                    <TableCell className="font-medium">
                                      {new Date(transaction.transaction_date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        {transaction.transaction_type === 'buy' && (
                                          <>
                                            <ArrowUpRight className="h-4 w-4 text-green-600" />
                                            <span className="capitalize">Buy</span>
                                          </>
                                        )}
                                        {transaction.transaction_type === 'sell' && (
                                          <>
                                            <ArrowDownRight className="h-4 w-4 text-red-600" />
                                            <span className="capitalize">Sell</span>
                                          </>
                                        )}
                                        {(transaction.transaction_type === 'transfer' || transaction.transaction_type === 'dividend') && (
                                          <>
                                            <Clock className="h-4 w-4 text-blue-600" />
                                            <span className="capitalize">{transaction.transaction_type}</span>
                                          </>
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell className="capitalize">{transaction.metal_type}</TableCell>
                                    <TableCell>{formatOz(transaction.amount)} oz</TableCell>
                                    <TableCell>${formatCurrency(transaction.price_per_oz)}</TableCell>
                                    <TableCell>
                                      <Badge variant={
                                        transaction.status === 'completed' ? 'default' : 
                                        transaction.status === 'pending' ? 'secondary' : 
                                        'outline'
                                      }>
                                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                      
                      {/* Pagination */}
                      {transactionsTotalCount > 15 && (
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious 
                                onClick={() => {
                                  if (transactionsPage > 1) {
                                    setTransactionsPage(transactionsPage - 1);
                                    fetchTransactions(transactionsPage - 1);
                                  }
                                }}
                                className={transactionsPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                              />
                            </PaginationItem>
                            
                            {Array.from({ length: Math.ceil(transactionsTotalCount / 15) }, (_, i) => i + 1).map((page) => (
                              <PaginationItem key={page}>
                                <PaginationLink 
                                  onClick={() => {
                                    setTransactionsPage(page);
                                    fetchTransactions(page);
                                  }}
                                  isActive={page === transactionsPage}
                                  className="cursor-pointer"
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            ))}
                            
                            <PaginationItem>
                              <PaginationNext 
                                onClick={() => {
                                  if (transactionsPage < Math.ceil(transactionsTotalCount / 15)) {
                                    setTransactionsPage(transactionsPage + 1);
                                    fetchTransactions(transactionsPage + 1);
                                  }
                                }}
                                className={transactionsPage >= Math.ceil(transactionsTotalCount / 15) ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="withdrawals" className="mt-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Withdrawal Requests</h3>
                        <Button variant="outline" size="sm" onClick={() => setWithdrawalDialogOpen(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          New Withdrawal
                        </Button>
                      </div>
                      
                      <Card>
                        <CardContent className="p-0">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Metal</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Est. Value</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Tracking</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {withdrawalRequests.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                    <div className="flex flex-col items-center gap-2">
                                      <AlertCircle className="h-8 w-8 text-muted-foreground" />
                                      <p>No withdrawal requests found</p>
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => setWithdrawalDialogOpen(true)}
                                        className="mt-2"
                                      >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create First Request
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ) : (
                                withdrawalRequests.map((request) => (
                                  <TableRow 
                                    key={request.id} 
                                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                                    onClick={() => {
                                      setSelectedWithdrawalRequest(request);
                                      setWithdrawalDetailsDialogOpen(true);
                                    }}
                                  >
                                    <TableCell className="font-medium">
                                      {new Date(request.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        {request.withdrawal_type === 'cash' ? (
                                          <>
                                            <DollarSign className="h-4 w-4 text-green-600" />
                                            <span>Cash</span>
                                          </>
                                        ) : (
                                          <>
                                            <Clock className="h-4 w-4 text-blue-600" />
                                            <span>Physical</span>
                                          </>
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell className="capitalize">{request.metal_type}</TableCell>
                                    <TableCell>{formatOz(request.amount_oz)} oz</TableCell>
                                    <TableCell>${formatCurrency(request.estimated_value || 0)}</TableCell>
                                    <TableCell>
                                      <Badge variant={
                                        request.status === 'completed' ? 'default' : 
                                        request.status === 'shipped' ? 'default' :
                                        request.status === 'processing' ? 'secondary' :
                                        request.status === 'pending' ? 'secondary' : 
                                        request.status === 'rejected' ? 'destructive' :
                                        'outline'
                                      }>
                                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                      </Badge>
                                    </TableCell>
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                      {request.tracking_number ? (
                                        <a 
                                          href={`https://freightease.online/track/${request.tracking_number}`} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                                        >
                                          {request.tracking_number}
                                          <ArrowUpRight className="h-3 w-3" />
                                        </a>
                                      ) : (
                                        <span className="text-muted-foreground text-sm">-</span>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Withdrawal Details Dialog */}
                  <Dialog open={withdrawalDetailsDialogOpen} onOpenChange={setWithdrawalDetailsDialogOpen}>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Withdrawal Request Details</DialogTitle>
                      </DialogHeader>
                      {selectedWithdrawalRequest && (
                        <div className="space-y-6">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <Label className="text-muted-foreground">Request ID</Label>
                              <p className="font-mono text-sm">{selectedWithdrawalRequest.id.substring(0, 8)}</p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground">Date Submitted</Label>
                              <p className="font-medium">{new Date(selectedWithdrawalRequest.created_at).toLocaleString()}</p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground">Type</Label>
                              <div className="flex items-center gap-2 mt-1">
                                {selectedWithdrawalRequest.withdrawal_type === 'cash' ? (
                                  <>
                                    <DollarSign className="h-4 w-4 text-green-600" />
                                    <span className="font-medium">Cash Withdrawal</span>
                                  </>
                                ) : (
                                  <>
                                    <Clock className="h-4 w-4 text-blue-600" />
                                    <span className="font-medium">Physical Shipment</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div>
                              <Label className="text-muted-foreground">Status</Label>
                              <div className="mt-1">
                                <Badge variant={
                                  selectedWithdrawalRequest.status === 'completed' ? 'default' : 
                                  selectedWithdrawalRequest.status === 'shipped' ? 'default' :
                                  selectedWithdrawalRequest.status === 'processing' ? 'secondary' :
                                  selectedWithdrawalRequest.status === 'pending' ? 'secondary' : 
                                  selectedWithdrawalRequest.status === 'rejected' ? 'destructive' :
                                  'outline'
                                }>
                                  {selectedWithdrawalRequest.status.charAt(0).toUpperCase() + selectedWithdrawalRequest.status.slice(1)}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <Label className="text-muted-foreground">Metal Type</Label>
                              <p className="font-medium capitalize text-lg">{selectedWithdrawalRequest.metal_type}</p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground">Amount</Label>
                              <p className="font-medium text-lg">{formatOz(selectedWithdrawalRequest.amount_oz)} oz</p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground">Estimated Value</Label>
                              <p className="font-medium text-lg text-green-600">
                                ${formatCurrency(selectedWithdrawalRequest.estimated_value || 0)}
                              </p>
                            </div>
                            {selectedWithdrawalRequest.processed_at && (
                              <div>
                                <Label className="text-muted-foreground">Processed Date</Label>
                                <p className="font-medium">{new Date(selectedWithdrawalRequest.processed_at).toLocaleString()}</p>
                              </div>
                            )}
                          </div>

                          {selectedWithdrawalRequest.withdrawal_type === 'physical' && (
                            <>
                              <Separator />
                              <div>
                                <h4 className="font-semibold mb-3">Shipping Information</h4>
                                <div className="space-y-3 bg-muted p-4 rounded-lg">
                                  <div>
                                    <Label className="text-muted-foreground text-xs">Address</Label>
                                    <p className="font-medium">{selectedWithdrawalRequest.shipping_address}</p>
                                  </div>
                                  <div className="grid grid-cols-3 gap-3">
                                    <div>
                                      <Label className="text-muted-foreground text-xs">City</Label>
                                      <p className="font-medium">{selectedWithdrawalRequest.shipping_city}</p>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground text-xs">State</Label>
                                      <p className="font-medium">{selectedWithdrawalRequest.shipping_state}</p>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground text-xs">ZIP</Label>
                                      <p className="font-medium">{selectedWithdrawalRequest.shipping_zip}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-muted-foreground text-xs">Country</Label>
                                    <p className="font-medium">{selectedWithdrawalRequest.shipping_country}</p>
                                  </div>
                                </div>
                              </div>

                              {selectedWithdrawalRequest.tracking_number && (
                                <>
                                  <Separator />
                                  <div>
                                    <h4 className="font-semibold mb-3">Tracking Information</h4>
                                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                                      <div>
                                        <Label className="text-muted-foreground text-xs">Carrier</Label>
                                        <p className="font-semibold text-blue-900 dark:text-blue-100">FreightEase</p>
                                        <Label className="text-muted-foreground text-xs mt-2">Tracking Number</Label>
                                        <p className="font-mono text-sm">{selectedWithdrawalRequest.tracking_number}</p>
                                      </div>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => window.open(`https://freightease.online/track/${selectedWithdrawalRequest.tracking_number}`, '_blank')}
                                      >
                                        Track Package
                                        <ArrowUpRight className="h-3 w-3 ml-1" />
                                      </Button>
                                    </div>
                                  </div>
                                </>
                              )}
                            </>
                          )}

                          {selectedWithdrawalRequest.rejection_reason && (
                            <>
                              <Separator />
                              <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                                <div className="flex items-start gap-2">
                                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                                  <div>
                                    <h4 className="font-semibold text-red-900 dark:text-red-100 mb-1">Rejection Reason</h4>
                                    <p className="text-sm text-red-800 dark:text-red-200">{selectedWithdrawalRequest.rejection_reason}</p>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}

                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setWithdrawalDetailsDialogOpen(false)}>
                              Close
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <TabsContent value="performance" className="mt-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Portfolio Performance
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">1 Month Return</span>
                              <span className="text-lg font-semibold text-green-600">+5.2%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">3 Month Return</span>
                              <span className="text-lg font-semibold text-green-600">+12.8%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">YTD Return</span>
                              <span className="text-lg font-semibold text-green-600">+28.4%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">All Time Return</span>
                              <span className="text-lg font-semibold text-green-600">+156.7%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Investment Goals
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span>Gold Target: 100 oz</span>
                                <span>{formatOz(totalGoldHoldings, 1)}/100 oz</span>
                              </div>
                              <Progress value={(totalGoldHoldings / 100) * 100} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span>Portfolio Target: $15M</span>
                                <span>${formatOz(totalBalance / 1000000, 1)}M/15M</span>
                              </div>
                              <Progress value={(totalBalance / 15000000) * 100} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span>Silver Target: 500 oz</span>
                                <span>{formatOz(totalSilverHoldings, 0)}/500 oz</span>
                              </div>
                              <Progress value={(totalSilverHoldings / 500) * 100} className="h-2" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="analysis" className="mt-6">
                    <div className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Shield className="h-4 w-4" />
                              Risk Assessment
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Portfolio Risk Level</span>
                                <Badge className={getRiskLevel().color}>{getRiskLevel().level}</Badge>
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-2">
                                  <span>Volatility (30 day)</span>
                                  <span>12.3%</span>
                                </div>
                                <Progress value={12.3} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-2">
                                  <span>Correlation to S&P 500</span>
                                  <span>0.45</span>
                                </div>
                                <Progress value={45} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-2">
                                  <span>Value at Risk (1%)</span>
                                  <span className="text-red-600">-8.7%</span>
                                </div>
                                <Progress value={8.7} className="h-2 bg-red-100" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <BarChart3 className="h-4 w-4" />
                              Allocation Analysis
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between text-sm mb-2">
                                  <span>Gold Allocation</span>
                                  <span>{formatOz((totalGoldHoldings * 2456.80 / totalBalance) * 100, 1)}%</span>
                                </div>
                                <Progress value={((totalGoldHoldings * 2456.80 / totalBalance) * 100)} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-2">
                                  <span>Silver Allocation</span>
                                  <span>{formatOz((totalSilverHoldings * 31.24 / totalBalance) * 100, 1)}%</span>
                                </div>
                                <Progress value={((totalSilverHoldings * 31.24 / totalBalance) * 100)} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-2">
                                  <span>Platinum Allocation</span>
                                  <span>{formatOz((totalPlatinumHoldings * 952.10 / totalBalance) * 100, 1)}%</span>
                                </div>
                                <Progress value={((totalPlatinumHoldings * 952.10 / totalBalance) * 100)} className="h-2" />
                              </div>
                              <div className="mt-4 p-3 bg-muted rounded-lg">
                                <div className="flex items-center gap-2 text-sm">
                                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                  <span>Your portfolio is concentrated in precious metals. Consider diversification.</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <LineChart className="h-4 w-4" />
                            Performance Metrics
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-4 md:grid-cols-4">
                            <div className="text-center p-4 border rounded-lg">
                              <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                              <div className="text-2xl font-bold text-green-600">1.24</div>
                            </div>
                            <div className="text-center p-4 border rounded-lg">
                              <div className="text-sm text-muted-foreground">Beta</div>
                              <div className="text-2xl font-bold">0.68</div>
                            </div>
                            <div className="text-center p-4 border rounded-lg">
                              <div className="text-sm text-muted-foreground">Max Drawdown</div>
                              <div className="text-2xl font-bold text-red-600">-5.8%</div>
                            </div>
                            <div className="text-center p-4 border rounded-lg">
                              <div className="text-sm text-muted-foreground">Alpha</div>
                              <div className="text-2xl font-bold text-green-600">+2.3%</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="recommendations" className="mt-6">
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="h-4 w-4" />
                            AI-Powered Investment Insights
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {getRecommendations().map((rec, index) => (
                              <div key={index} className="p-4 border rounded-lg">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <Badge variant="outline" className="mb-2">{rec.type}</Badge>
                                    <h4 className="font-semibold">{rec.title}</h4>
                                  </div>
                                  <Badge variant={rec.priority === 'High' ? 'destructive' : rec.priority === 'Medium' ? 'default' : 'secondary'}>
                                    {rec.priority}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                                <Button variant="outline" size="sm">
                                  {rec.action}
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4" />
                              Market Sentiment
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Gold Sentiment</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                  <span className="text-sm font-semibold text-green-600">Bullish</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Silver Sentiment</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                  <span className="text-sm font-semibold text-yellow-600">Neutral</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Platinum Sentiment</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                  <span className="text-sm font-semibold text-green-600">Bullish</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Award className="h-4 w-4" />
                              Portfolio Score
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-center">
                              <div className="text-4xl font-bold text-green-600 mb-2">8.5/10</div>
                              <p className="text-sm text-muted-foreground mb-4">Excellent diversification and risk management</p>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Diversification</span>
                                  <span className="font-semibold">9/10</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Risk Management</span>
                                  <span className="font-semibold">8/10</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Performance</span>
                                  <span className="font-semibold">8.5/10</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="tools" className="mt-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Calculator className="h-4 w-4" />
                            Investment Calculator
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Dialog open={calculatorDialogOpen} onOpenChange={setCalculatorDialogOpen}>
                            <DialogTrigger asChild>
                              <Button className="w-full">
                                <Calculator className="h-4 w-4 mr-2" />
                                Open Calculator
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Investment Growth Calculator</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                  <div>
                                    <Label>Initial Investment ($)</Label>
                                    <Input
                                      type="number"
                                      value={calculatorForm.initialInvestment}
                                      onChange={(e) => setCalculatorForm({...calculatorForm, initialInvestment: e.target.value})}
                                      placeholder="10000"
                                    />
                                  </div>
                                  <div>
                                    <Label>Monthly Contribution ($)</Label>
                                    <Input
                                      type="number"
                                      value={calculatorForm.monthlyContribution}
                                      onChange={(e) => setCalculatorForm({...calculatorForm, monthlyContribution: e.target.value})}
                                      placeholder="1000"
                                    />
                                  </div>
                                  <div>
                                    <Label>Time Horizon (years)</Label>
                                    <Input
                                      type="number"
                                      value={calculatorForm.timeHorizon}
                                      onChange={(e) => setCalculatorForm({...calculatorForm, timeHorizon: e.target.value})}
                                      placeholder="10"
                                    />
                                  </div>
                                  <div>
                                    <Label>Expected Annual Return (%)</Label>
                                    <Input
                                      type="number"
                                      value={calculatorForm.expectedReturn}
                                      onChange={(e) => setCalculatorForm({...calculatorForm, expectedReturn: e.target.value})}
                                      placeholder="8"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <div className="p-6 border rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                                    <h4 className="font-semibold mb-4">Projection Results</h4>
                                    <div className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-sm">Future Value:</span>
                                        <span className="font-bold text-lg text-green-600">
                                          ${parseFloat(calculateInvestmentProjection()).toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm">Total Invested:</span>
                                        <span className="font-semibold">
                                          ${((parseFloat(calculatorForm.initialInvestment) || 0) + 
                                            (parseFloat(calculatorForm.monthlyContribution) || 0) * 12 * 
                                            (parseFloat(calculatorForm.timeHorizon) || 0)).toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm">Total Growth:</span>
                                        <span className="font-semibold text-green-600">
                                          ${(parseFloat(calculateInvestmentProjection()) - 
                                            (parseFloat(calculatorForm.initialInvestment) || 0) - 
                                            (parseFloat(calculatorForm.monthlyContribution) || 0) * 12 * 
                                            (parseFloat(calculatorForm.timeHorizon) || 0)).toLocaleString()}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    * This is a simplified calculation for illustrative purposes only. 
                                    Actual returns may vary and past performance does not guarantee future results.
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <div className="mt-4 p-3 bg-muted rounded-lg">
                            <p className="text-sm">Calculate potential returns based on your investment strategy and timeline.</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <RefreshCw className="h-4 w-4" />
                            Portfolio Rebalancing
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Dialog open={rebalanceDialogOpen} onOpenChange={setRebalanceDialogOpen}>
                            <DialogTrigger asChild>
                              <Button className="w-full" variant="outline">
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Rebalance Portfolio
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Portfolio Rebalancing Tool</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-3">
                                  <div>
                                    <Label>Target Gold (%)</Label>
                                    <Input
                                      type="number"
                                      value={rebalanceSettings.targetGold}
                                      onChange={(e) => setRebalanceSettings({...rebalanceSettings, targetGold: e.target.value})}
                                    />
                                  </div>
                                  <div>
                                    <Label>Target Silver (%)</Label>
                                    <Input
                                      type="number"
                                      value={rebalanceSettings.targetSilver}
                                      onChange={(e) => setRebalanceSettings({...rebalanceSettings, targetSilver: e.target.value})}
                                    />
                                  </div>
                                  <div>
                                    <Label>Target Platinum (%)</Label>
                                    <Input
                                      type="number"
                                      value={rebalanceSettings.targetPlatinum}
                                      onChange={(e) => setRebalanceSettings({...rebalanceSettings, targetPlatinum: e.target.value})}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label>Rebalance Threshold (%)</Label>
                                  <Input
                                    type="number"
                                    value={rebalanceSettings.rebalanceThreshold}
                                    onChange={(e) => setRebalanceSettings({...rebalanceSettings, rebalanceThreshold: e.target.value})}
                                    placeholder="5"
                                  />
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Trigger rebalancing when allocation deviates by this percentage
                                  </p>
                                </div>
                                <Button onClick={handlePortfolioRebalance} className="w-full">
                                  Analyze Rebalancing Needs
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <div className="mt-4 p-3 bg-muted rounded-lg">
                            <p className="text-sm">Automatically rebalance your portfolio to maintain target allocations.</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Price Alerts & Watchlist
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <Dialog open={priceAlertsDialogOpen} onOpenChange={setPriceAlertsDialogOpen}>
                              <DialogTrigger asChild>
                                <Button variant="outline" className="w-full justify-start">
                                  <Bell className="h-4 w-4 mr-2" />
                                  Set Price Alerts
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Set Price Alerts</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label>Gold Price Alert ($/oz)</Label>
                                    <Input
                                      type="number"
                                      placeholder="e.g., 2500"
                                      value={priceAlerts.goldPrice}
                                      onChange={(e) => setPriceAlerts({...priceAlerts, goldPrice: e.target.value})}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Get notified when gold reaches this price
                                    </p>
                                  </div>
                                  <div>
                                    <Label>Silver Price Alert ($/oz)</Label>
                                    <Input
                                      type="number"
                                      placeholder="e.g., 32"
                                      value={priceAlerts.silverPrice}
                                      onChange={(e) => setPriceAlerts({...priceAlerts, silverPrice: e.target.value})}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Get notified when silver reaches this price
                                    </p>
                                  </div>
                                  <div>
                                    <Label>Platinum Price Alert ($/oz)</Label>
                                    <Input
                                      type="number"
                                      placeholder="e.g., 1000"
                                      value={priceAlerts.platinumPrice}
                                      onChange={(e) => setPriceAlerts({...priceAlerts, platinumPrice: e.target.value})}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Get notified when platinum reaches this price
                                    </p>
                                  </div>
                                  <Separator />
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                      <Label>Email Alerts</Label>
                                      <Switch
                                        checked={priceAlerts.emailAlerts}
                                        onCheckedChange={(checked) => setPriceAlerts({...priceAlerts, emailAlerts: checked})}
                                      />
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <Label>Push Notifications</Label>
                                      <Switch
                                        checked={priceAlerts.pushNotifications}
                                        onCheckedChange={(checked) => setPriceAlerts({...priceAlerts, pushNotifications: checked})}
                                      />
                                    </div>
                                  </div>
                                  <Button onClick={handleSavePriceAlerts} className="w-full">
                                    Save Price Alerts
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>

                            <Dialog open={watchlistDialogOpen} onOpenChange={setWatchlistDialogOpen}>
                              <DialogTrigger asChild>
                                <Button variant="outline" className="w-full justify-start">
                                  <Eye className="h-4 w-4 mr-2" />
                                  Manage Watchlist
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Manage Watchlist</DialogTitle>
                                </DialogHeader>
                                <Tabs defaultValue="watchlist" className="w-full">
                                  <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="watchlist">My Watchlist ({wishlistItems.length})</TabsTrigger>
                                    <TabsTrigger value="products">Add Products</TabsTrigger>
                                  </TabsList>
                                  
                                  <TabsContent value="watchlist" className="space-y-4 mt-4">
                                    {wishlistItems.length === 0 ? (
                                      <div className="text-center py-8">
                                        <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-muted-foreground">Your watchlist is empty</h3>
                                        <p className="text-sm text-muted-foreground">Add products to track them here</p>
                                      </div>
                                    ) : (
                                      <div className="space-y-3">
                                        {wishlistItems.map((item) => (
                                          <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center gap-4">
                                              {item.products?.image_url && (
                                                <img 
                                                  src={item.products.image_url} 
                                                  alt={item.products.name}
                                                  className="w-16 h-16 object-cover rounded"
                                                />
                                              )}
                                              <div>
                                                <h4 className="font-semibold">{item.products?.name}</h4>
                                                <p className="text-sm text-muted-foreground">
                                                  ${formatCurrency(item.products?.price_usd || 0)}
                                                </p>
                                              </div>
                                            </div>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => handleRemoveFromWishlist(item.id)}
                                            >
                                              <X className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </TabsContent>
                                  
                                  <TabsContent value="products" className="space-y-4 mt-4">
                                    {products.length === 0 ? (
                                      <div className="text-center py-8">
                                        <p className="text-muted-foreground">No products available</p>
                                      </div>
                                    ) : (
                                      <div className="grid gap-4 md:grid-cols-2">
                                        {products.map((product) => {
                                          const inWishlist = wishlistItems.some(item => item.product_id === product.id);
                                          return (
                                            <div key={product.id} className="border rounded-lg p-4">
                                              {product.image_url && (
                                                <img 
                                                  src={product.image_url} 
                                                  alt={product.name}
                                                  className="w-full h-32 object-cover rounded mb-3"
                                                />
                                              )}
                                              <h4 className="font-semibold mb-1">{product.name}</h4>
                                              <p className="text-sm text-muted-foreground mb-2">
                                                ${formatCurrency(product.price_usd)}
                                              </p>
                                              <Button
                                                size="sm"
                                                variant={inWishlist ? "secondary" : "outline"}
                                                className="w-full"
                                                onClick={() => inWishlist ? null : handleAddToWishlist(product.id)}
                                                disabled={inWishlist}
                                              >
                                                {inWishlist ? "In Watchlist" : "Add to Watchlist"}
                                              </Button>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </TabsContent>
                                </Tabs>
                              </DialogContent>
                            </Dialog>
                            
                            <div className="p-3 bg-muted rounded-lg">
                              <p className="text-sm">Get notified when precious metals hit your target prices.</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Educational Resources
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <Dialog open={guidesDialogOpen} onOpenChange={setGuidesDialogOpen}>
                              <DialogTrigger asChild>
                                <Button variant="outline" className="w-full justify-start">
                                  <BookOpen className="h-4 w-4 mr-2" />
                                  Investment Guides
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Investment Guides</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-6">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Getting Started with Gold Investment</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                      <p className="text-sm text-muted-foreground">
                                        Gold has been a store of value for thousands of years. Learn the fundamentals of investing in physical gold.
                                      </p>
                                      <div className="space-y-2">
                                        <h4 className="font-semibold text-sm">Key Points:</h4>
                                        <ul className="list-disc list-inside text-sm space-y-1">
                                          <li>Gold serves as a hedge against inflation</li>
                                          <li>Physical gold provides portfolio diversification</li>
                                          <li>Consider purity levels (24K, 22K, etc.)</li>
                                          <li>Storage and insurance are important factors</li>
                                        </ul>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Silver Investment Strategies</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                      <p className="text-sm text-muted-foreground">
                                        Silver offers both industrial demand and investment value. Discover why silver is often called "poor man's gold".
                                      </p>
                                      <div className="space-y-2">
                                        <h4 className="font-semibold text-sm">Key Points:</h4>
                                        <ul className="list-disc list-inside text-sm space-y-1">
                                          <li>Higher volatility than gold presents opportunities</li>
                                          <li>Strong industrial demand from technology sector</li>
                                          <li>Lower entry price point for new investors</li>
                                          <li>Gold-to-silver ratio can signal market opportunities</li>
                                        </ul>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Platinum Group Metals</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                      <p className="text-sm text-muted-foreground">
                                        Platinum is rarer than gold and has unique industrial applications. Learn about this premium precious metal.
                                      </p>
                                      <div className="space-y-2">
                                        <h4 className="font-semibold text-sm">Key Points:</h4>
                                        <ul className="list-disc list-inside text-sm space-y-1">
                                          <li>Rarer than gold with limited supply</li>
                                          <li>Critical for automotive catalytic converters</li>
                                          <li>Price correlates with industrial production</li>
                                          <li>Potential for significant price appreciation</li>
                                        </ul>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Portfolio Allocation Best Practices</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                      <p className="text-sm text-muted-foreground">
                                        Proper allocation is key to managing risk and optimizing returns in precious metals investing.
                                      </p>
                                      <div className="space-y-2">
                                        <h4 className="font-semibold text-sm">Recommended Allocations:</h4>
                                        <ul className="list-disc list-inside text-sm space-y-1">
                                          <li>Conservative: 5-10% of total portfolio</li>
                                          <li>Moderate: 10-20% of total portfolio</li>
                                          <li>Aggressive: 20-30% of total portfolio</li>
                                          <li>Rebalance quarterly to maintain targets</li>
                                        </ul>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              </DialogContent>
                            </Dialog>

                            <Dialog open={marketAnalysisDialogOpen} onOpenChange={setMarketAnalysisDialogOpen}>
                              <DialogTrigger asChild>
                                <Button variant="outline" className="w-full justify-start">
                                  <TrendingUp className="h-4 w-4 mr-2" />
                                  Market Analysis
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Market Analysis & Trends</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-6">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-green-600" />
                                        Current Market Overview
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div className="grid gap-4 md:grid-cols-3">
                                        <div className="p-4 bg-muted rounded-lg">
                                          <div className="text-sm text-muted-foreground mb-1">Gold (XAU/USD)</div>
                                          <div className="text-2xl font-bold">$2,456.80</div>
                                          <div className="text-sm text-green-600">+2.3% (1M)</div>
                                        </div>
                                        <div className="p-4 bg-muted rounded-lg">
                                          <div className="text-sm text-muted-foreground mb-1">Silver (XAG/USD)</div>
                                          <div className="text-2xl font-bold">$31.24</div>
                                          <div className="text-sm text-red-600">-0.8% (1M)</div>
                                        </div>
                                        <div className="p-4 bg-muted rounded-lg">
                                          <div className="text-sm text-muted-foreground mb-1">Platinum (XPT/USD)</div>
                                          <div className="text-2xl font-bold">$952.10</div>
                                          <div className="text-sm text-green-600">+1.5% (1M)</div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Market Drivers</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-3">
                                        <div className="flex gap-3">
                                          <Badge variant="default">Monetary Policy</Badge>
                                          <p className="text-sm">
                                            Central bank decisions and interest rate changes significantly impact precious metals prices.
                                          </p>
                                        </div>
                                        <div className="flex gap-3">
                                          <Badge variant="default">Inflation</Badge>
                                          <p className="text-sm">
                                            Gold historically performs well during periods of high inflation as a store of value.
                                          </p>
                                        </div>
                                        <div className="flex gap-3">
                                          <Badge variant="default">Geopolitical Risk</Badge>
                                          <p className="text-sm">
                                            Global uncertainty drives demand for safe-haven assets like gold and silver.
                                          </p>
                                        </div>
                                        <div className="flex gap-3">
                                          <Badge variant="default">Dollar Strength</Badge>
                                          <p className="text-sm">
                                            Precious metals typically have an inverse relationship with the US dollar.
                                          </p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Technical Indicators</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <div>
                                          <div className="flex justify-between mb-2">
                                            <span className="text-sm font-medium">Gold Support/Resistance</span>
                                          </div>
                                          <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="p-2 bg-red-50 dark:bg-red-950 rounded">
                                              <div className="text-muted-foreground">Support: $2,420</div>
                                            </div>
                                            <div className="p-2 bg-green-50 dark:bg-green-950 rounded">
                                              <div className="text-muted-foreground">Resistance: $2,480</div>
                                            </div>
                                          </div>
                                        </div>
                                        <div>
                                          <div className="flex justify-between mb-2">
                                            <span className="text-sm font-medium">Silver Support/Resistance</span>
                                          </div>
                                          <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="p-2 bg-red-50 dark:bg-red-950 rounded">
                                              <div className="text-muted-foreground">Support: $30.50</div>
                                            </div>
                                            <div className="p-2 bg-green-50 dark:bg-green-950 rounded">
                                              <div className="text-muted-foreground">Resistance: $32.00</div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Analyst Outlook</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-3 text-sm">
                                        <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                                          <div className="font-semibold mb-1">Bullish on Gold</div>
                                          <p className="text-muted-foreground">
                                            70% of analysts expect gold to reach $2,600+ in Q4 2025 due to continued inflation concerns and geopolitical tensions.
                                          </p>
                                        </div>
                                        <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                                          <div className="font-semibold mb-1">Neutral on Silver</div>
                                          <p className="text-muted-foreground">
                                            Mixed outlook on silver with industrial demand offsetting investment demand concerns.
                                          </p>
                                        </div>
                                        <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                                          <div className="font-semibold mb-1">Bullish on Platinum</div>
                                          <p className="text-muted-foreground">
                                            Supply constraints and recovering auto industry point to potential upside for platinum.
                                          </p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            <div className="p-3 bg-muted rounded-lg">
                              <p className="text-sm">Learn about precious metals investing and market trends.</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="actions" className="mt-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Account Actions
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Dialog open={depositDialogOpen} onOpenChange={setDepositDialogOpen}>
                            <DialogTrigger asChild>
                              <Button className="w-full justify-start" variant="outline">
                                <Plus className="h-4 w-4 mr-2" />
                                Request Deposit
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Request Deposit</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="deposit-amount">Amount ($)</Label>
                                  <Input
                                    id="deposit-amount"
                                    type="number"
                                    placeholder="0.00"
                                    value={depositForm.amount}
                                    onChange={(e) => setDepositForm({...depositForm, amount: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="deposit-method">Deposit Method</Label>
                                  <Select value={depositForm.method} onValueChange={(value) => setDepositForm({...depositForm, method: value})}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                      <SelectItem value="wire">Wire Transfer</SelectItem>
                                      <SelectItem value="check">Check</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="deposit-notes">Notes (Optional)</Label>
                                  <Textarea
                                    id="deposit-notes"
                                    placeholder="Any additional information..."
                                    value={depositForm.notes}
                                    onChange={(e) => setDepositForm({...depositForm, notes: e.target.value})}
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" onClick={() => setDepositDialogOpen(false)} className="flex-1">
                                    Cancel
                                  </Button>
                                  <Button onClick={handleDepositRequest} className="flex-1">
                                    Submit Request
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Dialog open={withdrawalDialogOpen} onOpenChange={setWithdrawalDialogOpen}>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Request Metal Withdrawal</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
...
                                <div className="flex gap-2">
                                  <Button variant="outline" onClick={() => setWithdrawalDialogOpen(false)} className="flex-1">
                                    Cancel
                                  </Button>
                                  <Button onClick={handleWithdrawalRequest} className="flex-1">
                                    Submit Request
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Dialog open={reportsDialogOpen} onOpenChange={setReportsDialogOpen}>
                            <DialogTrigger asChild>
                              <Button className="w-full justify-start" variant="outline">
                                <BarChart3 className="h-4 w-4 mr-2" />
                                View Detailed Reports
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Detailed Portfolio Reports</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                  <Card>
                                    <CardContent className="p-4">
                                      <h4 className="font-semibold mb-2">Performance Summary</h4>
                                      <div className="space-y-2">
                                        <div className="flex justify-between">
                                          <span className="text-sm">Total Return</span>
                                          <span className="text-green-600 font-semibold">+28.4%</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm">Annual Return</span>
                                          <span className="text-green-600 font-semibold">+15.2%</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm">Best Month</span>
                                          <span className="text-green-600 font-semibold">+8.7%</span>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardContent className="p-4">
                                      <h4 className="font-semibold mb-2">Risk Metrics</h4>
                                      <div className="space-y-2">
                                        <div className="flex justify-between">
                                          <span className="text-sm">Volatility</span>
                                          <span className="font-semibold">12.3%</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm">Sharpe Ratio</span>
                                          <span className="font-semibold">1.24</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm">Max Drawdown</span>
                                          <span className="text-red-600 font-semibold">-5.8%</span>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                                <div className="border-t pt-4">
                                  <h4 className="font-semibold mb-3">Available Reports</h4>
                                  <div className="space-y-2">
                                    <Button variant="outline" className="w-full justify-between">
                                      <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Monthly Performance Report
                                      </div>
                                      <Download className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" className="w-full justify-between">
                                      <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Tax Summary Report
                                      </div>
                                      <Download className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" className="w-full justify-between">
                                      <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Holdings Analysis
                                      </div>
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button className="w-full justify-start" variant="outline" onClick={handleDownloadStatements}>
                            <Download className="h-4 w-4 mr-2" />
                            Download Statements
                          </Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Bell className="h-4 w-4" />
                            Notifications & Support
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Dialog open={alertsDialogOpen} onOpenChange={setAlertsDialogOpen}>
                            <DialogTrigger asChild>
                              <Button className="w-full justify-start" variant="outline">
                                <Bell className="h-4 w-4 mr-2" />
                                Manage Alerts
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Manage Notifications</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-6">
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <Label htmlFor="price-alerts" className="font-medium">Price Alerts</Label>
                                      <p className="text-sm text-muted-foreground">Get notified of significant price changes</p>
                                    </div>
                                    <Switch 
                                      id="price-alerts"
                                      checked={alertSettings.priceAlerts}
                                      onCheckedChange={(checked) => setAlertSettings({...alertSettings, priceAlerts: checked})}
                                    />
                                  </div>
                                  <Separator />
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <Label htmlFor="account-updates" className="font-medium">Account Updates</Label>
                                      <p className="text-sm text-muted-foreground">Transaction confirmations and account changes</p>
                                    </div>
                                    <Switch 
                                      id="account-updates"
                                      checked={alertSettings.accountUpdates}
                                      onCheckedChange={(checked) => setAlertSettings({...alertSettings, accountUpdates: checked})}
                                    />
                                  </div>
                                  <Separator />
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <Label htmlFor="market-news" className="font-medium">Market News</Label>
                                      <p className="text-sm text-muted-foreground">Important market developments and analysis</p>
                                    </div>
                                    <Switch 
                                      id="market-news"
                                      checked={alertSettings.marketNews}
                                      onCheckedChange={(checked) => setAlertSettings({...alertSettings, marketNews: checked})}
                                    />
                                  </div>
                                  <Separator />
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <Label htmlFor="promotions" className="font-medium">Promotions</Label>
                                      <p className="text-sm text-muted-foreground">Special offers and promotions</p>
                                    </div>
                                    <Switch 
                                      id="promotions"
                                      checked={alertSettings.promotions}
                                      onCheckedChange={(checked) => setAlertSettings({...alertSettings, promotions: checked})}
                                    />
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" onClick={() => setAlertsDialogOpen(false)} className="flex-1">
                                    Cancel
                                  </Button>
                                  <Button onClick={handleAlertSettingsUpdate} className="flex-1">
                                    Save Settings
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Dialog open={supportDialogOpen} onOpenChange={setSupportDialogOpen}>
                            <DialogTrigger asChild>
                              <Button className="w-full justify-start" variant="outline">
                                <Phone className="h-4 w-4 mr-2" />
                                Contact Support
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Contact Support</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="support-subject">Subject</Label>
                                  <Input
                                    id="support-subject"
                                    placeholder="Brief description of your issue"
                                    value={supportForm.subject}
                                    onChange={(e) => setSupportForm({...supportForm, subject: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="support-category">Category</Label>
                                  <Select value={supportForm.category} onValueChange={(value) => setSupportForm({...supportForm, category: value})}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="general">General Inquiry</SelectItem>
                                      <SelectItem value="account">Account Issues</SelectItem>
                                      <SelectItem value="technical">Technical Support</SelectItem>
                                      <SelectItem value="trading">Trading Questions</SelectItem>
                                      <SelectItem value="billing">Billing & Payments</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="support-message">Message</Label>
                                  <Textarea
                                    id="support-message"
                                    placeholder="Please describe your issue in detail..."
                                    className="min-h-[100px]"
                                    value={supportForm.message}
                                    onChange={(e) => setSupportForm({...supportForm, message: e.target.value})}
                                  />
                                </div>
                                <div className="bg-muted p-3 rounded-lg">
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Mail className="h-4 w-4" />
                                    <span>We typically respond within 24 hours</span>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" onClick={() => setSupportDialogOpen(false)} className="flex-1">
                                    Cancel
                                  </Button>
                                  <Button onClick={handleSupportSubmit} className="flex-1">
                                    Send Message
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
                            <DialogTrigger asChild>
                              <Button className="w-full justify-start" variant="outline">
                                <Settings className="h-4 w-4 mr-2" />
                                Account Settings
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Account Settings</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-6">
                                <div>
                                  <h4 className="font-semibold mb-3">Profile Information</h4>
                                  <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                      <Label>Full Name</Label>
                                      <Input value={profile?.full_name || ''} disabled />
                                    </div>
                                    <div>
                                      <Label>Email</Label>
                                      <Input value={user?.email || ''} disabled />
                                    </div>
                                    <div>
                                      <Label>Phone</Label>
                                      <Input value={profile?.phone || 'Not set'} disabled />
                                    </div>
                                    <div>
                                      <Label>Member Since</Label>
                                      <Input value={new Date(profile?.created_at).toLocaleDateString()} disabled />
                                    </div>
                                  </div>
                                </div>
                                
                                <Separator />
                                
                                <div>
                                  <h4 className="font-semibold mb-3">Security Settings</h4>
                                  <div className="space-y-3">
                                    <Button variant="outline" className="w-full justify-start">
                                      <Settings className="h-4 w-4 mr-2" />
                                      Change Password
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                      <Settings className="h-4 w-4 mr-2" />
                                      Enable Two-Factor Authentication
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                      <Settings className="h-4 w-4 mr-2" />
                                      Update Security Questions
                                    </Button>
                                  </div>
                                </div>

                                <Separator />
                                
                                <div>
                                  <h4 className="font-semibold mb-3">Preferences</h4>
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <Label className="font-medium">Dark Mode</Label>
                                        <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
                                      </div>
                                      <Switch />
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <Label className="font-medium">Email Notifications</Label>
                                        <p className="text-sm text-muted-foreground">Receive updates via email</p>
                                      </div>
                                      <Switch defaultChecked />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Dialog open={goalsDialogOpen} onOpenChange={setGoalsDialogOpen}>
                            <DialogTrigger asChild>
                              <Button className="w-full justify-start" variant="outline">
                                <Target className="h-4 w-4 mr-2" />
                                Set Investment Goals
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Set Investment Goals</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div>
                                    <Label htmlFor="gold-target">Gold Target (oz)</Label>
                                    <Input
                                      id="gold-target"
                                      type="number"
                                      placeholder="100"
                                      value={goalSettings.goldTarget}
                                      onChange={(e) => setGoalSettings({...goalSettings, goldTarget: e.target.value})}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="silver-target">Silver Target (oz)</Label>
                                    <Input
                                      id="silver-target"
                                      type="number"
                                      placeholder="500"
                                      value={goalSettings.silverTarget}
                                      onChange={(e) => setGoalSettings({...goalSettings, silverTarget: e.target.value})}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="portfolio-target">Portfolio Value Target ($)</Label>
                                  <Input
                                    id="portfolio-target"
                                    type="number"
                                    placeholder="15000000"
                                    value={goalSettings.portfolioTarget}
                                    onChange={(e) => setGoalSettings({...goalSettings, portfolioTarget: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="target-date">Target Date</Label>
                                  <Input
                                    id="target-date"
                                    type="date"
                                    value={goalSettings.targetDate}
                                    onChange={(e) => setGoalSettings({...goalSettings, targetDate: e.target.value})}
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" onClick={() => setGoalsDialogOpen(false)} className="flex-1">
                                    Cancel
                                  </Button>
                                  <Button onClick={handleGoalSettingsUpdate} className="flex-1">
                                    Save Goals
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Withdrawal Dialog - Available from any tab */}
        <Dialog open={withdrawalDialogOpen} onOpenChange={setWithdrawalDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Request Metal Withdrawal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 p-3 bg-muted rounded-lg text-sm">
                <div>
                  <p className="text-muted-foreground">Gold</p>
                  <p className="font-semibold">{formatOz(totalGoldHoldings)} oz</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Silver</p>
                  <p className="font-semibold">{formatOz(totalSilverHoldings)} oz</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Platinum</p>
                  <p className="font-semibold">{formatOz(totalPlatinumHoldings)} oz</p>
                </div>
              </div>

              <div>
                <Label htmlFor="withdrawal-type">Withdrawal Type</Label>
                <Select 
                  value={withdrawalForm.withdrawalType} 
                  onValueChange={(value) => setWithdrawalForm({...withdrawalForm, withdrawalType: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash (Sell metals and receive USD)</SelectItem>
                    <SelectItem value="physical">Physical Shipment (Ship metals to address)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="metal-type">Metal Type</Label>
                  <Select 
                    value={withdrawalForm.metalType} 
                    onValueChange={(value) => setWithdrawalForm({...withdrawalForm, metalType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="silver">Silver</SelectItem>
                      <SelectItem value="platinum">Platinum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount-oz">Amount (oz)</Label>
                  <Input
                    id="amount-oz"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={withdrawalForm.amountOz}
                    onChange={(e) => setWithdrawalForm({...withdrawalForm, amountOz: e.target.value})}
                  />
                </div>
              </div>

              {withdrawalForm.withdrawalType === 'physical' && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <p className="text-sm text-blue-900 dark:text-blue-100">
                        Shipping via <strong>freightease.online</strong> - You'll receive tracking information once processed
                      </p>
                    </div>
                    
                    <h4 className="font-semibold">Shipping Address</h4>
                    
                    <div>
                      <Label htmlFor="shipping-address">Street Address</Label>
                      <Input
                        id="shipping-address"
                        placeholder="123 Main Street"
                        value={withdrawalForm.shippingAddress}
                        onChange={(e) => setWithdrawalForm({...withdrawalForm, shippingAddress: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="shipping-city">City</Label>
                        <Input
                          id="shipping-city"
                          placeholder="New York"
                          value={withdrawalForm.shippingCity}
                          onChange={(e) => setWithdrawalForm({...withdrawalForm, shippingCity: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="shipping-state">State</Label>
                        <Input
                          id="shipping-state"
                          placeholder="NY"
                          value={withdrawalForm.shippingState}
                          onChange={(e) => setWithdrawalForm({...withdrawalForm, shippingState: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="shipping-zip">ZIP Code</Label>
                        <Input
                          id="shipping-zip"
                          placeholder="10001"
                          value={withdrawalForm.shippingZip}
                          onChange={(e) => setWithdrawalForm({...withdrawalForm, shippingZip: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="shipping-country">Country</Label>
                        <Input
                          id="shipping-country"
                          value={withdrawalForm.shippingCountry}
                          onChange={(e) => setWithdrawalForm({...withdrawalForm, shippingCountry: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setWithdrawalDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleWithdrawalRequest} className="flex-1">
                  Submit Request
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <p className="text-muted-foreground">{profile?.full_name || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Member Since</label>
                  <p className="text-muted-foreground">
                    {new Date(profile?.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Account Type</label>
                  <p className="text-muted-foreground">Standard User</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Portfolio Allocation Edit Dialog */}
        <Dialog open={editAllocationDialogOpen} onOpenChange={setEditAllocationDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Portfolio Allocation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="text-sm text-muted-foreground mb-4">
                Account: {editingAllocation?.account_number}
              </div>
              <div>
                <Label htmlFor="gold-pct">Gold (%)</Label>
                <Input
                  id="gold-pct"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={editingAllocation?.gold_percentage || 0}
                  onChange={(e) => setEditingAllocation({
                    ...editingAllocation,
                    gold_percentage: e.target.value
                  })}
                />
              </div>
              <div>
                <Label htmlFor="silver-pct">Silver (%)</Label>
                <Input
                  id="silver-pct"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={editingAllocation?.silver_percentage || 0}
                  onChange={(e) => setEditingAllocation({
                    ...editingAllocation,
                    silver_percentage: e.target.value
                  })}
                />
              </div>
              <div>
                <Label htmlFor="platinum-pct">Platinum (%)</Label>
                <Input
                  id="platinum-pct"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={editingAllocation?.platinum_percentage || 0}
                  onChange={(e) => setEditingAllocation({
                    ...editingAllocation,
                    platinum_percentage: e.target.value
                  })}
                />
              </div>
              <div>
                <Label htmlFor="cash-pct">Cash (%)</Label>
                <Input
                  id="cash-pct"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={editingAllocation?.cash_percentage || 0}
                  onChange={(e) => setEditingAllocation({
                    ...editingAllocation,
                    cash_percentage: e.target.value
                  })}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Total: {
                  (Number(editingAllocation?.gold_percentage || 0) + 
                   Number(editingAllocation?.silver_percentage || 0) + 
                   Number(editingAllocation?.platinum_percentage || 0) + 
                   Number(editingAllocation?.cash_percentage || 0)).toFixed(1)
                }% (must equal 100%)
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEditAllocationDialogOpen(false);
                    setEditingAllocation(null);
                  }} 
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveAllocation} className="flex-1">
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}