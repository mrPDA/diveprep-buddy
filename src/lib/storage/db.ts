import Dexie, { type EntityTable } from 'dexie'
import type { ContentBundle } from '@/lib/content/types'
import type { StoredSession, UserPreferences } from '@/types'

export interface StoredContentBundle {
  id: 'active'
  bundle: ContentBundle
  updatedAt: string
}

class DivePrepDatabase extends Dexie {
  preferences!: EntityTable<UserPreferences, 'id'>
  sessions!: EntityTable<StoredSession, 'id'>
  contentBundles!: EntityTable<StoredContentBundle, 'id'>

  constructor() {
    super('DivePrepBuddy')
    this.version(1).stores({
      preferences: 'id',
      sessions: 'id',
    })
    this.version(2).stores({
      preferences: 'id',
      sessions: 'id',
      contentBundles: 'id',
    })
  }
}

export const db = new DivePrepDatabase()

/**
 * Wrap a Dexie call so that IndexedDB failures (Safari Private Mode, quota,
 * corrupt DB) never escape as unhandled rejections and are visible in logs.
 * Writes return `undefined` on failure; reads return the provided fallback.
 */
async function safeStorageRead<T>(
  op: string,
  fn: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    console.warn(`[storage] ${op} failed:`, error)
    return fallback
  }
}

async function safeStorageWrite(
  op: string,
  fn: () => Promise<unknown>,
): Promise<void> {
  try {
    await fn()
  } catch (error) {
    console.warn(`[storage] ${op} failed:`, error)
  }
}

export async function getPreferences(): Promise<UserPreferences> {
  return safeStorageRead(
    'getPreferences',
    async () => {
      const existing = await db.preferences.get('default')
      return existing ?? { id: 'default' }
    },
    { id: 'default' },
  )
}

export async function savePreferences(
  prefs: Partial<Omit<UserPreferences, 'id'>>,
): Promise<void> {
  await safeStorageWrite('savePreferences', async () => {
    const current = await getPreferences()
    await db.preferences.put({ ...current, ...prefs, id: 'default' })
  })
}

export async function getStoredSession(): Promise<StoredSession | undefined> {
  return safeStorageRead(
    'getStoredSession',
    () => db.sessions.get('current'),
    undefined,
  )
}

export async function saveStoredSession(
  session: Omit<StoredSession, 'id' | 'updatedAt'>,
): Promise<void> {
  await safeStorageWrite('saveStoredSession', () =>
    db.sessions.put({
      ...session,
      id: 'current',
      updatedAt: new Date().toISOString(),
    }),
  )
}

export async function clearStoredSession(): Promise<void> {
  await safeStorageWrite('clearStoredSession', () =>
    db.sessions.delete('current'),
  )
}

export async function getContentBundleOverride(): Promise<ContentBundle | undefined> {
  return safeStorageRead(
    'getContentBundleOverride',
    async () => {
      const row = await db.contentBundles.get('active')
      return row?.bundle
    },
    undefined,
  )
}

export async function saveContentBundleOverride(
  bundle: ContentBundle,
): Promise<void> {
  await safeStorageWrite('saveContentBundleOverride', () =>
    db.contentBundles.put({
      id: 'active',
      bundle,
      updatedAt: new Date().toISOString(),
    }),
  )
}

export async function clearContentBundleOverride(): Promise<void> {
  await safeStorageWrite('clearContentBundleOverride', () =>
    db.contentBundles.delete('active'),
  )
}

export async function resetAllData(): Promise<void> {
  await safeStorageWrite('resetAllData', async () => {
    await db.sessions.clear()
    await db.preferences.clear()
    await db.contentBundles.clear()
  })
}
