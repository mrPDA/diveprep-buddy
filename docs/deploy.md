# Deploy — DivePrep Buddy (Cloudflare Pages)

PWA без бэкенда: деплоится только статическая папка `dist`.

## Быстрый путь (рекомендуется): Connect GitHub

После push в `main`:

1. Откройте [Cloudflare Dashboard → Workers & Pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages)
2. **Create application** → **Pages** → **Connect to Git**
3. Выберите репозиторий **`mrPDA/diveprep-buddy`**
4. Настройки сборки:

   | Поле | Значение |
   | --- | --- |
   | Production branch | `main` |
   | Framework preset | None |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | `/` |

5. **Environment variables** — не нужны для MVP
6. **Save and Deploy**

Первый деплой займёт 1–3 минуты. URL будет вида:

```text
https://diveprep-buddy.pages.dev
```

(точное имя зависит от project name в Cloudflare; можно задать `diveprep-buddy`.)

Каждый push в `main` после этого деплоится автоматически.

---

## Альтернатива: GitHub Actions + Wrangler

В репозитории есть `.github/workflows/cloudflare-pages.yml`.

1. Cloudflare → **My Profile** → **API Tokens** → Create token → шаблон **Edit Cloudflare Workers**
2. Скопируйте **Account ID** (Overview аккаунта справа)
3. GitHub → repo **Settings** → **Secrets and variables** → **Actions**:

   | Secret | Значение |
   | --- | --- |
   | `CLOUDFLARE_API_TOKEN` | API token |
   | `CLOUDFLARE_ACCOUNT_ID` | Account ID |

4. Push в `main` или **Actions** → **Run workflow**

Если проект Pages ещё не создан, wrangler создаст `diveprep-buddy` при первом деплое.

---

## Локальная проверка перед деплоем

```bash
npm ci
npm run build
npm run preview
```

Откройте preview URL, проверьте disclaimer → context → checklist → buddy-check → summary.

Офлайн: DevTools → Network → Offline → перезагрузка.

---

## Установка на телефон (PWA)

### iPhone (Safari)

1. Откройте `https://diveprep-buddy.pages.dev`
2. **Поделиться** → **На экран «Домой»**
3. Запустите с иконки — должно открыться без адресной строки (standalone)

### Android (Chrome)

1. Откройте тот же URL
2. Меню **⋮** → **Установить приложение** / **Add to Home screen**
3. Проверьте офлайн после первой загрузки

---

## Checklist после деплоя

- [ ] HTTPS, без ошибок в консоли
- [ ] Disclaimer на первом визите
- [ ] Переключение EN / RU
- [ ] Service worker зарегистрирован (Application → Service Workers)
- [ ] Reload сохраняет чеклист (IndexedDB)
- [ ] Офлайн после первой загрузки

---

## Troubleshooting

| Проблема | Решение |
| --- | --- |
| 404 при прямом URL | Убедитесь, что `public/_redirects` попал в `dist` |
| Старый кэш после деплоя | Закройте вкладку / переустановите PWA; SW `autoUpdate` |
| Build fails on CF | Node 22: в dashboard → Settings → Environment → `NODE_VERSION=22` |

---

## Out of scope

Backend, env secrets для API, preview branches — при необходимости добавить позже.
