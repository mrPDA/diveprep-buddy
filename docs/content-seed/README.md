# Content Seed — Checklist Templates

Ready-to-copy templates for Phase 2. **Not runtime code yet** — copy to `src/content/templates/` during scaffold (see `implementation/scaffold.md`).

## Files

| File | When merged |
| --- | --- |
| `templates/base.json` | Always |
| `templates/boat.json` | `diveType === 'boat'` |
| `templates/shore.json` | `diveType === 'shore'` |
| `templates/night.json` | `nightDive === true` |
| `templates/cold-water.json` | `coldWater === true` |
| `templates/photo.json` | `photography === true` |
| `templates/travel.json` | `travel === true` |
| `templates/training.json` | `training === true` |
| `templates/rental.json` | `rentalGear === true` |
| `buddy-check.json` | Buddy-check flow (fixed sequence) |

## Merge rules

See `implementation/data-model.md`.

## Content review

Items marked for instructor review should be validated with real divers before public launch. Engine can ship with this seed for prototype testing.

## Example merged context

Boat + cold + night → templates: `base`, `boat`, `cold-water`, `night`.

Travel + rental (typical vacation diver) → templates: `base`, `boat`, `travel`, `rental`.

## Agent task

Checklist Content Agent: refine labels/hints after first diver feedback. Do not add decompression or medical items.
