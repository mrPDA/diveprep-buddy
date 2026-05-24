import type {
  ChecklistCategory,
  ChecklistItem,
  ChecklistItemState,
  ChecklistTemplate,
  DiveContext,
} from '@/types'

const CATEGORY_ORDER: ChecklistCategory[] = [
  'core-gear',
  'safety',
  'exposure',
  'camera',
  'travel',
  'documents',
]

function categoryRank(category: ChecklistCategory): number {
  const index = CATEGORY_ORDER.indexOf(category)
  return index === -1 ? CATEGORY_ORDER.length : index
}

export function resolveTemplateIds(context: DiveContext): string[] {
  const ids = ['base']
  if (context.diveType) ids.push(context.diveType)
  if (context.coldWater) ids.push('cold-water')
  if (context.nightDive) ids.push('night')
  if (context.photography) ids.push('photo')
  if (context.travel) ids.push('travel')
  if (context.training) ids.push('training')
  if (context.rentalGear) ids.push('rental')
  return ids
}

/** Item ids from the `rental` template (excludes travel template `rental-plan`). */
export function isRentalChecklistItem(itemId: string): boolean {
  return itemId.startsWith('rental-') && itemId !== 'rental-plan'
}

export function composeChecklist(
  context: DiveContext,
  templates: Record<string, ChecklistTemplate>,
): ChecklistItem[] {
  const seen = new Set<string>()
  const merged: ChecklistItem[] = []

  for (const templateId of resolveTemplateIds(context)) {
    const template = templates[templateId]
    if (!template) continue
    for (const item of template.items) {
      if (seen.has(item.id)) continue
      seen.add(item.id)
      merged.push(item)
    }
  }

  return merged.sort((a, b) => {
    if (Boolean(a.critical) !== Boolean(b.critical)) {
      return a.critical ? -1 : 1
    }
    return categoryRank(a.category) - categoryRank(b.category)
  })
}

export function withCompletionState(
  items: ChecklistItem[],
  completedIds: Set<string>,
): ChecklistItemState[] {
  return items.map((item) => ({
    ...item,
    completed: completedIds.has(item.id),
  }))
}

export function loadTemplatesFromModules(
  modules: Record<string, { default: ChecklistTemplate }>,
): Record<string, ChecklistTemplate> {
  const out: Record<string, ChecklistTemplate> = {}
  for (const mod of Object.values(modules)) {
    out[mod.default.id] = mod.default
  }
  return out
}
