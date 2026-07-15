/*
 * migrations/timestamp_create_all_tables.js
 * Creates the normalized database schema for the FK Systems Africa platform.
 */

exports.up = function(knex) {
  return knex.schema
    // 1. Admins Table
    .createTable('admins', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').notNullable().unique();
      table.string('password_hash').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('last_login').nullable();
    })
    // 2. Services Table
    .createTable('services', function(table) {
      table.increments('id').primary();
      table.string('category').notNullable();
      table.string('title').notNullable();
      table.text('description');
      table.integer('display_order').defaultTo(0);
      table.boolean('is_active').defaultTo(true);
    })
    // 3. Projects Table
    .createTable('projects', function(table) {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.text('description');
      table.string('category').notNullable(); // 'own_product', 'client_project', 'event_case_study'
      table.string('tech_stack').nullable();
      table.text('outcome_summary').nullable();
      table.string('client_name').nullable();
      table.boolean('approved_to_publish').defaultTo(false);
      table.string('image_url').nullable();
      table.boolean('featured').defaultTo(false);
      table.integer('display_order').defaultTo(0);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    // 4. Events Table
    .createTable('events', function(table) {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.text('description');
      table.timestamp('event_date').notNullable();
      table.string('location_or_link').nullable();
      table.integer('capacity').defaultTo(0);
      table.string('status').defaultTo('upcoming'); // 'upcoming', 'past', 'cancelled'
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    // 5. Event Registrations Table
    .createTable('event_registrations', function(table) {
      table.increments('id').primary();
      table.integer('event_id').unsigned().notNullable().references('id').inTable('events').onDelete('CASCADE');
      table.string('name').notNullable();
      table.string('email').notNullable();
      table.string('phone').nullable();
      table.timestamp('registered_at').defaultTo(knex.fn.now());
    })
    // 6. Event Feedback Table
    .createTable('event_feedback', function(table) {
      table.increments('id').primary();
      table.integer('event_id').unsigned().notNullable().references('id').inTable('events').onDelete('CASCADE');
      table.integer('rating').notNullable().checkBetween([1, 5]); // 1-5 scale
      table.text('comments').nullable();
      table.timestamp('submitted_at').defaultTo(knex.fn.now());
    })
    // 7. Testimonials Table
    .createTable('testimonials', function(table) {
      table.increments('id').primary();
      table.string('client_name').notNullable();
      table.text('quote').notNullable();
      table.integer('project_id').unsigned().nullable().references('id').inTable('projects').onDelete('SET NULL');
      table.boolean('is_active').defaultTo(true);
    })
    // 8. Contact Submissions Table
    .createTable('contact_submissions', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').notNullable();
      table.text('message').notNullable();
      table.timestamp('submitted_at').defaultTo(knex.fn.now());
      table.boolean('is_read').defaultTo(false);
    })
    // 9. Site Settings Table
    .createTable('site_settings', function(table) {
      table.increments('id').primary();
      table.string('setting_key').notNullable().unique();
      table.text('setting_value').nullable();
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('site_settings')
    .dropTableIfExists('contact_submissions')
    .dropTableIfExists('testimonials')
    .dropTableIfExists('event_feedback')
    .dropTableIfExists('event_registrations')
    .dropTableIfExists('events')
    .dropTableIfExists('projects')
    .dropTableIfExists('services')
    .dropTableIfExists('admins');
};