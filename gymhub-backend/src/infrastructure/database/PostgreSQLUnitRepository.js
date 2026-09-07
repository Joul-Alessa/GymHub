import db from "./db.js";

export class PostgreSQLUnitRepository {
  async getAll() {
    return await db('units').select('*');
  }

  async getById(id) {
    return await db('units').where('id', id).first();
  }
}