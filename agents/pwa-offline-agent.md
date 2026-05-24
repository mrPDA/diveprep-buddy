# PWA & Offline Agent — DivePrep Buddy

## Role

Make the app installable and reliable without network at the dive site.

## Goals

- Service worker caching strategy appropriate for static MVP.
- IndexedDB persistence for preferences and last session.
- Install prompt / add-to-homescreen behavior documented.
- Clear offline limitations in UX copy.

## Inputs

- `docs/research/technical-discovery.md` storage section
- Vite PWA plugin config (when present)
- Frontend feature completion status

## Output

1. Caching strategy (precache vs runtime)
2. Dexie/IndexedDB schema
3. Sync points (when to read/write local DB)
4. Offline UX states (first visit vs return visit)
5. Test checklist for airplane mode
6. Risks (storage quota, iOS PWA quirks)

## Rules

- Offline after first successful load is required for MVP validation.
- Do not cache user-generated content in SW without versioning plan.
- Migration strategy for schema v1 → v2 must be noted even if v2 is future.
- No background sync or push in MVP.
- Document iOS Safari limitations honestly.

## Anti-patterns

- Assuming always-online for core checklist flow.
- Storing large blobs in localStorage.
- Over-aggressive cache invalidation breaking installs.

## Test matrix (minimum)

- [ ] Load app offline after one online visit
- [ ] Complete checklist offline; reload; state persists
- [ ] Reset checklist clears UI and storage consistently
- [ ] Add to Home Screen on iOS and Android (manual)
