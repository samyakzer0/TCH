export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  order_type: 'dine-in' | 'takeaway';
  table_number?: string;
  status: 'received' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  total_amount: number;
  special_instructions?: string;
  estimated_completion_time?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  menu_item_id: number;
  quantity: number;
  price: number;
  customizations?: string;
  menu_item?: MenuItem;
}

export interface CartItem {
  menu_item: MenuItem;
  quantity: number;
  customizations: string[];
  notes?: string;
}

export interface Feedback {
  id: number;
  order_id: number;
  food_quality_rating: number;
  service_speed_rating: number;
  value_rating: number;
  overall_rating: number;
  comments?: string;
  created_at: string;
}

export interface SpecialOffer {
  id: number;
  title: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: number;
  email: string;
  password: string;
  role: 'owner' | 'staff';
  created_at: string;
}

export interface OrderNotification {
  order_number: string;
  customer_name?: string;
  customer_phone?: string;
  order_type: string;
  table_number?: string;
  items: {
    name: string;
    quantity: number;
    customizations?: string;
  }[];
  total_amount: number;
  special_instructions?: string;
  created_at: string;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

export interface OrderStats {
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
  total_revenue: number;
  popular_items: {
    name: string;
    quantity: number;
  }[];
}
