import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, runStatement } from '../../../lib/database';
import { 
  isSupabaseAdminConfigured, 
  submitSupabaseFeedback 
} from '../../../lib/supabaseDb';

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

    if (isSupabaseAdminConfigured()) {
      await submitSupabaseFeedback({
        order_id: Number(order_id),
        food_quality_rating: Number(food_quality_rating),
        service_speed_rating: Number(service_speed_rating),
        value_rating: Number(value_rating),
        overall_rating: Number(overall_rating),
        comments
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Feedback submitted successfully',
        source: 'supabase'
      });
    }

    // Fallback to SQLite
    await initializeDatabase();
    
    await runStatement(`
      INSERT INTO feedback (
        order_id, food_quality_rating, service_speed_rating, 
        value_rating, overall_rating, comments
      ) VALUES (?, ?, ?, ?, ?, ?)
    `, [order_id, food_quality_rating, service_speed_rating, value_rating, overall_rating, comments]);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Feedback submitted successfully',
      source: 'sqlite'
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to submit feedback' 
    }, { status: 500 });
  }
}
