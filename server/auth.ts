// server/auth.ts
// Authentifizierungs-Helfer und Middleware

import { hash, compare } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { getDatabase } from "./database.ts";

/**
 * Generiert einen zufälligen Session-Token (UUID v4)
 */
export function generateSessionId(): string {
  return crypto.randomUUID();
}

/**
 * Hasht ein Passwort mit bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return await hash(password);
}

/**
 * Vergleicht ein Passwort mit einem Hash
 */
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return await compare(password, hash);
}

/**
 * Erstellt eine neue Session für einen Benutzer
 * @param userId - Benutzer-ID
 * @param expiresInHours - Session-Gültigkeit in Stunden (default: 168h = 7 Tage)
 * @returns Session-ID
 */
export function createSession(
  userId: number,
  expiresInHours: number = 168,
): string {
  const db = getDatabase();
  const sessionId = generateSessionId();
  const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000)
    .toISOString();

  db.query(
    `INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)`,
    [sessionId, userId, expiresAt],
  );

  console.log(`✅ Session erstellt für User ${userId}: ${sessionId}`);
  return sessionId;
}

/**
 * Validiert eine Session und gibt den Benutzer zurück
 * @param sessionId - Session-ID
 * @returns User-Objekt oder null wenn ungültig
 */
export function validateSession(sessionId: string): any | null {
  if (!sessionId) return null;

  const db = getDatabase();
  const now = new Date().toISOString();

  // Session mit User-Daten laden
  const result = db.query(
    `
    SELECT u.id, u.username, u.role, s.expires_at
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.id = ? AND s.expires_at > ?
  `,
    [sessionId, now],
  );

  if (result.length === 0) {
    return null;
  }

  const [id, username, role, expires_at] = result[0];
  return { id, username, role, expires_at };
}

/**
 * Löscht eine Session (Logout)
 */
export function deleteSession(sessionId: string): void {
  const db = getDatabase();
  db.query(`DELETE FROM sessions WHERE id = ?`, [sessionId]);
  console.log(`🗑️ Session gelöscht: ${sessionId}`);
}

/**
 * Löscht alle Sessions eines Benutzers
 */
export function deleteAllUserSessions(userId: number): void {
  const db = getDatabase();
  db.query(`DELETE FROM sessions WHERE user_id = ?`, [userId]);
  console.log(`🗑️ Alle Sessions für User ${userId} gelöscht`);
}

/**
 * Extrahiert Session-ID aus Cookie-Header
 */
export function getSessionFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((c) => c.trim());
  const sessionCookie = cookies.find((c) => c.startsWith("session="));

  if (!sessionCookie) return null;

  return sessionCookie.split("=")[1];
}

/**
 * Erstellt einen Session-Cookie-Header
 */
export function createSessionCookie(
  sessionId: string,
  maxAge: number = 604800,
): string {
  // maxAge in Sekunden (default: 604800s = 7 Tage)
  return `session=${sessionId}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}`;
}

/**
 * Erstellt einen Logout-Cookie (löscht Session)
 */
export function createLogoutCookie(): string {
  return `session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
}

/**
 * Middleware: Prüft ob Request authentifiziert ist
 * @returns User-Objekt oder null
 */
export function requireAuth(req: Request): any | null {
  const cookieHeader = req.headers.get("cookie");
  const sessionId = getSessionFromCookie(cookieHeader);

  if (!sessionId) {
    console.log("❌ Keine Session-Cookie gefunden");
    return null;
  }

  const user = validateSession(sessionId);

  if (!user) {
    console.log("❌ Ungültige oder abgelaufene Session");
    return null;
  }

  console.log(`✅ Authentifiziert als: ${user.username} (${user.role})`);
  return user;
}

/**
 * Middleware: Prüft ob User Admin ist
 */
export function requireAdmin(req: Request): any | null {
  const user = requireAuth(req);

  if (!user) return null;

  if (user.role !== "admin") {
    console.log(`❌ User ${user.username} ist kein Admin`);
    return null;
  }

  return user;
}
