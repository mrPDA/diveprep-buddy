import { describe, expect, it } from 'vitest'
import {
  composeChecklist,
  loadTemplatesFromModules,
  resolveTemplateIds,
  withCompletionState,
} from '@/lib/checklist-engine'
import { defaultDiveContext } from '@/types'
import type { ChecklistTemplate, DiveContext } from '@/types'

const baseTemplate: ChecklistTemplate = {
  id: 'base',
  name: 'Base',
  items: [
    { id: 'mask', label: 'Mask', category: 'core-gear', critical: true },
    { id: 'whistle', label: 'Whistle', category: 'safety' },
  ],
}

const boatTemplate: ChecklistTemplate = {
  id: 'boat',
  name: 'Boat',
  items: [
    { id: 'boat-brief', label: 'Boat brief', category: 'safety', critical: true },
    { id: 'mask', label: 'Mask duplicate', category: 'core-gear' },
  ],
}

const coldTemplate: ChecklistTemplate = {
  id: 'cold-water',
  name: 'Cold',
  items: [{ id: 'hood', label: 'Hood', category: 'exposure' }],
}

const travelTemplate: ChecklistTemplate = {
  id: 'travel',
  name: 'Travel',
  items: [{ id: 'passport', label: 'Passport', category: 'travel' }],
}

const rentalTemplate: ChecklistTemplate = {
  id: 'rental',
  name: 'Rental',
  items: [
    {
      id: 'rental-mask-condition',
      label: 'Mask condition',
      category: 'core-gear',
      critical: true,
    },
    {
      id: 'rental-suit-condition',
      label: 'Suit condition',
      category: 'exposure',
    },
  ],
}

const templates = {
  base: baseTemplate,
  boat: boatTemplate,
  'cold-water': coldTemplate,
  travel: travelTemplate,
  rental: rentalTemplate,
}

function context(partial: Partial<DiveContext>): DiveContext {
  return {
    diveType: null,
    coldWater: false,
    nightDive: false,
    photography: false,
    travel: false,
    training: false,
    rentalGear: false,
    ...partial,
  }
}

describe('defaultDiveContext', () => {
  it('defaults rentalGear to false', () => {
    expect(defaultDiveContext().rentalGear).toBe(false)
  })
})

describe('resolveTemplateIds', () => {
  it('always includes base', () => {
    expect(resolveTemplateIds(context({}))).toEqual(['base'])
  })

  it('adds context-specific templates', () => {
    expect(
      resolveTemplateIds(
        context({ diveType: 'boat', coldWater: true, nightDive: true }),
      ),
    ).toEqual(['base', 'boat', 'cold-water', 'night'])
  })

  it('includes rental when rentalGear is true', () => {
    expect(resolveTemplateIds(context({ rentalGear: true }))).toEqual([
      'base',
      'rental',
    ])
  })

  it('omits rental when rentalGear is false', () => {
    expect(resolveTemplateIds(context({ rentalGear: false }))).toEqual(['base'])
  })
})

describe('composeChecklist', () => {
  it('merges templates and deduplicates by item id', () => {
    const items = composeChecklist(context({ diveType: 'boat' }), templates)
    expect(items.map((i) => i.id)).toEqual(['mask', 'boat-brief', 'whistle'])
    expect(items.find((i) => i.id === 'mask')?.label).toBe('Mask')
  })

  it('sorts critical items before non-critical within category order', () => {
    const items = composeChecklist(context({ diveType: 'boat' }), templates)
    expect(items[0]?.critical).toBe(true)
    expect(items[0]?.id).toBe('mask')
  })

  it('skips missing templates without throwing', () => {
    const items = composeChecklist(context({ diveType: 'shore' }), templates)
    expect(items.length).toBe(2)
  })

  it('includes rental items when rentalGear is true and keeps base items', () => {
    const items = composeChecklist(context({ rentalGear: true }), templates)
    const ids = items.map((i) => i.id)
    expect(ids).toContain('mask')
    expect(ids).toContain('whistle')
    expect(ids).toContain('rental-mask-condition')
    expect(ids).toContain('rental-suit-condition')
  })

  it('excludes rental items when rentalGear is false', () => {
    const items = composeChecklist(context({ rentalGear: false }), templates)
    expect(items.some((i) => i.id.startsWith('rental-'))).toBe(false)
  })

  it('merges travel and rental templates without duplicate ids', () => {
    const items = composeChecklist(
      context({ travel: true, rentalGear: true }),
      templates,
    )
    const ids = items.map((i) => i.id)
    expect(ids).toContain('passport')
    expect(ids).toContain('rental-mask-condition')
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('sorts critical rental items before non-critical within category order', () => {
    const items = composeChecklist(context({ rentalGear: true }), templates)
    const rentalItems = items.filter((i) => i.id.startsWith('rental-'))
    expect(rentalItems[0]?.id).toBe('rental-mask-condition')
    expect(rentalItems[0]?.critical).toBe(true)
    expect(rentalItems[1]?.id).toBe('rental-suit-condition')
  })
})

describe('withCompletionState', () => {
  it('marks completed ids', () => {
    const items = composeChecklist(context({}), templates)
    const withState = withCompletionState(items, new Set(['mask']))
    expect(withState.find((i) => i.id === 'mask')?.completed).toBe(true)
    expect(withState.find((i) => i.id === 'whistle')?.completed).toBe(false)
  })
})

describe('loadTemplatesFromModules', () => {
  it('indexes templates by id', () => {
    const loaded = loadTemplatesFromModules({
      a: { default: baseTemplate },
      b: { default: boatTemplate },
    })
    expect(Object.keys(loaded).sort()).toEqual(['base', 'boat'])
  })
})
