// server/routes/pouches.ts
// API-Routen für Säckchen-Verwaltung

import { getDatabase, isCalendarOwnedByUser } from "../database.ts";

/**
 * GET /api/calendars/:id/pouches
 * Holt alle 24 Säckchen eines Kalenders
 */
export async function getPouches(req: Request, userId: number): Promise<Response> {
  try {
    // Kalender-ID aus URL extrahieren
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const calendarId = parseInt(pathParts[3]); // /api/calendars/:id/pouches

    if (isNaN(calendarId)) {
      return new Response(
        JSON.stringify({ error: "Ungültige Kalender-ID" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Prüfen ob Kalender dem Benutzer gehört
    if (!isCalendarOwnedByUser(calendarId, userId)) {
      return new Response(
        JSON.stringify({ error: "Kalender nicht gefunden oder keine Berechtigung" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Säckchen aus Datenbank holen
    const db = getDatabase();
    const pouches = db.query(`
      SELECT id, calendar_id, number, content, notes, is_packed, created_at
      FROM pouches
      WHERE calendar_id = ?
      ORDER BY number ASC
    `, [calendarId]);

    const pouchesData = pouches.map((row: unknown[]) => ({
      id: row[0] as number,
      calendar_id: row[1] as number,
      number: row[2] as number,
      content: row[3] as string,
      notes: row[4] as string,
      is_packed: row[5] as number === 1,
      created_at: row[6] as string,
    }));

    return new Response(
      JSON.stringify({ pouches: pouchesData }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Fehler beim Laden der Säckchen:", error);
    return new Response(
      JSON.stringify({ error: "Interner Serverfehler" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/**
 * PUT /api/pouches/:id
 * Aktualisiert ein Säckchen (Content, Notes, is_packed)
 */
export async function updatePouch(req: Request, userId: number): Promise<Response> {
  try {
    // Säckchen-ID aus URL extrahieren
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const pouchId = parseInt(pathParts[3]); // /api/pouches/:id

    if (isNaN(pouchId)) {
      return new Response(
        JSON.stringify({ error: "Ungültige Säckchen-ID" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Request Body parsen
    const body = await req.json();
    const { content, notes, is_packed } = body;

    // Validierung
    if (content === undefined || notes === undefined || is_packed === undefined) {
      return new Response(
        JSON.stringify({ error: "Fehlende Felder: content, notes, is_packed erforderlich" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validierung: Content max. 200 Zeichen
    if (typeof content !== "string" || content.length > 200) {
      return new Response(
        JSON.stringify({ error: "Inhalt darf maximal 200 Zeichen lang sein" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validierung: Notes max. 500 Zeichen
    if (typeof notes !== "string" || notes.length > 500) {
      return new Response(
        JSON.stringify({ error: "Notizen dürfen maximal 500 Zeichen lang sein" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validierung: is_packed ist boolean
    if (typeof is_packed !== "boolean") {
      return new Response(
        JSON.stringify({ error: "is_packed muss ein Boolean sein" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const db = getDatabase();

    // Prüfen ob Säckchen existiert und dem Benutzer gehört
    const pouchCheck = db.query(`
      SELECT p.id, p.calendar_id, c.user_id
      FROM pouches p
      JOIN calendars c ON p.calendar_id = c.id
      WHERE p.id = ?
    `, [pouchId]);

    if (pouchCheck.length === 0) {
      return new Response(
        JSON.stringify({ error: "Säckchen nicht gefunden" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const calendarUserId = pouchCheck[0][2] as number;
    if (calendarUserId !== userId) {
      return new Response(
        JSON.stringify({ error: "Keine Berechtigung für dieses Säckchen" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Säckchen aktualisieren
    db.query(`
      UPDATE pouches
      SET content = ?, notes = ?, is_packed = ?
      WHERE id = ?
    `, [content, notes, is_packed ? 1 : 0, pouchId]);

    // Aktualisiertes Säckchen zurückgeben
    const updatedPouch = db.query(`
      SELECT id, calendar_id, number, content, notes, is_packed, created_at
      FROM pouches
      WHERE id = ?
    `, [pouchId]);

    const row = updatedPouch[0];
    const pouchData = {
      id: row[0] as number,
      calendar_id: row[1] as number,
      number: row[2] as number,
      content: row[3] as string,
      notes: row[4] as string,
      is_packed: row[5] as number === 1,
      created_at: row[6] as string,
    };

    console.log(`✅ Säckchen ${pouchId} aktualisiert`);

    return new Response(
      JSON.stringify({ pouch: pouchData }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Säckchens:", error);
    return new Response(
      JSON.stringify({ error: "Interner Serverfehler" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/**
 * PATCH /api/pouches/:id/toggle
 * Schaltet den is_packed Status eines Säckchens um
 */
export async function togglePouchPacked(req: Request, userId: number): Promise<Response> {
  try {
    // Säckchen-ID aus URL extrahieren
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const pouchId = parseInt(pathParts[3]); // /api/pouches/:id/toggle

    if (isNaN(pouchId)) {
      return new Response(
        JSON.stringify({ error: "Ungültige Säckchen-ID" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const db = getDatabase();

    // Prüfen ob Säckchen existiert und dem Benutzer gehört
    const pouchCheck = db.query(`
      SELECT p.id, p.calendar_id, c.user_id, p.is_packed
      FROM pouches p
      JOIN calendars c ON p.calendar_id = c.id
      WHERE p.id = ?
    `, [pouchId]);

    if (pouchCheck.length === 0) {
      return new Response(
        JSON.stringify({ error: "Säckchen nicht gefunden" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const calendarUserId = pouchCheck[0][2] as number;
    if (calendarUserId !== userId) {
      return new Response(
        JSON.stringify({ error: "Keine Berechtigung für dieses Säckchen" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const currentIsPacked = pouchCheck[0][3] as number;
    const newIsPacked = currentIsPacked === 1 ? 0 : 1;

    // Status umschalten
    db.query(`
      UPDATE pouches
      SET is_packed = ?
      WHERE id = ?
    `, [newIsPacked, pouchId]);

    // Aktualisiertes Säckchen zurückgeben
    const updatedPouch = db.query(`
      SELECT id, calendar_id, number, content, notes, is_packed, created_at
      FROM pouches
      WHERE id = ?
    `, [pouchId]);

    const row = updatedPouch[0];
    const pouchData = {
      id: row[0] as number,
      calendar_id: row[1] as number,
      number: row[2] as number,
      content: row[3] as string,
      notes: row[4] as string,
      is_packed: row[5] as number === 1,
      created_at: row[6] as string,
    };

    console.log(`✅ Säckchen ${pouchId} Status umgeschaltet: ${newIsPacked === 1 ? "gepackt" : "nicht gepackt"}`);

    return new Response(
      JSON.stringify({ pouch: pouchData }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Fehler beim Umschalten des Säckchen-Status:", error);
    return new Response(
      JSON.stringify({ error: "Interner Serverfehler" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
