# Focus

## Core Decision

Build the `ATO detection-to-action orchestration system`.

Do not build the whole fraud ops platform.
Do not build a full no-code rules engine first.
Do not build a generic alert dashboard with AI sprinkled on top.
Do not stop at detection only.

The wedge is:

`detect -> action -> prompt -> resolved`

The hero case is now:

- `account takeover`

The secondary consequence path is:

- `unauthorized transaction after takeover`

Detection is necessary, but it is not the differentiator.
The differentiator is automating the action layer after risky behavior is detected.
User behavior is the core signal layer.

## Final Decision

The actual product flow is:

`USER DATA -> DETECTION -> ACTION -> PROMPT -> RESOLVED`

With this meaning:

- `USER DATA`: login events, device changes, account changes, transaction attempts, success vs failure
- `DETECTION`: scripted detection logic, user scoring, result classification
- `ACTION`: automatic freeze, review routing, `STUDY` tag, case creation
- `PROMPT`: send WhatsApp instruction telling the user to go to Touch 'n Go and complete relogin / MFA / face recognition
- `RESOLVED`: user replies `/tng-login`, system receives webhook, and auto-resolves as reactivated or blocked

This means the app is not just a fraud analyst dashboard.
It is a fraud action orchestration product.

## Focus Lock

This file should stay short and operational.

If something is not directly helping the team decide what to build for the hackathon, cut it.

The v1 focus is:

- one hero case: `account takeover`
- one backup case: `unauthorized transaction after takeover`
- three pages only
- three routes only: `/queue`, `/cases/:caseId`, `/controls`
- deterministic score and policy logic
- AI for explanation, recommendation, and report generation
- automated action for the high-confidence path
- WhatsApp prompt flow
- resolved outcome tracking
- replay for one threshold, action-band, or draft-rule change

## App Shape

### Page 1 - Queue / ATO Command Center

Route:

- `/queue`

Purpose:

- show the spike
- rank suspicious accounts
- show which detections are about to trigger automated action

Shows:

- spike banner
- ranked cases
- behavior score
- reason chips
- current control state
- proposed automatic action

### Page 2 - Case Investigation Workspace

Route:

- `/cases/:caseId`

Purpose:

- help the team understand what happened
- show why an automated action fired or is about to fire
- let the team override only when needed

Shows:

- masked user summary
- behavior score + feature drivers
- user timeline
- account changes
- device changes
- linked accounts
- suspicious actions attempted vs succeeded
- AI recommendation
- policy citations
- action execution state
- prompt status
- override buttons
- export note or ticket handoff

### Page 3 - Controls Lab / Replay

Route:

- `/controls`

Purpose:

- let the team build the rule, action, and prompt logic that powers the automation

Shows:

- variable registry
- current threshold or action band
- readable draft rule
- automated action mapping
- WhatsApp prompt template
- before / after replay results
- more bad cases caught
- more good users delayed
- analyst workload delta

## Fraud Analyst Flow

```text
[/queue]
  ->
[Open top risky account]
  ->
[/cases/CASE-ATO-001: review timeline, score, evidence]
  ->
[/cases/CASE-ATO-001: auto action + policy citations]
  ->
[/cases/CASE-ATO-001: freeze or review tag applied]
  ->
[/cases/CASE-ATO-001: WhatsApp reverify prompt sent]
  ->
[/cases/CASE-ATO-001: resolved as reactivated or blocked]
  ->
[/controls: review variables, draft rule, replay]
  ->
[/controls: compare tradeoff and keep draft]
```

## Page And State Flow

```text
[/queue]
  State: default
  ->
[/queue]
  State: filtered by spike
  ->
[/cases/CASE-ATO-001]
  State: initial review
  ->
[/cases/CASE-ATO-001]
  State: evidence expanded
  ->
[/cases/CASE-ATO-001]
  State: recommendation review
  ->
[/cases/CASE-ATO-001]
  State: action confirmed
  ->
[/cases/CASE-ATO-001]
  State: note exported
  ->
[/controls]
  State: variable registry
  ->
[/controls]
  State: draft edited
  ->
[/controls]
  State: comparison view
```

## Fake Page Sketches

### Queue / ATO Command Center

```text
+----------------------------------------------------------------------------------+
| ATO precursor cluster 4.2x above same-hour baseline                             |
| 21 candidate accounts vs expected 5 in last 30 min                              |
| 18 new-device logins | 9 PIN resets in 24h | 6 high-value transfer attempts     |
| Segment: MY app logins -> transfer-enabled wallets                               |
+----------------------------------------------------------------------------------+
| Route: /queue                                                                    |
+----------------------------------------------------------------------------------+
| Search [__________]      Filter: ATO       Queue: PREVENTION                     |
+----------------------------------------------------------------------------------+
| Rank | User        | Score | Reason Chips                     | Control State     |
| 1    | U*** H****  | 92    | 2am login, new device, PIN reset | No freeze         |
| 2    | N*** R****  | 87    | linked acct, new payee, top-up   | Review pending    |
| 3    | S*** A****  | 76    | password reset, high amount      | None              |
| 4    | M*** Z****  | 71    | new device, repeat failure       | None              |
+----------------------------------------------------------------------------------+
| Click top case -> open investigation                                             |
+----------------------------------------------------------------------------------+
```

### Case Investigation Workspace

```text
+------------------------------------------------------------------------------------------------------+
| User: A*** H****     Score: 92 CRITICAL     Current Control: NONE     Recommended: FREEZE_ACCOUNT    |
| Route: /cases/CASE-ATO-001                                                                           |
| Reason: 2am login | new device | PIN reset | high-value transfer attempt                             |
+--------------------------+------------------------------------------------+--------------------------+
| Left Rail                | Center                                         | Right Rail               |
| - case list              | USER TIMELINE                                  | RECOMMENDED ACTION       |
| - rank                   | 01:58 login from new device                    | FREEZE_ACCOUNT           |
| - score -> open breakdown | 02:01 PIN reset                               | Confidence: 0.84         |
| - reason chips           | 02:04 beneficiary added                        |                          |
|                          | 02:06 MYR 8,500 transfer attempted             | WHY                      |
|                          | 02:07 second transfer blocked                  | - new device             |
|                          |                                                | - late-night login       |
|                          | FACTS                                          | - PIN reset before tx    |
|                          | - device age: 2 hours                          | - 8.7x above baseline    |
|                          | - amount: 8.7x baseline                        |                          |
|                          | - linked device in prior reviewed case         | POLICY / CONTROL         |
|                          |                                                | POL-ATO-03               |
|                          | AI INFERENCES                                  | POL-OPS-04               |
|                          | - likely ATO pattern based on ....             |                          |
|                          | - unauthorized transfer risk high              | ACTIONS                  |
|                          |                                                | [ALLOW]                  |
|                          | MISSING DATA                                   | [STEP_UP_VERIFY]         |
|                          | - customer contact confirmation not yet done   | [FREEZE_ACCOUNT]         |
|                          |                                                | [ESCALATE]               |
|                          | SCORE BREAKDOWN                                | [Open policy drawer]     |
|                          | +20 new device                                 | [Open evidence drawer]   |
|                          | +10 late-night login                           |                          |
|                          | +15 PIN reset in 24h                           | AUDIT OUTCOME            |
|                          | +18 amount 8.7x baseline                       | transfer blocked before  |
|                          | +15 linked prior case                          | completion               |
|                          | LINKED ACCOUNTS / DEVICES                      |                          |
|                          | - linked device to prior case                  | [Export Note]            |
+--------------------------+------------------------------------------------+--------------------------+
```

### Controls Lab / Replay

```text
+------------------------------------------------------------------------------------------------------+
| Controls Lab: ATO policy replay                                                                    |
| Route: /controls                                                                                   |
+------------------------------------------------------------------------------------------------------+
| Variable Registry                                                                                 |
| :is_new_device [boolean]   :pin_reset_24h [boolean]   :failed_login_count_1h [number]             |
| :amount_ratio_30d [ratio]  :linked_prior_case_count [number]                                      |
+------------------------------------------------------------------------------------------------------+
| Current action band                                                                               |
| score < 70 -> ALLOW   | 71-80 -> STEP_UP_VERIFY   | >80 -> FREEZE_ACCOUNT                         |
+------------------------------------------------------------------------------------------------------+
| Draft rule                                                                                        |
| FREEZE_ACCOUNT if :is_new_device = true and :pin_reset_24h = true                                 |
|                   and :amount_ratio_30d >= 5 and :linked_prior_case_count >= 1                    |
+------------------------------------------------------------------------------------------------------+
| Replay Results                                                                                    |
| Cases evaluated: 10                                                                               |
| Before: 5 bad cases caught | 1 good user delayed | 7 analyst reviews                              |
| After : 6 bad cases caught | 2 good users delayed| 9 analyst reviews                              |
| Delta : +1 caught bad case | +1 extra good-user delay | +2 analyst reviews                        |
+------------------------------------------------------------------------------------------------------+
| Analyst readout: stronger ATO freeze rule catches one more likely takeover,                       |
| but adds one extra customer friction event.                                                       |
+------------------------------------------------------------------------------------------------------+
| [Edit Variables]   [Replay]   [Keep As Draft]                                                     |
+------------------------------------------------------------------------------------------------------+
```

## Why This Changed

The strongest new signal came from [docs/feedback-zenny.md](./docs/feedback-zenny.md).

That feedback came from a former fraud analyst who now works in TNG security.

The most important directional change is:

- old direction leaned toward `near-watchlist payout`
- direct field feedback leans much more strongly toward `ATO`, `user behavior`, and `analyst actioning`

That is strong enough to update the product focus.

## Is This Useful And Impressive Enough?

Yes, if the scope stays tight.

### Why it is useful

This solves a real fraud ops problem:

- which suspicious account matters now
- what user behavior actually happened
- whether the suspicious actions succeeded
- what controls already fired
- what action the analyst should take next
- what gets logged for audit and support follow-up

This is closer to real analyst work than another static score or another dashboard.

### Why it is impressive

It gives a complete demo arc in under 4 minutes:

1. a spike in suspicious account behavior appears
2. one risky ATO case is opened
3. AI explains the behavior pattern and recommended action
4. the human approves or overrides the action
5. the system exports a case note or ticket handoff
6. the team replays a threshold or action-band change and shows the tradeoff

That is much stronger than "we built fraud detection."

### Why it can still fail

It becomes weak if we do any of these:

- build a queue with no real decision path
- make the fraud score a black box
- build a fake rule builder with no replay value
- show too many fraud types at once
- hide the human override
- turn the case page into an unreadable mission-control wall

## TNG Value

### Why TNG would care

- safer wallet platform for consumers and merchants
- fewer successful fraud cases
- fewer manual tickets and support escalations
- less need to scale analyst headcount linearly
- stronger trust and compliance posture

### How to talk about business value

Do not pitch this as:

- "AI replaces fraud teams"
- "100% guarantee no fraud"

Pitch it as:

- better analyst leverage
- faster intervention
- fewer successful fraud cases
- safer platform
- less manual review load

## Product Call

### One-line pitch

`TNG RiskOps Agent detects likely account takeover, auto-applies the right control, prompts the user to reverify, and resolves the account before unauthorized money movement succeeds.`

### Primary user

- fraud ops analyst

### Secondary users

- IT security lead
- compliance lead
- support operations lead

### Core job to be done

Turn suspicious user behavior into automated account action, user re-verification, and clear resolution before more damage happens.

## What To Build

Three pages only.

### 1. Queue / ATO Command Center

Purpose:

- show the highest-priority suspicious accounts fast
- make the ATO spike visible
- show which detections will trigger automated action next

Must show:

- ranked cases
- user behavior risk score
- reason chips
- current control state
- one spike banner or anomaly card
- numerator and baseline denominator for the spike
- proposed action band result, not limited to: review, freeze, `STUDY`

Key interactions:

- click the spike banner to filter related cases
- click the top case to open investigation
- show why this case is at the top

What not to do:

- no heavy dashboard analytics surface
- no ten-chart overview page
- no giant alert table as the main product story

### 2. Case Investigation Workspace

Purpose:

- put user behavior, evidence, policy, automated action, prompt status, and final outcome in one place

This is the core page.

Layout:

- top summary strip: masked user snapshot, behavior risk score, current controls
- left rail: ranked cases, reason chips, action state
- center: user timeline, account changes, device changes, linked accounts, attempted vs succeeded actions, facts, AI inferences, missing-data requests
- right rail: automated action, policy or compliance lines, prompt status, human override, final outcome

Must answer these questions instantly:

1. What behavior happened?
2. Did suspicious actions succeed?
3. What evidence did the system use?
4. What automatic action fired and why?
5. What prompt was sent to the user?
6. Which policy or rule allowed this action?
7. Was the bad money movement prevented before completion?
8. Can a human override this?
9. Is the account now reactivated, blocked, or still pending re-verification?

Key interactions:

- inspect linked accounts and devices
- click the score to open score breakdown, evidence IDs, and triggered scoring rules
- expand evidence items
- open policy drawer from the recommendation rail
- distinguish `FACT` vs `INFERENCE` vs `POLICY`
- see current control state, not limited to: no action, review, freeze pending
- show if the system auto-applied `REVIEW`, `FREEZE_ACCOUNT`, or `STUDY`
- allow human override with mandatory reason
- show prompt sent status and re-verification result
- export case note or ticket handoff

### 3. Controls Lab / Replay

Purpose:

- prove that behavior thresholds, automated actions, and prompt flows can be tested safely before rollout

Must show:

- current action band or threshold
- variable registry
- readable draft rule
- action mapping
- prompt mapping
- fixed seeded scenarios
- bad cases caught
- good users delayed
- analyst workload delta
- deterministic rerun result

Key interactions:

- edit one threshold, action band, or whitelisted variable
- draft one readable control
- map a score band to an automatic action
- map an action to a user prompt
- rerun the replay
- compare before vs after
- keep the result as draft

Optional only if the core demo is already stable:

- one AI-generated draft rule from reviewed anomalies, replayed before saving as draft

What not to do:

- no full visual drag-and-drop rule builder
- no fake no-code DSL unless it directly drives replay
- no arbitrary user code execution
- no autonomous rule deployment

## Core Product Flow

### Hero flow

1. Queue shows a spike in suspicious ATO-like behavior.
2. Analyst opens the highest-risk account.
3. Workspace shows login time, device change, account changes, linked accounts, and suspicious transaction attempts.
4. Deterministic behavior score and feature drivers are shown.
5. Rule engine maps the score and evidence into an automatic action.
6. System auto-applies `REVIEW`, `FREEZE_ACCOUNT`, or `STUDY` based on the action ladder.
7. Policy layer shows exactly why that action was allowed.
8. System sends the user a WhatsApp message telling them to go to Touch 'n Go for relogin / MFA / face recognition.
9. User replies `/tng-login` in WhatsApp.
10. WhatsApp webhook updates the app and auto-resolves the case as `REACTIVATED`, `BLOCKED`, or `ESCALATED`.
11. Manager report and case outcome are generated.
12. Analyst opens Controls Lab and tightens one threshold, action band, or draft rule.
13. Replay shows the tradeoff.

### Backup flow

Use one second case for Q&A:

- unauthorized transaction after account takeover

Do not build more than one backup case.

## V1 vs V1.5

### V1 must ship

- queue with one spike banner
- one hero ATO case
- behavior timeline
- deterministic behavior score with visible drivers
- automated action with evidence references
- human override reason
- WhatsApp re-verification prompt
- resolved state: `REACTIVATED` or `BLOCKED`
- masked PII
- case note or manager report
- simple Controls Lab replay

### V1.5 only if v1 is stable

- one AI-generated draft rule from reviewed anomalies
- one backup case
- one natural-language manager query or report surface

## Modules

Build these modules and no more.

### 1. Seed / Scenario Generator

Responsibility:

- create synthetic but realistic Malaysia-context ATO and unauthorized-transaction cases
- ensure every case already tells a story

Output:

- users
- wallets
- devices
- linked accounts
- beneficiaries or payment instruments
- transactions
- behavior events
- alerts
- controls state
- expected recommendation
- replay scenarios

Deterministic:

- yes

### 2. Case Ingest And Normalization

Responsibility:

- turn seeded behavior events and alerts into one case record
- collapse duplicate signals into a single investigation surface

Input:

- seeded alert events
- seeded behavior events

Output:

- normalized case
- linked entities
- summary fields for queue ranking

Deterministic:

- yes

### 3. Behavior Timeline And Link Resolver

Responsibility:

- connect user, wallet, device, linked accounts, beneficiary, and past suspicious activity
- order the suspicious sequence in time
- score the confidence of each link

Important rule:

- do not silently merge ambiguous links
- show uncertainty in the UI

Deterministic:

- yes

### 4. Policy And Action Ladder Engine

Responsibility:

- evaluate which control policies are triggered
- map evidence to policy or control citations
- constrain which actions are allowed
- execute automatic action when the rule and score band are satisfied

Important rule:

- no severe action without policy mapping
- no auto-approve when policy is missing
- human override remains visible for severe controls

Deterministic:

- yes

### Thin analyst-defined variables and readable rules

Borrow the useful part of a Radar-style workflow, not the whole product.

For v1, analysts can define or edit only:

- boolean flags
- numeric counts
- ratios vs baseline
- hours since event
- linked-case counts

Each variable must declare:

- name
- type
- source fields
- lookback window
- transform
- description

Readable rule format example:

```text
FREEZE_ACCOUNT if
  :is_new_device = true and
  :pin_reset_24h = true and
  :amount_ratio_30d >= 5 and
  :linked_prior_case_count >= 1
```

Guardrails:

- draft only
- replay against the fixed seed set before save
- AI may suggest the rule from 10 reviewed anomalies
- no live deployment in v1
- no arbitrary user code

### Rule-building process

Keep rule building explicit.

The process is:

1. choose the behavior variables
2. define the condition logic
3. assign the action
4. assign the user prompt
5. assign the resolved-state path
6. replay on fixed scenarios
7. keep as draft or promote

Example:

```text
IF
  :is_new_device = true and
  :pin_reset_24h = true and
  :amount_ratio_30d >= 5
THEN
  action = FREEZE_ACCOUNT
  prompt = WHATSAPP_REVERIFY
  whatsapp_message = "Please go to Touch 'n Go to complete relogin / MFA / face recognition. Reply /tng-login once done."
  resolved_if_reply = REACTIVATE
  resolved_if_timeout = KEEP_BLOCKED
```

### 5. Behavior Score Engine

Responsibility:

- calculate a deterministic per-user or per-case behavior risk score
- expose the feature contributions used to reach the score

Important rule:

- the score itself should be deterministic or rules-based
- AI should explain the score, not secretly generate it

Deterministic:

- yes

### How v1 score is calculated

For the hackathon, the fraud score is a deterministic behavior score, not a trained-model claim.

Suggested ATO feature weights:

- `new_device_age_hours <= 24`: `+20`
- `login_between_00_and_05`: `+10`
- `pin_reset_within_24h`: `+15`
- `beneficiary_added_within_24h`: `+10`
- `failed_login_count_1h >= 3`: `+10`
- `amount_to_30d_avg_ratio >= 3`: `+10`
- `amount_to_30d_avg_ratio >= 6`: `+18` instead of `+10`
- `linked_prior_case_count >= 1`: `+15`
- `prior_step_up_failed = true`: `+10`

Example formula:

```text
score = clamp(
  new_device_points
  + late_night_points
  + pin_reset_points
  + beneficiary_change_points
  + failed_login_points
  + amount_ratio_points
  + linked_case_points
  + prior_step_up_points,
  0,
  100
)
```

What we can honestly say:

- yes, we have enough information to calculate a prototype score because every component comes from observable seeded events or deterministic transforms
- no, we do not have enough information to claim a production-trained fraud model
- a real production score would need historical labeled outcomes, segment baselines, calibration, drift monitoring, and false-positive cost tuning

UI requirement:

- show the score breakdown beside the total score
- every score driver must map to evidence IDs the analyst can inspect

### How the spike banner is calculated

The spike is not the fraud score.
It is a queue-level anomaly indicator used for routing.

Prototype rule:

- window: last `30 minutes`
- compare against trailing `7-day` same-hour baseline for the same signal cluster
- signal cluster example: `new-device logins + PIN resets + high-amount transfer attempts`
- show the banner when the cluster is `>= 3x` baseline and at least `2` sub-signals are above threshold

What we can honestly say:

- yes, this is enough to create a deterministic demo spike
- no, this is not a production anomaly model
- a production spike engine would segment by campaign, region, day of week, and feature cohort
- the spike helps prioritize the queue; it does not decide the final case action

Concrete example:

- numerator: `21` candidate accounts in the last `30 minutes`
- denominator: expected `5` candidate accounts for the same segment and same-hour window
- multiplier: `21 / 5 = 4.2x`

Candidate-account logic:

- account enters the spike cluster only if it matches at least `2` precursor signals
- example precursor signals:
  - new-device login
  - PIN reset within 24h
  - beneficiary added within 24h
  - high-value transfer attempt above user baseline

This is why `18 new-device logins` alone is not the alert.
The alert is the clustered rise in risky precursor combinations.

### Why this still counts as proactive detection

The build is not just fraud-ops automation after the fact.

The proactive detection layer is:

- queue-level spike detection for ATO precursor clusters
- deterministic per-account ATO scoring
- action banding before transfer completion
- analyst escalation before the suspicious movement succeeds

Judge-safe framing:

- we are not claiming a production ML model
- we are building a deterministic prototype that detects likely ATO precursor patterns early enough to trigger preventive action
- the workspace makes that detection operationally usable
- the automated freeze and re-verification flow is the main product value, not just the score

### 6. AI Investigation Copilot

Responsibility:

- explain suspicious behavior in plain English
- summarize what happened from the user point of view
- highlight missing information
- recommend a next step

Important rule:

- AI does not own the final severe action
- AI output must cite evidence IDs and policy IDs
- AI must not behave like a black-box scoring engine

Deterministic:

- no

### 7. Recommendation And Action Rail

Responsibility:

- show action options
- show current recommendation
- require human confirmation or override reason
- show exactly which policy IDs, evidence IDs, and score drivers support the recommendation

Allowed actions for v1:

- `ALLOW`
- `REVIEW`
- `STUDY`
- `STEP_UP_VERIFICATION`
- `FREEZE_ACCOUNT`
- `ESCALATE`

Hackathon note:

- keep device block and IP block as visible control state or future action, not primary v1 buttons

### Evidence-backed decision and policy mapping

The core interaction should support:

- click score -> open score breakdown
- click score component -> open supporting evidence item
- click recommendation -> open policy drawer
- click policy ID -> show why this policy was triggered

For each severe recommendation, the UI should show:

- score total
- score components
- evidence IDs
- policy IDs
- recommended action
- allowed override options
- final human decision
- final case outcome

Example chain:

```text
Score 92
  -> +20 new device
  -> +15 PIN reset in 24h
  -> +18 amount 8.7x baseline
  -> EV-101, EV-102, EV-104
  -> POL-ATO-03 allows FREEZE_ACCOUNT
  -> system auto-applies FREEZE_ACCOUNT
  -> system sends WhatsApp: "Please go to Touch 'n Go ..."
  -> user replies /tng-login
  -> case auto-resolves as REACTIVATED
  -> transfer blocked before completion
```

### Prompt and resolution engine

After action, the system should continue automatically.

Prompt states:

- `PENDING_SEND`
- `SENT`
- `DELIVERED`
- `USER_REPLIED_TNG_LOGIN`
- `EXPIRED`

Resolved states:

- `REACTIVATED`
- `BLOCKED`
- `ESCALATED`
- `PENDING_USER`

v1 prompt flow:

- send WhatsApp notification
- message instructs user to go to Touch 'n Go for relogin / MFA / face recognition
- user replies `/tng-login`
- WhatsApp webhook updates the case
- system auto-resolves based on reply or timeout

### 8. Report Draft And Export

Responsibility:

- turn evidence ledger + final action into an export-ready note
- support a believable handoff to support or case tooling

Must include:

- case summary
- behavior sequence
- facts used
- AI inferences
- policy or control citations
- final human action
- human approver or overrider
- final case outcome, not limited to: transfer blocked, transfer held, step-up requested
- prompt delivery and re-verification result
- audit timestamp

### 9. Replay Engine

Responsibility:

- rerun fixed scenarios against a changed threshold or action band
- compare outcomes

Important rule:

- same seed must produce the same result

Deterministic:

- yes

### 10. Audit Trail And Compliance Surface

Responsibility:

- log every important system and human action
- keep masking and security posture visible

Must capture:

- alert created
- case opened
- evidence added
- recommendation generated
- automatic action applied
- prompt sent
- re-verification completed
- override reason
- note exported
- replay run

Must show:

- masked PII by default
- audit trail
- encryption-at-rest callout in architecture or deck

Deterministic:

- yes

## What AI Should And Should Not Do

### AI should do

- behavior explanation
- case explanation
- missing-data prompts
- next-action recommendation
- policy reasoning in plain English
- note drafting

### AI should not do

- secretly generate the core fraud score
- replace deterministic policy logic
- take final irreversible action alone
- fake certainty
- make unsupported claims without evidence IDs

## Data Creation Plan

Keep all data synthetic.

Make the data local and believable, not generic.

### Scenario families

Build three families:

1. `ACCOUNT_TAKEOVER`
2. `UNAUTHORIZED_TRANSACTION`
3. `MULE_ACCOUNT_ABUSE`

Use one hero family and one backup family in the live demo.

### Suggested case count

- 6 to 10 total cases
- 1 hero case
- 1 backup case
- remaining cases only for queue realism

### For each case, seed these records

- `case`
- `masked_user_profile`
- `wallet`
- `device`
- `linked_accounts`
- `beneficiary` or `payment_instrument` if relevant
- `transactions`
- `behavior_events`
- `controls_state`
- `alerts`
- `entity_edges`
- `evidence_items`
- `behavior_score`
- `ai_recommendation`
- `allowed_actions`
- `expected_final_action`
- `replay_outcomes`

### Hero case recommendation

Use:

- `suspicious account takeover with attempted unauthorized transfer`

Why:

- directly matches the field feedback
- easy to understand in under 20 seconds
- ties user behavior to action
- naturally supports freeze or step-up
- easy to replay a threshold change

### Hero case facts to seed

- account was normal for months, then a suspicious login happens around 2am
- login comes from a new device
- recent account change happens, not limited to: PIN reset, profile update, beneficiary addition
- a high-value transfer or top-up is attempted soon after the account change
- transaction amount is far above recent user baseline
- one linked account or device has appeared in another reviewed case
- current controls show that the account is not yet frozen
- at least one suspicious action is attempted and the case shows whether it succeeded

### Example recommendation

- recommended action: `FREEZE_ACCOUNT`
- confidence: `0.84`
- policy mapping: `POL-ATO-03`, `POL-OPS-04`
- human override options: `STEP_UP_VERIFICATION`, `ESCALATE`, `ALLOW`

### How to create the seed data

Do not wait for a perfect fraud dataset.

Use this method:

1. Write 3 scenario templates in JSON or TS.
2. For each template, define the story, behavior sequence, linked entities, triggered policies, and expected action.
3. Generate 6 to 10 cases from those templates with slightly different values.
4. Precompute behavior score components, evidence items, and replay results for demo stability.
5. Keep the data fixed for the demo build.

### Suggested seed file structure

```text
seed/
  scenarios/
    account-takeover.json
    unauthorized-transaction.json
    mule-account-abuse.json
  cases/
    hero-account-takeover.json
    backup-unauthorized-transaction.json
  policies/
    policy-config.json
  replay/
    baseline-results.json
```

### Example scenario shape

```json
{
  "scenario_id": "account-takeover-001",
  "scenario_type": "ACCOUNT_TAKEOVER",
  "title": "Suspicious account takeover with attempted transfer",
  "recommended_action": "FREEZE_ACCOUNT",
  "allowed_actions": ["STEP_UP_VERIFICATION", "FREEZE_ACCOUNT", "ESCALATE"],
  "behavior_signals": [
    "late_night_login",
    "new_device",
    "recent_account_change",
    "high_amount_vs_baseline",
    "linked_account_risk"
  ],
  "policy_ids": ["POL-ATO-03", "POL-OPS-04"],
  "evidence_ids": ["EV-101", "EV-102", "EV-103", "EV-104"]
}
```

## Data Model

Keep the schema boring and explicit.

Suggested tables:

- `cases`
- `entities`
- `entity_edges`
- `behavior_events`
- `transactions`
- `controls_state`
- `alerts`
- `evidence_items`
- `score_components`
- `score_bands`
- `variable_definitions`
- `rule_drafts`
- `agent_runs`
- `recommendations`
- `policies`
- `audit_events`
- `replay_runs`

### Important enums

- `EntityType`: `USER`, `WALLET`, `DEVICE`, `BENEFICIARY`, `PAYMENT_INSTRUMENT`, `LINKED_ACCOUNT`
- `EvidenceKind`: `FACT`, `INFERENCE`, `POLICY`, `CONTROL_STATE`
- `CaseStatus`: `NEW_ALERT`, `INVESTIGATING`, `READY_FOR_REVIEW`, `NEEDS_MORE_DATA`, `CLOSED`
- `RecommendationAction`: `ALLOW`, `STEP_UP_VERIFICATION`, `FREEZE_ACCOUNT`, `ESCALATE`
- `VariableType`: `BOOLEAN`, `NUMBER`, `RATIO`, `COUNT`, `DURATION_HOURS`
- `RuleState`: `DRAFT`, `READY_FOR_REPLAY`, `READY_FOR_SHADOW`, `REJECTED`

## Route Map

Keep routing simple:

- `/queue`
- `/cases/:caseId`
- `/controls`

## Page-Level Flow Contract

### Queue / ATO Command Center

Route:

- `/queue`

On load:

- show seeded cases
- highest-risk ATO case is first
- spike banner is visible
- show spike numerator, denominator, segment, and time window

On click:

- open the selected case
- preserve ranking context

### Case Investigation Workspace

Route:

- `/cases/:caseId`

On load:

- show masked user summary
- show behavior score and feature drivers
- show user timeline
- show account changes
- show linked accounts or devices
- show attempted vs succeeded suspicious actions
- show recommendation + policy citations
- show clickable score breakdown
- show clickable evidence IDs and policy IDs

On analyst action:

- require confirmation
- require override reason if analyst disagrees with AI
- write audit event
- update control state
- record whether suspicious movement was prevented before completion

On export:

- create note artifact from evidence ledger
- keep downloadable or copyable output
- show believable handoff to support or case tooling

### Controls Lab / Replay

Route:

- `/controls`

On load:

- show current threshold or action band
- show variable registry
- show readable draft rule
- show seeded replay baseline

On edit:

- rerun replay against same seed
- show delta summary
- show analyst workload delta
- write replay run to audit
- keep the proposal as draft
- do not live-deploy from this screen

## Compliance And Integration Posture

For v1, the product should visibly support:

- masked PII by default
- audit trail
- policy visibility for severe actions
- human override for severe actions
- encryption-at-rest callout in the architecture slide
- simple export or handoff to ticketing, not necessarily live Zendesk integration

Do not overbuild:

- no live customer call workflow
- no real device or IP blocking integration
- no full regulatory reporting engine

## Spike Feature Decision

Keep the spike, but make it thin.

The spike should be:

- a banner on the queue
- one concise anomaly explanation
- one click into the relevant ATO case cluster

The spike should not be:

- a separate analytics product
- a full BI dashboard
- a timeseries-heavy page

## What Not To Build

Do not build these in the hackathon:

- full no-code rule and workflow builder
- proprietary fraud model training pipeline
- live Zendesk integration
- live device or IP block enforcement
- production event streaming
- full customer recovery journey
- separate graph database
- Telegram scraping or threat-intel ingestion as a core feature
- every fraud type at once
- every compliance workflow at once

## Judging-Criteria Fit

### 1. AI intelligent systems

This build uses AI in the right place:

- behavior explanation
- evidence synthesis
- report generation
- policy explanation
- note drafting
- optional manager query and reporting assist

This avoids the mistake of using LLMs as fake deterministic scoring engines.

### 2. Technical implementation

This can be built as a stable prototype because:

- score and policy logic stay deterministic
- replay stays deterministic
- seeded data keeps the demo reliable
- one app can serve the whole flow

### 3. Multi-cloud

Use a real split:

- AWS for app, API, DB, seed storage
- Alibaba Cloud for LLM inference and note generation

Judge sentence:

`AWS runs the investigation system of record; Alibaba runs the AI analyst that explains suspicious behavior and drafts actions.`

### 4. Impact and reliability

The impact story is clear:

- suspicious accounts are investigated faster
- risky actions can be interrupted sooner
- analysts can handle more cases with better evidence
- trust and compliance posture become more visible

### 5. Presentation

The story is naturally demoable:

- detect
- action
- prompt
- resolved
- replay

That is one straight line.

## Build Order

Build in this order and stop when the previous slice is weak.

1. Seeded ATO hero case
2. Queue with reason chips and spike banner
3. Case workspace with behavior timeline and feature drivers
4. Deterministic score and action ladder
5. Automated freeze or review execution
6. WhatsApp re-verification prompt flow
7. WhatsApp reply webhook and resolved outcome tracking
8. Note export or manager report
9. Controls Lab replay
10. Backup unauthorized-transaction case
11. AI draft-rule suggestion only if everything above is stable

## Minimum Viable Demo Checklist

- first page loads with seeded cases
- hero case is understandable in under 20 seconds
- behavior score shows visible drivers
- every recommendation cites evidence IDs
- every recommendation cites policy IDs
- automated action visibly fires
- human can override
- override requires a reason
- WhatsApp prompt status is visible
- resolved outcome is visible
- masked PII is visible
- note export works
- replay is deterministic by seed
- one threshold edit changes replay outcome visibly

## 4-Minute Demo Script

1. Open Queue and point at the ATO spike banner.
2. Open the top risky account case.
3. Show the user behavior timeline, account changes, and suspicious action attempts.
4. Show the deterministic behavior score and feature drivers.
5. Show automatic `FREEZE_ACCOUNT` or `REVIEW` triggered by rule and policy.
6. Show WhatsApp re-verification prompt sent to the user.
7. Show user reply `/tng-login` and auto-resolved state as `REACTIVATED` or `BLOCKED`.
8. Export the case note or manager report.
9. Open Controls Lab.
10. Tighten one threshold, action band, or readable draft rule.
11. Replay and show the tradeoff.

## If Time Remains

Only after the core demo is stable:

- add one backup case family
- add one thin manager report or query surface
- add one simple natural-language query, not limited to: `show all rules used for fraud score >= 90` or `which frozen cases never reverified`
- add one AI-generated draft rule suggestion in Controls Lab

## Final Call

The strongest hackathon version is not:

- `alert dashboard + generic fraud score + AI assistant`

The strongest hackathon version is:

- `AI-assisted analyst workspace for account takeover detection, investigation, and intervention`

That is useful enough because it targets a real TNG workflow bottleneck.
That is impressive enough because it shows behavior-led reasoning, human action, and replayable controls in one flow.
