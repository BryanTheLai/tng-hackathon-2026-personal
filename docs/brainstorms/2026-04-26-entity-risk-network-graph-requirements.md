---
date: 2026-04-26
topic: entity-risk-network-graph
---

# Entity Risk Network Graph

## Problem Frame

Fraud analysts opening a case see linked entities (devices, beneficiaries, connected accounts) in a flat table. There is no way to quickly grasp the shape of the fraud network — how the flagged account connects to prior cases, shared devices, or suspicious beneficiaries. A visual graph makes the blast radius of a case scannable in seconds.

## Requirements

- R1. A "Risk network" button appears in the case header action row alongside "Score logic", "Evidence pack", and "Policy basis".
- R2. Clicking "Risk network" opens a sheet containing an interactive node-link graph.
- R3. The graph renders the flagged account as the root node, with `linkedEntities` as connected nodes radiating outward.
- R4. Nodes are colored by entity type: account (primary dark), device (blue/info), beneficiary (warning amber), other (neutral).
- R5. Nodes with a non-empty `riskNote` are visually highlighted (warning border or icon).
- R6. Each edge is labeled with the `relationship` text from the linked entity.
- R7. Hovering or clicking a node reveals a tooltip/panel showing `label`, `entityType`, and `riskNote`.
- R8. The graph is interactive: draggable nodes, scroll-to-zoom.
- R9. When a case has no linked entities, the sheet shows the account node alone with a "No linked entities on this case" callout.
- R10. Seed data is enriched so at least two cases have 3+ linked entities (mix of device, beneficiary, and linked account types) to make the demo non-trivial.

## Success Criteria

- Opening "Risk network" on CASE-ATO-001 shows a meaningful multi-node graph, not a single node.
- An analyst can identify the most suspicious entity (highest-risk node) without reading the linked entities table.
- The graph fits within the sheet without horizontal scroll at 1280px viewport width.
- The visual style is consistent with DESIGN.md: cool neutrals, IBM Plex Mono for IDs and labels, no decorative gradients.

## Scope Boundaries

- The graph only visualizes `linkedEntities` on the current case record — cross-case entity lookups are out of scope.
- No real-time graph updates; data is from the seeded static dataset.
- The existing linked entities table on the "Why this case is high-risk" section is not removed — both can coexist.
- Score components and evidence items are not rendered as graph nodes (that is a separate concern).

## Key Decisions

- **React Flow (`@xyflow/react`) over custom SVG:** Provides interactive drag/zoom and built-in node/edge rendering with minimal custom code. Carries cost of one new dependency (~80KB). Acceptable for this project scale.
- **New "Risk network" sheet, not Score logic sheet:** Entity relationships are semantically distinct from score components. Merging them would confuse the analyst's mental model.
- **Seed data enrichment required:** Current data has only 1 linked entity across 3 cases — insufficient for a meaningful demo. Enrichment is in scope.

## Dependencies / Assumptions

- `@xyflow/react` v12+ supports React 19 (verified as of April 2026).
- The existing `Sheet` component in `components/ui/sheet.tsx` can accommodate a wider `max-w` variant for the graph sheet.

## Outstanding Questions

### Deferred to Planning

- [Affects R2][Technical] Does the Sheet component need a `wide` prop variant, or should it be a separate modal?
- [Affects R8][Needs research] What is the correct `@xyflow/react` layout algorithm for a hub-and-spoke entity graph (dagre, elk, or manual positioning)?
- [Affects R10][Technical] How many entities per case type (ATO vs UTX) is realistic to seed without it feeling fabricated?

## Next Steps

→ `/ce:plan` for structured implementation planning
