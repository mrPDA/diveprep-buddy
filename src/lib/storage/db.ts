import Dexie, { type EntityTable } from 'dexie'
import type { StoredSession, UserPreferences } from '@/types'

class DivePrepDatabase extends Dexie {
  preferences!: EntityTable<UserPreferences, 'id'>
  sessions!: EntityTable<StoredSession, 'id'>

  constructor() {
    super('DivePrepBuddy')
    this.version(1).stores({
      preferences: 'id',
      sessions: 'id',
    })
  }
}

export const db = new DivePrepDatabase()

export async function getPreferences(): Promise<UserPreferences> {
  const existing = await db.preferences.get('default')
  return existing ?? { id: 'default' }
}

export async function savePreferences(
  prefs: Partial<Omit<UserPreferences, 'id'>>,
): Promise<void> {
  const current = await getPreferences()
  await db.preferences.put({ ...current, ...prefs, id: 'default' })
}

export async function getStoredSession(): Promise<StoredSession | undefined> {
  return db.sessions.get('current')
}

export async function saveStoredSession(
  session: Omit<StoredSession, 'id' | 'updatedAt'>,
): Promise<void> {
  await db.sessions.put({
    ...session,
    id: 'current',
    updatedAt: new Date().toISOString(),
  })
}

export async function clearStoredSession(): Promise<void> {
  await db.sessions.delete('current')
}

export async function resetAllData(): Promise<void> {
  await db.sessions.clear()
  await db.preferences.clear()
}
