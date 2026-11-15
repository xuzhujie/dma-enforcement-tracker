import { AlertTriangle, CalendarClock, ExternalLink, Gavel, SearchCheck } from 'lucide-react'
import { DATA_AS_OF, formatDate, formatFine } from '@/data/cases'
import type { DashboardMetrics } from '@/data/dashboardMetrics'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Charts from '@/sections/Charts'

interface DashboardOverviewProps {
  metrics: DashboardMetrics
  lastStoredUpdate?: string
}

const ATTENTION_STYLES: Record<string, string> = {
  '上诉中': 'border-purple-200 bg-purple-50 text-purple-700',
  '整改状态待核': 'border-amber-200 bg-amber-50 text-amber-700',
  '在办程序': 'border-blue-200 bg-blue-50 text-blue-700',
}

function displayStoredDate(value?: string): string {
  return value ? value.slice(0, 10) : '尚无存档'
}

export default function DashboardOverview({ metrics, lastStoredUpdate }: DashboardOverviewProps) {
  const operatingStats = [
    { label: '上诉中', value: metrics.appealCount, icon: Gavel, tone: 'text-purple-700 bg-purple-50' },
    { label: '整改状态待核', value: metrics.pendingVerificationCount, icon: AlertTriangle, tone: 'text-amber-700 bg-amber-50' },
    { label: '在办程序', value: metrics.proceedingCount, icon: SearchCheck, tone: 'text-blue-700 bg-blue-50' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {operatingStats.map(({ label, value, icon: Icon, tone }) => (
          <Card key={label} className="border-slate-200">
            <CardContent className="flex items-center gap-3 p-4">
              <span className={`rounded-lg p-2 ${tone}`}><Icon className="h-5 w-5" /></span>
              <div>
                <div className="text-xs font-medium text-slate-500">{label}</div>
                <div className="text-2xl font-bold text-slate-900">{value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-slate-800">待关注案件</CardTitle>
            <p className="text-xs text-slate-500">按上诉、整改状态和在办程序排序，便于下一步人工复核。</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {metrics.attention.length === 0 ? (
              <p className="py-5 text-sm text-slate-400">当前没有需要人工复核的案件。</p>
            ) : metrics.attention.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-100 bg-slate-50/70 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  {item.reasons.map((reason) => <Badge key={reason} variant="outline" className={ATTENTION_STYLES[reason]}>{reason}</Badge>)}
                  <span className="text-xs text-slate-400">{item.gatekeeper}</span>
                  {item.fine != null && <span className="ml-auto text-sm font-semibold text-red-600">{formatFine(item.fine)}</span>}
                </div>
                <div className="mt-1 font-medium text-slate-800">{item.title}</div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                  <span>{item.stage}</span>
                  {item.sources[0] && (
                    <a href={item.sources[0].url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-700 hover:underline">
                      官方来源 <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-slate-800">数据新鲜度</CardTitle>
            <p className="text-xs text-slate-500">区分人工核验的案件库与 RSS 动态文件。</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <CalendarClock className="mt-0.5 h-4 w-4 text-blue-700" />
              <div>
                <div className="text-xs text-slate-500">案件主数据核验截至</div>
                <div className="font-semibold text-slate-800">{formatDate(DATA_AS_OF)}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <SearchCheck className="mt-0.5 h-4 w-4 text-emerald-700" />
              <div>
                <div className="text-xs text-slate-500">RSS 动态文件最后更新</div>
                <div className="font-semibold text-slate-800">{displayStoredDate(lastStoredUpdate)}</div>
              </div>
            </div>
            <div className="rounded-lg bg-blue-50/70 p-3 text-xs leading-relaxed text-blue-900">
              RSS 日期表示动态文件最后一次发生变化。没有新动态的每日监控不会改写文件，也不会制造空提交。
            </div>
          </CardContent>
        </Card>
      </div>

      <Charts metrics={metrics} />
    </div>
  )
}
