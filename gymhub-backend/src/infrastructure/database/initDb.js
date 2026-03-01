import db from "./db.js";

export function initDb() {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS USERS (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      USERNAME TEXT,
      NAME TEXT,
      PASSWORD TEXT,
      EMAIL TEXT,
      PHONE TEXT,
      DATE_WHEN_JOINED TEXT,
      DATE_OF_BIRTH TEXT
    )
  `).run();
}