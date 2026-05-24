# FotoKalk

FotoKalk is a real web app for painting businesses. The live product surface is linked below; this repository does not try to duplicate it.

This repository contains a small, runnable code excerpt of the offer workflow. It can be reviewed without exposing the private production codebase, customer data, API routes, auth, billing, admin areas, database details or AI routing internals.

## What can be reviewed here

- room measurement logic with door and window deductions
- demo price logic for wall, ceiling, preparation, masking and disposal positions
- line-item generation from room data, notes and photo context
- net, tax and gross totals
- review flags before anything becomes a real offer
- markdown output for a handoff-ready offer draft
- tests and a public-safety scan

## What this repository does not contain

- the full FotoKalk web app
- production API routes
- authentication, team, billing, admin or payment implementation
- database schema, migrations or private queries
- private prompt/model-routing details
- real customer records, quotes, invoices, logs or screenshots

## Run the code excerpt

```bash
npm run verify
npm run demo
npm run demo:write
```

`npm run verify` runs:

- node tests for room calculations, offer logic and review flags
- a CLI summary check
- a public-safety scan for env files, secret-like values, emails and phone numbers

## Repository map

```text
src/offer-flow.mjs          offer calculation, review flags, handoff checklist
test/offer-flow.test.mjs    node:test coverage for the workflow
scripts/demo.mjs            CLI demo: markdown, JSON, summary, generated example output
examples/                   synthetic demo input and generated output
docs/                       architecture, workflow and public/private boundary
```

## Original-project fidelity

The private FotoKalk app includes onboarding, settings, price lists, room data, estimates, PDF output, auth, database queries, AI routes and operational integrations.

This public repo keeps only the parts that are safe and useful for technical review:

- business setup and brand voice as input concepts
- price logic and hourly-rate basis
- room measurement flow with door/window deductions
- photo and note context as input material
- line-item generation
- offer totals
- review flags before handoff

## Product decision

The important product decision is not that AI sends an offer by itself. The workflow prepares a structured draft while measurements, prices and wording stay reviewable by the painter.

## Public links

- Portfolio: `https://robert-systems.com`
- FotoKalk website: `https://www.fotokalk.de/`
- FotoKalk app: `https://app.fotokalk.de/`

## License

All rights reserved. This repository is portfolio and application material only.
