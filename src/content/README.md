# Редактирование контента — DivePrep Buddy

**Production (сайт для дайверов):** правки только через JSON в репозитории → `git push` → деплой.  
Инструкция ниже по файлам в `src/content/`.

**Локально (`npm run dev`):** доступна админ-панель ⚙️ для предпросмотра правок на устройстве. В production-сборке она **отключена**.

## Админ-панель (только dev)

```bash
npm run dev
```

- Кнопка **⚙️** в шапке — не видна на production URL
- Экспорт JSON → перенос в файлы `src/content/` → commit → push

---

## Карта файлов

```text
src/content/
├── app-meta.json           ← название приложения, PWA, цвета
├── locales.config.json     ← список языков в переключателе
└── locales/
    ├── en/                 ← английский
    │   ├── ui.json         ← все кнопки, заголовки, disclaimer
    │   ├── buddy-check.json← шаги buddy-check
    │   └── templates/      ← пункты чеклиста
    └── ru/                 ← русский (та же структура)
        ├── ui.json
        ├── buddy-check.json
        └── templates/
```

| Что менять | Файл |
| --- | --- |
| Название приложения, описание PWA | `app-meta.json` |
| Заголовок вкладки браузера | `index.html` → `<title>` |
| Языки в меню | `locales.config.json` |
| Кнопки, экраны, disclaimer | `locales/{язык}/ui.json` |
| Шаги buddy-check | `locales/{язык}/buddy-check.json` |
| Пункты чеклиста | `locales/{язык}/templates/*.json` |

---

## 1. Название и PWA — `app-meta.json`

```json
{
  "name": "DivePrep Buddy",
  "shortName": "DivePrep",
  "description": "Pre-dive preparation checklists",
  "themeColor": "#0f172a",
  "backgroundColor": "#0f172a"
}
```

- **name** — полное имя при установке на домашний экран  
- **shortName** — короткое имя под иконкой  
- **description** — описание в манифесте PWA  

---

## 2. Языки — `locales.config.json`

```json
{
  "default": "en",
  "supported": [
    { "code": "en", "label": "English" },
    { "code": "ru", "label": "Русский" }
  ]
}
```

Чтобы добавить язык (например, немецкий):

1. Добавьте `{ "code": "de", "label": "Deutsch" }` в `supported`
2. Создайте папку `locales/de/` с копиями `ui.json`, `buddy-check.json`, `templates/`
3. Обновите тип `Locale` в `src/i18n/types.ts` (`'en' | 'ru' | 'de'`)
4. Подключите `de/ui.json` в `src/i18n/index.ts`

---

## 3. Интерфейс — `locales/{язык}/ui.json`

Структура по экранам:

| Ключ | Экран |
| --- | --- |
| `context.*` | Выбор типа погружения |
| `checklist.*` | Чеклист + категории |
| `buddyCheck.*` | Общие подписи buddy-check |
| `summary.*` | Экран «готово» |
| `disclaimer.*` | Модалка при первом запуске |
| `safety.footer` | Подпись внизу экранов |
| `offline.banner` | Баннер офлайн-режима |

**Подстановки** в тексте:

```json
"progressCount": "{{completed}} of {{total}} items"
```

Доступные переменные указаны в ключах с `{{...}}` — не удаляйте их при переводе.

### Правила safety-copy

Используйте: *verify, check, review, remember, prepare* (или эквиваленты).

**Нельзя:** «You are safe to dive», «guaranteed safe», советы по декомпрессии и газовым смесям.

Подробнее: `docs/implementation/safety-copy.md`

---

## 4. Buddy-check — `locales/{язык}/buddy-check.json`

```json
{
  "version": 1,
  "steps": [
    {
      "id": "bcd",
      "title": "BCD",
      "prompt": "Verify BCD fits and inflates/deflates correctly.",
      "confirmLabel": "Checked"
    }
  ]
}
```

- **id** — не менять (используется для сохранения прогресса)
- **title**, **prompt**, **confirmLabel** — можно редактировать свободно  
- Порядок шагов: `bcd` → `weights` → `releases` → `air` → `final-ok`

---

## 5. Чеклисты — `locales/{язык}/templates/*.json`

Каждый файл — один модификатор контекста:

| Файл | Когда подключается |
| --- | --- |
| `base.json` | Всегда |
| `boat.json` | Тип «с лодки» |
| `shore.json` | Тип «с берега» |
| `night.json` | Модификатор «ночное» |
| `cold-water.json` | «Холодная вода» |
| `photo.json` | «Фото / видео» |
| `travel.json` | «Поездка» |
| `training.json` | «Учебное» |

Формат пункта:

```json
{
  "id": "mask",
  "label": "Mask",
  "hint": "Optional short hint",
  "category": "core-gear",
  "critical": true
}
```

- **id** — уникальный, **не менять** после релиза (ломает сохранённый прогресс)
- **category** — одна из: `core-gear`, `safety`, `exposure`, `camera`, `travel`, `documents`
- **critical** — `true` показывает бейдж «Важно» и поднимает пункт выше

Названия категорий в UI — в `ui.json` → `checklist.categories`.

---

## 6. Проверка после правок

```bash
npm run dev          # локально
npm run build        # перед деплоем
```

Чеклист проверки:

- [ ] Выбрать контекст → чеклист генерируется
- [ ] EN и RU переключаются
- [ ] Disclaimer и footer читаются нормально
- [ ] Buddy-check — все 5 шагов

---

## Справочные копии (не используются приложением напрямую)

Шаблоны для агентов и документации: `docs/content-seed/`

Рабочие файлы приложения — только `src/content/locales/`.
