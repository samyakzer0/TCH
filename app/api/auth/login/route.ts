import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    const { data: users, error } = await supabase
      .from('admin_users')
      .select('id, email, role')
      .eq('email', email)
      .eq('password', password);

    if (error) {
      console.error('Error during login:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Login failed' 
      }, { status: 500 });
    }
    
    if (!users || users.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid credentials' 
      }, { status: 401 });
    }
    
    return NextResponse.json({ 
      success: true, 
      data: { 
        user: users[0],
        token: 'dummy-token' // Simple token for demo
      } 
    });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Login failed' 
    }, { status: 500 });
  }
}
