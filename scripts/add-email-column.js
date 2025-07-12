const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'tch.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    return;
  }
  console.log('Connected to SQLite database');
});

// Add customer_email column to orders table
db.run(`ALTER TABLE orders ADD COLUMN customer_email TEXT`, (err) => {
  if (err) {
    if (err.message.includes('duplicate column name')) {
      console.log('Column customer_email already exists');
    } else {
      console.error('Error adding column:', err);
    }
  } else {
    console.log('Successfully added customer_email column to orders table');
  }
  
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed');
    }
  });
});
