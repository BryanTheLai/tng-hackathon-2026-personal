# Setup

## Requirements

- Node.js `20.19+`
- npm `10+`

## First run

1. Copy `.env.example` to `.env`.
2. Install packages:

```powershell
npm install
```

3. Start the app:

```powershell
npm run dev
```

4. Open:

- `http://localhost:3000/queue`
- `http://localhost:3000/cases/CASE-ATO-001`
- `http://localhost:3000/controls`

## Quality gates

Run all checks:

```powershell
npm run lint
npm run typecheck
npm test
npm run build
```

## Current mode

- Seeded mode only
- No database required
- No external provider setup required for the current UI build

## Project shape

- `app/`
  - Next.js routes
- `components/`
  - UI shell and route screens
- `lib/domain/`
  - typed contracts
- `lib/repositories/`
  - data boundary
- `seed/`
  - seeded demo dataset
- `scripts/sql/`
  - future relational sketch

## Notes

- The UI is optimized for dense operator workflows, not marketing screenshots.
- The current pass keeps data swappable later through the repository boundary.
