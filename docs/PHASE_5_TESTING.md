# Phase 5: Testing-Anleitung für Shuffle-Feature

## 🎯 Ziel
Das "Mischen"-Feature testen, das die Inhalte aller 24 Säckchen zufällig neu verteilt.

---

## ✅ Voraussetzungen

1. **Backend läuft**: Deno-Server auf Port 8000
   ```powershell
   deno run --allow-net --allow-read --allow-write server/server.ts
   ```

2. **Frontend läuft**: Vite Dev-Server auf Port 5173
   ```powershell
   npm run dev
   ```

3. **Testdaten vorhanden**:
   - Mindestens ein User existiert (z.B. über Register)
   - Mindestens ein Kalender mit einigen gefüllten Säckchen

---

## 🧪 Test 1: Backend-API mit Postman/Browser

### Schritt 1: Login (Session erstellen)
```
POST http://localhost:8000/api/auth/login
Content-Type: application/json

{
  "username": "test",
  "password": "test123"
}
```

**Erwartetes Ergebnis**: 
- Status 200
- Session-Cookie wird gesetzt
- Response enthält User-Daten

### Schritt 2: Kalender abrufen
```
GET http://localhost:8000/api/calendars
(Cookie wird automatisch mitgesendet)
```

**Erwartetes Ergebnis**:
- Status 200
- Liste der Kalender mit ihren IDs
- Notiere dir eine `calendar_id` für den nächsten Test

### Schritt 3: Säckchen vor dem Mischen abrufen
```
GET http://localhost:8000/api/calendars/{calendar_id}/pouches
```

**Erwartetes Ergebnis**:
- Status 200
- Array mit 24 Säckchen
- Notiere dir die Inhalte von einigen Säckchen (z.B. Nummer 1, 12, 24)

### Schritt 4: SHUFFLE API-Call
```
POST http://localhost:8000/api/calendars/{calendar_id}/shuffle
```

**Erwartetes Ergebnis**:
- Status 200
- Response mit "message": "Säckchen erfolgreich gemischt"
- Response enthält die neu gemischten Säckchen
- Inhalte sollten jetzt an anderen Nummern sein

### Schritt 5: Säckchen nach dem Mischen abrufen
```
GET http://localhost:8000/api/calendars/{calendar_id}/pouches
```

**Erwartetes Ergebnis**:
- Status 200
- Die gleichen Inhalte wie vorher, aber zufällig neu verteilt
- Z.B. Inhalt von Säckchen 1 ist jetzt bei Säckchen 15

### Schritt 6: Mehrfach mischen
Wiederhole Schritt 4 mehrmals.

**Erwartetes Ergebnis**:
- Jedes Mal eine neue Verteilung
- Alle Inhalte bleiben erhalten (kein Datenverlust)
- Unterschiedliche Ergebnisse bei jedem Aufruf

---

## 🖥️ Test 2: Frontend-UI im Browser

### Vorbereitung
1. Öffne http://localhost:5173
2. Melde dich an
3. Öffne einen Kalender oder erstelle einen neuen
4. Fülle einige Säckchen mit unterschiedlichen Inhalten:
   - Säckchen 1: "Schokolade"
   - Säckchen 5: "Überraschungsei"
   - Säckchen 12: "Bonbons"
   - Säckchen 24: "Keks"

### Test: Mischen-Button
1. **Button sichtbar**: Orangener "🎲 Mischen"-Button sollte im Header der Kalender-Detailansicht sichtbar sein
2. **Dialog öffnen**: Klicke auf "🎲 Mischen"
3. **Bestätigungsdialog**: 
   - Modal erscheint mit Warnung
   - "Wirklich mischen?" Nachfrage
   - Zwei Buttons: "Abbrechen" und "Ja, mischen!"
4. **Abbrechen testen**: Klicke auf "Abbrechen" → Dialog schließt sich, keine Änderung
5. **Bestätigen**: Klicke erneut auf "🎲 Mischen", dann "Ja, mischen!"

**Erwartetes Ergebnis**:
- Button zeigt während des Mischens "🔄 Wird gemischt..."
- Button ist disabled während des Vorgangs
- Nach ca. 1 Sekunde: Success-Alert "✅ Die Säckchen wurden erfolgreich gemischt!"
- Säckchen-Liste aktualisiert sich automatisch
- Inhalte sind neu verteilt (z.B. "Schokolade" ist jetzt bei Säckchen 18)

### Reaktivität prüfen
- Die Änderungen sollten **sofort** in der Säckchen-Liste sichtbar sein
- Kein manuelles Neuladen nötig
- Fortschrittsbalken bleibt gleich (gepackte Säckchen bleiben gepackt)

### Edge Cases testen
1. **Mehrfach mischen**: Mische mehrmals hintereinander
   - Sollte jedes Mal funktionieren
   - Unterschiedliche Ergebnisse
2. **Leerer Kalender**: Teste mit Kalender ohne Inhalte
   - Sollte ohne Fehler funktionieren
   - Leere Säckchen bleiben leer, nur Reihenfolge ändert sich
3. **Gepackte Säckchen**: Setze einige Säckchen auf "gepackt"
   - Status sollte nach dem Mischen erhalten bleiben
   - Nur Inhalte werden neu verteilt, nicht der Gepackt-Status

---

## 🔍 Test 3: User-Isolation

1. **User A**: Melde dich als User A an, mische einen Kalender
2. **User B**: Melde dich als User B an
3. **Versuch**: User B versucht, Kalender von User A zu mischen

**Erwartetes Ergebnis**:
- Status 404 oder 403 (Zugriff verweigert)
- Fehlermeldung: "Kalender nicht gefunden oder Zugriff verweigert"

---

## 🐛 Bekannte Probleme / Edge Cases

1. **Sehr schnelles Klicken**: Wenn Button sehr schnell mehrfach geklickt wird
   - Sollte durch `disabled`-State verhindert werden
2. **Netzwerkfehler während Mischen**: 
   - Error-Handling vorhanden
   - Alert mit Fehlermeldung
3. **Browser-Tab wechseln während Mischen**:
   - Sollte trotzdem funktionieren
   - Bei Rückkehr sind Änderungen sichtbar

---

## ✅ Erfolgs-Checkliste

- [X] Backend-Endpoint antwortet korrekt auf POST /api/calendars/:id/shuffle
- [X] Fisher-Yates-Algorithmus verteilt Inhalte gleichmäßig zufällig
- [X] Keine Inhalte gehen verloren beim Mischen
- [X] Gepackt-Status bleibt erhalten
- [X] UI-Button funktioniert und zeigt Loading-State
- [X] Bestätigungsdialog erscheint vor dem Mischen
- [X] Säckchen aktualisieren sich automatisch nach dem Mischen
- [X] Mehrfaches Mischen liefert unterschiedliche Ergebnisse
- [X] User-Isolation funktioniert (User A kann nicht Kalender von User B mischen)
- [X] Error-Handling funktioniert bei Netzwerkfehlern