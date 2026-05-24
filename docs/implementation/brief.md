# Implementation Brief — DivePrep Buddy

Консolidated spec для разработки. Детали — в linked docs.

## Product one-liner

Pre-dive preparation assistant: context-aware checklists + buddy-check. Not a dive computer or logbook.

## Core user journey

```text
Open app → Choose context → Generate checklist → Complete items → Buddy-check → Ready summary
```

Target time: **1–3 minutes**.

## MVP features (build these)

| # | Feature | Spec |
| --- | --- | --- |
| F1 | Dive context selection | `screen-specs.md` § Context |
| F2 | Contextual checklist | `data-model.md`, `content-seed/` |
| F3 | Checklist completion + progress | `screen-specs.md` § Checklist |
| F4 | Buddy-check flow | `content-seed/buddy-check.json` |
| F5 | Ready summary + disclaimer | `safety-copy.md` |
| F6 | Local persistence | `data-model.md` § Storage |
| F7 | Offline PWA | `scaffold.md`, `agents/pwa-offline-agent.md` |

## Phase acceptance criteria

### Phase 1 — Foundation

- [ ] Vite + React + TS + Tailwind running
- [ ] PWA plugin configured; manifest + icons placeholder
- [ ] Mobile-first shell with route/view state for 4 screens
- [ ] Dark high-contrast theme baseline

### Phase 2 — Checklist engine

- [ ] Types from `data-model.md` implemented
- [ ] Seed templates loaded from `src/content/templates/`
- [ ] `composeChecklist(context)` merges templates, dedupes by `id`
- [ ] Unit-testable pure function (no React in engine)

### Phase 3 — Core UI

- [ ] Context screen: card selectors + Generate button
- [ ] Checklist screen: categories, checkboxes, progress bar
- [ ] Reset checklist action

### Phase 4 — Buddy check

- [ ] One step per screen; large confirm buttons
- [ ] Sequence: BCD → Weights → Releases → Air → Final OK

### Phase 5 — Offline + persistence

- [ ] Dexie/IndexedDB: last context, completion state, preferences
- [ ] Service worker caches app shell

### Phase 6 — Polish

- [ ] Disclaimer on first launch
- [ ] Empty states from `screen-specs.md`
- [ ] Outdoor readability pass

## Architecture (MVP)

```text
src/
  app/                 # root, routing/view state
  features/context/
  features/checklist/
  features/buddy-check/
  features/summary/
  components/ui/
  lib/checklist-engine.ts
  lib/storage/
  content/templates/   # copied from content-seed/
```

## State approach

- **UI flow state:** React state or Zustand store `useAppStore`
- **Persistence:** Dexie tables (see `data-model.md`)
- **No** React Query, no API layer

## Key technical decisions

| Topic | Decision |
| --- | --- |
| Platform | PWA |
| Backend | None |
| Checklist logic | Rule-based merge, no AI |
| Navigation | Simple view enum or react-router (minimal) |
| i18n | English only for MVP |

## References

- Full UX: `../research/ux-flow.md`
- Tasks: `../research/task-breakdown.md`
- Tech: `../research/technical-discovery.md`
- Features: `../research/feature-spec.md`
