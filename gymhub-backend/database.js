import Database from "better-sqlite3";

const db = new Database("db.sqlite");

db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    name TEXT,
    password TEXT,
    email TEXT,
    phone TEXT,
    date_when_joined TEXT,
    date_of_birth TEXT,
    deleted_at TEXT
  )
`).run();

export default db;