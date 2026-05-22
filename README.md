# FotoKalk · Web-App für Angebotsentwürfe im Malerhandwerk

FotoKalk ist eine Web-App/App-Lösung für Malerbetriebe, die bei der Angebotserstellung hilft: Betrieb einrichten, Preislogik hinterlegen, Baustellenkontext erfassen und daraus einen prüfbaren Angebotsentwurf vorbereiten.

Der Kern ist nicht ein großer KI-Claim, sondern ein sauberer Produktfluss: Stammdaten, Logo, Brand Voice, Preislisten, Stundenlöhne, Baustellenfotos, Notizen und Raummaße werden so strukturiert, dass ein Maler den Entwurf prüfen und bearbeiten kann.

## 60-Sekunden-Überblick

| Frage | Antwort |
| --- | --- |
| Problem | Nach Terminen liegen Fotos, Notizen, Maße, Material, Preise und Stundenlogik oft verteilt vor. |
| Lösung | Eine Web-App, die Betriebsdaten und Baustellenkontext in einen Angebotsentwurf zusammenführt. |
| KI-Rolle | KI bereitet aus Foto-, Text- und Dokumentkontexten Angebotsentwürfe vor. |
| Prüfpunkt | Der Maler prüft Raummaße, Positionen, Preise und Formulierungen vor Nutzung. |
| Roberts Beitrag | Problem eingegrenzt, App-Flow aufgebaut, Eingaben/Preislogik/Entwurf/Prüfung als Produktablauf strukturiert. |
| Öffentliche Grenze | Keine vollständige Rohcode-Veröffentlichung, keine Kundendaten, keine API-/Auth-/Payment-/Admin-Details. |

## Architektur

Siehe [docs/architecture.md](./docs/architecture.md).

## Workflow

Siehe [docs/workflow.md](./docs/workflow.md).

## Schneller Einstieg

Siehe [docs/quick-review.md](./docs/quick-review.md) für den schnellen Überblick.

## Ausführbarer Code-Auszug

Dieses Repo enthält bewusst keinen vollständigen Produktcode. Der kleine Code-Auszug zeigt aber nachvollziehbar die Angebotslogik, die öffentlich sicher erklärbar ist:

- `src/offer-flow.mjs`: Demo-Logik für Raumflächen, Öffnungen, Preispositionen, Angebotsentwurf und Prüfhinweise
- `test/offer-flow.test.mjs`: Tests für Flächenberechnung, Angebotspositionen, Review-Flags und öffentliche Grenzen

Lokal prüfen:

```bash
npm test
python3 scripts/check_public_content.py
```

Der Code nutzt nur synthetische Demo-Daten. Nicht enthalten sind API-Routen, Auth, Payment, Admin-Logik, echte Prompts oder echte Kundendaten.

## Was öffentlich prüfbar ist

- High-Level-Architektur
- Angebotsworkflow vom Setup bis zur Prüfung
- Produktentscheidungen und Grenzen
- reduzierter, ausführbarer Code-Auszug für die Angebotslogik
- Tech-Stack auf Komponentenebene
- Link zur geprüften Portfolio-/Demo-Oberfläche, sobald öffentlich freigegeben

## Was bewusst nicht öffentlich ist

- API-Routen und Promptlogik
- Auth, Admin, Billing, Payment, Webhooks
- Datenbankmigrationen und konkrete Tabellenlogik
- echte Kundendaten, echte Angebote, private Screenshots
- `.env`, Tokens, Schlüssel, Credentials

## Tech/Tools

Next.js, React, TypeScript, Supabase, OpenAI API, React PDF, XLSX, Dexie, Capacitor, Tailwind, Radix UI, Sentry, Vitest.

## Grenze

FotoKalk ist als prüfbarer Produktflow vorbereitet. Es wird nicht behauptet, dass ein Foto allein ein verlässliches Aufmaß ersetzt oder dass Angebotspositionen ohne fachliche Kontrolle übernommen werden sollen.
