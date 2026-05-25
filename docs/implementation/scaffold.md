# Scaffold Recipe — Phase 1

Execute in the repo root.

## 1. Create Vite + React + TS project

```bash
npm create vite@latest . -- --template react-ts
```

If directory not empty, scaffold into temp and merge, or use:

```bash
npm create vite@latest diveprep-app -- --template react-ts
# then move files to root
```

## 2. Install dependencies

```bash
npm install
npm install -D tailwindcss @tailwindcss/vite
npm install zustand dexie
npm install -D vite-plugin-pwa
```

## 3. Tailwind (Vite plugin)

`vite.config.ts`:

```typescript
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'DivePrep Buddy',
        short_name: 'DivePrep',
        description: 'Pre-dive preparation checklists',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
    }),
  ],
});
```

`src/index.css`:

```css
@import "tailwindcss";
```

## 4. Target folder structure (create empty dirs)

```bash
mkdir -p src/{app,components/ui,features/{context,checklist,buddy-check,summary},lib/storage,content/templates,types}
```

## 5. Copy seed content

```bash
cp -R docs/content-seed/templates/* src/content/templates/
cp docs/content-seed/buddy-check.json src/content/buddy-check.json
```

## 6. Path alias (optional)

`tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 7. Verify

```bash
npm run dev
npm run build
```

Build must pass before Phase 2.

## 8. Placeholder icons

Add `public/pwa-192x192.png` and `public/pwa-512x512.png` (simple dark placeholder OK for MVP).

## Agent handoff after Phase 1

1. Frontend Engineer — wire `AppView` shell
2. Checklist Content Agent — review seed templates in `src/content/templates/`
3. Frontend Engineer — implement `lib/checklist-engine.ts` per `data-model.md`
