import db from "./database.js";

// Insertar usuario
const stmt = db.prepare("INSERT INTO USERS (USERNAME, NAME, PASSWORD, EMAIL, PHONE, DATE_WHEN_JOINED, DATE_OF_BIRTH) VALUES (?, ?, ?, ?, ?, ?, ?)");
stmt.run("joul.alessa", "Joel Espinoza Sánchez", "contraseña123", "joul.alessa@example.com", "1234567890", "2026-03-01T00:00:00.000Z", "2000-11-18T00:00:00.000Z");

console.log("Usuario agregado");

const usuarios = db.prepare("SELECT * FROM USERS").all();

console.log(usuarios);