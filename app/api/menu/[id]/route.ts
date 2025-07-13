import { NextRequest, NextResponse } from 'next/server'
import supabase, { supabaseAdmin } from '@/lib/supabase'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { is_available } = await request.json()

    const { error } = await supabaseAdmin
      .from('menu_items')
      .update({ 
        is_available,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)

    if (error) {
      console.error('Error updating menu item:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update menu item' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating menu item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update menu item' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, description, price, category, image_url, is_available } = await request.json()

    const { error } = await supabaseAdmin
      .from('menu_items')
      .update({ 
        name, 
        description, 
        price: parseFloat(price), 
        category, 
        image_url, 
        is_available,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)

    if (error) {
      console.error('Error updating menu item:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update menu item' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating menu item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update menu item' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabaseAdmin
      .from('menu_items')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting menu item:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to delete menu item' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting menu item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete menu item' },
      { status: 500 }
    )
  }
}
