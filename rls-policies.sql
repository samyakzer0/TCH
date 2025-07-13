-- RLS Policies for TCH Application
-- Run this in your Supabase SQL Editor

-- Enable RLS on all tables (if not already enabled)
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Menu Items Policies
CREATE POLICY "Allow public read access to menu_items" ON menu_items
FOR SELECT USING (true);

CREATE POLICY "Allow service role to manage menu_items" ON menu_items
FOR ALL USING (auth.role() = 'service_role');

-- Orders Policies
CREATE POLICY "Allow public to create orders" ON orders
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow service role to manage orders" ON orders
FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow users to read their own orders" ON orders
FOR SELECT USING (true);

-- Order Items Policies
CREATE POLICY "Allow public to create order_items" ON order_items
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow service role to manage order_items" ON order_items
FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow users to read order_items" ON order_items
FOR SELECT USING (true);

-- Feedback Policies
CREATE POLICY "Allow public to create feedback" ON feedback
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow service role to manage feedback" ON feedback
FOR ALL USING (auth.role() = 'service_role');

-- Notifications Policies
CREATE POLICY "Allow service role to manage notifications" ON notifications
FOR ALL USING (auth.role() = 'service_role');

-- Admin Users Policies
CREATE POLICY "Allow service role to manage admin_users" ON admin_users
FOR ALL USING (auth.role() = 'service_role');
