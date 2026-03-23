export function up(knex) {
  return knex.raw(`
    ALTER TABLE metric_types
    ADD CONSTRAINT metric_types_base_unit_id_foreign
    FOREIGN KEY (base_unit_id) REFERENCES units(id)
    ON DELETE SET NULL
  `);
}

export function down(knex) {
  return knex.raw(`
    ALTER TABLE metric_types
    DROP CONSTRAINT metric_types_base_unit_id_foreign
  `);
}