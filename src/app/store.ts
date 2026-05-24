import { create } from 'zustand'
import { applyDocumentLocale } from '@/i18n'
import { DEFAULT_LOCALE, detectBrowserLocale, type Locale } from '@/i18n/types'
import { composeChecklist, withCompletionState } from '@/lib/checklist-engine'
import { applySunlightMode } from '@/lib/sunlight-theme'
import { getBuddyCheckSteps, getChecklistTemplates } from '@/lib/templates'
import {
  clearStoredSession,
  getPreferences,
  getStoredSession,
  savePreferences,
  saveStoredSession,
} from '@/lib/storage/db'
import type {
  AppView,
  BuddyCheckSession,
  ComposedChecklist,
  DiveContext,
} from '@/types'
import { defaultDiveContext } from '@/types'

function normalizeDiveContext(raw?: Partial<DiveContext>): DiveContext {
  return {
    ...defaultDiveContext(),
    ...raw,
    rentalGear: raw?.rentalGear ?? false,
  }
}

interface AppState {
  hydrated: boolean
  locale: Locale
  view: AppView
  context: DiveContext
  checklist: ComposedChecklist | null
  buddyCheck: BuddyCheckSession
  disclaimerAcceptedAt: string | undefined
  sunlightMode: boolean
  setView: (view: AppView) => void
  setLocale: (locale: Locale) => void
  setSunlightMode: (enabled: boolean) => void
  setContext: (context: Partial<DiveContext>) => void
  generateChecklist: () => void
  toggleItem: (itemId: string) => void
  setRentalSectionHidden: (hidden: boolean) => void
  resetChecklist: () => void
  completeBuddyStep: (stepId: string) => void
  resetBuddyCheck: () => void
  finishBuddyCheck: () => void
  acceptDisclaimer: () => Promise<void>
  startNewPreparation: () => void
  refreshChecklistFromContent: () => void
  hydrate: () => Promise<void>
}

const emptyBuddyCheck = (): BuddyCheckSession => ({ stepsCompleted: [] })

function buildChecklist(
  context: DiveContext,
  locale: Locale,
  completedIds = new Set<string>(),
): ComposedChecklist {
  const items = composeChecklist(context, getChecklistTemplates(locale))
  return {
    context: { ...context },
    items: withCompletionState(items, completedIds),
    generatedAt: new Date().toISOString(),
  }
}

function relocalizeChecklist(
  checklist: ComposedChecklist,
  locale: Locale,
): ComposedChecklist {
  const completedIds = new Set(
    checklist.items.filter((item) => item.completed).map((item) => item.id),
  )
  return {
    ...buildChecklist(checklist.context, locale, completedIds),
    rentalSectionHidden: checklist.rentalSectionHidden ?? false,
  }
}

export const useAppStore = create<AppState>((set, get) => ({
  hydrated: false,
  locale: DEFAULT_LOCALE,
  view: 'context',
  context: defaultDiveContext(),
  checklist: null,
  buddyCheck: emptyBuddyCheck(),
  disclaimerAcceptedAt: undefined,
  sunlightMode: false,

  setView: (view) => set({ view }),

  setSunlightMode: (enabled) => {
    applySunlightMode(enabled)
    set({ sunlightMode: enabled })
    void savePreferences({ sunlightMode: enabled })
  },

  setLocale: (locale) => {
    const { checklist, buddyCheck } = get()
    applyDocumentLocale(locale)
    set({ locale })

    void savePreferences({ locale })

    if (!checklist) return

    const updated = relocalizeChecklist(checklist, locale)
    set({ checklist: updated })
    void saveStoredSession({ checklist: updated, buddyCheck })
  },

  setContext: (partial) =>
    set((state) => ({ context: { ...state.context, ...partial } })),

  generateChecklist: () => {
    const { context, locale } = get()
    if (!context.diveType) return

    const checklist = buildChecklist(context, locale)
    set({
      checklist,
      buddyCheck: emptyBuddyCheck(),
      view: 'checklist',
    })

    void savePreferences({ lastContext: context, locale })
    void saveStoredSession({ checklist, buddyCheck: emptyBuddyCheck() })
  },

  toggleItem: (itemId) => {
    const { checklist, buddyCheck } = get()
    if (!checklist) return

    const updated: ComposedChecklist = {
      ...checklist,
      items: checklist.items.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item,
      ),
    }

    set({ checklist: updated })
    void saveStoredSession({ checklist: updated, buddyCheck })
  },

  setRentalSectionHidden: (hidden) => {
    const { checklist, buddyCheck } = get()
    if (!checklist) return

    const updated: ComposedChecklist = {
      ...checklist,
      rentalSectionHidden: hidden,
    }

    set({ checklist: updated })
    void saveStoredSession({ checklist: updated, buddyCheck })
  },

  resetChecklist: () => {
    const { checklist } = get()
    if (!checklist) return

    const reset: ComposedChecklist = {
      ...checklist,
      rentalSectionHidden: false,
      items: checklist.items.map((item) => ({ ...item, completed: false })),
    }

    set({ checklist: reset, buddyCheck: emptyBuddyCheck() })
    void saveStoredSession({ checklist: reset, buddyCheck: emptyBuddyCheck() })
  },

  completeBuddyStep: (stepId) => {
    const { buddyCheck, checklist } = get()
    if (!checklist) return

    const stepsCompleted = buddyCheck.stepsCompleted.includes(stepId)
      ? buddyCheck.stepsCompleted
      : [...buddyCheck.stepsCompleted, stepId]

    const updated: BuddyCheckSession = { stepsCompleted }
    set({ buddyCheck: updated })
    void saveStoredSession({ checklist, buddyCheck: updated })
  },

  resetBuddyCheck: () => {
    const { checklist } = get()
    if (!checklist) return
    set({ buddyCheck: emptyBuddyCheck() })
    void saveStoredSession({ checklist, buddyCheck: emptyBuddyCheck() })
  },

  finishBuddyCheck: () => {
    const { buddyCheck, checklist } = get()
    if (!checklist) return

    const completed: BuddyCheckSession = {
      ...buddyCheck,
      completedAt: new Date().toISOString(),
    }

    set({ buddyCheck: completed, view: 'summary' })
    void saveStoredSession({ checklist, buddyCheck: completed })
  },

  acceptDisclaimer: async () => {
    const acceptedAt = new Date().toISOString()
    await savePreferences({ disclaimerAcceptedAt: acceptedAt })
    set({ disclaimerAcceptedAt: acceptedAt })
  },

  startNewPreparation: () => {
    set({
      view: 'context',
      context: defaultDiveContext(),
      checklist: null,
      buddyCheck: emptyBuddyCheck(),
    })
    void clearStoredSession()
  },

  refreshChecklistFromContent: () => {
    const { checklist, buddyCheck, locale } = get()
    if (!checklist) return
    const updated = relocalizeChecklist(checklist, locale)
    set({ checklist: updated })
    void saveStoredSession({ checklist: updated, buddyCheck })
  },

  hydrate: async () => {
    const [prefs, session] = await Promise.all([
      getPreferences(),
      getStoredSession(),
    ])

    const locale = prefs.locale ?? detectBrowserLocale()
    const sunlightMode = prefs.sunlightMode ?? false
    applyDocumentLocale(locale)
    applySunlightMode(sunlightMode)

    const base = {
      hydrated: true,
      locale,
      sunlightMode,
      disclaimerAcceptedAt: prefs.disclaimerAcceptedAt,
      context: normalizeDiveContext(prefs.lastContext),
    }

    if (session?.checklist) {
      let view: AppView = 'checklist'
      if (session.buddyCheck?.completedAt) {
        view = 'summary'
      } else if ((session.buddyCheck?.stepsCompleted.length ?? 0) > 0) {
        view = 'buddy-check'
      }

      const checklist = relocalizeChecklist(session.checklist, locale)

      set({
        ...base,
        checklist,
        buddyCheck: session.buddyCheck ?? emptyBuddyCheck(),
        view,
      })
      void saveStoredSession({
        checklist,
        buddyCheck: session.buddyCheck ?? emptyBuddyCheck(),
      })
    } else {
      set(base)
    }
  },
}))

export function useBuddyCheckSteps() {
  return useAppStore((s) => getBuddyCheckSteps(s.locale))
}
