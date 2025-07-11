import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, runStatement } from '../../../lib/database';

export async function POST(request: NextRequest) {
  try {
    const { 
      order_id, 
      food_quality_rating, 
      service_speed_rating, 
      value_rating, 
      overall_rating, 
      comments 
    } = await request.json();
    
    await initializeDatabase();
    
    await runStatement(`
      INSERT INTO feedback (
        order_id, food_quality_rating, service_speed_rating, 
        value_rating, overall_rating, comments
      ) VALUES (?, ?, ?, ?, ?, ?)
    `, [order_id, food_quality_rating, service_speed_rating, value_rating, overall_rating, comments]);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Feedback submitted successfully' 
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to submit feedback' 
    }, { status: 500 });
  }
}
