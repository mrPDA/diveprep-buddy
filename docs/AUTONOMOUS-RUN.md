# Autonomous Development Run — DivePrep Buddy

Как запустить разработку так, чтобы агент **сам проходил фазы** и **не останавливался** на каждом шаге.

## Важно понимать

Полностью «бесконечный» агент без участия человека в Cursor **не существует**. Но можно добиться **почти автономного** прогона, если:

1. Workspace = корень репозитория (любой локальный clone)
2. Режим **Agent** (не Ask)
3. Включён **auto-run** для терминала
4. Есть **master prompt** с правилом «не спрашивать между фазами»
5. Прогресс пишется в `agent-runs/` — агент знает, где остановился

---

## Вариант A — один чат, максимальная автономность (рекомендуется)

### Шаг 1. Настройки Cursor

| Настройка | Значение |
| --- | --- |
| Mode | **Agent** |
| Workspace | локальный clone репозитория |
| Auto-run commands | **On** (Settings → Agents → Auto-run или YOLO) |
| Privacy mode | Не **No Storage**, если нужны Automations / память |

### Шаг 2. Вставь master prompt

Скопируй целиком содержимое [`prompts/build-mvp-unattended.md`](../prompts/build-mvp-unattended.md) в новый Agent-чат.

### Шаг 3. Не прерывай, пока не увидишь блокер

Агент должен сам:

- читать `docs/START-HERE.md`;
- выполнять Phase 1 → 6 по `docs/research/task-breakdown.md`;
- после каждой фазы писать `agent-runs/YYYY-MM-DD-phase-N.md`;
- запускать `npm run build` после значимых изменений;
- **не спрашивать** «продолжить?» между фазами.

### Если агент остановился

Отправь одну строку:

```text
Continue autonomous MVP build from last agent-runs checkpoint. Do not ask questions unless blocked.
```

---

## Вариант B — Cursor Automations (фон, по расписанию)

Подходит, если хочешь **периодически** будить агента без открытого чата.

1. Открой [cursor.com/automations](https://cursor.com/automations)
2. Создай automation:
   - **Trigger:** cron (например каждые 2–4 часа) или manual
   - **Repo:** `diveprep-buddy`
   - **Prompt:** содержимое `prompts/build-mvp-unattended.md` + строка «Read latest agent-runs/ and continue next incomplete phase»
3. Включи automation

Плюс: работает в фоне. Минус: каждый run — новая сессия; нужны checkpoint-файлы в `agent-runs/`.

---

## Вариант C — Cursor SDK (скрипт-оркестратор)

Для **полностью программируемого** пайплайна вне IDE.

```bash
# Python (uv)
uv pip install cursor-sdk
export CURSOR_API_KEY=...
```

Скрипт по очереди вызывает фазы через `Agent.create` + `agent.send`, передавая путь к последнему checkpoint.

См. [Cursor SDK docs](https://cursor.com/docs/sdk/python).

Подходит, если нужен CI или nightly build agent.

---

## Вариант D — /loop (локальный wake-up)

Для **поддержания** длинного чата, не для старта с нуля:

```text
/loop 30m Continue DivePrep Buddy MVP from agent-runs checkpoint. Read docs/START-HERE.md. Do not stop between subtasks unless blocked.
```

Агент проснётся каждые 30 минут и продолжит. Используй после Варианта A, если сессия «засыпает».

---

## Checkpoint protocol (обязательно)

Без этого автономность ломается. После **каждой фазы** агент пишет:

`agent-runs/YYYY-MM-DD-phase-N.md`

Формат:

```markdown
# Phase N — <name>
Status: done | in_progress | blocked

## Completed
- ...

## Verified
- [ ] npm run build

## Next
- Phase N+1: ...
```

Следующий run **сначала читает** последний файл в `agent-runs/`.

---

## Критерий «MVP готов»

Агент останавливается только когда:

- [ ] Phase 1–6 из task-breakdown выполнены
- [ ] `npm run build` проходит
- [ ] QA matrix из `agents/qa-agent.md` — P0 пройден
- [ ] Security disclaimer на месте
- [ ] Финальный `agent-runs/YYYY-MM-DD-mvp-complete.md`

---

## Что делать прямо сейчас

1. Открыть workspace `diveprep-buddy`
2. Agent mode + auto-run ON
3. Вставить [`prompts/build-mvp-unattended.md`](../prompts/build-mvp-unattended.md)
4. Уйти — заглядывать в `agent-runs/` и git diff
