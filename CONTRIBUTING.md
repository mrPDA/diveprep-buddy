# Contributing — DivePrep Buddy

Спасибо, что интересуетесь проектом. Сейчас репозиторий в фазе **beta** —
основной фокус на стабильности MVP-флоу и обратной связи от реальных дайверов.

## Способы помочь

1. **Тест PWA на устройстве** — особенно iOS Safari и Android Chrome, офлайн.
   Откройте [`SECURITY.md`](SECURITY.md) или issue с тегом `feedback`.
2. **Bug report** — issue с шаблоном `Bug report`, обязательно укажите устройство,
   браузер, шаги воспроизведения.
3. **Beta-фидбэк по чек-листам** — отдельный шаблон `Beta feedback`.
   Что не хватает в чек-листе для shore / boat / night / cold / photo?
4. **PR** — приветствуются, см. правила ниже.

## Что точно out-of-scope

Эти направления **не принимаются без явного согласования с владельцем**:

- backend, auth, облачная синхронизация
- дайв-логгер, decompression / NDL / газовые расчёты
- LLM / AI-фичи в самом приложении
- любой текст, нарушающий safety-copy ([`docs/implementation/safety-copy.md`](docs/implementation/safety-copy.md))

Полный список ограничений — в [`AGENTS.md`](AGENTS.md) и
[`.cursor/rules/project-core.mdc`](.cursor/rules/project-core.mdc).

## Workflow PR

1. Форкните репо, создайте ветку: `feature/short-name` или `fix/short-name`.
2. Установка и dev:

   ```bash
   npm install
   npm run dev
   ```

3. **Перед PR обязательно**:

   ```bash
   npm run verify       # test + build
   npm run test:audit   # гигиена тестов
   ```

   Зелёный verify — обязательное условие. См. [`docs/testing-policy.md`](docs/testing-policy.md).

4. Для нового кода с логикой — добавьте co-located `*.test.ts`.
5. Изменения в строках чек-листа / сейфти-копий — должны проходить
   `src/test/safety-copy.test.ts`. Запрещённые слова: `safe`, `guaranteed`,
   `certified`, `approved for diving`.
6. Откройте PR с заполненным template, ссылкой на issue (если есть) и
   списком устройств, на которых тестировали.

## Стиль кода

- TypeScript строгий, без `any`.
- Tailwind utility-first, без `style={}`.
- Чек-лист и тексты — **только** через `src/content/`, не хардкодить в JSX.
- Mobile-first, крупные tap-таргеты (минимум 44×44 px).
- Никаких комментариев, пересказывающих код. Комментарий — только про
  непрозрачное намерение или ограничение.

## Структура проекта

См. [`README.md`](README.md#project-layout) и [`AGENTS.md`](AGENTS.md).

## Контент чек-листов

Шаблоны → `src/content/templates/` (через bundle).
Сидовые материалы — `docs/content-seed/`.
Перед изменением content — [`docs/implementation/data-model.md`](docs/implementation/data-model.md).

## Сообщение об уязвимостях

Не открывайте публичный issue для уязвимостей. См. [`SECURITY.md`](SECURITY.md).

## Лицензия

Контрибутя в проект, вы соглашаетесь, что ваш вклад выпускается под
[MIT License](LICENSE).
