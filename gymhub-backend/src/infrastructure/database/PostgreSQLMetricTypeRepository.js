import db from "./db.js";

export class PostgreSQLMetricTypeRepository {
  async getAll() {
    return await db('metric_types').select('*');
  }

  async getById(id) {
    return await db('metric_types').where('id', id).first();
  }
}