# DivePrep Buddy

> Pre-dive preparation PWA for recreational divers.
> Context → checklist → buddy-check → summary. Offline-first. No backend.

[![Deploy](https://img.shields.io/badge/live-diveprep--buddy.pages.dev-blue)](https://diveprep-buddy.pages.dev)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![PWA](https://img.shields.io/badge/PWA-ready-brightgreen)](https://web.dev/progressive-web-apps/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646cff)](https://vitejs.dev)

DivePrep Buddy помогает дайверу **подготовиться** к погружению: выбрать контекст
(берег / лодка / ночь / холод / фото), получить адаптированный чек-лист, пройти
структурированный buddy-check и увидеть саммари готовности.

**Это не** дайв-компьютер, логбук или планировщик декомпрессии.

---

## Live demo

[https://diveprep-buddy.pages.dev](https://diveprep-buddy.pages.dev)

PWA: можно установить на iOS Safari (Поделиться → На экран «Домой») и
Android Chrome (Меню → Установить приложение). После первой загрузки работает офлайн.

## Features

- Выбор контекста погружения с модификаторами (night / cold / photo / travel)
- Композитный чек-лист по правилам merge с дедупликацией
- Buddy-check из 5 шагов (BCD → weights → releases → air → final OK)
- Прогресс и состояние сохраняются локально (IndexedDB через Dexie)
- Полностью офлайн после первой загрузки (vite-plugin-pwa, autoUpdate SW)
- RU / EN локализация
- Single-bundle контент: тексты редактируются через визуальную Content Studio (только в dev)
- Disclaimer и safety-copy на месте — приложение позиционируется как ассистент,
  а не источник авторитета по безопасности

## Tech stack

| Слой | Выбор |
| --- | --- |
| UI | React 19 + TypeScript |
| Стили | Tailwind CSS 4 |
| Сборка | Vite 8 + vite-plugin-pwa |
| Состояние | Zustand |
| Локальное хранилище | Dexie (IndexedDB) |
| Тесты | Vitest |
| Хостинг | Cloudflare Pages (статика) |
| Бэкенд | **нет** — всё на клиенте |

## Quickstart

```bash
git clone https://github.com/mrPDA/diveprep-buddy.git
cd diveprep-buddy
npm install
npm run dev          # http://localhost:5173
```

## Build & verify

```bash
npm run build        # tsc + vite build → dist/
npm run preview      # проверка production-бандла локально
npm run test         # vitest run
npm run verify       # test + build (gate перед PR)
npm run test:audit   # гигиена тестов
```

## Content editing

Все пользовательские строки и шаблоны чек-листов лежат в едином bundle:
`src/content/content.bundle.json`. Редактировать удобно через визуальную студию:

```bash
npm run content:studio
```

Подробности: [`src/content/README.md`](src/content/README.md).

## Deploy

Production — Cloudflare Pages, см. [`docs/deploy.md`](docs/deploy.md).
GitHub Actions workflow для деплоя — `.github/workflows/cloudflare-pages.yml`
(требует секретов `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`).

## Project layout

```text
src/
├── app/                   приложение, роутинг экранов
├── features/              context, checklist, buddy-check, summary, admin
├── components/            переиспользуемые UI-кирпичики
├── lib/                   checklist-engine, storage (Dexie), env, i18n
├── content/               content.bundle.json + локали + templates
└── test/                  safety-rules + общие тесты

docs/
├── research/              продуктовая discovery (idea, спека, UX flow)
├── implementation/        бриф, data-model, scaffold, safety-copy
└── content-seed/          стартовые шаблоны чек-листов

agents/                    инструкции для AI-агентов
agent-runs/                лог автономных AI-сессий, собиравших MVP
```

## Project status

**Beta.** MVP-флоу полностью работает; собирается и публикуется автоматически.
Идёт сбор обратной связи от реальных дайверов.

Хочешь помочь — см. [`CONTRIBUTING.md`](CONTRIBUTING.md). Нашёл уязвимость —
см. [`SECURITY.md`](SECURITY.md).

## Safety positioning

Приложение **помогает организовать подготовку и не забыть шаги**. Оно не
заменяет обучение, инструктаж, сертифицированные процедуры дайв-безопасности
или дайв-компьютер. Полный текст дисклеймера и допустимая лексика —
[`docs/implementation/safety-copy.md`](docs/implementation/safety-copy.md).

## Built with AI agents

MVP собран автономной командой AI-агентов в Cursor за один прогон.
Артефакты, чек-поинты и решения каждой фазы лежат в `agent-runs/`,
research-материалы — в `docs/research/`. Это сделано прозрачно
специально — чтобы можно было ревьюить и воспроизводить процесс.

## License

[MIT](LICENSE) © 2026 Denis Pukinov
