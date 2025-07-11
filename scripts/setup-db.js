const { initializeDatabase } = require('../lib/database')

async function setupDatabase() {
  try {
    await initializeDatabase()
    console.log('Database initialized successfully!')
  } catch (error) {
    console.error('Error initializing database:', error)
  }
  process.exit(0)
}

setupDatabase()
