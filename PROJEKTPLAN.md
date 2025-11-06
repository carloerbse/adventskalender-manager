# Projektplan: Adventskalender-Manager

**Studentin**: Carla Erb  
**Kurs**: ON24-3  
**Deadline**: 21.11.2025, 21:00  
**Status**: Planung

---

## 1. Projektziele & Anforderungen

### Kernfunktionalität
- Benutzer können sich anmelden und mehrere Adventskalender verwalten
- Jeder Kalender hat 24 Säckchen (1-24) mit:
  - Inhaltsbeschreibung
  - Notizen
  - Gepackt-Status (ja/nein)
- "Mischen"-Feature: Server verteilt Inhalte zufällig neu
- Fortschrittsanzeige (z.B. "17/24 gepackt")
- Export-Funktion (JSON/CSV)
- Admin-Bereich für Benutzerverwaltung

### Technische Anforderungen (laut Specs)
✅ Trennung Client/Server mit REST-API  
✅ Asynchrone Kommunikation  
✅ Session Management  
✅ Multi-User mit Authentifizierung  
✅ Datenisolation (Benutzer sehen nur eigene Daten)  
✅ Mindestens ein CRUD-Zyklus  
✅ Vue.js mit SFC und Composition API  
✅ Mehrere Vue-Komponenten  
✅ Reactivity sinnvoll eingesetzt  
✅ Server-seitige Validierung  
✅ Zentrale Datenhaltung (SQLite bevorzugt)  

---

## 2. Projektphasen & Zeitplan

### Phase 1: Grundgerüst & Datenbank (3-4 Tage)
**Ziel**: Funktionierende Datenbank mit Grundstruktur

**Backend:**
- [ ] SQLite-Datenbank in Deno einbinden
- [ ] Datenbank-Schema erstellen:
  - `users` (id, username, password_hash, role, created_at)
  - `calendars` (id, user_id, name, description, created_at)
  - `pouches` (id, calendar_id, number, content, notes, is_packed, created_at)
- [ ] Datenbank-Initialisierung beim Server-Start
- [ ] Basis-CRUD-Funktionen für Datenbank schreiben

**Frontend:**
- [ ] Projekt aufräumen (Standard-Content entfernen)
- [ ] Grundlegendes Layout erstellen (Header, Navigation, Footer)
- [ ] Routing einrichten (Vue Router installieren)

**Deliverables:**
- Funktionierende Datenbank
- Server kann Daten lesen/schreiben
- Basis-Frontend-Struktur

---

### Phase 2: Authentifizierung & Session Management (3-4 Tage)
**Ziel**: Benutzer können sich anmelden und ihre Session wird verwaltet

**Backend:**
- [ ] Session-Management implementieren (in-memory oder DB-basiert)
- [ ] Password-Hashing (bcrypt oder ähnlich für Deno)
- [ ] API-Endpoints:
  - `POST /api/auth/register` (für erste Benutzer/Admin)
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
  - `GET /api/auth/session` (aktuelle Session prüfen)
- [ ] Middleware für geschützte Routes
- [ ] CORS konfigurieren für `localhost:5173`

**Frontend:**
- [ ] Login-Komponente (`LoginForm.vue`)
- [ ] Register-Komponente (`RegisterForm.vue`) - optional
- [ ] Auth-State Management (Pinia oder Composition API)
- [ ] Navigation Guard für geschützte Routen
- [ ] Logout-Funktionalität

**Testing:**
- [ ] Mit Postman: Login, Session-Check, Logout testen
- [ ] Im Browser: Login-Flow durchspielen

**Deliverables:**
- Funktionierende Authentifizierung
- Session bleibt über Seiten-Refreshs erhalten
- Geschützte Bereiche sind nur nach Login zugänglich

---

### Phase 3: Kalender-CRUD (4-5 Tage)
**Ziel**: Benutzer können Kalender erstellen, bearbeiten, löschen und anzeigen

**Backend:**
- [ ] API-Endpoints für Kalender:
  - `GET /api/calendars` (Liste eigener Kalender)
  - `POST /api/calendars` (Neuen Kalender erstellen)
  - `GET /api/calendars/:id` (Einzelnen Kalender abrufen)
  - `PUT /api/calendars/:id` (Kalender bearbeiten)
  - `DELETE /api/calendars/:id` (Kalender löschen)
- [ ] Validierung: User darf nur eigene Kalender sehen/ändern
- [ ] Beim Erstellen: Automatisch 24 leere Säckchen anlegen

**Frontend:**
- [ ] Dashboard-Komponente (`CalendarDashboard.vue`)
  - Liste aller Kalender
  - Fortschrittsanzeige pro Kalender
  - Buttons: Neu, Bearbeiten, Löschen
- [ ] Kalender-Formular (`CalendarForm.vue`)
  - Name, Beschreibung
  - Speichern/Abbrechen
- [ ] Kalender-Karte (`CalendarCard.vue`)
  - Anzeige eines Kalenders in der Liste
  - Progress-Bar
- [ ] Routing:
  - `/dashboard` - Übersicht
  - `/calendar/new` - Neuer Kalender
  - `/calendar/:id` - Kalender-Detail
  - `/calendar/:id/edit` - Kalender bearbeiten

**Testing:**
- [ ] Postman: CRUD-Operationen testen
- [ ] Browser: Kalender erstellen, bearbeiten, löschen
- [ ] Prüfen: Benutzer A sieht keine Kalender von Benutzer B

**Deliverables:**
- Vollständiger CRUD-Zyklus für Kalender
- Saubere UI mit Reactivity
- Benutzer-Isolation funktioniert

---

### Phase 4: Säckchen-Verwaltung (4-5 Tage)
**Ziel**: 24 Säckchen pro Kalender verwalten

**Backend:**
- [ ] API-Endpoints für Säckchen:
  - `GET /api/calendars/:id/pouches` (Alle 24 Säckchen)
  - `PUT /api/pouches/:id` (Säckchen bearbeiten)
  - `PATCH /api/pouches/:id/toggle` (Gepackt-Status umschalten)
- [ ] Fortschritts-Berechnung im Backend
- [ ] Validierung: Nur Säckchen des eigenen Kalenders änderbar

**Frontend:**
- [ ] Säckchen-Liste (`PouchList.vue`)
  - Grid/Liste mit allen 24 Säckchen
  - Nummer, Inhalt, Notiz, Status anzeigen
- [ ] Säckchen-Item (`PouchItem.vue`)
  - Inline-Editing oder Modal
  - Checkbox für "gepackt"
  - Input für Inhalt und Notizen
- [ ] Fortschrittsanzeige (`ProgressBar.vue`)
  - Visualisierung: "17/24 gepackt"
- [ ] Reaktive Updates beim Ändern

**Testing:**
- [ ] Postman: Säckchen abrufen und ändern
- [ ] Browser: Alle 24 Säckchen bearbeiten
- [ ] Reaktivität: Änderungen sofort sichtbar

**Deliverables:**
- Vollständige Säckchen-Verwaltung
- Fortschritts-Tracking funktioniert
- Intuitive Benutzeroberfläche

---

### Phase 5: "Mischen"-Feature (2-3 Tage)
**Ziel**: Server kann Inhalte zufällig auf die 24 Säckchen verteilen

**Backend:**
- [ ] API-Endpoint:
  - `POST /api/calendars/:id/shuffle`
- [ ] Logik:
  1. Alle Inhalte der 24 Säckchen laden
  2. Inhalte in Array sammeln
  3. Array zufällig mischen (Fisher-Yates-Algorithmus)
  4. Neue Zuordnung in Datenbank speichern
  5. Aktualisierte Säckchen zurückgeben
- [ ] Validierung: Nur eigene Kalender mischbar

**Frontend:**
- [ ] "Mischen"-Button in Kalender-Detail-Ansicht
- [ ] Bestätigungsdialog ("Wirklich mischen?")
- [ ] Loading-State während API-Call
- [ ] Automatische Aktualisierung der Säckchen-Anzeige

**Testing:**
- [ ] Postman: Shuffle-Endpoint testen
- [ ] Browser: Mischen und Ergebnis prüfen
- [ ] Mehrfach mischen: Jedes Mal neues Ergebnis

**Deliverables:**
- Funktionierendes Shuffle-Feature
- Saubere UX mit Feedback

---

### Phase 6: Export-Funktion (2 Tage)
**Ziel**: Kalender als JSON oder CSV exportieren

**Backend:**
- [ ] API-Endpoints:
  - `GET /api/calendars/:id/export?format=json`
  - `GET /api/calendars/:id/export?format=csv`
- [ ] JSON-Export: Vollständiges Kalender-Objekt mit allen Säckchen
- [ ] CSV-Export: Tabelle (Nummer, Inhalt, Notiz, Gepackt)
- [ ] Passende HTTP-Headers für Download

**Frontend:**
- [ ] Export-Button(s) in Kalender-Detail
- [ ] Format-Auswahl (JSON/CSV)
- [ ] Download-Trigger via `fetch()` mit Blob

**Testing:**
- [ ] Beide Formate exportieren
- [ ] Dateien öffnen und Inhalt prüfen

**Deliverables:**
- Export-Funktionalität für JSON und CSV

---

### Phase 7: Admin-Bereich (2-3 Tage)
**Ziel**: Admin kann Benutzer verwalten

**Backend:**
- [ ] API-Endpoints (nur für Admin):
  - `GET /api/admin/users` (Alle Benutzer)
  - `POST /api/admin/users` (Benutzer anlegen)
  - `DELETE /api/admin/users/:id` (Benutzer löschen)
  - `PATCH /api/admin/users/:id/role` (Rolle ändern)
- [ ] Middleware: Admin-Rechte prüfen
- [ ] Validierung: Nicht sich selbst löschen können

**Frontend:**
- [ ] Admin-Dashboard (`AdminDashboard.vue`)
- [ ] Benutzer-Liste mit Aktionen
- [ ] Benutzer-Formular
- [ ] Navigation nur für Admin sichtbar

**Testing:**
- [ ] Als Admin: Benutzer erstellen/löschen
- [ ] Als normaler User: Admin-Bereich nicht erreichbar

**Deliverables:**
- Funktionierende Benutzerverwaltung
- Rollenbasierte Zugriffsrechte

---

### Phase 8: UI-Verbesserungen & Polishing (2-3 Tage)
**Ziel**: Anwendung benutzerfreundlich und ansprechend gestalten

**Frontend:**
- [ ] Responsive Design (Mobile-freundlich)
- [ ] Einheitliches Styling (Farben, Abstände, Schriften)
- [ ] Error-Handling:
  - Toast-Benachrichtigungen oder Alerts
  - Validierungsfehler anzeigen
  - Netzwerkfehler abfangen
- [ ] Loading-States überall
- [ ] Leere Zustände ("Noch keine Kalender vorhanden")
- [ ] Accessibility-Grundlagen (Labels, Kontraste)
- [ ] Deutsche Beschriftungen überall
- [ ] Favicon und Titel anpassen

**Backend:**
- [ ] Einheitliche Error-Responses
- [ ] Logging verbessern
- [ ] Performance-Checks

**Testing:**
- [ ] Kompletten User-Flow durchspielen
- [ ] In verschiedenen Browsern testen
- [ ] Fehlerszenarien testen

**Deliverables:**
- Polierte, benutzerfreundliche Anwendung

---

### Phase 9: Testing & Bug-Fixing (2-3 Tage)
**Ziel**: Alle Funktionen gründlich testen

**Testszenarien:**
- [ ] **User Story 1**: Registrierung, Login, Kalender erstellen
- [ ] **User Story 2**: Kalender mit allen 24 Säckchen füllen
- [ ] **User Story 3**: Fortschritt verfolgen, Säckchen abhaken
- [ ] **User Story 4**: Mischen-Feature nutzen
- [ ] **User Story 5**: Kalender exportieren
- [ ] **User Story 6**: Mehrere Kalender parallel verwalten
- [ ] **User Story 7**: Logout, Login, Session behält Daten
- [ ] **User Story 8**: Admin verwaltet Benutzer

**Security-Tests:**
- [ ] User A kann keine Daten von User B sehen/ändern
- [ ] Ohne Login kein Zugriff auf geschützte Bereiche
- [ ] SQL-Injection-Schutz prüfen
- [ ] XSS-Schutz prüfen (Vue macht das meist automatisch)

**Cross-Browser:**
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (falls verfügbar)

**Deliverables:**
- Bug-Liste erstellt und abgearbeitet
- Stabile, getestete Anwendung

---

### Phase 10: Dokumentation (3-4 Tage)
**Ziel**: Alle geforderten Dokumente erstellen

**Installationsanleitung (A):**
- [ ] Schritt-für-Schritt Setup-Guide
- [ ] Voraussetzungen (Deno, Node.js Versionen)
- [ ] Datenbank-Initialisierung
- [ ] Frontend starten
- [ ] Backend starten
- [ ] Ersten Admin-Account anlegen
- [ ] Optional: Deno Deploy Setup

**Benutzerdokumentation (B):**
- [ ] Screenshots aller Hauptfunktionen
- [ ] Benutzerszenarien mit Bildern
- [ ] Tipps und Tricks

**Technische Dokumentation:**
- [ ] Technologieauswahl-Begründung
- [ ] Architektur-Übersicht (Diagramm)
- [ ] Datenbankschema (ER-Diagramm)
- [ ] API-Dokumentation (alle Endpoints)
- [ ] Liste selbst erstellter Dateien
- [ ] Liste externer Abhängigkeiten
- [ ] Client-Server-Interaktion beschreiben

**Reflexionsdokumentation:**
- [ ] Ausgangssituation (Skills vor dem Projekt)
- [ ] Vorgehen und Planung
- [ ] Anforderungsliste mit Umsetzungsstatus
- [ ] Herausforderungen und Lösungen
- [ ] Unterstützung und Ressourcen
- [ ] KI-Nutzung dokumentieren (ChatGPT, Claude, Grok, Copilot)
- [ ] Lernerfolge und Fazit
- [ ] Screenshots des fertigen Systems

**Deliverables:**
- Vollständige Dokumentation gemäß Vorgaben
- PDF-Dokument mit Inhaltsverzeichnis

---

### Phase 11: Deployment & Finalisierung (1-2 Tage)
**Ziel**: Projekt abgabebereit machen

**Deployment:**
- [ ] (Optional) Auf Deno Deploy hochladen
- [ ] HTTP Basic Auth einrichten (`t4exam` / `SuperKurs`)
- [ ] URL in Dokumentation eintragen
- [ ] Deployment testen

**Abgabevorbereitung:**
- [ ] Git-Repository aufräumen
- [ ] Sinnvolle Commit-Messages
- [ ] README.md aktualisieren
- [ ] `.gitignore` prüfen
- [ ] Alle Dateien committen
- [ ] Repository als ZIP exportieren
- [ ] Dokumentation als PDF exportieren

**Finale Checkliste:**
- [ ] Alle Anforderungen erfüllt?
- [ ] Dokumentation vollständig?
- [ ] Anwendung läuft lokal?
- [ ] (Optional) Deployment funktioniert?
- [ ] KI-Nutzung dokumentiert?
- [ ] Installationsanleitung von Kommilitonen getestet?

**Deliverables:**
- Abgabefertiges Projekt
- ZIP-Datei mit Repository
- PDF-Dokumentation

---

## 3. Technologie-Stack Details

### Backend (Deno)
```typescript
// Wichtige Imports
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { DB } from "https://deno.land/x/sqlite@v3.8/mod.ts";
import { hash, compare } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
```

### Frontend (Vue 3)
```bash
# Zusätzliche Packages installieren
npm install vue-router@4
npm install pinia  # State Management (optional, aber empfohlen)
```

### Datenbankschema (SQLite)
```sql
-- users Tabelle
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- calendars Tabelle
CREATE TABLE calendars (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- pouches Tabelle
CREATE TABLE pouches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  calendar_id INTEGER NOT NULL,
  number INTEGER NOT NULL,
  content TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  is_packed INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (calendar_id) REFERENCES calendars(id) ON DELETE CASCADE,
  CHECK (number BETWEEN 1 AND 24)
);

-- sessions Tabelle (optional)
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 4. Dateistruktur (Geplant)

```
adventskalender-manager/
├── .github/
│   └── copilot-instructions.md
├── public/
│   └── vite.svg
├── server/
│   ├── server.ts                 # Haupt-Server
│   ├── database.ts               # DB-Verbindung & Queries
│   ├── auth.ts                   # Auth-Middleware
│   ├── routes/
│   │   ├── auth.ts              # Auth-Endpoints
│   │   ├── calendars.ts         # Kalender-Endpoints
│   │   ├── pouches.ts           # Säckchen-Endpoints
│   │   └── admin.ts             # Admin-Endpoints
│   └── adventskalender.db       # SQLite-Datenbank (gitignored)
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── router/
│   │   └── index.ts             # Vue Router Config
│   ├── stores/
│   │   └── auth.ts              # Pinia Auth Store
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppHeader.vue
│   │   │   ├── AppNav.vue
│   │   │   └── AppFooter.vue
│   │   ├── auth/
│   │   │   ├── LoginForm.vue
│   │   │   └── RegisterForm.vue
│   │   ├── calendar/
│   │   │   ├── CalendarCard.vue
│   │   │   ├── CalendarForm.vue
│   │   │   └── CalendarList.vue
│   │   ├── pouch/
│   │   │   ├── PouchItem.vue
│   │   │   └── PouchList.vue
│   │   ├── admin/
│   │   │   └── UserManagement.vue
│   │   └── common/
│   │       ├── ProgressBar.vue
│   │       ├── LoadingSpinner.vue
│   │       └── ConfirmDialog.vue
│   ├── views/
│   │   ├── LoginView.vue
│   │   ├── DashboardView.vue
│   │   ├── CalendarDetailView.vue
│   │   ├── CalendarEditView.vue
│   │   └── AdminView.vue
│   ├── composables/
│   │   ├── useApi.ts            # API-Calls
│   │   └── useAuth.ts           # Auth-Helpers
│   ├── types/
│   │   └── index.ts             # TypeScript Interfaces
│   └── style.css
├── docs/
│   └── Dokumentation.md         # Haupt-Dokumentation
├── package.json
├── vite.config.ts
├── tsconfig.json
├── README.md
├── PROJEKTPLAN.md               # Diese Datei
└── .gitignore
```

---

## 5. API-Übersicht (Geplant)

### Authentication
- `POST /api/auth/register` - Neuen Account erstellen
- `POST /api/auth/login` - Anmelden
- `POST /api/auth/logout` - Abmelden
- `GET /api/auth/session` - Aktuelle Session prüfen

### Calendars
- `GET /api/calendars` - Alle eigenen Kalender
- `POST /api/calendars` - Neuen Kalender erstellen
- `GET /api/calendars/:id` - Kalender-Details
- `PUT /api/calendars/:id` - Kalender aktualisieren
- `DELETE /api/calendars/:id` - Kalender löschen

### Pouches
- `GET /api/calendars/:id/pouches` - Alle 24 Säckchen eines Kalenders
- `PUT /api/pouches/:id` - Säckchen aktualisieren
- `PATCH /api/pouches/:id/toggle` - Gepackt-Status umschalten

### Special Features
- `POST /api/calendars/:id/shuffle` - Inhalte mischen
- `GET /api/calendars/:id/export?format=json|csv` - Export

### Admin
- `GET /api/admin/users` - Alle Benutzer (Admin only)
- `POST /api/admin/users` - Benutzer erstellen (Admin only)
- `DELETE /api/admin/users/:id` - Benutzer löschen (Admin only)
- `PATCH /api/admin/users/:id/role` - Rolle ändern (Admin only)

---

## 6. Risiken & Mitigation

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|---------|------------|
| Zeitmangel vor Deadline | Mittel | Hoch | Früh anfangen, Puffer einplanen, Core-Features priorisieren |
| Deno-spezifische Probleme | Mittel | Mittel | Deno-Docs intensiv nutzen, Community fragen |
| CORS-Probleme | Hoch | Mittel | Früh testen, CORS-Config von Anfang an |
| Session-Management komplex | Mittel | Mittel | Einfache Lösung wählen (z.B. Cookies) |
| Datenbank-Migration | Niedrig | Hoch | Schema von Anfang an gut planen |
| Browser-Kompatibilität | Niedrig | Niedrig | Moderne Browser, Vue macht viel automatisch |

---

## 7. Erfolgskriterien

### Must-Have (Pflicht für Abgabe)
✅ Benutzer können sich anmelden  
✅ Kalender erstellen, bearbeiten, löschen (CRUD)  
✅ 24 Säckchen pro Kalender verwalten  
✅ Fortschritt wird angezeigt  
✅ Benutzer sehen nur eigene Daten  
✅ Asynchrone API-Kommunikation  
✅ Mindestens 3 Vue-Komponenten  
✅ Reactivity sinnvoll eingesetzt  
✅ Server-seitige Validierung  
✅ Vollständige Dokumentation  

### Should-Have (Wichtig für gute Note)
✅ Mischen-Feature funktioniert  
✅ Export-Funktion (JSON/CSV)  
✅ Admin-Bereich für Benutzerverwaltung  
✅ Gutes Error-Handling  
✅ Sauberes UI/UX  
✅ Umfassende technische Doku  

### Nice-to-Have (Bonus)
⭐ Deno Deploy Deployment  
⭐ Responsive Design  
⭐ Erweiterte Filter/Such-Funktionen  
⭐ Kalender-Vorlagen  
⭐ Teilen-Funktion zwischen Benutzern  

---

## 8. Nächste Schritte

1. ✅ Projektplan erstellt
2. ⏭️ **Phase 1 starten**: Datenbank einrichten
3. ⏭️ Git-Repository für regelmäßige Commits nutzen
4. ⏭️ Nach jeder Phase: Testen und dokumentieren

**Geschätzte Gesamtdauer**: 25-35 Tage (bei 2-4h/Tag)  
**Verfügbare Zeit bis Deadline**: 15 Tage  
**Empfehlung**: Sofort mit Phase 1 beginnen!

---

## 9. Ressourcen & Hilfe

### Dokumentation
- Vue.js: https://vuejs.org/
- Deno: https://deno.land/
- SQLite für Deno: https://deno.land/x/sqlite
- Vue Router: https://router.vuejs.org/
- Pinia: https://pinia.vuejs.org/

### KI-Tools (dokumentieren!)
- ChatGPT: https://chat.openai.com/
- Claude: https://claude.ai/
- Grok: https://grok.com/
- GitHub Copilot (VS Code Extension)

### Testing
- Postman: https://www.postman.com/
- Browser DevTools (F12)

---

**Viel Erfolg! 🎄**
