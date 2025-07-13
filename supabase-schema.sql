-- TCH Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  order_number VARCHAR(100) UNIQUE NOT NULL,
  customer_name VARCHAR(255),
  customer_phone VARCHAR(20),
  customer_email VARCHAR(255),
  order_type VARCHAR(20) NOT NULL CHECK (order_type IN ('dine-in', 'takeaway')),
  table_number VARCHAR(10),
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'received' CHECK (status IN ('received', 'preparing', 'ready', 'completed', 'cancelled')),
  special_instructions TEXT,
  estimated_completion_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id BIGINT REFERENCES menu_items(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  customizations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES orders(id),
  order_number VARCHAR(100),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  customer_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample menu items
INSERT INTO menu_items (name, description, price, category, image_url) VALUES
('Classic Masala Chai', 'Traditional Indian spiced tea with cardamom, cinnamon, and ginger', 4.99, 'Hot Teas', '/images/chai.png'),
('Ginger Chai', 'Strong ginger-infused chai perfect for cold days', 5.49, 'Hot Teas', '/images/chai.png'),
('Cardamom Chai', 'Aromatic chai with extra cardamom pods', 5.29, 'Hot Teas', '/images/chai.png'),
('Kulhad Chai', 'Traditional chai served in clay cups for authentic flavor', 6.99, 'Hot Teas', '/images/kulhad-cup.png'),
('Iced Chai Latte', 'Refreshing cold chai with milk and ice', 5.99, 'Cold Beverages', '/images/tea.png'),
('Cold Coffee', 'Smooth cold brew coffee with milk', 4.79, 'Cold Beverages', '/images/tea.png'),
('Mango Lassi', 'Creamy yogurt drink with fresh mango', 4.99, 'Cold Beverages', '/images/tea.png'),
('Samosa (2 pcs)', 'Crispy pastry filled with spiced potatoes', 6.99, 'Snacks', '/images/placeholder.txt'),
('Pakora Platter', 'Mixed vegetable fritters with chutneys', 8.99, 'Snacks', '/images/placeholder.txt'),
('Biscotti', 'Traditional twice-baked cookies perfect with chai', 3.99, 'Snacks', '/images/placeholder.txt'),
('Aloo Tikki', 'Spiced potato patties with tamarind chutney', 5.99, 'Snacks', '/images/placeholder.txt')
ON CONFLICT (name) DO NOTHING;

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (username, password_hash, email) VALUES
('admin', '$2b$10$x4EZNfcGw8Cxm0H.7LqK6uM8VQFxDhvQxIIrGQAa0zQnKxbGGr3Ia', 'admin@thechaihouse.com')
ON CONFLICT (username) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Enable Row Level Security (RLS)
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to menu items
CREATE POLICY "Public read access for menu_items" ON menu_items
FOR SELECT USING (true);

-- Create policies for public insert/update access to orders
CREATE POLICY "Public access for orders" ON orders
FOR ALL USING (true);

CREATE POLICY "Public access for order_items" ON order_items
FOR ALL USING (true);

CREATE POLICY "Public access for feedback" ON feedback
FOR ALL USING (true);

-- Create policy for admin users (restrict access)
CREATE POLICY "Admin users policy" ON admin_users
FOR ALL USING (auth.role() = 'service_role');

-- Create functions to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_menu_items_updated_at 
    BEFORE UPDATE ON menu_items 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
