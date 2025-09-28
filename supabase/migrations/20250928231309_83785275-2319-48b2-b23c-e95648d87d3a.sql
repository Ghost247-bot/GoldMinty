-- Create user transactions table
CREATE TABLE public.user_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('buy', 'sell', 'transfer', 'dividend')),
  metal_type TEXT NOT NULL CHECK (metal_type IN ('gold', 'silver', 'platinum')),
  amount NUMERIC(15,4) NOT NULL,
  price_per_oz NUMERIC(10,2) NOT NULL,
  total_value NUMERIC(15,2) GENERATED ALWAYS AS (amount * price_per_oz) STORED,
  transaction_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'cancelled')),
  notes TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user performance metrics table
CREATE TABLE public.user_performance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  one_month_return NUMERIC(5,2),
  three_month_return NUMERIC(5,2),
  ytd_return NUMERIC(5,2),
  all_time_return NUMERIC(5,2),
  gold_target_oz NUMERIC(10,4),
  silver_target_oz NUMERIC(10,4),
  platinum_target_oz NUMERIC(10,4),
  portfolio_target_value NUMERIC(15,2),
  target_date DATE,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create user risk profiles table
CREATE TABLE public.user_risk_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  risk_tolerance TEXT NOT NULL DEFAULT 'moderate' CHECK (risk_tolerance IN ('conservative', 'moderate', 'aggressive')),
  volatility_comfort NUMERIC(3,1) DEFAULT 5.0 CHECK (volatility_comfort >= 1 AND volatility_comfort <= 10),
  diversification_score NUMERIC(3,0) DEFAULT 75 CHECK (diversification_score >= 0 AND diversification_score <= 100),
  market_correlation NUMERIC(4,2) DEFAULT 0.65,
  notes TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create user AI insights table
CREATE TABLE public.user_ai_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('buy_signal', 'sell_signal', 'hold_recommendation', 'rebalance_alert', 'market_sentiment')),
  metal_focus TEXT CHECK (metal_focus IN ('gold', 'silver', 'platinum', 'all')),
  confidence_score NUMERIC(3,0) DEFAULT 75 CHECK (confidence_score >= 0 AND confidence_score <= 100),
  recommendation TEXT NOT NULL,
  reasoning TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 10),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user tool settings table
CREATE TABLE public.user_tool_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  calculator_expected_return NUMERIC(4,1) DEFAULT 8.0,
  calculator_time_horizon INTEGER DEFAULT 10,
  minimum_investment NUMERIC(10,2) DEFAULT 1000.00,
  maximum_investment NUMERIC(12,2) DEFAULT 10000000.00,
  gold_target_percentage NUMERIC(3,0) DEFAULT 60,
  silver_target_percentage NUMERIC(3,0) DEFAULT 25,
  platinum_target_percentage NUMERIC(3,0) DEFAULT 15,
  rebalance_threshold NUMERIC(3,0) DEFAULT 5,
  gold_price_alert NUMERIC(8,2),
  silver_price_alert NUMERIC(6,2),
  platinum_price_alert NUMERIC(8,2),
  email_alerts_enabled BOOLEAN DEFAULT true,
  push_notifications_enabled BOOLEAN DEFAULT true,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create user action permissions table
CREATE TABLE public.user_action_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  allow_deposit_requests BOOLEAN DEFAULT true,
  allow_withdrawal_requests BOOLEAN DEFAULT true,
  auto_approve_deposits BOOLEAN DEFAULT false,
  auto_approve_limit NUMERIC(10,2) DEFAULT 10000.00,
  monthly_reports_access BOOLEAN DEFAULT true,
  tax_reports_access BOOLEAN DEFAULT true,
  holdings_analysis_access BOOLEAN DEFAULT true,
  performance_reports_access BOOLEAN DEFAULT true,
  price_alerts_enabled BOOLEAN DEFAULT true,
  market_news_notifications BOOLEAN DEFAULT true,
  live_chat_support BOOLEAN DEFAULT true,
  phone_support BOOLEAN DEFAULT true,
  account_settings_access BOOLEAN DEFAULT true,
  goal_setting_access BOOLEAN DEFAULT true,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.user_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_risk_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tool_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_action_permissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_transactions
CREATE POLICY "Admins can manage all transactions" ON public.user_transactions
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own transactions" ON public.user_transactions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for user_performance_metrics
CREATE POLICY "Admins can manage all performance metrics" ON public.user_performance_metrics
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own performance metrics" ON public.user_performance_metrics
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for user_risk_profiles
CREATE POLICY "Admins can manage all risk profiles" ON public.user_risk_profiles
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own risk profile" ON public.user_risk_profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for user_ai_insights
CREATE POLICY "Admins can manage all AI insights" ON public.user_ai_insights
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own AI insights" ON public.user_ai_insights
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id AND is_active = true AND (expires_at IS NULL OR expires_at > now()));

-- Create RLS policies for user_tool_settings
CREATE POLICY "Admins can manage all tool settings" ON public.user_tool_settings
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can manage their own tool settings" ON public.user_tool_settings
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_action_permissions
CREATE POLICY "Admins can manage all action permissions" ON public.user_action_permissions
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own action permissions" ON public.user_action_permissions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_user_transactions_updated_at
  BEFORE UPDATE ON public.user_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_performance_metrics_updated_at
  BEFORE UPDATE ON public.user_performance_metrics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_risk_profiles_updated_at
  BEFORE UPDATE ON public.user_risk_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_ai_insights_updated_at
  BEFORE UPDATE ON public.user_ai_insights
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_tool_settings_updated_at
  BEFORE UPDATE ON public.user_tool_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_action_permissions_updated_at
  BEFORE UPDATE ON public.user_action_permissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();