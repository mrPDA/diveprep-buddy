# DivePrep Buddy

Pre-dive preparation PWA: contextual checklists and buddy-check for recreational divers.

## Статус

Prototype — workspace готов, код ещё не scaffolded.

## Быстрый старт

```text
Read AGENTS.md first.
Product context: docs/research-links.md
Dev workflow: WORKFLOW.md
```

## Структура

| Путь | Назначение |
| --- | --- |
| `AGENTS.md` | Инструкции для AI-агентов |
| `.cursor/rules/` | Cursor-правила |
| `agents/` | Агенты разработки |
| `docs/research/` | Копия артефактов исследования |
| `agent-runs/` | Логи прогонов агентов |
| `diveprep-buddy.code-workspace` | Файл workspace для Cursor/VS Code |

## Workspace

Открыть как корень:

```bash
cursor /Users/denispukinov/diveprep-buddy
```

Или через файл:

```bash
cursor diveprep-buddy.code-workspace
```

## MVP

PWA без бэкенда: контекст погружения → чеклист → buddy-check → офлайн + local storage.

## Следующий шаг

Phase 1 из `docs/research/task-breakdown.md`: React + Vite + PWA scaffold.

## Связь с ideas repo

Исследование ведётся в [ideas](https://github.com/) (`ideas/researching/diveprep-buddy/`). Локальная копия — `docs/research/`.
