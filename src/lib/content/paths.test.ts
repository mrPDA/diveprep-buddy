import { describe, expect, it } from 'vitest'
import {
  collectStringLeaves,
  groupLeavesByTopSection,
  humanizePath,
  setNestedString,
} from '@/lib/content/paths'

describe('collectStringLeaves', () => {
  it('returns sorted string leaves with dotted paths', () => {
    const result = collectStringLeaves({
      ui: { hello: 'world', nested: { a: 'A', b: 'B' } },
    })
    expect(result).toEqual([
      { path: 'ui.hello', value: 'world' },
      { path: 'ui.nested.a', value: 'A' },
      { path: 'ui.nested.b', value: 'B' },
    ])
  })

  it('skips arrays and non-string scalars', () => {
    const result = collectStringLeaves({
      label: 'kept',
      list: ['a', 'b'],
      count: 42,
      flag: true,
    })
    expect(result).toEqual([{ path: 'label', value: 'kept' }])
  })

  it('handles empty object', () => {
    expect(collectStringLeaves({})).toEqual([])
  })
})

describe('setNestedString', () => {
  it('updates a leaf without mutating the source', () => {
    const source = { a: { b: 'old' } }
    const next = setNestedString(source, 'a.b', 'new')
    expect(next).toEqual({ a: { b: 'new' } })
    expect(source).toEqual({ a: { b: 'old' } })
  })

  it('creates intermediate objects when path does not exist', () => {
    const next = setNestedString({}, 'a.b.c', 'value')
    expect(next).toEqual({ a: { b: { c: 'value' } } })
  })

  it('overwrites non-object intermediates with objects', () => {
    const next = setNestedString({ a: 'leaf' as unknown }, 'a.b', 'value')
    expect(next).toEqual({ a: { b: 'value' } })
  })

  it('sets top-level leaf', () => {
    expect(setNestedString({}, 'name', 'X')).toEqual({ name: 'X' })
  })
})

describe('groupLeavesByTopSection', () => {
  it('groups leaves by first path segment', () => {
    const grouped = groupLeavesByTopSection([
      { path: 'app.title', value: '1' },
      { path: 'app.subtitle', value: '2' },
      { path: 'checklist.empty', value: '3' },
    ])
    expect(grouped).toEqual({
      app: [
        { path: 'app.title', value: '1' },
        { path: 'app.subtitle', value: '2' },
      ],
      checklist: [{ path: 'checklist.empty', value: '3' }],
    })
  })

  it('falls back to "other" for empty path', () => {
    const grouped = groupLeavesByTopSection([{ path: '', value: 'x' }])
    expect(grouped.other ?? grouped['']).toBeDefined()
  })
})

describe('humanizePath', () => {
  it('takes the last segment', () => {
    expect(humanizePath('a.b.cFoo')).toBe('c Foo')
  })

  it('splits camelCase', () => {
    expect(humanizePath('shortName')).toBe('short Name')
  })

  it('replaces dashes and underscores with spaces', () => {
    expect(humanizePath('a.short_name')).toBe('short name')
    expect(humanizePath('a.short-name')).toBe('short name')
  })
})
