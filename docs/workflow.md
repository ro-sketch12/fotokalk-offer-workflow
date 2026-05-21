# Workflow · FotoKalk

## Nutzerablauf

1. App öffnen und Betrieb einrichten.
2. Brand Voice, Logo, Stammdaten, PDF-Darstellung, Preislisten und Stundenlöhne hinterlegen.
3. Neues Angebot starten.
4. Baustellenfotos, Notizen, Text/PDF-Kontext und Raummaße erfassen.
5. KI bereitet den Kontext und einen Angebotsentwurf vor.
6. Maler prüft Positionen, Raummaße, Preise und Formulierungen.
7. Entwurf wird bearbeitet und als Angebot/PDF weiterverwendet.

```mermaid
sequenceDiagram
  participant U as Maler
  participant S as Betriebs-Setup
  participant C as Baustellenkontext
  participant AI as KI-Schritt
  participant O as Angebotsentwurf

  U->>S: Stammdaten, Logo, Preise, Stundenlohn einrichten
  U->>C: Fotos, Notizen, Raummaße, Dokumentkontext erfassen
  C->>AI: Kontext strukturieren lassen
  AI->>O: Angebotsentwurf vorbereiten
  O->>U: Prüfung und Bearbeitung
```

## Produktentscheidung

Der erste sinnvolle Umfang ist nicht “KI macht alles”, sondern:

- Eingaben sauber sammeln
- Betriebslogik berücksichtigen
- Entwurf vorbereiten
- fachliche Kontrolle sichtbar halten

## Arbeitgeber-Signal

FotoKalk zeigt, dass Robert ein reales Arbeitsproblem in einen App-Flow übersetzen kann: Setup, Daten, KI-Schritt, Ausgabe und menschliche Prüfung.

