# Development Agent Workflow — DivePrep Buddy

Use after idea research is complete. Chat is interface; repo is source of truth.

## Standard command

```text
Use DivePrep Buddy dev workflow.
Goal: <e.g. implement Phase 2 checklist engine>.
Constraints: MVP scope, no backend, mobile-first.
Agent: <role from agents/README.md>.
Save results: yes → agent-runs/ or src/ as appropriate.
```

## Build pipeline (typical order)

Every session that changes code **ends with Test Engineer verify gate** (`npm run verify`).

```text
1. Project Orchestrator   — scope check, phase pick
2. MVP Engineer             — agents/shared/mvp-engineer-agent.md
3. Tech Architect           — agents/shared/tech-architect-agent.md
4. Frontend Engineer        — agents/frontend-engineer-agent.md
5. PWA & Offline Agent      — agents/pwa-offline-agent.md
6. Checklist Content Agent  — agents/checklist-content-agent.md
7. UX Implementation Agent  — agents/ux-implementation-agent.md
8. Test Engineer            — agents/test-engineer-agent.md  ← verify + audit + write/prune tests
9. QA Agent                 — agents/qa-agent.md             ← manual matrix for gaps
10. Security & Safety Agent  — agents/shared/security-safety-agent.md
11. Validation Agent        — agents/shared/validation-agent.md
```

## Verify gate (mandatory)

```bash
npm run verify       # test + build
npm run test:audit   # suite hygiene
```

Policy: [`docs/testing-policy.md`](docs/testing-policy.md)

## Phase mapping

| Phase | Task breakdown | Primary agents |
| --- | --- | --- |
| 1 — Foundation | Project setup, PWA shell | Orchestrator, Frontend, PWA |
| 2 — Checklist engine | Templates + composer | Content, Frontend |
| 3 — Core UI | Context + checklist screens | UX Implementation, Frontend |
| 4 — Buddy check | Step flow | UX Implementation, Frontend |
| 5 — Polish | Storage, reset, disclaimer | PWA, Security, QA |

## Agent run log

`agent-runs/YYYY-MM-DD-<topic>.md`
