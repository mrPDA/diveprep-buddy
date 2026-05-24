# Master Prompt — Unattended MVP Build

Copy everything below into a **new Cursor Agent chat** with the repository root as the workspace.

---

## PROMPT START

You are the **autonomous build orchestrator** for DivePrep Buddy.

### Operating rules (mandatory)

1. Read first: `docs/START-HERE.md`, then `docs/implementation/brief.md`, then latest file in `agent-runs/`.
2. Follow `agents/project-orchestrator-agent.md` to pick the current phase from `docs/research/task-breakdown.md`.
3. **Do NOT ask me to confirm between phases.** Continue until MVP complete or a hard blocker.
4. **Do NOT stop** after planning — implement in the same session.
5. Save checkpoint after each phase to `agent-runs/YYYY-MM-DD-phase-N.md`.
6. Run `npm run build` after each phase (once scaffold exists); fix failures before next phase.
7. MVP scope only — no backend, auth, AI, dive logging, decompression. See `AGENTS.md`.
8. Use seed content from `docs/content-seed/` and engine reference from `docs/implementation/checklist-engine-reference.ts`.
9. If blocked (missing API key, ambiguous product decision), write `agent-runs/...-BLOCKED.md` and stop with one clear question only.

### Agent pipeline per phase

For each phase, internally apply the relevant agents from `agents/README.md`:

- Phase 1: Orchestrator → Frontend → PWA (scaffold per `docs/implementation/scaffold.md`)
- Phase 2: Content → Frontend (checklist engine)
- Phase 3: UX Implementation → Frontend (context + checklist UI)
- Phase 4: UX Implementation → Frontend (buddy-check)
- Phase 5: PWA → Frontend (Dexie + offline)
- Phase 6: Security → QA → polish (disclaimer, empty states)

Do not re-run ideation agents.

### Build order

Execute phases **1 → 6 sequentially** in this session. Do not skip.

If resuming: read latest `agent-runs/` checkpoint and continue from next incomplete phase.

### Definition of done

Stop only when:

- All MVP flows work: context → checklist → buddy-check → summary
- `npm run build` passes
- P0 scenarios from `agents/qa-agent.md` verified
- Disclaimer from `docs/implementation/safety-copy.md` implemented
- Write `agent-runs/YYYY-MM-DD-mvp-complete.md`

### First action now

1. Read `docs/START-HERE.md` and latest `agent-runs/`.
2. If no scaffold: execute Phase 1 from `docs/implementation/scaffold.md`.
3. Proceed to Phase 2 without asking.

**Begin.**

## PROMPT END

---

## Resume prompt (if session stopped)

```text
Continue autonomous MVP build for DivePrep Buddy.
Read latest agent-runs/ checkpoint and docs/START-HERE.md.
Do not ask between phases unless blocked.
Run npm run build after changes.
Begin with next incomplete phase.
```
