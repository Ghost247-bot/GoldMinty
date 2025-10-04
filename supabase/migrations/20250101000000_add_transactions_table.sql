-- Create transactions table for Square payments
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  amount BIGINT NOT NULL, -- Amount in cents
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'square',
  customer_email TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  square_payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for user transactions
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);

-- Create index for payment status
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

-- Create index for created_at for reporting
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policy for users to see their own transactions
CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy for authenticated users to insert transactions
CREATE POLICY "Authenticated users can create transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Create policy for users to update their own transactions
CREATE POLICY "Users can update their own transactions" ON transactions
  FOR UPDATE USING (auth.uid() = user_id);
