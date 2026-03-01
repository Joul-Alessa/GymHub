import app from "./interfaces/http/app.js";
// import { initDb } from "./infrastructure/database/initDb.js";

// initDb();

app.listen(3000, () =>
  console.log("Servidor corriendo")
);