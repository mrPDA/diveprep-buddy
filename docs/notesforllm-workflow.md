# notesforllm (n4l) — персистентная память агентов

Этот документ описывает, **как агент работает с памятью между сессиями** в проекте DivePrep Buddy. Если ты coding-агент (Cursor, Copilot, Codex, CLI и т.д.) и тебе предстоит нетривиальная работа в этом репо — выполняй описанный ниже воркфлоу.

> Память живёт в MCP-сервере `notesforllm`. В корне проекта лежит `.notesforllm.toml` — он привязывает репо к space `diveprep-buddy`.

---

## TL;DR — три обязательных вызова

```text
START   →  notes_attach()                 # 1 раз в начале сессии
START   →  notes_resume_context()         # сразу после attach
DURING  →  notes_checkpoint_save(...)     # после крупных шагов
DURING  →  notes_decision_save(...)       # при выборе, влияющем на >1 файл
END     →  notes_handoff_save(...)        # перед завершением сессии
```

После `notes_attach` все последующие вызовы автоматически подставляют `space_id`, `task_id`, `session_id` — указывать их вручную не нужно.

---

## 1. START — привязка сессии

### 1.1 `notes_attach()`

Первый вызов в любой нетривиальной сессии. Без аргументов.

Что делает:

- Находит `.notesforllm.toml` (walk up от cwd).
- Резолвит `space_id` (создаёт, если нет).
- Резолвит `task_id` из текущей git-ветки (стратегия `branch`). Для веток из `default_branches` (`main`, `master`) task_id = имя ветки.
- Создаёт `session_id` (timestamp).

Возвращает: `{ space_id, space_slug, task_id, session_id, config_path }`.

### 1.2 `notes_resume_context()`

Сразу после attach. Восстанавливает последний handoff, последние checkpoints/decisions, синтез статуса.

**Обязательно прочитай поле `synthesis`** — там:

- `last_handoff_next_step` — с чего продолжить.
- `last_good_state` — последняя зелёная точка.
- `unresolved_risks` — что не закрыто.
- `exact_next_command` — конкретная следующая команда, если предыдущий агент её зафиксировал.
- `files_in_play` — файлы, которые трогали.
- `open_next_steps` — открытые шаги.

Если `summary == "No prior context found for this task."` — задача свежая, продолжай нормально.

### 1.3 Поиск релевантного контекста (опционально)

Если задача пересекается с прошлой работой:

- `notes_search(query)` — полнотекстовый поиск по страницам.
- `notes_query(...)` — структурированный фильтр по `workflow`, `stage`, `environment`, `verification_scope`, `known_issue`, `bridge_role`, `bridge_target_page_id`. **Предпочитай structured query тексту**, когда факт известен.
- `notes_task_timeline()` — таймлайн страниц по текущему `task_id`.

---

## 2. DURING — что и когда сохранять

### 2.1 `notes_checkpoint_save(...)` — после крупного шага

Когда вызывать:

- Завершена фаза (Phase 1 / Phase 2 / …).
- Готова отдельная фича (например, движок чек-листа).
- Применена миграция, добавлена зависимость, изменён data model.
- Прошёл/упал значимый прогон тестов.

Обязательно (минимум):

```text
title:   короткий человекочитаемый заголовок
summary: 1–3 предложения: что сделано, какой эффект
tags:    ["phase-2", "checklist-engine", ...]
```

Желательно (structured workflow-поля — предпочтительнее, чем прозу в summary):

```text
status:      in_progress | success | failure | partial
findings:    ["...", "..."]
artifacts:   ["src/lib/checklist-engine.ts", ...]
next_steps:  ["...", "..."]
provenance:  { repo, branch, head_sha, environment, verification_scope }
operational: { last_good_state, unresolved_risks, exact_next_command, files_in_play }
```

### 2.2 `notes_decision_save(...)` — при выборе, влияющем на >1 файл

Когда вызывать:

- Выбор библиотеки / архитектурного подхода (например, Zustand vs Context).
- Изменение data model или формата шаблонов.
- Решение о scope (что включаем / откладываем).
- Решение, которое затрагивает UX-копию (см. правила в `docs/implementation/safety-copy.md`).

Обязательно:

```text
title:           "Решение: …"
summary:         что решили + 1–2 фразы зачем
tags:            ["architecture" | "scope" | "ux-copy" | "data-model" | ...]
related_page_ids: [id предыдущих checkpoints/decisions, на которых основано решение]
```

> **Linkage**: `related_page_ids` — это id, возвращённые предыдущими `notes_*` вызовами или найденные через `notes_task_timeline`. Связь делает память графом, а не плоским списком.

### 2.3 `notes_compare(...)` — диф между checkpoint'ами

Используй, чтобы быстро увидеть, что изменилось между двумя точками (например, до и после рефакторинга движка чек-листа).

### 2.4 `notes_test_run_checkpoint(...)` — повторяющиеся прогоны тестов

**Обязательно** после каждой сессии с изменениями кода:

```bash
npm run verify        # test + build
npm run test:audit    # hygiene
```

Затем `notes_test_run_checkpoint(suite="vitest+build", command="npm run verify", ...)`.

Группирует прогоны и упрощает сравнение «зелёная/красная» во времени.

Политика: [`docs/testing-policy.md`](testing-policy.md).

### 2.5 Bridge: верификация ↔ продуктовый фикс

Когда работаешь в цикле «нашли баг → починили → проверили снова», в metadata используй `bridge_role`:

- `verification_finding` — checkpoint с обнаружением проблемы.
- `product_fix` — decision/checkpoint с фиксом (`bridge_target_page_id` = id finding).
- `verification_follow_up` — checkpoint с повторной проверкой (`bridge_target_page_id` = id fix).

Это позволяет потом фильтровать через `notes_query(bridge_role=...)` и видеть весь цикл.

---

## 3. END — handoff перед выходом

### 3.1 `notes_handoff_save(...)`

Вызывается **в конце сессии**, даже если сессия короткая. Это «куда вернуться» для следующего агента (или для тебя самого через неделю).

Обязательные поля:

```text
goal:               что было целью сессии
current_state:      где остановились (1–3 фразы)
verified:           ["...", "..."]   # что точно работает
risks:              ["...", "..."]   # что может сломаться / не проверено
first_next_step:    одна конкретная команда или действие
files_in_play:      пути файлов, которые трогали
```

**Главное правило handoff**: следующий агент должен иметь возможность сразу выполнить `first_next_step` без чтения всей истории.

---

## 4. Что НЕ сохранять

- Тривиальные правки (опечатка, переименование локальной переменной).
- Промежуточные неудачные попытки без выводов («попробовал X, не сработало, попробую Y»). Если выводов нет — лог не нужен.
- Содержимое файлов как таковое (для этого есть git). В n4l — **решения, состояния и связи**.

---

## 5. Связь с `agent-runs/`

В проекте две системы памяти:

| Куда | Кто читает | Когда писать | Формат |
| --- | --- | --- | --- |
| `agent-runs/*.md` | человек | **только по запросу пользователя** (user-rule) | длинный отчёт, нарратив |
| `notesforllm` (n4l) | следующий агент | автоматически каждая нетривиальная сессия | структурированный, машинный |

Это не дубликаты. `agent-runs/` — человекочитаемые отчёты по требованию; n4l — машинный memory layer, который агент ведёт сам.

---

## 6. Минимальный пример сессии

```text
1. notes_attach()
2. notes_resume_context()
   → читаем synthesis.last_handoff_next_step и exact_next_command
3. (работа: реализуем фичу)
4. notes_checkpoint_save(
       title="Phase 2: checklist engine готов",
       summary="Перенесён reference-движок, добавлены тесты merge-правил.",
       tags=["phase-2", "checklist-engine"],
       status="success",
       artifacts=["src/lib/checklist-engine.ts"],
       next_steps=["Подключить движок к ContextScreen"]
   )
5. notes_decision_save(
       title="Решение: state через Zustand, не Context",
       summary="Zustand даёт persist middleware из коробки → проще для offline.",
       tags=["architecture", "state"],
       related_page_ids=[<id checkpoint выше>]
   )
6. notes_handoff_save(
       goal="Закрыть Phase 2",
       current_state="Движок готов и протестирован, не подключён к UI.",
       verified=["unit-тесты merge-правил зелёные"],
       risks=["Не проверено поведение при пустом контексте"],
       first_next_step="В src/features/context/ContextScreen.tsx импортировать buildChecklist и подключить к onContextSubmit"
   )
```

---

## 7. Конфиг (`.notesforllm.toml`)

Лежит в корне репо, в гит. Менять без необходимости не нужно.

- `[space]` — общий неймспейс памяти проекта (`slug = "diveprep-buddy"`).
- `[task].strategy = "branch"` — каждая git-ветка = отдельная задача в n4l.
- `[task].default_branches` — ветки, которые считаются «стволом».
- `[memory].required_kinds` — что агент обязан сохранять минимум.

Если работаешь в feature-ветке `feat/checklist-engine` — у неё будет свой `task_id`, отдельная история, отдельный handoff. Это by design.
