import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, runStatement } from '@/lib/database';
import { 
  isSupabaseAdminConfigured, 
  updateSupabaseMenuItem, 
  deleteSupabaseMenuItem 
} from '@/lib/supabaseDb';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { is_available } = await request.json();

    if (isSupabaseAdminConfigured()) {
      await updateSupabaseMenuItem(params.id, {
        is_available: Boolean(is_available)
      });
      return NextResponse.json({ success: true, source: 'supabase' });
    }

    await initializeDatabase();
    await runStatement(
      'UPDATE menu_items SET is_available = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [is_available ? 1 : 0, params.id]
    );

    return NextResponse.json({ success: true, source: 'sqlite' });
  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update menu item' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, description, price, category, image_url, is_available } = await request.json();

    if (isSupabaseAdminConfigured()) {
      await updateSupabaseMenuItem(params.id, {
        name,
        description,
        price: parseFloat(price),
        category,
        image_url,
        is_available: Boolean(is_available)
      });
      return NextResponse.json({ success: true, source: 'supabase' });
    }

    await initializeDatabase();
    await runStatement(
      `UPDATE menu_items 
       SET name = ?, description = ?, price = ?, category = ?, image_url = ?, is_available = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [name, description, price, category, image_url, is_available ? 1 : 0, params.id]
    );

    return NextResponse.json({ success: true, source: 'sqlite' });
  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update menu item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (isSupabaseAdminConfigured()) {
      await deleteSupabaseMenuItem(params.id);
      return NextResponse.json({ success: true, source: 'supabase' });
    }

    await initializeDatabase();
    await runStatement('DELETE FROM menu_items WHERE id = ?', [params.id]);

    return NextResponse.json({ success: true, source: 'sqlite' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete menu item' },
      { status: 500 }
    );
  }
}
