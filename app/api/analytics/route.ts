import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, runQuery } from '../../../lib/database';

export async function GET() {
  try {
    await initializeDatabase();
    
    // Get total orders
    const totalOrders = await runQuery(`
      SELECT COUNT(*) as count FROM orders
    `);
    
    // Get pending orders
    const pendingOrders = await runQuery(`
      SELECT COUNT(*) as count FROM orders 
      WHERE status IN ('received', 'preparing')
    `);
    
    // Get completed orders
    const completedOrders = await runQuery(`
      SELECT COUNT(*) as count FROM orders 
      WHERE status = 'completed'
    `);
    
    // Get total revenue
    const totalRevenue = await runQuery(`
      SELECT SUM(total_amount) as total FROM orders 
      WHERE status = 'completed'
    `);
    
    // Get popular items
    const popularItems = await runQuery(`
      SELECT mi.name, SUM(oi.quantity) as total_quantity
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status = 'completed'
      GROUP BY mi.name
      ORDER BY total_quantity DESC
      LIMIT 5
    `);
    
    // Get recent feedback
    const recentFeedback = await runQuery(`
      SELECT f.*, o.order_number
      FROM feedback f
      JOIN orders o ON f.order_id = o.id
      ORDER BY f.created_at DESC
      LIMIT 10
    `);
    
    // Get sales by day (last 7 days)
    const salesByDay = await runQuery(`
      SELECT DATE(created_at) as date, 
             COUNT(*) as orders,
             SUM(total_amount) as revenue
      FROM orders 
      WHERE status = 'completed' 
        AND created_at >= DATE('now', '-7 days')
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);
    
    return NextResponse.json({ 
      success: true, 
      data: {
        total_orders: totalOrders[0]?.count || 0,
        pending_orders: pendingOrders[0]?.count || 0,
        completed_orders: completedOrders[0]?.count || 0,
        total_revenue: totalRevenue[0]?.total || 0,
        popular_items: popularItems,
        recent_feedback: recentFeedback,
        sales_by_day: salesByDay
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
