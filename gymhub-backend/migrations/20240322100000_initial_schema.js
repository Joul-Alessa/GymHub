export function up(knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').notNullable().unique();
    })
    .createTable('sports', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.boolean('is_system').defaultTo(false);
    })
    .createTable('sport_sections', (table) => {
      table.increments('id').primary();
      table.integer('sport_id').notNullable().references('id').inTable('sports').onDelete('CASCADE');
      table.string('name').notNullable();
      table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
    })
    .createTable('exercises', (table) => {
      table.increments('id').primary();
      table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.string('name').notNullable();
      table.text('description');
      table.boolean('is_system').defaultTo(false);
      table.integer('parent_exercise_id').references('id').inTable('exercises').onDelete('SET NULL');
    })
    .createTable('exercise_sports_sections', (table) => {
      table.increments('id').primary();
      table.integer('exercise_id').notNullable().references('id').inTable('exercises').onDelete('CASCADE');
      table.integer('sport_id').notNullable().references('id').inTable('sports').onDelete('CASCADE');
      table.integer('sport_section_id').notNullable().references('id').inTable('sport_sections').onDelete('CASCADE');
    })
    .createTable('metric_types', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('data_type').notNullable();
      table.integer('base_unit_id').references('id').inTable('units').onDelete('SET NULL');
    })
    .createTable('units', (table) => {
      table.increments('id').primary();
      table.integer('metric_type_id').notNullable().references('id').inTable('metric_types').onDelete('CASCADE');
      table.string('name').notNullable();
      table.string('symbol').notNullable();
      table.float('conversion_factor_to_base').notNullable();
    })
    .createTable('exercise_metrics', (table) => {
      table.increments('id').primary();
      table.integer('exercise_id').notNullable().references('id').inTable('exercises').onDelete('CASCADE');
      table.integer('metric_type_id').notNullable().references('id').inTable('metric_types').onDelete('CASCADE');
      table.boolean('is_required').defaultTo(false);
      table.integer('order_index').notNullable();
    })
    .createTable('workouts', (table) => {
      table.increments('id').primary();
      table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.date('date').notNullable();
      table.text('notes');
    })
    .createTable('workout_exercises', (table) => {
      table.increments('id').primary();
      table.integer('workout_id').notNullable().references('id').inTable('workouts').onDelete('CASCADE');
      table.integer('exercise_id').notNullable().references('id').inTable('exercises').onDelete('CASCADE');
      table.text('notes');
    });
}

export function down(knex) {
  return knex.schema
    .dropTableIfExists('workout_exercises')
    .dropTableIfExists('workouts')
    .dropTableIfExists('exercise_metrics')
    .dropTableIfExists('units')
    .dropTableIfExists('metric_types')
    .dropTableIfExists('exercise_sports_sections')
    .dropTableIfExists('exercises')
    .dropTableIfExists('sport_sections')
    .dropTableIfExists('sports')
    .dropTableIfExists('users');
}