// Script zum Anzeigen aller Benutzer
import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";

const db = new DB("./adventskalender.db");

console.log("\n📋 Alle Benutzer in der Datenbank:\n");

const users = db.query(`SELECT id, username, role, created_at FROM users`);

if (users.length === 0) {
  console.log("⚠️ Keine Benutzer gefunden!");
  console.log("Die Datenbank wurde möglicherweise neu initialisiert.");
  console.log("Bitte registriere dich erneut.");
} else {
  users.forEach((row: unknown[]) => {
    console.log(`ID: ${row[0]}`);
    console.log(`Username: ${row[1]}`);
    console.log(`Role: ${row[2]}`);
    console.log(`Created: ${row[3]}`);
    console.log("---");
  });
  
  console.log(`\nGesamt: ${users.length} Benutzer`);
}

db.close();
console.log("\n");
