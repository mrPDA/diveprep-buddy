# Screen Specs — DivePrep Buddy MVP

Condensed from `research/ux-flow.md` for implementation.

## Navigation model

Single-page app with view enum (recommended for MVP):

```text
context → checklist → buddy-check → summary
```

Back navigation:

- checklist → context (warn: resets checklist if context changed)
- buddy-check → checklist
- summary → context (Start new preparation)

## Screen 1 — Context Selection

**View id:** `context`

**Heading:** `What kind of dive are you preparing for?`

**Primary selectors (cards, single choice):**

| Card | Sets |
| --- | --- |
| Boat Dive | `diveType: 'boat'` |
| Shore Dive | `diveType: 'shore'` |

**Toggle cards (multi):**

| Toggle | Field |
| --- | --- |
| Night Dive | `nightDive` |
| Cold Water | `coldWater` |
| Photography | `photography` |
| Travel / Trip | `travel` |
| Training Dive | `training` |

**Primary CTA:** `Generate Checklist` — disabled until dive type selected.

**UX:** large cards, no dropdowns, one-hand friendly, no onboarding.

---

## Screen 2 — Checklist

**View id:** `checklist`

**Header:** progress bar + `X of Y items`

**Body:** grouped by category labels:

- Core Gear
- Safety
- Exposure Protection
- Camera / Accessories
- Travel
- Documents / Extras

**Row:** full-width tap target, checkbox + label + optional hint (collapsed/expand).

**Actions:**

- Secondary: `Reset checklist`
- Primary (when all complete or user ready): `Start Buddy Check`

**Empty:** should not occur if user came from context; redirect to context if no checklist.

---

## Screen 3 — Buddy Check

**View id:** `buddy-check`

One step per view (sub-step index 0–4).

| Step | Title | Prompt | Confirm |
| --- | --- | --- | --- |
| bcd | BCD | Verify BCD fits and inflates/deflates correctly | Checked |
| weights | Weights | Verify weight amount and secure attachment | Checked |
| releases | Releases | Verify all releases (BCD, weight system, drysuit if applicable) | Checked |
| air | Air | Verify air on, full tank, breathe from regulator | Checked |
| final-ok | Final OK | Complete final buddy review together | Ready |

**Navigation:** Next after confirm; progress dots at bottom.

**Copy rule:** prompts use "verify" / "remember" — never "safe to dive".

---

## Screen 4 — Ready Summary

**View id:** `summary`

**Title:** `Preparation reviewed`

**Body:**

```text
Remember to verify all equipment physically before entering the water.
```

**NOT allowed:** `You are safe to dive.`

**Actions:**

- Primary: `Prepare for another dive` → context
- Optional secondary: `Review checklist` → checklist (read-only OK)

---

## Screen 5 — Settings (minimal, optional Phase 6)

- Reset all local data
- Show disclaimer again
- App version

Can defer until Phase 6.

---

## Global UI

| Element | Spec |
| --- | --- |
| Theme | Dark neutral (`slate-900` bg), high contrast text |
| Touch targets | min 44px height |
| Font | system sans, large base (16px+) |
| Offline banner | subtle top bar when `!navigator.onLine` |

---

## First launch

Modal or inline banner with disclaimer from `safety-copy.md`. Accept → store `disclaimerAcceptedAt`.

No registration. No tutorial carousel.

---

## Component checklist

- [ ] `ContextCard`, `ToggleCard`
- [ ] `ProgressBar`
- [ ] `ChecklistCategorySection`, `ChecklistItemRow`
- [ ] `BuddyCheckStepView`
- [ ] `DisclaimerBanner`
- [ ] `OfflineIndicator`
