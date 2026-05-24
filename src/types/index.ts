export type DiveType = 'shore' | 'boat'

export interface DiveContext {
  diveType: DiveType | null
  coldWater: boolean
  nightDive: boolean
  photography: boolean
  travel: boolean
  training: boolean
  rentalGear: boolean
}

export const defaultDiveContext = (): DiveContext => ({
  diveType: null,
  coldWater: false,
  nightDive: false,
  photography: false,
  travel: false,
  training: false,
  rentalGear: false,
})

export type ChecklistCategory =
  | 'core-gear'
  | 'safety'
  | 'exposure'
  | 'camera'
  | 'documents'
  | 'travel'

export interface ChecklistItem {
  id: string
  label: string
  hint?: string
  category: ChecklistCategory
  critical?: boolean
}

export interface ChecklistTemplate {
  id: string
  name: string
  items: ChecklistItem[]
}

export interface ChecklistItemState extends ChecklistItem {
  completed: boolean
}

export interface ComposedChecklist {
  context: DiveContext
  items: ChecklistItemState[]
  generatedAt: string
  /** When true, rental inspection items are hidden from the checklist view. */
  rentalSectionHidden?: boolean
}

export interface BuddyCheckStep {
  id: string
  title: string
  prompt: string
  confirmLabel: string
}

export interface BuddyCheckSession {
  stepsCompleted: string[]
  completedAt?: string
}

export type AppView = 'context' | 'checklist' | 'buddy-check' | 'summary' | 'admin'

export type Locale = 'en' | 'ru'

export interface UserPreferences {
  id: 'default'
  disclaimerAcceptedAt?: string
  lastContext?: DiveContext
  locale?: Locale
  sunlightMode?: boolean
}

export interface StoredSession {
  id: string
  checklist: ComposedChecklist
  buddyCheck: BuddyCheckSession
  updatedAt: string
}
