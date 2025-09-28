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
import { Users, Shield, Database, Activity, Wallet, Plus, MessageSquare, X, Calendar, TrendingUp, Settings, Download, BookOpen } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]); // All users for dropdowns
  const [usersLoading, setUsersLoading] = useState(false);
  const [investmentAccounts, setInvestmentAccounts] = useState<any[]>([]);
  const [userBanners, setUserBanners] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEditBannerDialogOpen, setIsEditBannerDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [editingBanner, setEditingBanner] = useState<any>(null);
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
  }, []);

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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="accounts">Investment Accounts</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio Management</TabsTrigger>
            <TabsTrigger value="banners">User Banners</TabsTrigger>
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
                        <CardTitle>Portfolio Overview Management</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <Label htmlFor="user-select-portfolio">Select User</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a user to manage" />
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
                            <div>
                              <Label>Quick Actions</Label>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add Holdings
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Activity className="h-4 w-4 mr-1" />
                                  Update Performance
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid gap-4 md:grid-cols-3">
                            <Card className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm text-muted-foreground">Gold Holdings</p>
                                  <p className="text-2xl font-bold">96.0000 oz</p>
                                </div>
                                <Button size="sm" variant="ghost">
                                  <Settings className="h-4 w-4" />
                                </Button>
                              </div>
                            </Card>
                            <Card className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm text-muted-foreground">Silver Holdings</p>
                                  <p className="text-2xl font-bold">0.0000 oz</p>
                                </div>
                                <Button size="sm" variant="ghost">
                                  <Settings className="h-4 w-4" />
                                </Button>
                              </div>
                            </Card>
                            <Card className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm text-muted-foreground">Portfolio Value</p>
                                  <p className="text-2xl font-bold">$11,234,535</p>
                                </div>
                                <Button size="sm" variant="ghost">
                                  <Settings className="h-4 w-4" />
                                </Button>
                              </div>
                            </Card>
                          </div>

                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center justify-between">
                                <span>Portfolio Allocation Settings</span>
                                <Button size="sm">
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add Metal
                                </Button>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                  <Label>Gold Target (%)</Label>
                                  <Input type="number" placeholder="60" />
                                  <Progress value={65} className="h-2" />
                                </div>
                                <div className="space-y-2">
                                  <Label>Silver Target (%)</Label>
                                  <Input type="number" placeholder="25" />
                                  <Progress value={7} className="h-2" />
                                </div>
                                <div className="space-y-2">
                                  <Label>Platinum Target (%)</Label>
                                  <Input type="number" placeholder="15" />
                                  <Progress value={3} className="h-2" />
                                </div>
                              </div>
                              <Button className="mt-4">Save Allocation Settings</Button>
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
                          <span>Transaction Management</span>
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Transaction
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid gap-4 md:grid-cols-4">
                            <div>
                              <Label>Transaction Type</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="buy">Buy</SelectItem>
                                  <SelectItem value="sell">Sell</SelectItem>
                                  <SelectItem value="transfer">Transfer</SelectItem>
                                  <SelectItem value="dividend">Dividend</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Metal Type</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select metal" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="gold">Gold</SelectItem>
                                  <SelectItem value="silver">Silver</SelectItem>
                                  <SelectItem value="platinum">Platinum</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Amount (oz)</Label>
                              <Input type="number" step="0.0001" placeholder="0.0000" />
                            </div>
                            <div>
                              <Label>Price per oz</Label>
                              <Input type="number" step="0.01" placeholder="0.00" />
                            </div>
                          </div>
                          
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <Label>Transaction Date</Label>
                              <Input type="datetime-local" />
                            </div>
                            <div>
                              <Label>Status</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div>
                            <Label>Transaction Notes</Label>
                            <Textarea placeholder="Optional notes about this transaction..." />
                          </div>

                          <div className="flex gap-2">
                            <Button>Create Transaction</Button>
                            <Button variant="outline">Save as Draft</Button>
                          </div>
                        </div>

                        <div className="mt-8">
                          <h4 className="font-semibold mb-4">Recent Transactions</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Metal</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell>Oct 15, 2024</TableCell>
                                <TableCell>
                                  <Badge variant="default">Buy</Badge>
                                </TableCell>
                                <TableCell>Gold</TableCell>
                                <TableCell>2.5000 oz</TableCell>
                                <TableCell>$2,450.00</TableCell>
                                <TableCell>
                                  <Badge variant="default">Completed</Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-1">
                                    <Button size="sm" variant="ghost">Edit</Button>
                                    <Button size="sm" variant="ghost">Delete</Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="performance-admin" className="space-y-6 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Performance Metrics Management</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="grid gap-4 md:grid-cols-2">
                            <Card className="p-4">
                              <h4 className="font-semibold mb-3">Return Settings</h4>
                              <div className="space-y-3">
                                <div>
                                  <Label>1 Month Return (%)</Label>
                                  <Input type="number" step="0.01" placeholder="5.2" />
                                </div>
                                <div>
                                  <Label>3 Month Return (%)</Label>
                                  <Input type="number" step="0.01" placeholder="12.8" />
                                </div>
                                <div>
                                  <Label>YTD Return (%)</Label>
                                  <Input type="number" step="0.01" placeholder="28.4" />
                                </div>
                                <div>
                                  <Label>All Time Return (%)</Label>
                                  <Input type="number" step="0.01" placeholder="156.7" />
                                </div>
                              </div>
                            </Card>

                            <Card className="p-4">
                              <h4 className="font-semibold mb-3">Investment Goals</h4>
                              <div className="space-y-3">
                                <div>
                                  <Label>Gold Target (oz)</Label>
                                  <Input type="number" placeholder="100" />
                                </div>
                                <div>
                                  <Label>Portfolio Target ($)</Label>
                                  <Input type="number" placeholder="15000000" />
                                </div>
                                <div>
                                  <Label>Silver Target (oz)</Label>
                                  <Input type="number" placeholder="500" />
                                </div>
                                <div>
                                  <Label>Target Date</Label>
                                  <Input type="date" />
                                </div>
                              </div>
                            </Card>
                          </div>

                          <Card className="p-4">
                            <h4 className="font-semibold mb-3">Performance History</h4>
                            <div className="space-y-3">
                              <div className="flex gap-2">
                                <Button size="sm">
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add Entry
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Download className="h-4 w-4 mr-1" />
                                  Export Data
                                </Button>
                              </div>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Period</TableHead>
                                    <TableHead>Return %</TableHead>
                                    <TableHead>Portfolio Value</TableHead>
                                    <TableHead>Actions</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  <TableRow>
                                    <TableCell>October 2024</TableCell>
                                    <TableCell className="text-green-600">+5.2%</TableCell>
                                    <TableCell>$11,234,535</TableCell>
                                    <TableCell>
                                      <Button size="sm" variant="ghost">Edit</Button>
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </div>
                          </Card>

                          <Button className="w-full">Update Performance Metrics</Button>
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
                              <h4 className="font-semibold mb-3">Risk Metrics</h4>
                              <div className="space-y-3">
                                <div>
                                  <Label>Portfolio Risk Level</Label>
                                  <Select>
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
                                  <Label>Volatility (30 day) %</Label>
                                  <Input type="number" step="0.1" placeholder="12.3" />
                                </div>
                                <div>
                                  <Label>Value at Risk (1%) %</Label>
                                  <Input type="number" step="0.1" placeholder="8.7" />
                                </div>
                                <div>
                                  <Label>Correlation to S&P 500</Label>
                                  <Input type="number" step="0.01" min="-1" max="1" placeholder="0.45" />
                                </div>
                              </div>
                            </Card>

                            <Card className="p-4">
                              <h4 className="font-semibold mb-3">Risk Parameters</h4>
                              <div className="space-y-3">
                                <div>
                                  <Label>Sharpe Ratio</Label>
                                  <Input type="number" step="0.01" placeholder="1.24" />
                                </div>
                                <div>
                                  <Label>Beta</Label>
                                  <Input type="number" step="0.01" placeholder="0.68" />
                                </div>
                                <div>
                                  <Label>Max Drawdown %</Label>
                                  <Input type="number" step="0.1" placeholder="5.8" />
                                </div>
                                <div>
                                  <Label>Alpha %</Label>
                                  <Input type="number" step="0.01" placeholder="2.3" />
                                </div>
                              </div>
                            </Card>
                          </div>

                          <Card className="p-4">
                            <h4 className="font-semibold mb-3">Risk Warnings & Alerts</h4>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 border rounded">
                                <div>
                                  <span className="font-medium">High Concentration Warning</span>
                                  <p className="text-sm text-muted-foreground">Alert when single metal exceeds 80% allocation</p>
                                </div>
                                <Switch />
                              </div>
                              <div className="flex items-center justify-between p-3 border rounded">
                                <div>
                                  <span className="font-medium">Volatility Alert</span>
                                  <p className="text-sm text-muted-foreground">Notify when volatility exceeds threshold</p>
                                </div>
                                <Switch defaultChecked />
                              </div>
                              <div className="flex items-center justify-between p-3 border rounded">
                                <div>
                                  <span className="font-medium">Drawdown Alert</span>
                                  <p className="text-sm text-muted-foreground">Alert when portfolio drawdown is significant</p>
                                </div>
                                <Switch defaultChecked />
                              </div>
                            </div>
                          </Card>

                          <Button className="w-full">Save Risk Configuration</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="insights-admin" className="space-y-6 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>AI Insights Management</span>
                          <Button>
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
                            <h4 className="font-semibold mb-3">Active Recommendations</h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Type</TableHead>
                                  <TableHead>Title</TableHead>
                                  <TableHead>Priority</TableHead>
                                  <TableHead>Created</TableHead>
                                  <TableHead>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell>
                                    <Badge variant="outline">Diversification</Badge>
                                  </TableCell>
                                  <TableCell>Consider increasing silver allocation</TableCell>
                                  <TableCell>
                                    <Badge variant="default">Medium</Badge>
                                  </TableCell>
                                  <TableCell>Oct 15, 2024</TableCell>
                                  <TableCell>
                                    <div className="flex gap-1">
                                      <Button size="sm" variant="ghost">Edit</Button>
                                      <Button size="sm" variant="ghost">Delete</Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Card>

                          <Button className="w-full">Save AI Insights Configuration</Button>
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
                                  <Input type="number" step="0.1" placeholder="8.0" />
                                </div>
                                <div>
                                  <Label>Default Time Horizon (years)</Label>
                                  <Input type="number" placeholder="10" />
                                </div>
                                <div>
                                  <Label>Minimum Investment ($)</Label>
                                  <Input type="number" placeholder="1000" />
                                </div>
                                <div>
                                  <Label>Maximum Investment ($)</Label>
                                  <Input type="number" placeholder="10000000" />
                                </div>
                              </div>
                            </Card>

                            <Card className="p-4">
                              <h4 className="font-semibold mb-3">Rebalancing Settings</h4>
                              <div className="space-y-3">
                                <div>
                                  <Label>Default Gold Target (%)</Label>
                                  <Input type="number" placeholder="60" />
                                </div>
                                <div>
                                  <Label>Default Silver Target (%)</Label>
                                  <Input type="number" placeholder="25" />
                                </div>
                                <div>
                                  <Label>Default Platinum Target (%)</Label>
                                  <Input type="number" placeholder="15" />
                                </div>
                                <div>
                                  <Label>Rebalance Threshold (%)</Label>
                                  <Input type="number" placeholder="5" />
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
                                  <Input type="number" step="0.01" placeholder="2500.00" />
                                </div>
                                <div>
                                  <Label>Silver Price Alert ($)</Label>
                                  <Input type="number" step="0.01" placeholder="35.00" />
                                </div>
                                <div>
                                  <Label>Platinum Price Alert ($)</Label>
                                  <Input type="number" step="0.01" placeholder="1000.00" />
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center space-x-2">
                                  <Switch />
                                  <Label>Enable email alerts</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Switch />
                                  <Label>Enable push notifications</Label>
                                </div>
                              </div>
                            </div>
                          </Card>

                          <Card className="p-4">
                            <h4 className="font-semibold mb-3">Educational Resources</h4>
                            <div className="space-y-3">
                              <div className="flex gap-2">
                                <Button size="sm">
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add Resource
                                </Button>
                                <Button size="sm" variant="outline">
                                  <BookOpen className="h-4 w-4 mr-1" />
                                  Manage Library
                                </Button>
                              </div>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  <TableRow>
                                    <TableCell>Precious Metals Investment Guide</TableCell>
                                    <TableCell>PDF</TableCell>
                                    <TableCell>
                                      <Badge variant="default">Active</Badge>
                                    </TableCell>
                                    <TableCell>
                                      <Button size="sm" variant="ghost">Edit</Button>
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </div>
                          </Card>

                          <Button className="w-full">Save Tools Configuration</Button>
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
                                  <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Allow Withdrawal Requests</span>
                                  <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Auto-approve Small Deposits</span>
                                  <Switch />
                                </div>
                                <div>
                                  <Label>Auto-approve Limit ($)</Label>
                                  <Input type="number" placeholder="10000" />
                                </div>
                              </div>
                            </Card>

                            <Card className="p-4">
                              <h4 className="font-semibold mb-3">Report Access</h4>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span>Monthly Reports</span>
                                  <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Tax Reports</span>
                                  <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Holdings Analysis</span>
                                  <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Performance Reports</span>
                                  <Switch defaultChecked />
                                </div>
                              </div>
                            </Card>
                          </div>

                          <Card className="p-4">
                            <h4 className="font-semibold mb-3">Notification Settings</h4>
                            <div className="space-y-4">
                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <Label>Default Price Alerts</Label>
                                  <Select>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select default" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="enabled">Enabled</SelectItem>
                                      <SelectItem value="disabled">Disabled</SelectItem>
                                      <SelectItem value="user-choice">User Choice</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Market News Notifications</Label>
                                  <Select>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select default" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="enabled">Enabled</SelectItem>
                                      <SelectItem value="disabled">Disabled</SelectItem>
                                      <SelectItem value="user-choice">User Choice</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          </Card>

                          <Card className="p-4">
                            <h4 className="font-semibold mb-3">Support & Settings Access</h4>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span>Live Chat Support</span>
                                <Switch defaultChecked />
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Phone Support</span>
                                <Switch defaultChecked />
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Account Settings Access</span>
                                <Switch defaultChecked />
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Goal Setting Access</span>
                                <Switch defaultChecked />
                              </div>
                            </div>
                          </Card>

                          <Card className="p-4">
                            <h4 className="font-semibold mb-3">Pending User Actions</h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>User</TableHead>
                                  <TableHead>Action Type</TableHead>
                                  <TableHead>Amount</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Date</TableHead>
                                  <TableHead>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell>Roger Beaudry</TableCell>
                                  <TableCell>Deposit Request</TableCell>
                                  <TableCell>$50,000</TableCell>
                                  <TableCell>
                                    <Badge variant="secondary">Pending</Badge>
                                  </TableCell>
                                  <TableCell>Oct 15, 2024</TableCell>
                                  <TableCell>
                                    <div className="flex gap-1">
                                      <Button size="sm" variant="default">Approve</Button>
                                      <Button size="sm" variant="destructive">Reject</Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Card>

                          <Button className="w-full">Save Action Settings</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
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
      </main>
    </div>
  );
}