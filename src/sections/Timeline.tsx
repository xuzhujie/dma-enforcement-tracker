import { formatDate, formatFine, type DmaCase } from '@/data/cases'

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
  const events: TimelineEvent[] = items.flatMap((c) => {
    const evts: TimelineEvent[] = []
    if (c.openedDate) {
      evts.push({ date: c.openedDate, label: c.openedLabel ?? '启动程序', caseTitle: c.title, fine: null, category: c.category })
    }
    if (c.decisionDate) {
      evts.push({ date: c.decisionDate, label: c.decisionLabel ?? '作出决定', caseTitle: c.title, fine: c.fine, category: c.category })
    }
    return evts
  })
  events.sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="relative ml-3 space-y-0 border-l-2 border-slate-200 pl-6">
      {events.map((e, i) => (
        <div key={i} className="relative pb-7">
          <span className={`absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white ${DOT_COLOR[e.category]}`} />
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">{formatDate(e.date)}</div>
          <div className="mt-0.5 font-semibold text-slate-800">
            {e.label}
            {e.fine != null && (
              <span className={`ml-2 ${e.category === 'related' ? 'text-amber-600' : 'text-red-600'}`}>{formatFine(e.fine)}</span>
            )}
          </div>
          <div className="text-sm text-slate-500">{e.caseTitle}</div>
        </div>
      ))}
    </div>
  )
}
