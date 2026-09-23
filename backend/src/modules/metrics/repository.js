import db from '../../db/connection.js';

export function listMetrics() {
  const metrics = db.prepare('SELECT * FROM metrics ORDER BY name').all();
  const unitsStmt = db.prepare('SELECT * FROM units WHERE metric_id = ? ORDER BY name');
  return metrics.map((m) => ({ ...m, units: unitsStmt.all(m.id) }));
}

export function getMetricById(id) {
  return db.prepare('SELECT * FROM metrics WHERE id = ?').get(id);
}

export function findMetricByName(name) {
  return db.prepare('SELECT * FROM metrics WHERE name = ?').get(name);
}

export function createMetric(name) {
  const result = db.prepare('INSERT INTO metrics (name) VALUES (?)').run(name);
  return getMetricById(result.lastInsertRowid);
}

export function updateMetric(id, name) {
  db.prepare('UPDATE metrics SET name = ? WHERE id = ?').run(name, id);
  return getMetricById(id);
}

export function listUnits(metricId) {
  return db.prepare('SELECT * FROM units WHERE metric_id = ? ORDER BY name').all(metricId);
}

export function getUnitById(id) {
  return db.prepare('SELECT * FROM units WHERE id = ?').get(id);
}

export function findUnitByAbbreviation(metricId, abbreviation) {
  return db.prepare('SELECT * FROM units WHERE metric_id = ? AND abbreviation = ?').get(metricId, abbreviation);
}

export function createUnit(metricId, name, abbreviation) {
  const result = db
    .prepare('INSERT INTO units (metric_id, name, abbreviation) VALUES (?, ?, ?)')
    .run(metricId, name, abbreviation);
  return getUnitById(result.lastInsertRowid);
}

export function updateUnit(id, name, abbreviation) {
  db.prepare('UPDATE units SET name = ?, abbreviation = ? WHERE id = ?').run(name, abbreviation, id);
  return getUnitById(id);
}
