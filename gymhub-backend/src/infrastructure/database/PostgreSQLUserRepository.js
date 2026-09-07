import db from "./db.js";

export class PostgreSQLUserRepository {
  async getAll() {
    return await db('users').select('*');
  }

  async getById(id) {
    return await db('users').where('id', id).first();
  }

  async create(userData) {
    const [id] = await db('users').insert(userData).returning('id');
    return { id, ...userData };
  }

  async update(id, data) {
    await db('users').where('id', id).update(data);
    return this.getById(id);
  }

  async delete(id) {
    await db('users').where('id', id).del();
  }
}