# Agent Build Brief V1

Use this as the working brief for the next build pass.

Primary source documents:

- `focus.md`
- `focus-spec-plan-v1.md`

This file overrides ambiguity and locks the decisions that were still open.

## Goal

Ship a stable seeded-mode demo of an account takeover operations product with this loop:

`queue spike -> open case -> deterministic recommendation -> apply action -> send WhatsApp prompt -> ingest reply or timeout -> resolve case -> replay one control change`

Do not optimize for production completeness. Optimize for a reliable demo that does not stall, break, or require explaining unnecessary complexity.

## Locked Product Decisions

These are not open anymore.

1. Cut `STUDY`. Keep `REVIEW`.
2. Timeout with no user reply resolves to `ESCALATED` by default, not `BLOCKED`.
3. First outbound WhatsApp message stays plain text for v1. No deep link.
4. LLM work does not run on case page load. Make it explicit with user-triggered actions such as `Generate explanation` and `Draft note`.

Implications:

- simplify action ladders, enums, mappings, copy, and override logic around `REVIEW`
- do not auto-block on silence unless a later policy explicitly adds that branch
- keep the WhatsApp flow text-based and demo-safe
- keep case load deterministic and fast

## Current Repo State

Already present:

- Next.js app with pages for `/queue`, `/cases/[caseId]`, `/controls`
- screen components for queue, case, controls
- seeded data in `seed/demo-core.json`
- typed schema in `lib/domain/schema.ts`
- seed-backed repository in `lib/repositories/risk-ops-repository.ts`
- replay simulator in `lib/replay/simulate.ts`

Not present yet:

- API route handlers
- write-path services for action apply, override, report export, prompt lifecycle, resolution lifecycle
- Twilio integration and webhook handling
- Alibaba adapter and explicit generation endpoints
- health route
- real persistence for mutable demo state

## Delivery Target

Deliver seeded mode first. Do not add Postgres in this pass.

Reason:

- the current repo is already structured around seeded mode
- the fastest path is to keep the existing schema and repository contracts and add a thin mutable demo layer behind them
- database setup, migrations, and deployment shape are separate work and will slow the core loop

## Build Strategy

Implement in this order.

### 1. Normalize the domain contract

Update the schema and any UI assumptions to remove `STUDY` from the visible and allowed action set.

Required changes:

- remove `STUDY` from recommendation action schemas and action bands unless it is kept only as internal historical compatibility
- ensure the queue, case page, controls page, and replay views no longer present `STUDY`
- ensure override options and recommendation mappings stay coherent

Rule:

- if old seed data still contains `STUDY`, migrate the seed data now instead of carrying compatibility hacks through the UI

### 2. Add a mutable demo-state layer

The current repository is read-only. The app needs a write path for demo interactions.

Implement a demo-state store behind the repository boundary:

- load from `seed/demo-core.json`
- keep an in-memory mutable copy for server-side actions
- expose read and write operations through repository or service boundaries
- support reset behavior if needed through a separate internal utility, not through public UI

The point is not durability. The point is to make the flow interactive without inventing a database.

### 3. Add API routes for the existing UI

Create route handlers for:

- `GET /api/healthz`
- `GET /api/queue`
- `GET /api/cases/:caseId`
- `POST /api/cases/:caseId/action`
- `POST /api/cases/:caseId/override`
- `POST /api/cases/:caseId/report`
- `GET /api/controls/config`
- `POST /api/controls/replay`

Requirements:

- validate inputs with Zod
- return typed JSON shapes matching the existing page contracts
- fail cleanly on invalid case IDs and invalid actions
- keep route code thin; move business logic into `lib/services/*`

### 4. Implement the service layer

Add services with narrow ownership:

- `QueueService`
- `CaseService`
- `ActionOrchestrator`
- `PromptService`
- `ResolutionService`
- `ReplayService`
- `AuditService`
- `ReportService`

Rules:

- deterministic score and policy stay non-LLM
- action apply must append audit events
- override requires a reason
- case report export can start as plain text or markdown response; do not overbuild file generation

### 5. Wire the seeded WhatsApp lifecycle

Build the prompt and resolution state machine now, even if the first pass uses a stub transport.

Required states:

- `PENDING_SEND`
- `SENT`
- `DELIVERED`
- `FAILED`
- `USER_REPLIED_TNG_LOGIN`
- `EXPIRED`

Required resolution behavior:

- user reply `/tng-login` resolves to `REACTIVATED` or `ESCALATED` based on policy
- timeout sweep resolves to `ESCALATED` by default
- no generic timeout path should resolve to `BLOCKED`

Implementation order:

1. build service logic and internal state transitions
2. expose webhook routes
3. connect real Twilio send and signature validation

Do not block the core flow on Twilio being fully live.

### 6. Add Twilio routes and integration

Create:

- `POST /api/webhooks/twilio/inbound`
- `POST /api/webhooks/twilio/status`

Requirements:

- validate Twilio signature with the official SDK
- parse form-encoded inbound payloads
- make handlers idempotent
- locate prompt and case correlation safely
- record audit events for inbound reply and status transitions

For v1 message content:

- plain text only
- no deep link
- assume an already-open 24-hour WhatsApp session for the demo

### 7. Keep LLM generation explicit

Do not call Alibaba during `GET /api/cases/:caseId`.

Instead add explicit endpoints such as:

- `POST /api/cases/:caseId/generate-explanation`
- `POST /api/cases/:caseId/draft-note`

Rules:

- these endpoints are optional assistive generation only
- they cannot change score, action, policy, or final irreversible state
- UI must tolerate slow or failed generation without breaking the page

If Alibaba integration is not finished, stub these endpoints behind a feature flag or deterministic placeholder response. Do not let them block the rest of the demo.

### 8. Make the UI consume APIs, not the seed repository directly

The pages should stop importing seed-backed data directly once the routes exist.

Requirements:

- load queue, case detail, and controls from API routes
- post action, override, replay, and report through route handlers
- show pending and error states
- preserve the current UI shape unless a change is required by the locked decisions

### 9. Add the timeout sweep path

Create:

- `POST /api/internal/sweep-expired-prompts`

Requirements:

- protected by internal token
- finds expired prompts
- transitions prompt state to `EXPIRED`
- resolves cases to `ESCALATED` by default
- writes audit events
- idempotent on repeated invocation

### 10. Add minimum verification

Must have:

- schema validation tests
- route tests for queue and case fetch
- action apply test
- override reason required test
- replay route test
- timeout sweep test
- webhook idempotency tests

Do not spend time on broad snapshot coverage.

## UI Behavior Requirements

Queue:

- show spike banner
- rank highest-risk case first
- show simplified action ladder without `STUDY`

Case page:

- deterministic score, evidence, policy, recommendation, prompt state, and audit trail
- action apply and override must update visible state
- explanation and note generation must be explicit buttons, not page-load side effects

Controls:

- edit threshold or action band inputs
- replay against fixed scenarios
- show before and after metrics and changed recommendation counts

## Non-Goals

Do not do these in this pass:

- Postgres
- Prisma
- Docker hardening
- ECS or Amplify deployment work
- template-based WhatsApp first-contact flows
- deep-link recovery UX
- hidden LLM decisioning
- generic rules engine productization

## File Targets

Expected new areas:

- `app/api/healthz/route.ts`
- `app/api/queue/route.ts`
- `app/api/cases/[caseId]/route.ts`
- `app/api/cases/[caseId]/action/route.ts`
- `app/api/cases/[caseId]/override/route.ts`
- `app/api/cases/[caseId]/report/route.ts`
- `app/api/cases/[caseId]/generate-explanation/route.ts`
- `app/api/cases/[caseId]/draft-note/route.ts`
- `app/api/controls/config/route.ts`
- `app/api/controls/replay/route.ts`
- `app/api/webhooks/twilio/inbound/route.ts`
- `app/api/webhooks/twilio/status/route.ts`
- `app/api/internal/sweep-expired-prompts/route.ts`
- `lib/services/*`
- `lib/integrations/twilio/*`
- `lib/integrations/alibaba-modelstudio.ts`
- `lib/repositories/*` changes to support mutable demo state

## Done Means

This build pass is done when all of this is true:

- `/queue`, `/cases/[caseId]`, and `/controls` load through API routes
- action apply works and persists within the running demo session
- override works and requires a reason
- report export works
- replay works
- prompt state can move through send, delivered or failed, reply, and expiry paths
- inbound reply can resolve a case
- timeout sweep resolves to `ESCALATED`
- LLM generation is explicit and non-blocking
- no visible `STUDY` action remains

## Short Version To Hand To An Agent

Build the seeded end-to-end loop first. Do not add a database. Remove `STUDY`. Default timeout resolution to `ESCALATED`. Keep WhatsApp plain text with no deep link. Keep Alibaba off page load and expose it only through explicit generation endpoints. Add API routes, a mutable demo-state layer, service boundaries, webhook handlers, and minimum tests. Keep deterministic scoring and policy logic separate from LLM output.
