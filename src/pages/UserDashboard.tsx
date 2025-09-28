import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { User, Settings, CreditCard, TrendingUp, Wallet, AlertCircle } from 'lucide-react';

export default function UserDashboard() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [investmentAccounts, setInvestmentAccounts] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchInvestmentAccounts();
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
                <div className="space-y-4">
                  {investmentAccounts.map((account) => (
                    <div key={account.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{account.account_number}</h4>
                          <Badge variant={account.status === 'active' ? 'default' : 'secondary'}>
                            {account.status}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">${Number(account.balance).toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">{account.account_type}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">Gold</div>
                          <div className="font-medium">{Number(account.gold_holdings).toFixed(4)} oz</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">Silver</div>
                          <div className="font-medium">{Number(account.silver_holdings).toFixed(4)} oz</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">Platinum</div>
                          <div className="font-medium">{Number(account.platinum_holdings).toFixed(4)} oz</div>
                        </div>
                      </div>
                      
                      {account.notes && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="text-sm text-muted-foreground">Notes</div>
                          <div className="text-sm">{account.notes}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
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