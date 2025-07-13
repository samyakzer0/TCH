import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

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
    
    const { error } = await supabase
      .from('feedback')
      .insert([{
        order_id, 
        food_quality_rating, 
        service_speed_rating, 
        value_rating, 
        overall_rating, 
        comments
      }]);

    if (error) {
      console.error('Error submitting feedback:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to submit feedback' 
      }, { status: 500 });
    }
    
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
