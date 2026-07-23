import { CATEGORY_META, formatDate, formatFine, type DmaCase } from '@/data/cases'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarDays, ExternalLink, Gavel, Scale, AlertTriangle } from 'lucide-react'

export default function CaseCard({ item }: { item: DmaCase }) {
  const meta = CATEGORY_META[item.category]
  return (
    <Card className="flex flex-col border-slate-200 shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="space-y-3 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${meta.color}`}>
            {meta.label}
          </span>
          <Badge variant="outline" className="text-xs">{item.stage}</Badge>
        </div>
        <CardTitle className="text-lg leading-snug text-slate-900">{item.title}</CardTitle>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
          <span>{item.gatekeeper}</span>
          <span>{item.cps}</span>
          {item.articles.map((a) => (
            <span key={a} className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-600">{a}</span>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 pt-0">
        {item.fine != null && (
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-bold tracking-tight ${item.category === 'related' ? 'text-amber-600' : 'text-red-600'}`}>
              {formatFine(item.fine)}
            </span>
            <span className="text-sm text-slate-500">罚款</span>
          </div>
        )}
        <p className="text-sm leading-relaxed text-slate-600">{item.summary}</p>

        <div className="space-y-1.5 text-xs text-slate-500">
          {item.openedDate && (
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              <span>{formatDate(item.openedDate)} · {item.openedLabel ?? '启动程序'}</span>
            </div>
          )}
          {item.decisionDate && (
            <div className="flex items-center gap-1.5">
              <Gavel className="h-3.5 w-3.5" />
              <span>{formatDate(item.decisionDate)} · {item.decisionLabel ?? '作出决定'}</span>
            </div>
          )}
          {item.deadline && (
            <div className="flex items-center gap-1.5 text-red-600">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>{item.deadline}</span>
            </div>
          )}
          {item.appeal && (
            <div className="flex items-center gap-1.5 text-purple-600">
              <Scale className="h-3.5 w-3.5" />
              <span>{item.appeal}</span>
            </div>
          )}
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="details" className="border-slate-100">
            <AccordionTrigger className="py-2 text-sm text-slate-700">案件要点</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-600">
                {item.keyPoints.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-auto flex flex-wrap gap-2 border-t border-slate-100 pt-3">
          {item.sources.map((s) => (
            <a
              key={s.url + s.label}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-700 hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              {s.label}
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
