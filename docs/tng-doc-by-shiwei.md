# TouchnoGo - TNG Digital FINHACK 2026 Handbook

**Team:** TouchnoGo (4 members)  
**Event:** TNG Digital FINHACK 2026  
**When:** 2026-04-25 to 2026-04-26  
**Where:** Grand Summit, Connexion Conference & Event Centre, Bangsar South City, Kuala Lumpur  
**Last updated:** 2026-04-25, Day 1, v0.4

## 0. How To Use This Handbook

This file is for event operations.

Use it for:

- rules
- judging
- deliverables
- schedule
- venue and logistics
- submission checklist

Do not use it as the main product strategy doc.

Use these instead:

- `README.md` -> current call and ranked build order
- `AUTOPLAN_NEXTGEN_RISK_OPS_PLAN.md` -> MVP scope, architecture, design contract, risk plan, CTO questions, post-MVP backlog
- `FRAUD_OPS_MARKET_RESEARCH_2026-04-25.md` -> vendor map and fraud-ops needs

Read order inside this handbook:

- Sections 1-6: must-read event facts
- Sections 7-9: operations
- Sections 10-12: execution guidance
- Section 13: still-open questions

Source status:

- The official briefing deck has been walked through end-to-end.
- Judging criteria, prize amounts, Day 1 and Day 2 schedule, AWS region constraints, mentorship mechanics, communication channels, housekeeping rules, and emergency contacts are verified.
- Anything still marked `[VERIFY]` is not in the briefing deck and still needs Terms PDF or on-site confirmation.

## 0.1 Day 1 Addendum

Five things matter most:

1. Treat this repo as `Security & Fraud` first, not generic fintech ideation.
2. Judges care whether AI is the right tool, not whether you stuffed AI everywhere.
3. A good first click means nothing if the second click breaks.
4. Two clouds must do real work for a real reason.
5. The impact has to be real and easy to feel in under 4 minutes.

## 1. Event At A Glance

| Item | Detail |
|---|---|
| Event name | TNG Digital FINHACK 2026 |
| Organiser | TNG Digital, Touch 'n Go eWallet tech division |
| Community / advisory partner | Developer Kaki |
| Official event partner | 3Particle |
| Platinum sponsor | Alibaba Cloud |
| Dates | Saturday 2026-04-25 to Sunday 2026-04-26 |
| Duration | 36-hour hackathon, build mode starts 11:00 AM Day 1, submissions 09:00 AM Day 2 |
| Format | 2 days, 1 night, final pitches on Day 2 |
| Venue | Grand Summit, CCEC, Level M1, The Vertical, Bangsar South City |
| Overnight rest areas | Pinnacle 7 and Pinnacle 8 |
| Capacity | 300 participants |
| Cost | Free |
| Eligibility | Malaysian citizens `[VERIFY]` |
| Team size | 3-5 members |
| Deliverables | 7 submission items through Google Form |
| Submission window | Sunday 2026-04-26, 09:00-09:30 |
| Cloud credits | Alibaba Cloud USD 300 in `ap-southeast-3` only, AWS USD 250 in `ap-southeast-5` or `ap-southeast-1` only |
| Cloud accounts | 1 Alibaba account and 1 AWS account per team |
| Hard requirements | At least 2 cloud platforms and meaningful AI |
| Judging criteria | 5 criteria, same for prelims and finals |
| Prize pool | MYR 58,000 total |
| Lucky draw prizes | MacBook Pro 14" M4, Nintendo Switch 2, iPhone 17 Pro, iPad Pro, PS5 Slim, Sony WH-1000XM6 |

What makes this hackathon different:

- It is TNG Digital's first nationwide hackathon.
- The focus is on real fintech problems that TNG could plausibly ship, not toy demos.

## 2. Team TouchnoGo Context

- Members: 4
- Name: TouchnoGo
- You still have one spare seat, but you do not need to fill it unless there is a specific skill gap.

Suggested roles:

1. Product / PM lead: owns framing, rubric alignment, pitch narrative.
2. Tech lead: owns architecture, repo hygiene, deployment, demo reliability.
3. Builder: owns whichever half of the stack the tech lead is not holding.
4. Designer / storyteller: owns deck, demo video, UI polish, user journey.

Rule:

- With 4 people, nobody gets to be a pure manager. Everyone codes or writes content.

## 3. Tracks And Challenge Statements

Pick one track only.

### Track 1 - Financial Inclusion

Build for underserved users, including the unbanked and low-income communities.

What judges will look for:

- a specific underserved user
- low-end Android or weak-connectivity realism
- a plausible TNG eWallet distribution path

Idea seeds:

- offline-first or low-connectivity payments
- alternative credit scoring for gig workers
- micro-savings
- foreign-worker remittance
- financial literacy nudges

### Track 2 - Security And Fraud

Build something that detects scams and fraud before users send money.

What judges will look for:

- intervention before payout, not after
- friction vs false-positive tradeoff
- real Malaysian scam patterns

Idea seeds:

- real-time recipient risk score
- pressure or coercion check-in
- QR tamper detection
- behavioral biometrics during transfer
- community-fed fraud graph

TNG-relevant scam shortlist:

- phishing links and impersonation calls
- malware or malicious app installs
- mule-account abuse
- third-party binding and unauthorized purchases
- merchant QR or payout abuse

Why this matters:

- The strong demo is not a made-up generic fraud score.
- The strong demo shows one concrete scam path TNG plausibly cares about, then shows intervention before payout.

### Track 3 - Innovation

Build a secure AI-driven eWallet platform that improves transparency, compliance, and real-time insights.

What judges will look for:

- a concrete benefit for users or regulators
- an AI layer you can defend
- credible compliance automation

Idea seeds:

- natural-language financial copilot
- automated SAR or STR draft generator
- merchant anomaly analytics
- explainable categorization
- regulator dashboard

### How TouchnoGo Should Choose A Track

Use this order:

1. If you already have a prototype-shaped idea with domain depth, pick that track.
2. If not, pick the track with the strongest Malaysian-context insight.
3. If still tied, `Security & Fraud` is usually the easiest to make visceral in 4 minutes.

## 4. Deliverables And Submission

All 7 fields are required. Everything goes through one Google Form. Submission window is hard: Sunday 09:00-09:30.

### 4.0 The Seven Submission Fields

| # | Field | What to prepare |
|---|---|---|
| 1 | Team name | `TouchnoGo` exactly |
| 2 | Project name, description, track | Catchy name, 2-3 sentence description, chosen track |
| 3 | Implementation and inspiration | 150-250 words on what you built and why |
| 4 | Pitch deck link | Google Slides view link, PDF backup optional |
| 5 | Demo video link | YouTube unlisted or public Drive link |
| 6 | Deployment link | Live URL judges can open |
| 7 | GitHub repo link | Public repo with strong README |

Pre-submission drill:

- Put all 7 values in one Google Doc.
- Open every link in an incognito window.
- Tag the repo `v1-submission`.
- Have one person submit at 09:00 sharp.

### 4.1 GitHub Repository

- Assume public.
- README should open with problem, solution, architecture, run instructions, team, track, and cloud split.
- Commit hygiene matters.
- Add a LICENSE.
- Do not commit API keys, `.env`, or cloud credentials.

### 4.2 Pitch Deck

Target 8-12 slides:

1. Team and track
2. User and pain
3. Insight
4. One-line solution and hero screenshot
5. Architecture with two clouds and AI layer
6. AI detail: model, data flow, why AI belongs
7. Security and compliance posture
8. Business impact or metric moved
9. What you built in 22 hours vs what comes next
10. Team close

Rules:

- keep font size at least 24pt
- no walls of text
- one idea per slide

### 4.3 Demo Video

- Keep it under 4 minutes.
- Use problem -> demo -> differentiation -> close.
- Record with OBS or Loom.
- Export 1080p MP4.
- Upload unlisted to YouTube if possible.
- Record a rough backup version by midnight on Day 1.

### 4.4 Deployment

- Must be a live URL, not "clone and run locally."
- Use realistic Malaysian-context seed data.
- Have a backup screen recording in case venue Wi-Fi fails.

### 4.5 Submission Mechanics

- Channel: official Google Form distributed by organizers
- Window: Sunday 09:00-09:30
- After 09:30: prelim judging starts
- Freeze the repo at 09:00

### 4.6 Cloud And AI Requirements

These are not optional.

| Requirement | Detail | What to prove |
|---|---|---|
| Alibaba Cloud | USD 300, `ap-southeast-3` Malaysia only | show the region and the services used |
| AWS | USD 250, `ap-southeast-5` Malaysia or `ap-southeast-1` Singapore only | name the services and region |
| Multi-cloud | Must use at least 2 cloud platforms | one architecture slide with a real workload split |
| AI integration | Must be meaningful | explain the model, the data, and why AI beats rules here |

Practical split options:

- Alibaba for backend and DB in Malaysia, AWS Singapore for AI inference
- AWS for backend, Alibaba for AI layer in Malaysia
- AWS Malaysia for local infra, AWS Singapore for Bedrock-class AI, Alibaba for another real workload

Reminder:

- Bedrock, Textract, Rekognition, and Comprehend are Singapore only.
- Do not bolt on a second cloud just to satisfy the checkbox.

## 5. Judging Criteria

Same 5 criteria for prelims and finals.

| # | Criterion | Official meaning | What it means in practice |
|---|---|---|---|
| 1 | AI & Intelligent Systems | Effective and meaningful AI integration | defend why AI belongs and where rules win |
| 2 | Technical Implementation | Scalability, robustness, security, prototype | demo has to keep working after the first click |
| 3 | Multi-Cloud Service Usage | Purposeful use of at least two cloud platforms | both clouds must do real work |
| 4 | Impact & Feasibility | Real-world relevance, sustainability, adoption | TNG should sound able to pilot this |
| 5 | Presentation & Teamwork | Clarity, teamwork, documentation quality | clean deck, clear demo, obvious team execution |

### What The Criteria Mean In Practice

#### 1. AI & Intelligent Systems

- Wrong AI for the problem is a common failure mode.
- Do not spam AI features.
- A good answer is: AI handles judgment, evidence assembly, summarization, or replay tradeoffs; rules handle deterministic checks.

#### 2. Technical Implementation

- A flashy first 30 seconds is not enough.
- Be ready to answer what happens on timeout, weak evidence, duplicate events, stale data, and false positives.

#### 3. Multi-Cloud Service Usage

- The split has to map to latency, data residency, service availability, cost, or a specific managed capability.
- Do not use a second cloud for optics.

#### 4. Impact & Feasibility

- User must be real.
- Pain must be real.
- Workflow must sound pilotable by TNG.
- The pain must still be easy to feel in under 4 minutes.

#### 5. Presentation & Teamwork

- Clarity wins.
- UI polish, deck quality, README quality, and calm demo flow all matter.

### Practical Judging Traps

- LLM bolted onto a deterministic problem
- feature stuffing
- demo breaks after one click
- cosmetic multi-cloud
- real problem, weak story
- good idea, bad deck

### Judges We Know About

- Leslie Lip, CTO, TNG Digital
- Wei Wing Chiew, CPO, TNG Digital `[VERIFY exact role]`
- Choong Hon Keat, GM, Alibaba Cloud
- sponsor-side judges from Visa, AWS, OceanBase likely `[VERIFY]`

## 6. Prizes And Perks

### Competition Prizes

| Place | Prize |
|---|---|
| Grand Champion | MYR 25,000 |
| First Runner Up | MYR 15,000 |
| Second Runner Up | MYR 10,000 |
| Fourth Finalist | MYR 5,000 |
| Fifth Finalist | MYR 3,000 |

Note:

- Top 10 reach the grand final.
- `[VERIFY]` whether places 6-10 receive anything beyond finalist recognition.

### Lucky Draw Prizes

- 1 x MacBook Pro 14" M4
- 2 x Nintendo Switch 2
- 2 x iPhone 17 Pro 512 GB
- 2 x iPad Pro 11-inch 256 GB
- 2 x PS5 Slim Disc Edition with 2 controllers
- 2 x Sony WH-1000XM6

### Non-Cash Perks

- Alibaba and AWS credits
- swag
- food and drinks
- mentor access
- tech talks
- networking
- portfolio value

## 7. Schedule

### Day 1 - Saturday 2026-04-25

| Time | Item | TouchnoGo action |
|---|---|---|
| 08:15-08:45 | Arrival, registration, networking, breakfast | claim seats, power, badges |
| 08:45-09:00 | Main hall seating | confirm everyone can log into Alibaba, AWS, Qoder |
| 09:00-09:25 | Welcome address by Leslie Lip | take notes on rules and judging hints |
| 09:25-09:35 | Alibaba Cloud keynote | listen for service hints judges care about |
| 09:35-09:50 | Official launch | stay present, note announcements |
| 09:50-10:00 | Group photo | get a team shot |
| 10:00-10:45 | Hackathon briefing | capture rules, Wi-Fi, DQ triggers, pitch format |
| 11:00 | Build mode begins | lock track, persona, killer moment |
| 12:30-13:30 | Lunch | eat fast, take mentor opportunities |
| 13:30-18:00 | Mentorship | product lead and tech lead split if possible |
| 13:45-18:00 | Tech talks and lucky draws | send one person only if it helps |
| 18:30-20:00 | Dinner | record a rough backup demo before people drift |
| 20:00 onward | Build time and side events | stay focused |
| 00:00 onward | Night shift | keep noise low, use rest areas if needed |

### Day 2 - Sunday 2026-04-26

| Time | Item | TouchnoGo action |
|---|---|---|
| 07:30-08:45 | Breakfast and mingle | final polish, no new features |
| 08:45-09:00 | Welcome back and final briefing | capture last-minute rules |
| 09:00-09:30 | Submission window | one person submits, everyone else freezes git |
| 09:30-12:00 | Preliminary judging | know your station and stay ready |
| 12:00-13:00 | Lunch | if Top 10, rehearse on pitch laptop |
| 13:00-16:00 | Top 10 final pitches | finalists pitch, others network |
| 16:00-17:00 | Winner announcement and closing | photos, contacts, thank mentors |
| 17:00 onward | Networking | trade LinkedIn contacts |

## 8. Pre-Event Checklist

### Every Team Member Brings

- laptop and charger
- power bank
- phone charger
- headphones
- jacket or hoodie
- water bottle
- photo ID
- registration confirmation
- participant lanyard
- comfortable shoes
- toiletries
- prescription or allergy medication

### Team-Level Prep

- decide roles before kickoff
- shortlist 2-3 ideas per track
- create the repo before the event
- create a shared drive folder
- join Discord
- pre-install the stack and CLIs
- log into Alibaba SSO and set region to `ap-southeast-3`
- log into AWS and set region to `ap-southeast-5` or `ap-southeast-1`
- accept the Qoder invite
- create an architecture slide placeholder with two clouds and AI layer
- assign one scribe for the briefing
- save emergency contact numbers

### Team Name And Identity Prep

- prepare one clean sentence on why the team is named TouchnoGo
- have a team slide ready
- plan a group photo

## 9. Venue And Logistics

### Address

Grand Summit, Connexion Conference & Event Centre, Level M1, The Vertical, Bangsar South City, No. 8 Jalan Kerinchi, 59200 Kuala Lumpur

### Getting There - LRT

Route from Kerinchi LRT:

1. Exit at Kerinchi LRT.
2. Walk through the Kerinchi Link Bridge toward Avenue 7 and The Horizon.
3. Take the escalator up toward Luckin Coffee.
4. Walk straight until you see e-mart on the left.
5. Continue past e-mart.
6. Walk until AEON MaxValu Prime Sphere Bangsar.
7. Turn right at the roundabout.
8. Cross the zebra crossing toward the Vertical Podium.
9. Go up to the first floor and turn left to reach Connexion.
10. If you see Botanica + Co, you can use the elevator there to reach Grand Summit Level M1.

### Getting There - Self Drive

- Accessible via Federal Highway, NPE, SPRINT, and SPE.
- Park at The Vertical or Nexus @ Bangsar South.
- Weekend and public holiday flat rate is RM 3.00.

### On-Site Notes

- Wi-Fi should exist, but `[VERIFY]` SSID and password at briefing.
- Expect Wi-Fi to degrade under load.
- Bring a multi-plug.
- Dress smart casual.

### Housekeeping Rules

- Keep noise down after midnight.
- Do not loiter in restricted areas after midnight.
- Use designated bins.
- Go to the Tech Partner Booth for tech issues.
- Wear the lanyard visibly at all times.

### Overnight Sleeping

- Rest areas are Pinnacle 7 and Pinnacle 8.
- Claim space before midnight if you need it.
- Rotate sleep if staying overnight.

### When Something Breaks

- Tech or system issue: Tech Partner Booth or Discord tech support
- AWS issue: `AWS Support` channel
- Alibaba issue: `Alibaba Cloud Support` channel
- Venue or food issue: organizer desk
- Medical issue: notify organizers immediately

## 10. TouchnoGo Strategy Playbook

### Current Best Call

- Track: `Security & Fraud`
- Product: `AI-native pre-payout decision workspace for fraud + AML ops`
- Hero case: `cross-border near-watchlist payout`
- Hero replay: `watchlist-payout`, the watchlist threshold tradeoff replay
- Core wedge: `evidence graph + specialist agents + human action rail + replay lab`

Why this is the current best call:

- it fits the repo direction already in motion
- it uses AI where AI helps
- it lands on a real intervention before money moves
- it gives the pitch a clean before-and-after moment

### Weekend Build Order

1. End-to-end hero case that ends in a visible pre-payout action.
2. One-screen investigation workspace.
3. Evidence-backed recommendation, human approval, and note export.
4. Purposeful multi-cloud split.
5. Replay lab for one policy tradeoff.
6. Queue ranking and one backup case.
7. Thin customer step-up moment only if the first six are already stable.

### 10.1 Role Assignment

| Person | Primary | Secondary |
|---|---|---|
| A | Product / PM | backend glue or deck |
| B | Tech lead | frontend pairing |
| C | Builder | seed data and demo script |
| D | Design / storyteller | scribe or one-pager README |

Rules:

- everyone codes or writes content
- one person owns the demo laptop from hour 20 onward
- no late merges

### 10.2 The 22-Hour Build Plan

#### Hours 0-1.5, frame

- lock track, user, one-line solution, success metric
- sketch the happy path
- decide the cloud split and AI layer
- identify the one killer moment

#### Hours 1.5-6, walking skeleton

- get the thinnest end-to-end version working on both clouds
- cut scope hard if both clouds are not real by hour 6
- get early mentor input

#### Hours 6-12, deepen the core

- improve only what makes the killer moment stronger
- replace placeholder AI with the real AI path you want to defend
- keep logs of prompts and responses

#### Hours 12-18, polish

- make the seed data feel local and real
- write README, deck outline, and demo script
- record a rough backup video before sleep

#### Hours 18-21, submission build

- tag a candidate submission build
- record the submission-cut demo video
- finalize the deck
- put all 7 submission values in the pre-flight doc

#### Hour 21-22, pre-flight

- no new features
- no new commits after 08:55
- open every link in incognito
- test the live URL on a phone
- submit at 09:00

#### After submission

- rehearse the pitch twice
- do one hostile Q&A run
- if Top 10, spend lunch on AV and rehearsal, not new slide edits

### 10.3 Mentor Leverage

- Mentorship runs Day 1, 13:30-18:00
- Expect 10-15 minutes per team

Rules:

1. Bring a specific question.
2. Show the prototype, do not only describe it.
3. End with a commit: what you will change based on the feedback.
4. Split mentor-hunting between product and tech if possible.

### 10.4 Common Failure Modes

- over-scoping
- demo breaks on stage
- deck started too late
- team drift after dinner
- no clear story
- cosmetic multi-cloud
- shallow AI

### 10.5 Pitch Structure

Suggested 4-minute flow:

1. 00:00-00:30: hook with the problem in a real Malaysian voice
2. 00:30-01:00: named user and context
3. 01:00-02:30: live demo of the killer moment
4. 02:30-03:00: architecture with two clouds and AI
5. 03:00-03:30: why this is hard and why now
6. 03:30-03:50: what you built in 22 hours vs next
7. 03:50-04:00: close

Q&A to rehearse:

- why AI, not rules
- why two clouds
- how it scales
- false-positive risk
- how the team split work
- what a compliance or risk leader would say

## 11. Rules, Ethics, And Code Of Conduct

### Participation Rules

- Code should be written during the hackathon window `[VERIFY exact policy]`
- no sharing submissions between teams
- respect other teams
- follow housekeeping rules
- organizer decisions are final

### Intellectual Property

- Expect teams to retain IP while granting the organizer a showcase license `[VERIFY exact clause]`
- do not use unlicensed images, music, or datasets

### Data And Privacy

- keep all TNG-related data synthetic
- for fraud track demos, use synthetic scam transcripts and anonymized patterns

### Code Of Conduct

- be respectful
- report problems to organizers
- act professionally

## 12. Comms And Useful Links

### Primary Channels

- Website: `https://www.tngdigitalfinhack.com`
- Registration portal: `https://register.tngdigitalfinhack.com/`
- Terms PDF: `https://tngdigitalfinhack.com/docs/Terms%20of%20Participation.pdf`
- Briefing deck: `https://canva.link/lzlidhwtoukod2w`

### Critical Operational Links

- Alibaba Cloud SSO login: `https://signin-ap-southeast-1.alibabacloudsso.com/finhack/login`
- AWS login: `https://d-9667a99701.awsapps.com/start/`
- Qoder invite: `https://qoder.com/organization/invitation/qdH0yjoCGArxKE0NlScnGMjpOzONCoR0`
- Submission Google Form: shared by organizers on-site or in Discord

### Discord Channels

- `General`
- `Announcement`
- `Tech Support Ticketing System`
- `AWS Support`
- `Alibaba Cloud Support`

### Emergency Contacts

| Contact | Role | Phone |
|---|---|---|
| Carl | Event team | +6012-690 8511 |
| Lee Tian | Event team | +6012-243 1204 |
| Emily | TNG Digital | +6012-883 3718 |
| Jeng Yee | Developer Kaki | +6019-476 5833 |

### Social And Community

- Instagram: `@LifeAtTNGD`, `@touchngoewallet`
- LinkedIn: TNG Digital
- Facebook group: Hackathon Kaki

### Sponsors

- Alibaba Cloud
- AWS
- OceanBase
- Visa
- 3Particle
- Developer Kaki

## 13. Open Questions

1. Exact eligibility policy `[VERIFY]`
2. Exact IP and license clause `[VERIFY]`
3. Pre-existing code policy `[VERIFY]`
4. Preliminary pitch time limit and format `[VERIFY]`
5. Wi-Fi SSID and password `[VERIFY]`
6. Whether places 6-10 receive anything beyond finalist recognition `[VERIFY]`
7. Exact disqualification triggers `[VERIFY]`
8. Exact booking process for mentor slots `[VERIFY]`
9. Exact shortlist announcement timing `[VERIFY]`
10. Wei Wing Chiew's exact title `[VERIFY]`
11. Dietary requirements handling on-site `[VERIFY]`
12. Final official Google Form URL, captured and pinned by the team `[VERIFY]`

## Appendix A - Handbook Changelog

| Version | Date | Notes |
|---|---|---|
| 0.1 | 2026-04-24 | Initial draft from public sources |
| 0.2 | 2026-04-24 | Added verified submission flow, cloud credits, overnight rules, login links |
| 0.3 | 2026-04-24 | Added full briefing-deck facts, corrected AWS credit and region details, fixed the true build window |
| 0.4 | 2026-04-25 | Added Day 1 judging notes and aligned the repo around the current product call |

## Appendix B - Sources

- TNG Digital FINHACK 2026 briefing deck
- TNG Digital FINHACK official site
- Instagram launch post
- Instagram reel
- LinkedIn post by Daren Tan
- LinkedIn post by Leslie Lip
- LinkedIn sponsor post by TNG Digital
- Developer Kaki Facebook announcement
- Hackathon Kaki Facebook listing
- TikTok promo
- Terms of Participation PDF
- Touch 'n Go eWallet security centre
- Touch 'n Go digital wallet security tips
- Touch 'n Go merchant guidebook
- Touch 'n Go phishing report page
- MCMC scam-pattern explainer
- Bryan's Lab fraud notes
- Bryan's Lab fraud ML notes
