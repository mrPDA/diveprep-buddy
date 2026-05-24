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
| QA | `qa-agent.md` | Test matrix, regressions |

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
4. Log decisions in `agent-runs/`.
