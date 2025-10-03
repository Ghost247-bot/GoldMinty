import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
  ChevronUp
} from 'lucide-react';

export default function UserDashboard() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [investmentAccounts, setInvestmentAccounts] = useState<any[]>([]);
  const [userBanners, setUserBanners] = useState<any[]>([]);
  const [expandedBanners, setExpandedBanners] = useState<Set<string>>(new Set());
  const [portfolioAllocations, setPortfolioAllocations] = useState<Map<string, any>>(new Map());
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
  
  // Form states
  const [depositForm, setDepositForm] = useState({
    amount: '',
    method: 'bank_transfer',
    notes: ''
  });
  const [withdrawalForm, setWithdrawalForm] = useState({
    amount: '',
    method: 'bank_transfer',
    notes: ''
  });
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

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchInvestmentAccounts();
      fetchUserBanners();
      checkAdminRole();
    }
  }, [user]);

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

  const handleWithdrawalRequest = async () => {
    if (!withdrawalForm.amount) {
      toast({ title: "Error", description: "Please enter withdrawal amount", variant: "destructive" });
      return;
    }
    
    if (Number(withdrawalForm.amount) > totalBalance) {
      toast({ title: "Error", description: "Insufficient funds for withdrawal", variant: "destructive" });
      return;
    }
    
    toast({
      title: "Withdrawal Request Submitted", 
      description: `Your withdrawal request for $${withdrawalForm.amount} has been submitted and is pending review.`
    });
    
    setWithdrawalDialogOpen(false);
    setWithdrawalForm({ amount: '', method: 'bank_transfer', notes: '' });
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
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-primary">GoldMint Dashboard</h1>
              <Badge variant="secondary">User</Badge>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {profile?.full_name || user?.email}
              </span>
              <Button variant="outline" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* User Banners */}
        {userBanners.length > 0 && (
          <div className="space-y-6 mb-8">
            {userBanners.map((banner) => {
              const isExpanded = expandedBanners.has(banner.id);
              return (
                <div
                  key={banner.id}
                  className={`relative overflow-hidden rounded-xl border shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer ${
                    banner.banner_type === 'error'
                      ? 'bg-gradient-to-r from-destructive/10 via-destructive/5 to-background border-destructive/20'
                      : banner.banner_type === 'warning'
                      ? 'bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-background border-amber-500/20'
                      : banner.banner_type === 'success'
                      ? 'bg-gradient-to-r from-success/10 via-success/5 to-background border-success/20'
                      : 'bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20'
                  }`}
                  onClick={() => toggleBannerExpansion(banner.id)}
                >
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 ${
                      banner.banner_type === 'error'
                        ? 'bg-gradient-to-b from-destructive to-destructive/70'
                        : banner.banner_type === 'warning'
                        ? 'bg-gradient-to-b from-amber-500 to-amber-600'
                        : banner.banner_type === 'success'
                        ? 'bg-gradient-to-b from-success to-success/70'
                        : 'bg-gradient-to-b from-primary to-gold'
                    }`}
                  />
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              banner.banner_type === 'error'
                                ? 'bg-destructive/20 text-destructive'
                                : banner.banner_type === 'warning'
                                ? 'bg-amber-500/20 text-amber-600'
                                : banner.banner_type === 'success'
                                ? 'bg-success/20 text-success'
                                : 'bg-primary/20 text-primary'
                            }`}
                          >
                            {banner.banner_type === 'error' ? (
                              <AlertTriangle className="h-5 w-5" />
                            ) : banner.banner_type === 'warning' ? (
                              <AlertCircle className="h-5 w-5" />
                            ) : banner.banner_type === 'success' ? (
                              <Award className="h-5 w-5" />
                            ) : (
                              <Lightbulb className="h-5 w-5" />
                            )}
                          </div>
                          <h3 className="font-display font-bold text-xl text-foreground">
                            {banner.title}
                          </h3>
                        </div>
                        
                        {isExpanded && (
                          <div className="space-y-3 mt-4 pl-11 animate-fade-in">
                            <p className="text-muted-foreground leading-relaxed">
                              {banner.message}
                            </p>
                            {banner.expires_at && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                  Expires: {new Date(banner.expires_at).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-1 rounded transition-transform duration-300 ${
                            isExpanded ? 'rotate-180' : ''
                          } ${
                            banner.banner_type === 'error'
                              ? 'text-destructive'
                              : banner.banner_type === 'warning'
                              ? 'text-amber-600'
                              : banner.banner_type === 'success'
                              ? 'text-success'
                              : 'text-primary'
                          }`}
                        >
                          <ChevronDown className="h-5 w-5" />
                        </div>
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
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-7">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="transactions">Transactions</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="analysis">Risk Analysis</TabsTrigger>
                    <TabsTrigger value="recommendations">AI Insights</TabsTrigger>
                    <TabsTrigger value="tools">Tools</TabsTrigger>
                    <TabsTrigger value="actions">Actions</TabsTrigger>
                  </TabsList>

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
                                       <span>{goldPct}%</span>
                                     </div>
                                     <Progress value={goldPct} className="h-2" />
                                   </div>
                                   <div>
                                     <div className="flex justify-between text-sm mb-1">
                                       <span>Cash</span>
                                       <span>{cashPct}%</span>
                                     </div>
                                     <Progress value={cashPct} className="h-2" />
                                   </div>
                                   <div>
                                     <div className="flex justify-between text-sm mb-1">
                                       <span>Silver</span>
                                       <span>{silverPct}%</span>
                                     </div>
                                     <Progress value={silverPct} className="h-2" />
                                   </div>
                                   <div>
                                     <div className="flex justify-between text-sm mb-1">
                                       <span>Platinum</span>
                                       <span>{platinumPct}%</span>
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
                              <TableRow>
                                <TableCell className="font-medium">Oct 15, 2024</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                                    Buy
                                  </div>
                                </TableCell>
                                <TableCell>Gold</TableCell>
                                <TableCell>2.5000 oz</TableCell>
                                <TableCell>$2,450.00</TableCell>
                                <TableCell>
                                  <Badge variant="default">Completed</Badge>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Oct 12, 2024</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                                    Sell
                                  </div>
                                </TableCell>
                                <TableCell>Silver</TableCell>
                                <TableCell>15.0000 oz</TableCell>
                                <TableCell>$31.25</TableCell>
                                <TableCell>
                                  <Badge variant="default">Completed</Badge>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Oct 10, 2024</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-yellow-600" />
                                    Pending
                                  </div>
                                </TableCell>
                                <TableCell>Platinum</TableCell>
                                <TableCell>0.5000 oz</TableCell>
                                <TableCell>$950.00</TableCell>
                                <TableCell>
                                  <Badge variant="secondary">Processing</Badge>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

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
                            <Button variant="outline" className="w-full justify-start">
                              <Bell className="h-4 w-4 mr-2" />
                              Set Price Alerts
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                              <Eye className="h-4 w-4 mr-2" />
                              Manage Watchlist
                            </Button>
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
                            <Button variant="outline" className="w-full justify-start">
                              <BookOpen className="h-4 w-4 mr-2" />
                              Investment Guides
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                              <TrendingUp className="h-4 w-4 mr-2" />
                              Market Analysis
                            </Button>
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
                            <DialogTrigger asChild>
                              <Button className="w-full justify-start" variant="outline">
                                <Minus className="h-4 w-4 mr-2" />
                                Request Withdrawal
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Request Withdrawal</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="p-3 bg-muted rounded-lg">
                                  <p className="text-sm text-muted-foreground">
                                    Available Balance: <span className="font-semibold">${formatCurrency(totalBalance)}</span>
                                  </p>
                                </div>
                                <div>
                                  <Label htmlFor="withdrawal-amount">Amount ($)</Label>
                                  <Input
                                    id="withdrawal-amount"
                                    type="number"
                                    placeholder="0.00"
                                    max={totalBalance}
                                    value={withdrawalForm.amount}
                                    onChange={(e) => setWithdrawalForm({...withdrawalForm, amount: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="withdrawal-method">Withdrawal Method</Label>
                                  <Select value={withdrawalForm.method} onValueChange={(value) => setWithdrawalForm({...withdrawalForm, method: value})}>
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
                                  <Label htmlFor="withdrawal-notes">Notes (Optional)</Label>
                                  <Textarea
                                    id="withdrawal-notes"
                                    placeholder="Any additional information..."
                                    value={withdrawalForm.notes}
                                    onChange={(e) => setWithdrawalForm({...withdrawalForm, notes: e.target.value})}
                                  />
                                </div>
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