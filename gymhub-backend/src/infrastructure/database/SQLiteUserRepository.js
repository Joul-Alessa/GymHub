import db from "./db.js";

export class SQLiteUserRepository {
  getAll() {
    return db.prepare(`
      SELECT
        ID,
        USERNAME,
        NAME,
        EMAIL,
        PHONE,
        DATE_WHEN_JOINED,
        DATE_OF_BIRTH
      FROM USERS
    `).all();
  }

  getById(id) {
    return db.prepare(`
      SELECT
        ID,
        USERNAME,
        NAME,
        EMAIL,
        PHONE,
        DATE_WHEN_JOINED,
        DATE_OF_BIRTH
      FROM USERS
      WHERE ID = ?
    `).get(id);
  }
  
  /*
  create(u) {
    return db.prepare(`
      INSERT INTO USERS
      (USERNAME, NAME, PASSWORD, EMAIL, PHONE, DATE_WHEN_JOINED, DATE_OF_BIRTH)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      u.username, u.name, u.password,
      u.email, u.phone, u.dateJoined, u.birth
    );
  }

  findByUsername(username) {
    return db.prepare(
      "SELECT * FROM USERS WHERE USERNAME = ?"
    ).get(username);
  }
  */
}