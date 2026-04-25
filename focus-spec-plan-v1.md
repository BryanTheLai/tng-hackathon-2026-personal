# Focus Spec Plan V1

## Intent

Build the hackathon app defined in [focus.md](./focus.md): an account takeover detection-to-action orchestration system with this core flow:

`user data -> detection -> action -> prompt -> resolved`

This file turns that focus into an implementation plan:

- pages and routes
- backend modules
- integrations
- TypeScript interfaces and enums
- API and webhook contracts
- Docker + AWS hosting shape
- Alibaba Cloud Model Studio `qwen3.6-flash` usage
- Twilio WhatsApp flow

## Current Call

The source of truth is now `focus.md`, not the older watchlist payout direction in `README.md` and parts of `seed/`.

That means:

- hero case is `ACCOUNT_TAKEOVER`
- backup case is `UNAUTHORIZED_TRANSACTION`
- the product story is intervention, not only detection
- the app is three pages only
- the first production-shaped integration surface is Twilio WhatsApp

## Definition Of Done

This plan is successful when v1 can do all of this in one stable demo:

1. show a queue spike for likely ATO precursor behavior
2. open the top case and show deterministic score, evidence, policy, and action
3. auto-apply a severe control on the high-confidence path
4. send a WhatsApp re-verification prompt
5. ingest Twilio inbound and status callbacks
6. resolve the case into `REACTIVATED`, `BLOCKED`, or `ESCALATED`
7. export a case note
8. replay one threshold or rule change in `/controls`

## Compatibility Lock

Use this exact compatibility baseline unless a later implementation step proves a concrete conflict:

| Layer | Version choice | Why |
|---|---|---|
| Node.js | `20.19.x LTS` | satisfies current Next.js and Prisma minimums and stays on LTS |
| Next.js | `15.x stable` | supported by Amplify Hosting compute |
| React | `19.x` | required baseline for Next.js 15 |
| React DOM | `19.x` | required baseline for Next.js 15 |
| TypeScript | `5.4+` | satisfies Prisma's current minimum |
| Tailwind CSS | `4.x` | current official Next.js guide uses Tailwind v4-style install |
| `@tailwindcss/postcss` | `4.x` | required by Tailwind's current Next.js guide |
| Twilio helper library | `5.13.1` pinned | current latest stable GitHub release as of April 25, 2026 |
| Alibaba integration | raw HTTP `fetch` to OpenAI-compatible endpoint | avoids SDK version drift entirely |
| Database for v1 | seeded JSON first, optional Postgres later | fastest path to a stable demo |

If a real database is needed in v1.1:

- PostgreSQL `16` or `17`
- Prisma on a version that matches the current Node `20.19.x` baseline
- keep `prisma` and `@prisma/client` on the exact same version

## Assumptions

- assuming we are building a polished prototype, not a production banking platform, so I have to find out - I should not assume: v1 can run on synthetic seeded data plus a small Postgres database
- assuming the team wants the fastest credible web stack, so I have to find out - I should not assume: Next.js full-stack TypeScript is acceptable
- assuming the team wants the simplest deploy handoff for the hackathon, so I have to find out - I should not assume: Amplify-first with optional Docker fallback is the right default
- assuming the first outbound WhatsApp message may happen outside an active user session, so I have to find out - I should not assume: the first prompt should be treated as a WhatsApp template message, not freeform

## Not In Scope

- real bank or wallet integrations
- real account freeze enforcement against Touch 'n Go systems
- live device blocking or IP blocking
- full no-code rule builder
- autonomous rule deployment
- custom ML training pipeline
- full omnichannel recovery journey
- Zendesk or ticketing live sync
- multi-tenant admin productization

## Recommended Stack

### App

- `Next.js 15` with App Router
- `TypeScript`
- `Tailwind CSS`
- `shadcn/ui` only for primitives, not for product thinking
- seeded JSON data for v1
- optional `Prisma` + `PostgreSQL` for v1.1
- `Zod` for request and config validation

### Integrations

- `Alibaba Cloud Model Studio` for LLM inference
- `Twilio Programmable Messaging for WhatsApp`

### Infra

- primary deploy target: `AWS Amplify Hosting` for Next.js SSR
- optional backup artifact: one Docker image
- optional database: `Amazon RDS PostgreSQL`
- `AWS Secrets Manager` or Amplify env management for secrets
- `Amazon CloudWatch` for logs where applicable
- scheduled sweep can be deferred in v1 or handled by manual admin action

### Why this stack

- one codebase handles UI, API, webhook endpoints, and server-side rendering
- Amplify can host current Next.js SSR apps without us managing the container runtime directly
- Docker stays available as a portability fallback, not a hard deployment dependency
- seeded JSON avoids unnecessary database ops for the hackathon build

## Deployment Shape

```text
Browser
  ->
Amplify Hosting compute
  ->
Next.js app
  |-> Alibaba Model Studio API
  |-> Twilio REST API
  <- Twilio webhooks through app routes

Optional later:
  |-> Postgres (RDS)
  |-> Docker/App Runner/ECS deployment path
```

## Docker Plan

### Required files

- `Dockerfile`
- `.dockerignore`
- optional `docker-compose.yml` for local app + postgres
- startup command should work without a database in seeded mode

### Container behavior

- multi-stage Docker build
- production image runs as non-root
- exposed port `3000`
- health endpoint `GET /api/healthz`
- startup must fail fast if required env vars are missing

### Runtime note

If Shi Wei deploys with Amplify, Docker is not required.

If Shi Wei wants Docker later, the container should still run with plain `next start` so it can move to App Runner, ECS, or any other Node-compatible platform without app rewrites.

## High-Level Architecture

```text
app/
  (ops)/
    queue/page.tsx
    cases/[caseId]/page.tsx
    controls/page.tsx
  api/
    healthz/route.ts
    queue/route.ts
    cases/[caseId]/route.ts
    cases/[caseId]/action/route.ts
    cases/[caseId]/override/route.ts
    cases/[caseId]/report/route.ts
    controls/config/route.ts
    controls/replay/route.ts
    webhooks/twilio/inbound/route.ts
    webhooks/twilio/status/route.ts
    internal/sweep-expired-prompts/route.ts

lib/
  domain/
  services/
  integrations/
  policies/
  scoring/
  replay/
  audit/
  seed/
  config/
```

## Frontend Route Plan

### `/queue`

Purpose:

- show the spike
- rank suspicious cases
- make the action ladder visible before opening a case

Primary sections:

- spike banner
- queue filters
- ranked case list
- action-state summary

API calls:

- `GET /api/queue`

Server data needed:

- queue cases
- spike cluster stats
- action counts by state

Key interactions:

- click spike banner -> filters queue to related cluster
- click row -> navigate to `/cases/:caseId`
- persist filters in query string

### `/cases/[caseId]`

Purpose:

- be the investigation and decision workspace

Primary sections:

- top summary strip
- left rail case context
- center evidence and timeline
- right rail action and prompt state

API calls:

- `GET /api/cases/:caseId`
- `POST /api/cases/:caseId/action`
- `POST /api/cases/:caseId/override`
- `POST /api/cases/:caseId/report`

Key interactions:

- open score breakdown drawer
- open evidence item drawer
- open policy drawer
- apply or confirm action
- override recommendation with required reason
- resend prompt if allowed
- export note

### `/controls`

Purpose:

- replay one changed threshold, action band, or rule draft against fixed seeded scenarios

Primary sections:

- variable registry
- current thresholds and action bands
- readable draft rule
- prompt mapping
- replay comparison table

API calls:

- `GET /api/controls/config`
- `POST /api/controls/replay`

Key interactions:

- edit threshold
- edit action band mapping
- edit prompt mapping
- replay fixed seed set
- save as draft

## UI State Flow

```text
/queue
  -> /cases/CASE-ATO-001
  -> analyst confirms action
  -> prompt sent
  -> inbound user reply or timeout
  -> case resolved
  -> /controls
  -> replay changed threshold
```

## Backend Service Boundaries

### `QueueService`

Responsibility:

- load queue rows
- compute top-of-queue ordering
- attach cluster spike banner metadata

### `CaseService`

Responsibility:

- assemble the full case payload for the workspace
- merge facts, inferences, policies, controls, prompt state, and audit events

### `ScoreEngine`

Responsibility:

- deterministic ATO score computation
- score component generation
- evidence linkage for every component

### `PolicyEngine`

Responsibility:

- convert score + evidence + controls into allowed actions
- map rule hits to policy IDs
- block unsafe action when policy chain is incomplete

### `ActionOrchestrator`

Responsibility:

- apply `ALLOW`, `REVIEW`, `STUDY`, `STEP_UP_VERIFICATION`, `FREEZE_ACCOUNT`, `ESCALATE`
- write audit events
- trigger prompt flow when action policy requires it

### `PromptService`

Responsibility:

- generate outbound WhatsApp message payload
- create prompt record
- send via Twilio
- normalize Twilio status callbacks

### `ResolutionService`

Responsibility:

- resolve case on inbound user reply or timeout
- enforce idempotency across duplicate webhooks
- map prompt outcome to case outcome

### `ReplayService`

Responsibility:

- replay a changed control config against fixed seed scenarios
- compute before/after deltas

### `AIExplanationService`

Responsibility:

- call Alibaba Cloud Model Studio
- produce grounded explanation, missing-data prompts, and case note draft
- never own the deterministic score or final irreversible action
- use plain HTTP calls to the OpenAI-compatible endpoint, not a provider SDK

### `AuditService`

Responsibility:

- record every system and human decision event
- make export-ready audit timeline available

## Core Flow Contracts

### 1. Queue load

```text
Browser -> GET /api/queue
  -> QueueService
  -> ScoreEngine for precomputed score summary
  -> return ranked rows + spike cluster banner
```

### 2. Case load

```text
Browser -> GET /api/cases/:caseId
  -> CaseService
  -> ScoreEngine
  -> PolicyEngine
  -> AIExplanationService
  -> return assembled case payload
```

### 3. Action apply

```text
Browser -> POST /api/cases/:caseId/action
  -> validate allowed action
  -> ActionOrchestrator applies control
  -> AuditService writes event
  -> if action requires prompt:
       PromptService sends WhatsApp
  -> return updated action + prompt state
```

### 4. Twilio status callback

```text
Twilio -> POST /api/webhooks/twilio/status
  -> validate Twilio signature
  -> normalize queued/sent/delivered/failed/undelivered
  -> update prompt delivery state
  -> append audit event
  -> return 200
```

### 5. Twilio inbound reply

```text
Twilio -> POST /api/webhooks/twilio/inbound
  -> validate Twilio signature
  -> parse form-urlencoded payload
  -> locate prompt by From + case correlation key
  -> if body == /tng-login:
       ResolutionService resolves case
       AuditService writes event
  -> return TwiML response
```

### 6. Replay

```text
Browser -> POST /api/controls/replay
  -> validate candidate config
  -> ReplayService reruns fixed seeds
  -> return before/after metrics + delta
```

## WhatsApp / Twilio Design

### Important constraint

Twilio's WhatsApp rules create two valid implementation modes:

1. demo mode: freeform outbound message inside an active 24-hour customer service window
2. production-safe mode: approved WhatsApp template for the first outbound notification

For this hackathon v1, commit to demo mode because it is the fastest path to a working end-to-end loop.

Reason:

- Twilio's docs state that once an end user messages your business, a 24-hour customer service window opens
- during that window, you can send freeform WhatsApp messages
- outside that window, you may only send an approved template message

So the default demo plan is:

1. before demo, the test user sends a starter WhatsApp message to the Twilio number or joins the Twilio Sandbox
2. that opens the 24-hour session window
3. system triggers severe action
4. system sends a freeform re-verification message
5. user replies `/tng-login`
6. system records the reply and resolves the case

Template mode is explicitly deferred out of v1.

### Twilio routes

- `POST /api/webhooks/twilio/inbound`
- `POST /api/webhooks/twilio/status`

### Twilio outbound send shape

When action requires prompt:

- create `case_prompt` row with `PENDING_SEND`
- send message using Twilio REST API
- store `messageSid`
- transition to `SENT` once API call succeeds
- rely on status callback for `queued`, `sent`, `delivered`, `failed`, `undelivered`
- send freeform text after the user has already opened the 24-hour session window

### Twilio inbound shape

Expected body format:

- `application/x-www-form-urlencoded`
- read `MessageSid`, `From`, `To`, `Body`, not limited to: `NumMedia`, `MessagingServiceSid`
- accept evolving parameters without strict rejection

### Twilio signature validation

Required:

- validate `X-Twilio-Signature` with Twilio SDK
- do not hand-roll signature logic
- keep raw body access compatible with signature validation

### Twilio reply behavior

If inbound body equals `/tng-login`:

- mark prompt state `USER_REPLIED_TNG_LOGIN`
- call `ResolutionService` to map the reply into `REACTIVATED` or `ESCALATED`, based on policy
- optionally return a short TwiML acknowledgement

If inbound body does not match:

- keep case open
- record audit event
- return empty or neutral TwiML response

### Timeout behavior

If no reply in configured SLA window:

- scheduled sweep finds expired prompts
- set prompt state `EXPIRED`
- set case resolution `BLOCKED` or `ESCALATED`, based on policy

## Alibaba Cloud Model Studio Design

### Chosen model

- provider: `Alibaba Cloud Model Studio`
- model: `qwen3.6-flash`

### Why this model

- the plan needs fast, low-cost explanation and note drafting, not heavyweight reasoning for the scoring engine
- the score and policy path stay deterministic, so the LLM is scoped to explanation and report generation

### Integration contract

Create one provider adapter:

- `lib/integrations/alibaba-modelstudio.ts`

Responsibilities:

- call the OpenAI-compatible HTTP endpoint directly with `fetch`
- call `qwen3.6-flash`
- normalize output into app-safe shapes
- isolate provider-specific request and response formats from the rest of the app

### LLM jobs in scope

- case explanation
- recommendation explanation
- missing-data prompt
- manager note draft
- replay summary in plain English

### LLM jobs out of scope

- core fraud score generation
- final irreversible decision ownership
- hidden policy execution

### Safe prompt design

LLM input should receive:

- masked user info
- normalized timeline facts
- evidence IDs
- policy IDs
- current recommendation

LLM input should not receive:

- raw secrets
- unmasked phone numbers
- auth tokens
- Twilio webhook payloads beyond normalized content needed for the explanation

## API Route Map

### UI data routes

#### `GET /api/healthz`

Returns:

- service status
- db connectivity check
- build version

#### `GET /api/queue`

Returns:

- spike banner
- ranked cases
- filter metadata

#### `GET /api/cases/:caseId`

Returns:

- case header
- masked user summary
- timeline events
- evidence items
- score breakdown
- policy hits
- recommendation
- prompt state
- audit trail

#### `POST /api/cases/:caseId/action`

Request:

- `action`
- `reason`
- `actor`

Response:

- updated action state
- control state
- prompt state if created

#### `POST /api/cases/:caseId/override`

Request:

- `overrideAction`
- `overrideReason`
- `actor`

Response:

- updated recommendation state
- audit event id

#### `POST /api/cases/:caseId/report`

Request:

- `format`: `MARKDOWN | JSON`

Response:

- report artifact

#### `GET /api/controls/config`

Returns:

- variable definitions
- current thresholds
- rule drafts
- prompt mappings
- replay baseline summary

#### `POST /api/controls/replay`

Request:

- changed threshold, band, or rule draft

Response:

- replay summary
- case-by-case delta
- analyst workload delta

### Webhook routes

#### `POST /api/webhooks/twilio/inbound`

Behavior:

- public route
- no session auth
- strict signature validation
- idempotent by inbound `MessageSid`

#### `POST /api/webhooks/twilio/status`

Behavior:

- public route
- no session auth
- strict signature validation
- idempotent by callback event hash or message status transition key

### Internal routes

#### `POST /api/internal/sweep-expired-prompts`

Behavior:

- protected by internal bearer token
- called by EventBridge Scheduler or admin script

## Domain Enums

```ts
export enum ScenarioType {
  ACCOUNT_TAKEOVER = "ACCOUNT_TAKEOVER",
  UNAUTHORIZED_TRANSACTION = "UNAUTHORIZED_TRANSACTION",
  MULE_ACCOUNT_ABUSE = "MULE_ACCOUNT_ABUSE",
}

export enum CaseStatus {
  NEW_ALERT = "NEW_ALERT",
  INVESTIGATING = "INVESTIGATING",
  ACTION_APPLIED = "ACTION_APPLIED",
  PENDING_USER = "PENDING_USER",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
  ERROR = "ERROR",
}

export enum RecommendationAction {
  ALLOW = "ALLOW",
  REVIEW = "REVIEW",
  STUDY = "STUDY",
  STEP_UP_VERIFICATION = "STEP_UP_VERIFICATION",
  FREEZE_ACCOUNT = "FREEZE_ACCOUNT",
  ESCALATE = "ESCALATE",
}

export enum EvidenceKind {
  FACT = "FACT",
  INFERENCE = "INFERENCE",
  POLICY = "POLICY",
  CONTROL_STATE = "CONTROL_STATE",
}

export enum PromptChannel {
  WHATSAPP = "WHATSAPP",
}

export enum PromptState {
  PENDING_SEND = "PENDING_SEND",
  SENT = "SENT",
  DELIVERED = "DELIVERED",
  FAILED = "FAILED",
  USER_REPLIED_TNG_LOGIN = "USER_REPLIED_TNG_LOGIN",
  EXPIRED = "EXPIRED",
}

export enum ResolutionState {
  REACTIVATED = "REACTIVATED",
  BLOCKED = "BLOCKED",
  ESCALATED = "ESCALATED",
  PENDING_USER = "PENDING_USER",
}

export enum VariableType {
  BOOLEAN = "BOOLEAN",
  NUMBER = "NUMBER",
  RATIO = "RATIO",
  COUNT = "COUNT",
  DURATION_HOURS = "DURATION_HOURS",
}

export enum RuleState {
  DRAFT = "DRAFT",
  READY_FOR_REPLAY = "READY_FOR_REPLAY",
  READY_FOR_SHADOW = "READY_FOR_SHADOW",
  REJECTED = "REJECTED",
}

export enum AuditActorType {
  SYSTEM = "SYSTEM",
  ANALYST = "ANALYST",
  WEBHOOK = "WEBHOOK",
  SCHEDULER = "SCHEDULER",
}
```

## Core TypeScript Interfaces

```ts
export interface QueueCaseRow {
  caseId: string;
  scenarioType: ScenarioType;
  maskedUserLabel: string;
  score: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  reasonChips: string[];
  currentControlState: string;
  proposedAction: RecommendationAction;
  createdAt: string;
}

export interface SpikeBanner {
  clusterId: string;
  title: string;
  numerator: number;
  denominator: number;
  multiplier: number;
  windowMinutes: number;
  segmentLabel: string;
  signals: string[];
}

export interface ScoreComponent {
  code: string;
  label: string;
  points: number;
  evidenceIds: string[];
}

export interface EvidenceItem {
  evidenceId: string;
  kind: EvidenceKind;
  title: string;
  summary: string;
  source: string;
  confidence?: number;
  observedAt: string;
  policyIds: string[];
}

export interface PolicyHit {
  policyId: string;
  title: string;
  explanation: string;
  actionAllowList: RecommendationAction[];
}

export interface CasePrompt {
  promptId: string;
  channel: PromptChannel;
  state: PromptState;
  templateName: string;
  messageSid?: string;
  sentAt?: string;
  deliveredAt?: string;
  expiredAt?: string;
}

export interface CaseDetail {
  caseId: string;
  scenarioType: ScenarioType;
  status: CaseStatus;
  resolutionState: ResolutionState;
  maskedUserLabel: string;
  score: number;
  scoreComponents: ScoreComponent[];
  timeline: TimelineEvent[];
  evidenceItems: EvidenceItem[];
  policyHits: PolicyHit[];
  recommendation: Recommendation;
  prompt?: CasePrompt;
  auditEvents: AuditEvent[];
}

export interface Recommendation {
  recommendationId: string;
  action: RecommendationAction;
  confidence: number;
  rationale: string;
  evidenceIds: string[];
  policyIds: string[];
  humanOverrideOptions: RecommendationAction[];
}

export interface TimelineEvent {
  eventId: string;
  type: string;
  occurredAt: string;
  label: string;
  details: string;
  succeeded?: boolean;
}

export interface AuditEvent {
  eventId: string;
  actorType: AuditActorType;
  actorName: string;
  eventType: string;
  summary: string;
  createdAt: string;
}

export interface ReplayRequest {
  thresholdEdits?: Record<string, number>;
  actionBandEdits?: Array<{
    minScore: number;
    maxScore: number;
    action: RecommendationAction;
  }>;
  draftRule?: {
    ruleId: string;
    expression: string;
  };
}

export interface ReplaySummary {
  replayRunId: string;
  evaluatedCases: number;
  before: ReplayMetrics;
  after: ReplayMetrics;
  delta: ReplayDelta;
}

export interface ReplayMetrics {
  badCasesCaught: number;
  goodUsersDelayed: number;
  analystReviews: number;
}

export interface ReplayDelta {
  badCasesCaught: number;
  goodUsersDelayed: number;
  analystReviews: number;
}
```

## Database Plan

### Core tables

For v1 seeded mode, these can exist as TypeScript objects or JSON files first:

- `cases`
- `case_entities`
- `entity_edges`
- `timeline_events`
- `transactions`
- `alerts`
- `evidence_items`
- `score_components`
- `policy_hits`
- `recommendations`
- `case_prompts`
- `prompt_events`
- `audit_events`
- `variable_definitions`
- `rule_drafts`
- `replay_runs`
- `replay_results`
- `llm_runs`

### Important relational notes

- do not force a database before the demo needs one
- `case_prompts.case_id` is one-to-many to support resend or retry history
- `prompt_events` stores Twilio delivery transitions separately from the current prompt row
- `llm_runs` stores request purpose, model, token usage, latency, and linked case
- `audit_events` is append-only

## Config Plan

### Required env vars

```text
NODE_ENV=
APP_URL=
APP_INTERNAL_TOKEN=

DATABASE_URL=

ALIBABA_MODELSTUDIO_API_KEY=
ALIBABA_MODEL=qwen3.6-flash
ALIBABA_API_STYLE=openai
ALIBABA_BASE_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1

TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_MESSAGING_SERVICE_SID=
TWILIO_WHATSAPP_FROM=
TWILIO_STATUS_CALLBACK_URL=
TWILIO_INBOUND_WEBHOOK_URL=
TWILIO_TEMPLATE_ATO_REVERIFY=ato_reverify_required_v1

PROMPT_REPLY_TIMEOUT_MINUTES=30
CASE_BLOCK_ON_PROMPT_TIMEOUT=true

FEATURE_ENABLE_AI_EXPLANATION=true
FEATURE_ENABLE_WHATSAPP_PROMPT=true
FEATURE_ENABLE_CONTROLS_REPLAY=true
SEED_MODE=true
```

### Runtime config rules

- validate env at boot with Zod
- fail startup if core secrets are missing
- isolate feature flags from secrets
- keep provider names and model names configurable

## Security And Reliability Rules

- masked PII in UI and LLM prompts by default
- webhook routes bypass app auth but require Twilio signature validation
- webhook processing must be idempotent
- severe action override requires explicit reason
- all state transitions write audit events
- outbound prompt send failures must not silently mark a case as user-pending
- all external calls need timeout, retry policy, and structured logs

## Failure Modes To Design For

### Twilio send succeeded but callback never arrives

- keep current prompt state as `SENT`
- show delivery status as pending
- allow manual resend or review

### Duplicate Twilio inbound callback

- idempotency by `MessageSid`
- no duplicate resolution or duplicate audit events

### User replies anything other than `/tng-login`

- do not auto-resolve
- log inbound content and keep case pending

### Alibaba API timeout

- keep case page usable
- show explanation pane degraded
- deterministic score and policy still render

### Database write succeeds but LLM note draft fails

- case action remains authoritative
- note export retries separately

### Scheduler misses expiry sweep

- case page also calculates a stale prompt warning on read
- next sweep repairs the state

## Seed Data Migration Plan

### What already exists

- `seed/DATA_CONTRACT.md`
- `seed/schema/enums.json`
- watchlist-oriented example cases and replay data

### Reuse

- seeded JSON approach
- boring explicit schema style
- replay artifact shape
- evidence-first contract style

### Replace

- old `WATCHLIST_PAYOUT` hero scenario
- old recommendation enums like `HOLD`
- old watchlist-specific metrics as the main narrative

### Migration steps

1. add new ATO-focused enums and scenario templates
2. create new hero case and backup case JSON
3. keep old watchlist examples in `archive/` or mark as superseded
4. update seed contract references to the new action vocabulary

## Implementation Slice Plan

### Slice 1

- scaffold Next.js app, Postgres, Prisma, Docker, health route

### Slice 2

- load seeded queue and case detail data
- render `/queue` and `/cases/[caseId]`

### Slice 3

- implement deterministic score engine and policy engine
- render score breakdown and policy drawer

### Slice 4

- implement action orchestration and audit events

### Slice 5

- implement Twilio outbound prompt send and visible prompt status

### Slice 6

- implement Twilio inbound + status webhooks and resolution state machine

### Slice 7

- implement note export and Alibaba explanation integration

### Slice 8

- implement `/controls` replay against fixed seeds

## Suggested File Plan

```text
app/(ops)/queue/page.tsx
app/(ops)/cases/[caseId]/page.tsx
app/(ops)/controls/page.tsx

app/api/queue/route.ts
app/api/cases/[caseId]/route.ts
app/api/cases/[caseId]/action/route.ts
app/api/cases/[caseId]/override/route.ts
app/api/cases/[caseId]/report/route.ts
app/api/controls/config/route.ts
app/api/controls/replay/route.ts
app/api/webhooks/twilio/inbound/route.ts
app/api/webhooks/twilio/status/route.ts
app/api/internal/sweep-expired-prompts/route.ts
app/api/healthz/route.ts

lib/config/env.ts
lib/domain/enums.ts
lib/domain/interfaces.ts
lib/scoring/ato-score-engine.ts
lib/policies/action-policy-engine.ts
lib/services/queue-service.ts
lib/services/case-service.ts
lib/services/action-orchestrator.ts
lib/services/prompt-service.ts
lib/services/resolution-service.ts
lib/services/replay-service.ts
lib/services/ai-explanation-service.ts
lib/integrations/twilio-client.ts
lib/integrations/alibaba-modelstudio.ts
lib/audit/audit-service.ts
lib/seed/loaders.ts
prisma/schema.prisma
Dockerfile
docker-compose.yml
```

## Test Plan

### Unit tests

- score engine weights
- policy engine action mapping
- replay result determinism
- env validation

### Integration tests

- case action API writes control and audit rows
- Twilio status callback updates prompt state
- Twilio inbound `/tng-login` resolves case
- expired prompt sweep blocks or escalates correctly

### UI tests

- queue renders spike and ranks hero case first
- case page shows score components and evidence drawer
- controls replay changes visible metrics

### Smoke tests

- container boots locally with docker compose
- `/api/healthz` returns healthy
- webhook endpoints reject invalid signature

## Open Decisions That May Bite Later

1. whether `REVIEW` and `STUDY` are both needed in the visible action ladder for v1, or if one should be cut to reduce cognitive load
2. whether timeout without user reply should default to `BLOCKED` or `ESCALATED`
3. whether the first outbound message should include a deep link into Touch 'n Go recovery or stay as plain text for the demo
4. whether LLM generation should happen on page load or as explicit "Generate explanation" actions to reduce latency risk

## Final Recommendation

Ship v1 as one Dockerized Next.js application on ECS Fargate with Postgres, Twilio WhatsApp, and Alibaba Cloud `qwen3.6-flash`.

Keep the deterministic score, policy, and replay path fully non-LLM.

Use Alibaba only for explanation and report drafting.

For the hackathon demo, use a freeform WhatsApp re-verification message inside an already-open 24-hour session. Defer template messaging entirely out of v1.
