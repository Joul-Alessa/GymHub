import db from '../../db/connection.js';

export function listSports() {
  return db.prepare('SELECT * FROM sports ORDER BY name').all();
}

export function getSportById(id) {
  return db.prepare('SELECT * FROM sports WHERE id = ?').get(id);
}

export function findSportByName(name) {
  return db.prepare('SELECT * FROM sports WHERE name = ?').get(name);
}

export function createSport(name) {
  const result = db.prepare('INSERT INTO sports (name) VALUES (?)').run(name);
  return getSportById(result.lastInsertRowid);
}

export function updateSport(id, name) {
  db.prepare('UPDATE sports SET name = ? WHERE id = ?').run(name, id);
  return getSportById(id);
}
