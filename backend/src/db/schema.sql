-- Sportus MVP schema (single-user; user_id columns are future-proofing placeholders)

CREATE TABLE IF NOT EXISTS sports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  user_id INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS subclassifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sport_id INTEGER NOT NULL REFERENCES sports(id),
  name TEXT NOT NULL,
  user_id INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(sport_id, name)
);

CREATE TABLE IF NOT EXISTS exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  sport_id INTEGER NOT NULL REFERENCES sports(id),
  user_id INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS exercise_subclassifications (
  exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  subclassification_id INTEGER NOT NULL REFERENCES subclassifications(id),
  PRIMARY KEY (exercise_id, subclassification_id)
);

CREATE TABLE IF NOT EXISTS exercise_photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  user_id INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS units (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  metric_id INTEGER NOT NULL REFERENCES metrics(id),
  name TEXT NOT NULL,
  abbreviation TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(metric_id, abbreviation)
);

CREATE TABLE IF NOT EXISTS exercise_common_metrics (
  exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  metric_id INTEGER NOT NULL REFERENCES metrics(id),
  default_unit_id INTEGER REFERENCES units(id),
  position INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (exercise_id, metric_id)
);

CREATE TABLE IF NOT EXISTS training_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_date TEXT NOT NULL,
  notes TEXT,
  user_id INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS training_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER NOT NULL REFERENCES training_sessions(id) ON DELETE CASCADE,
  exercise_id INTEGER NOT NULL REFERENCES exercises(id),
  difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
  notes TEXT,
  entry_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS entry_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entry_id INTEGER NOT NULL REFERENCES training_entries(id) ON DELETE CASCADE,
  metric_id INTEGER NOT NULL REFERENCES metrics(id),
  unit_id INTEGER REFERENCES units(id),
  value REAL NOT NULL,
  UNIQUE(entry_id, metric_id)
);

CREATE INDEX IF NOT EXISTS idx_exercises_sport ON exercises(sport_id);
CREATE INDEX IF NOT EXISTS idx_subclass_sport ON subclassifications(sport_id);
CREATE INDEX IF NOT EXISTS idx_entries_session ON training_entries(session_id);
CREATE INDEX IF NOT EXISTS idx_entries_exercise ON training_entries(exercise_id);
CREATE INDEX IF NOT EXISTS idx_entry_metrics_entry ON entry_metrics(entry_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON training_sessions(session_date);
