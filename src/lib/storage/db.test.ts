import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  __resetStorageErrorListeners,
  db,
  getPreferences,
  getStoredSession,
  onStorageError,
  saveStoredSession,
} from '@/lib/storage/db'

beforeEach(() => {
  __resetStorageErrorListeners()
  vi.restoreAllMocks()
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})

describe('onStorageError', () => {
  it('notifies subscribed listener with op name and error', async () => {
    vi.spyOn(db.preferences, 'get').mockRejectedValue(new Error('boom'))
    const listener = vi.fn()
    onStorageError(listener)

    await getPreferences()

    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith('getPreferences', expect.any(Error))
  })

  it('stops notifying after unsubscribe', async () => {
    vi.spyOn(db.preferences, 'get').mockRejectedValue(new Error('boom'))
    const listener = vi.fn()
    const unsubscribe = onStorageError(listener)
    unsubscribe()

    await getPreferences()

    expect(listener).not.toHaveBeenCalled()
  })

  it('isolates listener exceptions — other listeners still receive', async () => {
    vi.spyOn(db.sessions, 'put').mockRejectedValue(new Error('boom'))
    const throwing = vi.fn(() => {
      throw new Error('listener boom')
    })
    const good = vi.fn()
    onStorageError(throwing)
    onStorageError(good)

    await saveStoredSession({ checklist: null as never, buddyCheck: { stepsCompleted: [] } })

    expect(throwing).toHaveBeenCalled()
    expect(good).toHaveBeenCalledWith('saveStoredSession', expect.any(Error))
  })
})

describe('safeStorageRead', () => {
  it('returns fallback when dexie rejects', async () => {
    vi.spyOn(db.preferences, 'get').mockRejectedValue(new Error('quota'))

    const prefs = await getPreferences()

    expect(prefs).toEqual({ id: 'default' })
  })

  it('returns undefined fallback for sessions read on failure', async () => {
    vi.spyOn(db.sessions, 'get').mockRejectedValue(new Error('locked'))

    const session = await getStoredSession()

    expect(session).toBeUndefined()
  })

  it('passes through successful reads', async () => {
    vi.spyOn(db.preferences, 'get').mockResolvedValue({
      id: 'default',
      locale: 'ru',
    })

    const prefs = await getPreferences()

    expect(prefs.locale).toBe('ru')
  })
})

describe('safeStorageWrite', () => {
  it('swallows rejection silently and still notifies subscribers', async () => {
    vi.spyOn(db.sessions, 'put').mockRejectedValue(new Error('write fail'))
    const listener = vi.fn()
    onStorageError(listener)

    await expect(
      saveStoredSession({
        checklist: null as never,
        buddyCheck: { stepsCompleted: [] },
      }),
    ).resolves.toBeUndefined()

    expect(listener).toHaveBeenCalledWith('saveStoredSession', expect.any(Error))
  })
})
