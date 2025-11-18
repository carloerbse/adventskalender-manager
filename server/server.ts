// server/server.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { initDatabase, closeDatabase } from "./database.ts";
import { requireAuth } from "./auth.ts";
import {
  handleRegister,
  handleLogin,
  handleLogout,
  handleSessionCheck,
} from "./routes/auth.ts";
import {
  handleGetCalendars,
  handleCreateCalendar,
  handleGetCalendar,
  handleUpdateCalendar,
  handleDeleteCalendar,
  handleShuffleCalendar,
  handleExportCalendar,
} from "./routes/calendars.ts";
import {
  getPouches,
  updatePouch,
  togglePouchPacked,
} from "./routes/pouches.ts";
import { handleAdminRoutes } from "./routes/admin.ts";

const PORT = 8000;

// Datenbank initialisieren beim Server-Start
const db = initDatabase();

console.log(`🚀 Deno-Server läuft auf http://localhost:${PORT}`);

// Graceful Shutdown: Datenbank schließen bei Server-Stop
globalThis.addEventListener("unload", () => {
  closeDatabase();
});

serve(async (req: Request) => {
  const url = new URL(req.url);
  
  // Log alle Requests
  console.log(`📨 ${req.method} ${url.pathname} - Origin: ${req.headers.get("origin") || "keine"}`);

  // CORS-Headers für Frontend (localhost:5173)
  const origin = req.headers.get("origin") || "";
  const allowedOrigins = [
    "http://localhost:5173", 
    "http://127.0.0.1:5173"
  ];
  const corsOrigin = allowedOrigins.includes(origin) ? origin : "http://localhost:5173";
  
  console.log(`🔐 CORS: Anfrage von "${origin}" -> Antworte mit "${corsOrigin}"`);
  
  const corsHeaders = {
    "Access-Control-Allow-Origin": corsOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };

  // CORS Preflight Request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Auth-Endpoints
  if (url.pathname === "/api/auth/register" && req.method === "POST") {
    return await handleRegister(req, corsHeaders);
  }

  if (url.pathname === "/api/auth/login" && req.method === "POST") {
    return await handleLogin(req, corsHeaders);
  }

  if (url.pathname === "/api/auth/logout" && req.method === "POST") {
    return handleLogout(req, corsHeaders);
  }

  if (url.pathname === "/api/auth/session" && req.method === "GET") {
    return handleSessionCheck(req, corsHeaders);
  }

  // Admin-Endpoints (erfordern Admin-Rechte)
  if (url.pathname.startsWith("/api/admin")) {
    const response = await handleAdminRoutes(req, url.pathname);
    
    if (response) {
      // CORS-Headers hinzufügen
      const newHeaders = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        newHeaders.set(key, value);
      });
      return new Response(response.body, {
        status: response.status,
        headers: newHeaders,
      });
    }
  }

  // Kalender-Endpoints (alle erfordern Authentifizierung)
  if (url.pathname.startsWith("/api/calendars")) {
    const user = requireAuth(req);
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Nicht authentifiziert" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // GET /api/calendars - Alle Kalender des Users
    if (url.pathname === "/api/calendars" && req.method === "GET") {
      const response = await handleGetCalendars(req, user.id);
      // CORS-Headers hinzufügen
      const newHeaders = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        newHeaders.set(key, value);
      });
      return new Response(response.body, {
        status: response.status,
        headers: newHeaders,
      });
    }

    // POST /api/calendars - Neuen Kalender erstellen
    if (url.pathname === "/api/calendars" && req.method === "POST") {
      const response = await handleCreateCalendar(req, user.id);
      const newHeaders = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        newHeaders.set(key, value);
      });
      return new Response(response.body, {
        status: response.status,
        headers: newHeaders,
      });
    }

    // GET /api/calendars/:id - Einzelnen Kalender abrufen
    const getCalendarMatch = url.pathname.match(/^\/api\/calendars\/(\d+)$/);
    if (getCalendarMatch && req.method === "GET") {
      const calendarId = parseInt(getCalendarMatch[1]);
      const response = await handleGetCalendar(req, user.id, calendarId);
      const newHeaders = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        newHeaders.set(key, value);
      });
      return new Response(response.body, {
        status: response.status,
        headers: newHeaders,
      });
    }

    // PUT /api/calendars/:id - Kalender aktualisieren
    const updateCalendarMatch = url.pathname.match(/^\/api\/calendars\/(\d+)$/);
    if (updateCalendarMatch && req.method === "PUT") {
      const calendarId = parseInt(updateCalendarMatch[1]);
      const response = await handleUpdateCalendar(req, user.id, calendarId);
      const newHeaders = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        newHeaders.set(key, value);
      });
      return new Response(response.body, {
        status: response.status,
        headers: newHeaders,
      });
    }

    // DELETE /api/calendars/:id - Kalender löschen
    const deleteCalendarMatch = url.pathname.match(/^\/api\/calendars\/(\d+)$/);
    if (deleteCalendarMatch && req.method === "DELETE") {
      const calendarId = parseInt(deleteCalendarMatch[1]);
      const response = await handleDeleteCalendar(req, user.id, calendarId);
      const newHeaders = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        newHeaders.set(key, value);
      });
      return new Response(response.body, {
        status: response.status,
        headers: newHeaders,
      });
    }

    // POST /api/calendars/:id/shuffle - Säckchen-Inhalte mischen
    const shuffleCalendarMatch = url.pathname.match(/^\/api\/calendars\/(\d+)\/shuffle$/);
    if (shuffleCalendarMatch && req.method === "POST") {
      const calendarId = parseInt(shuffleCalendarMatch[1]);
      const response = await handleShuffleCalendar(req, user.id, calendarId);
      const newHeaders = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        newHeaders.set(key, value);
      });
      return new Response(response.body, {
        status: response.status,
        headers: newHeaders,
      });
    }

    // GET /api/calendars/:id/export - Kalender exportieren (JSON oder CSV)
    const exportCalendarMatch = url.pathname.match(/^\/api\/calendars\/(\d+)\/export$/);
    if (exportCalendarMatch && req.method === "GET") {
      const calendarId = parseInt(exportCalendarMatch[1]);
      const response = await handleExportCalendar(req, user.id, calendarId);
      const newHeaders = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        newHeaders.set(key, value);
      });
      return new Response(response.body, {
        status: response.status,
        headers: newHeaders,
      });
    }

    // GET /api/calendars/:id/pouches - Alle Säckchen eines Kalenders
    const getPouchesMatch = url.pathname.match(/^\/api\/calendars\/(\d+)\/pouches$/);
    if (getPouchesMatch && req.method === "GET") {
      const response = await getPouches(req, user.id);
      const newHeaders = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        newHeaders.set(key, value);
      });
      return new Response(response.body, {
        status: response.status,
        headers: newHeaders,
      });
    }
  }

  // Säckchen-Endpoints (alle erfordern Authentifizierung)
  if (url.pathname.startsWith("/api/pouches")) {
    const user = requireAuth(req);
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Nicht authentifiziert" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // PUT /api/pouches/:id - Säckchen aktualisieren
    const updatePouchMatch = url.pathname.match(/^\/api\/pouches\/(\d+)$/);
    if (updatePouchMatch && req.method === "PUT") {
      const response = await updatePouch(req, user.id);
      const newHeaders = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        newHeaders.set(key, value);
      });
      return new Response(response.body, {
        status: response.status,
        headers: newHeaders,
      });
    }

    // PATCH /api/pouches/:id/toggle - Gepackt-Status umschalten
    const togglePouchMatch = url.pathname.match(/^\/api\/pouches\/(\d+)\/toggle$/);
    if (togglePouchMatch && req.method === "PATCH") {
      const response = await togglePouchPacked(req, user.id);
      const newHeaders = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        newHeaders.set(key, value);
      });
      return new Response(response.body, {
        status: response.status,
        headers: newHeaders,
      });
    }
  }

  // Test-Endpoint
  if (url.pathname === "/api/hello") {
    const body = JSON.stringify({ 
      message: "Hallo Adventskalender-Manager! 🎄",
      database: "connected",
      timestamp: new Date().toISOString()
    });

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }

  // 404 für unbekannte Routen
  return new Response(
    JSON.stringify({ error: "Not Found" }), 
    { 
      status: 404,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      }
    }
  );
}, { port: PORT });
