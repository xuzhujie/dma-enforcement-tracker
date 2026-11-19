import { formatDate, formatFine, type DmaCase } from '@/data/cases'
import { getCaseCopy } from '@/lib/i18n'
import { useLanguage } from '@/lib/LanguageContext'

interface TimelineEvent {
  date: string
  label: string
  caseTitle: string
  fine: number | null
  category: DmaCase['category']
}

const DOT_COLOR: Record<string, string> = {
  penalty: 'bg-red-500',
  proceeding: 'bg-blue-500',
  closed: 'bg-slate-400',
  related: 'bg-amber-500',
}

export default function Timeline({ items }: { items: DmaCase[] }) {
  const { locale } = useLanguage()
  const events: TimelineEvent[] = items.flatMap((c) => {
    const localized = getCaseCopy(c, locale)
    const evts: TimelineEvent[] = []
    if (c.openedDate) {
      evts.push({ date: c.openedDate, label: localized.openedLabel ?? (locale === 'en' ? 'Proceeding opened' : '启动程序'), caseTitle: localized.title, fine: null, category: c.category })
    }
    if (c.decisionDate) {
      evts.push({ date: c.decisionDate, label: localized.decisionLabel ?? (locale === 'en' ? 'Decision issued' : '作出决定'), caseTitle: localized.title, fine: c.fine, category: c.category })
    }
    return evts
  })
  events.sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="relative ml-3 space-y-0 border-l-2 border-slate-200 pl-6">
      {events.map((e, i) => (
        <div key={i} className="relative pb-7">
          <span className={`absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white ${DOT_COLOR[e.category]}`} />
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">{formatDate(e.date, locale)}</div>
          <div className="mt-0.5 font-semibold text-slate-800">
            {e.label}
            {e.fine != null && (
              <span className={`ml-2 ${e.category === 'related' ? 'text-amber-600' : 'text-red-600'}`}>{formatFine(e.fine, locale)}</span>
            )}
          </div>
          <div className="text-sm text-slate-500">{e.caseTitle}</div>
        </div>
      ))}
    </div>
  )
}
