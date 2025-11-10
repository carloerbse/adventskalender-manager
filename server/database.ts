// server/database.ts
// Datenbank-Setup und -Verwaltung für den Adventskalender-Manager

import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";

// Datenbankpfad (relativ zum server-Verzeichnis)
const DB_PATH = "./adventskalender.db";

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

// ============================================================================
// KALENDER-CRUD-FUNKTIONEN
// ============================================================================

/**
 * Holt alle Kalender eines bestimmten Benutzers
 */
export function getCalendarsByUserId(userId: number) {
  const db = getDatabase();
  
  const calendars = db.query(`
    SELECT c.*, 
           COUNT(CASE WHEN p.is_packed = 1 THEN 1 END) as packed_count,
           COUNT(p.id) as total_pouches
    FROM calendars c
    LEFT JOIN pouches p ON c.id = p.calendar_id
    WHERE c.user_id = ?
    GROUP BY c.id
    ORDER BY c.created_at DESC
  `, [userId]);

  return calendars.map((row: unknown[]) => ({
    id: row[0] as number,
    user_id: row[1] as number,
    name: row[2] as string,
    description: row[3] as string,
    created_at: row[4] as string,
    packed_count: row[5] as number,
    total_pouches: row[6] as number,
  }));
}

/**
 * Holt einen einzelnen Kalender nach ID
 * Gibt null zurück, wenn Kalender nicht existiert
 */
export function getCalendarById(calendarId: number) {
  const db = getDatabase();
  
  const result = db.query(`
    SELECT c.*, 
           COUNT(CASE WHEN p.is_packed = 1 THEN 1 END) as packed_count,
           COUNT(p.id) as total_pouches
    FROM calendars c
    LEFT JOIN pouches p ON c.id = p.calendar_id
    WHERE c.id = ?
    GROUP BY c.id
  `, [calendarId]);

  if (result.length === 0) return null;

  const row = result[0];
  return {
    id: row[0] as number,
    user_id: row[1] as number,
    name: row[2] as string,
    description: row[3] as string,
    created_at: row[4] as string,
    packed_count: row[5] as number,
    total_pouches: row[6] as number,
  };
}

/**
 * Erstellt einen neuen Kalender mit 24 leeren Säckchen
 * Gibt die ID des neuen Kalenders zurück
 */
export function createCalendar(userId: number, name: string, description: string = ""): number {
  const db = getDatabase();
  
  // Kalender erstellen
  db.query(`
    INSERT INTO calendars (user_id, name, description)
    VALUES (?, ?, ?)
  `, [userId, name, description]);

  // ID des neu erstellten Kalenders holen
  const result = db.query(`SELECT last_insert_rowid()`);
  const calendarId = result[0][0] as number;

  // Automatisch 24 Säckchen erstellen
  createPouchesForCalendar(calendarId);

  console.log(`✅ Kalender "${name}" (ID: ${calendarId}) für User ${userId} erstellt`);
  
  return calendarId;
}

/**
 * Aktualisiert einen bestehenden Kalender
 * Gibt true zurück bei Erfolg, false wenn Kalender nicht existiert
 */
export function updateCalendar(calendarId: number, name: string, description: string = ""): boolean {
  const db = getDatabase();
  
  const result = db.query(`
    UPDATE calendars
    SET name = ?, description = ?
    WHERE id = ?
  `, [name, description, calendarId]);

  // SQLite gibt die Anzahl der geänderten Zeilen nicht direkt zurück
  // Prüfen ob Kalender existiert
  const check = db.query(`SELECT id FROM calendars WHERE id = ?`, [calendarId]);
  
  if (check.length === 0) {
    return false;
  }

  console.log(`✅ Kalender ${calendarId} aktualisiert: "${name}"`);
  return true;
}

/**
 * Löscht einen Kalender (inkl. aller Säckchen durch CASCADE)
 * Gibt true zurück bei Erfolg, false wenn Kalender nicht existiert
 */
export function deleteCalendar(calendarId: number): boolean {
  const db = getDatabase();
  
  // Erst prüfen ob Kalender existiert
  const check = db.query(`SELECT id FROM calendars WHERE id = ?`, [calendarId]);
  
  if (check.length === 0) {
    return false;
  }

  // Kalender löschen (Säckchen werden automatisch durch CASCADE gelöscht)
  db.query(`DELETE FROM calendars WHERE id = ?`, [calendarId]);

  console.log(`✅ Kalender ${calendarId} gelöscht (inkl. aller Säckchen)`);
  return true;
}

/**
 * Prüft ob ein Kalender einem bestimmten Benutzer gehört
 */
export function isCalendarOwnedByUser(calendarId: number, userId: number): boolean {
  const db = getDatabase();
  
  const result = db.query(`
    SELECT id FROM calendars WHERE id = ? AND user_id = ?
  `, [calendarId, userId]);

  return result.length > 0;
}

// ============================================================================
// SÄCKCHEN-FUNKTIONEN
// ============================================================================

/**
 * Holt alle Säckchen eines Kalenders
 */
export function getPouchesByCalendarId(calendarId: number) {
  const db = getDatabase();
  
  const pouches = db.query(`
    SELECT id, calendar_id, number, content, notes, is_packed, created_at
    FROM pouches
    WHERE calendar_id = ?
    ORDER BY number ASC
  `, [calendarId]);

  return pouches.map((row: unknown[]) => ({
    id: row[0] as number,
    calendar_id: row[1] as number,
    number: row[2] as number,
    content: row[3] as string,
    notes: row[4] as string,
    is_packed: row[5] as number,
    created_at: row[6] as string,
  }));
}

/**
 * Mischt die Inhalte aller Säckchen eines Kalenders zufällig neu
 * Verwendet den Fisher-Yates-Algorithmus für eine gleichmäßige Verteilung
 * Gibt die neu gemischten Säckchen zurück
 */
export function shufflePouches(calendarId: number) {
  const db = getDatabase();
  
  // 1. Alle Säckchen mit ihren Inhalten laden
  const pouches = getPouchesByCalendarId(calendarId);
  
  if (pouches.length !== 24) {
    throw new Error(`Kalender ${calendarId} hat nicht genau 24 Säckchen`);
  }

  // 2. Alle Inhalte in ein Array sammeln (content + notes)
  const contents = pouches.map(p => ({
    content: p.content,
    notes: p.notes,
  }));

  // 3. Fisher-Yates-Shuffle für gleichmäßige Zufallsverteilung
  for (let i = contents.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [contents[i], contents[j]] = [contents[j], contents[i]];
  }

  // 4. Neue Zuordnung in die Datenbank schreiben
  const stmt = db.prepareQuery(`
    UPDATE pouches
    SET content = ?, notes = ?
    WHERE id = ?
  `);

  for (let i = 0; i < pouches.length; i++) {
    stmt.execute([
      contents[i].content,
      contents[i].notes,
      pouches[i].id,
    ]);
  }

  stmt.finalize();

  console.log(`🎲 Säckchen von Kalender ${calendarId} gemischt`);

  // 5. Aktualisierte Säckchen zurückgeben
  return getPouchesByCalendarId(calendarId);
}

// ============================================================================
// EXPORT-FUNKTIONEN
// ============================================================================

/**
 * Holt vollständige Kalenderdaten inklusive aller Säckchen für Export
 */
export function getCalendarWithPouches(calendarId: number) {
  const calendar = getCalendarById(calendarId);
  
  if (!calendar) {
    return null;
  }

  const pouches = getPouchesByCalendarId(calendarId);

  return {
    calendar,
    pouches,
  };
}

/**
 * Konvertiert Kalenderdaten in CSV-Format
 */
export function convertToCSV(calendarId: number): string {
  const data = getCalendarWithPouches(calendarId);
  
  if (!data) {
    throw new Error("Kalender nicht gefunden");
  }

  const { calendar, pouches } = data;

  // CSV-Header
  let csv = "Kalendername;Beschreibung;Erstellt am\n";
  csv += `"${calendar.name}";"${calendar.description}";"${new Date(calendar.created_at).toLocaleDateString('de-DE')}"\n`;
  csv += "\n";
  
  // Säckchen-Header
  csv += "Nummer;Inhalt;Notizen;Gepackt\n";
  
  // Säckchen-Daten
  for (const pouch of pouches) {
    const packed = pouch.is_packed ? "Ja" : "Nein";
    // Escape Anführungszeichen in Inhalten
    const content = pouch.content.replace(/"/g, '""');
    const notes = pouch.notes.replace(/"/g, '""');
    
    csv += `${pouch.number};"${content}";"${notes}";"${packed}"\n`;
  }

  return csv;
}
