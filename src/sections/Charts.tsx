import type { DashboardMetrics } from '@/data/dashboardMetrics'
import { getCaseFields, localizeArticle } from '@/lib/i18n'
import { useLanguage } from '@/lib/LanguageContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart as RechartsLineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'

const COMPANY_COLORS: Record<string, string> = {
  Alphabet: '#4285F4',
  Apple: '#334155',
  Meta: '#0866FF',
}

export default function Charts({ metrics }: { metrics: DashboardMetrics }) {
  const { locale, t } = useLanguage()
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base text-slate-800">{t('charts.fineTrend')}</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={metrics.finesByYear} margin={{ left: 0, right: 18, top: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip
                formatter={(value: number) => [`${value} ${t('charts.fineUnit')}`, t('charts.cumulativeFine')]}
                contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid #e2e8f0' }}
              />
              <Line type="monotone" dataKey="cumulative" stroke="#dc2626" strokeWidth={3} dot={{ r: 5 }} />
            </RechartsLineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base text-slate-800">{t('charts.companyFines')}</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics.finesByCompany} margin={{ left: 0, right: 18, top: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="company" tick={{ fontSize: 12, fill: '#334155' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip
                formatter={(value: number) => [`${value} ${t('charts.fineUnit')}`, t('charts.cumulativeFine')]}
                contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid #e2e8f0' }}
              />
              <Bar dataKey="fine" radius={[4, 4, 0, 0]}>
                {metrics.finesByCompany.map((item) => <Cell key={item.company} fill={COMPANY_COLORS[item.company] ?? '#64748b'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base text-slate-800">{t('charts.articles')}</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics.casesByArticle.map((item) => ({ ...item, article: localizeArticle(item.article, locale) }))} layout="vertical" margin={{ left: 12, right: 18, top: 10 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis type="category" dataKey="article" width={105} tick={{ fontSize: 12, fill: '#334155' }} />
              <Tooltip
                formatter={(value: number) => [`${value} ${t('charts.itemUnit')}`, t('charts.caseCount')]}
                contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid #e2e8f0' }}
              />
              <Bar dataKey="cases" fill="#2563eb" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base text-slate-800">{t('charts.singleFines')}</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics.finesByCase.map((item) => ({ ...item, name: (getCaseFields(item.id, locale).title ?? item.title).replace('案', '') }))} layout="vertical" margin={{ left: 10, right: 30, top: 10 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis type="category" dataKey="name" width={145} tick={{ fontSize: 12, fill: '#334155' }} />
              <Tooltip
                formatter={(value: number) => [`${value} ${t('charts.fineUnit')}`, t('charts.fine')]}
                contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid #e2e8f0' }}
              />
              <Bar dataKey="fine" radius={[0, 4, 4, 0]}>
                {metrics.finesByCase.map((item) => <Cell key={item.id} fill="#dc2626" />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
