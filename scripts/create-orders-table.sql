-- Create the orders table in Supabase
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  items JSONB NOT NULL,
  notes TEXT DEFAULT '',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (adjust as needed for production)
CREATE POLICY "Allow all operations on orders" ON orders
  FOR ALL USING (true);

-- Enable real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
