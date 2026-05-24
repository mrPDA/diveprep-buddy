# AGENTS.md — DivePrep Buddy

Machine-first instructions for AI coding agents (Cursor, Copilot, Codex, etc.).

## Project identity

Pre-dive preparation PWA for recreational divers. **Not** a dive computer, logbook, or decompression planner.

Core flows only:

1. Choose dive context (shore/boat, cold/warm, night, travel, photo add-on).
2. Generate and complete contextual checklist.
3. Run structured buddy-check.
4. Persist preferences and last session locally; work offline.

## Must read before coding

- `docs/research-links.md` — product/UX/tech artifacts
- `docs/research/ux-flow.md` — canonical UX
- `docs/research/task-breakdown.md` — build phases

## Commands (after scaffold exists)

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint        # if configured
npm run test        # if configured
```

## Tech constraints

| Area | Choice |
| --- | --- |
| UI | React 18+, TypeScript, Tailwind |
| Build | Vite |
| State | Zustand or React state for MVP |
| Storage | IndexedDB via Dexie.js |
| Deploy | Static host (Vercel/Netlify) |
| Backend | **None** for MVP |

## Must

- Mobile-first layout; large tap targets for wet/gloved use context.
- Offline-first after first load (service worker + local persistence).
- Rule-based checklist engine (no LLM in MVP).
- Visible disclaimer: assistant only, not a safety authority.
- Keep MVP scope; defer accounts, sync, weather API, AI, dive logging.
- Match existing patterns in `src/` before introducing new abstractions.
- Save agent run summaries to `agent-runs/` when user asks for agent work.

## Never

- Imply guaranteed safety, certification, or decompression authority.
- Add auth, cloud sync, or paid infra for MVP without explicit approval.
- Replace instructor training or dive computer functions.
- Copy long research docs into code comments; link to files instead.
- Expand AGENTS.md beyond ~150 lines; put detail in `agents/` or `docs/`.

## Agent roles

See `agents/README.md`. Default build pipeline:

```text
Orchestrator → MVP Engineer → Frontend → PWA/Offline → Content → UX Implementation → QA → Security & Safety
```

## File layout (target)

```text
src/
  components/
  features/checklist/
  features/buddy-check/
  features/context/
  content/templates/
  lib/storage/
  app/
public/
```

## Quality bar

- TypeScript strict where project enables it.
- No dead code paths for non-MVP features.
- Checklist templates editable without touching UI logic.
- Buddy-check steps match `docs/research/ux-flow.md` unless logged in `agent-runs/`.
