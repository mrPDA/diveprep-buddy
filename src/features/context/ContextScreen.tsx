import { useAppStore } from '@/app/store'
import { Button } from '@/components/ui/Button'
import { ContextCard, ToggleCard } from '@/components/ui/ContextCard'
import { useTranslation } from '@/i18n/useTranslation'

export function ContextScreen() {
  const context = useAppStore((s) => s.context)
  const setContext = useAppStore((s) => s.setContext)
  const generateChecklist = useAppStore((s) => s.generateChecklist)
  const { t } = useTranslation()

  const canGenerate = context.diveType !== null

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-50 sm:text-3xl">
          {t('context.title')}
        </h1>
        <p className="text-slate-400">{t('context.subtitle')}</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          {t('context.diveType')}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <ContextCard
            label={t('context.boat.label')}
            description={t('context.boat.description')}
            selected={context.diveType === 'boat'}
            onSelect={() => setContext({ diveType: 'boat' })}
          />
          <ContextCard
            label={t('context.shore.label')}
            description={t('context.shore.description')}
            selected={context.diveType === 'shore'}
            onSelect={() => setContext({ diveType: 'shore' })}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          {t('context.modifiers')}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <ToggleCard
            label={t('context.nightDive')}
            active={context.nightDive}
            onToggle={() => setContext({ nightDive: !context.nightDive })}
          />
          <ToggleCard
            label={t('context.coldWater')}
            active={context.coldWater}
            onToggle={() => setContext({ coldWater: !context.coldWater })}
          />
          <ToggleCard
            label={t('context.photography')}
            active={context.photography}
            onToggle={() => setContext({ photography: !context.photography })}
          />
          <ToggleCard
            label={t('context.travel')}
            active={context.travel}
            onToggle={() => setContext({ travel: !context.travel })}
          />
          <ToggleCard
            label={t('context.training')}
            active={context.training}
            onToggle={() => setContext({ training: !context.training })}
          />
        </div>
      </section>

      <Button fullWidth disabled={!canGenerate} onClick={generateChecklist}>
        {t('context.generate')}
      </Button>
    </div>
  )
}
