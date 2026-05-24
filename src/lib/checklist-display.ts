import { isRentalChecklistItem } from '@/lib/checklist-engine'
import type { ChecklistItemState, ComposedChecklist } from '@/types'

export function getRentalChecklistItems(
  items: ChecklistItemState[],
): ChecklistItemState[] {
  return items.filter((item) => isRentalChecklistItem(item.id))
}

export function getVisibleChecklistItems(
  checklist: ComposedChecklist,
): ChecklistItemState[] {
  if (!checklist.rentalSectionHidden) return checklist.items
  return checklist.items.filter((item) => !isRentalChecklistItem(item.id))
}
