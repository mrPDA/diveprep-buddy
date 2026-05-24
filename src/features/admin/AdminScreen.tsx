import { useEffect, useMemo, useRef, useState } from 'react'
import { useAppStore } from '@/app/store'
import { Button } from '@/components/ui/Button'
import { Field, SelectField, TextArea } from '@/components/ui/Field'
import { TEMPLATE_IDS } from '@/lib/content/defaults'
import { downloadContentBundle, parseImportedBundle } from '@/lib/content/export'
import {
  collectStringLeaves,
  groupLeavesByTopSection,
  humanizePath,
  setNestedString,
} from '@/lib/content/paths'
import { isContentStudio } from '@/lib/env'
import { useContentStore } from '@/lib/content/store'
import type { ContentBundle } from '@/lib/content/types'
import { useTranslation } from '@/i18n/useTranslation'
import type { Locale } from '@/i18n/types'
import type { BuddyCheckStep, ChecklistCategory, ChecklistItem } from '@/types'

type AdminTab = 'app' | 'ui' | 'buddy' | 'templates'

const CATEGORIES: ChecklistCategory[] = [
  'core-gear',
  'safety',
  'exposure',
  'camera',
  'travel',
  'documents',
]

export function AdminScreen() {
  const { t } = useTranslation()
  const setView = useAppStore((s) => s.setView)
  const refreshChecklist = useAppStore((s) => s.refreshChecklistFromContent)
  const bundle = useContentStore((s) => s.bundle)
  const isCustomized = useContentStore((s) => s.isCustomized)
  const saveBundle = useContentStore((s) => s.saveBundle)
  const resetToDefaults = useContentStore((s) => s.resetToDefaults)

  const [draft, setDraft] = useState<ContentBundle>(() => structuredClone(bundle))
  const [tab, setTab] = useState<AdminTab>('app')
  const [editLocale, setEditLocale] = useState<Locale>('ru')
  const [templateId, setTemplateId] = useState<string>('base')
  const [saveState, setSaveState] = useState<'idle' | 'saved'>('idle')
  const importRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setDraft(structuredClone(bundle))
  }, [bundle])

  const localeContent = draft.locales[editLocale]
  const uiLeaves = useMemo(
    () =>
      collectStringLeaves(localeContent.ui).filter(
        (leaf) => !leaf.path.startsWith('admin.'),
      ),
    [localeContent.ui],
  )
  const uiSections = useMemo(() => groupLeavesByTopSection(uiLeaves), [uiLeaves])

  const template =
    localeContent.templates[templateId] ??
    localeContent.templates.base

  const updateDraft = (next: ContentBundle) => {
    setDraft(next)
    setSaveState('idle')
  }

  const handleSave = async () => {
    const next: ContentBundle = {
      ...draft,
      updatedAt: new Date().toISOString(),
    }
    await saveBundle(next)
    document.title = next.appMeta.name
    refreshChecklist()
    if (isContentStudio) {
      downloadContentBundle(next, 'content.bundle.json')
    }
    setSaveState('saved')
    setTimeout(() => setSaveState('idle'), 2000)
  }

  const handleReset = async () => {
    if (!window.confirm(t('admin.resetConfirm'))) return
    await resetToDefaults()
    refreshChecklist()
    setView('context')
  }

  const handleImport = async (file: File) => {
    try {
      const text = await file.text()
      const imported = parseImportedBundle(text)
      updateDraft(imported)
    } catch {
      window.alert(t('admin.importError'))
    }
  }

  const tabs: { id: AdminTab; label: string }[] = [
    { id: 'app', label: t('admin.tabs.app') },
    { id: 'ui', label: t('admin.tabs.ui') },
    { id: 'buddy', label: t('admin.tabs.buddy') },
    { id: 'templates', label: t('admin.tabs.templates') },
  ]

  return (
    <div className="flex flex-1 flex-col pb-[calc(13rem+env(safe-area-inset-bottom))]">
      <header className="mb-4 space-y-2">
        <button
          type="button"
          onClick={() => setView('context')}
          className="text-sm text-sky-400 hover:text-sky-300"
        >
          {t('admin.back')}
        </button>
        <h1 className="text-2xl font-bold text-slate-50">{t('admin.title')}</h1>
        <p className="text-sm text-slate-400">{t('admin.subtitle')}</p>
        <p className="text-xs text-slate-500">
          {isCustomized ? t('admin.customized') : t('admin.defaults')}
        </p>
        {isContentStudio && (
          <div className="rounded-xl border border-sky-400/30 bg-sky-400/10 p-3 text-sm text-sky-100">
            <p>{t('admin.studioHint')}</p>
            <code className="mt-2 block overflow-x-auto text-xs text-sky-200">
              {t('admin.studioCommand')}
            </code>
          </div>
        )}
      </header>

      <div className="mb-4 grid grid-cols-2 gap-2">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={[
              'rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
              tab === item.id
                ? 'bg-sky-400 text-slate-900'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700',
            ].join(' ')}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab !== 'app' && (
        <SelectField
          label={t('admin.locale')}
          value={editLocale}
          onChange={(e) => setEditLocale(e.target.value as Locale)}
          className="mb-4"
        >
          <option value="en">English</option>
          <option value="ru">Русский</option>
        </SelectField>
      )}

      {tab === 'app' && (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            {t('admin.appSection')}
          </h2>
          <Field
            label="name"
            value={draft.appMeta.name}
            onChange={(e) =>
              updateDraft({
                ...draft,
                appMeta: { ...draft.appMeta, name: e.target.value },
              })
            }
          />
          <Field
            label="shortName"
            value={draft.appMeta.shortName}
            onChange={(e) =>
              updateDraft({
                ...draft,
                appMeta: { ...draft.appMeta, shortName: e.target.value },
              })
            }
          />
          <TextArea
            label="description"
            value={draft.appMeta.description}
            onChange={(e) =>
              updateDraft({
                ...draft,
                appMeta: { ...draft.appMeta, description: e.target.value },
              })
            }
          />
          <Field
            label="themeColor"
            value={draft.appMeta.themeColor}
            onChange={(e) =>
              updateDraft({
                ...draft,
                appMeta: { ...draft.appMeta, themeColor: e.target.value },
              })
            }
          />
        </section>
      )}

      {tab === 'ui' && (
        <section className="space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            {t('admin.uiSection')}
          </h2>
          {Object.entries(uiSections).map(([section, leaves]) => (
            <div key={section} className="space-y-3 rounded-2xl border border-slate-700 bg-slate-800/40 p-4">
              <h3 className="font-semibold capitalize text-sky-300">{section}</h3>
              {leaves.map((leaf) => (
                <TextArea
                  key={leaf.path}
                  label={humanizePath(leaf.path)}
                  value={leaf.value}
                  onChange={(e) => {
                    const ui = setNestedString(
                      localeContent.ui,
                      leaf.path,
                      e.target.value,
                    )
                    updateDraft({
                      ...draft,
                      locales: {
                        ...draft.locales,
                        [editLocale]: { ...localeContent, ui },
                      },
                    })
                  }}
                />
              ))}
            </div>
          ))}
        </section>
      )}

      {tab === 'buddy' && (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            {t('admin.buddySection')}
          </h2>
          {localeContent.buddyCheck.steps.map((step, index) => (
            <BuddyStepEditor
              key={step.id}
              step={step}
              labels={{
                title: t('admin.stepTitle'),
                prompt: t('admin.stepPrompt'),
                confirm: t('admin.stepConfirm'),
              }}
              onChange={(updated) => {
                const steps = [...localeContent.buddyCheck.steps]
                steps[index] = updated
                updateDraft({
                  ...draft,
                  locales: {
                    ...draft.locales,
                    [editLocale]: {
                      ...localeContent,
                      buddyCheck: { ...localeContent.buddyCheck, steps },
                    },
                  },
                })
              }}
            />
          ))}
        </section>
      )}

      {tab === 'templates' && template && (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            {t('admin.templateSection')}
          </h2>
          <SelectField
            label={t('admin.selectTemplate')}
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
          >
            {TEMPLATE_IDS.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </SelectField>
          <Field
            label="Template name"
            value={template.name}
            onChange={(e) => {
              const templates = {
                ...localeContent.templates,
                [templateId]: { ...template, name: e.target.value },
              }
              updateDraft({
                ...draft,
                locales: {
                  ...draft.locales,
                  [editLocale]: { ...localeContent, templates },
                },
              })
            }}
          />
          {template.items.map((item, index) => (
            <TemplateItemEditor
              key={item.id}
              item={item}
              labels={{
                label: t('admin.itemLabel'),
                hint: t('admin.itemHint'),
                category: t('admin.itemCategory'),
                critical: t('admin.itemCritical'),
                remove: t('admin.removeItem'),
              }}
              onChange={(updated) => {
                const items = [...template.items]
                items[index] = updated
                const templates = {
                  ...localeContent.templates,
                  [templateId]: { ...template, items },
                }
                updateDraft({
                  ...draft,
                  locales: {
                    ...draft.locales,
                    [editLocale]: { ...localeContent, templates },
                  },
                })
              }}
              onRemove={() => {
                const items = template.items.filter((_, i) => i !== index)
                const templates = {
                  ...localeContent.templates,
                  [templateId]: { ...template, items },
                }
                updateDraft({
                  ...draft,
                  locales: {
                    ...draft.locales,
                    [editLocale]: { ...localeContent, templates },
                  },
                })
              }}
            />
          ))}
          <Button
            variant="secondary"
            fullWidth
            onClick={() => {
              const newItem: ChecklistItem = {
                id: `custom-${Date.now()}`,
                label: 'New item',
                category: 'core-gear',
              }
              const templates = {
                ...localeContent.templates,
                [templateId]: {
                  ...template,
                  items: [...template.items, newItem],
                },
              }
              updateDraft({
                ...draft,
                locales: {
                  ...draft.locales,
                  [editLocale]: { ...localeContent, templates },
                },
              })
            }}
          >
            {t('admin.addItem')}
          </Button>
        </section>
      )}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-700 bg-slate-900/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
        <div className="mx-auto flex max-w-lg flex-col gap-2">
          <Button fullWidth onClick={() => void handleSave()}>
            {saveState === 'saved' ? t('admin.saved') : t('admin.save')}
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => downloadContentBundle(draft, 'content.bundle.json')}>
              {t('admin.export')}
            </Button>
            <Button variant="secondary" onClick={() => importRef.current?.click()}>
              {t('admin.import')}
            </Button>
          </div>
          <Button variant="ghost" onClick={() => void handleReset()}>
            {t('admin.reset')}
          </Button>
        </div>
      </div>

      <input
        ref={importRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void handleImport(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}

function BuddyStepEditor({
  step,
  labels,
  onChange,
}: {
  step: BuddyCheckStep
  labels: { title: string; prompt: string; confirm: string }
  onChange: (step: BuddyCheckStep) => void
}) {
  return (
    <div className="space-y-3 rounded-2xl border border-slate-700 bg-slate-800/40 p-4">
      <p className="text-xs font-mono uppercase text-slate-500">{step.id}</p>
      <Field
        label={labels.title}
        value={step.title}
        onChange={(e) => onChange({ ...step, title: e.target.value })}
      />
      <TextArea
        label={labels.prompt}
        value={step.prompt}
        onChange={(e) => onChange({ ...step, prompt: e.target.value })}
      />
      <Field
        label={labels.confirm}
        value={step.confirmLabel}
        onChange={(e) => onChange({ ...step, confirmLabel: e.target.value })}
      />
    </div>
  )
}

function TemplateItemEditor({
  item,
  labels,
  onChange,
  onRemove,
}: {
  item: ChecklistItem
  labels: {
    label: string
    hint: string
    category: string
    critical: string
    remove: string
  }
  onChange: (item: ChecklistItem) => void
  onRemove: () => void
}) {
  return (
    <div className="space-y-3 rounded-2xl border border-slate-700 bg-slate-800/40 p-4">
      <p className="text-xs font-mono uppercase text-slate-500">{item.id}</p>
      <Field
        label={labels.label}
        value={item.label}
        onChange={(e) => onChange({ ...item, label: e.target.value })}
      />
      <Field
        label={labels.hint}
        value={item.hint ?? ''}
        onChange={(e) =>
          onChange({ ...item, hint: e.target.value || undefined })
        }
      />
      <SelectField
        label={labels.category}
        value={item.category}
        onChange={(e) =>
          onChange({ ...item, category: e.target.value as ChecklistCategory })
        }
      >
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </SelectField>
      <label className="flex items-center gap-3 text-sm text-slate-300">
        <input
          type="checkbox"
          checked={Boolean(item.critical)}
          onChange={(e) => onChange({ ...item, critical: e.target.checked })}
          className="h-5 w-5 rounded border-slate-500"
        />
        {labels.critical}
      </label>
      <Button variant="ghost" onClick={onRemove}>
        {labels.remove}
      </Button>
    </div>
  )
}
