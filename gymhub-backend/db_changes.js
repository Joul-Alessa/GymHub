import Database from "better-sqlite3";

const db = new Database("db.sqlite");

// 01/03/2026: Añadir columna deleted_at a la tabla users
db.prepare(`
  ALTER TABLE USERS
  ADD COLUMN deleted_at TEXT
`).run();

export default db;