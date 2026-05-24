import { describe, expect, it } from 'vitest'
import {
  composeChecklist,
  loadTemplatesFromModules,
  resolveTemplateIds,
  withCompletionState,
} from '@/lib/checklist-engine'
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

const templates = {
  base: baseTemplate,
  boat: boatTemplate,
  'cold-water': coldTemplate,
}

function context(partial: Partial<DiveContext>): DiveContext {
  return {
    diveType: null,
    coldWater: false,
    nightDive: false,
    photography: false,
    travel: false,
    training: false,
    ...partial,
  }
}

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
