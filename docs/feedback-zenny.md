# Zenny Feedback

## Source

- Source: Zenny
- Role context: former fraud analyst, now lead specialist in IT security at TNG
- Date captured: 2026-04-25
- Capture type: live verbal product feedback, transcribed from rough notes
- Weight: high for workflow pain, analyst behavior, fraud patterns, and buyer value
- Weight: medium for exact policy thresholds and exact compliance wording until confirmed

## Why This Matters

This is not generic market research.

This is direct feedback from someone who has actually worked fraud cases inside the TNG context.

The biggest consequence is:

- current docs lean toward `near-watchlist payout`
- this feedback leans much more strongly toward `account takeover` and `user behavior`

That is a real product-direction signal, not a cosmetic preference.

## Most Important Takeaways

1. Focus the hero case on `ATO`, not generic fraud.
2. User behavior is the core signal layer.
3. The product value is analyst leverage: do not hire hundreds of analysts if five can do the work.
4. The product must help analysts investigate, decide, and act, not only detect.
5. TNG cares about trust, compliance, and operational scalability.
6. The system should show where it integrates with the real ops stack, not limited to: ticketing, dashboards, action history, and control outcomes.

## Business And Buyer Framing

### TNG-side value

- TNG is a wallet and financial service provider, so fraud control is part of core product trust.
- Stronger fraud operations means fewer customer losses, fewer support tickets, fewer manual reviews, and fewer regulatory problems.
- Better control reduces the need to scale analyst headcount linearly.
- Rough framing from the feedback: if the workflow is good, the team should hire a small number of strong analysts instead of hundreds of reviewers.

### Platform expansion idea

The feedback also implied a possible future expansion:

- build for TNG first
- prove analyst leverage and fraud-control value
- later sell the platform or a security productized layer to other companies

This is future GTM context, not the hackathon MVP.

## Core Product Reason

The product is not being built because "AI is cool."

It is being built because:

- fraud ops is labor-heavy
- manual ticket handling and manual investigation cost real headcount
- bad fraud controls hurt user trust
- regulated financial platforms can be fined or pressured if controls are weak
- better decisioning helps TNG keep the platform safe for consumers and merchants

## Fraud Focus From The Feedback

### Primary fraud type: Account takeover (`ATO`)

This was the clearest message in the feedback.

ATO should be the main case type to understand and possibly the main hero case.

Observed patterns called out:

- social engineering
- phishing
- victims giving away PIN and OTP
- attackers using compromised credentials to log in and move funds
- takeover behavior followed by transfers, top-ups, or other unauthorized actions

Behavioral signals mentioned:

- account changes
- new or unusual device
- suspicious login or activity time, for example very late at night
- multiple linked accounts
- dummy or mule accounts
- accounts belonging to other people being used for payment or laundering
- elderly or less sophisticated users being manipulated

### Secondary fraud type: Unauthorized transactions

This appeared as a closely related downstream flow.

The rough operational idea is:

- account gets taken over
- attacker uses stored payment methods or wallet balance
- attacker pushes unauthorized transactions
- this can create downstream merchant cost and chargeback pain

This makes unauthorized transactions a strong second case type, but the root workflow still appears to be ATO-first.

### Mule / dummy account risk

The feedback also pointed at a related problem:

- eKYC alone is not enough
- people can sell or rent accounts
- elderly or rural users can be exploited
- identity match quality and real account control can diverge

That means the system should not treat "passed eKYC once" as proof that present behavior is safe.

## Analyst Workflow Observed In The Feedback

The notes imply this investigation flow:

1. Start from the user point of view.
2. Review account context and linked accounts.
3. Check behavioral anomalies and whether suspicious actions succeeded.
4. Check what controls already fired, not limited to: device block, IP block, account freeze, permanent ban.
5. Verify whether the activity was unauthorized or socially engineered.
6. Decide what action to take.

Important implication:

The analyst is not only reading alerts.
The analyst is reconstructing what happened to the user.

That means the case workspace should show:

- user timeline
- account changes
- device changes
- linked accounts
- suspicious actions attempted vs succeeded
- current control state
- recommended next action

## Product Signals From The Feedback

### 1. User behavior matters more than static screening

This was emphasized hard in the notes.

The feedback points to:

- per-user fraud score
- behavior-based reasoning
- AI helping analysts understand patterns from user behavior

Important caution:

This does not mean "build a magical black-box score."

It means:

- behavior features should be visible
- risk score can exist
- the score must still map to explainable actions

### 2. Action ladder matters

The product should not stop at "detected."

The flow implied by the notes is:

`detect -> action -> prevent`

Possible action ladder from the feedback:

- approve
- request additional verification / eKYC
- hold or freeze account
- block by device
- block by IP
- force account recovery
- contact customer or helpline verification

### 3. Dashboard is useful only if it helps decisions

The feedback mentioned dashboarding and Power BI automation.

Interpretation:

- a dashboard can exist
- but it should help analysts understand and act
- a dashboard without behavior understanding and action support is too weak

### 4. Integration story matters

Zendesk was explicitly mentioned.

That suggests the system should at least show where it fits in the current ops stack, not limited to:

- ticketing or case systems
- analyst review workflow
- customer contact / verification workflow
- reporting / BI surfaces

For the hackathon, an integration card or "exports to" surface is enough.

## Compliance And Security Signals

The feedback explicitly called out:

- PII should be anonymized or masked where possible
- data at rest should be encrypted
- compliance needs to be visible
- Bank Negara rules matter
- `RMiT` was mentioned
- `PCI DSS` was mentioned

For the hackathon story, the product should visibly support:

- masking sensitive data in the analyst UI
- audit trail
- human approval for severe actions
- encryption-at-rest in the architecture slide

## Pitch Guidance From The Feedback

### Strong pitch angles

- start with a real scam pain
- talk about fraud cases explicitly
- show that fraud ops teams cannot solve this only by hiring more people
- frame the product as making the platform safer and more trustworthy
- localize the pitch to TNG instead of sounding like a copy-paste global fraud startup

### Useful story lines

- protect "uncles and aunties" and merchants
- keep trust in the wallet platform
- reduce manual case handling
- reduce analyst staffing pressure
- stay compliant while moving faster

### Dangerous line to avoid

The notes contain a `100% guarantee there will be no fraud cases` style statement.

Do not use that literally.

That is a bad claim for a hackathon pitch, a bad compliance claim, and an easy way for judges to stop trusting the team.

Better framing:

- better controls
- faster intervention
- fewer successful fraud cases
- safer platform
- higher analyst leverage

## What This Changes In The Current Product Direction

### Tension with current docs

Current direction in [focus.md](../focus.md) and related docs centers a `near-watchlist cross-border payout` hero case.

This feedback points more strongly toward:

- `ATO` as the main hero case
- user-behavior-led investigation
- unauthorized transactions as a downstream consequence path

### Recommendation

This feedback is strong enough that the team should seriously consider:

1. replacing the hero case with `ATO`
2. making user behavior the main evidence layer
3. keeping watchlist or sanctions context as a secondary signal, not the main story

That would better match the lived pain described by the source.

## Best Hackathon Translation Of This Feedback

If we translate the feedback into a sharp MVP, the strongest version is likely:

`AI-assisted analyst workspace for account takeover detection, investigation, and intervention`

The straight-line story becomes:

1. suspicious user behavior triggers an ATO case
2. analyst sees account changes, linked accounts, device shifts, and transaction attempts
3. AI summarizes the behavioral pattern and proposes a fraud score plus action
4. analyst chooses approve, step-up verification, freeze, or escalate
5. system records audit trail and shows prevention outcome

### Example action bands mentioned in the notes

These were mentioned as rough ideas, not validated policy:

- fraud score < 70 -> approve
- 71 to 80 -> extra verification / eKYC
- > 80 -> block

Treat these as a brainstorming clue, not production truth.

## What To Put In Slides

- one slide on the two fraud types: `ATO` and `unauthorized transaction`
- one slide on why TNG cannot just hire more analysts
- one slide on behavior-led investigation
- one slide on action ladder
- one slide on compliance and masking
- one slide on customer trust and platform safety

## Open Questions To Confirm Later

1. Which case type is actually the highest-pain operational workflow today: ATO or unauthorized transaction?
2. Is `ATO -> unauthorized transaction` the preferred causal story for the demo?
3. Which current system is the analyst system of record: Zendesk, internal case tooling, or something else?
4. Are the fraud-score action bands real, or only an illustrative suggestion?
5. Which controls are actually available today: device block, IP block, account freeze, permanent ban, step-up eKYC?
6. Which exact compliance or security standards should be named in the pitch and architecture slide?

## Product Implications For The Current Build

### Keep

- analyst workspace
- evidence-backed actioning
- human approval
- audit trail
- compliance posture

### Strengthen

- user behavior timeline
- per-user risk explanation
- account and device change visibility
- action ladder
- masking and encryption story

### Potentially change

- hero case from `watchlist payout` to `ATO`

### Avoid

- generic dashboard-only story
- black-box fraud score with no behavior explanation
- overclaiming fraud prevention certainty

## Raw Capture

Below is the raw note capture preserved for context.

> revenue for tng?
> - maybe next time other comapny want to hire security form?
> - grab defense to help and then sell to other company
> - build for tngd so creat a biger platform for safer
> - tng want uncles and merchants to use our platform
>
> need to hire 100s of analyst, only hire 5.
>
> why doing this?
>
> e wallet is service provider
>
> Ai read behavior of fraud. powerbi automate dashboard.
>
> system blocks it?
>
> should show system integrates, zendesk?
> zendesk?
> make sure data colelcted is pii and anonymized and masekd.
> data encryption at rest. one of the criteria, complince needed.
>
> analyst
> 1. get data from user point of view
> 2. review account, oh mutiple aocunt, ip not there (ai identify behaviour)
> 3. did they succeed? this need to check, payment side, behavur
> 4. did u block by device, ip, orforever cannot join/
> 5. call an verify, is this, unauthorized transacion, fraud, share pin numbers. what type of fraud cases look at. did it check.
>     - focus on this one ATO number 1, social engineering, phishing. black market data provider.
>
> write down how this thing goanna work.
>
> fraud case:
> 1. read acount take over case
>
> focus on account take over.
>
> behavior:
> 1. account changes
> 2. dummy account
> 3. ekyc cannot lie but people, people sell old people account and use to make payment or money laundering.
>
> unwillingly give people account, all i need it pin number and otp.
> uncle aunty.
>
> take over, find out, when they register for budi 95, they call helpline, need to redo ic, ekyc, everyhtng. freeze account
>
> ato use multiple account, dummy account, other people rural place, ic dont match, face dont match.
>
> start pitch with:
> did anyone scammed before
> did anyone resolve all of it?
>
> i ahve this product, it will give 100% gurantee there will be no fraud cases.
> if fraud comes in good control.
> detct -> action -> prevent
>
> put fraud cases in slides.
>
> focus rmit risk something somehting, bank negara set rule, financial platform so comply
> tngd must follow this rule.
>
> pcidss is second one.
>
> use this to stay complaint, no need to hire 100s of people, 3 enough.
> have to answer ticket, manualy 20 staff.
> save cost, and manpower, other stuff to do and hire.
>
> fined if not compliant, rmit gives regulartory a lot to prevent fraud caases
> so people confident with product
> dont lose customers
> my tool safer platform
> tng is the clinet
> detect if user is ato
>
> focus on tool to help analyst understand and create dasbhaord, 1 ato, 1 fraud
>
> use unit 21 sales pitch, localize it
>
> USER BEHAVOIR!!! not everyone doing this. understand user behaviour, form there take actions from behavior, USER FRAUD SCORE BOMB. EACH USER fraud score.
> DO dashboard
> AI analsy understand this, when ato can do transcaitno unauthorized.
> then fraud < 70 approve
> 71 to 80 ekyc
> >80 we block
>
> maybe ato, anmaly at 2am,
>
> UNAUTH transactions
> some else using the card.
> differnt case.
> take peoples card , from social enginering
> uncle gets sacmmed script
> - reload pin so put in then copy number help u do
> - tarnsfer multiple
>
> ato then unauth tancaitno, this si the flow
> credit card inside, then someone takes over, they can topup,
> 3ds -> login -> otp ->
> merchant pays cost -> chargeback
>
> FRAUD SCAORE IS REALLY IMPORTANT.
>
> SO RIGHT NOW only 2 types of fraud to focus on.
> ATO or UNAUTH transcaitno, but ato then unauth no?
