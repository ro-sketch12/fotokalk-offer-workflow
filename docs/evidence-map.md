# Evidence Map · FotoKalk

Diese Übersicht fasst zusammen, welche Aussagen öffentlich gezeigt werden und welche Teile bewusst privat bleiben.

| Öffentliche Aussage | Belegart | Öffentliche Darstellung |
| --- | --- | --- |
| Web-App/App-Lösung für Angebotsentwürfe | Original-App-Struktur, Stack, Dashboard- und Estimate-Flows | README + Architektur |
| Betriebsdaten und Preislogik gehören zum Flow | Settings-/Preislisten-/PDF-Bereiche | Workflow |
| Foto/Text/Dokument/Raumdaten werden als Kontext genutzt | Estimate-Flow und Analysebereiche | Workflow ohne API-Details |
| KI bereitet Entwürfe vor | AI-/Analysebereiche und OpenAI-Integration | High-Level KI-Schritt |
| Mensch prüft Ergebnis | Produktlogik und vorsichtige öffentliche Formulierung | Grenze und Prüfpunkt |
| Reduzierte Angebotslogik ist lokal prüfbar | Öffentlicher technischer Ausschnitt ohne API/Auth/Kundendaten | `src/offer-flow.mjs` + Tests |
| Repo ist schnell lesbar | kuratierte Schnellübersicht | `docs/quick-review.md` |
