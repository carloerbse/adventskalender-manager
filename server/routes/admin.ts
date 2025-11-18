// server/routes/admin.ts
// Admin-API für Benutzerverwaltung

import { requireAdmin } from "../auth.ts";
import { hashPassword } from "../auth.ts";
import {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUserRole,
} from "../database.ts";

/**
 * Admin-Router
 * Alle Routes erfordern Admin-Rechte
 */
export async function handleAdminRoutes(
  req: Request,
  pathname: string,
): Promise<Response | null> {
  // Admin-Authentifizierung prüfen
  const admin = requireAdmin(req);
  
  if (!admin) {
    return new Response(
      JSON.stringify({ error: "Nicht autorisiert. Admin-Rechte erforderlich." }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  // ============================================================================
  // GET /api/admin/users - Alle Benutzer auflisten
  // ============================================================================
  if (pathname === "/api/admin/users" && req.method === "GET") {
    try {
      const users = getAllUsers();

      return new Response(JSON.stringify({ users }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("❌ Fehler beim Laden der Benutzer:", error);
      return new Response(
        JSON.stringify({ error: "Fehler beim Laden der Benutzer" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // ============================================================================
  // POST /api/admin/users - Neuen Benutzer erstellen
  // ============================================================================
  if (pathname === "/api/admin/users" && req.method === "POST") {
    try {
      const body = await req.json();
      const { username, password, role } = body;

      // Validierung
      if (!username || typeof username !== "string" || username.trim().length === 0) {
        return new Response(
          JSON.stringify({ error: "Benutzername ist erforderlich" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      if (!password || typeof password !== "string" || password.length < 6) {
        return new Response(
          JSON.stringify({ error: "Passwort muss mindestens 6 Zeichen lang sein" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const userRole = role && role === "admin" ? "admin" : "user";

      // Passwort hashen
      const passwordHash = await hashPassword(password);

      // Benutzer erstellen
      const userId = createUser(username.trim(), passwordHash, userRole);

      if (!userId) {
        return new Response(
          JSON.stringify({ error: "Benutzername existiert bereits" }),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );
      }

      // Neu erstellten Benutzer laden
      const newUser = getUserById(userId);

      return new Response(
        JSON.stringify({ 
          message: "Benutzer erfolgreich erstellt",
          user: newUser
        }),
        { status: 201, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("❌ Fehler beim Erstellen des Benutzers:", error);
      return new Response(
        JSON.stringify({ error: "Fehler beim Erstellen des Benutzers" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // ============================================================================
  // DELETE /api/admin/users/:id - Benutzer löschen
  // ============================================================================
  const deleteMatch = pathname.match(/^\/api\/admin\/users\/(\d+)$/);
  if (deleteMatch && req.method === "DELETE") {
    const userId = parseInt(deleteMatch[1]);

    // Prüfen: Admin darf sich nicht selbst löschen
    if (userId === admin.id) {
      return new Response(
        JSON.stringify({ error: "Sie können sich nicht selbst löschen" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    try {
      const success = deleteUser(userId);

      if (!success) {
        return new Response(
          JSON.stringify({ error: "Benutzer nicht gefunden" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ message: "Benutzer erfolgreich gelöscht" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("❌ Fehler beim Löschen des Benutzers:", error);
      return new Response(
        JSON.stringify({ error: "Fehler beim Löschen des Benutzers" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // ============================================================================
  // PATCH /api/admin/users/:id/role - Benutzerrolle ändern
  // ============================================================================
  const roleMatch = pathname.match(/^\/api\/admin\/users\/(\d+)\/role$/);
  if (roleMatch && req.method === "PATCH") {
    const userId = parseInt(roleMatch[1]);

    try {
      const body = await req.json();
      const { role } = body;

      // Validierung
      if (!role || (role !== "user" && role !== "admin")) {
        return new Response(
          JSON.stringify({ error: "Gültige Rolle erforderlich (user oder admin)" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Prüfen: Admin darf sich nicht selbst degradieren
      if (userId === admin.id && role === "user") {
        return new Response(
          JSON.stringify({ error: "Sie können Ihre eigene Admin-Rolle nicht entfernen" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const success = updateUserRole(userId, role);

      if (!success) {
        return new Response(
          JSON.stringify({ error: "Benutzer nicht gefunden" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      // Aktualisierten Benutzer laden
      const updatedUser = getUserById(userId);

      return new Response(
        JSON.stringify({ 
          message: "Benutzerrolle erfolgreich geändert",
          user: updatedUser
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("❌ Fehler beim Ändern der Benutzerrolle:", error);
      return new Response(
        JSON.stringify({ error: "Fehler beim Ändern der Benutzerrolle" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // Kein Match für Admin-Routes
  return null;
}
