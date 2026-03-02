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

  update(id, data) {
    const existing = this.getById(id);
    if (!existing) return null;

    const stmt = db.prepare(`
      UPDATE USERS SET
        USERNAME = ?,
        NAME = ?,
        EMAIL = ?,
        PHONE = ?,
        DATE_OF_BIRTH = ?
      WHERE ID = ?
    `);

    stmt.run(
      data.username ?? existing.USERNAME,
      data.name ?? existing.NAME,
      data.email ?? existing.EMAIL,
      data.phone ?? existing.PHONE,
      data.date_of_birth ?? existing.DATE_OF_BIRTH,
      id
    );

    return true;
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