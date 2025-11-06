# 🎄 Adventskalender-Manager

Ein Webanwendungsprojekt zur Verwaltung handgemachter Adventskalender.

**Studentin**: Carla Erb | **Kurs**: ON24-3 | **Deadline**: 21.11.2025

## 📋 Projektübersicht

Diese Anwendung hilft beim Planen und Verwalten von handgemachten Adventskalendern mit 24 Säckchen. Entwickelt für den Etsy-Shop meiner Mutter.

### Hauptfunktionen
- 🔐 Benutzer-Authentifizierung & Session-Management
- 📅 Kalender erstellen, bearbeiten, löschen (CRUD)
- 🎁 24 Säckchen pro Kalender mit Inhalt, Notizen und Status
- 🔀 "Mischen"-Feature: Zufällige Neuverteilung der Inhalte
- 📊 Fortschritts-Tracking (z.B. "17/24 gepackt")
- 📥 Export als JSON oder CSV
- 👑 Admin-Bereich für Benutzerverwaltung

## 🛠️ Tech Stack

- **Frontend**: Vue 3 + TypeScript + Vite
- **Backend**: Deno + SQLite
- **State Management**: Pinia
- **Routing**: Vue Router 4

## 🚀 Installation & Start

### Voraussetzungen
- Node.js (v18+)
- Deno (v1.x)

### Backend starten
```powershell
deno run --allow-net --allow-read --allow-write server/server.ts
```

### Frontend starten (separates Terminal)
```powershell
npm install
npm run dev
```

## 📁 Projektstruktur

```
adventskalender-manager/
├── server/              # Deno Backend
│   ├── server.ts       # Haupt-Server
│   └── database.ts     # SQLite Datenbank-Setup
├── src/                # Vue Frontend
│   ├── router/         # Vue Router
│   ├── types/          # TypeScript Interfaces
│   └── components/     # Vue Komponenten (folgt)
└── docs/               # Dokumentation (folgt)
```

## ✅ Projektfortschritt

### Phase 1: Grundgerüst & Datenbank ✅
- [x] SQLite-Datenbank in Deno eingebunden
- [x] Datenbank-Schema erstellt (users, calendars, pouches, sessions)
- [x] CORS konfiguriert
- [x] Frontend aufgeräumt
- [x] Vue Router & Pinia installiert
- [x] TypeScript-Typen definiert

### Phase 2: Authentifizierung (In Arbeit)
- [ ] Session-Management
- [ ] Login/Register-Komponenten
- [ ] Auth-Middleware

### Weitere Phasen
Siehe `PROJEKTPLAN.md` für Details.

## 🔧 Entwicklung

### Datenbank
Die SQLite-Datenbank wird automatisch beim ersten Server-Start erstellt:
- `server/adventskalender.db` (wird nicht ins Git committed)

### API-Endpoints (geplant)
- `/api/auth/*` - Authentifizierung
- `/api/calendars` - Kalender-CRUD
- `/api/calendars/:id/pouches` - Säckchen-Verwaltung
- `/api/calendars/:id/shuffle` - Mischen-Feature
- `/api/calendars/:id/export` - Export
- `/api/admin/*` - Admin-Funktionen

## 📚 Ressourcen

- [Vue.js Docs](https://vuejs.org/)
- [Deno Docs](https://deno.land/)
- [SQLite Deno](https://deno.land/x/sqlite)
- [Projektplan](./PROJEKTPLAN.md)

## 🤖 KI-Nutzung

Für dieses Projekt werden folgende KI-Tools verwendet:
- GitHub Copilot (VS Code Extension)
- ChatGPT (https://chat.openai.com/)
- Claude (https://claude.ai/)
- Grok (https://grok.com/)

---

**Status**: Phase 1 abgeschlossen ✅
