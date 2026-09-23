import db from '../../db/connection.js';

export function listSubclassifications(sportId) {
  if (sportId) {
    return db.prepare('SELECT * FROM subclassifications WHERE sport_id = ? ORDER BY name').all(sportId);
  }
  return db.prepare('SELECT * FROM subclassifications ORDER BY sport_id, name').all();
}

export function getSubclassificationById(id) {
  return db.prepare('SELECT * FROM subclassifications WHERE id = ?').get(id);
}

export function findByName(sportId, name) {
  return db.prepare('SELECT * FROM subclassifications WHERE sport_id = ? AND name = ?').get(sportId, name);
}

export function createSubclassification(sportId, name) {
  const result = db.prepare('INSERT INTO subclassifications (sport_id, name) VALUES (?, ?)').run(sportId, name);
  return getSubclassificationById(result.lastInsertRowid);
}

export function updateSubclassification(id, name) {
  db.prepare('UPDATE subclassifications SET name = ? WHERE id = ?').run(name, id);
  return getSubclassificationById(id);
}
