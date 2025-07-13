import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { Order, OrderItem, OrderNotification } from '../../../types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');
    const orderNumber = searchParams.get('order_number');
    const phone = searchParams.get('phone');
    
    // Build the query
    let query = supabase.from('orders').select(`
      *,
      order_items (
        *,
        menu_items (name, price)
      )
    `);
    
    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    
    if (orderNumber) {
      query = query.eq('order_number', orderNumber);
    }
    
    if (phone) {
      query = query.eq('customer_phone', phone);
    }
    
    // Apply ordering and limit
    query = query.order('created_at', { ascending: false });
    
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    
    const { data: orders, error } = await query;
    
    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to fetch orders' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data: orders || [] 
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
    
    // Calculate total amount
    const total_amount = items.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity);
    }, 0);
    
    // Generate order number
    const order_number = `TCH-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        order_number, 
        customer_name, 
        customer_phone, 
        customer_email, 
        order_type, 
        table_number, 
        total_amount, 
        special_instructions
      }])
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to create order' 
      }, { status: 500 });
    }
    
    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      menu_item_id: item.menu_item_id,
      quantity: item.quantity,
      price: item.price,
      customizations: JSON.stringify(item.customizations || [])
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to create order items' 
      }, { status: 500 });
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
        order_id: order.id, 
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
