import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
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
  Phone
} from 'lucide-react';

export default function UserDashboard() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [investmentAccounts, setInvestmentAccounts] = useState<any[]>([]);
  const [userBanners, setUserBanners] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchInvestmentAccounts();
      fetchUserBanners();
    }
  }, [user]);

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
          <div className="space-y-4 mb-8">
            {userBanners.map((banner) => (
              <div
                key={banner.id}
                className={`p-4 rounded-lg border-l-4 ${
                  banner.banner_type === 'error'
                    ? 'bg-red-50 border-red-500 text-red-800'
                    : banner.banner_type === 'warning'
                    ? 'bg-yellow-50 border-yellow-500 text-yellow-800'
                    : banner.banner_type === 'success'
                    ? 'bg-green-50 border-green-500 text-green-800'
                    : 'bg-blue-50 border-blue-500 text-blue-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{banner.title}</h3>
                    <p className="mt-1">{banner.message}</p>
                    {banner.expires_at && (
                      <p className="mt-2 text-sm opacity-75">
                        Expires: {new Date(banner.expires_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Priority {banner.priority}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalBalance.toFixed(2)}</div>
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
              <div className="text-2xl font-bold">{totalGoldHoldings.toFixed(4)} oz</div>
              <p className="text-xs text-muted-foreground">
                Silver: {totalSilverHoldings.toFixed(4)} oz | Platinum: {totalPlatinumHoldings.toFixed(4)} oz
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
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="transactions">Transactions</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="market">Market Data</TabsTrigger>
                    <TabsTrigger value="actions">Quick Actions</TabsTrigger>
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
                            <div className="text-2xl font-bold">${Number(account.balance).toFixed(2)}</div>
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
                            <div className="text-xl font-bold">{Number(account.gold_holdings).toFixed(4)} oz</div>
                            <div className="text-xs text-green-600">+2.3% this week</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                              <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                              <span className="text-sm font-medium text-muted-foreground">Silver</span>
                            </div>
                            <div className="text-xl font-bold">{Number(account.silver_holdings).toFixed(4)} oz</div>
                            <div className="text-xs text-red-600">-0.8% this week</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                              <div className="w-3 h-3 bg-gray-600 rounded-full mr-2"></div>
                              <span className="text-sm font-medium text-muted-foreground">Platinum</span>
                            </div>
                            <div className="text-xl font-bold">{Number(account.platinum_holdings).toFixed(4)} oz</div>
                            <div className="text-xs text-green-600">+1.5% this week</div>
                          </div>
                        </div>

                        {/* Portfolio Allocation */}
                        <div className="mt-6 p-4 bg-card rounded-lg">
                          <h5 className="font-medium mb-3 flex items-center gap-2">
                            <PieChart className="h-4 w-4" />
                            Portfolio Allocation
                          </h5>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Gold</span>
                                <span>65%</span>
                              </div>
                              <Progress value={65} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Cash</span>
                                <span>25%</span>
                              </div>
                              <Progress value={25} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Silver</span>
                                <span>7%</span>
                              </div>
                              <Progress value={7} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Platinum</span>
                                <span>3%</span>
                              </div>
                              <Progress value={3} className="h-2" />
                            </div>
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
                                <span>{totalGoldHoldings.toFixed(1)}/100 oz</span>
                              </div>
                              <Progress value={(totalGoldHoldings / 100) * 100} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span>Portfolio Target: $15M</span>
                                <span>${(totalBalance / 1000000).toFixed(1)}M/15M</span>
                              </div>
                              <Progress value={(totalBalance / 15000000) * 100} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span>Silver Target: 500 oz</span>
                                <span>{totalSilverHoldings.toFixed(0)}/500 oz</span>
                              </div>
                              <Progress value={(totalSilverHoldings / 500) * 100} className="h-2" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="market" className="mt-6">
                    <div className="grid gap-4 md:grid-cols-3">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium">Gold Spot Price</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">$2,456.80</div>
                          <div className="flex items-center gap-1 text-sm">
                            <ArrowUpRight className="h-3 w-3 text-green-600" />
                            <span className="text-green-600">+1.2% (+$29.40)</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium">Silver Spot Price</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">$31.24</div>
                          <div className="flex items-center gap-1 text-sm">
                            <ArrowDownRight className="h-3 w-3 text-red-600" />
                            <span className="text-red-600">-0.8% (-$0.24)</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium">Platinum Spot Price</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">$952.10</div>
                          <div className="flex items-center gap-1 text-sm">
                            <ArrowUpRight className="h-3 w-3 text-green-600" />
                            <span className="text-green-600">+0.3% (+$2.85)</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          Market Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 border rounded">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm">Gold reaches new weekly high</span>
                            </div>
                            <span className="text-xs text-muted-foreground">2 hours ago</span>
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                              <span className="text-sm">Silver futures show volatility</span>
                            </div>
                            <span className="text-xs text-muted-foreground">4 hours ago</span>
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="text-sm">Platinum supply report released</span>
                            </div>
                            <span className="text-xs text-muted-foreground">6 hours ago</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
                          <Button className="w-full justify-start" variant="outline">
                            <Plus className="h-4 w-4 mr-2" />
                            Request Deposit
                          </Button>
                          <Button className="w-full justify-start" variant="outline">
                            <Minus className="h-4 w-4 mr-2" />
                            Request Withdrawal
                          </Button>
                          <Button className="w-full justify-start" variant="outline">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            View Detailed Reports
                          </Button>
                          <Button className="w-full justify-start" variant="outline">
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
                          <Button className="w-full justify-start" variant="outline">
                            <Bell className="h-4 w-4 mr-2" />
                            Manage Alerts
                          </Button>
                          <Button className="w-full justify-start" variant="outline">
                            <Phone className="h-4 w-4 mr-2" />
                            Contact Support
                          </Button>
                          <Button className="w-full justify-start" variant="outline">
                            <Settings className="h-4 w-4 mr-2" />
                            Account Settings
                          </Button>
                          <Button className="w-full justify-start" variant="outline">
                            <Target className="h-4 w-4 mr-2" />
                            Set Investment Goals
                          </Button>
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
      </main>
    </div>
  );
}