import app from "./interfaces/http/app.js";
import knex from 'knex';
import knexConfig from '../knexfile.js';

const db = knex(knexConfig.development);

// Ejecutar migraciones al iniciar
await db.migrate.latest();

app.listen(3000, () =>
  console.log("Servidor corriendo")
);