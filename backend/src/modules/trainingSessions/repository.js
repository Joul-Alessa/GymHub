import db from '../../db/connection.js';

function attachEntries(session) {
  if (!session) return session;
  const entries = db
    .prepare(
      `SELECT te.*, e.name AS exercise_name
       FROM training_entries te
       JOIN exercises e ON e.id = te.exercise_id
       WHERE te.session_id = ? ORDER BY te.entry_order, te.id`
    )
    .all(session.id);
  const metricsStmt = db.prepare(
    `SELECT em.*, m.name AS metric_name, u.abbreviation AS unit_abbreviation
     FROM entry_metrics em
     JOIN metrics m ON m.id = em.metric_id
     LEFT JOIN units u ON u.id = em.unit_id
     WHERE em.entry_id = ?`
  );
  return { ...session, entries: entries.map((entry) => ({ ...entry, metrics: metricsStmt.all(entry.id) })) };
}

export function listSessions({ from, to } = {}) {
  let rows;
  if (from && to) {
    rows = db
      .prepare('SELECT * FROM training_sessions WHERE session_date BETWEEN ? AND ? ORDER BY session_date DESC')
      .all(from, to);
  } else {
    rows = db.prepare('SELECT * FROM training_sessions ORDER BY session_date DESC').all();
  }
  return rows.map(attachEntries);
}

export function getSessionById(id) {
  const session = db.prepare('SELECT * FROM training_sessions WHERE id = ?').get(id);
  return attachEntries(session);
}

export function getSessionRaw(id) {
  return db.prepare('SELECT * FROM training_sessions WHERE id = ?').get(id);
}

export function findSessionByDate(date) {
  return db.prepare('SELECT * FROM training_sessions WHERE session_date = ?').get(date);
}

export function createSession(sessionDate, notes) {
  const result = db
    .prepare('INSERT INTO training_sessions (session_date, notes) VALUES (?, ?)')
    .run(sessionDate, notes || null);
  return result.lastInsertRowid;
}

export function deleteSession(id) {
  db.prepare('DELETE FROM training_sessions WHERE id = ?').run(id);
}

export function countEntriesForSession(sessionId) {
  return db.prepare('SELECT COUNT(*) AS c FROM training_entries WHERE session_id = ?').get(sessionId).c;
}

export function addEntry(sessionId, { exerciseId, difficulty, notes, metrics }) {
  const insertEntry = db.prepare(
    'INSERT INTO training_entries (session_id, exercise_id, difficulty, notes, entry_order) VALUES (?, ?, ?, ?, ?)'
  );
  const insertMetric = db.prepare(
    'INSERT INTO entry_metrics (entry_id, metric_id, unit_id, value) VALUES (?, ?, ?, ?)'
  );
  const tx = db.transaction(() => {
    const order = countEntriesForSession(sessionId);
    const entryId = insertEntry.run(sessionId, exerciseId, difficulty, notes || null, order).lastInsertRowid;
    for (const m of metrics) {
      insertMetric.run(entryId, m.metricId, m.unitId || null, m.value);
    }
    return entryId;
  });
  return tx();
}

export function getEntryById(id) {
  return db.prepare('SELECT * FROM training_entries WHERE id = ?').get(id);
}

export function updateEntry(id, { difficulty, notes, metrics }) {
  const updateStmt = db.prepare('UPDATE training_entries SET difficulty = ?, notes = ? WHERE id = ?');
  const delMetrics = db.prepare('DELETE FROM entry_metrics WHERE entry_id = ?');
  const insertMetric = db.prepare(
    'INSERT INTO entry_metrics (entry_id, metric_id, unit_id, value) VALUES (?, ?, ?, ?)'
  );
  const tx = db.transaction(() => {
    updateStmt.run(difficulty, notes || null, id);
    delMetrics.run(id);
    for (const m of metrics) {
      insertMetric.run(id, m.metricId, m.unitId || null, m.value);
    }
  });
  tx();
}

export function deleteEntry(id) {
  db.prepare('DELETE FROM training_entries WHERE id = ?').run(id);
}

export function getExerciseHistory(exerciseId, limit = 20) {
  const entries = db
    .prepare(
      `SELECT te.*, ts.session_date
       FROM training_entries te
       JOIN training_sessions ts ON ts.id = te.session_id
       WHERE te.exercise_id = ?
       ORDER BY ts.session_date DESC, te.id DESC
       LIMIT ?`
    )
    .all(exerciseId, limit);
  const metricsStmt = db.prepare(
    `SELECT em.*, m.name AS metric_name, u.abbreviation AS unit_abbreviation
     FROM entry_metrics em
     JOIN metrics m ON m.id = em.metric_id
     LEFT JOIN units u ON u.id = em.unit_id
     WHERE em.entry_id = ?`
  );
  return entries.map((entry) => ({ ...entry, metrics: metricsStmt.all(entry.id) }));
}

export function getExerciseProgress(exerciseId, metricId) {
  return db
    .prepare(
      `SELECT ts.session_date, em.value, u.abbreviation AS unit_abbreviation, te.id AS entry_id
       FROM entry_metrics em
       JOIN training_entries te ON te.id = em.entry_id
       JOIN training_sessions ts ON ts.id = te.session_id
       LEFT JOIN units u ON u.id = em.unit_id
       WHERE te.exercise_id = ? AND em.metric_id = ?
       ORDER BY ts.session_date ASC, te.id ASC`
    )
    .all(exerciseId, metricId);
}

export function getHeatmapData(from, to) {
  return db
    .prepare(
      `SELECT ts.session_date AS date, COUNT(te.id) AS entry_count
       FROM training_sessions ts
       LEFT JOIN training_entries te ON te.session_id = ts.id
       WHERE ts.session_date BETWEEN ? AND ?
       GROUP BY ts.session_date
       ORDER BY ts.session_date ASC`
    )
    .all(from, to);
}

export function getGlobalActivity(from, to) {
  return db
    .prepare(
      `SELECT ts.session_date AS date, COUNT(DISTINCT ts.id) AS session_count, COUNT(te.id) AS entry_count
       FROM training_sessions ts
       LEFT JOIN training_entries te ON te.session_id = ts.id
       WHERE ts.session_date BETWEEN ? AND ?
       GROUP BY ts.session_date
       ORDER BY ts.session_date ASC`
    )
    .all(from, to);
}
