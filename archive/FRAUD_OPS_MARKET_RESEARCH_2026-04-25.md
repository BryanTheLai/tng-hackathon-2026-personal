# Fraud Ops Market Research: Unit21-Like Platforms

Research date: 2026-04-25
Repo: `tng-hackathon-2026-personal`
Focus: `Security & Fraud`
Method: official vendor product pages, product docs, vendor case studies, the Unit21 screenshots you provided, and repo context.

## Executive Summary

This market is not really about "fraud detection startups."

It is about fraud and AML operating systems:

- detection and routing
- investigation and case work
- actioning and approvals
- reporting and audit
- safe tuning
- AI inside the ops loop

Unit21 is the right anchor because it sits in the middle of that stack. It is not only a model vendor and not only a sanctions vendor. It is a rule, alert, graph, case, action, and investigation product.

The market is converging around a common stack:

1. real-time detection and scoring
2. no-code rule and workflow management
3. alert prioritization and routing
4. entity and network investigation
5. case management with audit trails
6. AML, sanctions, or screening add-ons, often inside a FRAML frame
7. AI that reduces manual review, drafts notes, and recommends next steps

What real fraud ops teams want is much narrower than vendor marketing:

- fewer false positives
- faster triage
- one screen with the whole case
- controls they can change themselves
- safe testing before rollout
- graph linkage that changes action
- immediate actions like `hold`, `step-up`, `escalate`, `freeze`, or export
- regulator-ready notes and audit trails

Decision pullout for TNG:

- do not build another dashboard
- do not lead with AML screening
- do not pitch a black-box score
- do build the pre-payout decision workspace above existing controls

## Scope

This memo is intentionally focused on the current vendor cluster most relevant to a TNG `Security & Fraud` build:

- Unit21
- Sardine
- Hawk
- Feedzai
- Flagright
- ComplyAdvantage
- SEON
- DataVisor
- Alloy
- Oscilar
- Sift
- Featurespace

Adjacent players also worth noting:

- Lucinity
- Tookitaki
- Effectiv / Socure RiskOS

This is not every company touching risk, identity, KYC, cybersecurity, or trust and safety. It is the most relevant set for a `Unit21-like` fraud ops product thesis.

## What "Unit21-like" Actually Means

A Unit21-like product is not one thing. It is a stack.

### Layer 1: Detection and control plane

- rules
- thresholds
- matchlists
- device and behavior signals
- risk scores
- transaction monitoring
- watchlist and sanctions screening
- alert scoring
- backtesting or sandboxing

### Layer 2: Investigation and operations plane

- queues
- assignments
- entity resolution
- graph and network analysis
- case notes
- evidence collection
- collaboration
- QA workflows
- escalations
- action buttons

### Layer 3: Compliance and audit plane

- SAR / STR / CTR narratives
- regulatory filing
- audit logs
- explainability
- policy mapping
- 4-eye review
- approval tracking

### Layer 4: AI layer

- AI rule generation
- AI triage
- AI summaries
- AI alert prioritization
- AI investigation prep
- AI narrative drafting
- AI rule optimization

The most important market pattern in 2026 is that the best vendors do not sell AI as a magic fraud oracle. They sell AI as leverage inside the ops loop.

## What the Unit21 Screenshots Show

Your screenshots are useful because they show the actual operator surface, not just homepage copy.

### Observed Unit21 features from the screenshots

- Detection modeling dashboard with deployed models, alert review rate, and flagged amount.
- Graph-based rule/scenario builder where entities can be linked by shared attributes.
- Shared-attribute graph rules across IP address, phone number, email, instrument, client fingerprint, SSN, name fields, date of birth, physical ID, geolocation, and bank account.
- Dynamic rule builder with named variables and trigger conditions.
- Transaction rule builder with standard threshold conditions like amount and sender risk score.
- Matchlist-based screening logic such as `ip_address is in High Risk Countries`.
- Relative or baseline rules like amount greater than a percentage of average amount over a trailing time window.
- Alert summary page with status, disposition, assignments, workflow actions, and flagged entities.
- Network analysis graph centered on linked entities, not isolated alerts.
- Alert score explanation with variable-level contribution bars.
- Analyst action rail with actions like `Clear - False Positive`, `Close - No Decision`, `Confirm - True Positive`, `Create Case`, `Escalate to L2`, and `Suspend Customer`.
- AI-assisted rule authoring and explanation panels in later dark-theme screenshots.
- AI-generated rule descriptions and recommendations.
- Variable editor for aggregation logic like number of unique counterparties over a time window.

### Why these screenshots matter

They show what ops software looks like when it is actually built for investigators:

- controls and investigations in the same product
- graph and scoring tied to analyst decisions
- case actions next to evidence
- rules that are editable by risk teams
- AI positioned as a helper to author, explain, or accelerate, not as a mysterious black box

That is a much stronger product reference than generic "fraud AI" marketing.

## Company Deep Dives

## 1. Unit21

### Positioning

Unit21 positions itself as an `agentic AI platform for fraud and AML operations`, not just a monitoring engine.

### Verified features

- Unified fraud and AML platform.
- AI agents for detection and investigation.
- Real-time monitoring.
- AML transaction monitoring.
- sanction screening
- case management
- regulatory filing
- customer risk rating
- payment screening
- fraud consortium
- device intelligence
- connected data model and entity networks
- alert scoring trained from prior dispositions
- queue prioritization and experience-based routing

### Why operators care

- Alert scoring maps directly to queue prioritization and staffing.
- AI is framed around L1 triage, evidence gathering, and narrative drafting, which is actual ops work.
- Fraud and AML live in one system instead of separate dashboards.

### Best parts to steal

- end-to-end investigation, not just detection
- connected entity model
- alert scoring with clear operational use
- action rail close to the case

### Watchouts

- "agentic" can become hand-wavey if not tied to evidence and human approval
- screenshots show more product reality than the homepage does

## 2. Sardine

### Positioning

Sardine is building a very strong unified risk platform that combines fraud, AML, device intelligence, graph investigation, rules, and case management.

### Verified features

- no-code rules engine
- natural language rule writing
- hundreds of prebuilt fraud and AML rules
- 12,000+ ML risk features for rules
- backtesting, shadow mode, and A/B testing
- anomaly engine with rule suggestions
- case management
- configurable queues
- auto-assignment and SLA tracking
- AI agents for triage, summaries, research, and SAR drafting
- graph analyst, OSINT, transaction monitoring, and due diligence agents
- fraud investigation workspace across users, devices, counterparties, and transactions
- live connections graph
- transaction monitoring with prebuilt AML rule library
- counterparty screening and jurisdiction controls

### Why operators care

- This is one of the clearest examples of a platform where the people closest to the risk can change controls themselves.
- Graph, device, fraud, AML, and case work all meet in one place.
- Shadow mode and backtesting are exactly what mature fraud ops teams want before turning on a new rule.

### Best parts to steal

- build-test-deploy rules loop
- graph that is directly connected to investigations
- configurable queues and AI summaries
- AML + fraud convergence with network-level context

### Watchouts

- Sardine spans a lot of surfaces; copying the whole platform would overscope a hackathon

## 3. Hawk

### Positioning

Hawk is a modern FRAML platform with strong explainability, transaction fraud coverage, AML monitoring, and payment screening.

### Verified features

- self-serve rules
- explainable AI
- AI precision and anomaly detection
- alert prioritization
- investigation guidance
- unified cross-rail fraud monitoring
- 150 ms payment fraud and payment screening
- rail-agnostic API
- payment interdiction with block, hold, release
- sandbox testing
- AML typology coverage like structuring, layering, smurfing
- 4-eye review and model approval
- integrated SAR / CTR filing
- payment screening with past decision recall
- fuzzy matching tuning
- unified sanctions hit view
- multi-tenancy and regional controls

### Why operators care

- Real-time payments and cross-rail support are a big deal for wallet and bank environments.
- Hawk emphasizes explainability, investigator speed, and false positive reduction instead of only detection rate.
- Payment interdiction is an actual action layer, not just alerting.

### Best parts to steal

- payment-focused actioning
- explainable AI language
- unified risk profile
- built-in governance like 4-eye review

### Watchouts

- Hawk is strongest when the buyer is already thinking in payment rails and compliance workflows

## 4. Feedzai

### Positioning

Feedzai is a large, AI-heavy financial crime platform with strong behavioral modeling and real-time scoring.

### Verified features

- RiskOps framing across fraud and financial crime
- real-time AI risk scoring
- behavioral and device intelligence
- `segment-of-one` behavior baselines
- whitebox explanations
- responsible AI controls
- alert prioritization
- self-service data science studio for model creation/testing
- AutoML
- typology-agnostic fraud detection across many rails and fraud types
- transaction screening with real-time sanctions context and explainability

### Why operators care

- Feedzai is strongest where behavior baselines, model depth, and explainability matter.
- It speaks more to advanced risk teams than to a lightweight startup ops team.

### Best parts to steal

- individualized behavior baselines
- plain-language explanations
- fraud/scam/AML convergence under one risk-ops frame

### Watchouts

- The public product story is more analytics-heavy than queue-and-case-workflow-heavy.
- For a hackathon, this is inspiration for the intelligence layer more than the UI.

## 5. Flagright

### Positioning

Flagright is pushing hard on AI-native fincrime operations with strong no-code, simulator, case management, and screening language.

### Verified features

- AI-native case management
- configurable AI agents
- risk scores, triggered rules, transactions, and AI insights in one case
- SAR generation and GoAML coverage in 33 countries
- audit logs
- comments, tagging, collaboration
- QA workflows and checklists
- role-based access control
- entity linking and transactional flow mapping
- AI risk scoring
- shadow rules
- simulator for historical rule testing
- watchlist screening with configurable false positive suppression
- AI forensics for alert context gathering

### Why operators care

- Simulator, shadow rules, and QA are extremely operator-centric features.
- The product story is close to "control room for investigators" rather than "ML box."

### Best parts to steal

- rule simulator
- QA checklists
- collaborative case workflow
- AI narrative drafting

### Watchouts

- Some ROI numbers are very aggressive; treat them as vendor claims, not neutral benchmarks

## 6. ComplyAdvantage

### Positioning

ComplyAdvantage is strongest on sanctions, watchlists, screening data, and increasingly agentic workflows.

### Verified features

- unified financial crime risk platform
- proprietary risk intelligence
- agentic workflows
- payment screening
- sanctions and watchlists
- alerts muting
- single-screen alert context
- case notes and audit logs
- flexible configurations
- custom lists
- fast data refresh
- profiles that merge sanctions, PEPs, watchlists, and adverse media

### Why operators care

- This is a data-and-screening-first platform, but it shows very clearly what payment screening teams need:
- fewer alerts
- richer context
- single consolidated view
- case notes
- real-time updates

### Best parts to steal

- consolidated screening profile
- alert muting and workflow hygiene
- role-based understanding of what compliance officers, team leads, and analysts each need

### Watchouts

- Less compelling than Unit21 or Sardine if your main wedge is fraud ops workflow and graph investigation

## 7. SEON

### Positioning

SEON is one of the clearest fraud-first platforms evolving into a broader fraud + AML command center.

### Verified features

- 900+ first-party signals
- device intelligence
- behavioral biometrics
- digital footprint data
- AI scoring
- payment screening
- transaction monitoring
- case management
- SAR / STR / Form 8300 autofill and direct filing to FinCEN
- AI summaries
- score explainability
- AML screening agent
- network analysis across shared devices, IPs, emails
- AI rule and filter generation
- daily retraining from labels
- alert auto-assignment
- checklists
- audit trails
- graph and clone search style investigation tools
- rule engine and strong device-intelligence docs

### Why operators care

- SEON gets unusually specific about the operational pain: spreadsheets, siloed tools, backlog, and slow manual reporting.
- The docs are strong and show real operational surfaces.
- Fraud analysts repeatedly praise rule flexibility and ease of setup.

### Best parts to steal

- device and digital footprint richness
- AI summary plus score explainability
- direct reporting workflow
- practical, analyst-friendly rule authoring

### Watchouts

- SEON is broader than payments-only fraud ops; choose the parts that fit TNG

## 8. DataVisor

### Positioning

DataVisor is strongest where ring detection, unsupervised learning, knowledge graph, and fraud + AML convergence matter.

### Verified features

- unified FRAML platform
- ensemble AI with supervised, unsupervised, rules, graph, and agents
- case management plus insight center
- knowledge graph linking
- consortium intelligence
- alert prioritization and smart routing
- AI triage
- AI rule tuning
- SAR / CTR generation
- real-time monitoring across ACH, wire, card, loan, check, and crypto
- device intelligence and behavioral biometrics
- multi-tenant cloud-native architecture
- group-level and network-level investigations

### Why operators care

- DataVisor is very strong on "stop thinking case by case when the fraud is really a ring."
- The case study language is unusually good for fraud ops:
- cluster-level decisions
- unified cases
- whole-network escalation

### Best parts to steal

- ring-level workflow
- knowledge graph embedded in case management
- unsupervised detection as a signal generator, not the whole UX

### Watchouts

- Strong research-heavy product story can become less demo-friendly if not turned into a simple case workflow

## 9. Alloy

### Positioning

Alloy is more identity-centric than Unit21, but it matters because it pushes fraud ops upstream into onboarding and ongoing lifecycle monitoring.

### Verified features

- identity and fraud prevention platform
- onboarding orchestration
- ongoing monitoring across transactions and non-monetary events
- evolving customer risk profiles
- case management
- SAR filing
- no-code rules
- scenario simulation and testing
- step-up authentication
- action layer like freeze/unfreeze
- predictive models like Fraud Signal
- portfolio attack detection with Fraud Attack Radar
- AI assistant for investigations, watchlist triage, KYB/KYC research, and policy optimization

### Why operators care

- It shows how identity context can make downstream fraud ops much better.
- Ongoing monitoring tied to onboarding data is highly relevant for wallet abuse, mule accounts, and ATO.

### Best parts to steal

- identity-centric risk profiles
- coordinated attack detection
- portfolio safe-mode controls
- friction-right step-up design

### Watchouts

- The center of gravity is broader identity decisioning, not purely fraud ops investigation UI

## 10. Oscilar

### Positioning

Oscilar is an AI-native risk decisioning platform with a very strong "risk ops copilot" angle.

### Verified features

- unified risk stack
- 80+ integrations
- device and behavioral intelligence
- natural language workflow and rules creation
- no-code and low-code interface
- backtests and A/B tests
- case management
- intelligent queues
- bulk operations
- prioritization models
- AI case summaries
- KPI cards and visual insights
- graph / visual network analysis
- AI-generated narratives and SAR reports
- agentic AI with human-in-the-loop
- rule recommendation agent
- AML alert triage
- explainability trails

### Why operators care

- Oscilar is very operator-oriented in its language:
- queues
- summaries
- bulk ops
- prioritization
- AI workflow copilot

### Best parts to steal

- natural language workflow generation
- case queue prioritization
- clear human-in-the-loop framing
- visual insights directly inside case management

### Watchouts

- Strong AI-first messaging needs concrete evidence display to feel trustworthy in a regulated context

## 11. Sift

### Positioning

Sift is more digital fraud / trust-and-safety than AML, but it matters because it shows what lean fraud teams want in workflow automation.

### Verified features

- global data network
- risk scoring
- workflows
- case management and reporting
- review queues
- decisions connected to backend actions
- payment protection
- account defense
- dispute management
- score threshold workflows
- waterfall logic
- workflow metrics and route metrics

### Why operators care

- Sift is explicit about keeping review queues manageable.
- It treats fraud ops as a routing and action problem, not just a model problem.
- The decisions-to-backend-actions pattern is extremely relevant for a pre-payout TNG flow.

### Best parts to steal

- workflows as real business actions
- queue volume discipline
- route metrics and monitoring

### Watchouts

- Less relevant than FRAML vendors if you want sanctions, AML, or SAR narratives

## 12. Featurespace

### Positioning

Featurespace is strongest on adaptive behavioral analytics and FRAML convergence.

### Verified features

- ARIC Risk Hub
- adaptive behavioral analytics
- real-time anomaly detection
- FRAML solution
- day-1 rules and models
- alert handling with automation
- case management
- reporting and SAR workflow
- unified fraud and financial crime view
- multi-tenancy / white label

### Why operators care

- Behavior baselining and adaptive analytics are still a powerful core for scam, mule, and payment abuse detection.
- It is more of an analytics engine plus workflow than a startup-style ops console.

### Best parts to steal

- investigate the risk, not just the alert
- unified workflow from alert to SAR
- adaptive behavior baselines

### Watchouts

- Public product storytelling is more incumbent-style and less immediately tangible than Unit21/Sardine/SEON

## Adjacent Players Worth Watching

## Lucinity

- Strong on AML case management, Customer 360, workflow configuration, Luci AI agent, and regulatory reporting.
- Very relevant if you care about human-centered AML investigations more than payment fraud detection.

## Tookitaki

- Strong on transaction monitoring, scenario marketplace, alert prioritization, centralized case manager, and unified AML/fraud workspace.
- Relevant if you care about typology coverage and alert consolidation.

## Effectiv / Socure RiskOS

- Strong on no-code risk decisioning, device intelligence, case management, SAR filing, and workflow-driven manual review queues.
- Relevant for orchestration-heavy teams.

## Cross-Vendor Feature Taxonomy

| Feature | Seen strongly in | Why it matters to fraud ops |
|---|---|---|
| No-code rules and workflows | Unit21, Sardine, Hawk, Flagright, SEON, Alloy, Oscilar, Sift, Effectiv | Fraud teams need to move without engineering tickets. |
| Backtesting / shadow / sandbox | Sardine, Hawk, Flagright, Alloy, Oscilar, SEON docs, Unit21 screenshots | Operators need safe experimentation before production. |
| Alert scoring / prioritization | Unit21, Feedzai, Hawk, DataVisor, Oscilar | Review capacity is finite; ranking is operationally load-bearing. |
| Graph / network analysis | Unit21, Sardine, SEON, DataVisor, Flagright, Oscilar | Most serious fraud is ring or network behavior, not isolated events. |
| Device / behavior intelligence | Unit21, Sardine, Feedzai, SEON, DataVisor, Alloy, Oscilar | Useful for ATO, mule abuse, synthetic behavior, and scam context. |
| Unified fraud + AML case management | Unit21, Sardine, Hawk, Flagright, SEON, DataVisor, Featurespace, Tookitaki, Lucinity | Fraud and AML converge in real teams when money movement is suspicious. |
| Screening / sanctions / watchlists | Unit21, Sardine, Hawk, ComplyAdvantage, Flagright, SEON, Alloy, Tookitaki | Needed for cross-border, AML, and payout risk. |
| Audit trail / explainability | Unit21, Hawk, Feedzai, Flagright, ComplyAdvantage, SEON, Alloy, Oscilar | Analysts and regulators need defensible decisions. |
| SAR / STR / CTR drafting or filing | Unit21, Sardine, Hawk, Flagright, SEON, DataVisor, Alloy, Tookitaki, Lucinity | This is real analyst work, not a side feature. |
| AI triage / summaries / research | Unit21, Sardine, Flagright, SEON, Alloy, Oscilar, DataVisor, Lucinity | Good use of AI because it compresses manual ops effort. |
| AI rule generation / recommendations | Unit21 screenshots, Sardine, SEON, Oscilar, Effectiv | Useful when it remains editable and testable. |
| Bulk ops / queue ops / routing | Unit21 screenshots, Sardine, Flagright, SEON, Oscilar, Sift, Socure RiskOS | Real ops teams need workload management, not just individual views. |
| Action layer | Unit21 screenshots, Hawk, Alloy, Sift | A system that can only alert is weaker than one that can hold, step-up, or route action. |

## What Actual Fraud Ops Teams Want

This is the important section.

The clearest operator signal across the market is that fraud ops teams do not want "more AI." They want less waste.

### Tier 1: Hard operational needs

#### 1. Fewer false positives

This is the single loudest theme across almost every vendor.

Why:

- false positives waste analyst time
- good customers get blocked
- queues become unmanageable
- noisy systems hide true risk

Evidence:

- Unit21 alert scoring is explicitly about prioritizing investigator time and reducing false-positive burden.
- Hawk, Flagright, Feedzai, and ComplyAdvantage all push false-positive reduction as a core value prop.
- Sift talks directly about keeping review queues manageable.

#### 2. One place to see the whole case

Fraud ops teams hate swivel-chair investigations.

They want:

- transactions
- customer profile
- device history
- network links
- triggered rules
- past decisions
- notes
- watchlist results
- activity timeline

all in one screen.

This is repeated across Unit21, Sardine, Hawk, Flagright, SEON, Alloy, DataVisor, and Lucinity.

#### 3. Rules they can change themselves

Real teams do not want to wait for:

- engineering sprints
- vendor support tickets
- SQL changes
- model deployment cycles

They want:

- no-code builders
- editable thresholds
- templates
- natural language shortcuts
- test environments

This is why the best modern vendors emphasize self-serve rules, workflows, and sandbox testing.

#### 4. Safe testing before rollout

Mature ops teams want to know:

- how much volume a rule will fire
- what precision/recall tradeoff it introduces
- whether it hits good customers
- whether it creates alert floods

This is why shadow mode, simulation, A/B testing, and backtesting matter so much.

#### 5. Graph and entity linkage that changes action

A graph by itself is not enough.

Ops teams want graph tools that help them:

- merge related alerts
- see mule rings
- link shared devices/IPs/emails
- act on a whole network
- escalate unified cases

DataVisor is especially strong here because its case studies explicitly describe moving from isolated alerts to cluster-level decisions.

#### 6. Clear next actions

Investigators do not want to end on "risk score = 83."

They want the system to support decisions like:

- allow
- watch
- step-up
- hold
- freeze
- suspend
- escalate
- file SAR
- create case
- close as false positive

The Unit21 screenshots are especially good evidence here.

#### 7. Audit trail and regulator-ready output

Any serious fraud/AML ops stack eventually needs:

- notes
- evidence trail
- case history
- filed report history
- rationale
- QA
- approvals

This is why case management, SAR drafting, and audit logs show up almost everywhere.

#### 8. Team workflow controls

Operators want more than a case view. They want:

- assignment
- queue segmentation
- auto-routing
- SLAs
- workload balancing
- checklists
- QA sampling
- 4-eye review

This is ops software, not just detection software.

### Tier 2: Strong wants

#### 1. AI for repetitive work

The strongest AI use cases in this market are:

- alert triage
- evidence gathering
- entity research
- case summaries
- narrative drafting
- rule suggestions

These are strong because they compress manual work without removing the human decision maker.

#### 2. Identity + behavior + transaction context together

Alloy, SEON, Sardine, Feedzai, and Oscilar all emphasize that transactions alone are not enough.

This matters for:

- account takeover
- scam intervention
- mule behavior
- synthetic IDs
- payout abuse

#### 3. Feedback loops

Good fraud ops teams want the platform to learn from:

- labels
- dispositions
- closed cases
- rule outcomes

This shows up in Unit21, SEON, DataVisor, Feedzai, Oscilar, and Sardine.

### Tier 3: Nice-to-have or hype-prone

#### 1. Generic "AI agent" language without clear workflow hooks

If the AI cannot show:

- what evidence it used
- what action it recommends
- what policy it mapped to
- what human can override

it is probably demo theater.

#### 2. Beautiful dashboards without operator actions

Dashboards are easy to show and easy to overbuild.

Fraud ops teams care more about:

- action speed
- review burden
- queue health
- filing speed
- false-positive suppression

#### 3. Graph visualizations with no case workflow

If the graph does not change routing, escalation, or action, it is mostly eye candy.

## What Fraud Ops Teams Do Not Actually Want

- another flat alert queue with better colors
- a black-box score with no explanation
- a graph view disconnected from decisions
- a rules engine that requires engineers for every change
- AI summaries that do not cite evidence
- separate tools for fraud, AML, sanctions, and case notes if the same analyst has to open all of them
- more "investigate later" surfaces with no hold, step-up, or enforcement path
- a screening product that floods the team with unresolved near-matches

## What Is Commodity in 2026

- real-time rules engine
- case queues
- sanctions screening
- device intelligence claims
- AI summaries
- no-code workflow builder
- ML risk scores

These are no longer enough to differentiate by themselves.

## What Still Differentiates

### 1. Fraud + AML convergence that actually changes workflow

Not just shared branding.

Real differentiation is:

- shared cases
- shared entity graph
- unified actioning
- unified filing and audit trail

### 2. Network-level decisioning

The strongest vendors are moving from:

- one alert

to:

- one network
- one cluster
- one coordinated abuse pattern

### 3. Safe control tuning

Simulator, shadow mode, A/B tests, backtests, and route metrics matter because they let teams move fast without breaking good-user experience.

### 4. Identity-aware lifecycle monitoring

The better products connect:

- onboarding
- login
- account changes
- payouts
- counterparty behavior
- AML risk

instead of only watching final transactions.

### 5. Explainability tied to action

The best experience is not:

- "score 63"

It is:

- "hold because of device change + near-watchlist beneficiary + sudden cross-border payout + dormant wallet reactivation; here is the evidence"

### 6. Human-in-the-loop AI

The winning pattern is:

- AI compresses manual work
- human owns high-risk decisions
- full audit trail is preserved

## TNG Pullout

If the goal is to win `Security & Fraud`, the research points to one product shape:

- a pre-payout decision workspace
- one hero case
- one operator queue
- one investigation graph
- one action rail
- one export-ready note
- one replay moment

## What Fraud Ops Teams Want First

This is the priority order from the operator side, not the demo side:

1. fewer false positives and better prioritization
2. one screen with the whole case
3. rules and workflows they can change safely
4. graph and entity linkage that changes action
5. clear actions plus audit-ready output
6. AI for repetitive work, not vague "AI scoring"

## What To Build First For The Hackathon

This is the priority order for the weekend build:

This is the product-feature order.
Multi-cloud is handled separately because it is a judging requirement, not a fraud-ops feature.

1. End-to-end hero case that ends in `hold`, `step-up`, or `escalate`.
   Why: without a visible action, the story dies.
2. One-screen case workspace.
   Show: facts, AI inferences, timeline, linked entities, triggered controls, and notes.
3. Action rail with human approval and note export.
   Minimum: `allow`, `step-up`, `hold`, `escalate`, `export note`.
4. Evidence-backed recommendation and missing-information panel.
   Why: this is the strongest AI story.
5. Network view tied to the action.
   Show: shared IP, shared beneficiary, shared device, shared merchant, near-watchlist link.
6. Rule or policy replay.
   Show: current threshold, stricter threshold, caught bad payments, delayed good payments.
7. Queue prioritization and reason chips.
   Show: highest-risk cases first, risk level, next action, backup case for Q&A.
8. Thin customer step-up moment only if the first seven are already solid.

## Nice To Have If Time Allows

- AI-generated rule suggestion
- screening false-positive suppression
- QA checklist
- junior vs senior queue routing
- direct step-up user intervention view

## What To Avoid

- a generic AML screen as the homepage
- five disconnected pages for different tools
- a graph tab with no operational consequence
- vague "AI found risk" copy
- multi-cloud architecture that does not visibly matter

## Best Vendors To Borrow From

If you only have time to borrow from a few vendors, use these:

### Unit21

Best for:

- operator console shape
- alert scoring
- graph-linked investigations
- action rail

### Sardine

Best for:

- rules, graph, case management, and backtesting
- fraud and AML convergence
- agentic investigations that still feel operational

### Hawk

Best for:

- real-time payment focus
- explainability
- interdiction and payment actioning
- screening plus fraud in one risk frame

### SEON

Best for:

- device and digital footprint richness
- case management for lean teams
- practical rule authoring
- AI summary and reporting support

### DataVisor

Best for:

- coordinated ring detection
- knowledge graph embedded in workflows
- cluster-level decisioning

### Alloy

Best for:

- identity-centric fraud ops
- ongoing lifecycle monitoring
- attack containment and safe-mode logic

## My Blunt Read On The Market

The market has already decided that:

- rules alone are not enough
- ML alone is not enough
- alerts alone are not enough
- case management alone is not enough

The winning category is:

- detection
- investigation
- action
- reporting
- safe tuning

inside one operating system for risk teams.

That is why this repo is stronger as a pre-payout decision workspace than as an `AML + sanctions screener`.

The better question is not:

- "Can we screen better?"

It is:

- "Can we help an analyst decide faster, with better evidence, before money leaves?"

## Suggested TNG Product Sentence

`TNG RiskOps Agent is an AI-native pre-payout decision workspace that turns fraud and AML alerts into evidence-backed actions, analyst-ready case notes, and replayable policy tradeoffs.`

## Suggested Demo Arc

1. Show one dangerous payout case.
2. Show why the case is risky across transaction, device, beneficiary, and watchlist context.
3. Show the network view.
4. Show the recommended action.
5. Show the analyst making the decision.
6. Show the export-ready note.
7. Show the replay lab changing a policy threshold and the caught-vs-friction tradeoff.

## Office-Hours Wedge Test

### 1. Who is the desperate user?

Not "the bank."

It is:

- the fraud analyst
- the AML investigator
- the risk operations lead

specifically when money is about to move and they have to make a decision fast.

### 2. What is the hated status quo?

- too many alerts
- weak prioritization
- evidence gathering spread across tools
- graph work disconnected from actioning
- rule changes that are slow to test safely
- post-hoc notes and reporting that steal analyst time

### 3. What is the narrowest wedge?

Not:

- generic AML monitoring
- generic fraud detection
- broad customer safety

The narrowest wedge is:

- `high-risk pre-payout decisioning for suspicious wallet or cross-border movements`

That is why the repo's `case-301` direction is strong.

### 4. What is the non-obvious observation?

The market does not actually need another detector.

It needs:

- a system that compresses the time from signal to decision
- while preserving evidence, explainability, and human control

### 5. Why now?

Because AI is finally useful for the boring, expensive parts of fraud ops:

- triage
- research
- summarization
- rule drafting
- filing prep

but the decision itself still benefits from human approval.

### 6. What expands after the wedge works?

If the wedge works, expansion paths are obvious:

- more scam patterns
- more payment rails
- more AML and sanctions coverage
- direct customer rescue moments
- policy simulator and governance tooling

## Source Notes

### Repo sources

- `README.md`
- `AUTOPLAN_NEXTGEN_RISK_OPS_PLAN.md`
- `index.html`
- `tng-doc-by-shiwei.md`

### Unit21 screenshot sources

- provided screenshots `[Image #1]` through `[Image #18]`

### Official vendor pages used

- [Unit21 homepage](https://www.unit21.ai/)
- [Unit21 alert scoring](https://www.unit21.ai/blog/alert-scoring-prioritize-the-alerts-that-matter-with-unit21)
- [Sardine rules engine](https://www.sardine.ai/rules-engine)
- [Sardine case management](https://www.sardine.ai/risk-case-management)
- [Sardine fraud investigator](https://www.sardine.ai/fraud-investigator)
- [Sardine transaction monitoring](https://www.sardine.ai/transaction-monitoring)
- [Hawk homepage](https://hawk.ai/)
- [Hawk transaction fraud](https://hawk.ai/our-products/transaction-fraud)
- [Hawk AML transaction monitoring](https://hawk.ai/solutions/aml/transaction-monitoring)
- [Hawk payment screening](https://hawk.ai/our-products/payment-screening)
- [Feedzai homepage](https://www.feedzai.com/)
- [Feedzai AI solutions](https://www.feedzai.com/solutions/ai/)
- [Feedzai transaction screening](https://www.feedzai.com/resource/feedzai-transaction-screening/)
- [Flagright case management](https://www.flagright.com/case-management)
- [Flagright false-positive reduction](https://www.flagright.com/use-case/reducing-false-positives)
- [Flagright sanctions screening](https://www.flagright.com/sanctions-screening)
- [ComplyAdvantage homepage](https://complyadvantage.com/)
- [ComplyAdvantage payment screening](https://complyadvantage.com/transaction-screening/)
- [ComplyAdvantage sanctions screening](https://complyadvantage.com/sanctions-watchlists-screening)
- [SEON homepage](https://seon.io/)
- [SEON case management](https://seon.io/products/case-management/)
- [SEON product updates](https://docs.seon.io/whatsnew/introducing-case-management)
- [SEON device intelligence rules guide](https://docs.seon.io/knowledge-base/device-intelligence/get-started-with-device-intelligence-rules)
- [DataVisor fraud platform](https://www.datavisor.com/products/fraud-platform)
- [DataVisor case management notes](https://www.datavisor.com/blog/digital-fraud-investigations-and-case-management/)
- [DataVisor ring detection case study](https://www.datavisor.com/the-case-study/a-global-financial-management-platform-stopped-70-percent-of-coordinated-fraud-rings-with-datavisor-uml)
- [Featurespace FRAML](https://www.featurespace.com/aml/)
- [Featurespace ARIC Risk Hub](https://www.featurespace.com/how-it-works/)
- [Oscilar platform](https://oscilar.com/platform)
- [Oscilar case management](https://oscilar.com/solutions/case-management)
- [Oscilar AI](https://oscilar.com/ai)
- [Alloy homepage](https://www.alloy.com/)
- [Alloy ongoing monitoring](https://www.alloy.com/transaction-monitoring)
- [Alloy actionable AI](https://www.alloy.com/actionable-ai)
- [Alloy onboarding](https://www.alloy.com/onboarding)
- [Sift homepage](https://sift.com/)
- [Sift platform](https://sift.com/platform/)
- [Sift workflow best practices](https://sift.com/blog/sift-workflow-best-practices)
- [Sift decisions tutorial](https://developers.sift.com/tutorials/decisions)
- [Lucinity case management](https://lucinity.com/case-management)
- [Tookitaki case manager](https://www.tookitaki.ai/product-aml-case-management)
- [Effectiv platform](https://effectiv.ai/)

## Final Call

The best product to build for this repo is not:

- a better alert table
- a pure sanctions screener
- a black-box risk model

It is:

- an analyst operating system for pre-payout fraud and AML decisions

That is where the market is going, and that is the strongest story for TNG's `Security & Fraud` track.
