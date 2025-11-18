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

### Phase 1: Grundgerüst & Datenbank ✅ (ABGESCHLOSSEN)
**Ziel**: Funktionierende Datenbank mit Grundstruktur

**Backend:**
- [x] SQLite-Datenbank in Deno einbinden (v3.9.1)
- [x] Datenbank-Schema erstellt:
  - `users` (id, username, password_hash, role, created_at)
  - `calendars` (id, user_id, name, description, created_at)
  - `pouches` (id, calendar_id, number, content, notes, is_packed, created_at)
  - `sessions` (id, user_id, expires_at, created_at)
- [x] Datenbank-Initialisierung beim Server-Start
- [x] Basis-CRUD-Funktionen für Datenbank (createPouchesForCalendar, cleanupExpiredSessions)
- [x] CORS konfiguriert für localhost:5173
- [x] .gitignore aktualisiert (Datenbank wird nicht committed)

**Frontend:**
- [x] Projekt aufgeräumt (HelloWorld.vue entfernt)
- [x] Grundlegendes Layout erstellt (Header, Main, Footer)
- [x] Vue Router 4 installiert und konfiguriert
- [x] Pinia für State Management installiert
- [x] TypeScript-Typen definiert (User, Calendar, Pouch, Session, etc.)
- [x] Backend-Verbindungstest in App.vue implementiert

**Deliverables:**
- ✅ Funktionierende Datenbank (server/adventskalender.db)
- ✅ Server läuft auf Port 8000 mit DB-Verbindung
- ✅ Frontend läuft auf Port 5173
- ✅ Frontend-Backend-Kommunikation funktioniert
- ✅ Basis-Frontend-Struktur mit Router und Pinia

---

### Phase 2: Authentifizierung & Session Management ✅ (ABGESCHLOSSEN)
**Ziel**: Benutzer können sich anmelden und ihre Session wird verwaltet

**Backend:**
- [x] Session-Management implementiert (Cookie-basiert, UUID)
- [x] Password-Hashing mit bcrypt für Deno (v0.4.1)
- [x] API-Endpoints erstellt:
  - `POST /api/auth/register` (Neue User registrieren)
  - `POST /api/auth/login` (Login mit Session-Cookie)
  - `POST /api/auth/logout` (Session löschen)
  - `GET /api/auth/session` (Session-Status prüfen)
- [x] Middleware für geschützte Routes (`requireAuth`, `requireAdmin`)
- [x] CORS mit Credentials-Support konfiguriert

**Frontend:**
- [x] Login-Komponente (`LoginForm.vue`) mit Validierung
- [x] Register-Komponente (`RegisterForm.vue`) mit Passwort-Bestätigung
- [x] Auth-State Management mit Pinia (`stores/auth.ts`)
- [x] Navigation Guards für geschützte Routen im Router
- [x] Logout-Funktionalität im Dashboard
- [x] View-Komponenten: LoginView, RegisterView, DashboardView
- [x] TypeScript-Typen für Router Meta-Felder

**Testing:**
- [x] Mit Postman: Register, Login, Session-Check, Logout testen
- [x] Im Browser: Vollständiger Auth-Flow testen
- [x] Router Guards prüfen (geschützte Routen, Auto-Redirects)

**Deliverables:**
- ✅ Funktionierende Authentifizierung mit bcrypt
- ✅ Session-Management mit HTTP-Only Cookies
- ✅ Router Guards mit automatischen Weiterleitungen
- ✅ UI-Komponenten für Login/Register
- Dokumentation: siehe `PHASE_2_ZUSAMMENFASSUNG.md`

---

### Phase 3: Kalender-CRUD ✅ (ABGESCHLOSSEN)
**Ziel**: Benutzer können Kalender erstellen, bearbeiten, löschen und anzeigen

**Backend:**
- [x] API-Endpoints für Kalender:
  - `GET /api/calendars` (Liste eigener Kalender)
  - `POST /api/calendars` (Neuen Kalender erstellen)
  - `GET /api/calendars/:id` (Einzelnen Kalender abrufen)
  - `PUT /api/calendars/:id` (Kalender bearbeiten)
  - `DELETE /api/calendars/:id` (Kalender löschen)
- [x] Validierung: User darf nur eigene Kalender sehen/ändern
- [x] Beim Erstellen: Automatisch 24 leere Säckchen anlegen
- [x] Datenbank-Funktionen in `database.ts`
- [x] Route-Handler in `routes/calendars.ts`
- [x] Integration in `server.ts` mit Auth-Middleware

**Frontend:**
- [x] Dashboard erweitert (`DashboardView.vue`)
  - CalendarList-Komponente eingebunden
  - Willkommens-Nachricht
- [x] Kalender-Liste (`CalendarList.vue`)
  - Grid-Layout mit CalendarCard-Komponenten
  - "Neu erstellen"-Button
  - Loading-, Error- und Empty-States
- [x] Kalender-Karte (`CalendarCard.vue`)
  - Anzeige mit Name, Beschreibung, Fortschritt
  - Progress-Bar mit Farbverlauf
  - Action-Buttons (Öffnen, Bearbeiten, Löschen)
- [x] Kalender-Formular (`CalendarForm.vue`)
  - Wiederverwendbar für Create & Edit
  - Validierung mit Zeichen-Zähler
  - Speichern/Abbrechen-Buttons
- [x] Kalender-Detail (`CalendarDetailView.vue`)
  - Detailansicht mit Fortschritts-Anzeige
  - Placeholder für Säckchen (Phase 4)
- [x] Kalender-Edit (`CalendarEditView.vue`)
  - Nutzt CalendarForm-Komponente
- [x] Routing:
  - `/dashboard` - Übersicht
  - `/calendar/new` - Neuer Kalender
  - `/calendar/:id` - Kalender-Detail
  - `/calendar/:id/edit` - Kalender bearbeiten
- [x] Pinia Store (`stores/calendar.ts`)
  - Reactive State Management
  - CRUD-Actions
- [x] API-Funktionen (`composables/useApi.ts`)
  - Alle CRUD-Operationen

**Testing:**
- [x] Postman: CRUD-Operationen getestet
- [x] Browser: Kalender erstellen, bearbeiten, löschen
- [x] Geprüft: Benutzer A sieht keine Kalender von Benutzer B
- [x] Fortschrittsanzeige funktioniert (0/24)

**Deliverables:**
- ✅ Vollständiger CRUD-Zyklus für Kalender
- ✅ Saubere UI mit Reactivity und Vue 3 Composition API
- ✅ Benutzer-Isolation funktioniert einwandfrei
- ✅ 10 neue Dateien erstellt, 5 bearbeitet (~1.300 Zeilen Code)
- ✅ Responsive Design (Desktop, Tablet, Mobile)
- Dokumentation: siehe `PHASE_3_ZUSAMMENFASSUNG.md`

---

### Phase 4: Säckchen-Verwaltung
**Ziel**: 24 Säckchen pro Kalender verwalten

**Backend:**
- [x] API-Endpoints für Säckchen:
  - `GET /api/calendars/:id/pouches` (Alle 24 Säckchen)
  - `PUT /api/pouches/:id` (Säckchen bearbeiten)
  - `PATCH /api/pouches/:id/toggle` (Gepackt-Status umschalten)
- [x] Fortschritts-Berechnung im Backend
- [x] Validierung: Nur Säckchen des eigenen Kalenders änderbar

**Frontend:**
- [x] Säckchen-Liste (`PouchList.vue`)
  - Grid/Liste mit allen 24 Säckchen
  - Nummer, Inhalt, Notiz, Status anzeigen
- [x] Säckchen-Item (`PouchItem.vue`)
  - Inline-Editing oder Modal
  - Checkbox für "gepackt"
  - Input für Inhalt und Notizen
- [x] Fortschrittsanzeige (`ProgressBar.vue`)
  - Visualisierung: "17/24 gepackt"
- [x] Reaktive Updates beim Ändern

**Testing:**
- [x] Postman: Säckchen abrufen und ändern
- [x] Browser: Alle 24 Säckchen bearbeiten
- [x] Reaktivität: Änderungen sofort sichtbar

**Deliverables:**
- ✅ Vollständige Säckchen-Verwaltung
- ✅ Fortschritts-Tracking funktioniert
- ✅ Intuitive Benutzeroberfläche

---

### Phase 5: "Mischen"-Feature ✅ (ABGESCHLOSSEN)
**Ziel**: Server kann Inhalte zufällig auf die 24 Säckchen verteilen

**Backend:**
- [x] API-Endpoint:
  - `POST /api/calendars/:id/shuffle`
- [x] Logik:
  1. Alle Inhalte der 24 Säckchen laden
  2. Inhalte in Array sammeln
  3. Array zufällig mischen (Fisher-Yates-Algorithmus)
  4. Neue Zuordnung in Datenbank speichern
  5. Aktualisierte Säckchen zurückgeben
- [x] Validierung: Nur eigene Kalender mischbar
- [x] Datenbank-Funktionen: getPouchesByCalendarId, shufflePouches
- [x] Route-Handler in routes/calendars.ts
- [x] Integration in server.ts

**Frontend:**
- [x] "Mischen"-Button in Kalender-Detail-Ansicht (orangener Button)
- [x] Bestätigungsdialog ("Wirklich mischen?") mit Modal-Overlay
- [x] Loading-State während API-Call ("🔄 Wird gemischt...")
- [x] Automatische Aktualisierung der Säckchen-Anzeige
- [x] shuffleCalendar() in useApi.ts
- [x] shuffleCalendar() im Pinia Store
- [x] Success/Error-Feedback mit Alerts
- [x] CSS-Animationen (fadeIn, slideUp)

**Testing:**
- [x] Postman: Shuffle-Endpoint getestet
- [x] Browser: Mischen und Ergebnis geprüft
- [x] Mehrfach mischen: Jedes Mal neues Ergebnis
- [x] User-Isolation: User A kann nicht Kalender von User B mischen
- [x] Edge Cases: Leere Säckchen, gepackte Säckchen

**Deliverables:**
- ✅ Funktionierendes Shuffle-Feature mit Fisher-Yates-Algorithmus
- ✅ Saubere UX mit Modal-Dialog und Feedback
- ✅ 6 Dateien geändert, 2 neue Dateien (~295 Zeilen Code)
- ✅ Vollständige Testing-Anleitung
- Dokumentation: siehe `PHASE_5_ZUSAMMENFASSUNG.md`

---

### Phase 6: Export-Funktion ✅ (ABGESCHLOSSEN)
**Ziel**: Kalender als JSON oder CSV exportieren

**Backend:**
- [x] API-Endpoints:
  - `GET /api/calendars/:id/export?format=json`
  - `GET /api/calendars/:id/export?format=csv`
- [x] JSON-Export: Vollständiges Kalender-Objekt mit allen Säckchen
- [x] CSV-Export: Tabelle (Nummer, Inhalt, Notiz, Gepackt)
- [x] Passende HTTP-Headers für Download
- [x] Datenbank-Funktionen: getCalendarWithPouches, convertToCSV
- [x] User-Isolation und Validierung

**Frontend:**
- [x] Export-Buttons in Kalender-Detail (📥 JSON, 📊 CSV)
- [x] Automatischer Download-Trigger
- [x] Loading-States ("⏳ Exportiere...")
- [x] Error-Handling mit Alerts
- [x] TypeScript-Typsicherheit

**Testing:**
- [x] Test-Dokumentation erstellt (PHASE_6_TESTING.md)
- [ ] Postman-Tests durchführen
- [ ] Browser-Tests durchführen
- [ ] Browser-Kompatibilität prüfen

**Deliverables:**
- ✅ Export-Funktionalität für JSON und CSV
- ✅ 2 neue Dateien, 5 geänderte Dateien (~237 Zeilen Code)
- ✅ Umfassende Test-Anleitung
- Dokumentation: siehe `PHASE_6_ZUSAMMENFASSUNG.md`

---

### Phase 7: Admin-Bereich ✅ (ABGESCHLOSSEN)
**Ziel**: Admin kann Benutzer verwalten

**Backend:**
- [x] API-Endpoints (nur für Admin):
  - `GET /api/admin/users` (Alle Benutzer)
  - `POST /api/admin/users` (Benutzer anlegen)
  - `DELETE /api/admin/users/:id` (Benutzer löschen)
  - `PATCH /api/admin/users/:id/role` (Rolle ändern)
- [x] Middleware: Admin-Rechte prüfen (requireAdmin bereits vorhanden)
- [x] Validierung: Nicht sich selbst löschen können
- [x] Datenbank-Funktionen: getAllUsers, createUser, deleteUser, updateUserRole
- [x] Route-Handler in routes/admin.ts
- [x] Integration in server.ts mit Auth-Middleware

**Frontend:**
- [x] Admin-Dashboard (`AdminDashboardView.vue`)
- [x] Benutzer-Liste mit Aktionen (UserList.vue)
- [x] Benutzer-Formular (UserForm.vue)
- [x] Navigation nur für Admin sichtbar (👑 Admin-Button im Dashboard)
- [x] Pinia Store (stores/admin.ts)
- [x] Router Guard (requiresAdmin Meta-Property)
- [x] API-Funktionen in useApi.ts

**Testing:**
- [x] Postman: CRUD-Operationen getestet
- [ ] Browser: Alle Features als Admin testen
- [ ] Browser: Zugriff als normaler User testen

**Deliverables:**
- ✅ Funktionierende Benutzerverwaltung
- ✅ Rollenbasierte Zugriffsrechte
- ✅ 7 neue Dateien, 6 geänderte Dateien (~1.764 Zeilen Code)
- ✅ Umfassende Testing-Anleitung
- Dokumentation: siehe `PHASE_7_ZUSAMMENFASSUNG.md`

---

### Phase 8: UI-Verbesserungen & Polishing
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

### Phase 9: Testing & Bug-Fixing
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

### Phase 10: Dokumentation
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

### Phase 11: Deployment & Finalisierung
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
