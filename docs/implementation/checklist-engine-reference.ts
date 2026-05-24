/**
 * Reference implementation — copy to src/lib/checklist-engine.ts and adjust imports.
 * Pure functions only; no React, no storage.
 */

export type DiveType = 'shore' | 'boat';

export interface DiveContext {
  diveType: DiveType;
  coldWater: boolean;
  nightDive: boolean;
  photography: boolean;
  travel: boolean;
  training: boolean;
}

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
  critical?: boolean;
}

export interface ChecklistTemplate {
  id: string;
  name: string;
  items: ChecklistItem[];
}

export interface ChecklistItemState extends ChecklistItem {
  completed: boolean;
}

const CATEGORY_ORDER: ChecklistCategory[] = [
  'core-gear',
  'safety',
  'exposure',
  'camera',
  'travel',
  'documents',
];

function categoryRank(category: ChecklistCategory): number {
  const index = CATEGORY_ORDER.indexOf(category);
  return index === -1 ? CATEGORY_ORDER.length : index;
}

export function resolveTemplateIds(context: DiveContext): string[] {
  const ids = ['base', context.diveType];
  if (context.coldWater) ids.push('cold-water');
  if (context.nightDive) ids.push('night');
  if (context.photography) ids.push('photo');
  if (context.travel) ids.push('travel');
  if (context.training) ids.push('training');
  return ids;
}

export function composeChecklist(
  context: DiveContext,
  templates: Record<string, ChecklistTemplate>,
): ChecklistItem[] {
  const seen = new Set<string>();
  const merged: ChecklistItem[] = [];

  for (const templateId of resolveTemplateIds(context)) {
    const template = templates[templateId];
    if (!template) continue;
    for (const item of template.items) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      merged.push(item);
    }
  }

  return merged.sort((a, b) => {
    if (Boolean(a.critical) !== Boolean(b.critical)) {
      return a.critical ? -1 : 1;
    }
    return categoryRank(a.category) - categoryRank(b.category);
  });
}

export function withCompletionState(
  items: ChecklistItem[],
  completedIds: Set<string>,
): ChecklistItemState[] {
  return items.map((item) => ({
    ...item,
    completed: completedIds.has(item.id),
  }));
}

export function loadTemplatesFromModules(
  modules: Record<string, { default: ChecklistTemplate }>,
): Record<string, ChecklistTemplate> {
  const out: Record<string, ChecklistTemplate> = {};
  for (const mod of Object.values(modules)) {
    out[mod.default.id] = mod.default;
  }
  return out;
}

// Vite example:
// const templates = loadTemplatesFromModules(
//   import.meta.glob('../content/templates/*.json', { eager: true }) as Record<
//     string,
//     { default: ChecklistTemplate }
//   >,
// );
