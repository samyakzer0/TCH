import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET() {
  try {
    // Get total orders
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });
    
    // Get pending orders
    const { count: pendingOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .in('status', ['received', 'preparing']);
    
    // Get completed orders
    const { count: completedOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');
    
    // Get total revenue
    const { data: revenueData } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('status', 'completed');
    
    const totalRevenue = revenueData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
    
    // Get popular items
    const { data: popularItems } = await supabase
      .from('order_items')
      .select(`
        quantity,
        menu_items!inner(name),
        orders!inner(status)
      `)
      .eq('orders.status', 'completed');
    
    // Process popular items data
    const itemCounts = popularItems?.reduce((acc: any, item: any) => {
      const name = item.menu_items.name;
      acc[name] = (acc[name] || 0) + item.quantity;
      return acc;
    }, {}) || {};
    
    const popularItemsFormatted = Object.entries(itemCounts)
      .map(([name, total_quantity]) => ({ name, total_quantity }))
      .sort((a: any, b: any) => b.total_quantity - a.total_quantity)
      .slice(0, 5);
    
    // Get recent feedback
    const { data: recentFeedback } = await supabase
      .from('feedback')
      .select(`
        *,
        orders!inner(order_number)
      `)
      .order('created_at', { ascending: false })
      .limit(10);
    
    // Get sales by day (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data: salesData } = await supabase
      .from('orders')
      .select('created_at, total_amount')
      .eq('status', 'completed')
      .gte('created_at', sevenDaysAgo.toISOString());
    
    // Process sales by day
    const salesByDay = salesData?.reduce((acc: any, order: any) => {
      const date = new Date(order.created_at).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, orders: 0, revenue: 0 };
      }
      acc[date].orders += 1;
      acc[date].revenue += order.total_amount || 0;
      return acc;
    }, {}) || {};
    
    const salesByDayFormatted = Object.values(salesByDay).sort((a: any, b: any) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    return NextResponse.json({ 
      success: true, 
      data: {
        total_orders: totalOrders || 0,
        pending_orders: pendingOrders || 0,
        completed_orders: completedOrders || 0,
        total_revenue: totalRevenue,
        popular_items: popularItemsFormatted,
        recent_feedback: recentFeedback || [],
        sales_by_day: salesByDayFormatted
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch analytics' 
    }, { status: 500 });
  }
}
