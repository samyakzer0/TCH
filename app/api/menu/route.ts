import { NextRequest, NextResponse } from 'next/server';
import supabase, { supabaseAdmin } from '@/lib/supabase';
import { MenuItem } from '../../../types';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const adminView = url.searchParams.get('admin') === 'true'
    
    let query = supabase
      .from('menu_items')
      .select('*')
      .order('category')
      .order('name')
    
    if (!adminView) {
      query = query.eq('is_available', true)
    }
    
    const { data: menuItems, error } = await query
    
    if (error) {
      console.error('Error fetching menu:', error)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to fetch menu items' 
      }, { status: 500 });
    }

    // Group items by category
    const categorizedMenu = (menuItems || []).reduce((acc: { [key: string]: MenuItem[] }, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});

    return NextResponse.json({ 
      success: true, 
      data: categorizedMenu 
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch menu items' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, price, category, image_url, is_available } = await request.json();
    
    const { data, error } = await supabase
      .from('menu_items')
      .insert([{ 
        name, 
        description, 
        price: parseFloat(price), 
        category, 
        image_url, 
        is_available: is_available || true 
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating menu item:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to create menu item' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data: data 
    });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create menu item' 
    }, { status: 500 });
  }
}
