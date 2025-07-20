# Coffee POS System

A modern Point of Sale system for coffee shops built with Next.js and Supabase.

## Features

- 🛒 Customer ordering interface
- 👨‍🍳 Real-time barista dashboard  
- ⚡ Live order updates across devices
- 📱 Mobile-responsive design
- 🎨 Beautiful matcha-themed UI

## Quick Deploy

### Deploy to Vercel
1. Click "Deploy" button in v0 interface
2. Or manually: `vercel --prod`

### Deploy to Netlify
1. Connect your GitHub repo
2. Build command: `npm run build`
3. Publish directory: `.next`

## Environment Variables

Required for multi-device functionality:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

## Database Setup

Run this SQL in your Supabase dashboard:

\`\`\`sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  items JSONB NOT NULL,
  notes TEXT DEFAULT '',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations" ON orders FOR ALL USING (true);
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
\`\`\`

## Usage

1. **Customer Interface**: `/order` - Place orders
2. **Barista Dashboard**: `/barista` - Manage orders
3. **Home**: `/` - Choose interface

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime
- **Deployment**: Vercel/Netlify ready
