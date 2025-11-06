// server/routes/auth.ts
// Authentifizierungs-Endpoints

import { getDatabase } from "../database.ts";
import {
  hashPassword,
  verifyPassword,
  createSession,
  deleteSession,
  validateSession,
  getSessionFromCookie,
  createSessionCookie,
  createLogoutCookie,
} from "../auth.ts";

/**
 * POST /api/auth/register
 * Registriert einen neuen Benutzer
 */
export async function handleRegister(req: Request, corsHeaders: HeadersInit): Promise<Response> {
  try {
    const body = await req.json();
    const { username, password } = body;

    // Validierung
    if (!username || !password) {
      return new Response(
        JSON.stringify({ error: "Username und Password erforderlich" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    if (username.length < 3) {
      return new Response(
        JSON.stringify({ error: "Username muss mindestens 3 Zeichen lang sein" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    if (password.length < 6) {
      return new Response(
        JSON.stringify({ error: "Passwort muss mindestens 6 Zeichen lang sein" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    const db = getDatabase();

    // Prüfen ob Username bereits existiert
    const existing = db.query(
      `SELECT id FROM users WHERE username = ?`,
      [username],
    );

    if (existing.length > 0) {
      return new Response(
        JSON.stringify({ error: "Username bereits vergeben" }),
        {
          status: 409,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    // Passwort hashen
    const passwordHash = await hashPassword(password);

    // Benutzer erstellen
    db.query(
      `INSERT INTO users (username, password_hash, role) VALUES (?, ?, 'user')`,
      [username, passwordHash],
    );

    // User-ID abrufen
    const result = db.query(
      `SELECT id, username, role FROM users WHERE username = ?`,
      [username],
    );

    const [id, dbUsername, role] = result[0];

    console.log(`✅ Neuer Benutzer registriert: ${username} (ID: ${id})`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Registrierung erfolgreich",
        user: { id, username: dbUsername, role },
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  } catch (error) {
    console.error("❌ Registrierungsfehler:", error);
    return new Response(
      JSON.stringify({ error: "Interner Serverfehler" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }
}

/**
 * POST /api/auth/login
 * Meldet einen Benutzer an
 */
export async function handleLogin(req: Request, corsHeaders: HeadersInit): Promise<Response> {
  try {
    const body = await req.json();
    const { username, password } = body;

    // Validierung
    if (!username || !password) {
      return new Response(
        JSON.stringify({ error: "Username und Password erforderlich" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    const db = getDatabase();

    // Benutzer suchen
    const result = db.query(
      `SELECT id, username, password_hash, role FROM users WHERE username = ?`,
      [username],
    );

    if (result.length === 0) {
      return new Response(
        JSON.stringify({ error: "Ungültige Anmeldedaten" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    const [id, dbUsername, passwordHash, role] = result[0];

    // Passwort prüfen
    const isValid = await verifyPassword(password, passwordHash as string);

    if (!isValid) {
      return new Response(
        JSON.stringify({ error: "Ungültige Anmeldedaten" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    // Session erstellen
    const sessionId = createSession(id as number, 24);

    console.log(`✅ Login erfolgreich: ${username}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Login erfolgreich",
        user: { id, username: dbUsername, role },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": createSessionCookie(sessionId),
          ...corsHeaders,
        },
      },
    );
  } catch (error) {
    console.error("❌ Login-Fehler:", error);
    return new Response(
      JSON.stringify({ error: "Interner Serverfehler" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }
}

/**
 * POST /api/auth/logout
 * Meldet einen Benutzer ab
 */
export function handleLogout(req: Request, corsHeaders: HeadersInit): Response {
  const cookieHeader = req.headers.get("cookie");
  const sessionId = getSessionFromCookie(cookieHeader);

  if (sessionId) {
    deleteSession(sessionId);
  }

  console.log(`✅ Logout erfolgreich`);

  return new Response(
    JSON.stringify({ success: true, message: "Logout erfolgreich" }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": createLogoutCookie(),
        ...corsHeaders,
      },
    },
  );
}

/**
 * GET /api/auth/session
 * Prüft die aktuelle Session
 */
export function handleSessionCheck(req: Request, corsHeaders: HeadersInit): Response {
  const cookieHeader = req.headers.get("cookie");
  const sessionId = getSessionFromCookie(cookieHeader);

  if (!sessionId) {
    return new Response(
      JSON.stringify({ authenticated: false }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }

  const user = validateSession(sessionId);

  if (!user) {
    return new Response(
      JSON.stringify({ authenticated: false }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": createLogoutCookie(),
          ...corsHeaders,
        },
      },
    );
  }

  return new Response(
    JSON.stringify({
      authenticated: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    },
  );
}
