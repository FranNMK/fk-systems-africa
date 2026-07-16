/*
 * seeds/seed_admin.js - Creates the first admin user for FK Systems Africa.
 * Run this file once to set up your admin credentials.
 */

const bcrypt = require('bcryptjs');

exports.seed = async function(knex) {
  // Deletes ALL existing admin entries
  await knex('admins').del();

  // Hash a secure password (replace 'YourSecurePassword123!' with your actual desired password)
  const passwordHash = await bcrypt.hash('YourSecurePassword123!', 10);

  // Inserts the admin user
  await knex('admins').insert([
    {
      name: 'FK Systems Admin',
      email: 'admin@fksystems.africa',
      password_hash: passwordHash,
      created_at: new Date(),
      last_login: null
    }
  ]);
};