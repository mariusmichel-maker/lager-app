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
- **Zählung: einen Artikel immer in EINER Sendung fertig zählen.** Der Hub summiert Zählzeilen
  eines Artikels nur innerhalb einer Sendung; eine spätere Sendung mit demselben Artikel ersetzt
  die frühere Zählung (sonst gälte z. B. 2 statt 3 + 2).
- iPad: Einstellungen › Allgemein › Datum & Uhrzeit › **Automatisch** an (der Hub lehnt Sendungen
  mit falscher Uhr ab) und Tastatur › **Intelligente Interpunktion aus** (sonst ändert iOS `--`
  und Anführungszeichen in eingetippten Codes).
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

## Angaben je Code (ab Version 1.1.0)

Damit im Hub nicht nur eine nackte Nummer ankommt, kann man zu jedem Code freiwillig Angaben
hinterlegen. Sie liegen in einer **lokalen Code-Datenbank** auf dem iPad und füllen sich beim
nächsten Scan desselben Codes selbst aus.

- In der Liste zeigt jede Zeile unter dem Code die Angaben („PETG HF · Weiss · Bambu Lab“) bzw.
  **„Angaben ergänzen ✎“**. Zeile antippen (nicht −/+/✕) öffnet das **Angaben-Fenster**:
  - **Kategorie**: Filament / Harz / Pulver / Verbrauch (vorgewählt nach eigenem Code F/H/P/V,
    sonst Filament).
  - **Material**: Knöpfe je Kategorie (Filament PLA … PVA, Harz Standard … Hochtemp, Pulver PA12,
    PA11, TPU, Verbrauch keine) + Freitext „anderes Material“.
  - **Hersteller**, **Farbe**, **Zusatz** (z. B. Matt, HF, CF): Knöpfe + Freitext. Die zuletzt
    selbst benutzten Werte stehen vorne. Ein Knopf füllt das Feld, nochmal tippen leert es.
  - **Speichern** · **Leeren** (leert nur die Felder; danach Speichern = Angaben löschen) ·
    **Abbrechen**. Nach dem Schließen steht der Cursor wieder im Scan-Feld.
  - Gespeichert wird nur, wenn Material, Hersteller, Farbe oder Zusatz ausgefüllt ist.
- Scan eines Codes mit Angaben zeigt sie sofort in der Zeile und in der Statusmeldung.
- **Senden**: Für Codes dieser Erfassung, deren Angaben neu oder geändert sind, hängt die App je
  Code eine A-Zeile an (siehe Mail-Format). „Mail gesendet? – **Ja**“ merkt sich genau diesen Stand
  als übertragen (nur wenn er seit dem Senden nicht geändert wurde); beim nächsten Mal geht er
  nicht mehr mit. Jede Änderung schickt die Angaben erneut. „Nein“ ändert nichts. „Erneut senden“
  aus dem Archiv schickt den gespeicherten Text unverändert.
- Ist der Mail-Link länger als 15.000 Zeichen, erscheint vor „Mail öffnen“ der Hinweis „Sehr lange
  Mail – lieber in zwei Sendungen teilen“ (gesperrt wird nichts). Richtwert: 80 Zeilen mit voll
  ausgefüllten Angaben ≈ 21.000 Zeichen, 80 Zeilen ohne Angaben ≈ 6.000.
- ⚙ → **Gespeicherte Codes (n)**: alle Angaben mit Stand „übertragen“ / „noch nicht übertragen“,
  Löschen je Code (zweimal tippen). Höchstens 500 Codes, die ältesten fallen heraus.
- Im Hub erscheinen die Angaben bei „Unbekannte Codes“ (Zuordnen-Vorschlag, „Neu anlegen“
  vorbefüllt, „Alle mit Angaben anlegen“) und bei den Codes eines Artikels.

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

**Angaben-Zeile** (optional, ab App 1.1.0, Bau-Vertrag 7.1): nach den Datenzeilen, vor `L;ENDE`,
höchstens eine je Code, mindestens ein Feld gefüllt:

```
L;A;<code>;<kat F|H|P|V oder leer>;<material>;<hersteller>;<farbe>;<zusatz>
```

Beispiel: `L;A;F0007;F;PETG;Bambu Lab;Weiss;HF`. Die App wandelt Umlaute um (ä→ae … ß→ss),
entfernt Akzente, sonstige Nicht-ASCII-Zeichen und `;`, trimmt und kappt auf 24/24/24/32 Zeichen.
A-Zeilen zählen **nicht** in der Fußzeile. Der Hub ignoriert eine ungültige A-Zeile mit Warnung;
die Sendung bleibt gültig.

**Testmail** (⚙): Betreff `#lager test`, eine Zeile Text, **keine `L;`-Zeilen**. Der Hub erkennt sie
am Betreff als Lager-Mail, findet weder Kopf- noch Fußzeile und bucht nichts (unvollständig). Sie
prüft nur, ob Konto, Versand und Absender-Freigabe funktionieren; eine abgelehnte Mail erscheint im
Hub im Kasten „Sendungen“.

## Speicher (`localStorage`, Schlüssel `lager.v1.*`)

`installation`, `nummer`, `erfassung` (Zeilen + Sendungs-ID), `ausstehend` (Marke „Mail geöffnet,
Antwort fehlt“, ab 1.1.0 mit den gesendeten Angaben-Ständen), `archiv` (20), `einstellungen`,
`codes` (Angaben je Code: `kat`, `material`, `hersteller`, `farbe`, `zusatz`, `gesendet`, `zeit`;
höchstens 500), `zuletzt` (zuletzt benutzte Werte für die Vorschlagsknöpfe). Ist der Speicher nicht verfügbar, zeigt die App
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
- [ ] **T9** (1.1.0) Zeile antippen → Angaben mit Umlaut speichern → Senden: Mail enthält `L;A;…` mit
  `ae/oe/ue`; „Ja“ → nächste Sendung desselben Codes ohne A-Zeile; im Hub stehen die Angaben beim Code.
  Tastatur im Angaben-Fenster: Großschreibung am Wortanfang, keine Autokorrektur; nach Schließen
  Cursor im Scan-Feld und Scanner tippt wieder dort hinein.
