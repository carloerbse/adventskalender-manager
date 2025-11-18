# Phase 7: Admin-Bereich - Testing-Anleitung

**Phase**: Admin-Benutzerverwaltung  
**Status**: Testing

---

## 🎯 Testziele

- Admin-Endpoints (CRUD für User-Management) funktionieren
- Admin-Rechte werden korrekt geprüft
- Normale User haben keinen Zugriff auf Admin-Bereich
- Frontend zeigt Admin-Link nur für Admins
- Alle CRUD-Operationen funktionieren im Browser

---

## 🔧 Voraussetzungen

### Backend starten
```powershell
cd server
deno run --allow-net --allow-read --allow-write server.ts
```

### Frontend starten
```powershell
npm run dev
```

### Test-Accounts
- **Admin**: `admin` / `admin123` (muss manuell in DB angelegt werden, siehe unten)
- **Normaler User**: `testuser` / `test123` (kann über Register angelegt werden)

### Admin-User manuell erstellen
```powershell
cd server
deno run --allow-read --allow-write create_test_user.ts
```

Oder über `list_users.ts` prüfen:
```powershell
deno run --allow-read list_users.ts
```

---

## 📋 Test 1: Backend-API mit Postman/curl

### 1.1 Als Admin einloggen
```http
POST http://localhost:8000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Erwartetes Ergebnis:**
- Status: `200 OK`
- Response enthält User-Objekt mit `role: "admin"`
- Cookie `session=...` wird gesetzt

---

### 1.2 Alle Benutzer abrufen (Admin only)
```http
GET http://localhost:8000/api/admin/users
Cookie: session=<SESSION_ID>
```

**Erwartetes Ergebnis:**
- Status: `200 OK`
- Response:
```json
{
  "users": [
    {
      "id": 1,
      "username": "admin",
      "role": "admin",
      "created_at": "2025-11-18T...",
      "calendar_count": 0
    },
    {
      "id": 2,
      "username": "testuser",
      "role": "user",
      "created_at": "2025-11-18T...",
      "calendar_count": 2
    }
  ]
}
```

---

### 1.3 Neuen Benutzer erstellen (Admin only)
```http
POST http://localhost:8000/api/admin/users
Content-Type: application/json
Cookie: session=<SESSION_ID>

{
  "username": "maria.mueller",
  "password": "test1234",
  "role": "user"
}
```

**Erwartetes Ergebnis:**
- Status: `201 Created`
- Response:
```json
{
  "message": "Benutzer erfolgreich erstellt",
  "user": {
    "id": 3,
    "username": "maria.mueller",
    "role": "user",
    "created_at": "2025-11-18T..."
  }
}
```

**Fehlerfall - Username existiert bereits:**
- Status: `409 Conflict`
- Response: `{ "error": "Benutzername existiert bereits" }`

**Fehlerfall - Passwort zu kurz:**
- Status: `400 Bad Request`
- Response: `{ "error": "Passwort muss mindestens 6 Zeichen lang sein" }`

---

### 1.4 Benutzerrolle ändern (Admin only)
```http
PATCH http://localhost:8000/api/admin/users/3/role
Content-Type: application/json
Cookie: session=<SESSION_ID>

{
  "role": "admin"
}
```

**Erwartetes Ergebnis:**
- Status: `200 OK`
- Response:
```json
{
  "message": "Benutzerrolle erfolgreich geändert",
  "user": {
    "id": 3,
    "username": "maria.mueller",
    "role": "admin",
    "created_at": "2025-11-18T..."
  }
}
```

**Fehlerfall - Sich selbst degradieren:**
- Status: `400 Bad Request`
- Response: `{ "error": "Sie können Ihre eigene Admin-Rolle nicht entfernen" }`

---

### 1.5 Benutzer löschen (Admin only)
```http
DELETE http://localhost:8000/api/admin/users/3
Cookie: session=<SESSION_ID>
```

**Erwartetes Ergebnis:**
- Status: `200 OK`
- Response: `{ "message": "Benutzer erfolgreich gelöscht" }`
- Alle Kalender des Benutzers werden auch gelöscht (CASCADE)

**Fehlerfall - Sich selbst löschen:**
- Status: `400 Bad Request`
- Response: `{ "error": "Sie können sich nicht selbst löschen" }`

---

### 1.6 Zugriff ohne Admin-Rechte (Normaler User)

Als normaler User einloggen:
```http
POST http://localhost:8000/api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "test123"
}
```

Dann versuchen, Admin-Endpoint aufzurufen:
```http
GET http://localhost:8000/api/admin/users
Cookie: session=<TESTUSER_SESSION_ID>
```

**Erwartetes Ergebnis:**
- Status: `403 Forbidden`
- Response: `{ "error": "Nicht autorisiert. Admin-Rechte erforderlich." }`

---

## 🌐 Test 2: Frontend im Browser

### 2.1 Als Admin anmelden
1. Öffne: http://localhost:5173/login
2. Eingabe:
   - Username: `admin`
   - Passwort: `admin123`
3. Klicke auf "Anmelden"

**Erwartetes Ergebnis:**
- Weiterleitung zu `/dashboard`
- Header zeigt: "👤 admin"
- **👑 Admin-Button ist sichtbar** (oben rechts neben Abmelden)

---

### 2.2 Admin-Dashboard öffnen
1. Im Dashboard auf **"👑 Admin"** klicken

**Erwartetes Ergebnis:**
- Weiterleitung zu `/admin`
- Seite zeigt:
  - Titel: "👑 Admin-Dashboard"
  - Button: "➕ Neuen Benutzer erstellen"
  - Tabelle mit allen Benutzern (ID, Username, Rolle, Kalender, Erstellt am, Aktionen)
  - Eigener User ist farblich hervorgehoben mit Badge "Sie"

---

### 2.3 Neuen Benutzer erstellen
1. Klicke auf "➕ Neuen Benutzer erstellen"
2. Formular wird eingeblendet
3. Eingabe:
   - Username: `peter.pan`
   - Passwort: `test1234`
   - Passwort bestätigen: `test1234`
   - Rolle: `Normaler Benutzer`
4. Klicke auf "Benutzer erstellen"

**Erwartetes Ergebnis:**
- Erfolgs-Meldung: "✅ Benutzer 'peter.pan' erfolgreich erstellt!"
- Formular wird ausgeblendet
- Neuer User erscheint **oben** in der Tabelle
- Badge zeigt: "👤 User"

---

### 2.4 Benutzerrolle ändern
1. In der Tabelle bei User "peter.pan" auf **"👑"**-Button klicken
2. Bestätigungsdialog: "peter.pan wirklich zum Administrator machen?"
3. Klicke auf "OK"

**Erwartetes Ergebnis:**
- Erfolgs-Meldung: "✅ Benutzerrolle erfolgreich geändert!"
- Badge ändert sich zu: "👑 Admin" (orange/gelb)
- Button ändert sich zu "👤" (für Downgrade)

---

### 2.5 Benutzer löschen
1. In der Tabelle bei User "peter.pan" auf **"🗑️"**-Button klicken
2. Bestätigungsdialog: "Benutzer 'peter.pan' wirklich löschen? Alle Kalender dieses Benutzers werden ebenfalls gelöscht!"
3. Klicke auf "OK"

**Erwartetes Ergebnis:**
- Erfolgs-Meldung: "✅ Benutzer erfolgreich gelöscht!"
- User verschwindet aus der Tabelle

---

### 2.6 Sich selbst NICHT löschen/degradieren können
1. Finde eigenen User (mit Badge "Sie") in der Tabelle

**Erwartetes Ergebnis:**
- Keine Action-Buttons (👑, 🗑️) sichtbar
- Stattdessen Text: "(Sie selbst)"
- Console-Log im Backend: Requests werden abgelehnt

---

### 2.7 Als normaler User anmelden
1. Logout (falls noch als Admin eingeloggt)
2. Login als: `testuser` / `test123`

**Erwartetes Ergebnis:**
- Dashboard zeigt: "👤 testuser"
- **KEIN "👑 Admin"-Button** im Header
- Direkter Aufruf von http://localhost:5173/admin führt zu Weiterleitung nach `/dashboard`

---

### 2.8 Admin-Route manuell aufrufen (Normaler User)
1. Als normaler User eingeloggt
2. URL manuell eingeben: http://localhost:5173/admin

**Erwartetes Ergebnis:**
- Router Guard greift ein
- Automatische Weiterleitung zu `/dashboard`
- Console-Log: "⛔ Admin-Berechtigung erforderlich"

---

## 🔍 Test 3: Edge Cases & Sicherheit

### 3.1 Doppelter Username
1. Als Admin: Neuen User "testuser" erstellen (existiert bereits)

**Erwartetes Ergebnis:**
- Alert: "Benutzername existiert bereits"
- User wird NICHT erstellt

---

### 3.2 Passwort zu kurz
1. Als Admin: Neuen User mit Passwort "123" erstellen

**Erwartetes Ergebnis:**
- Validierung zeigt Fehler: "Passwort muss mindestens 6 Zeichen lang sein"
- Submit-Button funktioniert nicht

---

### 3.3 Passwörter stimmen nicht überein
1. Passwort: `test1234`
2. Passwort bestätigen: `test4321`

**Erwartetes Ergebnis:**
- Validierung zeigt Fehler: "Passwörter stimmen nicht überein"
- Submit-Button funktioniert nicht

---

### 3.4 Session-Timeout
1. Als Admin einloggen
2. Session-Cookie manuell in DevTools löschen
3. Versuche, Admin-Aktion durchzuführen

**Erwartetes Ergebnis:**
- Backend: Status `401 Unauthorized` oder `403 Forbidden`
- Frontend: Automatische Weiterleitung zu `/login`

---

### 3.5 CORS-Test
1. Backend und Frontend laufen
2. Backend-Log prüfen bei jedem Frontend-Request

**Erwartetes Ergebnis:**
- Jeder Request zeigt: `📨 [METHOD] [PATH] - Origin: http://localhost:5173`
- Response enthält: `Access-Control-Allow-Origin: http://localhost:5173`
- Cookie wird mitgesendet (Credentials: include)

---

## ✅ Checkliste

### Backend
- [X] GET /api/admin/users gibt alle User zurück
- [X] POST /api/admin/users erstellt neuen User
- [X] DELETE /api/admin/users/:id löscht User
- [X] PATCH /api/admin/users/:id/role ändert Rolle
- [X] Admin kann sich nicht selbst löschen
- [X] Admin kann eigene Rolle nicht zu "user" ändern
- [X] Normaler User hat KEINEN Zugriff (403 Forbidden)
- [X] Validierung: Username unique, Passwort min. 6 Zeichen
- [X] CASCADE-Delete: Kalender werden mit gelöscht

### Frontend
- [X] Admin-Button nur für Admins sichtbar
- [X] Admin-Dashboard öffnet sich (/admin)
- [X] UserList zeigt alle Benutzer in Tabelle
- [X] Eigener User ist hervorgehoben
- [X] UserForm: Neuen User erstellen funktioniert
- [X] Rolle ändern (👑/👤) funktioniert
- [X] User löschen (🗑️) funktioniert
- [X] Bestätigungsdialoge werden angezeigt
- [X] Success/Error-Messages erscheinen
- [X] Normaler User wird von /admin weitergeleitet
- [X] Router Guard funktioniert (requiresAdmin)
- [X] Formular-Validierung funktioniert
- [X] Reactive Updates (Pinia Store)


