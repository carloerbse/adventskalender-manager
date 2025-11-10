// Temporäres Debug-Script für User-Probleme
import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";
import { hash, compare } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const db = new DB("./adventskalender.db");

// Alle User anzeigen
console.log("\n📋 Alle Benutzer in der Datenbank:");
const users = db.query(`SELECT id, username, password_hash, role, created_at FROM users`);
users.forEach((row: unknown[]) => {
  console.log(`  ID: ${row[0]}, Username: ${row[1]}, Role: ${row[3]}, Created: ${row[4]}`);
  console.log(`  Hash: ${(row[2] as string).substring(0, 30)}...`);
});

// Test: Passwort verifizieren
if (users.length > 0) {
  const testUser = users[0];
  const testUsername = testUser[1] as string;
  const testHash = testUser[2] as string;
  
  console.log(`\n🔐 Teste Passwort-Verifikation für User: ${testUsername}`);
  console.log(`Bitte gib das Passwort für '${testUsername}' ein (oder drücke Ctrl+C zum Abbrechen):`);
  
  // Warte auf User-Input
  const buf = new Uint8Array(1024);
  const n = await Deno.stdin.read(buf);
  if (n) {
    const password = new TextDecoder().decode(buf.subarray(0, n)).trim();
    
    console.log(`\nVerifiziere Passwort...`);
    const isValid = await compare(password, testHash);
    
    if (isValid) {
      console.log("✅ Passwort ist KORREKT!");
    } else {
      console.log("❌ Passwort ist FALSCH!");
      
      // Versuche ein neues Hash zu erstellen
      console.log("\n🔄 Erstelle neuen Hash für das eingegebene Passwort...");
      const newHash = await hash(password);
      console.log("Neuer Hash:", newHash.substring(0, 30) + "...");
      
      // Vergleiche mit altem Hash
      console.log("\nAlter Hash:", testHash.substring(0, 30) + "...");
      console.log("\n⚠️ Die Hashes sind unterschiedlich!");
      console.log("Das bedeutet: Entweder falsches Passwort ODER bcrypt-Problem");
    }
  }
}

db.close();
