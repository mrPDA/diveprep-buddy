# Start Here — DivePrep Buddy Implementation

**Агенты: читайте этот файл первым перед написанием кода.**

## Цель MVP

PWA для подготовки к погружению: контекст → чеклист → buddy-check → summary. Без бэкенда, без аккаунтов.

## Порядок чтения

| # | Документ | Зачем |
| --- | --- | --- |
| 1 | [`implementation/brief.md`](implementation/brief.md) | Scope, фазы, acceptance criteria |
| 2 | [`implementation/data-model.md`](implementation/data-model.md) | TypeScript-типы и схемы |
| 3 | [`implementation/scaffold.md`](implementation/scaffold.md) | Команды Phase 1 |
| 4 | [`implementation/screen-specs.md`](implementation/screen-specs.md) | Экраны и навигация |
| 5 | [`implementation/safety-copy.md`](implementation/safety-copy.md) | Disclaimer и запрещённые формулировки |
| 6 | [`content-seed/README.md`](content-seed/README.md) | Seed-шаблоны чеклистов |
| 7 | [`research/ux-flow.md`](research/ux-flow.md) | Полный UX-контекст |
| 8 | [`research/task-breakdown.md`](research/task-breakdown.md) | Чеклист задач по фазам |

## Текущая фаза

**Phase 1 — Prototype Foundation** (см. `research/task-breakdown.md`).

Следующее действие: выполнить `implementation/scaffold.md`, затем перенести `content-seed/` → `src/content/templates/`.

## Зафиксированные решения

См. [`research/decisions.md`](research/decisions.md):

- PWA first
- No backend for MVP
- No decompression features
- No onboarding

## Pipeline агентов

```text
Orchestrator → scaffold (Phase 1) → Content (seed templates) → Frontend (UI) → PWA → QA → Security
```

Подробнее: [`../WORKFLOW.md`](../WORKFLOW.md) и [`../agents/README.md`](../agents/README.md).

## Автономный прогон

См. [`AUTONOMOUS-RUN.md`](AUTONOMOUS-RUN.md) и master prompt [`../prompts/build-mvp-unattended.md`](../prompts/build-mvp-unattended.md).

## Out of scope (не строить)

accounts, backend, cloud sync, AI, weather API, dive logging, decompression, social, marketplace.

## Success criteria (MVP)

- Пользователь проходит полный flow за 1–3 минуты
- Чеклист генерируется из контекста без hardcode в JSX
- Buddy-check: BCD → Weights → Releases → Air → Final OK
- Работает офлайн после первой загрузки
- Disclaimer виден при первом запуске
