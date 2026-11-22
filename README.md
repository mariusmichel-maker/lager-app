# Lager-App (iPad im Lager)

Schlanke Offline-Web-App für das iPad mini 2 (iOS 12.5.7) im Lager von NeoPrint3D. Mit einem
Bluetooth-Barcodescanner (oder per Hand) werden **Entnahmen**, **Wareneingänge** und **Zählungen**
erfasst und per Mail an den PrintOps-Hub geschickt. Das iPad bekommt nichts zurück: Artikelnamen,
Bestände und „knapp“ stehen nur im Hub (Werkstatt → Material).

Dateien: `index.html` (alles inline, ohne Framework, ohne Netz), `sw.js` (Offline-Cache),
`icon-180.png` (Home-Bildschirm-Symbol), `README.md`.

## Einrichtung

1. GitHub-Repo **`lager-app`** (öffentlich) anlegen, die vier Dateien hochladen.
2. Repo → Settings → Pages → „Deploy from a branch“, Branch `main`, Ordner `/ (root)`.
   Adresse danach: `https://<konto>.github.io/lager-app/`.
3. Auf dem iPad in **Safari** öffnen → Teilen → **„Zum Home-Bildschirm“**. Ab dann **nur noch über das
   Symbol „Lager“ starten** (Safari-Tab und Home-Bildschirm-App haben getrennte Speicher).
4. Zahnrad ⚙ → **Empfänger** (Hub-Postfach) und **Gerätename** (Standard „Lager-iPad“) eintragen →
   Speichern. Dafür den Scanner kurz ausschalten, sonst fehlt die Bildschirmtastatur.
5. **Testmail senden** (siehe unten) und prüfen, ob sie im Hub-Postfach ankommt.

Updates: Dateien im Repo ersetzen und in `sw.js` **und** `index.html` die `VERSION` erhöhen. Die App
lädt die neue Fassung im Hintergrund und zeigt sie beim nächsten Start.

## Bedienung

- Modus oben wählen: **Entnahme** (Standard, rot) · **Wareneingang** (grün) · **Zählung** (blau).
- Code scannen oder eintippen + Enter/OK. Gleicher Code im selben Modus → Menge +1, die Zeile blinkt.
  Ungültig → „Scan unvollständig – nochmal“ (rot).
- −/+/✕ je Zeile. Zählung erlaubt Menge 0. Höchstens 80 Zeilen, dann „bitte erst senden“.
- **Senden** → „Mail öffnen“ → in Mail auf Senden tippen → zurück über „◀ Lager“ → **„Mail
  gesendet?“**: **Ja** = ins Archiv, Liste leer, Nummer +1. **Nein** = Liste bleibt mit derselben
  Sendungs-ID; beim nächsten Senden ersetzt der Hub die frühere Fassung. Die Frage kommt auch nach
  einem Neustart der App wieder, solange sie nicht beantwortet ist.
- **Archiv**: letzte 20 Sendungen, „Erneut senden“ schickt sie unverändert (gleiche ID, gleiche
  Fassungszeit). Der Hub bucht nichts doppelt.

## Scanner

- Bluetooth im **Tastatur-Modus (HID)**, **Suffix Enter** (CR).
- **Tastaturlayout** von Scanner und iPad-Hardwaretastatur gleich einstellen (beide Deutsch oder beide
  US), sonst werden `/ : -` und Y/Z in Links vertauscht. Prüfen mit einem eigenen Code (`F0007`),
  einer EAN und einem Karton-QR, dessen Klartext man vom iPhone kennt.
- Bis der Scanner da ist: Codes von Hand ins Feld tippen.

## Codes (Bau-Vertrag Abschnitt 1)

Eingabe wird getrimmt und groß geschrieben. Gültig sind: eigene Codes `F/H/P/V` + genau 4 Ziffern;
reine Ziffern mit Länge 8/12/13/14 und korrekter GTIN-Prüfziffer; sonst druckbares ASCII ohne
Leerzeichen und `;` mit 4–24 Zeichen. Längere Inhalte (z. B. ein Link im QR) werden zum
**Kurzcode** `Q` + 10 Zeichen (2 × FNV-1a, Basis 30); der Klartext wird beim Scannen angezeigt.

**Prüfwert Kurzcode:** `HTTPS://EXAMPLE.COM/A` → **`QRHJ7X8NSKR`**
(Kurzcode-Funktion direkt auf diesen Text angewandt; in der App unter ⚙ angezeigt. Gescannt wäre
dieser 21-Zeichen-Text selbst ein normaler Code, erst ab 25 Zeichen wird gekürzt.)

## Mail-Format (Version 1)

Betreff `#lager <nummer>`, reiner Text, Umbrüche CRLF:

```
PRINTOPS-LAGER 1
L;S;<geraet>;<installation>;<nummer>;<sendung_id>;<fassung_zeit>
L;<zeit>;<modus E|W|Z>;<code>;<menge>
...
L;ENDE;<anzahl_datenzeilen>;<mengensumme>
```

Zeiten sekundengenau mit Zeitzone (`2026-11-22T14:05:31+01:00`). Jede Zeile behält die Zeit ihres
ersten Scans; die Fassungszeit wird bei jedem Senden neu gesetzt (beim „Erneut senden“ aus dem
Archiv nicht). Installations-ID und Sendungs-ID: 6 Zeichen aus `0123456789ABCDEFGHJKMNPQRSTVWX`.

**Testmail** (⚙): Betreff `#lager test`, eine Zeile Text, **keine `L;`-Zeilen**. Der Hub erkennt sie
am Betreff als Lager-Mail, findet weder Kopf- noch Fußzeile und bucht nichts (unvollständig). Sie
prüft nur, ob Konto, Versand und Absender-Freigabe funktionieren; eine abgelehnte Mail erscheint im
Hub im Kasten „Sendungen“.

## Speicher (`localStorage`, Schlüssel `lager.v1.*`)

`installation`, `nummer`, `erfassung` (Zeilen + Sendungs-ID), `ausstehend` (Marke „Mail geöffnet,
Antwort fehlt“), `archiv` (20), `einstellungen`. Ist der Speicher nicht verfügbar, zeigt die App
oben einen roten Hinweis.

## Proben vor dem Einsatz (Konzept Kapitel 6)

- [ ] **P1** Mail-Konto auf iOS 12 einrichten und senden (Testmail kommt im Hub-Postfach an, Absender freigeschaltet)
- [ ] **P2** `mailto:` aus der Home-Bildschirm-App: Mail fertig ausgefüllt, nach der Rückkehr ist die Liste noch da, auch mit 80 Zeilen (sonst Safari-Tab-Betrieb bzw. Zeilengrenze senken)
- [ ] **P3** Scan-Feld; zusätzlich Scan ohne Fokus (die App puffert Tasten am Dokument und meldet „ohne Fokus erfasst“)
- [ ] **P4** QR-Inhalt der Kartons: je 2 Kartons derselben und einer anderen Sorte mit dem iPhone scannen, Klartext notieren (gleich je Sorte? Seriennummer je Spule → EAN oder eigene Etiketten)

## Gerätetests (Konzept Kapitel 7)

- [ ] **T1** Scan von `F0007` und einer EAN: exakt so in der Zeile, kaputter Scan wird abgewiesen
- [ ] **T2** Senden → Mail → „◀ Lager“ → „Ja“: Liste leer, Sendung im Archiv
- [ ] **T2b** Senden, App vor der Antwort beenden, neu öffnen: Frage „Mail gesendet?“ kommt erneut
- [ ] **T3** Flugmodus, App neu starten: startet, offene Erfassung noch da
- [ ] **T4** iPad neu starten: Erfassung, Archiv, Einstellungen noch da
- [ ] **T5** Sendung im Hub: binnen 5 min gebucht, Bestand stimmt
- [ ] **T6** dieselbe Sendung erneut senden (Archiv): nichts doppelt
- [ ] **T7** „Nein“ antworten, weiterscannen, erneut senden: Hub ersetzt die Fassung, nichts doppelt
- [ ] **T8** Nr. 2 auslassen (senden, „Ja“, Mail aber löschen), Nr. 3 senden: Hub meldet „Sendung 2 fehlt“
