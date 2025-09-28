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
import { supabase } from '@/integrations/supabase/client';
import { Users, Shield, Database, Activity, Wallet, Plus } from 'lucide-react';

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [investmentAccounts, setInvestmentAccounts] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    accountType: 'standard',
    balance: '0.00',
    goldHoldings: '0.0000',
    silverHoldings: '0.0000',
    platinumHoldings: '0.0000',
    notes: ''
  });
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0,
  });

  useEffect(() => {
    fetchUsers();
    fetchStats();
    fetchInvestmentAccounts();
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
                    <TableCell>{user.user_id}</TableCell>
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

        {/* Investment Accounts Management */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Investment Accounts Management
                </CardTitle>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                            <SelectValue placeholder="Select a user" />
                          </SelectTrigger>
                          <SelectContent>
                            {users.map((user) => (
                              <SelectItem key={user.user_id} value={user.user_id}>
                                {user.full_name || 'Unknown'} ({user.user_id})
                              </SelectItem>
                            ))}
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
        </div>
      </main>
    </div>
  );
}