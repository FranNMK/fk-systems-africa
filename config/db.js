/* 
 * config/db.js - Database connection handler.
 * Initializes Knex with lazy loading - validates env vars exist before creating connection.
 * Railway injects DB credentials at runtime; we access them directly via process.env.
 */

const knex = require('knex');

// Lazy initialization function - called AFTER server boots, ensuring env vars are ready
let db = null;

function initializeDatabase() {
  // Validate all required database environment variables exist
  const requiredVars = ['DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME', 'DB_PORT', 'DB_SSL'];
  const missing = requiredVars.filter(v => !process.env[v]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required database environment variables: ${missing.join(', ')}`);
  }

  const environment = process.env.NODE_ENV || 'development';
  const config = {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 4000,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : false
    },
    pool: {
      min: 2,
      max: 10
    }
  };

  db = knex(config);

  // Test the connection on startup
  return db.raw('SELECT 1')
    .then(() => {
      console.log('✅ TiDB / MySQL Database connected successfully');
      return db;
    })
    .catch((err) => {
      console.error('❌ Database connection failed:', err.message);
      process.exit(1);
    });
}

// Export initialization function and database handle
module.exports = {
  initialize: initializeDatabase,
  getDb: () => {
    if (!db) {
      throw new Error('Database not initialized. Call db.initialize() first.');
    }
    return db;
  }
};