# Phase 4: Säckchen-Verwaltung - Testing

## 🚀 Vorbereitung

### Schritt 0: Server starten
```powershell
# Im Projektordner:
.\stop-dev.ps1   # Alte Server stoppen
.\start-dev.ps1  # Neu starten
```

**Prüfen:**
- ✅ Ein neues PowerShell-Fenster mit "BACKEND SERVER" öffnet sich
- ✅ Ein neues PowerShell-Fenster mit "FRONTEND SERVER" öffnet sich
- ✅ Backend zeigt: "✅ Datenbank initialisiert" und "🚀 Deno-Server läuft"
- ✅ Frontend zeigt: "VITE ... ready in ... ms"

---

## 🌐 Frontend Tests (im Browser)

### Test 1: Setup & Login ⭐ START HIER
**Was wir testen:** Grundlegende Funktionalität und Anmeldung

**Schritte:**
1. Öffne deinen Browser (Chrome/Edge empfohlen)
2. Gehe zu: `http://localhost:5173`
3. **Falls du noch keinen Account hast:**
   - Klicke auf "Registrieren" (oder ähnlichen Link)
   - Username: `testuser` (oder dein Wunschname)
   - Passwort: `test1234` (oder dein Wunschpasswort)
   - Klicke "Registrieren"
4. **Falls du schon einen Account hast:**
   - Gib Username und Passwort ein
   - Klicke "Login"

**Erwartetes Ergebnis:**
- ✅ Du landest auf dem Dashboard
- ✅ Oben steht "Willkommen [Username]!" oder ähnlich
- ✅ Du siehst deine Kalender (falls vorhanden) oder "Noch keine Kalender"
- ✅ Es gibt einen "Neuer Kalender" oder "+" Button

**Falls Fehler:** Prüfe ob Backend läuft (PowerShell-Fenster "BACKEND SERVER" offen?)

---

### Test 2: Kalender erstellen
**Was wir testen:** Ein neuer Kalender wird mit 24 leeren Säckchen erstellt

**Schritte:**
1. Du bist eingeloggt im Dashboard
2. Klicke auf "Neuer Kalender" oder den "+" Button
3. Fülle das Formular aus:
   - **Name:** "Test Adventskalender 2025"
   - **Beschreibung:** "Testkalender für Säckchen-Feature"
4. Klicke "Erstellen" oder "Speichern"

**Erwartetes Ergebnis:**
- ✅ Du wirst zum Dashboard zurückgeleitet
- ✅ Dein neuer Kalender erscheint in der Liste
- ✅ Die Kalender-Karte zeigt "0/24 gepackt"
- ✅ Der Progress-Balken ist leer (0%)

**Falls Fehler:** 
- Fehlermeldung beachten
- Prüfe Network Tab (F12) für API-Fehler

---

### Test 3: Kalender öffnen & 24 Säckchen sehen ⭐ WICHTIG
**Was wir testen:** Die 24 Säckchen werden korrekt angezeigt

**Schritte:**
1. Im Dashboard: Klicke auf deinen Test-Kalender
   - **Klicke direkt auf die Karte** (gesamte Fläche ist klickbar)
   - ODER klicke auf das 📖 Icon

**Erwartetes Ergebnis:**
- ✅ Du siehst die Kalender-Detail-Seite
- ✅ **Progress Bar** wird angezeigt:
  - Zeigt "Fortschritt"
  - Zeigt "0 / 24"
  - Zeigt "0%"
  - Nachricht: "🎯 Beginne mit dem ersten Säckchen!"
- ✅ **24 Säckchen** werden in einem Grid angezeigt
- ✅ Jedes Säckchen hat:
  - Nummer-Badge (1-24) in der rechten oberen Ecke
  - Text "Inhalt:" und "Noch kein Inhalt" (grau/kursiv)
  - Button "Nicht gepackt" (grau)
  - Button "✏️ Bearbeiten" (orange)

**Optische Prüfung:**
- Grid hat mehrere Spalten (Desktop: 3-4, Tablet: 2-3)
- Säckchen sind schön angeordnet
- Alles ist lesbar

**Falls Fehler "Not Found" oder leere Seite:**
- Öffne Browser DevTools (F12)
- Gehe zu Console Tab
- Screenshot vom Fehler machen
- Gehe zu Network Tab
- Suche nach Request zu `/api/calendars/.../pouches`
- Prüfe Status Code (sollte 200 sein, nicht 404)

---

### Test 4: Erstes Säckchen bearbeiten
**Was wir testen:** Inline-Editing funktioniert

**Schritte:**
1. Bei **Säckchen 1**: Klicke auf "✏️ Bearbeiten"

**Erwartetes Ergebnis:**
- ✅ Das Säckchen wechselt in den Edit-Modus
- ✅ Border wird orange
- ✅ Du siehst:
  - Textarea "Inhalt:" (leer) mit Zeichenzähler "0/200"
  - Textarea "Notizen:" (leer) mit Zeichenzähler "0/500"
  - Checkbox "Als gepackt markieren" (nicht angehakt)
  - Button "💾 Speichern" (grün)
  - Button "❌ Abbrechen" (rot)

**Schritte fortsetzen:**
2. Tippe in "Inhalt": `Schokolade`
3. Tippe in "Notizen": `Lindt Weihnachtsschokolade, bei Aldi gekauft`
4. Checkbox **NICHT** anhaken (lassen wir für später)
5. Klicke "💾 Speichern"

**Erwartetes Ergebnis:**
- ✅ Edit-Modus schließt sich
- ✅ Säckchen zeigt jetzt:
  - "Inhalt: Schokolade"
  - "Notizen: Lindt Weihnachtsschokolade, bei Aldi gekauft"
  - Button "Nicht gepackt" (immer noch grau)
- ✅ Progress Bar: immer noch 0/24 (weil nicht gepackt)

---

### Test 5: Säckchen als gepackt markieren
**Was wir testen:** Toggle-Funktion und Progress-Update

**Schritte:**
1. Bei **Säckchen 1** (das wir gerade bearbeitet haben): Klicke auf den Button "Nicht gepackt"

**Erwartetes Ergebnis - ACHTE GENAU DARAUF:**
- ✅ Button ändert sich zu "Gepackt" (grün mit ✓)
- ✅ Border des Säckchens wird grün
- ✅ Hintergrund wird leicht grünlich
- ✅ Nummer-Badge wird grün
- ✅ **Progress Bar aktualisiert sich:**
  - Zeigt "1 / 24"
  - Zeigt "4%"
  - Balken hat Farbe (pink-rot)
  - Nachricht: "📦 Los geht's!"

**Schritte fortsetzen:**
2. Klicke nochmal auf "Gepackt"

**Erwartetes Ergebnis:**
- ✅ Status wechselt zurück zu "Nicht gepackt"
- ✅ Grüne Farben verschwinden
- ✅ Progress Bar: zurück auf 0/24 (0%)
- ✅ Nachricht: "🎯 Beginne mit dem ersten Säckchen!"

**Das ist REAKTIVITÄT - ohne Seite neu zu laden!**

---

### Test 6: Mehrere Säckchen parallel bearbeiten
**Was wir testen:** Alle Säckchen funktionieren unabhängig

**Schritte:**
1. Bearbeite **Säckchen 2**:
   - Inhalt: `Kekse`
   - Notizen: `Spekulatius`
   - Als gepackt markieren: ✅ ANHAKEN
   - Speichern

2. Bearbeite **Säckchen 3**:
   - Inhalt: `Tee`
   - Notizen: (leer lassen)
   - Als gepackt markieren: ✅ ANHAKEN
   - Speichern

3. Bearbeite **Säckchen 4**:
   - Inhalt: `Kerze`
   - Notizen: `Duftkerze Zimt`
   - Als gepackt markieren: ⬜ NICHT ANHAKEN
   - Speichern

4. Markiere **Säckchen 1** wieder als gepackt (Klick auf "Nicht gepackt")

**Erwartetes Ergebnis nach jedem Schritt:**
- Nach Säckchen 2: Progress 1/24 (4%)
- Nach Säckchen 3: Progress 2/24 (8%)
- Nach Säckchen 4: Progress 2/24 (8%) - bleibt gleich!
- Nach Säckchen 1: Progress 3/24 (12,5% ≈ 12%)

**Finale Prüfung:**
- ✅ Säckchen 1: "Schokolade" - GRÜN (gepackt)
- ✅ Säckchen 2: "Kekse" - GRÜN (gepackt)
- ✅ Säckchen 3: "Tee" - GRÜN (gepackt)
- ✅ Säckchen 4: "Kerze" - GRAU (nicht gepackt)
- ✅ Progress Bar: 3/24 (12%)
- ✅ Nachricht: "📦 Los geht's!" oder "🚀 Weiter so!"

---

### Test 7: Zeichenzähler testen
**Was wir testen:** Validierung funktioniert

**Schritte:**
1. Bearbeite **Säckchen 5**
2. In "Inhalt": Tippe einen langen Text (z.B. mehrfach kopieren):
   ```
   Dies ist ein sehr langer Text um die Validierung zu testen Dies ist ein sehr langer Text um die Validierung zu testen Dies ist ein sehr langer Text um die Validierung zu testen Dies ist ein sehr langer Text
   ```
3. Versuche mehr als 200 Zeichen einzugeben

**Erwartetes Ergebnis:**
- ✅ Zeichenzähler zeigt z.B. "156/200" während du tippst
- ✅ Bei 200 Zeichen: Zähler zeigt "200/200"
- ✅ Weitere Eingabe wird **blockiert** (kannst nicht mehr tippen)

**Schritte fortsetzen:**
4. In "Notizen": Teste das Gleiche
5. Versuche mehr als 500 Zeichen

**Erwartetes Ergebnis:**
- ✅ Zeichenzähler funktioniert
- ✅ Bei 500 Zeichen wird weitere Eingabe blockiert

6. Klicke "Abbrechen" (wir wollen das nicht speichern)

---

### Test 8: Progress-Nachrichten testen
**Was wir testen:** Motivierende Nachrichten ändern sich

**Schritte:**
1. Markiere **6 Säckchen** (beliebige) als gepackt

**Erwartetes Ergebnis:**
- ✅ Progress: 6/24 (25%)
- ✅ Nachricht: "🚀 Weiter so!"
- ✅ Progress-Balken-Farbe: Orange-Rot

**Schritte fortsetzen:**
2. Markiere **6 weitere** → insgesamt 12 gepackt

**Erwartetes Ergebnis:**
- ✅ Progress: 12/24 (50%)
- ✅ Nachricht: "👍 Guter Fortschritt!"
- ✅ Progress-Balken-Farbe: Blau-Cyan

**Schritte fortsetzen:**
3. Markiere **6 weitere** → insgesamt 18 gepackt

**Erwartetes Ergebnis:**
- ✅ Progress: 18/24 (75%)
- ✅ Nachricht: "💪 Fast geschafft!"
- ✅ Progress-Balken-Farbe: Grün-Türkis

**Schritte fortsetzen:**
4. Markiere die **letzten 6** → alle 24 gepackt

**Erwartetes Ergebnis:**
- ✅ Progress: 24/24 (100%)
- ✅ Nachricht: "🎉 Alle Säckchen gepackt!"
- ✅ Progress-Balken-Farbe: Dunkelgrün

---

### Test 9: Persistenz testen
**Was wir testen:** Daten bleiben nach Seitennavigation erhalten

**Schritte:**
1. Du hast gerade alle 24 Säckchen als gepackt markiert
2. Klicke auf "Zurück" oder navigiere zum Dashboard
3. Schaue auf die Kalender-Karte

**Erwartetes Ergebnis:**
- ✅ Kalender-Karte zeigt "24/24 gepackt"
- ✅ Progress-Balken ist voll (grün)

**Schritte fortsetzen:**
4. Klicke nochmal auf den Kalender (öffnen)

**Erwartetes Ergebnis:**
- ✅ Alle 24 Säckchen sind immer noch grün (gepackt)
- ✅ Alle Inhalte sind noch da
- ✅ Progress Bar: 24/24 (100%)

**WICHTIG: Daten sind persistent in der Datenbank!**

---

### Test 10: Responsive Design testen
**Was wir testen:** Mobile Ansicht funktioniert

**Schritte:**
1. Öffne Browser DevTools (F12)
2. Klicke auf das "Toggle Device Toolbar" Icon (oder Ctrl+Shift+M)
3. Wähle "iPhone SE" oder setze Breite auf 375px

**Erwartetes Ergebnis:**
- ✅ Säckchen-Grid zeigt nur **1 Spalte**
- ✅ Säckchen nehmen volle Breite ein
- ✅ Alle Buttons sind groß genug zum Tippen
- ✅ Kein horizontales Scrollen
- ✅ Text bleibt lesbar

**Schritte fortsetzen:**
4. Setze Breite auf 768px (Tablet)

**Erwartetes Ergebnis:**
- ✅ Säckchen-Grid zeigt **2 Spalten**
- ✅ Alles gut lesbar

5. **WICHTIG:** Toggle Device Toolbar WIEDER AUSSCHALTEN (Ctrl+Shift+M)
6. DevTools schließen (F12)
7. Hard Refresh: Ctrl+Shift+R

**Erwartetes Ergebnis:**
- ✅ Säckchen-Grid zeigt **3-4 Spalten**
- ✅ Desktop-Ansicht ist wieder normal

**⚠️ Problem: Desktop zeigt Mobile-Ansicht?**
→ Siehe `FIX_RESPONSIVE.md` für Lösungen

**Quick-Fix:**
1. DevTools komplett schließen
2. `Ctrl + Shift + R` (Hard Refresh)
3. `Ctrl + 0` (Zoom Reset)

---

### Test 11: Abbrechen-Button testen
**Was wir testen:** Änderungen werden verworfen

**Schritte:**
1. Bearbeite ein Säckchen das bereits Inhalt hat
2. Ändere den Inhalt komplett
3. Klicke "❌ Abbrechen" statt Speichern

**Erwartetes Ergebnis:**
- ✅ Edit-Modus schließt sich
- ✅ **Alte Daten** sind noch da (Änderung wurde NICHT gespeichert)
- ✅ Keine API-Anfrage (prüfe Network Tab wenn du willst)

---

## 🔧 Backend API Tests (Optional - für Fortgeschrittene)

**Diese Tests sind OPTIONAL!** Die Frontend-Tests decken alles ab.

**⚠️ Wichtig:** Du benötigst einen **Session-Cookie** aus dem Browser!

**Anleitung:** Siehe `POSTMAN_GUIDE.md` für detaillierte Schritt-für-Schritt Anleitung!

### Quick-Start:

1. **Im Browser einloggen** → DevTools (F12) → Application Tab → Cookies
2. **Session-Cookie kopieren** (der Wert von `session_id`)
3. **Postman:** Headers Tab → `Cookie: session_id=DEIN_COOKIE`

### Test 1: Alle Säckchen eines Kalenders abrufen
**Request:**
```
GET http://localhost:8000/api/calendars/1/pouches
```

**Headers:**
- `Cookie: session_id=<dein-session-cookie-hier>`

**Erwartete Response (200 OK):**
```json
{
  "pouches": [
    {
      "id": 1,
      "calendar_id": 1,
      "number": 1,
      "content": "",
      "notes": "",
      "is_packed": false,
      "created_at": "2025-11-07T..."
    },
    // ... 23 weitere Säckchen (2-24)
  ]
}
```

**Test-Szenarien:**
- ✅ User sieht eigene Säckchen
- ✅ Kalender hat genau 24 Säckchen (sortiert 1-24)
- ❌ Kalender existiert nicht → 404
- ❌ Kalender gehört anderem User → 404
- ❌ Nicht eingeloggt → 401

---

## ✅ Checkliste: Habe ich alles getestet?

Gehe diese Liste durch und hake ab, was funktioniert:

### Grundfunktionen
- [X] Kalender erstellen
- [ ] Kalender öffnen → 24 Säckchen werden angezeigt
- [X] Säckchen bearbeiten (Inhalt + Notizen)
- [x] Säckchen speichern
- [X] Säckchen als gepackt markieren (Toggle)
- [ ] Progress Bar zeigt richtigen Fortschritt

### Reaktivität
- [x] Progress Bar aktualisiert sofort nach Toggle
- [x] Kein Page Reload nötig
- [x] Mehrere Säckchen parallel bearbeitbar
- [x] Änderungen bleiben nach Navigation erhalten

### Validierung
- [x] Zeichenzähler funktioniert (200/500)
- [x] Eingabe wird bei Limit gestoppt
- [x] Abbrechen verwirft Änderungen

### UI/UX
- [x] Progress-Nachrichten ändern sich passend
- [x] Progress-Balken-Farbe ändert sich
- [x] Gepackte Säckchen sind grün
- [x] Edit-Modus hat orange Border
- [X] Buttons reagieren auf Hover

### Responsive Design
- [x] Mobile (375px): 1 Spalte
- [ ] Tablet (768px): 2 Spalten
- [ ] Desktop (>1024px): 3-4 Spalten
- [x] Kein horizontales Scrollen

### Persistenz
- [ ] Daten bleiben nach Reload erhalten
- [ ] Dashboard zeigt korrekten Fortschritt
- [ ] Kalender erneut öffnen → Daten noch da

---

## 🐛 Häufige Probleme & Lösungen

### Problem: "Not Found" oder "Fehler beim Laden"
**Lösung:**
```powershell
.\stop-dev.ps1
.\start-dev.ps1
```
Dann Browser mit `Ctrl+Shift+R` neu laden

### Problem: Änderungen werden nicht gespeichert
**Prüfen:**
- DevTools (F12) → Network Tab
- Gibt es einen roten Request?
- Status Code 401? → Neu einloggen
- Status Code 403? → Falscher User

### Problem: Säckchen werden nicht angezeigt
**Prüfen:**
1. Browser Console (F12): Fehler?
2. Backend Terminal: Läuft es noch?
3. Request zu `/api/calendars/X/pouches` → Status 200?

### Problem: Progress Bar zeigt falschen Wert
**Lösung:**
- Seite mit `Ctrl+Shift+R` neu laden
- Oder: Zurück zum Dashboard und wieder öffnen

---

## 📊 Testergebnis eintragen

Nachdem du alle Tests durchgeführt hast:

**Phase 4 Tests:**
- Frontend-Tests: ___/11 bestanden
- Responsive Design: ___/3 bestanden
- Checkliste: ___/20 abgehakt

**Bewertung:**
- 18-20: ✅ Perfekt! Phase 4 voll funktionsfähig
- 15-17: ✅ Sehr gut! Kleine Bugs möglich
- 12-14: ⚠️ Funktioniert, aber Verbesserungsbedarf
- <12: ❌ Probleme - Dokumentation lesen

---

## 🔧 Optionale Backend API Tests (für Fortgeschrittene)

**Diese Tests sind OPTIONAL!** Die Frontend-Tests oben decken alles ab.

### Test 2: Säckchen aktualisieren (mit Postman/curl)
**Request:**
```
PUT http://localhost:8000/api/pouches/1
Content-Type: application/json
Cookie: session_id=<your-session-cookie>
```

**Body:**
```json
{
  "content": "Schokolade",
  "notes": "Bei Aldi gekauft, 1,99€",
  "is_packed": false
}
```

**Erwartete Response (200 OK):**
```json
{
  "pouch": {
    "id": 1,
    "calendar_id": 1,
    "number": 1,
    "content": "Schokolade",
    "notes": "Bei Aldi gekauft, 1,99€",
    "is_packed": false,
    "created_at": "2025-11-07T..."
  }
}
```

---

### Test 3: Gepackt-Status umschalten (mit Postman/curl)
**Request:**
```
PATCH http://localhost:8000/api/pouches/1/toggle
Cookie: session_id=<your-session-cookie>
```

**Body:** (leer)

**Erwartete Response (200 OK):**
```json
{
  "pouch": {
    "id": 1,
    "calendar_id": 1,
    "number": 1,
    "content": "Schokolade",
    "notes": "Bei Aldi gekauft, 1,99€",
    "is_packed": true,  // ← umgeschaltet
    "created_at": "2025-11-07T..."
  }
}
```

**Hinweis:** Diese API-Tests sind komplett optional und werden durch die Frontend-Tests abgedeckt.

---

## 🎓 Was habe ich gelernt?

Nach dem Testing kannst du hier eintragen, was funktioniert hat und was nicht:

### Was hat gut funktioniert?
(z.B. "Progress Bar sieht super aus!", "Inline-Editing ist intuitiv")

```
- 
- 
- 
```

### Was könnte verbessert werden?
(z.B. "Zeichenzähler könnte größer sein", "Loading-Spinner fehlt")

```
-
-
-
```

### Bugs gefunden?
(z.B. "Bei sehr schnellem Klicken flackert die UI")

```
-
-
-
```

---

## 📝 Nächste Schritte

Wenn alle Tests bestanden sind:
- ✅ Phase 4 ist abgeschlossen!
- ✅ Bereit für Phase 5: "Mischen"-Feature
- ✅ Dokumentation: `PHASE_4_ZUSAMMENFASSUNG.md` lesen

Wenn es Probleme gibt:
- 📖 Lies `TROUBLESHOOTING.md`
- 🔍 Prüfe Browser Console (F12)
- 🔧 Server neu starten
- ❓ Frage GitHub Copilot

---

**Viel Erfolg beim Testen! 🎉**

### Archiv: Alte ausführliche Test-Dokumentation

_(Die alte ausführliche Test-Dokumentation wurde in die neuen Schritt-für-Schritt Tests oben integriert)_
