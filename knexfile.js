/* 
 * knexfile.js - Knex configuration for FK Systems Africa.
 * Uses environment variables to connect to TiDB/MySQL.
 */

const fs = require('fs');
const path = require('path');

if (process.env.NODE_ENV !== 'production' && fs.existsSync(path.join(__dirname, '.env'))) {
  require('dotenv').config();
}

const sharedConfig = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 4000,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    // TiDB requires SSL - we enable it strictly when the env var is true
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
