# Data Model — DivePrep Buddy

Implementation-ready types. Place in `src/types/` or colocate with features.

## Dive context (user input)

```typescript
export type DiveType = 'shore' | 'boat';

export interface DiveContext {
  diveType: DiveType;
  coldWater: boolean;
  nightDive: boolean;
  photography: boolean;
  travel: boolean;
  training: boolean;
}

export const defaultDiveContext = (): DiveContext => ({
  diveType: 'boat',
  coldWater: false,
  nightDive: false,
  photography: false,
  travel: false,
  training: false,
});
```

## Checklist items

```typescript
export type ChecklistCategory =
  | 'core-gear'
  | 'safety'
  | 'exposure'
  | 'camera'
  | 'documents'
  | 'travel';

export interface ChecklistItem {
  id: string;
  label: string;
  hint?: string;
  category: ChecklistCategory;
  /** Show near top when checklist is long */
  critical?: boolean;
}

export interface ChecklistTemplate {
  id: string;
  name: string;
  items: ChecklistItem[];
}

/** Merged output with completion state for UI */
export interface ChecklistItemState extends ChecklistItem {
  completed: boolean;
}

export interface ComposedChecklist {
  context: DiveContext;
  items: ChecklistItemState[];
  generatedAt: string; // ISO timestamp
}
```

## Template merge rules

| Context flag | Template IDs to merge |
| --- | --- |
| Always | `base` |
| `diveType: 'boat'` | `boat` |
| `diveType: 'shore'` | `shore` |
| `coldWater: true` | `cold-water` |
| `nightDive: true` | `night` |
| `photography: true` | `photo` |
| `travel: true` | `travel` |
| `training: true` | `training` |

Merge algorithm:

1. Collect templates in order: `base` → dive type → modifiers (night, cold, photo, travel, training).
2. Concatenate `items`.
3. Dedupe by `id` (first wins).
4. Sort: `critical` first, then by category order (see below).

Category display order:

```text
core-gear → safety → exposure → camera → travel → documents
```

## Buddy check

```typescript
export interface BuddyCheckStep {
  id: string;
  title: string;
  prompt: string;
  confirmLabel: string;
}

export interface BuddyCheckSession {
  stepsCompleted: string[]; // step ids
  completedAt?: string;
}
```

Fixed sequence IDs: `bcd` → `weights` → `releases` → `air` → `final-ok`.

## App view state

```typescript
export type AppView =
  | 'context'
  | 'checklist'
  | 'buddy-check'
  | 'summary';

export interface AppSession {
  view: AppView;
  context: DiveContext;
  checklist: ComposedChecklist | null;
  buddyCheck: BuddyCheckSession;
}
```

## Local storage (Dexie)

```typescript
// Table: preferences
export interface UserPreferences {
  id: 'default';
  disclaimerAcceptedAt?: string;
  lastContext?: DiveContext;
}

// Table: sessions
export interface StoredSession {
  id: string; // 'current' for MVP single session
  checklist: ComposedChecklist;
  buddyCheck: BuddyCheckSession;
  updatedAt: string;
}
```

Schema version: `1`. Migration hook stub for future.

## Checklist engine signature

```typescript
export function composeChecklist(
  context: DiveContext,
  templates: Record<string, ChecklistTemplate>
): ChecklistItem[];

export function withCompletionState(
  items: ChecklistItem[],
  completedIds: Set<string>
): ChecklistItemState[];
```

Engine must be **pure** — no DOM, no storage, no fetch.

## Example engine input/output

Input context:

```json
{
  "diveType": "boat",
  "coldWater": true,
  "nightDive": true,
  "photography": false,
  "travel": false,
  "training": false
}
```

Output includes merged items from: `base`, `boat`, `cold-water`, `night` (deduped).

See `../content-seed/` for template files.
