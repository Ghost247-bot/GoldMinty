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
import { Users, Shield, Database, Activity, Wallet, Plus, MessageSquare, X, Calendar } from 'lucide-react';

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
  const [formData, setFormData] = useState({
    userId: '',
    accountType: 'standard',
    balance: '0.00',
    goldHoldings: '0.0000',
    silverHoldings: '0.0000',
    platinumHoldings: '0.0000',
    notes: ''
  });
  const [bannerFormData, setBannerFormData] = useState({
    userId: '',
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
        profiles!inner(full_name, user_id)
      `)
      .order('created_at', { ascending: false });
    
    if (data) {
      setInvestmentAccounts(data);
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
        userId: '',
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
        userId: '',
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="accounts">Investment Accounts</TabsTrigger>
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {investmentAccounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="font-mono text-sm">
                          {account.account_number}
                        </TableCell>
                        <TableCell>
                          {account.profiles.full_name || 'Unknown'}
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
        </Tabs>
      </main>
    </div>
  );
}