# Seed Data

This project is running in seeded mode on purpose.

## Why

- The demo needs stable, believable fraud cases.
- The UI should be buildable before any real integration exists.
- The page layer should never care whether data came from JSON, SQL, or APIs.

## Source of truth

- `seed/demo-core.json` contains the generated demo dataset.
- `lib/domain/schema.ts` defines the typed contract every seed record must satisfy.
- `lib/repositories/risk-ops-repository.ts` is the boundary the UI talks to.

## Swap path later

When real data arrives:

1. Keep the schemas.
2. Replace the seed repository with a database or API-backed repository.
3. Keep the page and component contracts unchanged.

## Required completeness for each seeded case

Each case must include:

- user identity fields in masked form
- score and score components
- evidence ledger
- policy hits
- action recommendation
- prompt state
- audit events
- export-ready note text
- controls/replay coverage where relevant

