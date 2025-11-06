// server/server.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { initDatabase, closeDatabase } from "./database.ts";
import {
  handleRegister,
  handleLogin,
  handleLogout,
  handleSessionCheck,
} from "./routes/auth.ts";

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
