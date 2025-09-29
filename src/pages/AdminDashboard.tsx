import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Users, Shield, Database, Activity, Wallet, Plus, MessageSquare, X, Calendar, TrendingUp, Settings, Download, BookOpen, Upload } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { TransactionDialog, AIInsightDialog } from '@/components/PortfolioDialogs';
import { BulkTransactionUpload } from '@/components/BulkTransactionUpload';
import BulkProductUpload from '@/components/BulkProductUpload';

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]); // All users for dropdowns
  const [usersLoading, setUsersLoading] = useState(false);
  const [investmentAccounts, setInvestmentAccounts] = useState<any[]>([]);
  const [userBanners, setUserBanners] = useState<any[]>([]);
  
  // Portfolio management states
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [userTransactions, setUserTransactions] = useState<any[]>([]);
  const [userPerformanceMetrics, setUserPerformanceMetrics] = useState<any>(null);
  const [userRiskProfile, setUserRiskProfile] = useState<any>(null);
  const [userAIInsights, setUserAIInsights] = useState<any[]>([]);
  const [userToolSettings, setUserToolSettings] = useState<any>(null);
  const [userActionPermissions, setUserActionPermissions] = useState<any>(null);
  
  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEditBannerDialogOpen, setIsEditBannerDialogOpen] = useState(false);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [isPerformanceDialogOpen, setIsPerformanceDialogOpen] = useState(false);
  const [isRiskDialogOpen, setIsRiskDialogOpen] = useState(false);
  const [isInsightDialogOpen, setIsInsightDialogOpen] = useState(false);
  const [isBulkUploadDialogOpen, setIsBulkUploadDialogOpen] = useState(false);
  const [isBulkProductUploadDialogOpen, setIsBulkProductUploadDialogOpen] = useState(false);
  const [isEditProductDialogOpen, setIsEditProductDialogOpen] = useState(false);
  
  // Products management states
  const [products, setProducts] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [deletingAllProducts, setDeletingAllProducts] = useState(false);
  const [productFormData, setProductFormData] = useState({
    name: '',
    description: '',
    price_usd: '0.00',
    weight: '',
    metal_type: 'gold',
    brand: '',
    purity: '',
    category: 'bar',
    image_url: '',
    product_url: '',
    is_active: true
  });
  
  // Editing states
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  
  // Form data states
  const [formData, setFormData] = useState({
    userId: undefined as string | undefined,
    accountType: 'standard',
    balance: '0.00',
    goldHoldings: '0.0000',
    silverHoldings: '0.0000',
    platinumHoldings: '0.0000',
    notes: ''
  });
  
  const [bannerFormData, setBannerFormData] = useState({
    userId: undefined as string | undefined,
    title: '',
    message: '',
    bannerType: 'info',
    priority: '1',
    expiresAt: ''
  });
  
  const [transactionFormData, setTransactionFormData] = useState({
    userId: selectedUserId,
    transactionType: 'buy',
    metalType: 'gold',
    amount: '0.0000',
    pricePerOz: '0.00',
    transactionDate: new Date().toISOString().slice(0, 16),
    status: 'completed',
    notes: ''
  });
  
  const [performanceFormData, setPerformanceFormData] = useState({
    userId: selectedUserId,
    oneMonthReturn: '0.00',
    threeMonthReturn: '0.00',
    ytdReturn: '0.00',
    allTimeReturn: '0.00',
    goldTargetOz: '0.0000',
    silverTargetOz: '0.0000',
    platinumTargetOz: '0.0000',
    portfolioTargetValue: '0.00',
    targetDate: ''
  });
  
  const [riskFormData, setRiskFormData] = useState({
    userId: selectedUserId,
    riskTolerance: 'moderate',
    volatilityComfort: '5.0',
    diversificationScore: '75',
    marketCorrelation: '0.65',
    notes: ''
  });
  
  const [insightFormData, setInsightFormData] = useState({
    userId: selectedUserId,
    insightType: 'buy_signal',
    metalFocus: 'gold',
    confidenceScore: '75',
    recommendation: '',
    reasoning: '',
    isActive: true,
    priority: '1',
    expiresAt: ''
  });
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0,
  });

  useEffect(() => {
    fetchUsers();
    fetchAllUsers();
    fetchStats();
    fetchInvestmentAccounts();
    fetchUserBanners();
    fetchProducts();
  }, []);
  
  useEffect(() => {
    if (selectedUserId) {
      fetchUserTransactions();
      fetchUserPerformanceMetrics();
      fetchUserRiskProfile();
      fetchUserAIInsights();
      fetchUserToolSettings();
      fetchUserActionPermissions();
      
      // Update form data with selected user
      setTransactionFormData(prev => ({...prev, userId: selectedUserId}));
      setPerformanceFormData(prev => ({...prev, userId: selectedUserId}));
      setRiskFormData(prev => ({...prev, userId: selectedUserId}));
      setInsightFormData(prev => ({...prev, userId: selectedUserId}));
    }
  }, [selectedUserId]);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        user_roles!inner(role)
      `)
      .order('created_at', { ascending: false });
    
    if (data) {
      setUsers(data);
    }
  };

  const fetchAllUsers = async () => {
    setUsersLoading(true);
    // Fetch all users with their auth data for dropdowns
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    console.log('Fetched users:', data, 'Error:', error);
    
    if (data) {
      setAllUsers(data);
    } else if (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users from database",
        variant: "destructive"
      });
    }
    setUsersLoading(false);
  };

  const fetchInvestmentAccounts = async () => {
    const { data, error } = await supabase
      .from('investment_accounts')
      .select(`
        *,
        profiles(full_name, user_id)
      `)
      .order('created_at', { ascending: false });
    
    console.log('Investment accounts fetch result:', data, 'Error:', error);
    
    if (data) {
      setInvestmentAccounts(data);
    } else if (error) {
      console.error('Error fetching investment accounts:', error);
    }
  };

  const fetchStats = async () => {
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id');
    
    const { data: adminData } = await supabase
      .from('user_roles')
      .select('id')
      .eq('role', 'admin');
    
    setStats({
      totalUsers: profilesData?.length || 0,
      adminUsers: adminData?.length || 0,
      regularUsers: (profilesData?.length || 0) - (adminData?.length || 0),
    });
  };

  const toggleUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    const { error } = await supabase
      .from('user_roles')
      .update({ role: newRole })
      .eq('user_id', userId);
    
    if (!error) {
      fetchUsers();
      fetchStats();
    }
  };

  const handleCreateInvestmentAccount = async () => {
    if (!formData.userId || !user?.id) return;

    // Generate account number
    const { data: accountNumberData } = await supabase.rpc('generate_account_number');
    
    const { error } = await supabase
      .from('investment_accounts')
      .insert({
        user_id: formData.userId,
        account_number: accountNumberData,
        account_type: formData.accountType,
        balance: parseFloat(formData.balance),
        gold_holdings: parseFloat(formData.goldHoldings),
        silver_holdings: parseFloat(formData.silverHoldings),
        platinum_holdings: parseFloat(formData.platinumHoldings),
        notes: formData.notes,
        created_by: user.id
      });

    if (!error) {
      setIsDialogOpen(false);
      setFormData({
        userId: undefined,
        accountType: 'standard',
        balance: '0.00',
        goldHoldings: '0.0000',
        silverHoldings: '0.0000',
        platinumHoldings: '0.0000',
        notes: ''
      });
      fetchInvestmentAccounts();
      toast({
        title: "Success",
        description: "Investment account created successfully"
      });
    }
  };

  const fetchUserBanners = async () => {
    const { data, error } = await supabase
      .from('user_banners')
      .select(`
        *,
        profiles!inner(full_name, user_id)
      `)
      .order('created_at', { ascending: false });
    
    if (data) {
      setUserBanners(data);
    }
  };
  
  // Fetch user-specific portfolio data
  const fetchUserTransactions = async () => {
    if (!selectedUserId) return;
    
    const { data, error } = await supabase
      .from('user_transactions')
      .select('*')
      .eq('user_id', selectedUserId)
      .order('transaction_date', { ascending: false });
    
    if (data) {
      setUserTransactions(data);
    }
  };
  
  const fetchUserPerformanceMetrics = async () => {
    if (!selectedUserId) return;
    
    const { data, error } = await supabase
      .from('user_performance_metrics')
      .select('*')
      .eq('user_id', selectedUserId)
      .single();
    
    if (data) {
      setUserPerformanceMetrics(data);
    } else {
      setUserPerformanceMetrics(null);
    }
  };
  
  const fetchUserRiskProfile = async () => {
    if (!selectedUserId) return;
    
    const { data, error } = await supabase
      .from('user_risk_profiles')
      .select('*')
      .eq('user_id', selectedUserId)
      .single();
    
    if (data) {
      setUserRiskProfile(data);
    } else {
      setUserRiskProfile(null);
    }
  };
  
  const fetchUserAIInsights = async () => {
    if (!selectedUserId) return;
    
    const { data, error } = await supabase
      .from('user_ai_insights')
      .select('*')
      .eq('user_id', selectedUserId)
      .order('created_at', { ascending: false });
    
    if (data) {
      setUserAIInsights(data);
    }
  };
  
  const fetchUserToolSettings = async () => {
    if (!selectedUserId) return;
    
    const { data, error } = await supabase
      .from('user_tool_settings')
      .select('*')
      .eq('user_id', selectedUserId)
      .single();
    
    if (data) {
      setUserToolSettings(data);
    } else {
      setUserToolSettings(null);
    }
  };
  
  const fetchUserActionPermissions = async () => {
    if (!selectedUserId) return;
    
    const { data, error } = await supabase
      .from('user_action_permissions')
      .select('*')
      .eq('user_id', selectedUserId)
      .single();
    
    if (data) {
      setUserActionPermissions(data);
    } else {
      setUserActionPermissions(null);
    }
  };

  const handleCreateBanner = async () => {
    if (!bannerFormData.userId || !bannerFormData.title || !bannerFormData.message || !user?.id) return;

    const { error } = await supabase
      .from('user_banners')
      .insert({
        user_id: bannerFormData.userId,
        title: bannerFormData.title,
        message: bannerFormData.message,
        banner_type: bannerFormData.bannerType,
        priority: parseInt(bannerFormData.priority),
        expires_at: bannerFormData.expiresAt ? new Date(bannerFormData.expiresAt).toISOString() : null,
        created_by: user.id
      });

    if (!error) {
      setIsBannerDialogOpen(false);
      setBannerFormData({
        userId: undefined,
        title: '',
        message: '',
        bannerType: 'info',
        priority: '1',
        expiresAt: ''
      });
      fetchUserBanners();
      toast({
        title: "Success",
        description: "Banner created successfully"
      });
    }
  };

  const handleToggleBanner = async (bannerId: string, isActive: boolean) => {
    const { error } = await supabase
      .from('user_banners')
      .update({ is_active: !isActive })
      .eq('id', bannerId);

    if (!error) {
      fetchUserBanners();
      toast({
        title: "Success",
        description: `Banner ${isActive ? 'deactivated' : 'activated'} successfully`
      });
    }
  };

  const handleDeleteBanner = async (bannerId: string) => {
    const { error } = await supabase
      .from('user_banners')
      .delete()
      .eq('id', bannerId);

    if (!error) {
      fetchUserBanners();
      toast({
        title: "Success",
        description: "Banner deleted successfully"
      });
    }
  };

  const handleEditAccount = (account: any) => {
    setEditingAccount(account);
    setFormData({
      userId: account.user_id,
      accountType: account.account_type,
      balance: account.balance.toString(),
      goldHoldings: account.gold_holdings.toString(),
      silverHoldings: account.silver_holdings.toString(),
      platinumHoldings: account.platinum_holdings.toString(),
      notes: account.notes || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateAccount = async () => {
    if (!editingAccount || !user?.id) return;

    const { error } = await supabase
      .from('investment_accounts')
      .update({
        user_id: formData.userId,
        account_type: formData.accountType,
        balance: parseFloat(formData.balance),
        gold_holdings: parseFloat(formData.goldHoldings),
        silver_holdings: parseFloat(formData.silverHoldings),
        platinum_holdings: parseFloat(formData.platinumHoldings),
        notes: formData.notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', editingAccount.id);

    if (!error) {
      setIsEditDialogOpen(false);
      setEditingAccount(null);
      setFormData({
        userId: undefined,
        accountType: 'standard',
        balance: '0.00',
        goldHoldings: '0.0000',
        silverHoldings: '0.0000',
        platinumHoldings: '0.0000',
        notes: ''
      });
      fetchInvestmentAccounts();
      toast({
        title: "Success",
        description: "Investment account updated successfully"
      });
    }
  };

  const handleEditBanner = (banner: any) => {
    setEditingBanner(banner);
    setBannerFormData({
      userId: banner.user_id,
      title: banner.title,
      message: banner.message,
      bannerType: banner.banner_type,
      priority: banner.priority.toString(),
      expiresAt: banner.expires_at ? new Date(banner.expires_at).toISOString().slice(0, 16) : ''
    });
    setIsEditBannerDialogOpen(true);
  };

  const handleUpdateBanner = async () => {
    if (!editingBanner || !user?.id) return;

    const { error } = await supabase
      .from('user_banners')
      .update({
        user_id: bannerFormData.userId,
        title: bannerFormData.title,
        message: bannerFormData.message,
        banner_type: bannerFormData.bannerType,
        priority: parseInt(bannerFormData.priority),
        expires_at: bannerFormData.expiresAt ? new Date(bannerFormData.expiresAt).toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', editingBanner.id);

    if (!error) {
      setIsEditBannerDialogOpen(false);
      setEditingBanner(null);
      setBannerFormData({
        userId: undefined,
        title: '',
        message: '',
        bannerType: 'info',
        priority: '1',
        expiresAt: ''
      });
      fetchUserBanners();
      toast({
        title: "Success",
        description: "Banner updated successfully"
      });
    }
  };
  
  // Portfolio management CRUD operations
  const handleCreateTransaction = async () => {
    if (!selectedUserId || !user?.id) return;

    const { error } = await supabase
      .from('user_transactions')
      .insert({
        user_id: selectedUserId,
        transaction_type: transactionFormData.transactionType,
        metal_type: transactionFormData.metalType,
        amount: parseFloat(transactionFormData.amount),
        price_per_oz: parseFloat(transactionFormData.pricePerOz),
        transaction_date: new Date(transactionFormData.transactionDate).toISOString(),
        status: transactionFormData.status,
        notes: transactionFormData.notes,
        created_by: user.id
      });

    if (!error) {
      setIsTransactionDialogOpen(false);
      setTransactionFormData({
        userId: selectedUserId,
        transactionType: 'buy',
        metalType: 'gold',
        amount: '0.0000',
        pricePerOz: '0.00',
        transactionDate: new Date().toISOString().slice(0, 16),
        status: 'completed',
        notes: ''
      });
      fetchUserTransactions();
      toast({
        title: "Success",
        description: "Transaction created successfully"
      });
    }
  };
  
  const handleUpdateTransaction = async () => {
    if (!editingTransaction || !user?.id) return;

    const { error } = await supabase
      .from('user_transactions')
      .update({
        transaction_type: transactionFormData.transactionType,
        metal_type: transactionFormData.metalType,
        amount: parseFloat(transactionFormData.amount),
        price_per_oz: parseFloat(transactionFormData.pricePerOz),
        transaction_date: new Date(transactionFormData.transactionDate).toISOString(),
        status: transactionFormData.status,
        notes: transactionFormData.notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', editingTransaction.id);

    if (!error) {
      setIsTransactionDialogOpen(false);
      setEditingTransaction(null);
      fetchUserTransactions();
      toast({
        title: "Success",
        description: "Transaction updated successfully"
      });
    }
  };
  
  const handleDeleteTransaction = async (transactionId: string) => {
    const { error } = await supabase
      .from('user_transactions')
      .delete()
      .eq('id', transactionId);

    if (!error) {
      fetchUserTransactions();
      toast({
        title: "Success",
        description: "Transaction deleted successfully"
      });
    }
  };
  
  const handleSavePerformanceMetrics = async () => {
    if (!selectedUserId || !user?.id) return;

    const performanceData = {
      user_id: selectedUserId,
      one_month_return: parseFloat(performanceFormData.oneMonthReturn),
      three_month_return: parseFloat(performanceFormData.threeMonthReturn),
      ytd_return: parseFloat(performanceFormData.ytdReturn),
      all_time_return: parseFloat(performanceFormData.allTimeReturn),
      gold_target_oz: parseFloat(performanceFormData.goldTargetOz),
      silver_target_oz: parseFloat(performanceFormData.silverTargetOz),
      platinum_target_oz: parseFloat(performanceFormData.platinumTargetOz),
      portfolio_target_value: parseFloat(performanceFormData.portfolioTargetValue),
      target_date: performanceFormData.targetDate ? performanceFormData.targetDate : null,
      created_by: user.id
    };

    const { error } = userPerformanceMetrics
      ? await supabase
          .from('user_performance_metrics')
          .update(performanceData)
          .eq('user_id', selectedUserId)
      : await supabase
          .from('user_performance_metrics')
          .insert(performanceData);

    if (!error) {
      fetchUserPerformanceMetrics();
      toast({
        title: "Success",
        description: "Performance metrics saved successfully"
      });
    }
  };
  
  const handleSaveRiskProfile = async () => {
    if (!selectedUserId || !user?.id) return;

    const riskData = {
      user_id: selectedUserId,
      risk_tolerance: riskFormData.riskTolerance,
      volatility_comfort: parseFloat(riskFormData.volatilityComfort),
      diversification_score: parseInt(riskFormData.diversificationScore),
      market_correlation: parseFloat(riskFormData.marketCorrelation),
      notes: riskFormData.notes,
      created_by: user.id
    };

    const { error } = userRiskProfile
      ? await supabase
          .from('user_risk_profiles')
          .update(riskData)
          .eq('user_id', selectedUserId)
      : await supabase
          .from('user_risk_profiles')
          .insert(riskData);

    if (!error) {
      fetchUserRiskProfile();
      toast({
        title: "Success",
        description: "Risk profile saved successfully"
      });
    }
  };
  
  const handleCreateAIInsight = async () => {
    if (!selectedUserId || !user?.id) return;

    const { error } = await supabase
      .from('user_ai_insights')
      .insert({
        user_id: selectedUserId,
        insight_type: insightFormData.insightType,
        metal_focus: insightFormData.metalFocus,
        confidence_score: parseInt(insightFormData.confidenceScore),
        recommendation: insightFormData.recommendation,
        reasoning: insightFormData.reasoning,
        is_active: insightFormData.isActive,
        priority: parseInt(insightFormData.priority),
        expires_at: insightFormData.expiresAt ? new Date(insightFormData.expiresAt).toISOString() : null,
        created_by: user.id
      });

    if (!error) {
      setIsInsightDialogOpen(false);
      setInsightFormData({
        userId: selectedUserId,
        insightType: 'buy_signal',
        metalFocus: 'gold',
        confidenceScore: '75',
        recommendation: '',
        reasoning: '',
        isActive: true,
        priority: '1',
        expiresAt: ''
      });
      fetchUserAIInsights();
      toast({
        title: "Success",
        description: "AI insight created successfully"
      });
    }
  };
  
  const handleToggleAIInsight = async (insightId: string, isActive: boolean) => {
    const { error } = await supabase
      .from('user_ai_insights')
      .update({ is_active: !isActive })
      .eq('id', insightId);

    if (!error) {
      fetchUserAIInsights();
      toast({
        title: "Success",
        description: `AI insight ${isActive ? 'deactivated' : 'activated'} successfully`
      });
    }
  };
  
  const handleDeleteAIInsight = async (insightId: string) => {
    const { error } = await supabase
      .from('user_ai_insights')
      .delete()
      .eq('id', insightId);

    if (!error) {
      fetchUserAIInsights();
      toast({
        title: "Success",
        description: "AI insight deleted successfully"
      });
    }
  };
  
  const handleSaveToolSettings = async () => {
    if (!selectedUserId || !user?.id) return;

    const toolData = {
      user_id: selectedUserId,
      calculator_expected_return: parseFloat(userToolSettings?.calculator_expected_return || '8.0'),
      calculator_time_horizon: parseInt(userToolSettings?.calculator_time_horizon || '10'),
      minimum_investment: parseFloat(userToolSettings?.minimum_investment || '1000.00'),
      maximum_investment: parseFloat(userToolSettings?.maximum_investment || '10000000.00'),
      gold_target_percentage: parseInt(userToolSettings?.gold_target_percentage || '60'),
      silver_target_percentage: parseInt(userToolSettings?.silver_target_percentage || '25'),
      platinum_target_percentage: parseInt(userToolSettings?.platinum_target_percentage || '15'),
      rebalance_threshold: parseInt(userToolSettings?.rebalance_threshold || '5'),
      gold_price_alert: userToolSettings?.gold_price_alert ? parseFloat(userToolSettings.gold_price_alert) : null,
      silver_price_alert: userToolSettings?.silver_price_alert ? parseFloat(userToolSettings.silver_price_alert) : null,
      platinum_price_alert: userToolSettings?.platinum_price_alert ? parseFloat(userToolSettings.platinum_price_alert) : null,
      email_alerts_enabled: userToolSettings?.email_alerts_enabled ?? true,
      push_notifications_enabled: userToolSettings?.push_notifications_enabled ?? true,
      created_by: user.id
    };

    const { error } = userToolSettings
      ? await supabase
          .from('user_tool_settings')
          .update(toolData)
          .eq('user_id', selectedUserId)
      : await supabase
          .from('user_tool_settings')
          .insert(toolData);

    if (!error) {
      fetchUserToolSettings();
      toast({
        title: "Success",
        description: "Tool settings saved successfully"
      });
    }
  };
  
  const handleSaveActionPermissions = async () => {
    if (!selectedUserId || !user?.id) return;

    const permissionsData = {
      user_id: selectedUserId,
      allow_deposit_requests: userActionPermissions?.allow_deposit_requests ?? true,
      allow_withdrawal_requests: userActionPermissions?.allow_withdrawal_requests ?? true,
      auto_approve_deposits: userActionPermissions?.auto_approve_deposits ?? false,
      auto_approve_limit: parseFloat(userActionPermissions?.auto_approve_limit || '10000.00'),
      monthly_reports_access: userActionPermissions?.monthly_reports_access ?? true,
      tax_reports_access: userActionPermissions?.tax_reports_access ?? true,
      holdings_analysis_access: userActionPermissions?.holdings_analysis_access ?? true,
      performance_reports_access: userActionPermissions?.performance_reports_access ?? true,
      price_alerts_enabled: userActionPermissions?.price_alerts_enabled ?? true,
      market_news_notifications: userActionPermissions?.market_news_notifications ?? true,
      live_chat_support: userActionPermissions?.live_chat_support ?? true,
      phone_support: userActionPermissions?.phone_support ?? true,
      account_settings_access: userActionPermissions?.account_settings_access ?? true,
      goal_setting_access: userActionPermissions?.goal_setting_access ?? true,
      created_by: user.id
    };

    const { error } = userActionPermissions
      ? await supabase
          .from('user_action_permissions')
          .update(permissionsData)
          .eq('user_id', selectedUserId)
      : await supabase
          .from('user_action_permissions')
          .insert(permissionsData);

    if (!error) {
      fetchUserActionPermissions();
      toast({
        title: "Success",
        description: "Action permissions saved successfully"
      });
    }
  };

  // Products management functions
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      setProducts(data);
    } else if (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductFormData({
      name: product.name || '',
      description: product.description || '',
      price_usd: product.price_usd?.toString() || '0.00',
      weight: product.weight || '',
      metal_type: product.metal_type || 'gold',
      brand: product.brand || '',
      purity: product.purity || '',
      category: product.category || 'bar',
      image_url: product.image_url || '',
      product_url: product.product_url || '',
      is_active: product.is_active ?? true
    });
    setIsEditProductDialogOpen(true);
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct || !user?.id) return;

    const { error } = await supabase
      .from('products')
      .update({
        name: productFormData.name,
        description: productFormData.description,
        price_usd: parseFloat(productFormData.price_usd),
        weight: productFormData.weight,
        metal_type: productFormData.metal_type,
        brand: productFormData.brand,
        purity: productFormData.purity,
        category: productFormData.category,
        image_url: productFormData.image_url,
        product_url: productFormData.product_url,
        is_active: productFormData.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', editingProduct.id);

    if (!error) {
      setIsEditProductDialogOpen(false);
      setEditingProduct(null);
      resetProductForm();
      fetchProducts();
      toast({
        title: "Success",
        description: "Product updated successfully"
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (!error) {
      fetchProducts();
      toast({
        title: "Success",
        description: "Product deleted successfully"
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      });
    }
  };

  const handleToggleProductStatus = async (productId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('products')
      .update({ is_active: !currentStatus })
      .eq('id', productId);

    if (!error) {
      fetchProducts();
      toast({
        title: "Success",
        description: `Product ${currentStatus ? 'deactivated' : 'activated'} successfully`
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update product status",
        variant: "destructive"
      });
    }
  };

  const resetProductForm = () => {
    setProductFormData({
      name: '',
      description: '',
      price_usd: '0.00',
      weight: '',
      metal_type: 'gold',
      brand: '',
      purity: '',
      category: 'bar',
      image_url: '',
      product_url: '',
      is_active: true
    });
  };

  const handleDeleteAllStripeProducts = async () => {
    if (!confirm('⚠️ WARNING: This will delete ALL products from your Stripe catalog. This action cannot be undone. Are you sure you want to continue?')) {
      return;
    }

    setDeletingAllProducts(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('delete-all-stripe-products', {
        body: {}
      });

      if (error) throw error;

      toast({
        title: "Deletion Complete",
        description: `Deleted ${data.deleted} products. ${data.failed > 0 ? `Failed: ${data.failed}` : ''}`,
      });

      if (data.errors && data.errors.length > 0) {
        console.error('Deletion errors:', data.errors);
      }
    } catch (error: any) {
      console.error('Error deleting Stripe products:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete Stripe products",
        variant: "destructive"
      });
    } finally {
      setDeletingAllProducts(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
              <Badge variant="destructive">Administrator</Badge>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Admin: {user?.email}
              </span>
              <Button variant="outline" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Registered accounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administrators</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.adminUsers}</div>
              <p className="text-xs text-muted-foreground">
                Admin accounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Regular Users</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.regularUsers}</div>
              <p className="text-xs text-muted-foreground">
                Standard accounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Database Status</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Online</div>
              <p className="text-xs text-muted-foreground">
                All systems operational
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="accounts">Investment Accounts</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio Management</TabsTrigger>
            <TabsTrigger value="banners">User Banners</TabsTrigger>
            <TabsTrigger value="products">Product Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.full_name || 'Unknown'}
                        </TableCell>
                        <TableCell>{user.email || user.user_id}</TableCell>
                        <TableCell>
                          <Badge variant={user.user_roles.role === 'admin' ? 'destructive' : 'secondary'}>
                            {user.user_roles.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleUserRole(user.user_id, user.user_roles.role)}
                          >
                            {user.user_roles.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accounts">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Investment Accounts Management
                  </CardTitle>
                  <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (open) {
                      fetchAllUsers(); // Refresh users when dialog opens
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Investment Account
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Create Investment Account</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="user-select">Select User</Label>
                          <Select value={formData.userId} onValueChange={(value) => setFormData({...formData, userId: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder={
                                usersLoading ? "Loading users..." : 
                                allUsers.length === 0 ? "No users found" : 
                                "Select a user"
                              } />
                            </SelectTrigger>
                            <SelectContent className="bg-card border border-border shadow-lg z-50 max-h-64">
                              {usersLoading ? (
                                <div className="px-3 py-2 text-sm text-muted-foreground">
                                  Loading users...
                                </div>
                              ) : allUsers.length === 0 ? (
                                <div className="px-3 py-2 text-sm text-muted-foreground">
                                  No users found
                                </div>
                              ) : (
                                allUsers.map((user) => (
                                  <SelectItem 
                                    key={user.user_id} 
                                    value={user.user_id}
                                    className="hover:bg-muted focus:bg-muted cursor-pointer"
                                  >
                                    {user.full_name || 'Unknown User'} ({user.email || user.user_id.slice(0, 8) + '...'})
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="account-type">Account Type</Label>
                          <Select value={formData.accountType} onValueChange={(value) => setFormData({...formData, accountType: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="standard">Standard</SelectItem>
                              <SelectItem value="premium">Premium</SelectItem>
                              <SelectItem value="gold">Gold</SelectItem>
                              <SelectItem value="platinum">Platinum</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="balance">Initial Balance ($)</Label>
                            <Input
                              id="balance"
                              type="number"
                              step="0.01"
                              value={formData.balance}
                              onChange={(e) => setFormData({...formData, balance: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="gold">Gold Holdings (oz)</Label>
                            <Input
                              id="gold"
                              type="number"
                              step="0.0001"
                              value={formData.goldHoldings}
                              onChange={(e) => setFormData({...formData, goldHoldings: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="silver">Silver Holdings (oz)</Label>
                            <Input
                              id="silver"
                              type="number"
                              step="0.0001"
                              value={formData.silverHoldings}
                              onChange={(e) => setFormData({...formData, silverHoldings: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="platinum">Platinum Holdings (oz)</Label>
                            <Input
                              id="platinum"
                              type="number"
                              step="0.0001"
                              value={formData.platinumHoldings}
                              onChange={(e) => setFormData({...formData, platinumHoldings: e.target.value})}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="notes">Notes (Optional)</Label>
                          <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                            placeholder="Any additional notes about this account..."
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleCreateInvestmentAccount} disabled={!formData.userId}>
                            Create Account
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account Number</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Holdings</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {investmentAccounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="font-mono text-sm">
                          {account.account_number}
                        </TableCell>
                        <TableCell>
                          {account.profiles?.full_name || 'Unknown User'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {account.account_type}
                          </Badge>
                        </TableCell>
                        <TableCell>${Number(account.balance).toFixed(2)}</TableCell>
                        <TableCell className="text-xs">
                          <div>G: {Number(account.gold_holdings).toFixed(4)}oz</div>
                          <div>S: {Number(account.silver_holdings).toFixed(4)}oz</div>
                          <div>P: {Number(account.platinum_holdings).toFixed(4)}oz</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={account.status === 'active' ? 'default' : 'secondary'}>
                            {account.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(account.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditAccount(account)}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="banners">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    User Banner Management
                  </CardTitle>
                  <Dialog open={isBannerDialogOpen} onOpenChange={(open) => {
                    setIsBannerDialogOpen(open);
                    if (open) {
                      fetchAllUsers(); // Refresh users when dialog opens
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Banner
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Create User Banner</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="banner-user-select">Select User</Label>
                          <Select value={bannerFormData.userId} onValueChange={(value) => setBannerFormData({...bannerFormData, userId: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder={
                                usersLoading ? "Loading users..." : 
                                allUsers.length === 0 ? "No users found" : 
                                "Select a user"
                              } />
                            </SelectTrigger>
                            <SelectContent className="bg-card border border-border shadow-lg z-50 max-h-64">
                              {usersLoading ? (
                                <div className="px-3 py-2 text-sm text-muted-foreground">
                                  Loading users...
                                </div>
                              ) : allUsers.length === 0 ? (
                                <div className="px-3 py-2 text-sm text-muted-foreground">
                                  No users found
                                </div>
                              ) : (
                                allUsers.map((user) => (
                                  <SelectItem 
                                    key={user.user_id} 
                                    value={user.user_id}
                                    className="hover:bg-muted focus:bg-muted cursor-pointer"
                                  >
                                    {user.full_name || 'Unknown User'} ({user.email || user.user_id.slice(0, 8) + '...'})
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="banner-title">Banner Title</Label>
                          <Input
                            id="banner-title"
                            value={bannerFormData.title}
                            onChange={(e) => setBannerFormData({...bannerFormData, title: e.target.value})}
                            placeholder="Enter banner title..."
                          />
                        </div>

                        <div>
                          <Label htmlFor="banner-message">Banner Message</Label>
                          <Textarea
                            id="banner-message"
                            value={bannerFormData.message}
                            onChange={(e) => setBannerFormData({...bannerFormData, message: e.target.value})}
                            placeholder="Enter banner message..."
                            rows={3}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="banner-type">Banner Type</Label>
                            <Select value={bannerFormData.bannerType} onValueChange={(value) => setBannerFormData({...bannerFormData, bannerType: value})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="info">Info</SelectItem>
                                <SelectItem value="success">Success</SelectItem>
                                <SelectItem value="warning">Warning</SelectItem>
                                <SelectItem value="error">Error</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="banner-priority">Priority</Label>
                            <Input
                              id="banner-priority"
                              type="number"
                              min="1"
                              max="10"
                              value={bannerFormData.priority}
                              onChange={(e) => setBannerFormData({...bannerFormData, priority: e.target.value})}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="banner-expires">Expires At (Optional)</Label>
                          <Input
                            id="banner-expires"
                            type="datetime-local"
                            value={bannerFormData.expiresAt}
                            onChange={(e) => setBannerFormData({...bannerFormData, expiresAt: e.target.value})}
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsBannerDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleCreateBanner} 
                            disabled={!bannerFormData.userId || !bannerFormData.title || !bannerFormData.message}
                          >
                            Create Banner
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userBanners.map((banner) => (
                      <TableRow key={banner.id}>
                        <TableCell>
                          {banner.profiles.full_name || 'Unknown'}
                        </TableCell>
                        <TableCell className="font-medium">
                          {banner.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            banner.banner_type === 'error' ? 'destructive' :
                            banner.banner_type === 'warning' ? 'secondary' :
                            banner.banner_type === 'success' ? 'default' : 'outline'
                          }>
                            {banner.banner_type}
                          </Badge>
                        </TableCell>
                        <TableCell>{banner.priority}</TableCell>
                        <TableCell>
                          <Badge variant={banner.is_active ? 'default' : 'secondary'}>
                            {banner.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {banner.expires_at ? new Date(banner.expires_at).toLocaleDateString() : 'Never'}
                        </TableCell>
                        <TableCell className="space-x-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleEditBanner(banner)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleBanner(banner.id, banner.is_active)}
                          >
                            {banner.is_active ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteBanner(banner.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Portfolio Management System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Label htmlFor="user-select-portfolio">Select User to Manage</Label>
                  <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a user to manage their portfolio" />
                    </SelectTrigger>
                    <SelectContent>
                      {allUsers.map((user) => (
                        <SelectItem key={user.user_id} value={user.user_id}>
                          {user.full_name || 'Unknown User'} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedUserId && (
                  <Tabs defaultValue="overview-admin" className="w-full">
                    <TabsList className="grid w-full grid-cols-7">
                      <TabsTrigger value="overview-admin">Overview</TabsTrigger>
                      <TabsTrigger value="transactions-admin">Transactions</TabsTrigger>
                      <TabsTrigger value="performance-admin">Performance</TabsTrigger>
                      <TabsTrigger value="risk-admin">Risk Analysis</TabsTrigger>
                      <TabsTrigger value="insights-admin">AI Insights</TabsTrigger>
                      <TabsTrigger value="tools-admin">Tools</TabsTrigger>
                      <TabsTrigger value="actions-admin">Actions</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview-admin" className="space-y-6 mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Portfolio Overview for {allUsers.find(u => u.user_id === selectedUserId)?.full_name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-3">
                              {(() => {
                                const account = investmentAccounts.find(acc => acc.user_id === selectedUserId);
                                return (
                                  <>
                                    <Card className="p-4">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <p className="text-sm text-muted-foreground">Gold Holdings</p>
                                          <p className="text-2xl font-bold">{account ? Number(account.gold_holdings).toFixed(4) : '0.0000'} oz</p>
                                        </div>
                                        <Button size="sm" variant="ghost" onClick={() => handleEditAccount(account)} disabled={!account}>
                                          <Settings className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </Card>
                                    <Card className="p-4">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <p className="text-sm text-muted-foreground">Silver Holdings</p>
                                          <p className="text-2xl font-bold">{account ? Number(account.silver_holdings).toFixed(4) : '0.0000'} oz</p>
                                        </div>
                                        <Button size="sm" variant="ghost" onClick={() => handleEditAccount(account)} disabled={!account}>
                                          <Settings className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </Card>
                                    <Card className="p-4">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <p className="text-sm text-muted-foreground">Portfolio Value</p>
                                          <p className="text-2xl font-bold">${account ? Number(account.balance).toFixed(2) : '0.00'}</p>
                                        </div>
                                        <Button size="sm" variant="ghost" onClick={() => handleEditAccount(account)} disabled={!account}>
                                          <Settings className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </Card>
                                  </>
                                );
                              })()}
                            </div>

                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                  <span>Portfolio Allocation Settings</span>
                                  {!investmentAccounts.find(acc => acc.user_id === selectedUserId) && (
                                    <Button size="sm" onClick={() => {
                                      setFormData({...formData, userId: selectedUserId});
                                      setIsDialogOpen(true);
                                    }}>
                                      <Plus className="h-4 w-4 mr-1" />
                                      Create Account
                                    </Button>
                                  )}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                {userToolSettings ? (
                                  <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                      <Label>Gold Target (%)</Label>
                                      <Input 
                                        type="number" 
                                        value={userToolSettings.gold_target_percentage || 60}
                                        onChange={(e) => setUserToolSettings({...userToolSettings, gold_target_percentage: parseInt(e.target.value)})}
                                      />
                                      <Progress value={userToolSettings.gold_target_percentage || 60} className="h-2" />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Silver Target (%)</Label>
                                      <Input 
                                        type="number" 
                                        value={userToolSettings.silver_target_percentage || 25}
                                        onChange={(e) => setUserToolSettings({...userToolSettings, silver_target_percentage: parseInt(e.target.value)})}
                                      />
                                      <Progress value={userToolSettings.silver_target_percentage || 25} className="h-2" />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Platinum Target (%)</Label>
                                      <Input 
                                        type="number" 
                                        value={userToolSettings.platinum_target_percentage || 15}
                                        onChange={(e) => setUserToolSettings({...userToolSettings, platinum_target_percentage: parseInt(e.target.value)})}
                                      />
                                      <Progress value={userToolSettings.platinum_target_percentage || 15} className="h-2" />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-center py-8">
                                    <p className="text-muted-foreground mb-4">No tool settings found for this user.</p>
                                    <Button onClick={handleSaveToolSettings}>Create Default Settings</Button>
                                  </div>
                                )}
                                <Button className="mt-4" onClick={handleSaveToolSettings}>Save Allocation Settings</Button>
                              </CardContent>
                            </Card>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                  <TabsContent value="transactions-admin" className="space-y-6 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>Transaction Management for {allUsers.find(u => u.user_id === selectedUserId)?.full_name}</span>
                          <div className="flex gap-2">
                            <Button onClick={() => setIsBulkUploadDialogOpen(true)} variant="secondary">
                              <Upload className="h-4 w-4 mr-2" />
                              Bulk Upload
                            </Button>
                            <Button onClick={() => setIsTransactionDialogOpen(true)}>
                              <Plus className="h-4 w-4 mr-2" />
                              Add Transaction
                            </Button>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="mt-6">
                          <h4 className="font-semibold mb-4">User Transactions</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Metal</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Price/oz</TableHead>
                                <TableHead>Total Value</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {userTransactions.length > 0 ? userTransactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                  <TableCell>
                                    {new Date(transaction.transaction_date).toLocaleDateString()}
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant={transaction.transaction_type === 'buy' ? 'default' : 
                                      transaction.transaction_type === 'sell' ? 'destructive' : 'secondary'}>
                                      {transaction.transaction_type}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="capitalize">{transaction.metal_type}</TableCell>
                                  <TableCell>{Number(transaction.amount).toFixed(4)} oz</TableCell>
                                  <TableCell>${Number(transaction.price_per_oz).toFixed(2)}</TableCell>
                                  <TableCell>${Number(transaction.total_value).toFixed(2)}</TableCell>
                                  <TableCell>
                                    <Badge variant={transaction.status === 'completed' ? 'default' : 
                                      transaction.status === 'pending' ? 'secondary' : 'destructive'}>
                                      {transaction.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex gap-1">
                                      <Button size="sm" variant="ghost" onClick={() => {
                                        setEditingTransaction(transaction);
                                        setTransactionFormData({
                                          userId: selectedUserId,
                                          transactionType: transaction.transaction_type,
                                          metalType: transaction.metal_type,
                                          amount: transaction.amount.toString(),
                                          pricePerOz: transaction.price_per_oz.toString(),
                                          transactionDate: new Date(transaction.transaction_date).toISOString().slice(0, 16),
                                          status: transaction.status,
                                          notes: transaction.notes || ''
                                        });
                                        setIsTransactionDialogOpen(true);
                                      }}>Edit</Button>
                                      <Button size="sm" variant="destructive" onClick={() => handleDeleteTransaction(transaction.id)}>
                                        Delete
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )) : (
                                <TableRow>
                                  <TableCell colSpan={8} className="text-center py-8">
                                    <p className="text-muted-foreground">No transactions found for this user.</p>
                                    <Button onClick={() => setIsTransactionDialogOpen(true)} className="mt-2">
                                      Create First Transaction
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="performance-admin" className="space-y-6 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Performance Metrics for {allUsers.find(u => u.user_id === selectedUserId)?.full_name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="grid gap-4 md:grid-cols-2">
                            <Card className="p-4">
                              <h4 className="font-semibold mb-3">Return Settings</h4>
                              <div className="space-y-3">
                                <div>
                                  <Label>1 Month Return (%)</Label>
                                  <Input 
                                    type="number" 
                                    step="0.01" 
                                    value={userPerformanceMetrics?.one_month_return || performanceFormData.oneMonthReturn}
                                    onChange={(e) => setPerformanceFormData({...performanceFormData, oneMonthReturn: e.target.value})}
                                    placeholder="5.2" 
                                  />
                                </div>
                                <div>
                                  <Label>3 Month Return (%)</Label>
                                  <Input 
                                    type="number" 
                                    step="0.01" 
                                    value={userPerformanceMetrics?.three_month_return || performanceFormData.threeMonthReturn}
                                    onChange={(e) => setPerformanceFormData({...performanceFormData, threeMonthReturn: e.target.value})}
                                    placeholder="12.8" 
                                  />
                                </div>
                                <div>
                                  <Label>YTD Return (%)</Label>
                                  <Input 
                                    type="number" 
                                    step="0.01" 
                                    value={userPerformanceMetrics?.ytd_return || performanceFormData.ytdReturn}
                                    onChange={(e) => setPerformanceFormData({...performanceFormData, ytdReturn: e.target.value})}
                                    placeholder="28.4" 
                                  />
                                </div>
                                <div>
                                  <Label>All Time Return (%)</Label>
                                  <Input 
                                    type="number" 
                                    step="0.01" 
                                    value={userPerformanceMetrics?.all_time_return || performanceFormData.allTimeReturn}
                                    onChange={(e) => setPerformanceFormData({...performanceFormData, allTimeReturn: e.target.value})}
                                    placeholder="156.7" 
                                  />
                                </div>
                              </div>
                            </Card>

                            <Card className="p-4">
                              <h4 className="font-semibold mb-3">Investment Goals</h4>
                              <div className="space-y-3">
                                <div>
                                  <Label>Gold Target (oz)</Label>
                                  <Input 
                                    type="number" 
                                    value={userPerformanceMetrics?.gold_target_oz || performanceFormData.goldTargetOz}
                                    onChange={(e) => setPerformanceFormData({...performanceFormData, goldTargetOz: e.target.value})}
                                    placeholder="100" 
                                  />
                                </div>
                                <div>
                                  <Label>Silver Target (oz)</Label>
                                  <Input 
                                    type="number" 
                                    value={userPerformanceMetrics?.silver_target_oz || performanceFormData.silverTargetOz}
                                    onChange={(e) => setPerformanceFormData({...performanceFormData, silverTargetOz: e.target.value})}
                                    placeholder="500" 
                                  />
                                </div>
                                <div>
                                  <Label>Platinum Target (oz)</Label>
                                  <Input 
                                    type="number" 
                                    value={userPerformanceMetrics?.platinum_target_oz || performanceFormData.platinumTargetOz}
                                    onChange={(e) => setPerformanceFormData({...performanceFormData, platinumTargetOz: e.target.value})}
                                    placeholder="50" 
                                  />
                                </div>
                                <div>
                                  <Label>Portfolio Target ($)</Label>
                                  <Input 
                                    type="number" 
                                    value={userPerformanceMetrics?.portfolio_target_value || performanceFormData.portfolioTargetValue}
                                    onChange={(e) => setPerformanceFormData({...performanceFormData, portfolioTargetValue: e.target.value})}
                                    placeholder="15000000" 
                                  />
                                </div>
                                <div>
                                  <Label>Target Date</Label>
                                  <Input 
                                    type="date" 
                                    value={userPerformanceMetrics?.target_date ? new Date(userPerformanceMetrics.target_date).toISOString().slice(0, 10) : performanceFormData.targetDate}
                                    onChange={(e) => setPerformanceFormData({...performanceFormData, targetDate: e.target.value})}
                                  />
                                </div>
                              </div>
                            </Card>
                          </div>

                          <Button onClick={handleSavePerformanceMetrics} className="w-full">
                            Save Performance Metrics
                          </Button>

                          {userPerformanceMetrics && (
                            <Card className="p-4">
                              <h4 className="font-semibold mb-3">Current Performance Summary</h4>
                              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <div className="text-center">
                                  <p className="text-sm text-muted-foreground">1 Month</p>
                                  <p className="text-2xl font-bold text-green-600">+{userPerformanceMetrics.one_month_return || 0}%</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm text-muted-foreground">3 Month</p>
                                  <p className="text-2xl font-bold text-green-600">+{userPerformanceMetrics.three_month_return || 0}%</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm text-muted-foreground">YTD</p>
                                  <p className="text-2xl font-bold text-green-600">+{userPerformanceMetrics.ytd_return || 0}%</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm text-muted-foreground">All Time</p>
                                  <p className="text-2xl font-bold text-green-600">+{userPerformanceMetrics.all_time_return || 0}%</p>
                                </div>
                              </div>
                            </Card>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="risk-admin" className="space-y-6 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Risk Analysis Configuration</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="grid gap-4 md:grid-cols-2">
                            <Card className="p-4">
                              <h4 className="font-semibold mb-3">Risk Profile</h4>
                              <div className="space-y-3">
                                <div>
                                  <Label>Risk Tolerance</Label>
                                  <Select 
                                    value={userRiskProfile?.risk_tolerance || riskFormData.riskTolerance}
                                    onValueChange={(value) => setRiskFormData({...riskFormData, riskTolerance: value})}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select risk level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="conservative">Conservative</SelectItem>
                                      <SelectItem value="moderate">Moderate</SelectItem>
                                      <SelectItem value="aggressive">Aggressive</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Volatility Comfort (0-10)</Label>
                                  <Input 
                                    type="number" 
                                    step="0.1" 
                                    value={userRiskProfile?.volatility_comfort || riskFormData.volatilityComfort}
                                    onChange={(e) => setRiskFormData({...riskFormData, volatilityComfort: e.target.value})}
                                    placeholder="5.0" 
                                  />
                                </div>
                                <div>
                                  <Label>Diversification Score (0-100)</Label>
                                  <Input 
                                    type="number" 
                                    value={userRiskProfile?.diversification_score || riskFormData.diversificationScore}
                                    onChange={(e) => setRiskFormData({...riskFormData, diversificationScore: e.target.value})}
                                    placeholder="75" 
                                  />
                                </div>
                                <div>
                                  <Label>Market Correlation (-1 to 1)</Label>
                                  <Input 
                                    type="number" 
                                    step="0.01" 
                                    min="-1" 
                                    max="1"
                                    value={userRiskProfile?.market_correlation || riskFormData.marketCorrelation}
                                    onChange={(e) => setRiskFormData({...riskFormData, marketCorrelation: e.target.value})}
                                    placeholder="0.65" 
                                  />
                                </div>
                              </div>
                            </Card>

                            <Card className="p-4">
                              <h4 className="font-semibold mb-3">Risk Notes</h4>
                              <div className="space-y-3">
                                <div>
                                  <Label>Additional Notes</Label>
                                  <Textarea 
                                    value={userRiskProfile?.notes || riskFormData.notes}
                                    onChange={(e) => setRiskFormData({...riskFormData, notes: e.target.value})}
                                    placeholder="Add any additional risk assessment notes..."
                                    rows={10}
                                  />
                                </div>
                              </div>
                            </Card>
                          </div>

                          <Button onClick={handleSaveRiskProfile} className="w-full">
                            Save Risk Profile
                          </Button>
                          
                          {userRiskProfile && (
                            <Card className="p-4">
                              <h4 className="font-semibold mb-3">Current Risk Profile Summary</h4>
                              <div className="grid gap-4 md:grid-cols-4">
                                <div className="text-center">
                                  <p className="text-sm text-muted-foreground">Risk Tolerance</p>
                                  <p className="text-lg font-bold capitalize">{userRiskProfile.risk_tolerance}</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm text-muted-foreground">Volatility Comfort</p>
                                  <p className="text-lg font-bold">{userRiskProfile.volatility_comfort}/10</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm text-muted-foreground">Diversification</p>
                                  <p className="text-lg font-bold">{userRiskProfile.diversification_score}/100</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm text-muted-foreground">Market Correlation</p>
                                  <p className="text-lg font-bold">{userRiskProfile.market_correlation}</p>
                                </div>
                              </div>
                            </Card>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="insights-admin" className="space-y-6 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>AI Insights Management for {allUsers.find(u => u.user_id === selectedUserId)?.full_name}</span>
                          <Button onClick={() => setIsInsightDialogOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Insight
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <Card className="p-4">
                            <h4 className="font-semibold mb-3">Create Recommendation</h4>
                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <Label>Recommendation Type</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="diversification">Diversification</SelectItem>
                                    <SelectItem value="market-timing">Market Timing</SelectItem>
                                    <SelectItem value="tax-optimization">Tax Optimization</SelectItem>
                                    <SelectItem value="rebalancing">Rebalancing</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>Priority Level</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="mt-4 space-y-3">
                              <div>
                                <Label>Title</Label>
                                <Input placeholder="Recommendation title..." />
                              </div>
                              <div>
                                <Label>Description</Label>
                                <Textarea placeholder="Detailed recommendation description..." />
                              </div>
                              <div>
                                <Label>Suggested Action</Label>
                                <Input placeholder="Action to take..." />
                              </div>
                            </div>
                            <Button className="mt-4">Create Recommendation</Button>
                          </Card>

                          <div className="grid gap-4 md:grid-cols-2">
                            <Card className="p-4">
                              <h4 className="font-semibold mb-3">Market Sentiment Settings</h4>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span>Gold Sentiment</span>
                                  <Select>
                                    <SelectTrigger className="w-32">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="bullish">Bullish</SelectItem>
                                      <SelectItem value="neutral">Neutral</SelectItem>
                                      <SelectItem value="bearish">Bearish</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Silver Sentiment</span>
                                  <Select>
                                    <SelectTrigger className="w-32">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="bullish">Bullish</SelectItem>
                                      <SelectItem value="neutral">Neutral</SelectItem>
                                      <SelectItem value="bearish">Bearish</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Platinum Sentiment</span>
                                  <Select>
                                    <SelectTrigger className="w-32">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="bullish">Bullish</SelectItem>
                                      <SelectItem value="neutral">Neutral</SelectItem>
                                      <SelectItem value="bearish">Bearish</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </Card>

                            <Card className="p-4">
                              <h4 className="font-semibold mb-3">Portfolio Scoring</h4>
                              <div className="space-y-3">
                                <div>
                                  <Label>Overall Score (0-10)</Label>
                                  <Input type="number" min="0" max="10" step="0.1" placeholder="8.5" />
                                </div>
                                <div>
                                  <Label>Diversification Score (0-10)</Label>
                                  <Input type="number" min="0" max="10" step="0.1" placeholder="9.0" />
                                </div>
                                <div>
                                  <Label>Risk Management Score (0-10)</Label>
                                  <Input type="number" min="0" max="10" step="0.1" placeholder="8.0" />
                                </div>
                                <div>
                                  <Label>Performance Score (0-10)</Label>
                                  <Input type="number" min="0" max="10" step="0.1" placeholder="8.5" />
                                </div>
                              </div>
                            </Card>
                          </div>

                          <Card className="p-4">
                            <h4 className="font-semibold mb-3">Active AI Insights</h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Type</TableHead>
                                  <TableHead>Metal Focus</TableHead>
                                  <TableHead>Recommendation</TableHead>
                                  <TableHead>Confidence</TableHead>
                                  <TableHead>Priority</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {userAIInsights.length > 0 ? userAIInsights.map((insight) => (
                                  <TableRow key={insight.id}>
                                    <TableCell>
                                      <Badge variant="outline" className="capitalize">
                                        {insight.insight_type.replace('_', ' ')}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="capitalize">{insight.metal_focus || 'All'}</TableCell>
                                    <TableCell className="max-w-xs truncate">{insight.recommendation}</TableCell>
                                    <TableCell>{insight.confidence_score}%</TableCell>
                                    <TableCell>
                                      <Badge variant={insight.priority === 1 ? 'destructive' : insight.priority === 2 ? 'default' : 'secondary'}>
                                        {insight.priority === 1 ? 'High' : insight.priority === 2 ? 'Medium' : 'Low'}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant={insight.is_active ? 'default' : 'secondary'}>
                                        {insight.is_active ? 'Active' : 'Inactive'}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex gap-1">
                                        <Button 
                                          size="sm" 
                                          variant="outline"
                                          onClick={() => handleToggleAIInsight(insight.id, insight.is_active)}
                                        >
                                          {insight.is_active ? 'Deactivate' : 'Activate'}
                                        </Button>
                                        <Button 
                                          size="sm" 
                                          variant="destructive"
                                          onClick={() => handleDeleteAIInsight(insight.id)}
                                        >
                                          Delete
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                )) : (
                                  <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8">
                                      <p className="text-muted-foreground">No AI insights found for this user.</p>
                                      <Button onClick={() => setIsInsightDialogOpen(true)} className="mt-2">
                                        Create First Insight
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </Card>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="tools-admin" className="space-y-6 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Investment Tools Configuration</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="grid gap-6 md:grid-cols-2">
                            <Card className="p-4">
                              <h4 className="font-semibold mb-3">Calculator Settings</h4>
                              <div className="space-y-3">
                                <div>
                                  <Label>Default Expected Return (%)</Label>
                                  <Input 
                                    type="number" 
                                    step="0.1"
                                    value={userToolSettings?.calculator_expected_return || '8.0'}
                                    onChange={(e) => setUserToolSettings({...userToolSettings, calculator_expected_return: e.target.value})}
                                    placeholder="8.0" 
                                  />
                                </div>
                                <div>
                                  <Label>Default Time Horizon (years)</Label>
                                  <Input 
                                    type="number"
                                    value={userToolSettings?.calculator_time_horizon || '10'}
                                    onChange={(e) => setUserToolSettings({...userToolSettings, calculator_time_horizon: e.target.value})}
                                    placeholder="10" 
                                  />
                                </div>
                                <div>
                                  <Label>Minimum Investment ($)</Label>
                                  <Input 
                                    type="number"
                                    value={userToolSettings?.minimum_investment || '1000'}
                                    onChange={(e) => setUserToolSettings({...userToolSettings, minimum_investment: e.target.value})}
                                    placeholder="1000" 
                                  />
                                </div>
                                <div>
                                  <Label>Maximum Investment ($)</Label>
                                  <Input 
                                    type="number"
                                    value={userToolSettings?.maximum_investment || '10000000'}
                                    onChange={(e) => setUserToolSettings({...userToolSettings, maximum_investment: e.target.value})}
                                    placeholder="10000000" 
                                  />
                                </div>
                              </div>
                            </Card>

                            <Card className="p-4">
                              <h4 className="font-semibold mb-3">Rebalancing Settings</h4>
                              <div className="space-y-3">
                                <div>
                                  <Label>Default Gold Target (%)</Label>
                                  <Input 
                                    type="number"
                                    value={userToolSettings?.gold_target_percentage || '60'}
                                    onChange={(e) => setUserToolSettings({...userToolSettings, gold_target_percentage: e.target.value})}
                                    placeholder="60" 
                                  />
                                </div>
                                <div>
                                  <Label>Default Silver Target (%)</Label>
                                  <Input 
                                    type="number"
                                    value={userToolSettings?.silver_target_percentage || '25'}
                                    onChange={(e) => setUserToolSettings({...userToolSettings, silver_target_percentage: e.target.value})}
                                    placeholder="25" 
                                  />
                                </div>
                                <div>
                                  <Label>Default Platinum Target (%)</Label>
                                  <Input 
                                    type="number"
                                    value={userToolSettings?.platinum_target_percentage || '15'}
                                    onChange={(e) => setUserToolSettings({...userToolSettings, platinum_target_percentage: e.target.value})}
                                    placeholder="15" 
                                  />
                                </div>
                                <div>
                                  <Label>Rebalance Threshold (%)</Label>
                                  <Input 
                                    type="number"
                                    value={userToolSettings?.rebalance_threshold || '5'}
                                    onChange={(e) => setUserToolSettings({...userToolSettings, rebalance_threshold: e.target.value})}
                                    placeholder="5" 
                                  />
                                </div>
                              </div>
                            </Card>
                          </div>

                          <Card className="p-4">
                            <h4 className="font-semibold mb-3">Price Alert Settings</h4>
                            <div className="space-y-4">
                              <div className="grid gap-4 md:grid-cols-3">
                                <div>
                                  <Label>Gold Price Alert ($)</Label>
                                  <Input 
                                    type="number" 
                                    step="0.01"
                                    value={userToolSettings?.gold_price_alert || ''}
                                    onChange={(e) => setUserToolSettings({...userToolSettings, gold_price_alert: e.target.value})}
                                    placeholder="2500.00" 
                                  />
                                </div>
                                <div>
                                  <Label>Silver Price Alert ($)</Label>
                                  <Input 
                                    type="number" 
                                    step="0.01"
                                    value={userToolSettings?.silver_price_alert || ''}
                                    onChange={(e) => setUserToolSettings({...userToolSettings, silver_price_alert: e.target.value})}
                                    placeholder="35.00" 
                                  />
                                </div>
                                <div>
                                  <Label>Platinum Price Alert ($)</Label>
                                  <Input 
                                    type="number" 
                                    step="0.01"
                                    value={userToolSettings?.platinum_price_alert || ''}
                                    onChange={(e) => setUserToolSettings({...userToolSettings, platinum_price_alert: e.target.value})}
                                    placeholder="1000.00" 
                                  />
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center space-x-2">
                                  <Switch 
                                    checked={userToolSettings?.email_alerts_enabled ?? true}
                                    onCheckedChange={(checked) => setUserToolSettings({...userToolSettings, email_alerts_enabled: checked})}
                                  />
                                  <Label>Enable email alerts</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Switch 
                                    checked={userToolSettings?.push_notifications_enabled ?? true}
                                    onCheckedChange={(checked) => setUserToolSettings({...userToolSettings, push_notifications_enabled: checked})}
                                  />
                                  <Label>Enable push notifications</Label>
                                </div>
                              </div>
                            </div>
                          </Card>

                          <Button onClick={handleSaveToolSettings} className="w-full">
                            Save Tools Configuration
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="actions-admin" className="space-y-6 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>User Actions Management</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="grid gap-6 md:grid-cols-2">
                            <Card className="p-4">
                              <h4 className="font-semibold mb-3">Account Actions</h4>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span>Allow Deposit Requests</span>
                                  <Switch 
                                    checked={userActionPermissions?.allow_deposit_requests ?? true}
                                    onCheckedChange={(checked) => setUserActionPermissions({...userActionPermissions, allow_deposit_requests: checked})}
                                  />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Allow Withdrawal Requests</span>
                                  <Switch 
                                    checked={userActionPermissions?.allow_withdrawal_requests ?? true}
                                    onCheckedChange={(checked) => setUserActionPermissions({...userActionPermissions, allow_withdrawal_requests: checked})}
                                  />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Auto-approve Small Deposits</span>
                                  <Switch 
                                    checked={userActionPermissions?.auto_approve_deposits ?? false}
                                    onCheckedChange={(checked) => setUserActionPermissions({...userActionPermissions, auto_approve_deposits: checked})}
                                  />
                                </div>
                                <div>
                                  <Label>Auto-approve Limit ($)</Label>
                                  <Input 
                                    type="number"
                                    value={userActionPermissions?.auto_approve_limit || '10000'}
                                    onChange={(e) => setUserActionPermissions({...userActionPermissions, auto_approve_limit: e.target.value})}
                                    placeholder="10000" 
                                  />
                                </div>
                              </div>
                            </Card>

                            <Card className="p-4">
                              <h4 className="font-semibold mb-3">Report Access</h4>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span>Monthly Reports</span>
                                  <Switch 
                                    checked={userActionPermissions?.monthly_reports_access ?? true}
                                    onCheckedChange={(checked) => setUserActionPermissions({...userActionPermissions, monthly_reports_access: checked})}
                                  />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Tax Reports</span>
                                  <Switch 
                                    checked={userActionPermissions?.tax_reports_access ?? true}
                                    onCheckedChange={(checked) => setUserActionPermissions({...userActionPermissions, tax_reports_access: checked})}
                                  />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Holdings Analysis</span>
                                  <Switch 
                                    checked={userActionPermissions?.holdings_analysis_access ?? true}
                                    onCheckedChange={(checked) => setUserActionPermissions({...userActionPermissions, holdings_analysis_access: checked})}
                                  />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Performance Reports</span>
                                  <Switch 
                                    checked={userActionPermissions?.performance_reports_access ?? true}
                                    onCheckedChange={(checked) => setUserActionPermissions({...userActionPermissions, performance_reports_access: checked})}
                                  />
                                </div>
                              </div>
                            </Card>
                          </div>

                          <Card className="p-4">
                            <h4 className="font-semibold mb-3">Notification Settings</h4>
                            <div className="space-y-4">
                              <div className="grid gap-4 md:grid-cols-2">
                                <div className="flex items-center justify-between">
                                  <span>Price Alerts Enabled</span>
                                  <Switch 
                                    checked={userActionPermissions?.price_alerts_enabled ?? true}
                                    onCheckedChange={(checked) => setUserActionPermissions({...userActionPermissions, price_alerts_enabled: checked})}
                                  />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Market News Notifications</span>
                                  <Switch 
                                    checked={userActionPermissions?.market_news_notifications ?? true}
                                    onCheckedChange={(checked) => setUserActionPermissions({...userActionPermissions, market_news_notifications: checked})}
                                  />
                                </div>
                              </div>
                            </div>
                          </Card>

                          <Card className="p-4">
                            <h4 className="font-semibold mb-3">Support & Settings Access</h4>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span>Live Chat Support</span>
                                <Switch 
                                  checked={userActionPermissions?.live_chat_support ?? true}
                                  onCheckedChange={(checked) => setUserActionPermissions({...userActionPermissions, live_chat_support: checked})}
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Phone Support</span>
                                <Switch 
                                  checked={userActionPermissions?.phone_support ?? true}
                                  onCheckedChange={(checked) => setUserActionPermissions({...userActionPermissions, phone_support: checked})}
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Account Settings Access</span>
                                <Switch 
                                  checked={userActionPermissions?.account_settings_access ?? true}
                                  onCheckedChange={(checked) => setUserActionPermissions({...userActionPermissions, account_settings_access: checked})}
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Goal Setting Access</span>
                                <Switch 
                                  checked={userActionPermissions?.goal_setting_access ?? true}
                                  onCheckedChange={(checked) => setUserActionPermissions({...userActionPermissions, goal_setting_access: checked})}
                                />
                              </div>
                            </div>
                          </Card>

                          <Button onClick={handleSaveActionPermissions} className="w-full">
                            Save Action Permissions
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Product Management
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button onClick={() => setIsBulkProductUploadDialogOpen(true)}>
                      <Upload className="h-4 w-4 mr-2" />
                      Bulk Upload
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteAllStripeProducts}
                      disabled={deletingAllProducts}
                    >
                      <X className="h-4 w-4 mr-2" />
                      {deletingAllProducts ? 'Deleting...' : 'Delete All Stripe Products'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Manage all products in your catalog. You can edit, deactivate, or delete products.
                    </p>
                    <Badge variant="outline">
                      {products.length} Products
                    </Badge>
                  </div>
                  
                  {products.length === 0 ? (
                    <div className="text-center py-8">
                      <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
                      <p className="text-muted-foreground mb-4">
                        Start by uploading products using the bulk upload feature.
                      </p>
                      <Button onClick={() => setIsBulkProductUploadDialogOpen(true)}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Products
                      </Button>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Metal Type</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Weight</TableHead>
                            <TableHead>Brand</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {products.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  {product.image_url && (
                                    <img 
                                      src={product.image_url} 
                                      alt={product.name}
                                      className="w-10 h-10 rounded object-cover"
                                    />
                                  )}
                                  <div>
                                    <div className="font-medium">{product.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {product.category} • {product.purity}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {product.metal_type || 'Gold'}
                                </Badge>
                              </TableCell>
                              <TableCell>${product.price_usd?.toFixed(2) || '0.00'}</TableCell>
                              <TableCell>{product.weight || 'N/A'}</TableCell>
                              <TableCell>{product.brand || 'Unknown'}</TableCell>
                              <TableCell>
                                <Badge variant={product.is_active ? 'default' : 'secondary'}>
                                  {product.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditProduct(product)}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleToggleProductStatus(product.id, product.is_active)}
                                  >
                                    {product.is_active ? 'Deactivate' : 'Activate'}
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteProduct(product.id)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Investment Account Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (open) {
            fetchAllUsers();
          }
        }}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Investment Account</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-user-select">Select User</Label>
                <Select value={formData.userId} onValueChange={(value) => setFormData({...formData, userId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder={
                      usersLoading ? "Loading users..." : 
                      allUsers.length === 0 ? "No users found" : 
                      "Select a user"
                    } />
                  </SelectTrigger>
                  <SelectContent className="bg-card border border-border shadow-lg z-50 max-h-64">
                    {usersLoading ? (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        Loading users...
                      </div>
                    ) : allUsers.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        No users found
                      </div>
                    ) : (
                      allUsers.map((user) => (
                        <SelectItem 
                          key={user.user_id} 
                          value={user.user_id}
                          className="hover:bg-muted focus:bg-muted cursor-pointer"
                        >
                          {user.full_name || 'Unknown User'} ({user.email || user.user_id.slice(0, 8) + '...'})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="edit-account-type">Account Type</Label>
                <Select value={formData.accountType} onValueChange={(value) => setFormData({...formData, accountType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="platinum">Platinum</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-balance">Balance ($)</Label>
                  <Input
                    id="edit-balance"
                    type="number"
                    step="0.01"
                    value={formData.balance}
                    onChange={(e) => setFormData({...formData, balance: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-gold">Gold Holdings (oz)</Label>
                  <Input
                    id="edit-gold"
                    type="number"
                    step="0.0001"
                    value={formData.goldHoldings}
                    onChange={(e) => setFormData({...formData, goldHoldings: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-silver">Silver Holdings (oz)</Label>
                  <Input
                    id="edit-silver"
                    type="number"
                    step="0.0001"
                    value={formData.silverHoldings}
                    onChange={(e) => setFormData({...formData, silverHoldings: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-platinum">Platinum Holdings (oz)</Label>
                  <Input
                    id="edit-platinum"
                    type="number"
                    step="0.0001"
                    value={formData.platinumHoldings}
                    onChange={(e) => setFormData({...formData, platinumHoldings: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-notes">Notes (Optional)</Label>
                <Textarea
                  id="edit-notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Any additional notes about this account..."
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateAccount} disabled={!formData.userId}>
                  Update Account
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Banner Dialog */}
        <Dialog open={isEditBannerDialogOpen} onOpenChange={(open) => {
          setIsEditBannerDialogOpen(open);
          if (open) {
            fetchAllUsers();
          }
        }}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit User Banner</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-banner-user-select">Select User</Label>
                <Select value={bannerFormData.userId} onValueChange={(value) => setBannerFormData({...bannerFormData, userId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder={
                      usersLoading ? "Loading users..." : 
                      allUsers.length === 0 ? "No users found" : 
                      "Select a user"
                    } />
                  </SelectTrigger>
                  <SelectContent className="bg-card border border-border shadow-lg z-50 max-h-64">
                    {usersLoading ? (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        Loading users...
                      </div>
                    ) : allUsers.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        No users found
                      </div>
                    ) : (
                      allUsers.map((user) => (
                        <SelectItem 
                          key={user.user_id} 
                          value={user.user_id}
                          className="hover:bg-muted focus:bg-muted cursor-pointer"
                        >
                          {user.full_name || 'Unknown User'} ({user.email || user.user_id.slice(0, 8) + '...'})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-banner-title">Banner Title</Label>
                <Input
                  id="edit-banner-title"
                  value={bannerFormData.title}
                  onChange={(e) => setBannerFormData({...bannerFormData, title: e.target.value})}
                  placeholder="Enter banner title..."
                />
              </div>

              <div>
                <Label htmlFor="edit-banner-message">Banner Message</Label>
                <Textarea
                  id="edit-banner-message"
                  value={bannerFormData.message}
                  onChange={(e) => setBannerFormData({...bannerFormData, message: e.target.value})}
                  placeholder="Enter banner message..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-banner-type">Banner Type</Label>
                  <Select value={bannerFormData.bannerType} onValueChange={(value) => setBannerFormData({...bannerFormData, bannerType: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-banner-priority">Priority</Label>
                  <Input
                    id="edit-banner-priority"
                    type="number"
                    min="1"
                    max="10"
                    value={bannerFormData.priority}
                    onChange={(e) => setBannerFormData({...bannerFormData, priority: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-banner-expires">Expires At (Optional)</Label>
                <Input
                  id="edit-banner-expires"
                  type="datetime-local"
                  value={bannerFormData.expiresAt}
                  onChange={(e) => setBannerFormData({...bannerFormData, expiresAt: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditBannerDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpdateBanner} 
                  disabled={!bannerFormData.userId || !bannerFormData.title || !bannerFormData.message}
                >
                  Update Banner
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Bulk Transaction Upload Dialog */}
        <BulkTransactionUpload
          isOpen={isBulkUploadDialogOpen}
          onClose={() => setIsBulkUploadDialogOpen(false)}
          selectedUserId={selectedUserId}
          onSuccess={fetchUserTransactions}
          currentUser={user}
        />

        {/* Bulk Product Upload Dialog */}
        <Dialog open={isBulkProductUploadDialogOpen} onOpenChange={setIsBulkProductUploadDialogOpen}>
          <DialogContent className="max-w-5xl">
            <DialogHeader>
              <DialogTitle>Bulk Product Upload</DialogTitle>
            </DialogHeader>
            <BulkProductUpload />
          </DialogContent>
        </Dialog>

        {/* Edit Product Dialog */}
        <Dialog open={isEditProductDialogOpen} onOpenChange={setIsEditProductDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="product-name">Product Name *</Label>
                  <Input
                    id="product-name"
                    value={productFormData.name}
                    onChange={(e) => setProductFormData({...productFormData, name: e.target.value})}
                    placeholder="Enter product name..."
                  />
                </div>
                <div>
                  <Label htmlFor="product-price">Price (USD) *</Label>
                  <Input
                    id="product-price"
                    type="number"
                    step="0.01"
                    value={productFormData.price_usd}
                    onChange={(e) => setProductFormData({...productFormData, price_usd: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="product-description">Description</Label>
                <Textarea
                  id="product-description"
                  value={productFormData.description}
                  onChange={(e) => setProductFormData({...productFormData, description: e.target.value})}
                  placeholder="Enter product description..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="product-metal-type">Metal Type</Label>
                  <Select value={productFormData.metal_type} onValueChange={(value) => setProductFormData({...productFormData, metal_type: value})}>
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
                  <Label htmlFor="product-category">Category</Label>
                  <Select value={productFormData.category} onValueChange={(value) => setProductFormData({...productFormData, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bar">Bar</SelectItem>
                      <SelectItem value="coin">Coin</SelectItem>
                      <SelectItem value="round">Round</SelectItem>
                      <SelectItem value="jewelry">Jewelry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="product-weight">Weight</Label>
                  <Input
                    id="product-weight"
                    value={productFormData.weight}
                    onChange={(e) => setProductFormData({...productFormData, weight: e.target.value})}
                    placeholder="e.g., 1 oz, 10g"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="product-brand">Brand</Label>
                  <Input
                    id="product-brand"
                    value={productFormData.brand}
                    onChange={(e) => setProductFormData({...productFormData, brand: e.target.value})}
                    placeholder="Enter brand name..."
                  />
                </div>
                <div>
                  <Label htmlFor="product-purity">Purity</Label>
                  <Input
                    id="product-purity"
                    value={productFormData.purity}
                    onChange={(e) => setProductFormData({...productFormData, purity: e.target.value})}
                    placeholder="e.g., .999, 24k"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="product-image-url">Image URL</Label>
                <Input
                  id="product-image-url"
                  value={productFormData.image_url}
                  onChange={(e) => setProductFormData({...productFormData, image_url: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <Label htmlFor="product-url">Product URL</Label>
                <Input
                  id="product-url"
                  value={productFormData.product_url}
                  onChange={(e) => setProductFormData({...productFormData, product_url: e.target.value})}
                  placeholder="https://example.com/product"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="product-active"
                  checked={productFormData.is_active}
                  onCheckedChange={(checked) => setProductFormData({...productFormData, is_active: checked})}
                />
                <Label htmlFor="product-active">Product is active</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => {
                  setIsEditProductDialogOpen(false);
                  setEditingProduct(null);
                  resetProductForm();
                }}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateProduct} disabled={!productFormData.name || !productFormData.price_usd}>
                  Update Product
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Transaction Dialog */}
        <TransactionDialog
          isOpen={isTransactionDialogOpen}
          onClose={() => {
            setIsTransactionDialogOpen(false);
            setEditingTransaction(null);
            setTransactionFormData({
              userId: selectedUserId,
              transactionType: 'buy',
              metalType: 'gold',
              amount: '0.0000',
              pricePerOz: '0.00',
              transactionDate: new Date().toISOString().slice(0, 16),
              status: 'completed',
              notes: ''
            });
          }}
          onSave={editingTransaction ? handleUpdateTransaction : handleCreateTransaction}
          formData={transactionFormData}
          setFormData={setTransactionFormData}
          isEditing={!!editingTransaction}
        />

        {/* AI Insight Dialog */}
        <AIInsightDialog
          isOpen={isInsightDialogOpen}
          onClose={() => {
            setIsInsightDialogOpen(false);
            setInsightFormData({
              userId: selectedUserId,
              insightType: 'buy_signal',
              metalFocus: 'gold',
              confidenceScore: '75',
              recommendation: '',
              reasoning: '',
              isActive: true,
              priority: '1',
              expiresAt: ''
            });
          }}
          onSave={handleCreateAIInsight}
          formData={insightFormData}
          setFormData={setInsightFormData}
        />
      </main>
    </div>
  );
}