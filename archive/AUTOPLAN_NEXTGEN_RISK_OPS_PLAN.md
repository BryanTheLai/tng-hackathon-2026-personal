# TNG FinHack Autoplan: Next-Gen Risk Ops Plan

Generated: 2026-04-24
Repo: `tng-hackathon-2026-personal`
Seed inputs: `README.md`, `index.html`, user prompt
Mode: `SELECTIVE_EXPANSION`
Status: ready for implementation
Voice source: `codex-only` in this run

## What This Doc Does

Use this file for:

- MVP scope
- ranked build order
- architecture
- design contract
- test and risk plan
- demo sequence
- CTO and mentor questions
- post-MVP backlog

Do not use this file for:

- hackathon logistics
- deep vendor research
- pitch-script detail

Those live in `tng-doc-by-shiwei.md` and `FRAUD_OPS_MARKET_RESEARCH_2026-04-25.md`.

## Current Call

- Track: `Security & Fraud`
- Product: `AI-native pre-payout decision workspace for fraud + AML ops`
- Hero case: `cross-border near-watchlist payout`
- Hero replay: `watchlist-payout`, the watchlist threshold tradeoff replay
- Wedge: `evidence graph + specialist agents + human action rail + replay lab`

One-line pitch:

`TNG RiskOps Agent turns fraud and AML alerts into evidence-backed pre-payout decisions, export-ready case notes, and replayable policy tradeoffs.`

Short version:

`alert -> investigation -> action -> report -> replay`

## Guardrails From The Rubric

1. AI must be justified.
   Use AI for evidence assembly, action recommendation, policy reasoning, note drafting, and replay tradeoffs.
   Do not use AI where rules are stronger.
2. The prototype must survive follow-up.
   A good first click means nothing if the second click breaks.
3. Two clouds must do real work.
   One cloud for app and seeded data, one for AI or replay, with a real reason for the split.
4. Impact has to be real and visible fast.
   The user is the fraud or AML analyst making a decision before payout.
5. Presentation is load-bearing.
   One sharp case beats feature stuffing.

## Ranked Build Order

1. End-to-end hero case that ends in a visible pre-payout action.
   Build: seeded alert -> evidence -> recommendation -> human `hold`, `step-up`, or `escalate` -> export note.
   Why: without this, the product story fails.
2. One-screen investigation workspace.
   Build: facts, AI inferences, evidence timeline, linked entities, triggered controls, uncertainty, and action rail.
   Why: this is the real fraud-ops pain.
3. Evidence-backed AI recommendation, human approval, and note export.
   Build: specialist agents, policy citations, missing-data requests, confidence, grounded rationale, and export-ready notes.
   Why: this is the strongest AI justification.
4. Purposeful multi-cloud split.
   Build: app and seeded data on one cloud, AI or replay on the second, with one sentence judges can repeat back.
   Why: hard judging requirement.
5. Replay lab for one policy tradeoff.
   Build: current threshold vs stricter threshold, caught bad payments vs delayed good payments.
   Why: strongest differentiator and something real fraud ops teams want.
6. Queue ranking and one backup case.
   Build: reason chips, risk level, next action, second scenario for Q&A.
   Why: improves realism, but only after the hero case works.
7. Thin customer step-up moment, only if the first six are stable.
   Why: useful for the "before money leaves" story, but easy to overscope.

## Scope Lock

### In scope for the hackathon MVP

1. Ingest fake or seeded events from fraud rules, watchlist matches, device risk, and merchant anomalies.
2. Resolve users, wallets, devices, merchants, and beneficiaries into one case graph.
3. Run specialist agents that produce facts, inferences, missing-data requests, and recommended actions.
4. Show an investigator workspace with evidence, uncertainty, next steps, and action buttons.
5. Generate a case note or SAR-style draft from the evidence ledger.
6. Include a replay or simulator tab for synthetic attack scenarios.

### Not in scope

- Replacing TNG's core payments switch
- building a full sanctions provider or external screening network
- training a proprietary fraud model from production traffic
- full consumer app redesign
- live bank, telco, or government integrations
- automatic irreversible enforcement without human approval
- full multilingual customer rescue workflow
- production-grade event streaming infrastructure

## Reuse And Current Assets

### In the repo

- `README.md`: current call and doc map
- `index.html`: seeded queue UI, cases, and replay scenarios

### In the product environment

- TNG already appears to have strong front-door safety controls: device binding, TapSecure approval, cooling-off protection, transaction checks, and fraud reporting
- Ant already markets adaptive risk authentication and anti-fraud infrastructure

### In the market

- Sardine, Unit21, Feedzai, Hawk, ComplyAdvantage, and Flagright already cover alerting, screening, monitoring, and case management

### Reuse decision

- Reuse the current queue and detail interaction pattern from `index.html`
- keep the original `AML + sanctions` idea as one agent inside the system
- do not rebuild consumer authentication, raw risk scoring, or watchlist search from scratch

## Why This Direction Wins

The original direction was `real-time AML + sanctions screener`.

That is too weak now because:

- generic screening already exists everywhere
- a prettier queue does not beat TNG's current stack or the market leaders
- the open gap is analyst leverage, explanation quality, policy traceability, and replay

The product should sit above existing controls, not compete with them.

That means:

- not another alert dashboard
- not another sanctions checker
- not another score
- yes to local TNG abuse patterns
- yes to explainable action recommendations
- yes to safe control tuning before rollout

## 12-Month Story Vs Hackathon Story

### 12-month ideal

- all TNG risk signals unified in one case graph
- AI agents investigate every case in shadow mode
- low-risk cases auto-close with audit logs
- high-risk cases escalate with policy citations and regulator packs
- every new policy or rule can be replayed against synthetic attacks before launch
- analyst feedback continuously improves prompts, policies, and graph linking

### Hackathon delta

The MVP reaches about 60% of the story:

- yes: graph, agents, workspace, report draft, replay lab
- no: live integrations, production controls, real feedback loops, full policy compiler

## Product Spec

### Primary user

- fraud ops analyst

### Secondary users

- AML investigator
- compliance lead
- risk product manager

### Core jobs to be done

- tell me which cases matter first
- show me why
- tell me what evidence is still missing
- recommend the next action
- give me something I can sign off on and export
- let me test new controls before they hit customers

### Opinionated product choices

- internal-first, not consumer-first
- facts and AI inferences stay visually separate
- high-risk actions always require human approval
- replay stays in MVP because it is the clearest next-gen differentiator
- sanctions screening is an agent, not the homepage

### All review threads agreed on

- build above existing controls
- keep agentic investigation core
- reject queue-only UI
- keep replay in scope
- reject consumer redesign for MVP
- reject full core risk engine replacement

## Design Contract

### Why this wins

The strong version of this product is not one more risk score.

The strong version is:

1. one live case that already groups wallet, device, beneficiary, watchlist, and policy evidence
2. separate specialist agents showing what each one checked
3. a human-readable action recommendation with confidence and policy lines
4. a visible human action before money leaves
5. a replay lab that shows the tradeoff before a rule change ships

That is a sharper story than "we built fraud detection."

### Design rules

1. Make it a decision workspace, not an alert table.
2. Keep the story on intervention before payout, not post-incident reporting.
3. Separate facts from AI inferences everywhere.
4. Keep human approval visible on high-risk actions.
5. Keep replay visible because it is the clearest next-gen moment.
6. Stay internal-first. Only show a customer-facing moment if it sharpens the core story.

### Screen contract

The UI should feel like `mission control for one case`, not `an inbox of scary rows`.

Left rail:

- ranked cases
- reason chips
- agent status

Center:

- evidence timeline
- graph of connected entities
- fact blocks
- inference blocks
- missing-data requests

Right rail:

- recommended action
- policy citations
- confidence
- analyst `approve`, `hold`, `step-up`, or `escalate`
- export note or SAR-style draft

Second tab:

- Scenario Lab

### What the design must prove

1. The analyst can see the highest-priority case in 3 seconds.
2. The analyst can tell fact vs AI inference instantly.
3. The analyst can see why the recommendation was made.
4. The analyst can take the next action without switching tools.
5. The design shows something TNG likely does not already have.
6. A non-expert judge can follow the demo without compliance jargon.

## Error & Rescue Registry

| Codepath | Failure mode | Rescue action | User impact | Logged |
|---|---|---|---|---|
| `watchlist_lookup` | provider timeout | use cached result, mark as stale, block auto-clear | analyst sees stale badge | Yes |
| `entity_resolver` | ambiguous graph link | lower confidence, require review, do not merge entities silently | analyst sees uncertainty chip | Yes |
| `agent_orchestrator` | malformed model output | retry once with structured output, then fallback to deterministic summary | slower case update, no silent break | Yes |
| `policy_evaluator` | missing policy code | default to escalate, do not allow auto-approve | more manual review | Yes |
| `report_drafter` | unsupported claim in draft | remove claim, mark evidence gap, require analyst edit | draft stays usable | Yes |
| `scenario_runner` | non-deterministic replay result | show seed mismatch warning and save run separately | no broken demo state | Yes |
| `customer_rescue_trigger` | false positive intervention | keep as recommended action only in MVP | no direct customer friction | Yes |

## Failure Modes Registry

| CODEPATH | FAILURE MODE | RESCUED? | TEST? | USER SEES? | LOGGED? |
|---|---|---|---|---|---|
| signal ingest | duplicate event creates duplicate case | Y | Y | clear merge state | Y |
| entity graph | wrong beneficiary link | Y | Y | confidence warning | Y |
| agent investigation | model invents unsupported reason | Y | Y | evidence gap warning | Y |
| action recommendation | unsafe auto-freeze on thin evidence | Y | Y | blocked by approval gate | Y |
| report draft | draft includes unverified statement | Y | Y | flagged field | Y |
| simulator replay | scenario score changes across same seed | Y | Y | replay mismatch banner | Y |
| case list refresh | narrative loads before facts | Y | Y | loading state | Y |
| policy update | stale policy version used in review | Y | Y | version mismatch badge | Y |

Critical gaps flagged:
- 0 after redesign

## Design Review

### Current design problem

The current fake UI is readable, but it is still old-gen:

- queue first
- reasons second
- no evidence provenance
- no uncertainty model
- no agent workflow
- no replay/simulator
- no regulator output

A user would say:

- "I still have to think through everything myself."
- "I see alerts, but not a decision path."
- "I cannot tell what is fact vs AI guess."
- "I cannot test policy changes before pushing them."

### New design north star

The UI should feel like `mission control for one case`, not `an inbox of scary rows`.

### Proposed surface

Left rail:
- ranked cases
- reason chips
- agent status

Center:
- evidence timeline
- graph of connected entities
- fact vs inference blocks
- missing data requests

Right rail:
- recommended action
- policy citations
- confidence
- analyst approve / hold / escalate
- export note / SAR draft

Second tab:
- Scenario Lab

### Design litmus scorecard

| Dimension | Initial | Revised | Notes |
|---|---|---|---|
| Clarity | 5/10 | 8/10 | top case and next step are obvious |
| Information hierarchy | 5/10 | 8/10 | evidence and action are separated |
| Trust / explainability | 4/10 | 9/10 | provenance and uncertainty are explicit |
| Workflow support | 4/10 | 9/10 | analyst can act, not just read |
| Differentiation | 3/10 | 9/10 | simulator and agent timeline change the story |
| Learnability | 7/10 | 8/10 | still plain-language, not compliance jargon |
| Demo strength | 5/10 | 9/10 | case -> action -> report -> replay is a complete arc |

### Design litmus checks

| Check | Result |
|---|---|
| Can the analyst see the highest-priority case in 3 seconds? | Yes |
| Can the analyst tell fact vs AI inference instantly? | Yes |
| Can the analyst see why the recommendation was made? | Yes |
| Can the analyst see uncertainty and missing data? | Yes |
| Can the analyst take the next action without switching tools? | Yes |
| Does the design show something TNG likely does not already have? | Yes |
| Is the demo understandable to a non-expert judge? | Yes |

### Design DUAL VOICES - CONSENSUS TABLE

| Dimension | Codex | Claude subagent | Consensus |
|---|---|---|---|
| Queue-only UI is enough | No | N/A | single-voice: reject |
| Facts and AI should be separated | Yes | N/A | single-voice: approve |
| Replay lab should be visible in the product | Yes | N/A | single-voice: approve |
| Plain language should win over compliance jargon | Yes | N/A | single-voice: approve |
| Mobile-first design required | No | N/A | single-voice: reject for MVP |
| Full design system needed now | No | N/A | single-voice: reject for MVP |
| Mission-control layout is the right metaphor | Yes | N/A | single-voice: approve |

## Eng Review

### Architecture choice

Use one app with one database and one background worker.

Do not build microservices.
Do not build a separate graph database in the hackathon.
Use explicit tables plus adjacency edges.

### System architecture

```text
                  +---------------------------+
                  |  Seeded alerts / fake tx  |
                  |  sanctions / device risk  |
                  +-------------+-------------+
                                |
                                v
                      +---------+---------+
                      |     Ingest API     |
                      +---------+---------+
                                |
                                v
                      +---------+---------+
                      |   Event / Case DB  |
                      +----+----------+---+
                           |          |
                           v          v
                    +------+--+   +---+----------------+
                    | Entity  |   | Policy / Rule DB   |
                    | Resolver|   +---+----------------+
                    +---+-----+       |
                        |             |
                        v             |
                 +------+-------------+------+
                 |     Evidence Graph Store   |
                 +--+-----------+-----------+-+
                    |           |           |
                    v           v           v
            +-------+--+ +------+-----+ +---+--------+
            | Behavior | | Sanctions  | | Policy     |
            | Agent    | | Agent      | | Agent      |
            +-------+--+ +------+-----+ +---+--------+
                    \           |           /
                     \          |          /
                      v         v         v
                    +-----------------------+
                    | Investigation Orchestrator |
                    +------+---------------+-----+
                           |               |
                           v               v
                 +---------+----+   +------+------+
                 | Action Engine |   | Report Draft |
                 +---------+----+   +------+------+
                           |               |
                           v               v
                     +-----+----------------+-----+
                     | Investigator Workspace UI  |
                     +----------------------------+
```

### Data flow

```text
alert -> case -> graph enrichment -> agent runs -> evidence ledger
      -> action recommendation -> human approval -> export / close
                                   |
                                   +-> replay scenario against same policy set
```

### State machine

```text
NEW_ALERT
  -> ENRICHING
  -> INVESTIGATING
  -> READY_FOR_REVIEW
      -> APPROVED_ACTION
      -> NEEDS_MORE_DATA
      -> CLOSED_NO_ACTION
  -> REPORT_DRAFTED
  -> CLOSED
  -> ERROR
```

### Error flow

```text
tool failure
  -> retry once
  -> deterministic fallback
  -> mark degraded state
  -> require analyst review
  -> log metric + keep case usable
```

### Deployment sequence

```text
seed data
  -> run local app
  -> shadow-generate agent outputs
  -> smoke check case list
  -> demo one case end-to-end
  -> demo replay lab
```

### Rollback flowchart

```text
bad build?
  -> yes -> disable agent actions -> keep read-only case browser -> use saved seeded runs
  -> no  -> continue demo
```

### Core schema

```ts
type EntityType =
  | "USER"
  | "WALLET"
  | "DEVICE"
  | "MERCHANT"
  | "BENEFICIARY"
  | "PHONE"
  | "EMAIL"
  | "ID_DOC"
  | "WATCHLIST_ENTRY";

type SignalSource =
  | "RULE"
  | "SANCTIONS"
  | "DEVICE"
  | "VELOCITY"
  | "MERCHANT"
  | "MANUAL"
  | "SIMULATOR";

type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
type CaseStatus =
  | "NEW_ALERT"
  | "ENRICHING"
  | "INVESTIGATING"
  | "READY_FOR_REVIEW"
  | "NEEDS_MORE_DATA"
  | "REPORT_DRAFTED"
  | "CLOSED"
  | "ERROR";

type AgentName =
  | "ORCHESTRATOR"
  | "BEHAVIOR"
  | "SANCTIONS"
  | "POLICY"
  | "REPORTER";

type EvidenceKind = "FACT" | "INFERENCE" | "POLICY" | "EXTERNAL_MATCH";
type RecommendationAction =
  | "ALLOW"
  | "STEP_UP"
  | "HOLD"
  | "FREEZE"
  | "ESCALATE"
  | "FILE_SAR";
type ScenarioType =
  | "MULE_RING"
  | "DORMANT_TAKEOVER"
  | "MERCHANT_QR_ABUSE"
  | "WATCHLIST_PAYOUT"
  | "SMURFING";
```

### Core interfaces

```ts
interface Case {
  id: string;
  status: CaseStatus;
  riskLevel: RiskLevel;
  title: string;
  summary: string;
  primaryEntityIds: string[];
  createdAt: string;
}

interface Entity {
  id: string;
  type: EntityType;
  label: string;
  riskFlags: string[];
}

interface EvidenceItem {
  id: string;
  caseId: string;
  agent: AgentName;
  kind: EvidenceKind;
  summary: string;
  confidence: number;
  citations: string[];
}

interface ActionRecommendation {
  caseId: string;
  action: RecommendationAction;
  confidence: number;
  rationale: string;
  requiresHumanApproval: boolean;
}

interface AgentInput {
  caseId: string;
  signals: unknown[];
  entities: Entity[];
  evidence: EvidenceItem[];
  policyVersion: string;
}

interface AgentOutput {
  facts: string[];
  inferences: string[];
  missingInfo: string[];
  recommendedAction?: RecommendationAction;
  confidence: number;
}
```

### Architecture decisions

1. Keep graph storage relational.
   Reason: explicit and fast enough for the hackathon.

2. Put AI behind an orchestrator.
   Reason: one place for retries, logging, fallbacks, and approvals.

3. Make evidence ledger first-class.
   Reason: without provenance, the AI part looks fake and risky.

4. Keep irreversible actions human-gated.
   Reason: demo stays credible and safe.

5. Ship simulator/backtester.
   Reason: this is the clearest gap between old-gen and next-gen tooling.

### Test diagram

| Flow | Proposed files | Test type | Test file | Assertions |
|---|---|---|---|---|
| Seeded alert creates one case | `lib/ingest.ts`, `app/api/cases/route.ts` | integration | `tests/integration/case-ingest.test.ts` | duplicate events collapse into one case |
| Entity resolver links wallet, device, merchant | `lib/graph/resolve.ts` | unit | `tests/unit/entity-resolver.test.ts` | links are deterministic and confidence-scored |
| Agent orchestrator retries malformed output | `lib/agents/orchestrator.ts` | unit | `tests/unit/agent-orchestrator.test.ts` | one retry, then deterministic fallback |
| Policy agent blocks unsafe auto-freeze | `lib/policy/evaluate.ts` | unit | `tests/unit/policy-gate.test.ts` | thin evidence cannot auto-freeze |
| Evidence ledger separates fact from inference | `lib/evidence/ledger.ts` | unit | `tests/unit/evidence-ledger.test.ts` | display model cannot merge categories |
| Workspace shows action, evidence, and uncertainty | `app/page.tsx` or `app/cases/[id]/page.tsx` | e2e | `tests/e2e/investigation-workspace.spec.ts` | user can inspect, approve, export |
| Report draft cites evidence only | `lib/reports/draft.ts` | eval + integration | `evals/report-grounding.jsonl`, `tests/integration/report-draft.test.ts` | unsupported claims are rejected |
| Scenario replay is deterministic by seed | `lib/simulator/run.ts` | unit | `tests/unit/scenario-replay.test.ts` | same seed -> same result |

### Performance review

Likely slow paths:

- graph enrichment per case
- multiple agent calls per opened case
- regenerating narrative on every list refresh

Fix:

- precompute case summaries for the queue
- only run heavy agents when a case is opened or promoted
- cache watchlist and policy reads
- persist agent outputs by case version hash
- do not call the model from list rendering

### Security review

Key risks:

- prompt injection from KYC notes, merchant descriptions, or analyst text
- leakage of PII into logs or model prompts
- unsupported AI claims written into reports
- auto-actions without enough evidence

Controls:

- treat all free text as untrusted evidence
- log structured IDs, not full raw payloads
- keep prompts minimal and grounded on selected evidence
- require human approval for `FREEZE`, `ESCALATE`, and `FILE_SAR`

### Worktree parallelization strategy

| Step | Modules touched | Depends on |
|---|---|---|
| Data + schema layer | `lib/ingest`, `lib/graph`, DB schema | none |
| Agent + policy layer | `lib/agents`, `lib/policy`, `lib/reports` | schema |
| UI workspace + simulator | `app`, components, seeded data | schema, stable API contracts |

Parallelization note:
- three clean workstreams after schema lock

### Eng DUAL VOICES - CONSENSUS TABLE

| Dimension | Codex | Claude subagent | Consensus |
|---|---|---|---|
| Single app is better than microservices here | Yes | N/A | single-voice: approve |
| Relational graph beats separate graph DB for MVP | Yes | N/A | single-voice: approve |
| Human approval required for high-risk actions | Yes | N/A | single-voice: approve |
| Replay lab should stay in scope | Yes | N/A | single-voice: approve |
| AI-only narrative without evidence ledger is acceptable | No | N/A | single-voice: reject |
| Queue render may call agents directly | No | N/A | single-voice: reject |

## DX Review

### Product type

Internal operations app with light developer-facing configuration.

### Developer journey map

| Stage | Desired result |
|---|---|
| 1. Clone | repo opens with one obvious entrypoint |
| 2. Install | one package manager command |
| 3. Configure | copy one env example or use defaults |
| 4. Seed | one command loads fake cases and replay scenarios |
| 5. Run | local app starts and opens a ready case |
| 6. Inspect | one click shows evidence + action + report draft |
| 7. Change policy | edit one JSON or TS config file |
| 8. Replay | rerun a scenario and compare output |
| 9. Demo | export one report and walk through one case |

### Developer empathy narrative

I should be able to clone the repo, run one command, and immediately see a fake case that already tells a story. I should not need to wire five APIs before the app feels alive. If I change a policy threshold or scenario seed, I should see the effect fast. If something breaks, the error should tell me exactly whether the problem is seed data, policy config, or model output.

### TTHW assessment

- current implied TTHW: 20-30 minutes because there is no real app flow yet
- target TTHW: under 6 minutes

### DX scorecard

| Dimension | Score | Prior | Trend |
|---|---|---|---|
| Getting Started | 6/10 | 3/10 | up |
| API/CLI/SDK | 7/10 | 4/10 | up |
| Error Messages | 7/10 | 3/10 | up |
| Documentation | 7/10 | 4/10 | up |
| Upgrade Path | 6/10 | 4/10 | up |
| Dev Environment | 8/10 | 5/10 | up |
| Community | 5/10 | 3/10 | up |
| DX Measurement | 5/10 | 2/10 | up |

Overall DX:
- `6.4/10`

Competitive rank:
- `Competitive for a hackathon repo, not champion-tier`

Magical moment:
- `run seed + open a case + replay a scenario in under 6 minutes`

### DX implementation checklist

- [ ] one install command
- [ ] one seed command
- [ ] one run command
- [ ] first page loads with seeded cases
- [ ] one obvious demo path
- [ ] policy config lives in one file
- [ ] every error message includes problem + cause + fix
- [ ] replay scenario is deterministic by seed
- [ ] report export works offline with fake data

### DX DUAL VOICES - CONSENSUS TABLE

| Dimension | Codex | Claude subagent | Consensus |
|---|---|---|---|
| TTHW must be under 6 minutes | Yes | N/A | single-voice: approve |
| Seeded data should be first-class | Yes | N/A | single-voice: approve |
| Policy config should be one obvious file | Yes | N/A | single-voice: approve |
| Hidden env complexity is acceptable | No | N/A | single-voice: reject |
| Error messages need cause + fix | Yes | N/A | single-voice: approve |
| Multi-service dev setup is acceptable | No | N/A | single-voice: reject |

## Cross-Phase Themes

1. Do not rebuild what TNG or Ant likely already has.
2. Facts, inferences, and actions must be separate.
3. Human approval is part of the product, not a hackathon compromise.
4. Replay/simulation is the sharpest differentiator.
5. Local wallet abuse patterns matter more than generic fintech abstractions.

## Stale Diagram Audit

- `README.md`: no ASCII diagrams to audit
- `index.html`: no ASCII diagrams to audit

## Recommended Demo Script

1. Open the queue and show the highest-risk case.
2. Click into the case and show entity graph + evidence timeline.
3. Show three agents agreeing or disagreeing on the next step.
4. Show the policy reason for `HOLD` or `ESCALATE`.
5. Export the case note or SAR-style draft.
6. Switch to Scenario Lab and replay the `watchlist-payout` threshold tradeoff first.
7. Change one threshold or policy value and rerun.
8. If there is still time, show a second scenario such as `dormant-wallet takeover` or `merchant / mule-ring abuse`.

## CTO And Mentor Questions

Ask these in order. Stop when you get a strong answer.

1. If we build above your existing controls instead of replacing them, where is the biggest pain today: alert triage, evidence gathering, action approval, SAR drafting, or policy tuning?
2. For this hackathon, which feels more real to you: a better analyst decision workspace, or a customer-facing scam intervention right before payout?
3. Which single abuse pattern should we make the hero case if we want it to feel closest to TNG reality: dormant-wallet takeover, mule-ring collection, merchant QR abuse, near-watchlist cross-border payout, or onboarding synthetic identity?
4. When you hear "meaningful AI" here, what do you actually want to see beyond summarization: evidence linking, action recommendation, policy reasoning, report drafting, or replay?
5. What would make the multi-cloud split feel purposeful instead of cosmetic to you?
6. If the system recommends `hold`, `step-up`, or `escalate`, what evidence would you need to trust that recommendation?
7. If we only get one "whoa" moment in four minutes, should it be the live case investigation or the replay lab?
8. If this were piloted on Monday with fake data removed, what is the narrowest workflow you would actually test first?

## Submission And Demo Readiness

1. In under 4 minutes, a judge must see one case move from signal to evidence to action to exported note.
2. The AI story must be clear: separate agents, grounded evidence, explicit uncertainty, human approval.
3. The track fit must be obvious: the system stops or challenges risky money movement before release.
4. The multi-cloud split must be explainable in one sentence and one diagram.
5. One replay scenario must show a real tradeoff: more bad payouts stopped versus more normal users delayed.
6. The repo must be public-safe, easy to run, and free of leaked credentials.

Judges get the product through:

1. one public web URL
2. one public GitHub repo
3. one pitch deck link
4. one short demo video

For the build:

1. host the app and seeded data on one cloud in a way you can demo reliably
2. place AI or replay on the second cloud for a real architecture reason
3. keep deployment boring, manual if necessary, but repeatable
4. record a backup walkthrough so a network problem does not kill the pitch

## Post-MVP Backlog

### P1 - Customer rescue workflow

What:

- Add a step-up flow for suspected scam victims before irreversible transfers.

Why next:

- This is the strongest product expansion after the internal analyst workspace.
- Detection alone does not stop authorized push-payment scams.

Pros:

- stronger user impact story
- makes the "before money leaves" promise visible to non-ops judges and buyers

Cons:

- much more product surface
- false positives can annoy users

Context:

- Keep this out of the hackathon MVP.
- The right next step is a thin intervention surface with plain-language explanations, a delay option, and a safe escalation path.

Depends on:

- reliable confidence thresholds
- approval policy from compliance

### P1 - Production watchlist adapters

What:

- Replace fake watchlist hits with provider adapters and cached result handling.

Why next:

- The MVP can demo the workflow, but a production story needs real screening inputs.
- Screening should stay one signal inside the investigation layer, not become the whole product again.

Pros:

- makes the product credible beyond the hackathon
- unlocks real sanctions and PEP coverage

Cons:

- vendor integration work
- more edge cases around rate limits, stale data, and normalization

Context:

- The current hackathon plan is right.
- The production version needs adapter boundaries so the graph and agent stack do not care which provider supplied the match.

Depends on:

- stable `SignalSource` schema
- adapter interface design

### P1 - Analyst feedback learning loop

What:

- Capture analyst overrides and feed them back into prompts, policies, and scenario design.

Why next:

- Without feedback, the agents stay static.
- Local fit to TNG-specific abuse patterns will matter more than generic vendor playbooks.

Pros:

- continuous improvement
- better local fit for TNG-specific abuse patterns

Cons:

- requires careful label quality
- can turn into noisy feedback plumbing

Context:

- The MVP already has human approvals.
- The next move is to log why analysts changed the recommendation, then use that data in weekly prompt and policy reviews.

Depends on:

- action approval events
- evidence ledger stability

### P2 - Cross-border remittance pack

What:

- Add remittance-specific entities, scenarios, and policy templates.

Why later:

- Cross-border is a strong wedge, but the base wallet, beneficiary, device, and policy graph has to be stable first.

Pros:

- wider coverage
- stronger compliance story

Cons:

- more domain complexity
- larger seeded data surface

Context:

- The current MVP focuses on wallet, merchant, device, and beneficiary patterns.
- Remittance should be a second vertical after the base graph is stable.

Depends on:

- base entity graph
- policy templating

### P3 - Policy compiler and versioning UI

What:

- Turn policy JSON into readable rules with version history, diffing, and replay outputs.

Why later:

- It is strong governance tooling, but it is not ahead of the core decision loop.

Pros:

- strong governance story
- easier handoff between product, ops, and compliance

Cons:

- more UI and state management
- adds work outside the MVP's core loop

Context:

- The MVP can keep policies in one file and show the active version.
- A later version should let users compare `before/after` impact across scenarios.

Depends on:

- scenario runner
- stable policy schema

## Decision Audit Trail

| # | Phase | Decision | Classification | Principle | Rationale | Rejected |
|---|---|---|---|---|---|---|
| 1 | Phase 0 | Use `SELECTIVE_EXPANSION` mode | Taste | P3 | User asked for next-gen thinking without losing hackathon feasibility | HOLD, EXPANSION |
| 2 | CEO | Replace `sanctions screener` framing with `agentic investigation layer` | User Challenge | P1 | More complete and more differentiated | generic screener |
| 3 | CEO | Build above TNG controls, not against them | Mechanical | P4 | Reuse beats duplicate | new auth / raw rules engine |
| 4 | CEO | Keep internal analyst as primary user | Mechanical | P3 | Clearest fit to the track and demo | consumer-first rescue app |
| 5 | CEO | Keep replay lab in MVP | Taste | P2 | Highest-value expansion inside the blast radius | defer replay entirely |
| 6 | Design | Move from queue UI to mission-control workspace | Taste | P5 | Clearer, more explicit action flow | list-first dashboard |
| 7 | Design | Separate facts from AI inference visually | Mechanical | P1 | Trust and auditability depend on it | mixed narrative blocks |
| 8 | Eng | Use one app + relational graph tables | Mechanical | P5 | Obvious, fast, low-risk | microservices, graph DB |
| 9 | Eng | Add evidence ledger as core data model | Mechanical | P1 | Needed for reports, audit, and UX trust | freeform summaries only |
| 10 | Eng | Require human approval for high-risk actions | Mechanical | P1 | Completeness and safety | full autonomous enforcement |
| 11 | DX | Optimize for seeded local demo in under 6 minutes | Mechanical | P5 | Fewer steps, better demo reliability | integration-heavy setup |
| 12 | DX | Keep policy config in one obvious file | Mechanical | P5 | New contributor can change behavior fast | scattered config |

## Completion Summary

### Review scores

- CEO: strong direction locked; biggest change is the product framing
- Design: `5/10 -> 8.6/10`
- Eng: solid MVP architecture; `0` critical gaps after redesign
- DX: `6.4/10`, acceptable for hackathon, needs tight setup path

### Final call

Build this:
- `AI-native financial crime investigation workspace with evidence graph, action engine, report draft, and replay lab`

Do not build this:
- `another fraud queue with a nicer skin`

### Next implementation slices

1. hero case + seeded data + case ingest path
2. workspace UI + facts vs inferences + action rail
3. evidence graph + orchestrator + grounded recommendation
4. note export + replay lab + multi-cloud proof
