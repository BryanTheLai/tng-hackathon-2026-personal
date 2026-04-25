# Voice Call Agent Research

Date: 2026-04-26

## Question

Can `tng-hackathon-2026-personal` add a phone-call agent for the ATO flow, using the existing Twilio number, so the system calls the user and asks:

- "Was this really you?"
- user says or presses `it was me` or `it was not me`
- system continues the case flow

## Short answer

Yes, technically.

But the best hackathon version is **not** a human-like conversational agent pretending to be TNG fraud ops.

The best version is a **short, branded outbound verification call**:

1. freeze or step-up action is triggered
2. system places an outbound call
3. first line says it will **never ask for OTP, PIN, password, or money transfer**
4. user only gives a minimal signal:
   - press `1` or say `it was me`
   - press `2` or say `not me`
   - press `3` for app/support follow-up
5. system updates the case and tells the user to finish recovery in the official app or support flow

That is much safer and more believable than a long freeform AI conversation.

## Why this is the right product call

The current repo already has a strong seeded flow:

- detect likely ATO
- show evidence
- apply action
- send prompt
- resolve case

Today that prompt channel is WhatsApp-first.

Adding voice should be treated as a **second intervention rail**, not a rewrite of the product.

The current docs also explicitly say "no live customer call workflow" in `focus.md`. That was a scope-control decision, not a technical limitation. If voice is added, it should stay thin and operational:

- notifier
- confirmation capture
- case state transition
- handoff back to official channel

Not:

- open-ended fraud interview
- knowledge-heavy support call
- KYC-by-phone
- OTP collection

## What the other repos prove

### `IRELIA-AI`

What it proves:

- real-time voice agent in Next.js
- ElevenLabs conversational sessions
- contextual updates during a live session
- client-driven state shaping the agent behavior

What is reusable:

- voice-agent prompt discipline
- state-driven conversation updates
- session lifecycle handling

What is not directly reusable:

- browser WebRTC flow is not the same as PSTN phone calling
- negotiation tone is the opposite of what fraud verification needs

### `gemini-hackathon-31dec2025`

What it proves:

- tool-calling pattern from voice into app actions
- app-visible state updates from an agent
- backend orchestration around a voice surface

What is reusable:

- "voice -> tool -> state mutation" shape
- clear tool boundaries
- explicit end-call behavior

What is not directly reusable:

- drive-thru conversational style is safe to automate heavily
- ATO verification has a much higher trust and phishing-risk bar

### `tng-hackathon-2026-personal`

Current state:

- seeded WhatsApp prompt flow exists
- inbound/status webhook routes exist in seeded mode
- prompt resolution service exists
- real Twilio adapter is still missing
- `focus-spec-plan-v1.md` assumes WhatsApp, not voice

Implication:

The cleanest move is to add **`VOICE_CALL` as another prompt channel** beside WhatsApp.

## Recommended product shape

### Recommended v1

Use a **Twilio-only IVR-style verification call**.

Script shape:

1. "This is Touch 'n Go eWallet security."
2. "We detected unusual sign-in activity."
3. "We will never ask for your OTP, PIN, password, or ask you to move money."
4. "If this login was you, press 1 or say `it was me`."
5. "If this login was not you, press 2 or say `not me`."
6. "To continue in the official app or get support, press 3."

Case mapping:

- `1` => `REACTIVATED` or `ALLOW_AFTER_STEP_UP`
- `2` => `BLOCKED` or `ESCALATED`
- `3` => `ESCALATED`
- no answer / voicemail / timeout => `ESCALATED`

Why this wins:

- easier to build
- easier to demo
- lower phishing resemblance
- cleaner audit trail
- no need for long-form speech reasoning

### Recommended v1.5

Use **Twilio + ElevenLabs register-call** only if you need:

- dynamic spoken explanations based on case evidence
- multilingual voice beyond a rigid IVR
- richer follow-up phrasing

But even then, keep the decision surface constrained to:

- `yes`
- `no`
- `help`

Do not let the voice agent improvise identity-verification policy.

## What not to do

Do not build a call that:

- asks for OTP
- asks for PIN or password
- asks the user to transfer money
- sounds like a generic assistant with no strong identity cues
- lets the user complete sensitive recovery fully by voice
- makes irreversible decisions from ambiguous natural language alone

## External product constraints that matter

### Fraud-call trust problem

FTC guidance is blunt:

- if a caller claiming to be a bank asks you to move money, it is a scam
- if a caller asks for a verification code, it is a scam
- users should verify through the official bank contact path, not the caller-provided path

That means the phone-call demo must be designed to **avoid teaching the wrong behavior**.

So the call should say early:

- we will never ask for OTP, PIN, password, or transfer
- continue only through the official Touch 'n Go app or official support

### Twilio Voice primitives

Twilio already gives the exact building blocks needed:

- outbound call creation
- status callbacks for `initiated`, `ringing`, `answered`, `completed`
- `<Gather>` for `dtmf`, `speech`, or `dtmf speech`
- answering machine detection
- webhook signature validation with `X-Twilio-Signature`

That is enough to ship a clean fraud-alert IVR without adding a full agent layer.

### ElevenLabs telephony options

ElevenLabs offers three relevant paths:

1. native Twilio integration
   - easiest
   - import Twilio number into ElevenLabs
   - ElevenLabs auto-configures webhooks
2. register-call endpoint
   - keep control of Twilio
   - your server receives Twilio webhook
   - your server asks ElevenLabs for TwiML
   - Twilio gets that TwiML back
3. ElevenLabs outbound-call API via Twilio
   - fastest if you want ElevenLabs to originate the call through its Twilio integration

For TNG, path `2` is the cleanest if you want custom case-state routing.

## Recommended architecture for TNG

### Option A: Twilio-only call verifier

Best for the hackathon.

```text
Case action triggered
  ->
CallOrchestrator creates outbound Twilio call
  ->
Twilio hits /api/webhooks/twilio/voice/outbound
  ->
Next.js returns TwiML with Say + Gather
  ->
User presses 1/2/3 or says yes/no/help
  ->
Twilio hits /api/webhooks/twilio/voice/gather
  ->
ResolutionService maps result to case outcome
  ->
Audit trail + timeline update
```

Suggested new routes:

- `POST /api/webhooks/twilio/voice/outbound`
- `POST /api/webhooks/twilio/voice/gather`
- `POST /api/webhooks/twilio/voice/status`
- optional `POST /api/webhooks/twilio/voice/amd`

Suggested new domain pieces:

- `PromptChannel.VOICE_CALL`
- `PromptState.CALL_INITIATED`
- `PromptState.CALL_ANSWERED`
- `PromptState.USER_CONFIRMED_YES`
- `PromptState.USER_CONFIRMED_NO`
- `PromptState.CALL_NO_ANSWER`
- `PromptState.VOICEMAIL`

### Option B: Twilio + ElevenLabs secure voice agent

Only if the demo needs a more "wow" moment.

```text
Case action triggered
  ->
Twilio places outbound call
  ->
Twilio webhook hits /api/webhooks/twilio/voice/outbound
  ->
Server calls ElevenLabs register-call
  ->
ElevenLabs returns TwiML for agent connection
  ->
Agent speaks with strong guardrails
  ->
tool / webhook / end-call state updates TNG case
```

Guardrails:

- fixed first message
- strict allowed intents
- no freeform identity verification
- no secret collection
- no policy improvisation

## MCP and tooling view

### Do you need MCP for the product itself?

No.

The product runtime should stay:

- normal app routes
- Twilio webhooks
- Twilio REST API calls
- optional ElevenLabs API calls

MCP is optional for **builder ergonomics**, not for the user-facing phone flow.

### Useful MCP reality

Twilio has an official **Twilio Alpha MCP server**.

What it is good for:

- listing/managing Twilio resources during development
- letting an AI assistant inspect Twilio APIs through filtered tools
- speeding up setup work

Why I would not put it in the runtime path:

- it is alpha / PoC positioning
- Twilio itself recommends using only trusted official MCP servers with it
- runtime call handling is simpler and safer through direct SDK/API integration

### MCP model to remember

Per the MCP spec:

- `prompts` are user-controlled
- `resources` are application-controlled context
- `tools` are model-controlled actions

For this use case:

- case data should be a resource
- "create outbound call" is a tool
- "render secure fraud-call script" could be a prompt/template

But again, that is a builder abstraction, not required for the shipped demo.

## Best implementation choice

### My recommendation

Ship this order:

1. keep WhatsApp as the first working intervention rail
2. add `VOICE_CALL` as a second rail
3. implement Twilio-only IVR call first
4. add ElevenLabs only if the demo still needs more drama

### Why

- fastest path
- safest trust posture
- easiest to explain to judges
- reuses existing prompt/resolution architecture
- avoids looking like a phishing simulator

## Build slice

### Smallest believable slice

1. extend prompt channel enum with `VOICE_CALL`
2. add a new call orchestration service
3. create outbound call with Twilio SDK
4. return TwiML with a short branded `<Say>` + `<Gather input=\"dtmf speech\">`
5. map `1`/`it was me` and `2`/`not me` into case resolution
6. validate all voice webhooks with Twilio signature validation
7. show call status in the case timeline

### Nice demo extras

- answering machine detection
- branded `callReason` / branded calling if your account supports it
- multilingual script variants
- replay lab showing "voice call sent" as a channel policy choice

## Suggested script

This is the shape, not final compliance copy:

> This is Touch 'n Go eWallet security calling about unusual login activity.
> We will never ask for your OTP, PIN, password, or ask you to move money.
> If this login was you, press 1 or say "it was me."
> If this login was not you, press 2 or say "not me."
> To continue securely in the official app or get support, press 3.

## Docs inventory

### Twilio

- Outbound Voice calls:
  - https://www.twilio.com/docs/voice/make-calls
- Calls resource and advanced parameters:
  - https://www.twilio.com/docs/voice/api/call-resource
- TwiML Gather:
  - https://www.twilio.com/docs/voice/twiml/gather
- Webhook security and signature validation:
  - https://www.twilio.com/docs/usage/webhooks/webhooks-security
- Twilio Alpha MCP intro:
  - https://www.twilio.com/en-us/blog/introducing-twilio-alpha-mcp-server
- Twilio MCP repo:
  - https://github.com/twilio-labs/mcp

### ElevenLabs

- Native Twilio integration:
  - https://elevenlabs.io/agents/integrations/twilio
- Register Twilio call:
  - https://elevenlabs.io/docs/eleven-agents/phone-numbers/twilio-integration/register-call
- Twilio outbound call API:
  - https://elevenlabs.io/docs/conversational-ai/api-reference/twilio/outbound-call

### MCP

- MCP server overview:
  - https://modelcontextprotocol.io/specification/latest/server
- MCP resources:
  - https://modelcontextprotocol.io/specification/2025-06-18/server/resources
- MCP tools:
  - https://modelcontextprotocol.io/specification/2025-11-25/server/tools

### Trust / anti-phishing

- FTC warning on fraud-alert calls:
  - https://consumer.ftc.gov/consumer-alerts/2024/06/got-call-about-fraud-activity-your-bank-account-it-could-be-scammer

## Local repo implications

Files worth updating later if voice is approved:

- `focus.md`
- `focus-spec-plan-v1.md`
- `lib/domain/*`
- `lib/services/prompt-service.ts`
- `lib/services/resolution-service.ts`
- `app/api/webhooks/twilio/*`
- add `lib/integrations/twilio-client.ts`

## Final call

For `tng-hackathon-2026-personal`, the right move is:

- **yes** to a call experience
- **no** to a freeform phisher-sounding agent
- **yes** to a short secure outbound verifier
- **yes** to keeping WhatsApp and voice as sibling channels
- **yes** to Twilio-first implementation
- **maybe later** to ElevenLabs for a richer voice layer
