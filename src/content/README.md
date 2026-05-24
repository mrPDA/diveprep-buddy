# Редактирование контента — DivePrep Buddy

## Рекомендуемый способ: Content Studio

Один визуальный редактор вместо десятка JSON-файлов.

```bash
npm run content:studio
```

Откроется http://localhost:5173 с кнопкой **⚙️** → редактор:

| Вкладка | Что правите |
|---------|-------------|
| Приложение | Название, PWA |
| Интерфейс | Все тексты экранов |
| Buddy-check | 5 шагов |
| Чеклисты | Шаблоны base, boat, shore… |

### Опубликовать правки для всех

```bash
# 1. В студии: правки → «Сохранить» (скачает content.bundle.json)
#    или «Экспорт JSON»

# 2. Применить в репозиторий (один файл → всё синхронизируется)
npm run content:apply -- ~/Downloads/content.bundle.json

# 3. Деплой
git add src/content/
git commit -m "Update content"
git push
```

Production-сайт для дайверов **без ⚙️** — только то, что в репозитории.

---

## Альтернатива: один JSON в редакторе

Файл **`src/content/content.bundle.json`** — весь контент в одном месте.

```bash
# Открыть в VS Code / Cursor, править bundle
npm run content:sync    # обновить split-файлы (опционально)
git push
```

Собрать bundle из split-файлов заново:

```bash
npm run content:assemble
```

---

## Карта (техническая)

```text
src/content/
├── content.bundle.json   ← главный файл для приложения
├── app-meta.json         ← синхронизируется скриптом apply
├── locales.config.json
└── locales/              ← синхронизируются скриптом apply
    ├── en/ …
    └── ru/ …
```

Приложение читает **`content.bundle.json`**. Split-файлы — для diff и совместимости, не редактируйте их вручную.

---

## Правила

- Не меняйте `id` пунктов чеклиста и buddy-check (прогресс пользователей).
- Safety-copy: `docs/implementation/safety-copy.md`
- `npm run dev` — обычный режим без студии (⚙️ только в dev)

---

## Команды

| Команда | Назначение |
|---------|------------|
| `npm run content:studio` | Визуальный редактор |
| `npm run content:apply -- file.json` | Записать bundle в репо |
| `npm run content:assemble` | split → bundle |
| `npm run content:sync` | bundle → split |
