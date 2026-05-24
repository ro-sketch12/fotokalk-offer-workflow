# Quick review · FotoKalk

## 60-second path

1. Read the README to understand problem, product idea and public boundary.
2. Run `npm run verify` to execute tests, demo summary and public-safety scan.
3. Run `npm run demo` to see the generated markdown offer draft.
4. Inspect `src/offer-flow.mjs` for the runnable code excerpt.
5. Use the README links to review the actual FotoKalk website/app separately.

## What to look for

- Room data becomes measured wall and ceiling area.
- Standard positions become line items with quantities and prices.
- The output is not treated as final. It always carries review flags.
- Photo context is used as a review hint, not as a replacement for measurement.
- Demo data remains public-safe.
- The actual web app remains linked instead of being duplicated in this repository.

## What this repo does not expose

- full production source code
- auth, admin, payment or database implementation
- real customer records
- private prompts, API routes or model configuration
