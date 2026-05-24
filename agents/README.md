# Development Agent Team — DivePrep Buddy

Agents for **building** the MVP.

## Team

| Agent | File | When to use |
| --- | --- | --- |
| Project Orchestrator | `project-orchestrator-agent.md` | Start of session; phase planning |
| Frontend Engineer | `frontend-engineer-agent.md` | React/TS/Tailwind implementation |
| PWA & Offline | `pwa-offline-agent.md` | Service worker, install, IndexedDB |
| Checklist Content | `checklist-content-agent.md` | Templates, context merge rules |
| UX Implementation | `ux-implementation-agent.md` | Screens from ux-flow.md |
| Test Engineer | `test-engineer-agent.md` | **Auto at session end**: verify, audit, write/prune tests |
| QA | `qa-agent.md` | Manual matrix (mobile/offline); sign-off after verify green |

## Shared agents (`shared/`)

| Agent | File |
| --- | --- |
| MVP Engineer | `shared/mvp-engineer-agent.md` |
| Tech Architect | `shared/tech-architect-agent.md` |
| Security & Safety | `shared/security-safety-agent.md` |
| Validation | `shared/validation-agent.md` |

## Principles

1. MVP scope from `docs/research/task-breakdown.md` is default.
2. Checklist logic in `src/content/templates/`, not UI components.
3. Security & Safety before any public deploy.
4. Log decisions in `agent-runs/` **only on user request**.
5. **Persistent memory**: every agent attaches to n4l at session start (`notes_attach` → `notes_resume_context`) and saves a `notes_handoff_save` before ending. Full workflow: [`docs/notesforllm-workflow.md`](../docs/notesforllm-workflow.md).
6. **Testing**: every session that changes code runs `npm run verify` + `notes_test_run_checkpoint`. Policy: [`docs/testing-policy.md`](../docs/testing-policy.md).
