import db from '../../db/connection.js';

function attachRelations(exercise) {
  if (!exercise) return exercise;
  const photos = db
    .prepare('SELECT * FROM exercise_photos WHERE exercise_id = ? ORDER BY position, id')
    .all(exercise.id);
  const subclassifications = db
    .prepare(
      `SELECT s.* FROM subclassifications s
       JOIN exercise_subclassifications es ON es.subclassification_id = s.id
       WHERE es.exercise_id = ? ORDER BY s.name`
    )
    .all(exercise.id);
  const commonMetrics = db
    .prepare(
      `SELECT ecm.metric_id, m.name AS metric_name, ecm.default_unit_id, u.abbreviation AS default_unit_abbreviation, ecm.position
       FROM exercise_common_metrics ecm
       JOIN metrics m ON m.id = ecm.metric_id
       LEFT JOIN units u ON u.id = ecm.default_unit_id
       WHERE ecm.exercise_id = ? ORDER BY ecm.position`
    )
    .all(exercise.id);
  return { ...exercise, photos, subclassifications, commonMetrics };
}

export function listExercises({ sportId, subclassificationId } = {}) {
  let rows;
  if (subclassificationId) {
    rows = db
      .prepare(
        `SELECT DISTINCT e.* FROM exercises e
         JOIN exercise_subclassifications es ON es.exercise_id = e.id
         WHERE es.subclassification_id = ?
         ORDER BY e.name`
      )
      .all(subclassificationId);
  } else if (sportId) {
    rows = db.prepare('SELECT * FROM exercises WHERE sport_id = ? ORDER BY name').all(sportId);
  } else {
    rows = db.prepare('SELECT * FROM exercises ORDER BY name').all();
  }
  return rows.map(attachRelations);
}

export function getExerciseById(id) {
  const exercise = db.prepare('SELECT * FROM exercises WHERE id = ?').get(id);
  return attachRelations(exercise);
}

export function getExerciseRaw(id) {
  return db.prepare('SELECT * FROM exercises WHERE id = ?').get(id);
}

export function createExercise({ name, description, sportId }) {
  const result = db
    .prepare('INSERT INTO exercises (name, description, sport_id) VALUES (?, ?, ?)')
    .run(name, description || null, sportId);
  return result.lastInsertRowid;
}

export function updateExercise(id, { name, description, sportId }) {
  db.prepare(
    "UPDATE exercises SET name = ?, description = ?, sport_id = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(name, description || null, sportId, id);
}

export function deleteExercise(id) {
  db.prepare('DELETE FROM exercises WHERE id = ?').run(id);
}

export function countTrainingEntries(exerciseId) {
  return db.prepare('SELECT COUNT(*) AS c FROM training_entries WHERE exercise_id = ?').get(exerciseId).c;
}

export function setExerciseSubclassifications(exerciseId, subclassificationIds) {
  const del = db.prepare('DELETE FROM exercise_subclassifications WHERE exercise_id = ?');
  const insert = db.prepare(
    'INSERT INTO exercise_subclassifications (exercise_id, subclassification_id) VALUES (?, ?)'
  );
  const tx = db.transaction((ids) => {
    del.run(exerciseId);
    for (const subId of ids) insert.run(exerciseId, subId);
  });
  tx(subclassificationIds);
}

export function setExerciseCommonMetrics(exerciseId, commonMetrics) {
  const del = db.prepare('DELETE FROM exercise_common_metrics WHERE exercise_id = ?');
  const insert = db.prepare(
    'INSERT INTO exercise_common_metrics (exercise_id, metric_id, default_unit_id, position) VALUES (?, ?, ?, ?)'
  );
  const tx = db.transaction((items) => {
    del.run(exerciseId);
    items.forEach((item, index) => {
      insert.run(exerciseId, item.metricId, item.defaultUnitId || null, index);
    });
  });
  tx(commonMetrics);
}

export function addPhoto(exerciseId, filePath, position) {
  const result = db
    .prepare('INSERT INTO exercise_photos (exercise_id, file_path, position) VALUES (?, ?, ?)')
    .run(exerciseId, filePath, position);
  return db.prepare('SELECT * FROM exercise_photos WHERE id = ?').get(result.lastInsertRowid);
}

export function getPhotoById(id) {
  return db.prepare('SELECT * FROM exercise_photos WHERE id = ?').get(id);
}

export function deletePhoto(id) {
  db.prepare('DELETE FROM exercise_photos WHERE id = ?').run(id);
}

export function countPhotos(exerciseId) {
  return db.prepare('SELECT COUNT(*) AS c FROM exercise_photos WHERE exercise_id = ?').get(exerciseId).c;
}
