# Phase 9: Testing & Bug-Fixing - Testdokumentation
## Test-Übersicht

### Testumgebung
- **Backend**: Deno Server auf Port 8000
- **Frontend**: Vite Dev Server auf Port 5173
- **Browser**: VS Code Simple Browser
- **Datenbank**: SQLite (adventskalender.db)

### Test-Status
- ✅ Server gestartet
- ✅ Frontend gestartet
- ✅ Anwendung erreichbar unter http://localhost:5173
- ⏳ User Stories werden getestet

---

## User Story Tests

### ✅ Test 1: Registrierung, Login, Kalender erstellen

**Testziel**: Neuer Benutzer kann sich registrieren, anmelden und ersten Kalender erstellen.

**Testschritte**:
1. ⏳ Zur Registrierungsseite navigieren
2. ⏳ Neuen Testbenutzer anlegen (testuser1 / Test1234!)
3. ⏳ Login mit neuen Credentials
4. ⏳ Dashboard sollte angezeigt werden
5. ⏳ "Neuer Kalender" Button klicken
6. ⏳ Kalender erstellen mit Name und Beschreibung
7. ⏳ Validieren: 24 leere Säckchen werden automatisch angelegt

**Erwartetes Ergebnis**:
- Registrierung erfolgreich
- Login erfolgreich, Session-Cookie gesetzt
- Dashboard zeigt Kalender-Liste
- Neuer Kalender wird in Liste angezeigt
- Kalender hat 24 Säckchen (Nummern 1-24)
- Fortschritt zeigt 0/24 gepackt

**Tatsächliches Ergebnis**: ⏳ Wird getestet

**Status**: ⏳ PENDING

---

### ⏳ Test 2: Kalender mit allen 24 Säckchen füllen

**Testziel**: Alle 24 Säckchen können mit Inhalten gefüllt werden.

**Testschritte**:
1. Kalender aus Test 1 öffnen
2. Jedes Säckchen (1-24) mit Inhalt füllen:
   - Säckchen 1: "Schokolade"
   - Säckchen 2: "Nüsse"
   - Säckchen 3: "Keks"
   - ... (weitere Beispiele)
3. Bei einigen Säckchen Notizen hinzufügen
4. Speichern-Button bei jedem Säckchen drücken
5. Seite neu laden und prüfen

**Erwartetes Ergebnis**:
- Alle Inhalte werden gespeichert
- Nach Reload sind alle Inhalte noch da
- Fortschritt zeigt immer noch 0/24 (nichts gepackt)

**Tatsächliches Ergebnis**: ⏳ Wird getestet

**Status**: ⏳ PENDING

---

### ⏳ Test 3: Fortschritt verfolgen, Säckchen abhaken

**Testziel**: Gepackt-Status kann geändert werden, Fortschritt wird korrekt angezeigt.

**Testschritte**:
1. Kalender mit gefüllten Säckchen öffnen
2. Säckchen 1-10 als "gepackt" markieren (Button klicken)
3. Fortschrittsanzeige prüfen (sollte 10/24 zeigen)
4. Säckchen 11-20 als "gepackt" markieren
5. Fortschrittsanzeige prüfen (sollte 20/24 zeigen)
6. Einige Säckchen wieder auf "nicht gepackt" setzen
7. Fortschritt sollte sich anpassen

**Erwartetes Ergebnis**:
- Toggle-Button funktioniert
- Button-Text ändert sich ("Nicht gepackt" ↔ "Gepackt")
- Button-Farbe ändert sich (rot ↔ grün)
- Fortschrittsanzeige aktualisiert sich sofort
- Progress-Bar-Füllung passt sich an
- Scroll-Position bleibt erhalten

**Tatsächliches Ergebnis**: ⏳ Wird getestet

**Status**: ⏳ PENDING

---

### ⏳ Test 4: Mischen-Feature nutzen

**Testziel**: Säckchen-Inhalte werden zufällig neu verteilt.

**Testschritte**:
1. Kalender mit gefüllten Säckchen öffnen
2. Aktuelle Zuordnung notieren (z.B. Säckchen 1 hat "Schokolade")
3. "Mischen"-Button klicken
4. Bestätigungsdialog mit "Ja" bestätigen
5. Warten bis Mischen abgeschlossen
6. Neue Zuordnung prüfen
7. Mehrfach wiederholen (mindestens 3x)

**Erwartetes Ergebnis**:
- Bestätigungsdialog erscheint
- Nach Bestätigung: Loading-State wird angezeigt
- Inhalte werden neu verteilt
- Jedes Säckchen hat nach wie vor einen Inhalt
- Alle Inhalte sind noch vorhanden (keine verloren)
- Gepackt-Status bleibt erhalten
- Bei jedem Mischen: Unterschiedliche Verteilung
- Fortschritt bleibt gleich

**Tatsächliches Ergebnis**: ⏳ Wird getestet

**Status**: ⏳ PENDING

---

### ⏳ Test 5: Kalender exportieren

**Testziel**: Export-Funktionen für JSON und CSV funktionieren.

**Testschritte**:
1. Kalender mit gefüllten Säckchen öffnen
2. "JSON exportieren"-Button klicken
3. Datei-Download prüfen
4. JSON-Datei öffnen und Inhalt validieren
5. "CSV exportieren"-Button klicken
6. CSV-Datei öffnen und Inhalt validieren
7. Mit Excel/LibreOffice öffnen

**Erwartetes Ergebnis**:
- JSON-Download startet automatisch
- JSON enthält: Kalender-Info und alle 24 Säckchen
- JSON ist valide und formatiert
- CSV-Download startet automatisch
- CSV enthält Spalten: Nummer, Inhalt, Notiz, Gepackt
- CSV ist mit Excel/LibreOffice öffenbar
- Alle Daten sind korrekt

**Tatsächliches Ergebnis**: ⏳ Wird getestet

**Status**: ⏳ PENDING

---

### ⏳ Test 6: Mehrere Kalender parallel verwalten

**Testziel**: Benutzer kann mehrere Kalender erstellen und verwalten.

**Testschritte**:
1. Dashboard öffnen
2. Zweiten Kalender erstellen ("Adventskalender 2025")
3. Dritten Kalender erstellen ("Test-Kalender")
4. Dashboard-Liste prüfen (alle 3 sichtbar?)
5. Zwischen Kalendern wechseln
6. In Kalender 2 Säckchen füllen
7. Zurück zu Kalender 1, Daten müssen unverändert sein
8. Kalender 3 löschen
9. Dashboard prüfen (nur noch 2 Kalender)

**Erwartetes Ergebnis**:
- Alle Kalender werden in Liste angezeigt
- Jeder Kalender hat eigene 24 Säckchen
- Änderungen in einem Kalender beeinflussen andere nicht
- Löschen funktioniert
- Nach Löschen: Kalender verschwindet aus Liste

**Tatsächliches Ergebnis**: ⏳ Wird getestet

**Status**: ⏳ PENDING

---

### ⏳ Test 7: Session-Persistenz (Logout, Login, Daten bleiben)

**Testziel**: Nach Logout und erneutem Login sind alle Daten noch da.

**Testschritte**:
1. Angemeldet als testuser1 mit mehreren Kalendern
2. Logout-Button klicken
3. Validieren: Redirect zu Login-Seite
4. Validieren: Session-Cookie gelöscht
5. Versuchen Dashboard direkt aufzurufen (sollte zu Login redirecten)
6. Erneut einloggen mit gleichen Credentials
7. Dashboard öffnen
8. Alle Kalender müssen noch da sein
9. Kalender öffnen, alle Säckchen-Inhalte müssen noch da sein

**Erwartetes Ergebnis**:
- Logout funktioniert einwandfrei
- Nach Logout: Kein Zugriff auf geschützte Bereiche
- Nach erneutem Login: Alle Daten unverändert
- Kalender, Säckchen, Fortschritt alles erhalten

**Tatsächliches Ergebnis**: ⏳ Wird getestet

**Status**: ⏳ PENDING

---

### ⏳ Test 8: Admin verwaltet Benutzer

**Testziel**: Admin kann Benutzer anlegen, löschen und Rollen ändern.

**Testschritte**:
1. Als Admin einloggen (admin / admin123)
2. Dashboard: "Admin"-Button sollte sichtbar sein
3. Admin-Bereich öffnen
4. Benutzer-Liste prüfen (testuser1 sollte sichtbar sein)
5. Neuen Benutzer anlegen ("testuser2 / Test1234!")
6. Validieren: Neuer User in Liste
7. Rolle von testuser2 auf "admin" ändern
8. Validieren: Rolle aktualisiert
9. testuser1 löschen
10. Validieren: User verschwindet aus Liste

**Erwartetes Ergebnis**:
- Admin-Button nur für Admin sichtbar
- Admin-Bereich funktioniert
- Benutzer anlegen funktioniert
- Rollen ändern funktioniert
- Löschen funktioniert
- Admin kann sich selbst nicht löschen

**Tatsächliches Ergebnis**: ⏳ Wird getestet

**Status**: ⏳ PENDING

---

## Security Tests

### ⏳ Security-Test 1: User-Isolation

**Testziel**: Benutzer A kann keine Daten von Benutzer B sehen oder ändern.

**Testschritte**:
1. Als testuser2 einloggen
2. Neuen Kalender erstellen mit Inhalt
3. Kalender-ID notieren (z.B. aus URL)
4. Logout
5. Als testuser1 einloggen
6. Versuchen Kalender von testuser2 direkt aufzurufen (URL manipulation)
7. Versuchen über API Kalender von testuser2 abzurufen
8. Dashboard von testuser1 prüfen

**Erwartetes Ergebnis**:
- testuser1 sieht nur eigene Kalender im Dashboard
- Direkter Aufruf von testuser2-Kalender: 403 Forbidden oder 404
- API-Call für fremden Kalender: 403 Forbidden
- Keine Möglichkeit fremde Daten einzusehen

**Tatsächliches Ergebnis**: ⏳ Wird getestet

**Status**: ⏳ PENDING

---

### ⏳ Security-Test 2: Schutz geschützter Bereiche

**Testziel**: Ohne Login kein Zugriff auf geschützte Routes.

**Testschritte**:
1. Logout (kein User eingeloggt)
2. Versuchen Dashboard direkt aufzurufen: http://localhost:5173/dashboard
3. Versuchen Kalender-Detail aufzurufen: http://localhost:5173/calendar/1
4. Versuchen Admin-Bereich aufzurufen: http://localhost:5173/admin
5. Versuchen API-Calls ohne Session-Cookie:
   - GET /api/calendars
   - GET /api/calendars/1/pouches
   - POST /api/calendars/:id/shuffle

**Erwartetes Ergebnis**:
- Alle Frontend-Routes redirecten zu /login
- Alle API-Calls ohne Session: 401 Unauthorized
- Admin-Route redirect zu /login (zusätzlich nur für Admin)

**Tatsächliches Ergebnis**: ⏳ Wird getestet

**Status**: ⏳ PENDING

---

### ⏳ Security-Test 3: Admin-Rechte

**Testziel**: Nur Admin kann Admin-Bereich nutzen.

**Testschritte**:
1. Als normaler User einloggen (testuser1)
2. Versuchen Admin-Bereich aufzurufen: http://localhost:5173/admin
3. Versuchen Admin-API-Calls:
   - GET /api/admin/users
   - POST /api/admin/users
   - DELETE /api/admin/users/2

**Erwartetes Ergebnis**:
- Frontend: Redirect zu /dashboard oder Fehlermeldung
- Admin-Button im Dashboard nicht sichtbar
- API-Calls: 403 Forbidden

**Tatsächliches Ergebnis**: ⏳ Wird getestet

**Status**: ⏳ PENDING

---

## Browser-Kompatibilität Tests

### ⏳ Chrome/Edge

**Status**: ⏳ PENDING

**Zu testen**:
- [ ] Alle Features funktionieren
- [ ] Keine Console-Errors
- [ ] Responsive Design funktioniert

---

### ⏳ Firefox

**Status**: ⏳ PENDING

**Zu testen**:
- [ ] Alle Features funktionieren
- [ ] Keine Console-Errors
- [ ] Responsive Design funktioniert

---

## Bug-Liste

### Gefundene Bugs

#### Bug #1: [Noch keine Bugs gefunden]

**Beschreibung**: -

**Reproduktion**: -

**Schweregrad**: -

**Status**: -

---

## Performance & UX

### Beobachtungen

- ⏳ Lade-Zeiten
- ⏳ Reaktivität der UI
- ⏳ Feedback für User-Aktionen
- ⏳ Error-Handling

---

## Zusammenfassung

**Gesamtstatus**: ⏳ Testing läuft

**Getestete User Stories**: 0/8
**Getestete Security-Tests**: 0/3
**Gefundene Bugs**: 0

