import { describe, expect, it } from 'vitest'
import {
  getRentalChecklistItems,
  getVisibleChecklistItems,
} from '@/lib/checklist-display'
import { isRentalChecklistItem } from '@/lib/checklist-engine'
import type { ChecklistItemState, ComposedChecklist } from '@/types'
import { defaultDiveContext } from '@/types'

function item(id: string): ChecklistItemState {
  return {
    id,
    label: id,
    category: 'core-gear',
    completed: false,
  }
}

function checklist(
  items: ChecklistItemState[],
  rentalSectionHidden = false,
): ComposedChecklist {
  return {
    context: { ...defaultDiveContext(), rentalGear: true },
    items,
    generatedAt: new Date().toISOString(),
    rentalSectionHidden,
  }
}

describe('isRentalChecklistItem', () => {
  it('matches rental template item ids', () => {
    expect(isRentalChecklistItem('rental-mask-condition')).toBe(true)
  })

  it('excludes travel template rental-plan', () => {
    expect(isRentalChecklistItem('rental-plan')).toBe(false)
  })
})

describe('getRentalChecklistItems', () => {
  it('returns only rental inspection items', () => {
    const items = [
      item('mask'),
      item('rental-mask-condition'),
      item('rental-plan'),
    ]
    expect(getRentalChecklistItems(items).map((i) => i.id)).toEqual([
      'rental-mask-condition',
    ])
  })
})

describe('getVisibleChecklistItems', () => {
  it('returns all items when rental section is visible', () => {
    const items = [item('mask'), item('rental-mask-condition')]
    expect(getVisibleChecklistItems(checklist(items, false))).toHaveLength(2)
  })

  it('hides rental items when rental section is hidden', () => {
    const items = [item('mask'), item('rental-mask-condition')]
    const visible = getVisibleChecklistItems(checklist(items, true))
    expect(visible.map((i) => i.id)).toEqual(['mask'])
  })
})
