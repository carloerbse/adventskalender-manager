// server/create_admin_user.ts
// Skript zum Erstellen eines Admin-Users

import { initDatabase, getDatabase, closeDatabase } from "./database.ts";
import { hashPassword } from "./auth.ts";

console.log("🔧 Erstelle Admin-User...\n");

// Datenbank initialisieren
const db = initDatabase();

// Admin-Credentials
const adminUsername = "admin";
const adminPassword = "admin123";

try {
  // Prüfen ob Admin bereits existiert
  const existing = db.query(
    `SELECT id, username, role FROM users WHERE username = ?`,
    [adminUsername]
  );

  if (existing.length > 0) {
    const [id, username, role] = existing[0];
    console.log(`⚠️  User "${username}" existiert bereits!`);
    console.log(`   ID: ${id}`);
    console.log(`   Rolle: ${role}`);
    
    if (role === "admin") {
      console.log(`✅ User ist bereits Admin.`);
    } else {
      // Zu Admin hochstufen
      db.query(`UPDATE users SET role = 'admin' WHERE id = ?`, [id]);
      console.log(`✅ User "${username}" wurde zu Admin hochgestuft!`);
    }
  } else {
    // Passwort hashen
    console.log("🔐 Hashe Passwort...");
    const passwordHash = await hashPassword(adminPassword);

    // Admin-User erstellen
    db.query(
      `INSERT INTO users (username, password_hash, role) VALUES (?, ?, 'admin')`,
      [adminUsername, passwordHash]
    );

    const result = db.query(`SELECT last_insert_rowid()`);
    const userId = result[0][0];

    console.log(`\n✅ Admin-User erfolgreich erstellt!`);
    console.log(`   ID: ${userId}`);
    console.log(`   Username: ${adminUsername}`);
    console.log(`   Passwort: ${adminPassword}`);
    console.log(`   Rolle: admin`);
  }

  // Alle User anzeigen
  console.log("\n📋 Alle Benutzer in der Datenbank:\n");
  const allUsers = db.query(`
    SELECT id, username, role, created_at 
    FROM users 
    ORDER BY id
  `);

  console.log("ID | Username         | Rolle  | Erstellt am");
  console.log("---|------------------|--------|------------------");
  
  for (const [id, username, role, created_at] of allUsers) {
    const roleIcon = role === "admin" ? "👑" : "👤";
    console.log(`${id}  | ${String(username).padEnd(16)} | ${roleIcon} ${role.padEnd(5)} | ${created_at}`);
  }

  console.log("\n✨ Fertig! Sie können sich jetzt als Admin anmelden.\n");
  console.log("Login-Daten:");
  console.log(`  Username: ${adminUsername}`);
  console.log(`  Passwort: ${adminPassword}`);

} catch (error) {
  console.error("❌ Fehler beim Erstellen des Admin-Users:", error);
} finally {
  // Datenbank schließen
  closeDatabase();
}
