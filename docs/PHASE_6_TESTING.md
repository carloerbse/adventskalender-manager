# Phase 6 Testing: Export-Funktion

**Datum**: 10.11.2025  
**Status**: Testing in Progress

---

## 🧪 Test-Übersicht

Diese Anleitung beschreibt, wie die Export-Funktionalität (JSON und CSV) getestet werden kann.

---

## 1. Backend-Tests mit Postman

### Test 1: JSON-Export

**Endpoint:** `GET http://localhost:8000/api/calendars/:id/export?format=json`

**Voraussetzungen:**
1. Backend läuft auf Port 8000
2. User ist eingeloggt (Session-Cookie vorhanden)
3. Kalender mit ID existiert und gehört dem User

**Request:**
```
Method: GET
URL: http://localhost:8000/api/calendars/1/export?format=json
Headers:
  - Cookie: session=<your-session-id>
```

**Erwartetes Ergebnis:**
- Status: 200 OK
- Content-Type: `application/json`
- Content-Disposition: `attachment; filename="KalenderName_TIMESTAMP.json"`
- Body: JSON mit vollständigen Kalenderdaten:
  ```json
  {
    "calendar": {
      "id": 1,
      "user_id": 1,
      "name": "Weihnachtskalender 2025",
      "description": "Mein erster Adventskalender",
      "created_at": "2025-11-10T...",
      "packed_count": 5,
      "total_pouches": 24
    },
    "pouches": [
      {
        "id": 1,
        "calendar_id": 1,
        "number": 1,
        "content": "Schokolade",
        "notes": "Lindt Weihnachtsschokolade",
        "is_packed": 1,
        "created_at": "2025-11-10T..."
      },
      // ... 23 weitere Säckchen
    ]
  }
  ```

**Test-Schritte:**
1. In Postman: Request senden
2. Status-Code prüfen (sollte 200 sein)
3. Headers prüfen (Content-Type und Content-Disposition)
4. Response-Body in JSON-Viewer anschauen
5. Prüfen ob alle 24 Säckchen vorhanden sind
6. Prüfen ob `packed_count` korrekt ist

### Test 2: CSV-Export

**Endpoint:** `GET http://localhost:8000/api/calendars/:id/export?format=csv`

**Request:**
```
Method: GET
URL: http://localhost:8000/api/calendars/1/export?format=csv
Headers:
  - Cookie: session=<your-session-id>
```

**Erwartetes Ergebnis:**
- Status: 200 OK
- Content-Type: `text/csv; charset=utf-8`
- Content-Disposition: `attachment; filename="KalenderName_TIMESTAMP.csv"`
- Body: CSV mit Kalenderdaten:
  ```csv
  Kalendername;Beschreibung;Erstellt am
  "Weihnachtskalender 2025";"Mein erster Adventskalender";"10.11.2025"
  
  Nummer;Inhalt;Notizen;Gepackt
  1;"Schokolade";"Lindt Weihnachtsschokolade";"Ja"
  2;"Tee";"Earl Grey";"Nein"
  ...
  24;"Überraschung";"";"Nein"
  ```

**Test-Schritte:**
1. In Postman: Request senden
2. Status-Code prüfen (sollte 200 sein)
3. Headers prüfen (Content-Type und Content-Disposition)
4. Response-Body als "Raw" oder "Preview" anschauen
5. Prüfen ob CSV-Header vorhanden sind
6. Prüfen ob alle 24 Zeilen (Säckchen) vorhanden sind
7. Prüfen ob deutsche Formatierung ("Ja"/"Nein") korrekt ist

### Test 3: Fehlerbehandlung - Ungültiges Format

**Request:**
```
Method: GET
URL: http://localhost:8000/api/calendars/1/export?format=xml
```

**Erwartetes Ergebnis:**
- Status: 400 Bad Request
- Body:
  ```json
  {
    "error": "Ungültiges Format. Nutze 'json' oder 'csv'"
  }
  ```

### Test 4: Fehlerbehandlung - Nicht existierender Kalender

**Request:**
```
Method: GET
URL: http://localhost:8000/api/calendars/99999/export?format=json
```

**Erwartetes Ergebnis:**
- Status: 404 Not Found
- Body:
  ```json
  {
    "error": "Kalender nicht gefunden oder Zugriff verweigert"
  }
  ```

### Test 5: User-Isolation

**Szenario:**
1. User A ist eingeloggt
2. User A versucht Kalender von User B zu exportieren

**Erwartetes Ergebnis:**
- Status: 404 Not Found (aus Sicherheitsgründen, nicht 403)
- Body:
  ```json
  {
    "error": "Kalender nicht gefunden oder Zugriff verweigert"
  }
  ```

### Test 6: Ohne Authentifizierung

**Request ohne Session-Cookie:**
```
Method: GET
URL: http://localhost:8000/api/calendars/1/export?format=json
Headers: (kein Cookie)
```

**Erwartetes Ergebnis:**
- Status: 401 Unauthorized
- Body:
  ```json
  {
    "error": "Nicht authentifiziert"
  }
  ```

---

## 2. Frontend-Tests im Browser

### Vorbereitung
1. Frontend starten: `npm run dev`
2. Backend starten: `deno run --allow-net --allow-read --allow-write server/server.ts`
3. Im Browser anmelden
4. Einen Kalender öffnen (z.B. http://localhost:5173/calendar/1)

### Test 1: JSON-Export über UI

**Test-Schritte:**
1. Kalender-Detail-Ansicht öffnen
2. Auf "📥 JSON" Button klicken
3. Button zeigt während Export: "⏳ Exportiere..."
4. Download sollte automatisch starten
5. Datei öffnen mit Text-Editor oder JSON-Viewer
6. Inhalt prüfen:
   - Kalenderdaten vollständig?
   - Alle 24 Säckchen vorhanden?
   - JSON valide? (z.B. mit https://jsonlint.com/)

**Erwarteter Dateiname:**
- Format: `KalenderName_TIMESTAMP.json`
- Beispiel: `Weihnachtskalender_2025_1731254400000.json`

### Test 2: CSV-Export über UI

**Test-Schritte:**
1. Kalender-Detail-Ansicht öffnen
2. Auf "📊 CSV" Button klicken
3. Button zeigt während Export: "⏳ Exportiere..."
4. Download sollte automatisch starten
5. Datei öffnen mit Excel, LibreOffice Calc oder Text-Editor
6. Inhalt prüfen:
   - Kalenderdaten in erster Zeile?
   - Header-Zeile für Säckchen vorhanden?
   - Alle 24 Säckchen als Zeilen?
   - Deutsche Formatierung ("Ja"/"Nein")?
   - Umlaute korrekt dargestellt?
   - Semikolon als Trennzeichen?

**Erwarteter Dateiname:**
- Format: `KalenderName_TIMESTAMP.csv`
- Beispiel: `Weihnachtskalender_2025_1731254400000.csv`

### Test 3: Export mit Sonderzeichen

**Szenario:**
Kalender und Säckchen mit Sonderzeichen erstellen:
- Kalender: `"Mein 'besonderer' Kalender & mehr"`
- Säckchen mit: Umlauten (ä, ö, ü), Anführungszeichen, Semikolons

**Test-Schritte:**
1. Kalender mit Sonderzeichen erstellen
2. Säckchen mit Sonderzeichen füllen
3. JSON exportieren → Prüfen ob alle Zeichen korrekt sind
4. CSV exportieren → Prüfen ob alle Zeichen escaped/korrekt sind

**Erwartetes Ergebnis:**
- JSON: Alle Sonderzeichen korrekt (JSON-escaped)
- CSV: Anführungszeichen werden gedoppelt (`""`)
- Dateiname: Sonderzeichen werden durch `_` ersetzt

### Test 4: Export von leerem Kalender

**Szenario:**
Kalender ohne Inhalte (alle Säckchen leer)

**Test-Schritte:**
1. Neuen Kalender erstellen
2. Keine Säckchen befüllen
3. JSON exportieren
4. CSV exportieren

**Erwartetes Ergebnis:**
- JSON: 24 Säckchen mit leeren `content` und `notes`
- CSV: 24 Zeilen mit leeren Feldern
- Kein Fehler, Export funktioniert

### Test 5: Export nach Mischen

**Szenario:**
Säckchen mischen und dann exportieren

**Test-Schritte:**
1. Kalender mit gefüllten Säckchen öffnen
2. "Mischen" ausführen
3. Sofort exportieren (JSON und CSV)
4. Prüfen ob gemischte Reihenfolge exportiert wird

**Erwartetes Ergebnis:**
- Export enthält die neuen (gemischten) Zuordnungen
- Säckchen-Nummern bleiben 1-24
- Inhalte sind neu verteilt

### Test 6: Mehrfach-Export

**Test-Schritte:**
1. Mehrmals hintereinander JSON exportieren
2. Mehrmals hintereinander CSV exportieren
3. Abwechselnd JSON und CSV exportieren

**Erwartetes Ergebnis:**
- Alle Downloads funktionieren
- Buttons werden nicht blockiert
- Keine Fehler in Console
- Jede Datei hat unterschiedlichen Timestamp im Namen

### Test 7: Export mit vielen Inhalten

**Szenario:**
Säckchen mit sehr langen Texten füllen (z.B. 500 Zeichen)

**Test-Schritte:**
1. Säckchen mit langen Texten füllen
2. Exportieren (JSON und CSV)
3. Datei öffnen und prüfen

**Erwartetes Ergebnis:**
- Alle Inhalte vollständig exportiert
- Keine Abschneidung
- CSV: Lange Texte in Anführungszeichen
- JSON: Valide trotz langer Texte

---

## 3. Browser-Kompatibilität

### Zu testende Browser:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox

### Test-Schritte pro Browser:
1. JSON-Export funktioniert
2. CSV-Export funktioniert
3. Download startet automatisch
4. Dateiname ist korrekt
5. Keine JavaScript-Fehler in Console

---

## 4. Edge Cases & Error Handling

### Test 1: Netzwerkfehler simulieren

**Szenario:**
Backend während Export stoppen

**Test-Schritte:**
1. Export-Button klicken
2. Backend während Request beenden
3. Prüfen: Fehler-Alert erscheint
4. Prüfen: Button wird wieder aktiviert

### Test 2: Session abgelaufen

**Szenario:**
Session läuft ab während User auf Export-Seite ist

**Test-Schritte:**
1. Kalender öffnen
2. Lange warten (Session-Timeout)
3. Export versuchen
4. Prüfen: Fehler-Meldung oder Redirect zu Login

### Test 3: Sehr große Kalender

**Szenario:**
Kalender mit sehr vielen Daten (alle Säckchen voll, lange Texte)

**Test-Schritte:**
1. Alle 24 Säckchen mit langen Inhalten füllen
2. JSON exportieren (sollte ~50-100 KB sein)
3. CSV exportieren
4. Prüfen: Kein Performance-Problem
5. Prüfen: Download funktioniert

---

## 5. Checkliste für erfolgreiche Tests

### Backend (Postman)
- [X] JSON-Export funktioniert (Status 200)
- [X] CSV-Export funktioniert (Status 200)
- [X] Ungültiges Format wird abgelehnt (Status 400)
- [X] Nicht existierender Kalender gibt 404
- [X] User-Isolation funktioniert (User A kann nicht Kalender von User B exportieren)
- [X] Ohne Auth gibt 401
- [ ] Content-Disposition Header ist korrekt
- [ ] Content-Type Header ist korrekt

### Frontend (Browser)
- [X] JSON-Button funktioniert
- [X] CSV-Button funktioniert
- [X] Download startet automatisch
- [X] Dateinamen sind korrekt (nach Bugfix)
- [X] Loading-State wird angezeigt ("⏳ Exportiere...")
- [X] Buttons werden während Export disabled
- [X] Fehler-Alerts erscheinen bei Problemen
- [X] Sonderzeichen werden korrekt exportiert
- [X] Leere Kalender können exportiert werden
- [X] Gemischte Kalender exportieren korrekt
- [X] Mehrfach-Export funktioniert
- [X] Lange Texte werden vollständig exportiert

### Browser-Kompatibilität
- [X] Chrome/Edge: Alle Funktionen OK
- [X] Firefox: Alle Funktionen OK

### Error Handling
- [X] Netzwerkfehler werden abgefangen
- [X] Session-Timeout wird behandelt (401 Error)
- [X] Große Kalender funktionieren

---

## 🐛 Gefundene Bugs & Lösungen

### Bug 1: Dateiname-Problem ✅ BEHOBEN
**Problem:** Exportierte Dateien hatten generischen Namen `kalender_export_TIMESTAMP.json` statt des Kalender-Namens

**Ursache:** Regex-Pattern zum Parsen des Content-Disposition Headers war zu gierig (`.+` matched alles inklusive Quotes)

**Lösung:** Verbessertes Regex-Pattern in `useApi.ts`:
```typescript
// Vorher: /filename="?(.+)"?/i  (zu gierig)
// Nachher: 
let filenameMatch = contentDisposition.match(/filename="([^"]+)"/i);
if (!filenameMatch) {
  filenameMatch = contentDisposition.match(/filename=([^;]+)/i);
}
```

**Status:** ✅ Behoben - Dateinamen enthalten jetzt korrekten Kalender-Namen

### Bug 2: Login nach Server-Neustart ✅ GELÖST
**Problem:** Nach Server-Neustart konnten registrierte User sich nicht mehr anmelden

**Ursache:** User haben ihre alten Passwörter vergessen (User-Error, kein Code-Bug)

**Lösung:** Test-User erstellt mit bekannten Credentials:
- Username: `test`
- Password: `test123`
- Script: `server/create_test_user.ts`

**Verwendung:**
```powershell
cd server
deno run --allow-read --allow-write create_test_user.ts
```

**Hinweis:** bcrypt funktioniert korrekt - jeder Hash hat einen eindeutigen Salt, das ist gewünscht!

### Hilfs-Scripts erstellt:
1. **`list_users.ts`** - Zeigt alle User in DB
2. **`create_test_user.ts`** - Erstellt Test-User (test/test123)
3. **`debug_users.ts`** - Detailliertes Debug-Tool (für Entwickler)
