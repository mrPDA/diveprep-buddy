# AGENTS.md — DivePrep Buddy

Machine-first instructions for AI coding agents (Cursor, Copilot, Codex, etc.).

## Start here

**Before any implementation work, read [`docs/START-HERE.md`](docs/START-HERE.md).**

That file links to: implementation brief, data model, scaffold recipe, screen specs, safety copy, and seed checklist templates.

## Persistent memory (n4l / notesforllm)

This project uses the `notesforllm` MCP for cross-session memory. **Every non-trivial session MUST**:

1. Call `notes_attach()` first (binds via `.notesforllm.toml`).
2. Call `notes_resume_context()` and read `synthesis.last_handoff_next_step` / `exact_next_command` / `unresolved_risks`.
3. During work — `notes_checkpoint_save(...)` after big steps, `notes_decision_save(...)` for choices affecting >1 file.
4. Before ending — `notes_handoff_save(...)` with `goal`, `current_state`, `verified`, `risks`, `first_next_step`.

Full workflow, structured fields, linkage rules and examples: [`docs/notesforllm-workflow.md`](docs/notesforllm-workflow.md).

`agent-runs/` (human-readable reports) and n4l (machine memory) are **not** duplicates — write `agent-runs/` only when the user asks; write n4l automatically.

## Project identity

Pre-dive preparation PWA for recreational divers. **Not** a dive computer, logbook, or decompression planner.

Core flows:

1. Choose dive context → 2. Generate checklist → 3. Complete items → 4. Buddy-check → 5. Summary

## Current phase

**Phase 1 — Prototype Foundation.** Run `docs/implementation/scaffold.md`, then Phase 2 checklist engine.

## Commands (after scaffold)

```bash
npm install
npm run dev
npm run build
npm run test
npm run verify    # test + build — mandatory before handoff
npm run preview
```

## Tech constraints

| Area | Choice |
| --- | --- |
| UI | React 18+, TypeScript, Tailwind |
| Build | Vite + vite-plugin-pwa |
| State | Zustand or React state |
| Storage | IndexedDB via Dexie.js |
| Backend | **None** for MVP |

## Must

- Follow `docs/implementation/data-model.md` for types
- Use seed templates from `docs/content-seed/` → `src/content/templates/`
- Copy `docs/implementation/checklist-engine-reference.ts` → `src/lib/checklist-engine.ts`
- Mobile-first; large tap targets; dark high-contrast theme
- Disclaimer from `docs/implementation/safety-copy.md`
- **Testing**: read `docs/testing-policy.md`; run `npm run verify` before handoff; add lean tests for new logic
- Save agent summaries to `agent-runs/` when requested

## Never

- Imply guaranteed safety or decompression authority
- Add auth, cloud sync, AI, weather API, dive logging without approval
- Hardcode checklist strings in JSX

## Agent roles

See `agents/README.md` and `WORKFLOW.md`.

## Target `src/` layout

```text
src/app/
src/features/{context,checklist,buddy-check,summary}/
src/components/ui/
src/lib/checklist-engine.ts
src/lib/storage/
src/content/templates/
```
