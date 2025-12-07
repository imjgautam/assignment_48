/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('vendors', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').notNullable().unique();
      table.string('contact_person');
      table.json('tags');
      table.timestamps(true, true);
    })
    .createTable('rfps', function(table) {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.text('description').notNullable();
      table.json('structured_data');
      table.string('status').defaultTo('draft'); // draft, sent, closed
      table.timestamps(true, true);
    })
    .createTable('proposals', function(table) {
      table.increments('id').primary();
      table.integer('rfp_id').unsigned().references('id').inTable('rfps').onDelete('CASCADE');
      table.integer('vendor_id').unsigned().references('id').inTable('vendors').onDelete('CASCADE');
      table.text('content').notNullable();
      table.decimal('price', 14, 2).notNullable();
      table.json('ai_analysis');
      table.integer('score');
      table.string('status').defaultTo('submitted'); // submitted, shortlisted, rejected, accepted
      table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('proposals')
    .dropTableIfExists('rfps')
    .dropTableIfExists('vendors');
};
