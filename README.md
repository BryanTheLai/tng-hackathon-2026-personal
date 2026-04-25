# TNG RiskOps Agent

## Current Call

- Track: `Security & Fraud`
- Product: `AI-native pre-payout decision workspace for fraud + AML ops`
- Hero replay: `watchlist-payout`, the watchlist threshold tradeoff replay
- Wedge: `evidence graph + specialist agents + human action rail + replay lab`

One-line pitch:

`TNG RiskOps Agent turns fraud and AML alerts into evidence-backed pre-payout decisions, export-ready case notes, and replayable policy tradeoffs.`

This repo is past ideation.

Do not build:

- another flat alert queue
- a generic AML screening homepage
- a black-box score with no evidence
- a graph tab with no action
- multi-cloud theater

## Build Order

Build in this order. Stop adding scope when the earlier item is still weak.

1. End-to-end hero case that ends in a visible pre-payout action.
   Build: seeded alert -> evidence -> recommendation -> human `hold`, `step-up`, or `escalate` -> export note.
   Why: if the case never reaches a decision, the product story fails.
2. One-screen investigation workspace.
   Build: facts, AI inferences, evidence timeline, linked entities, triggered controls, missing info, analyst notes, action rail.
   Why: this is the core fraud-ops pain.
3. Evidence-backed recommendation with human approval.
   Build: specialist agents, policy citations, confidence, rationale, and grounded note drafting.
   Why: this is the cleanest AI story and the most believable one.
4. Purposeful multi-cloud split.
   Build: app and seeded data on one cloud, AI or replay on the second cloud, with one sentence judges can remember.
   Why: it is a hard judging requirement.
5. Replay lab for one policy tradeoff.
   Build: current threshold, stricter threshold, caught bad payments, delayed good payments.
   Why: it is the sharpest differentiator and something real fraud ops teams want.
6. Queue ranking and one backup case.
   Build: reason chips, risk level, next action, second scenario for Q&A.
   Why: good realism, but not before the hero case works.
7. Thin customer step-up moment only if the first six are solid.
   Why: it helps the "before money leaves" story, but it is easy to overscope.

## Immediate Decisions

1. Keep `Security & Fraud` unless the CTO gives a very strong reason to switch.
2. Ask whether the hero case should stay `cross-border near-watchlist payout` or move to `dormant-wallet takeover`, `merchant QR abuse`, or `mule-ring collection`.
3. Lock the multi-cloud split in one sentence and repeat that exact sentence in the deck and demo.
4. Decide whether to stay internal-only or show one thin customer step-up moment after `hold` or `ask for more proof`.

## Read Order

Read the repo in this order. Each file has one job.

1. [README.md](/C:/Users/wbrya/OneDrive/Documents/GitHub/tng-hackathon-2026-personal/README.md:1)
   Use for: current call, build order, doc map.
2. [AUTOPLAN_NEXTGEN_RISK_OPS_PLAN.md](/C:/Users/wbrya/OneDrive/Documents/GitHub/tng-hackathon-2026-personal/AUTOPLAN_NEXTGEN_RISK_OPS_PLAN.md:1)
   Use for: MVP scope, architecture, design contract, risk plan, demo plan, CTO questions, post-MVP backlog.
3. [FRAUD_OPS_MARKET_RESEARCH_2026-04-25.md](/C:/Users/wbrya/OneDrive/Documents/GitHub/tng-hackathon-2026-personal/FRAUD_OPS_MARKET_RESEARCH_2026-04-25.md:1)
   Use for: vendor map, feature taxonomy, what real fraud ops teams want.
4. [tng-doc-by-shiwei.md](/C:/Users/wbrya/OneDrive/Documents/GitHub/tng-hackathon-2026-personal/tng-doc-by-shiwei.md:1)
   Use for: event rules, judging, schedule, logistics, submission checklist.

## Repo Hygiene

- Keep all data synthetic.
- Do not publish the current `.env` contents as-is.
- If this repo goes public, scrub secrets first and treat it as judge-facing.

## Reusable Inputs

- [Fraud notes 1](https://www.bryanslab.com/blogs/fraud-2/)
- [Fraud notes 2](https://www.bryanslab.com/blogs/fraud-ml/)

## Seed Data References

- [IBM AMLSim example dataset](https://www.kaggle.com/datasets/anshankul/ibm-amlsim-example-dataset/data?select=alerts.csv)
- [Fraudulent transactions dataset](https://www.kaggle.com/datasets/chitwanmanchanda/fraudulent-transactions-data)
