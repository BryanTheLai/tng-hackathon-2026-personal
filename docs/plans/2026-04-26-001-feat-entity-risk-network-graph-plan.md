---
title: "feat: Add Entity Risk Network Graph to Case Detail"
type: feat
<<<<<<< HEAD
status: completed
=======
status: active
>>>>>>> 5cafc83 (feat(case): add entity risk network graph to case detail)
date: 2026-04-26
origin: docs/brainstorms/2026-04-26-entity-risk-network-graph-requirements.md
---

# feat: Add Entity Risk Network Graph to Case Detail

## Overview

Adds an interactive entity relationship graph to the case detail screen. A new "Risk network" button opens a wide slide-out sheet containing a React Flow node-link graph. The root node is the flagged account; child nodes are the case's `linkedEntities` (devices, beneficiaries, linked accounts). Edges are labeled with the relationship text. Node color encodes entity type; a danger highlight marks any node with a non-empty `riskNote`. The seed data is enriched to give at least two cases three-plus entities so the demo is non-trivial.

## Problem Frame

Fraud analysts see linked entities only as a flat table. There is no way to quickly grasp the shape of the fraud network — how a flagged account connects to shared devices, beneficiaries, or prior cases. A visual graph makes the blast radius scannable in seconds. (See origin: docs/brainstorms/2026-04-26-entity-risk-network-graph-requirements.md)

## Requirements Trace

- R1. "Risk network" button in case header action row alongside Score logic / Evidence pack / Policy basis.
- R2. Button opens a sheet containing an interactive node-link graph.
- R3. Root node = `maskedUserLabel` + `caseId`; child nodes = `linkedEntities` items.
- R4. Node color by entity type: account root (primary dark/TNG orange border), DEVICE (info blue), BENEFICIARY (warning amber), ACCOUNT (success green), other (neutral).
- R5. Non-empty `riskNote` → danger border highlight on node.
- R6. Each edge labeled with `relationship` text from the linked entity.
- R7. Node hover/click shows tooltip with `label`, `entityType`, and `riskNote`.
- R8. Interactive: draggable nodes, scroll-to-zoom, pan.
- R9. Zero-entity case → account node alone with a callout.
- R10. Seed data enriched: at least two cases have 3+ linked entities covering DEVICE, BENEFICIARY, and ACCOUNT types.

## Scope Boundaries

- Graph only visualizes `linkedEntities` on the current case record — no cross-case lookups.
- No real-time or live data updates; static seeded dataset.
- The existing linked entities table in "Why this case is high-risk" remains — both coexist.
- Score components and evidence items are not graph nodes.

## Context & Research

### Relevant Code and Patterns

- `components/ui/sheet.tsx` — custom Sheet component; currently `width: min(560px, 100vw)` via `.sheet-panel` CSS class. Has no `wide` prop; one must be added.
- `app/globals.css` — all sheet sizing lives in `.sheet-panel` and `.sheet-card`. Mobile override at `@media (max-width: 820px)` sets the sheet to a full-width bottom drawer.
- `components/screens/case-screen.tsx` — `"use client"`, `SheetKind` union drives which sheet is open, four existing `<Sheet>` render blocks at component bottom; header action row uses `className="flex flex-wrap gap-1.5"` with `button-secondary` + lucide icon pattern.
- `lib/domain/schema.ts` — `linkedEntitySchema` fields: `entityId` (string), `entityType` (string — not an enum, convention only), `label`, `relationship`, `riskNote`. All strings; no schema change required to add new entity types.
- `components/ui/status-badge.tsx` — existing `toneMap` color approach (border/bg/text per key) is the pattern to mirror for node type colors.
- Design tokens from `app/globals.css`: `--info: #38bdf8` / `--info-soft`, `--warning: #f0a500` / `--warning-soft`, `--success: #1db86a` / `--success-soft`, `--danger: #e03535` / `--danger-soft`, `--surface-contrast: #0c2040`, `--tng-orange: #ff6600`, `--line-strong`, `--muted`, `--muted-strong`.
- `lucide-react` 0.511 includes a `Network` icon — use for the Risk network button.

### Institutional Learnings

- No `docs/solutions/` directory exists in this project; no prior institutional knowledge to carry forward.

### External References

- `@xyflow/react` v12 confirmed React 19 compatible (updated October 2025).
- `nodeTypes` constant **must be defined at module level** (outside the component) — if defined inside the render function, it gets a new reference every render and React Flow re-mounts every node on every update.
- `fitView` as a prop fires once at mount. The current Sheet uses `if (!open) return null` (no CSS animation), so the container is fully sized at mount. Use `fitView` prop plus `onInit={(instance) => setTimeout(() => instance.fitView({ padding: 0.25 }), 80)}` as a belt-and-suspenders fallback for any sub-frame timing edge.
- React Flow CSS must be imported inside `@layer base` in Tailwind v4 globals: `@layer base { @import "@xyflow/react/dist/style.css"; }`.
- Bundled deps: `d3-drag`, `d3-zoom`, `zustand` — no separate installs needed.
- Peer deps: React ≥17 (this project has React 19). Package name: `@xyflow/react`.

## Key Technical Decisions

- **Manual radial positioning over dagre/elk:** A hub-and-spoke graph with ≤6 nodes does not warrant a layout library. Compute child node positions by evenly distributing angles around a circle (radius ≈ 220px, origin at 0,0), starting from the top (angle offset of −π/2). `fitView` normalizes the viewport regardless of coordinate values.
- **Two custom node types (`rootNode`, `entityNode`):** Distinct visual treatment for the central account node vs. entity nodes. Defined as module-level `nodeTypes` constant to satisfy React Flow's reference-stability requirement.
- **Built-in edge `label` prop:** Relationship text is short; the native SVG label mechanism is sufficient. Use `labelStyle` and `labelBgStyle` inline style props to match the dark theme. A `CustomEdge` component with `EdgeLabelRenderer` is not needed.
- **`wide?: boolean` prop on Sheet:** The graph needs ≈900px. Adding a prop that switches the CSS class from `.sheet-panel` to `.sheet-panel-wide` is the minimal, pattern-consistent change. No parallel modal system.
- **Node tooltip via selected-state panel:** On node click, show a small HTML panel below the graph (not a floating tooltip) displaying `label`, `entityType`, and `riskNote`. This avoids z-index and overflow issues inside the sheet. Toggle visibility by tracking `selectedNodeId` in component state.
- **No `<Background />`, `<MiniMap />`, or `<Controls />`:** These are opt-in children of `<ReactFlow>`; simply omitting them is sufficient. No props needed. Matches DESIGN.md anti-decoration rules.
- **React Flow CSS overrides after import:** Override `.react-flow__edge-path` stroke, `.react-flow__edge-textbg` fill, and `.react-flow__pane` background to match dark design tokens. Place overrides in `globals.css` after the `@layer base` import.

## Open Questions

### Resolved During Planning

- **Sheet width:** Add `wide?: boolean` to `Sheet` and `.sheet-panel-wide { width: min(900px, 100vw) }` to `globals.css`. Mobile rule (bottom drawer) stays as-is — wide variant takes the same mobile treatment as the default.
- **Layout algorithm:** Manual radial positioning. No dagre/elk.
- **fitView in Sheet:** `fitView` prop + `onInit` with 80ms timeout is sufficient since the Sheet has no CSS transition (hard `if (!open) return null`).
- **Seed entity count:** 3+ entities per case is realistic. Specific additions documented in Unit 1.

### Deferred to Implementation

- **Exact radial radius constant:** Choose between 180px–260px at implementation time based on how crowded nodes appear at 900px sheet width. Start with 220px.
- **Edge label truncation:** If `relationship` text exceeds ~30 chars, it will wrap in the SVG label. Either truncate at implementation or accept wrapping — decide when rendering real data.
- **`ResizeObserver` in unit tests:** React Flow internally uses `ResizeObserver`, which jsdom does not implement. The `RiskNetworkGraph` component should be excluded from unit test coverage for this feature. If a polyfill is needed later for CI, add `global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }` to `vitest.setup.ts`.

## High-Level Technical Design

> *This illustrates the intended approach and is directional guidance for review, not implementation specification. The implementing agent should treat it as context, not code to reproduce.*

**Data flow — `CaseRecord` → graph primitives:**

```
CaseRecord { maskedUserLabel, caseId, linkedEntities[] }
  │
  └─► buildGraphData(record)
        │
        ├─ rootNode: id="root", type="rootNode",
        │            position={x:0, y:0},
        │            data={ label: maskedUserLabel, caseId }
        │
        ├─ childNodes[i]: id=entity.entityId, type="entityNode",
        │                  position={
        │                    x: RADIUS * cos(2π*i/N - π/2),
        │                    y: RADIUS * sin(2π*i/N - π/2)
        │                  },
        │                  data={ ...entity }
        │
        └─ edges[i]: id="e-root-{entityId}",
                     source="root", target=entity.entityId,
                     label=entity.relationship,
                     type="smoothstep",
                     labelStyle+labelBgStyle (dark theme tokens)

Returns { nodes: Node[], edges: Edge[] }
```

**Component structure:**

```
<Sheet wide open={sheet === "network"} ...>
  <div style={{ height: "520px" }}>        ← explicit height required by React Flow
    <RiskNetworkGraph record={record} />
      └─ <ReactFlow
           nodes={nodes} edges={edges}
           nodeTypes={nodeTypes}           ← module-level constant
           nodesDraggable={true}
           nodesConnectable={false}
           elementsSelectable={true}       ← enables node click for tooltip
           onNodeClick={handleNodeClick}
           fitView
           onInit={(inst) => setTimeout(() => inst.fitView({padding:0.25}), 80)}
         />
    {selectedNode && <NodeTooltipPanel data={selectedNode.data} />}
    {linkedEntities.length === 0 && <EmptyCallout />}
  </div>
</Sheet>
```

**Node color map (mirrors StatusBadge toneMap pattern):**

```
entityType → { border, bg, text }
"DEVICE"      → rgba(56,189,248,0.3)  / rgba(56,189,248,0.10) / #38bdf8
"BENEFICIARY" → rgba(240,165,0,0.3)   / rgba(240,165,0,0.10)  / #f0a500
"ACCOUNT"     → rgba(29,184,106,0.3)  / rgba(29,184,106,0.10) / #1db86a
root          → rgba(255,102,0,0.5)   / #0c2040               / #e8ecf0
other         → rgba(255,255,255,0.1) / #111b2a               / #8a9bb0

If riskNote ≠ "" → override border to rgba(224,53,53,0.6), bg to rgba(224,53,53,0.12)
```

## Implementation Units

- [ ] **Unit 1: Enrich seed data with linked entities**

  **Goal:** Populate `linkedEntities` on CASE-ATO-001 (add 2 more), CASE-ATO-008 (add 3), and CASE-UTX-204 (add 2) so the demo shows a meaningful multi-node graph.

  **Requirements:** R10

  **Dependencies:** None

  **Files:**
  - Modify: `seed/demo-core.json`

  **Approach:**
  - CASE-ATO-001 currently has 1 DEVICE entity. Add a BENEFICIARY (`BEN-101`, "New payee J** L***", "Beneficiary added 18 min before transfer", `riskNote`: "Payee added in same session as device change") and an ACCOUNT (`ACC-221`, "Destination account / ACC-221", "Receiving account flagged in prior cluster", `riskNote`: "Appeared in CLUSTER-2025-09 mule investigation").
  - CASE-ATO-008 has 0 entities. Add a DEVICE (`DEV-831`, "iPhone 16 / DEV-831", "First login from this device", `riskNote`: "New device registered 2h before step-up failure"), a BENEFICIARY (`BEN-408`, "New payee / BEN-408", "Beneficiary added at 15:22", `riskNote`: "Payee added same session as failed verification"), and an ACCOUNT (`ACC-449`, "Top-up destination / ACC-449", "Top-up destination added in session", `riskNote`: "").
  - CASE-UTX-204 has 0 entities. Add a BENEFICIARY (`BEN-203`, "New payee / BEN-203", "Beneficiary changed 13 min before payment", `riskNote`: "Beneficiary substitution is primary fraud vector on this case") and a DEVICE (`DEV-912`, "Samsung Galaxy / DEV-912", "New device at 10:58", `riskNote`: "Device registered same session as beneficiary change").
  - No TypeScript changes — `entityType` is `z.string()` and accepts any string value.

  **Test scenarios:**
  - All 3 cases in the seed parse without Zod validation errors (`vitest run` passes).
  - CASE-ATO-001 has 3 linked entities, CASE-ATO-008 has 3, CASE-UTX-204 has 2.

  **Verification:**
  - `npm run test` passes (Zod schema validation covers seed data).
  - CASE-ATO-001's linked entities include types DEVICE, BENEFICIARY, and ACCOUNT.

---

- [ ] **Unit 2: Install @xyflow/react and configure CSS**

  **Goal:** Make React Flow available in the project and import its required stylesheet in a way that is compatible with Tailwind v4.

  **Requirements:** R2, R8 (prerequisite)

  **Dependencies:** None

  **Files:**
  - Modify: `package.json` (via npm install — adds `@xyflow/react` to dependencies)
  - Modify: `app/globals.css`

  **Approach:**
  - Run `npm install @xyflow/react`. This brings in `d3-drag`, `d3-zoom`, `d3-selection`, and `zustand` as bundled deps — no manual peer dep installs.
  - In `app/globals.css`, add the React Flow stylesheet inside a `@layer base` block immediately after the existing `@import "tailwindcss"` line. This lets Tailwind utilities override React Flow's base styles while preventing Tailwind's preflight reset from stripping React Flow's structural layout.
  - In the same file, add dark-theme overrides for React Flow's edge and pane chrome (after the `@layer base` import, outside any layer): override `.react-flow__edge-path` stroke to `var(--line-strong)`, `.react-flow__edge-textbg` fill to `var(--surface-subtle)`, and background of `.react-flow__pane` to transparent (the sheet card background shows through).

  **Patterns to follow:**
  - Tailwind v4 CSS import pattern already established in `app/globals.css` (current first line is `@import "tailwindcss"`).

  **Test scenarios:**
  - `npm run build` completes without module resolution errors.
  - No Tailwind utility classes are broken after the import order change.

  **Verification:**
  - `npm run typecheck` passes.
  - `npm run build` passes.

---

- [ ] **Unit 3: Add `wide` prop to Sheet and corresponding CSS**

  **Goal:** Allow the Sheet to render at up to 900px width on desktop, needed for the graph canvas to be usable.

  **Requirements:** R2 (graph fits without horizontal scroll at 1280px viewport)

  **Dependencies:** None (can run in parallel with Units 1 and 2)

  **Files:**
  - Modify: `components/ui/sheet.tsx`
  - Modify: `app/globals.css`

  **Approach:**
  - Add `wide?: boolean` prop to the `Sheet` component's props interface.
  - On the `div.sheet-panel`, conditionally apply a `sheet-panel-wide` CSS class when `wide` is true. The existing `sheet-panel` class stays on the element at all times; `sheet-panel-wide` is added alongside it via template string or `clsx` (the project already depends on `clsx`).
  - In `globals.css`, add `.sheet-panel-wide { width: min(900px, 100vw); }` after the existing `.sheet-panel` rule. No mobile override is needed — the existing `@media (max-width: 820px)` rule already forces `.sheet-panel` to a full-width bottom drawer; `.sheet-panel-wide` on mobile simply inherits those dimensions because the media query rule is more specific.

  **Patterns to follow:**
  - `components/ui/section-card.tsx` — uses `compact?: boolean` prop with conditional class, same pattern.
  - `app/globals.css` `.sheet-panel` block (lines 215–225) for sizing reference.

  **Test scenarios:**
  - With `wide` omitted or `false`, the sheet renders at its existing 560px width — no regression.
  - With `wide={true}`, the sheet panel is wider (visually confirm at ≥1280px viewport).
  - On mobile (<820px), both wide and non-wide sheets behave as full-width bottom drawers.

  **Verification:**
  - Existing "Score logic", "Evidence pack", and "Policy basis" sheets are visually unchanged.
  - The wide sheet does not overflow the viewport at 1280px.

---

- [ ] **Unit 4: Build RiskNetworkGraph component**

  **Goal:** A self-contained React Flow component that takes a `CaseRecord` prop and renders the entity relationship graph with custom nodes, styled edges, and an optional selected-node detail panel.

  **Requirements:** R3, R4, R5, R6, R7, R8, R9

  **Dependencies:** Units 2 (CSS import must exist)

  **Files:**
  - Create: `components/ui/risk-network-graph.tsx`

  **Approach:**
  - Mark `"use client"` at the top (required for React Flow's browser-only APIs).
  - Define a `buildGraphData(record: CaseRecord)` function that:
    1. Creates the root node at `position: { x: 0, y: 0 }` with `type: "rootNode"` and `data: { label: record.maskedUserLabel, caseId: record.caseId }`.
    2. Iterates over `record.linkedEntities`, computing each child node position as `{ x: RADIUS * cos(2π*i/N - π/2), y: RADIUS * sin(2π*i/N - π/2) }` where RADIUS ≈ 220 (tune at implementation time) and N = number of entities.
    3. Creates edges with `source: "root"`, `target: entity.entityId`, `label: entity.relationship`, `type: "smoothstep"`, and `labelStyle`/`labelBgStyle` using dark theme token hex values (not CSS vars — React Flow SVG labels cannot reference CSS custom properties).
  - Define `RootNodeComponent` and `EntityNodeComponent` as plain React components outside the main export. Both receive `NodeProps` from `@xyflow/react`. `EntityNodeComponent` reads `data.entityType` and `data.riskNote` to derive inline border/bg/text styles from a module-level `ENTITY_TYPE_STYLES` map.
  - Define module-level `const nodeTypes = { rootNode: RootNodeComponent, entityNode: EntityNodeComponent }`.
  - Track `selectedNode` in `useState`. Pass `onNodeClick` to `<ReactFlow>` to set selected node. Render a detail panel below the canvas when `selectedNode` is non-null.
  - When `record.linkedEntities.length === 0`, skip the `buildGraphData` call and render the root node alone with a visible callout ("No linked entities on this case") displayed below the graph canvas.
  - Pass `fitView` and `onInit={(instance) => setTimeout(() => instance.fitView({ padding: 0.25 }), 80)}` to `<ReactFlow>`.
  - Set the outer container div to `style={{ width: '100%', height: '520px' }}` so React Flow has explicit dimensions.

  **Patterns to follow:**
  - `components/ui/status-badge.tsx` — toneMap pattern for entity type color lookup.
  - `lib/domain/schema.ts` — `CaseRecord` and `LinkedEntity` types.
  - DESIGN.md — IBM Plex Mono for IDs and labels in nodes, `--radius-xl` (8px) for node `borderRadius`, no gradients, subdued palette.

  **Test scenarios:**
  - With 3 linked entities: renders 4 nodes (1 root + 3 children) and 3 edges.
  - DEVICE entity node uses info-blue color palette.
  - BENEFICIARY entity node uses warning-amber color palette.
  - Entity with non-empty `riskNote` gets danger border.
  - Clicking an entity node renders its `label`, `entityType`, and `riskNote` in the detail panel below.
  - With zero entities: renders the root node alone with the "No linked entities" callout.

  **Verification:**
  - Component renders without console errors at runtime.
  - `npm run typecheck` passes (all React Flow types resolve).
  - All three entity types are visually distinct by color when all three are present on the same case.

---

- [ ] **Unit 5: Wire Risk network sheet into CaseScreen**

  **Goal:** Expose the graph to the user via a new button in the case header and a matching Sheet at the bottom of the component.

  **Requirements:** R1, R2, R7 (entry point), R9

  **Dependencies:** Units 3 and 4

  **Files:**
  - Modify: `components/screens/case-screen.tsx`

  **Approach:**
  - Extend `SheetKind` type (line 20) to `"score" | "evidence" | "policy" | "note" | "network" | null`.
  - Import `RiskNetworkGraph` from `components/ui/risk-network-graph`.
  - Import `Network` icon from `lucide-react`.
  - Add a fourth button to the header action row `<div className="flex flex-wrap gap-1.5">`: `<button className="button-secondary" onClick={() => setSheet("network")} type="button"><Network size={14} absoluteStrokeWidth />Risk network</button>`.
  - Add a fifth `<Sheet>` block at the bottom of the component's JSX alongside the existing four. Pass `wide` prop, `open={sheet === "network"}`, `onClose={() => setSheet(null)}`, `title="Entity risk network"`, and `subtitle="Linked accounts, devices, and beneficiaries connected to this case."`. Inside, render `<RiskNetworkGraph record={record} />`.

  **Patterns to follow:**
  - Existing button pattern in case-screen.tsx header action row (lines 41–67).
  - Existing Sheet render blocks (lines 392–474) for the fifth sheet.

  **Test scenarios:**
  - "Risk network" button appears in the header action row for every case.
  - Clicking it opens the wide sheet without affecting the other three sheets.
  - Closing the sheet (backdrop click or X) returns to `sheet === null`.
  - All four existing sheets continue to open and close correctly — no regression.

  **Verification:**
  - `npm run typecheck` passes.
  - All five sheet kinds open correctly in the browser on the case detail page.
  - The graph is visible and shows the entity nodes for CASE-ATO-001 when opened.

## System-Wide Impact

- **Interaction graph:** Only `case-screen.tsx` and its `Sheet` usage are affected. No middleware, observers, or server components involved.
- **Error propagation:** React Flow may throw if `nodes` or `edges` are malformed. `buildGraphData` should handle an empty `linkedEntities` array by returning only the root node — this is the zero-entity path (R9).
- **State lifecycle risks:** `selectedNode` state in `RiskNetworkGraph` does not need to reset when the sheet closes because the component unmounts when `open === false` (the Sheet's `if (!open) return null` tears it down). State is always fresh on open.
- **API surface parity:** No agent tool surface exists for this feature — display-only visualization.
- **Integration coverage:** The sheet open/close cycle and the graph render path should be manually verified in the browser against all three seeded cases. Unit tests will not cover the canvas render.

## Risks & Dependencies

- **React Flow `nodeTypes` reference stability:** If `nodeTypes` is accidentally placed inside the component body, every render re-mounts all nodes. Enforce module-level definition and document it with a short comment on the constant.
- **CSS import order with Tailwind v4:** The `@layer base` import pattern is required; deviating from it can strip React Flow's structural styles. Verify edge arrows and node dimensions render correctly after the CSS change.
- **Sheet height and graph container:** React Flow requires an explicit pixel height on its container. If the height is `auto` or `0`, the graph will not render. The `h-[520px]` (or equivalent) wrapper in the Sheet is mandatory.
- **Seed data Zod validation:** The seed is validated at test time via `riskOpsRepository`. New entity types (BENEFICIARY, ACCOUNT) will pass `z.string()` validation but should be verified with `npm run test` immediately after Unit 1.
- **`lucide-react` version:** v0.511 includes `Network` — confirmed. If any name change occurs, fall back to `Share2` or `GitFork`.

## Sources & References

- **Origin document:** [docs/brainstorms/2026-04-26-entity-risk-network-graph-requirements.md](docs/brainstorms/2026-04-26-entity-risk-network-graph-requirements.md)
- Related code: `components/ui/sheet.tsx`, `components/screens/case-screen.tsx`, `lib/domain/schema.ts`, `app/globals.css`
- External docs: `@xyflow/react` v12 official documentation (reactflow.dev)
