import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, runQuery } from '../../../../lib/database';
import { getSupabaseAdmin, isSupabaseAdminConfigured } from '../../../../lib/supabaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const envAdminEmail = process.env.ADMIN_EMAIL || 'admin@thechai.house';
    const envAdminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // 1. Check environment variable credentials
    if (email === envAdminEmail && password === envAdminPassword) {
      return NextResponse.json({
        success: true,
        data: {
          user: {
            id: 1,
            email: envAdminEmail,
            role: 'owner'
          },
          token: 'tch-admin-session-token'
        }
      });
    }

    // 2. If Supabase is configured, check Supabase admin_users table
    if (isSupabaseAdminConfigured()) {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        const { data: adminUser } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', email)
          .maybeSingle();

        if (adminUser) {
          // If in admin_users and matches env password
          if (password === envAdminPassword) {
            return NextResponse.json({
              success: true,
              data: {
                user: {
                  id: adminUser.id,
                  email: adminUser.email,
                  role: adminUser.role || 'staff'
                },
                token: 'tch-supabase-admin-token'
              }
            });
          }
        }
      }
    }

    // 3. Fallback to SQLite check
    await initializeDatabase();
    
    const user = await runQuery(`
      SELECT id, email, role FROM admin_users 
      WHERE email = ? AND password = ?
    `, [email, password]);
    
    if (user.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid email or password' 
      }, { status: 401 });
    }
    
    return NextResponse.json({ 
      success: true, 
      data: { 
        user: user[0],
        token: 'tch-sqlite-session-token'
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
