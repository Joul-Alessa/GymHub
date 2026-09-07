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
      table.integer('base_unit_id').nullable();
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
    })
    .then(() => {
      return knex('metric_types').insert([
        { id: 1, name: 'reps', data_type: 'int', base_unit_id: null },
        { id: 2, name: 'weight', data_type: 'float', base_unit_id: 1 },
        { id: 3, name: 'time', data_type: 'float', base_unit_id: 3 },
        { id: 4, name: 'distance', data_type: 'float', base_unit_id: 6 },
        { id: 5, name: 'calories', data_type: 'float', base_unit_id: 9 },
        { id: 6, name: 'speed', data_type: 'float', base_unit_id: 10 },
        { id: 7, name: 'heart_rate', data_type: 'float', base_unit_id: 13 },
        { id: 8, name: 'incline', data_type: 'float', base_unit_id: 14 },
        { id: 9, name: 'power', data_type: 'float', base_unit_id: 15 },
        { id: 10, name: 'cadence_cycling', data_type: 'int', base_unit_id: 16 },
        { id: 11, name: 'cadence_running', data_type: 'int', base_unit_id: 17 }
      ]);
    })
    .then(() => {
      return knex('units').insert([
        { id: 1, metric_type_id: 2, name: 'kilogram', symbol: 'kg', conversion_factor_to_base: 1 },
        { id: 2, metric_type_id: 2, name: 'pound', symbol: 'lb', conversion_factor_to_base: 0.453592 },
        { id: 3, metric_type_id: 3, name: 'second', symbol: 's', conversion_factor_to_base: 1 },
        { id: 4, metric_type_id: 3, name: 'minute', symbol: 'min', conversion_factor_to_base: 60 },
        { id: 5, metric_type_id: 3, name: 'hour', symbol: 'h', conversion_factor_to_base: 3600 },
        { id: 6, metric_type_id: 4, name: 'meter', symbol: 'm', conversion_factor_to_base: 1 },
        { id: 7, metric_type_id: 4, name: 'kilometer', symbol: 'km', conversion_factor_to_base: 1000 },
        { id: 8, metric_type_id: 4, name: 'mile', symbol: 'mi', conversion_factor_to_base: 1609.34 },
        { id: 9, metric_type_id: 5, name: 'kilocalorie', symbol: 'kcal', conversion_factor_to_base: 1 },
        { id: 10, metric_type_id: 6, name: 'meter_per_second', symbol: 'm/s', conversion_factor_to_base: 1 },
        { id: 11, metric_type_id: 6, name: 'kilometer_per_hour', symbol: 'km/h', conversion_factor_to_base: 0.277778 },
        { id: 12, metric_type_id: 6, name: 'mile_per_hour', symbol: 'mph', conversion_factor_to_base: 0.44704 },
        { id: 13, metric_type_id: 7, name: 'beats_per_minute', symbol: 'bpm', conversion_factor_to_base: 1 },
        { id: 14, metric_type_id: 8, name: 'percent', symbol: '%', conversion_factor_to_base: 1 },
        { id: 15, metric_type_id: 9, name: 'watt', symbol: 'W', conversion_factor_to_base: 1 },
        { id: 16, metric_type_id: 10, name: 'revolutions_per_minute', symbol: 'rpm', conversion_factor_to_base: 1 },
        { id: 17, metric_type_id: 11, name: 'steps_per_minute', symbol: 'spm', conversion_factor_to_base: 1 }
      ]);
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