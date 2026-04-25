# Demo Core UI-First Architecture

## What shipped first

- mobile-safe UI for `/queue`, `/cases/:caseId`, and `/controls`
- seeded JSON data with typed validation
- a repository boundary between pages and the seed dataset
- a future SQL sketch in `scripts/sql/demo-core-schema.sql`

## Why this shape

- UI needed to be the product first, not a backend science project.
- The repo had no implementation yet, so the fastest believable path was:
  1. lock the information architecture
  2. make it readable on mobile and desktop
  3. keep data swappable later

## Separation of concerns

- `seed/demo-core.json`
  - demo data only
- `lib/domain/schema.ts`
  - contract and validation rules
- `lib/seed/loaders.ts`
  - load and validate seed data
- `lib/repositories/risk-ops-repository.ts`
  - the UI-facing data boundary
- `components/screens/*`
  - route-level presentation and interaction

## UI rules applied

- queue is skimmable first, not a showcase list
- the product shell is compact so more working surface is visible immediately
- case view keeps score, recommendation, prompt state, and audit together near the top
- deep detail lives in drawers, not popup soup
- controls stay editable and replayable without wasting space on presentation chrome
