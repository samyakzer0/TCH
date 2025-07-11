import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, runQuery, runStatement } from '../../../lib/database';
import { v4 as uuidv4 } from 'uuid';
import { Order, OrderItem, OrderNotification } from '../../../types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');
    const orderNumber = searchParams.get('order_number');
    
    await initializeDatabase();
    
    // First get orders
    let orderQuery = `SELECT * FROM orders`;
    const orderParams: any[] = [];
    const conditions: string[] = [];
    
    if (status) {
      conditions.push('status = ?');
      orderParams.push(status);
    }
    
    if (orderNumber) {
      conditions.push('order_number = ?');
      orderParams.push(orderNumber);
    }
    
    if (conditions.length > 0) {
      orderQuery += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    orderQuery += ` ORDER BY created_at DESC`;
    
    if (limit) {
      orderQuery += ` LIMIT ?`;
      orderParams.push(parseInt(limit));
    }
    
    const orders = await runQuery(orderQuery, orderParams) as any[];
    
    // Then get items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await runQuery(`
          SELECT oi.*, mi.name as menu_item_name, mi.description as menu_item_description, 
                 mi.price as menu_item_price, mi.category as menu_item_category
          FROM order_items oi
          JOIN menu_items mi ON oi.menu_item_id = mi.id
          WHERE oi.order_id = ?
        `, [order.id]);
        
        return {
          ...order,
          items: items.map((item: any) => ({
            ...item,
            menu_item: {
              name: item.menu_item_name,
              description: item.menu_item_description,
              price: item.menu_item_price,
              category: item.menu_item_category
            }
          }))
        };
      })
    );

    return NextResponse.json({ 
      success: true, 
      data: ordersWithItems 
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch orders' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      customer_name, 
      customer_phone, 
      customer_email,
      order_type, 
      table_number, 
      items, 
      special_instructions 
    } = await request.json();
    
    await initializeDatabase();
    
    // Calculate total amount
    const total_amount = items.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity);
    }, 0);
    
    // Generate order number
    const order_number = `TCH-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
    // Create order
    const orderResult = await runStatement(`
      INSERT INTO orders (
        order_number, customer_name, customer_phone, customer_email, order_type, 
        table_number, total_amount, special_instructions
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [order_number, customer_name, customer_phone, customer_email, order_type, table_number, total_amount, special_instructions]);
    
    const orderId = orderResult.id;
    
    // Create order items
    for (const item of items) {
      await runStatement(`
        INSERT INTO order_items (order_id, menu_item_id, quantity, price, customizations)
        VALUES (?, ?, ?, ?, ?)
      `, [orderId, item.menu_item_id, item.quantity, item.price, JSON.stringify(item.customizations || [])]);
    }
    
    // Send notification (you can implement email/SMS here)
    const notification: OrderNotification = {
      order_number,
      customer_name,
      customer_phone,
      order_type,
      table_number,
      items: items.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        customizations: item.customizations?.join(', ')
      })),
      total_amount,
      special_instructions,
      created_at: new Date().toISOString()
    };
    
    // Here you would send notification to staff
    console.log('New Order Notification:', notification);
    
    return NextResponse.json({ 
      success: true, 
      data: { 
        order_id: orderId, 
        order_number,
        total_amount,
        estimated_time: '15-20 minutes'
      } 
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create order' 
    }, { status: 500 });
  }
}
