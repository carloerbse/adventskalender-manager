// Script zum Erstellen eines Test-Users mit bekanntem Passwort
import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";
import { hash } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const db = new DB("./adventskalender.db");

// Test-User Credentials
const username = "test";
const password = "test123";

console.log("\n🔐 Erstelle Test-User...");
console.log(`Username: ${username}`);
console.log(`Password: ${password}`);

// Prüfe ob User bereits existiert
const existing = db.query(`SELECT id FROM users WHERE username = ?`, [username]);
if (existing.length > 0) {
  console.log("\n⚠️ User existiert bereits! Lösche alten User...");
  db.query(`DELETE FROM users WHERE username = ?`, [username]);
}

// Passwort hashen
console.log("\nHashe Passwort...");
const passwordHash = await hash(password);
console.log(`Hash: ${passwordHash.substring(0, 30)}...`);

// User erstellen
db.query(
  `INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)`,
  [username, passwordHash, "user"]
);

console.log("\n✅ Test-User erfolgreich erstellt!");
console.log("\n📋 Login-Daten:");
console.log(`  Username: ${username}`);
console.log(`  Password: ${password}`);
console.log("\nJetzt kannst du dich damit im Browser anmelden.");

db.close();
