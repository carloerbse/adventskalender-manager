// server/database.ts
// Datenbank-Setup und -Verwaltung für den Adventskalender-Manager

import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";

// Datenbankpfad
const DB_PATH = "./server/adventskalender.db";

// Datenbank-Instanz
let db: DB;

/**
 * Initialisiert die Datenbank und erstellt alle notwendigen Tabellen
 */
export function initDatabase(): DB {
  // Datenbank öffnen (wird erstellt, wenn nicht vorhanden)
  db = new DB(DB_PATH);

  // Users-Tabelle
  db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Calendars-Tabelle
  db.execute(`
    CREATE TABLE IF NOT EXISTS calendars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Pouches-Tabelle (Säckchen)
  db.execute(`
    CREATE TABLE IF NOT EXISTS pouches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      calendar_id INTEGER NOT NULL,
      number INTEGER NOT NULL CHECK(number BETWEEN 1 AND 24),
      content TEXT DEFAULT '',
      notes TEXT DEFAULT '',
      is_packed INTEGER DEFAULT 0 CHECK(is_packed IN (0, 1)),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (calendar_id) REFERENCES calendars(id) ON DELETE CASCADE,
      UNIQUE(calendar_id, number)
    )
  `);

  // Sessions-Tabelle für Session-Management
  db.execute(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Index für schnellere Abfragen
  db.execute(`CREATE INDEX IF NOT EXISTS idx_calendars_user_id ON calendars(user_id)`);
  db.execute(`CREATE INDEX IF NOT EXISTS idx_pouches_calendar_id ON pouches(calendar_id)`);
  db.execute(`CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)`);

  console.log("✅ Datenbank initialisiert:", DB_PATH);
  
  return db;
}

/**
 * Gibt die aktuelle Datenbank-Instanz zurück
 */
export function getDatabase(): DB {
  if (!db) {
    throw new Error("Datenbank wurde noch nicht initialisiert. Rufe initDatabase() auf.");
  }
  return db;
}

/**
 * Schließt die Datenbank-Verbindung
 */
export function closeDatabase(): void {
  if (db) {
    db.close();
    console.log("✅ Datenbank-Verbindung geschlossen");
  }
}

/**
 * Erstellt automatisch 24 leere Säckchen für einen neuen Kalender
 */
export function createPouchesForCalendar(calendarId: number): void {
  const db = getDatabase();
  
  // Prepared Statement für bessere Performance
  const stmt = db.prepareQuery(`
    INSERT INTO pouches (calendar_id, number, content, notes, is_packed)
    VALUES (?, ?, '', '', 0)
  `);

  // 24 Säckchen erstellen
  for (let i = 1; i <= 24; i++) {
    stmt.execute([calendarId, i]);
  }
  
  stmt.finalize();
  console.log(`✅ 24 Säckchen für Kalender ${calendarId} erstellt`);
}

/**
 * Löscht abgelaufene Sessions aus der Datenbank
 */
export function cleanupExpiredSessions(): void {
  const db = getDatabase();
  const now = new Date().toISOString();
  
  const result = db.query(`DELETE FROM sessions WHERE expires_at < ?`, [now]);
  console.log(`🧹 ${result.length} abgelaufene Sessions gelöscht`);
}
