/* 
 * knexfile.js - Knex configuration for FK Systems Africa.
 * Loads environment variables for connection to TiDB/MySQL.
 * NO dotenv dependency - Railway injects variables directly at runtime.
 */

const sharedConfig = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 4000,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : false
  },
  migrations: {
    directory: './migrations'
  },
  seeds: {
    directory: './seeds'
  }
};

module.exports = {
  development: sharedConfig,
  production: sharedConfig
};

