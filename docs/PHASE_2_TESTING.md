# Testing Phase 2: Authentifizierung

## 🧪 Testplan für Phase 2

### Voraussetzungen
- Server läuft auf Port 8000 (Deno)
- Frontend läuft auf Port 5173 (Vite)
- Browser mit DevTools (Chrome/Edge empfohlen)

---

## Test 1: Registrierung 📝

### Schritt 1: Registrierungs-Seite öffnen
1. Browser öffnen
2. Navigiere zu: http://localhost:5173/register
3. **Erwartung**: Schönes Formular mit Gradient-Background

### Schritt 2: Gültigen User registrieren
1. Username eingeben: `testuser1`
2. Passwort eingeben: `test123456`
3. Passwort bestätigen: `test123456`
4. Button "Registrieren" klicken
5. **Erwartung**: 
   - ✅ Grüner Success-Banner erscheint
   - Nach 2 Sekunden: Auto-Redirect zu `/login`

### Schritt 3: Validierung testen
1. Zurück zu `/register`
2. Versuche mit zu kurzem Passwort (z.B. `test`)
3. **Erwartung**: Browser-Validierung verhindert Submit
4. Versuche mit unterschiedlichen Passwörtern
5. **Erwartung**: Fehlermeldung "Passwörter stimmen nicht überein"

### Schritt 4: Doppelte Registrierung
1. Erneut `testuser1` / `test123456` eingeben
2. **Erwartung**: Fehlermeldung "Benutzername bereits vergeben"

---

## Test 2: Login 🔐

### Schritt 1: Login-Seite öffnen
1. Navigiere zu: http://localhost:5173/login
2. **Erwartung**: Login-Formular mit Hero-Section

### Schritt 2: Erfolgreicher Login
1. Username: `testuser1`
2. Passwort: `test123456`
3. Button "Anmelden" klicken
4. **Erwartung**:
   - Weiterleitung zu `/dashboard`
   - Header zeigt Username "👤 testuser1"
   - Willkommens-Card wird angezeigt

### Schritt 3: Falsches Passwort
1. Logout drücken (weiterleitung zu `/login`)
2. Login mit: `testuser1` / `falsches_passwort`
3. **Erwartung**: Fehlermeldung "Ungültige Anmeldedaten"

### Schritt 4: Nicht existierender User
1. Login mit: `nichtda` / `egal123456`
2. **Erwartung**: Fehlermeldung "Ungültige Anmeldedaten"

---

## Test 3: Router Guards 🛡️

### Schritt 1: Zugriff auf geschützte Route ohne Login
1. Im Browser: Öffne neuen Tab oder Inkognito-Modus
2. Navigiere direkt zu: http://localhost:5173/dashboard
3. **Erwartung**: Automatischer Redirect zu `/login`
4. Console zeigt: "🔒 Route benötigt Auth, weiterleiten zu /login"

### Schritt 2: Zugriff auf Login-Route wenn eingeloggt
1. Logge dich ein (falls nicht schon eingeloggt)
2. Manuell zu `/login` navigieren
3. **Erwartung**: Automatischer Redirect zu `/dashboard`
4. Console zeigt: "👤 Bereits eingeloggt, weiterleiten zu /dashboard"

### Schritt 3: Home-Route Redirect
1. Navigiere zu: http://localhost:5173/
2. **Erwartung**: 
   - Wenn eingeloggt: Redirect zu `/dashboard`
   - Wenn nicht eingeloggt: Redirect zu `/login`

---

## Test 4: Session-Persistenz 🔄

### Schritt 1: Session bleibt über Reload erhalten
1. Logge dich ein auf `/dashboard`
2. Drücke F5 (Seite neu laden)
3. **Erwartung**: 
   - Du bleibst eingeloggt
   - Dashboard wird wieder angezeigt
   - Console zeigt: "✅ Session gültig: testuser1"

### Schritt 2: Session nach Browser-Neustart
1. Eingeloggt auf `/dashboard`
2. Schließe den Browser komplett
3. Öffne Browser neu und navigiere zu http://localhost:5173/dashboard
4. **Erwartung**: 
   - Du bleibst eingeloggt (Session-Cookie hat 7 Tage Gültigkeit)
   - Falls Datenbank gelöscht wurde: Redirect zu `/login`

---

## Test 5: Logout 🚪

### Schritt 1: Logout im Dashboard
1. Eingeloggt auf `/dashboard`
2. Klicke "Abmelden"-Button (oben rechts)
3. **Erwartung**:
   - Console zeigt: "✅ Logout erfolgreich"
   - Weiterleitung zu `/login`

### Schritt 2: Kein Zugriff nach Logout
1. Nach Logout: Versuche `/dashboard` zu besuchen
2. **Erwartung**: Redirect zu `/login`

---

## Test 6: DevTools Inspektion 🔍

### Cookies prüfen
1. Einloggen auf `/dashboard`
2. DevTools öffnen (F12)
3. Tab "Application" → "Cookies" → `http://localhost:5173`
4. **Erwartung**: Cookie mit Namen wie `session_<uuid>`
5. Eigenschaften:
   - HttpOnly: Ja (oder nicht sichtbar im JS)
   - SameSite: Lax
   - Expires: In ~7 Tagen

### Network-Tab prüfen
1. DevTools → Network-Tab
2. Logge dich ein
3. **Erwartung**:
   - `POST /api/auth/login` → Status 200
   - Response enthält `user` object
   - Set-Cookie Header vorhanden

### Console-Logs prüfen
1. DevTools → Console-Tab
2. Logge dich ein
3. **Erwartung**: Logs wie:
   - "✅ Login erfolgreich: testuser1"
   - "✅ Session gültig: testuser1"

---

## Test 7: Backend-API (Postman/curl)

### Register via Postman
```http
POST http://localhost:8000/api/auth/register
Content-Type: application/json

{
  "username": "postman_user",
  "password": "postman123"
}
```

**Erwartung**: 
- Status 201 Created
- Response: `{ "user": { "id": X, "username": "postman_user", "role": "user", ... } }`

### Login via Postman
```http
POST http://localhost:8000/api/auth/login
Content-Type: application/json

{
  "username": "postman_user",
  "password": "postman123"
}
```

**Erwartung**:
- Status 200 OK
- Response: `{ "user": {...}, "message": "Login erfolgreich" }`
- Set-Cookie Header vorhanden

### Session Check via Postman
```http
GET http://localhost:8000/api/auth/session
Cookie: <session_cookie_from_login>
```

**Erwartung**:
- Status 200 OK
- Response: `{ "authenticated": true, "user": {...} }`

### Logout via Postman
```http
POST http://localhost:8000/api/auth/logout
Cookie: <session_cookie>
```

**Erwartung**:
- Status 200 OK
- Response: `{ "message": "Logout erfolgreich" }`

---

## 📋 Test-Checkliste

✅ **Alle Tests erfolgreich abgeschlossen!**

### Registrierung
- [x] Gültiger User kann registriert werden
- [x] Success-Message + Auto-Redirect funktioniert
- [x] Validierung: Zu kurzer Username/Passwort wird abgelehnt
- [x] Validierung: Passwörter müssen übereinstimmen
- [x] Doppelte Registrierung wird verhindert

### Login
- [x] Erfolgreicher Login mit korrekten Credentials
- [x] Weiterleitung zu `/dashboard` nach Login
- [x] Username wird im Dashboard angezeigt
- [x] Falsches Passwort zeigt Fehlermeldung
- [x] Nicht existierender User zeigt Fehlermeldung

### Router Guards
- [x] Zugriff auf `/dashboard` ohne Login → Redirect zu `/login`
- [x] Zugriff auf `/login` wenn eingeloggt → Redirect zu `/dashboard`
- [x] Home-Route (`/`) redirected korrekt je nach Auth-Status

### Session-Persistenz
- [x] Session bleibt nach Seiten-Reload erhalten
- [x] Session bleibt nach Browser-Neustart erhalten (Cookie-Lebensdauer)

### Logout
- [x] Logout-Button funktioniert ✨ **GEFIXT!**
- [x] Weiterleitung zu `/login` nach Logout ✨ **GEFIXT!**
- [x] Kein Zugriff auf geschützte Routen nach Logout

### DevTools
- [x] Session-Cookie ist gesetzt nach Login
- [x] Console-Logs zeigen korrekte Auth-Messages
- [x] Network-Tab zeigt erfolgreiche API-Calls

### Backend-API (optional mit Postman)
- [x] `POST /api/auth/register` funktioniert
- [x] `POST /api/auth/login` funktioniert und setzt Cookie
- [x] `GET /api/auth/session` funktioniert mit Cookie
- [x] `POST /api/auth/logout` funktioniert

---

## 🐛 Troubleshooting

### Problem: "Backend nicht erreichbar"
- **Lösung**: Prüfe, ob Deno-Server läuft (`start-dev.ps1`)
- Prüfe Port 8000 in einem anderen Terminal: `curl http://localhost:8000/api/hello`

### Problem: "CORS-Fehler"
- **Lösung**: Prüfe server/server.ts → CORS headers müssen gesetzt sein
- Prüfe, ob `credentials: 'include'` in allen fetch()-Calls vorhanden ist

### Problem: Session bleibt nicht erhalten
- **Lösung**: Cookie-Settings prüfen
- In Produktion: `sameSite: 'strict'` erfordert HTTPS
- Für Entwicklung: `sameSite: 'lax'` verwenden

### Problem: Router Guards funktionieren nicht
- **Lösung**: Prüfe `router/index.ts` → `authStore.checkSession()` wird aufgerufen
- Prüfe `stores/auth.ts` → `isInitialized` wird korrekt gesetzt

### Problem: Logout funktioniert, aber keine Weiterleitung ✨ **GEFIXT**
- **Problem**: `authStore.logout()` setzte nur den State zurück, ohne zu redirecten
- **Lösung**: In `DashboardView.vue` eine `handleLogout()` Funktion erstellt:
  ```ts
  async function handleLogout() {
    await authStore.logout()
    router.push('/login')
  }
  ```
- **Datei geändert**: `src/views/DashboardView.vue`

---

## ✅ Phase 2 Testing abgeschlossen!