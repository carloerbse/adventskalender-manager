// server/server.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const PORT = 8000;

console.log(`Deno-Server läuft auf http://localhost:${PORT}`);

serve((req: Request) => {
  const url = new URL(req.url);

  if (url.pathname === "/api/hello") {
    const body = JSON.stringify({ message: "Hallo Adventskalender-Manager! 🎄" });

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new Response("Not Found", { status: 404 });
}, { port: PORT });
