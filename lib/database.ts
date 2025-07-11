import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'tch.db');

export const db = new sqlite3.Database(dbPath);

export function initializeDatabase() {
  return new Promise<void>((resolve, reject) => {
    db.serialize(() => {
      // Menu Items table
      db.run(`
        CREATE TABLE IF NOT EXISTS menu_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          price REAL NOT NULL,
          category TEXT NOT NULL,
          image_url TEXT,
          is_available INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Orders table
      db.run(`
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_number TEXT UNIQUE NOT NULL,
          customer_name TEXT,
          customer_phone TEXT,
          customer_email TEXT,
          order_type TEXT NOT NULL CHECK (order_type IN ('dine-in', 'takeaway')),
          table_number TEXT,
          status TEXT NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'preparing', 'ready', 'completed', 'cancelled')),
          total_amount REAL NOT NULL,
          special_instructions TEXT,
          estimated_completion_time DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Order Items table
      db.run(`
        CREATE TABLE IF NOT EXISTS order_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id INTEGER NOT NULL,
          menu_item_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL,
          price REAL NOT NULL,
          customizations TEXT,
          FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
          FOREIGN KEY (menu_item_id) REFERENCES menu_items (id)
        )
      `);

      // Feedback table
      db.run(`
        CREATE TABLE IF NOT EXISTS feedback (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id INTEGER NOT NULL,
          food_quality_rating INTEGER CHECK (food_quality_rating >= 1 AND food_quality_rating <= 5),
          service_speed_rating INTEGER CHECK (service_speed_rating >= 1 AND service_speed_rating <= 5),
          value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
          overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
          comments TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
        )
      `);

      // Special Offers table
      db.run(`
        CREATE TABLE IF NOT EXISTS special_offers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          is_active INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Admin Users table (simple hardcoded auth)
      db.run(`
        CREATE TABLE IF NOT EXISTS admin_users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('owner', 'staff')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Insert default admin user
      db.run(`
        INSERT OR IGNORE INTO admin_users (email, password, role) 
        VALUES ('admin@thechai.house', 'admin123', 'owner')
      `);

      // Insert sample menu items
      const sampleMenuItems = [
        ['Masala Chai', 'Traditional Indian spiced tea with milk', 2.50, 'Hot Teas', '/images/chai.png'],
        ['Kulhad Chai', 'Authentic clay pot chai experience', 3.00, 'Hot Teas', '/images/kulhad-cup.png'],
        ['Green Tea', 'Fresh green tea with natural antioxidants', 2.00, 'Hot Teas', '/images/tea.png'],
        ['Iced Tea', 'Refreshing cold tea with mint', 2.75, 'Cold Beverages', '/images/tea.png'],
        ['Samosa', 'Crispy pastry with spiced potato filling', 1.50, 'Snacks', '/images/placeholder.txt'],
        ['Pakora', 'Mixed vegetable fritters', 3.00, 'Snacks', '/images/placeholder.txt'],
        ['Sandwich', 'Grilled sandwich with fresh vegetables', 4.50, 'Snacks', '/images/placeholder.txt'],
        ['Biscuits', 'Assorted tea biscuits', 2.00, 'Snacks', '/images/placeholder.txt'],
      ];

      const stmt = db.prepare(`
        INSERT OR IGNORE INTO menu_items (name, description, price, category, image_url) 
        VALUES (?, ?, ?, ?, ?)
      `);

      sampleMenuItems.forEach(item => {
        stmt.run(item);
      });

      stmt.finalize();

      // Insert sample special offer
      db.run(`
        INSERT OR IGNORE INTO special_offers (title, description) 
        VALUES (?, ?)
      `, ['Today\'s Special: Buy 2 Chai, Get 1 Free!', 'Valid for all hot chai varieties']);

      // Add migrations for existing databases
      db.run(`ALTER TABLE orders ADD COLUMN customer_email TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.error('Migration error:', err);
        }
      });

      resolve();
    });
  });
}

export function runQuery(query: string, params: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

export function runStatement(query: string, params: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
}
