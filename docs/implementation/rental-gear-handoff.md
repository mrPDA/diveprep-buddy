# Rental Gear Checklist — Implementation Handoff

Brief for agents implementing the **rental gear condition checklist** feature. Design is complete; this document tells each agent exactly what to do.

## Goal

Add a context flag `rentalGear` and a new template that prompts the diver to inspect rented equipment for **wear, damage, and malfunction** before accepting it from the dive shop. Paperwork (rental agreement, certification card) is **out of scope** — divers handle that themselves.

## Source of truth (already drafted)

Read these in order before starting:

1. `docs/content-seed/templates/rental.json` — final EN template (10 items, 8 critical).
2. `docs/implementation/data-model.md` — `rentalGear` field, merge rule, "Rental design notes" section.
3. `docs/implementation/screen-specs.md` — Rental Gear toggle row + sub-label copy.
4. `docs/content-seed/README.md` — merge table.

## In scope

- New context flag `rentalGear: boolean` (default `false`).
- New template `rental` merged when flag is `true`.
- New toggle on Context screen (Screen 1).
- EN + RU content.
- Persistence of the flag in `lastContext` / `defaultDiveContext`.
- Tests for engine merge and safety-copy compliance.

## Out of scope (explicitly defer)

- Per-category rental sub-flags (`rental.tank`, `rental.bcd`, …) — Phase 2.
- "Refuse / Swap this piece" UI affordance per item — Phase 2.
- Auto-suggesting `rentalGear: true` when `travel: true` — too assertive.
- Rental shop directory, ratings, photo-of-damage capture — out of MVP.

---

## Per-agent tasks

### 1. Checklist Content Agent — `agents/checklist-content-agent.md`

**Files to create:**

- `src/content/locales/en/templates/rental.json` — copy verbatim from `docs/content-seed/templates/rental.json`.
- `src/content/locales/ru/templates/rental.json` — Russian translation. Mirror the structure of `src/content/locales/ru/templates/cold-water.json`.

**Translation rules for RU file:**

- Keep all `id` fields **identical** to the EN file (they are stable identifiers, not display text).
- Translate `label` and `hint` only.
- The RU phrasing below is the **approved final copy** (signed off by the user). Use it verbatim — do not paraphrase or "polish". Future copy edits go through the standard content-review loop.
- Preserve item order.

**Final RU labels and hints — copy verbatim:**

| EN id | RU `label` | RU `hint` |
|---|---|---|
| `rental-mask-condition` | Маска: силикон мягкий и без трещин, ремешок цел, стекло без глубоких царапин | Тест прилегания — приложите маску к лицу без ремешка, вдохните носом; маска должна остаться на месте |
| `rental-bcd-hold-air` | BCD: надуть полностью на поверхности — должен держать давление ~30 секунд без шипения | — |
| `rental-bcd-valves` | BCD: инфлятор работает на впуск/сброс без залипаний, каждый сбросной клапан открывается и герметизируется | — |
| `rental-reg-first-stage` | Регулятор, первая ступень: без зелёной коррозии и солевого налёта, шланги без трещин, вздутий, потёртостей | — |
| `rental-reg-breathe` | Регулятор: оба второго ступени дышат ровно — без воды во рту, без free-flow, загубник цел | Откройте вентиль, продышитесь через каждую вторую ступень на поверхности, нажмите кнопку purge |
| `rental-spg-needle` | Манометр: стрелка движется плавно, возвращается к ~0 при закрытом вентиле, показывает давление при открытом | — |
| `rental-tank-visual` | Баллон: актуальная отметка визуального осмотра, без глубоких вмятин и сильной коррозии, вентиль вращается плавно | Клеймо осмотра обычно на горловине или плече баллона |
| `rental-suit-condition` | Гидрокостюм: без больших разрывов, молнии ходят плавно, манжеты целы, неопрен эластичный (не задубел) | — |
| `rental-weights-condition` | Грузы: пряжка пояса не корродирована, интегрированные карманы освобождаются чисто, вес соответствует плану | — |
| `rental-computer-battery` | Компьютер: индикатор батареи в норме, экран читается на солнце, кнопки реагируют | — |

> Quick scan before commit: the RU strings must not contain `безопасн`, `гарантирован`, `сертифицирован`, `одобрено`. Confirmed clean above; preserve when copying.

**After creating both files:**

```bash
npm run content:assemble    # rebuild content.bundle.json from splits
npm run verify              # tests + build must pass
```

**Acceptance:**

- `content.bundle.json` contains the new `rental` template under both locales.
- `npm run verify` green.
- `src/test/safety-copy.test.ts` passes for the new strings.

---

### 2. Frontend Engineer Agent — `agents/frontend-engineer-agent.md`

**Type changes** — `src/types/index.ts`:

```typescript
export interface DiveContext {
  diveType: DiveType | null
  coldWater: boolean
  nightDive: boolean
  photography: boolean
  travel: boolean
  training: boolean
  rentalGear: boolean   // NEW
}

export const defaultDiveContext = (): DiveContext => ({
  diveType: null,
  coldWater: false,
  nightDive: false,
  photography: false,
  travel: false,
  training: false,
  rentalGear: false,    // NEW
})
```

**Engine changes** — wherever the merge rule lives (likely `src/lib/checklist-engine.ts` or whatever the scaffold produced):

- Add: `if (context.rentalGear) include 'rental' template` after `training`, before final dedupe + sort.
- Maintain merge order: `base → diveType → night → cold-water → photo → travel → training → rental`.
- Ensure dedupe by `id` (first wins) is preserved.

**UI changes** — Context screen toggle list:

- Add a `ToggleCard` row bound to `rentalGear`.
- Label key: new `ui.toggles.rentalGear` (EN + RU) in `src/content/locales/{en,ru}/ui.json`.
- Sub-label key: `ui.toggles.rentalGearHint` — see `screen-specs.md`.
- **Order: 6th toggle, immediately after `Training Dive`.** This is the final position — do not reorder it relative to the existing toggles.
- **Sub-label visibility: render the hint only when the toggle is ON.** When OFF, show only the title row. Implementation: conditional render based on `context.rentalGear`. Animate entrance with the same transition pattern already used elsewhere in the toggle component (no new animation library).

**Persistence:**

- `lastContext` already serializes the whole `DiveContext` — no Dexie schema bump needed; the new optional-by-default boolean is forward-compatible.
- Migration: when reading an older `lastContext` without `rentalGear`, treat as `false`. Safe to coalesce in the Zustand selector.

**Edge cases:**

- Reset button on Context screen → `defaultDiveContext()` already covers this if updated.
- Back navigation from checklist → context with toggle ON → checklist regen must include rental items.
- Toggle OFF after a session was started → existing checklist keeps rental items until user explicitly resets (do **not** silently mutate an in-progress checklist).

**Tests to add (or extend):**

- `src/lib/checklist-engine.test.ts` (or scaffold equivalent):
  - Case: `rentalGear: true` → composed list contains all `rental-*` ids and still contains the `base` items.
  - Case: `rentalGear: false` → no `rental-*` ids in output.
  - Case: `travel: true, rentalGear: true` → both `travel` and `rental` items present, deduped if any id collides (currently none).
  - Case: ordering — `critical` rental items appear above non-critical within the same category.
- Snapshot or assertion that `defaultDiveContext().rentalGear === false`.

**Run before handoff:**

```bash
npm run verify
```

---

### 3. Test Engineer Agent — `agents/test-engineer-agent.md`

**Audit pass after content + frontend changes:**

- `npm run test:audit` — fix any actionable warnings.
- Confirm `safety-copy.test.ts` covers the new strings (it should pick them up automatically through `content.bundle.json`).
- Confirm engine tests cover all four merge cases above.
- Verify there are no leftover snapshot tests of the full bundle that would diff-explode (per `docs/testing-policy.md`: avoid full-bundle snapshots).

**Add (only if missing):**

- A focused test that asserts `rental.json` template is present in the bundle for both locales and has stable item ids.

---

### 4. Security & Safety Agent — `agents/shared/security-safety-agent.md`

**Review the new copy** before considering this feature shippable.

Checklist:

- No item promises safety, certification, or approval.
- No item gives decompression, gas-mix, or medical advice.
- All verbs are from the allowed set in `safety-copy.md`.
- The "fail" semantics for an item are **swap or refuse**, not "the gear is unsafe" — wording must stay descriptive ("BCD does not hold air") rather than evaluative ("BCD is unsafe").
- RU translation does not introduce forbidden phrases — quick scan for `безопасн`, `гарантирован`, `сертифицирован`, `одобрено`.

**Sign-off:** mark in `agent-runs/` only if the user requests a written record.

---

### 5. UX Implementation Agent — `agents/ux-implementation-agent.md`

**Verify after frontend changes:**

- Toggle is reachable with one thumb on a 360px-wide screen.
- Toggle row keeps the existing `min 44px` touch target (`screen-specs.md` global UI section).
- Sub-label, if shown, does not push the primary CTA below the fold on iPhone SE viewport.
- Order on the Context screen: `Boat / Shore` → multi-toggles ending with `Rental Gear`. No regroupings.

If the toggle list now exceeds the viewport height on small phones, coordinate with the Mobile Viewport Agent before adding scrolling — the existing pattern may already accommodate one more row, but verify on a real 568px-tall viewport.

---

## Order of operations

1. Checklist Content Agent — create EN + RU template files, run `content:assemble`.
2. Frontend Engineer — types, engine merge rule, toggle UI, ui.json keys, tests.
3. Test Engineer — audit, ensure coverage.
4. Security & Safety — copy review (EN + RU).
5. UX Implementation — final viewport pass.
6. `npm run verify` green → handoff.

Steps 1 and 2 can overlap if the content agent finalizes the EN file first (Frontend Engineer can use it for tests while RU is in progress).

---

## Acceptance criteria

- `DiveContext.rentalGear` exists, defaults to `false`, persists via `lastContext`.
- Toggling `Rental Gear` on the Context screen and generating a checklist adds all 10 `rental-*` items.
- Toggling it off on a fresh context generates a checklist with **no** `rental-*` items.
- All 10 items render under their declared categories with `critical` sort order respected.
- EN and RU strings present in `content.bundle.json`.
- `safety-copy.test.ts` passes.
- `npm run verify` passes.
- No new dependencies, no Dexie schema bump, no breaking change to existing stored `lastContext`.

---

## User-confirmed decisions

| Decision | Resolution |
|---|---|
| RU translations | **Final.** Use the table above verbatim. |
| Toggle position on Context screen | **6th, after `Training Dive`.** |
| Hint visibility | **Conditional — render hint only when toggle is ON.** |

## Open questions (do not block implementation)

1. **Real-diver review.** The 10 items are based on common rental failure modes, not validated with active divers. Track as a beta-feedback item, not a release blocker.
2. **Item count.** 10 inspection items + base + diveType + (possibly travel) can push the total checklist past the ~25-item soft limit from `checklist-content-agent.md`. If that becomes a UX issue, the Phase 2 split into category sub-flags becomes necessary, not optional.

---

## Risks

- **Verbosity.** Long checklists are skipped. If beta feedback shows users tap "Mark all" without reading, the per-category sub-flag split (Phase 2) becomes the mitigation, not a refinement.
- **Liability framing.** Items describe observable conditions, not safety judgments. Keep this discipline in any future copy edits — if an item drifts toward "this gear is unsafe", it must be reworded.
- **Translation drift.** RU and EN must stay in sync on `id` and item count. Any future addition to `rental.json` must be done in both locales in the same commit.
