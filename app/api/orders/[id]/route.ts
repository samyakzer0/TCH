import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, runStatement } from '../../../../lib/database';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status, estimated_completion_time } = await request.json();
    const orderId = params.id;
    
    await initializeDatabase();
    
    let query = `UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP`;
    const queryParams = [status];
    
    if (estimated_completion_time) {
      query += `, estimated_completion_time = ?`;
      queryParams.push(estimated_completion_time);
    }
    
    query += ` WHERE id = ?`;
    queryParams.push(orderId);
    
    await runStatement(query, queryParams);
    
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
    
    await initializeDatabase();
    
    await runStatement(`
      UPDATE orders 
      SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `, [orderId]);
    
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
