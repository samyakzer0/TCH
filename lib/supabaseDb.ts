import { getSupabaseAdmin, isSupabaseAdminConfigured } from './supabaseAdmin';
import { MenuItem, Order, Feedback } from '../types';

export { isSupabaseAdminConfigured };

export async function getSupabaseMenuItems(adminView = false): Promise<{ [key: string]: MenuItem[] }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error('Supabase not configured');

  let query = supabase.from('menu_items').select('*');
  if (!adminView) {
    query = query.eq('is_available', true);
  }
  query = query.order('category', { ascending: true }).order('name', { ascending: true });

  const { data, error } = await query;
  if (error) throw error;

  const grouped = (data || []).reduce((acc: { [key: string]: MenuItem[] }, item: any) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push({
      id: Number(item.id),
      name: item.name,
      description: item.description,
      price: Number(item.price),
      category: item.category,
      image_url: item.image_url,
      is_available: Boolean(item.is_available),
      created_at: item.created_at,
      updated_at: item.updated_at
    });
    return acc;
  }, {});

  return grouped;
}

export async function createSupabaseMenuItem(item: {
  name: string;
  description?: string;
  price: number;
  category: string;
  image_url?: string;
  is_available?: boolean;
}) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error('Supabase not configured');

  const { data, error } = await supabase
    .from('menu_items')
    .insert([{
      name: item.name,
      description: item.description || null,
      price: item.price,
      category: item.category,
      image_url: item.image_url || null,
      is_available: item.is_available !== undefined ? item.is_available : true
    }])
    .select('id')
    .single();

  if (error) throw error;
  return data;
}

export async function updateSupabaseMenuItem(id: string | number, updates: any) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error('Supabase not configured');

  const { data, error } = await supabase
    .from('menu_items')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
  return data;
}

export async function deleteSupabaseMenuItem(id: string | number) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error('Supabase not configured');

  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

export async function getSupabaseOrders(filters: {
  status?: string | null;
  orderNumber?: string | null;
  phone?: string | null;
  limit?: number | null;
}) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error('Supabase not configured');

  let query = supabase.from('orders').select(`
    *,
    items:order_items(
      id,
      order_id,
      menu_item_id,
      quantity,
      price,
      customizations,
      menu_item:menu_items(
        name,
        description,
        price,
        category
      )
    )
  `);

  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  if (filters.orderNumber) {
    query = query.eq('order_number', filters.orderNumber);
  }
  if (filters.phone) {
    query = query.eq('customer_phone', filters.phone);
  }

  query = query.order('created_at', { ascending: false });

  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map((order: any) => ({
    id: Number(order.id),
    order_number: order.order_number,
    customer_name: order.customer_name,
    customer_phone: order.customer_phone,
    customer_email: order.customer_email,
    order_type: order.order_type,
    table_number: order.table_number,
    status: order.status,
    total_amount: Number(order.total_amount),
    special_instructions: order.special_instructions,
    estimated_completion_time: order.estimated_completion_time,
    created_at: order.created_at,
    updated_at: order.updated_at,
    items: (order.items || []).map((item: any) => ({
      id: Number(item.id),
      order_id: Number(item.order_id),
      menu_item_id: Number(item.menu_item_id),
      quantity: Number(item.quantity),
      price: Number(item.price),
      customizations: typeof item.customizations === 'string' 
        ? item.customizations 
        : JSON.stringify(item.customizations || []),
      menu_item: item.menu_item ? {
        name: item.menu_item.name,
        description: item.menu_item.description,
        price: Number(item.menu_item.price),
        category: item.menu_item.category
      } : undefined
    }))
  }));
}

export async function createSupabaseOrder(params: {
  order_number: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  order_type: 'dine-in' | 'takeaway';
  table_number?: string;
  total_amount: number;
  special_instructions?: string;
  items: Array<{
    menu_item_id: number;
    quantity: number;
    price: number;
    customizations?: string[];
  }>;
}) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error('Supabase not configured');

  // Insert order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([{
      order_number: params.order_number,
      customer_name: params.customer_name || null,
      customer_phone: params.customer_phone || null,
      customer_email: params.customer_email || null,
      order_type: params.order_type,
      table_number: params.table_number || null,
      total_amount: params.total_amount,
      special_instructions: params.special_instructions || null,
      status: 'received'
    }])
    .select('id')
    .single();

  if (orderError) throw orderError;

  // Insert order items
  if (params.items && params.items.length > 0) {
    const itemsToInsert = params.items.map(item => ({
      order_id: order.id,
      menu_item_id: item.menu_item_id,
      quantity: item.quantity,
      price: item.price,
      customizations: item.customizations || []
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsToInsert);

    if (itemsError) throw itemsError;
  }

  return { id: Number(order.id) };
}

export async function updateSupabaseOrderStatus(
  orderId: string | number,
  status: string,
  estimated_completion_time?: string
) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error('Supabase not configured');

  const updateData: any = { status };
  if (estimated_completion_time) {
    updateData.estimated_completion_time = estimated_completion_time;
  }

  const { error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId);

  if (error) throw error;
  return true;
}

export async function cancelSupabaseOrder(orderId: string | number) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error('Supabase not configured');

  const { error } = await supabase
    .from('orders')
    .update({ status: 'cancelled' })
    .eq('id', orderId);

  if (error) throw error;
  return true;
}

export async function submitSupabaseFeedback(feedback: {
  order_id: number;
  food_quality_rating?: number;
  service_speed_rating?: number;
  value_rating?: number;
  overall_rating?: number;
  comments?: string;
}) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error('Supabase not configured');

  const { data, error } = await supabase
    .from('feedback')
    .insert([{
      order_id: feedback.order_id,
      food_quality_rating: feedback.food_quality_rating,
      service_speed_rating: feedback.service_speed_rating,
      value_rating: feedback.value_rating,
      overall_rating: feedback.overall_rating,
      comments: feedback.comments
    }])
    .select('id')
    .single();

  if (error) throw error;
  return data;
}

export async function getSupabaseAnalytics() {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error('Supabase not configured');

  // Total orders
  const { count: totalOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  // Pending orders
  const { count: pendingOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .in('status', ['received', 'preparing']);

  // Completed orders
  const { data: completedOrdersData, count: completedOrders } = await supabase
    .from('orders')
    .select('total_amount, created_at')
    .eq('status', 'completed');

  const totalRevenue = (completedOrdersData || []).reduce(
    (sum, o) => sum + (Number(o.total_amount) || 0),
    0
  );

  // Popular items
  const { data: popularData } = await supabase
    .from('order_items')
    .select(`
      quantity,
      menu_items ( name ),
      orders!inner ( status )
    `)
    .eq('orders.status', 'completed');

  const itemCounts: { [name: string]: number } = {};
  (popularData || []).forEach((row: any) => {
    const itemName = row.menu_items?.name;
    if (itemName) {
      itemCounts[itemName] = (itemCounts[itemName] || 0) + Number(row.quantity || 1);
    }
  });

  const popular_items = Object.entries(itemCounts)
    .map(([name, quantity]) => ({ name, total_quantity: quantity }))
    .sort((a, b) => b.total_quantity - a.total_quantity)
    .slice(0, 5);

  // Recent feedback
  const { data: recentFeedback } = await supabase
    .from('feedback')
    .select(`
      *,
      orders ( order_number )
    `)
    .order('created_at', { ascending: false })
    .limit(10);

  const formattedFeedback = (recentFeedback || []).map((fb: any) => ({
    ...fb,
    order_number: fb.orders?.order_number
  }));

  // Sales by day (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const salesMap: { [date: string]: { orders: number; revenue: number } } = {};
  (completedOrdersData || []).forEach((order: any) => {
    const orderDate = new Date(order.created_at);
    if (orderDate >= sevenDaysAgo) {
      const dateKey = orderDate.toISOString().split('T')[0];
      if (!salesMap[dateKey]) {
        salesMap[dateKey] = { orders: 0, revenue: 0 };
      }
      salesMap[dateKey].orders += 1;
      salesMap[dateKey].revenue += Number(order.total_amount || 0);
    }
  });

  const sales_by_day = Object.entries(salesMap)
    .map(([date, data]) => ({
      date,
      orders: data.orders,
      revenue: data.revenue
    }))
    .sort((a, b) => b.date.localeCompare(a.date));

  return {
    total_orders: totalOrders || 0,
    pending_orders: pendingOrders || 0,
    completed_orders: completedOrders || 0,
    total_revenue: totalRevenue || 0,
    popular_items,
    recent_feedback: formattedFeedback,
    sales_by_day
  };
}
