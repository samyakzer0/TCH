import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, runQuery } from '../../../../lib/database';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    await initializeDatabase();
    
    const user = await runQuery(`
      SELECT id, email, role FROM admin_users 
      WHERE email = ? AND password = ?
    `, [email, password]);
    
    if (user.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid credentials' 
      }, { status: 401 });
    }
    
    return NextResponse.json({ 
      success: true, 
      data: { 
        user: user[0],
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
