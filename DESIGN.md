# Design System - TNG RiskOps Agent

## Product Context
- **What this is:** A seeded, operator-facing risk workspace for account takeover and unauthorized transaction investigations.
- **Who it's for:** Fraud analysts, risk operators, and product judges who need to understand the workflow at a glance.
- **Space/industry:** Financial operations, fraud controls, internal decisioning tools.
- **Project type:** Dense web app workspace.

## Current UX Issues
- The old UI looked like stacked demo cards instead of a working app. Too many bordered boxes carried equal weight, so nothing felt primary.
- The shell, background, and rounded treatment all had the same softness. That made the product feel generic and AI-generated instead of operational.
- The queue required too much reading. Important case differences were buried in body text instead of scan-friendly rows, icons, and score/action contrast.
- The case view had the right data but weak grouping. Facts, inference, prompt state, and audit all competed visually.
- The controls screen did not answer basic operator questions: What is a draft? What does replay do? Where are all my rules? How do I edit without touching code?

## Aesthetic Direction
- **Direction:** Institutional operations workspace.
- **Decoration level:** Minimal and deliberate.
- **Mood:** Calm, credible, and sharp. More Stripe Radar than pitch deck. The UI should feel like a tool that can be used under pressure.
- **Reference sites:** Stripe Radar rules UI, Stripe data tables, modern operator consoles.

## Typography
- **Display/Hero:** Instrument Sans - clean without feeling default or startup-template generic.
- **Body:** Instrument Sans - one family keeps the dense workspace calm.
- **UI/Labels:** Instrument Sans with heavier weights for navigation and table headers.
- **Data/Tables:** IBM Plex Mono for IDs, timestamps, thresholds, versions, and other machine-like values.
- **Code:** IBM Plex Mono.
- **Loading:** `next/font/google`.
- **Scale:** 11 / 12 / 14 / 15 / 16 / 18 / 24 / 32 with strong use of tabular numerals.

## Color
- **Approach:** Restrained.
- **Primary:** `#0f172a` - default shell contrast and decisive action color.
- **Secondary:** `#0f766e` - replay, controls, and positive operational emphasis.
- **Neutrals:** Cool gray-blue surfaces from `#f6f8fb` to `#102033`.
- **Semantic:** success `#15803d`, warning `#b45309`, error `#be123c`, info `#0369a1`.
- **Dark mode:** Not implemented. If added later, keep the same hierarchy and lower saturation rather than inverting everything blindly.

## Spacing
- **Base unit:** 4px.
- **Density:** Compact-comfortable. This is an ops tool, so density matters, but rows still need breathing room.
- **Scale:** 4 / 8 / 12 / 16 / 24 / 32 / 40 / 48.

## Layout
- **Approach:** Grid-disciplined app layout.
- **Grid:** Main content plus a sticky right rail on desktop; stacked sections on mobile.
- **Max content width:** ~1500px shell.
- **Border radius:** 6 / 8 / 10 / 12. Panels are squarer now. Small chips and badges can stay tighter, but nothing should feel bubbly.

## Motion
- **Approach:** Minimal-functional.
- **Easing:** Standard ease transitions only.
- **Duration:** 140-180ms for hover and state change. No decorative choreography.

## Interaction Rules
- Queue, case, and rules screens should always reveal the primary decision path within one viewport.
- Tables are the default for dense operational data. Cards are only allowed when the card is the interaction.
- Important actions must explain themselves in nearby copy. `Keep draft` and `Replay draft` are not allowed to float as ambiguous buttons.
- Icons must clarify category or state, not decorate empty space.
- Facts and inference stay visually separated.
- Right rails must earn their width by holding action and status, not restating content already visible in the main area.

## Screen Decisions

### Queue
- Lead with one live signal block, then the actual queue table.
- Show case, user, signals, state, score, and next action in one scan line.
- Use compact signal chips with icons so the operator can recognize device reset / PIN reset / beneficiary signals without reading paragraphs.

### Primary Case
- Put score, recommendation, prompt, and resolution in one top row.
- Treat the timeline as a table, not a stack of cards.
- Move evidence into a real register table so source and policy coverage are obvious.
- Keep the action rail sticky and decisive.

### Rules Workspace
- Replace the vague controls surface with a real rules inventory plus a rule builder.
- `Keep draft` means save the working copy locally in the session.
- `Replay draft` means apply the current draft to seeded scenarios and update the replay output.
- Show all rules before the builder. Operators need orientation before editing.
- Variables must be visible in a registry table so rule logic does not feel magical or hard-coded.

## Anti-Slop Rules
- No equal-radius treatment on every surface.
- No floating-card mosaic layouts for app pages.
- No ornamental gradients or decorative icon circles.
- No paragraph-heavy explanation when a row, icon, badge, or table can say it faster.
- No hidden product logic inside source code when it can be represented in typed seed data and visible UI.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-25 | Switched to a table-first workspace design | Operators need scan speed more than card-based presentation |
| 2026-04-25 | Replaced soft rounded styling with squarer surfaces | The old radius treatment made the app feel generic and less trustworthy |
| 2026-04-25 | Reframed controls as a rules workspace | Users should be able to see and edit rule logic in UI, then replay it safely |
