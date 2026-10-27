/**
 * Migration script: Transfers data from local SQLite database (data/tch.db) to Supabase
 * 
 * Usage:
 *   node scripts/migrate-to-supabase.js
 * 
 * Prerequisites:
 *   NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)
 *   must be configured in .env.local or passed as environment variables.
 */

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env.local if present
const envLocalPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...values] = trimmed.split('=');
      if (key && values.length > 0) {
        process.env[key.trim()] = values.join('=').trim().replace(/^["']|["']$/g, '');
      }
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-ref')) {
  console.error('\n❌ ERROR: Supabase credentials not found.');
  console.error('Please configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) in .env.local\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const dbPath = path.join(__dirname, '..', 'data', 'tch.db');

if (!fs.existsSync(dbPath)) {
  console.error(`❌ SQLite database file not found at: ${dbPath}`);
  process.exit(1);
}

const db = new sqlite3.Database(dbPath);

function querySqlite(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

async function migrate() {
  console.log('🚀 Starting migration from SQLite (tch.db) to Supabase...');
  console.log(`📡 Connecting to Supabase project: ${supabaseUrl}`);

  try {
    // 1. Migrate Admin Users
    console.log('\n[1/5] Migrating admin users...');
    const adminUsers = await querySqlite('SELECT * FROM admin_users');
    for (const u of adminUsers) {
      const { error } = await supabase.from('admin_users').upsert({
        email: u.email,
        password: u.password || null,
        role: u.role || 'staff'
      }, { onConflict: 'email' });
      if (error) console.warn(`  ⚠️ Admin user ${u.email}:`, error.message);
      else console.log(`  ✓ Admin user: ${u.email}`);
    }

    // 2. Migrate Menu Items
    console.log('\n[2/5] Migrating menu items...');
    const menuItems = await querySqlite('SELECT * FROM menu_items');
    for (const item of menuItems) {
      const { error } = await supabase.from('menu_items').upsert({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image_url: item.image_url,
        is_available: item.is_available === 1
      }, { onConflict: 'name' });
      if (error) console.warn(`  ⚠️ Menu item ${item.name}:`, error.message);
      else console.log(`  ✓ Menu item: ${item.name} ($${item.price})`);
    }

    // 3. Migrate Orders
    console.log('\n[3/5] Migrating orders...');
    const orders = await querySqlite('SELECT * FROM orders');
    const orderIdMap = new Map(); // sqlite order id -> supabase order id

    for (const order of orders) {
      const { data, error } = await supabase.from('orders').upsert({
        order_number: order.order_number,
        customer_name: order.customer_name,
        customer_phone: order.customer_phone,
        customer_email: order.customer_email,
        order_type: order.order_type,
        table_number: order.table_number,
        status: order.status,
        total_amount: order.total_amount,
        special_instructions: order.special_instructions,
        estimated_completion_time: order.estimated_completion_time
      }, { onConflict: 'order_number' }).select('id').single();

      if (error) {
        console.warn(`  ⚠️ Order ${order.order_number}:`, error.message);
      } else if (data) {
        orderIdMap.set(order.id, data.id);
        console.log(`  ✓ Order ${order.order_number} (Status: ${order.status})`);
      }
    }

    // 4. Migrate Order Items
    console.log('\n[4/5] Migrating order items...');
    const orderItems = await querySqlite('SELECT * FROM order_items');
    for (const oi of orderItems) {
      const newOrderId = orderIdMap.get(oi.order_id);
      if (!newOrderId) continue;

      let customizations = [];
      try {
        customizations = oi.customizations ? JSON.parse(oi.customizations) : [];
      } catch (e) {
        customizations = [oi.customizations];
      }

      const { error } = await supabase.from('order_items').insert({
        order_id: newOrderId,
        menu_item_id: oi.menu_item_id,
        quantity: oi.quantity,
        price: oi.price,
        customizations
      });
      if (error) console.warn(`  ⚠️ Order item ${oi.id}:`, error.message);
    }
    console.log(`  ✓ Migrated ${orderItems.length} order items`);

    // 5. Migrate Feedback
    console.log('\n[5/5] Migrating feedback...');
    const feedbackList = await querySqlite('SELECT * FROM feedback');
    for (const fb of feedbackList) {
      const newOrderId = orderIdMap.get(fb.order_id);
      if (!newOrderId) continue;

      const { error } = await supabase.from('feedback').insert({
        order_id: newOrderId,
        food_quality_rating: fb.food_quality_rating,
        service_speed_rating: fb.service_speed_rating,
        value_rating: fb.value_rating,
        overall_rating: fb.overall_rating,
        comments: fb.comments
      });
      if (error) console.warn(`  ⚠️ Feedback ${fb.id}:`, error.message);
    }
    console.log(`  ✓ Migrated ${feedbackList.length} feedback records`);

    console.log('\n✨ Database migration from SQLite to Supabase completed successfully!\n');
  } catch (err) {
    console.error('\n❌ Migration failed:', err);
  } finally {
    db.close();
  }
}

migrate();
