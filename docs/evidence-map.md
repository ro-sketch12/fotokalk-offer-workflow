# Evidence Map · FotoKalk

Quelle: siehe `github-public-proof/evidence/fotokalk-evidence-map.md` in der Arbeitskopie.

| Öffentliche Aussage | Belegart | Öffentliche Darstellung |
| --- | --- | --- |
| Web-App/App-Lösung für Angebotsentwürfe | Original-App-Struktur, Stack, Dashboard- und Estimate-Flows | README + Architektur |
| Betriebsdaten und Preislogik gehören zum Flow | Settings-/Preislisten-/PDF-Bereiche | Workflow |
| Foto/Text/Dokument/Raumdaten werden als Kontext genutzt | Estimate-Flow und Analysebereiche | Workflow ohne API-Details |
| KI bereitet Entwürfe vor | AI-/Analysebereiche und OpenAI-Integration | High-Level KI-Schritt |
| Mensch prüft Ergebnis | Produktlogik und public-safe Copy | Grenze und Prüfpunkt |
| Reduzierte Angebotslogik ist prüfbar | Public-safe Nachbau ohne API/Auth/Kundendaten | `src/offer-flow.mjs` + Tests |
| Repo ist schnell reviewbar | kuratierte Review-Führung | `docs/reviewer-guide.md` |
