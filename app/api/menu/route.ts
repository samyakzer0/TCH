import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, runQuery, runStatement } from '../../../lib/database';
import { 
  isSupabaseAdminConfigured, 
  getSupabaseMenuItems, 
  createSupabaseMenuItem 
} from '../../../lib/supabaseDb';
import { MenuItem } from '../../../types';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const adminView = url.searchParams.get('admin') === 'true';

    if (isSupabaseAdminConfigured()) {
      const categorizedMenu = await getSupabaseMenuItems(adminView);
      return NextResponse.json({
        success: true,
        data: categorizedMenu,
        source: 'supabase'
      });
    }

    // Fallback to SQLite
    await initializeDatabase();
    
    const menuItems = await runQuery(`
      SELECT * FROM menu_items 
      ${adminView ? '' : 'WHERE is_available = 1'}
      ORDER BY category, name
    `) as MenuItem[];

    // Group items by category
    const categorizedMenu = menuItems.reduce((acc: { [key: string]: MenuItem[] }, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});

    return NextResponse.json({ 
      success: true, 
      data: categorizedMenu,
      source: 'sqlite'
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

    if (isSupabaseAdminConfigured()) {
      const result = await createSupabaseMenuItem({
        name,
        description,
        price: parseFloat(price),
        category,
        image_url,
        is_available: is_available !== undefined ? Boolean(is_available) : true
      });

      return NextResponse.json({
        success: true,
        data: { id: result.id },
        source: 'supabase'
      });
    }

    // Fallback to SQLite
    await initializeDatabase();
    
    const result = await runStatement(`
      INSERT INTO menu_items (name, description, price, category, image_url, is_available) 
      VALUES (?, ?, ?, ?, ?, ?)
    `, [name, description, price, category, image_url, is_available ? 1 : 0]);

    return NextResponse.json({ 
      success: true, 
      data: { id: result.id },
      source: 'sqlite'
    });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create menu item' 
    }, { status: 500 });
  }
}
