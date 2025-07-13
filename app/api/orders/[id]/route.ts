import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status, estimated_completion_time } = await request.json();
    const orderId = params.id;
    
    const updateData: any = { 
      status,
      updated_at: new Date().toISOString()
    };
    
    if (estimated_completion_time) {
      updateData.estimated_completion_time = estimated_completion_time;
    }
    
    const { error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to update order status' 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Order status updated successfully' 
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update order status' 
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    
    const { error } = await supabase
      .from('orders')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (error) {
      console.error('Error cancelling order:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to cancel order' 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Order cancelled successfully' 
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to cancel order' 
    }, { status: 500 });
  }
}
