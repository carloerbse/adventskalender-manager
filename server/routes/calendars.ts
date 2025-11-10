// server/routes/calendars.ts
// API-Routen für Kalender-CRUD-Operationen

import {
  getCalendarsByUserId,
  getCalendarById,
  createCalendar,
  updateCalendar,
  deleteCalendar,
  isCalendarOwnedByUser,
  shufflePouches,
  getCalendarWithPouches,
  convertToCSV,
} from "../database.ts";

/**
 * GET /api/calendars
 * Holt alle Kalender des aktuell eingeloggten Benutzers
 */
export async function handleGetCalendars(req: Request, userId: number): Promise<Response> {
  try {
    const calendars = getCalendarsByUserId(userId);
    
    return new Response(JSON.stringify({ calendars }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Fehler beim Abrufen der Kalender:", error);
    return new Response(
      JSON.stringify({ error: "Fehler beim Abrufen der Kalender" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/**
 * POST /api/calendars
 * Erstellt einen neuen Kalender mit 24 leeren Säckchen
 */
export async function handleCreateCalendar(req: Request, userId: number): Promise<Response> {
  try {
    const body = await req.json();
    const { name, description } = body;

    // Validierung
    if (!name || typeof name !== "string" || name.trim() === "") {
      return new Response(
        JSON.stringify({ error: "Name ist erforderlich" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (name.length > 100) {
      return new Response(
        JSON.stringify({ error: "Name darf maximal 100 Zeichen lang sein" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const desc = description || "";
    
    if (desc.length > 500) {
      return new Response(
        JSON.stringify({ error: "Beschreibung darf maximal 500 Zeichen lang sein" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Kalender erstellen (inkl. 24 Säckchen)
    const calendarId = createCalendar(userId, name.trim(), desc.trim());

    // Neu erstellten Kalender zurückgeben
    const calendar = getCalendarById(calendarId);

    return new Response(JSON.stringify({ calendar }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Fehler beim Erstellen des Kalenders:", error);
    return new Response(
      JSON.stringify({ error: "Fehler beim Erstellen des Kalenders" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/**
 * GET /api/calendars/:id
 * Holt einen einzelnen Kalender nach ID
 */
export async function handleGetCalendar(
  req: Request,
  userId: number,
  calendarId: number
): Promise<Response> {
  try {
    const calendar = getCalendarById(calendarId);

    if (!calendar) {
      return new Response(
        JSON.stringify({ error: "Kalender nicht gefunden" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Prüfen ob Kalender dem User gehört (User-Isolation!)
    if (calendar.user_id !== userId) {
      return new Response(
        JSON.stringify({ error: "Zugriff verweigert" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ calendar }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Fehler beim Abrufen des Kalenders:", error);
    return new Response(
      JSON.stringify({ error: "Fehler beim Abrufen des Kalenders" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/**
 * PUT /api/calendars/:id
 * Aktualisiert einen bestehenden Kalender
 */
export async function handleUpdateCalendar(
  req: Request,
  userId: number,
  calendarId: number
): Promise<Response> {
  try {
    // Erst prüfen ob Kalender existiert und dem User gehört
    if (!isCalendarOwnedByUser(calendarId, userId)) {
      return new Response(
        JSON.stringify({ error: "Kalender nicht gefunden oder Zugriff verweigert" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { name, description } = body;

    // Validierung
    if (!name || typeof name !== "string" || name.trim() === "") {
      return new Response(
        JSON.stringify({ error: "Name ist erforderlich" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (name.length > 100) {
      return new Response(
        JSON.stringify({ error: "Name darf maximal 100 Zeichen lang sein" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const desc = description || "";
    
    if (desc.length > 500) {
      return new Response(
        JSON.stringify({ error: "Beschreibung darf maximal 500 Zeichen lang sein" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Kalender aktualisieren
    const success = updateCalendar(calendarId, name.trim(), desc.trim());

    if (!success) {
      return new Response(
        JSON.stringify({ error: "Fehler beim Aktualisieren" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Aktualisierten Kalender zurückgeben
    const calendar = getCalendarById(calendarId);

    return new Response(JSON.stringify({ calendar }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Kalenders:", error);
    return new Response(
      JSON.stringify({ error: "Fehler beim Aktualisieren des Kalenders" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/**
 * DELETE /api/calendars/:id
 * Löscht einen Kalender (inkl. aller Säckchen)
 */
export async function handleDeleteCalendar(
  req: Request,
  userId: number,
  calendarId: number
): Promise<Response> {
  try {
    // Erst prüfen ob Kalender existiert und dem User gehört
    if (!isCalendarOwnedByUser(calendarId, userId)) {
      return new Response(
        JSON.stringify({ error: "Kalender nicht gefunden oder Zugriff verweigert" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Kalender löschen
    const success = deleteCalendar(calendarId);

    if (!success) {
      return new Response(
        JSON.stringify({ error: "Fehler beim Löschen" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "Kalender erfolgreich gelöscht" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Fehler beim Löschen des Kalenders:", error);
    return new Response(
      JSON.stringify({ error: "Fehler beim Löschen des Kalenders" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/**
 * POST /api/calendars/:id/shuffle
 * Mischt die Inhalte aller 24 Säckchen zufällig neu
 */
export async function handleShuffleCalendar(
  req: Request,
  userId: number,
  calendarId: number
): Promise<Response> {
  try {
    // Erst prüfen ob Kalender existiert und dem User gehört
    if (!isCalendarOwnedByUser(calendarId, userId)) {
      return new Response(
        JSON.stringify({ error: "Kalender nicht gefunden oder Zugriff verweigert" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Säckchen mischen
    const pouches = shufflePouches(calendarId);

    return new Response(
      JSON.stringify({ 
        message: "Säckchen erfolgreich gemischt",
        pouches 
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Fehler beim Mischen der Säckchen:", error);
    return new Response(
      JSON.stringify({ error: "Fehler beim Mischen der Säckchen" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/**
 * GET /api/calendars/:id/export?format=json|csv
 * Exportiert einen Kalender als JSON oder CSV
 */
export async function handleExportCalendar(
  req: Request,
  userId: number,
  calendarId: number
): Promise<Response> {
  try {
    // Erst prüfen ob Kalender existiert und dem User gehört
    if (!isCalendarOwnedByUser(calendarId, userId)) {
      return new Response(
        JSON.stringify({ error: "Kalender nicht gefunden oder Zugriff verweigert" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Format aus Query-Parameter lesen
    const url = new URL(req.url);
    const format = url.searchParams.get("format") || "json";

    if (format !== "json" && format !== "csv") {
      return new Response(
        JSON.stringify({ error: "Ungültiges Format. Nutze 'json' oder 'csv'" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Kalenderdaten holen
    const data = getCalendarWithPouches(calendarId);

    if (!data) {
      return new Response(
        JSON.stringify({ error: "Kalender nicht gefunden" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Dateiname generieren (ohne Sonderzeichen)
    const filename = `${data.calendar.name.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`;

    if (format === "json") {
      // JSON-Export
      return new Response(JSON.stringify(data, null, 2), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="${filename}.json"`,
        },
      });
    } else {
      // CSV-Export
      const csv = convertToCSV(calendarId);
      
      return new Response(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}.csv"`,
        },
      });
    }
  } catch (error) {
    console.error("Fehler beim Exportieren des Kalenders:", error);
    return new Response(
      JSON.stringify({ error: "Fehler beim Exportieren des Kalenders" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
