# Manuelle Test-Checkliste

**Schnelltest** für die Adventskalender-Manager Anwendung  
**Geschätzte Dauer**: 15-20 Minuten

---

## Vorbereitung

1. [ ] Server starten: `cd server; deno run --allow-net --allow-read --allow-write server.ts`
2. [ ] Frontend starten: `npm run dev`
3. [ ] Browser öffnen: http://localhost:5173

---

## Test 1: Registrierung & Login (2 min)

1. [ ] Auf "Neu registrieren" klicken
2. [ ] Testuser anlegen: `testuser1` / `Test1234!`
3. [ ] Validierung: Passwort zu kurz abgelehnt?
4. [ ] Validierung: Username bereits vergeben abgelehnt?
5. [ ] Erfolgreich registriert → automatisch eingeloggt?
6. [ ] Dashboard wird angezeigt?

**Erwartet**: ✅ Registration und Login funktionieren

---

## Test 2: Kalender erstellen (2 min)

1. [ ] "Neuer Kalender" Button klicken
2. [ ] Name eingeben: "Mein Adventskalender 2025"
3. [ ] Beschreibung eingeben: "Test-Kalender"
4. [ ] Speichern
5. [ ] Kalender erscheint in Liste?
6. [ ] Progress zeigt "0/24 gepackt"?
7. [ ] "Öffnen" Button funktioniert?

**Erwartet**: ✅ Kalender wird erstellt und angezeigt

---

## Test 3: Säckchen füllen (3 min)

1. [ ] Kalender öffnen
2. [ ] Säckchen 1 anklicken
3. [ ] Inhalt eingeben: "Schokolade"
4. [ ] Notiz eingeben: "Lindt Excellence"
5. [ ] Speichern (💾)
6. [ ] Säckchen 2-5 mit beliebigen Inhalten füllen
7. [ ] Seite neu laden (F5)
8. [ ] Alle Inhalte noch da?

**Erwartet**: ✅ Säckchen können bearbeitet werden, Inhalte bleiben

---

## Test 4: Fortschritt & Packen (2 min)

1. [ ] Säckchen 1-3 als "gepackt" markieren (grüner Button)
2. [ ] Button-Text ändert sich zu "Gepackt"?
3. [ ] Button wird grün?
4. [ ] Progress-Bar oben zeigt "3/24"?
5. [ ] Säckchen 1 wieder auf "nicht gepackt" setzen
6. [ ] Progress ändert sich zu "2/24"?
7. [ ] Scroll-Position bleibt erhalten?

**Erwartet**: ✅ Toggle funktioniert, Progress aktualisiert sich

---

## Test 5: Mischen-Feature (2 min)

1. [ ] Aktuelle Zuordnung merken (z.B. Säckchen 1 = "Schokolade")
2. [ ] "🎲 Säckchen mischen" Button klicken
3. [ ] Dialog erscheint: "Wirklich mischen?"
4. [ ] "Ja, mischen" klicken
5. [ ] Loading-Spinner erscheint kurz?
6. [ ] Inhalte sind neu verteilt?
7. [ ] Alle Inhalte noch vorhanden? (nur umverteilt)
8. [ ] Nochmal mischen: Ergebnis unterschiedlich?

**Erwartet**: ✅ Inhalte werden zufällig neu verteilt

---

## Test 6: Export (2 min)

1. [ ] "📥 JSON exportieren" Button klicken
2. [ ] Download startet automatisch?
3. [ ] JSON-Datei öffnen
4. [ ] Enthält alle Kalender-Daten und 24 Säckchen?
5. [ ] "📊 CSV exportieren" Button klicken
6. [ ] CSV-Download startet?
7. [ ] CSV mit Excel/LibreOffice öffnen
8. [ ] Tabelle zeigt Nummer, Inhalt, Notiz, Gepackt?

**Erwartet**: ✅ Export funktioniert für JSON und CSV

---

## Test 7: Mehrere Kalender (2 min)

1. [ ] Zurück zum Dashboard
2. [ ] Zweiten Kalender erstellen: "Adventskalender 2026"
3. [ ] Beide Kalender in Liste sichtbar?
4. [ ] Kalender 2 öffnen
5. [ ] Ein paar Säckchen füllen
6. [ ] Zurück zu Kalender 1
7. [ ] Inhalte von Kalender 1 unverändert?
8. [ ] Kalender 2 löschen (Papierkorb-Icon)
9. [ ] Dashboard zeigt nur noch Kalender 1?

**Erwartet**: ✅ Mehrere Kalender können parallel verwaltet werden

---

## Test 8: Session-Persistenz (2 min)

1. [ ] Logout-Button klicken (oben rechts)
2. [ ] Redirect zu Login-Seite?
3. [ ] Versuchen Dashboard direkt aufzurufen: `http://localhost:5173/dashboard`
4. [ ] Wird zu /login redirected?
5. [ ] Erneut einloggen mit `testuser1` / `Test1234!`
6. [ ] Dashboard zeigt alle Kalender noch?
7. [ ] Kalender öffnen
8. [ ] Alle Säckchen-Inhalte noch da?

**Erwartet**: ✅ Daten bleiben nach Logout/Login erhalten

---

## Test 9: Admin-Bereich (2 min)

### Als normaler User
1. [ ] Als testuser1 eingeloggt
2. [ ] Admin-Button im Dashboard sichtbar? → SOLLTE NICHT SICHTBAR SEIN
3. [ ] Direkt aufrufen: `http://localhost:5173/admin` → SOLLTE NICHT FUNKTIONIEREN

### Als Admin
1. [ ] Logout
2. [ ] Login als Admin: `admin` / `admin123`
3. [ ] Dashboard: "👑 Admin" Button sichtbar?
4. [ ] Admin-Bereich öffnen
5. [ ] Benutzer-Liste zeigt testuser1?
6. [ ] Neuen User anlegen: `testuser2` / `Test1234!`
7. [ ] User erscheint in Liste?
8. [ ] Rolle von testuser2 auf "admin" ändern
9. [ ] Validieren: Rolle aktualisiert?
10. [ ] testuser2 löschen
11. [ ] Validieren: User verschwindet aus Liste?

**Erwartet**: ✅ Admin-Bereich funktioniert, normale User haben keinen Zugriff

---

## Test 10: User-Isolation (3 min)

1. [ ] Als admin eingeloggt
2. [ ] Neuen Kalender erstellen: "Admin-Kalender"
3. [ ] Kalender-ID aus URL merken (z.B. `/calendar/12`)
4. [ ] Logout
5. [ ] Login als testuser1
6. [ ] Dashboard: "Admin-Kalender" NICHT sichtbar?
7. [ ] Versuchen direkt aufzurufen: `http://localhost:5173/calendar/12`
8. [ ] Fehlermeldung oder 404?

**Erwartet**: ✅ User können nur eigene Kalender sehen

---

## Zusammenfassung

**Total Tests**: 10  
**Geschätzte Zeit**: 15-20 Minuten

### Ergebnis

- [ ] Alle Tests bestanden? → **Anwendung ist produktionsreif!** ✅
- [ ] Einige Tests fehlgeschlagen? → Bugs notieren und beheben

### Bugs notieren (falls vorhanden)

**Bug 1**: _____________________________________________  
**Reproduktion**: _____________________________________________  
**Schweregrad**: [ ] Kritisch [ ] Mittel [ ] Niedrig

**Bug 2**: _____________________________________________  
**Reproduktion**: _____________________________________________  
**Schweregrad**: [ ] Kritisch [ ] Mittel [ ] Niedrig

---

## Browser-Kompatibilität (Optional)

- [ ] Chrome/Edge: Alle Tests funktionieren?
- [ ] Firefox: Alle Tests funktionieren?
- [ ] Safari: Alle Tests funktionieren?

---

**Viel Erfolg beim Testen!** 🧪✨

Wenn alle Tests durchlaufen, bist du bereit für **Phase 10: Dokumentation**!
