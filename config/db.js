/* 
 * config/db.js - Database connection handler.
 * Initializes Knex, tests the TiDB connection, and exports the instance.
 */

const knex = require('knex');
const knexfile = require('../knexfile');

// Load the configuration based on the current environment (defaults to development)
const environment = process.env.NODE_ENV || 'development';
const config = knexfile[environment];

const db = knex(config);

// Test the connection on startup so you know immediately if TiDB is reachable
db.raw('SELECT 1')
  .then(() => {
    console.log('✅ TiDB / MySQL Database connected successfully');
  })
  .catch((err) => {
    console.error('❌ Database connection failed. Check your .env credentials:', err);
  });

module.exports = db;