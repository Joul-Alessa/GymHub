import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DB_PATH || path.join(__dirname, '..', '..', 'sportus.sqlite');

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
db.exec(schema);

function seedIfEmpty() {
  const sportsCount = db.prepare('SELECT COUNT(*) AS c FROM sports').get().c;
  if (sportsCount > 0) return;

  const insertSport = db.prepare('INSERT INTO sports (name) VALUES (?)');
  const gymId = insertSport.run('Gym').lastInsertRowid;
  const basketballId = insertSport.run('Basketball').lastInsertRowid;

  const insertSubclass = db.prepare('INSERT INTO subclassifications (sport_id, name) VALUES (?, ?)');
  ['Biceps', 'Triceps', 'Chest', 'Back', 'Shoulders', 'Cardio', 'Abs', 'Glutes', 'Quads', 'Calves']
    .forEach((name) => insertSubclass.run(gymId, name));
  ['Ball Handling', 'Shooting Mechanics', 'Defense', 'Conditioning', 'Off-ball Movement']
    .forEach((name) => insertSubclass.run(basketballId, name));

  const insertMetric = db.prepare('INSERT INTO metrics (name) VALUES (?)');
  const insertUnit = db.prepare('INSERT INTO units (metric_id, name, abbreviation) VALUES (?, ?, ?)');

  const weightId = insertMetric.run('Weight').lastInsertRowid;
  insertUnit.run(weightId, 'Kilograms', 'kg');
  insertUnit.run(weightId, 'Pounds', 'lb');

  const repsId = insertMetric.run('Repetitions').lastInsertRowid;
  insertUnit.run(repsId, 'Reps', 'reps');

  const timeId = insertMetric.run('Time').lastInsertRowid;
  insertUnit.run(timeId, 'Seconds', 'sec');
  insertUnit.run(timeId, 'Minutes', 'min');

  const distanceId = insertMetric.run('Distance').lastInsertRowid;
  insertUnit.run(distanceId, 'Meters', 'm');
  insertUnit.run(distanceId, 'Kilometers', 'km');

  const caloriesId = insertMetric.run('Calories').lastInsertRowid;
  insertUnit.run(caloriesId, 'Kilocalories', 'kcal');

  const heartRateId = insertMetric.run('Heart Rate').lastInsertRowid;
  insertUnit.run(heartRateId, 'Beats per minute', 'bpm');

  const heightId = insertMetric.run('Height').lastInsertRowid;
  insertUnit.run(heightId, 'Centimeters', 'cm');
}

seedIfEmpty();

export default db;
