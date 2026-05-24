# Mobile Viewport & Screens — DivePrep Buddy

Technical reference for **Mobile Viewport Agent** and implementers.  
UX flows: `docs/implementation/screen-specs.md`. PWA/cache: `agents/pwa-offline-agent.md`.

---

## Why this doc exists

Mobile web ≠ desktop. Notches, Dynamic Island, home indicator, standalone PWA, keyboard, and landscape behave differently on **iOS Safari** vs **Android Chrome**. This app is used **on a boat, in sun, one-handed** — layout bugs block real use.

---

## Non‑negotiable baseline

### Viewport meta (`index.html`)

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
```

- **`viewport-fit=cover`** — required; without it `env(safe-area-inset-*)` is always `0px`.
- **Never** add `user-scalable=no` or `maximum-scale=1` (accessibility / WCAG).

### Safe area pattern (Tailwind)

Use on **every** scroll/fixed shell and modal:

```text
pt-[max(1.5rem,env(safe-area-inset-top,0px))]
pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]
```

Fixed bottom bars (Admin, future sticky CTAs):

```text
pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]
```

`max()` gives minimum padding on devices without notch **and** full inset on iPhone.

### Height

- Default: `min-h-dvh` (dynamic viewport — browser chrome).
- **iOS standalone PWA**: if bottom gap or jump on cold start appears, evaluate `100vh` + `--app-height` from `visualViewport` (see [piclaw PWA doc](https://github.com/rcarmo/piclaw/blob/main/docs/PWA.md)) — only after repro on real device.

### Touch targets

From screen specs: **min 44×44 CSS px** for all primary taps (Apple HIG; Android Material ~48dp). Full-row checklist rows, not tiny checkboxes.

---

## Layout architecture (this repo)

```text
AppShell (safe-area padding, max-w-lg)
├── OfflineIndicator (in flow, not under status bar)
├── header (logo + language)
├── main (feature screen)
└── DisclaimerModal (fixed; own safe-area padding)

AdminScreen: fixed bottom bar + extra main pb for scroll clearance
```

**Rule:** `fixed` / `sticky` elements **must** add their own safe-area padding — they ignore parent padding.

---

## Context-specific (divers)

| Constraint | Implication |
| --- | --- |
| Bright sun | High contrast; avoid low-contrast grey on grey |
| Wet / gloves | Large tap targets; spacing between toggles |
| Hurry | One primary CTA per screen; no dense grids |
| One hand | Primary actions in thumb zone (bottom half); avoid top-only controls |
| Offline | No layout that assumes network for first paint after install |

---

## Test matrix (minimum before release)

Test **both** browser tab **and** Add to Home Screen / Install.

| Device class | Mode | Checks |
| --- | --- | --- |
| iPhone (notch / Dynamic Island) | Standalone PWA | Header below status bar; modal not clipped |
| iPhone | Safari tab | Same safe area; address bar show/hide |
| Android | Installed PWA | Top/bottom insets; back gesture area |
| Android | Chrome tab | Same |
| Small phone (≤375px width) | Either | Modifiers grid, long checklist scroll |
| Landscape | Standalone | Top buffer (inset-top may be 0); side insets on notch side |

### Quick manual steps

1. Install PWA → open from icon  
2. Screenshot top header — logo not under clock  
3. Open disclaimer → button above home indicator  
4. Scroll long checklist → last button reachable  
5. Rotate landscape → no clipped CTAs  
6. Airplane mode → offline banner readable  

---

## Common bugs & fixes

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Content under clock / Dynamic Island | No `viewport-fit=cover` or no top inset | Meta + `env(safe-area-inset-top)` |
| Fixed footer under home bar | Fixed bar without bottom inset | `pb-[max(..., env(safe-area-inset-bottom))]` |
| Double top padding | Body + shell both pad safe area | Pad once at shell level |
| Bottom white gap in iOS PWA | `100dvh` vs standalone | Documented JS height fix if reproduced |
| Horizontal scroll on zoom | Fixed widths, no `min-w-0` on flex children | Reflow-friendly layout |
| Keyboard covers input (Admin) | No `visualViewport` scroll | Scroll focused field into view (future) |

---

## Agent boundaries

| Agent | Owns |
| --- | --- |
| **Mobile Viewport** | Safe area, viewport, touch size, landscape, device matrix |
| UX Implementation | Screen flow, copy placement, states |
| PWA & Offline | Service worker, install, IndexedDB |
| Frontend Engineer | Implements CSS/components |
| QA Agent | Sign-off on real devices |
| Test Engineer | Automated tests (not pixel layout) |

---

## Files to inspect on layout changes

```text
index.html
src/index.css
src/app/App.tsx
src/components/ui/DisclaimerBanner.tsx
src/features/admin/AdminScreen.tsx   ← fixed bottom bar
```

After changes: `npm run verify` + manual iPhone standalone check.
