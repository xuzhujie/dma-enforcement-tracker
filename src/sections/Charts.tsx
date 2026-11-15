import { cases, type DmaCase } from '@/data/cases'
import type { DashboardMetrics } from '@/data/dashboardMetrics'
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

const CATEGORY_COLORS: Record<DmaCase['category'], string> = {
  penalty: '#dc2626',
  proceeding: '#2563eb',
  closed: '#64748b',
  related: '#d97706',
}

export default function Charts({ metrics }: { metrics: DashboardMetrics }) {
  const penaltyCases = cases.filter((item) => item.category === 'penalty')
  const fineByCase = penaltyCases
    .map((item) => ({ name: item.title.replace('案', ''), company: item.gatekeeper, fine: item.fine ?? 0 }))
    .sort((left, right) => right.fine - left.fine)

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base text-slate-800">累计罚款趋势（百万欧元）</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={metrics.finesByYear} margin={{ left: 0, right: 18, top: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip
                formatter={(value: number) => [`${value} 百万欧元`, '累计罚款']}
                contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid #e2e8f0' }}
              />
              <Line type="monotone" dataKey="cumulative" stroke="#dc2626" strokeWidth={3} dot={{ r: 5 }} />
            </RechartsLineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base text-slate-800">各守门人 DMA 累计罚款</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics.finesByCompany} margin={{ left: 0, right: 18, top: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="company" tick={{ fontSize: 12, fill: '#334155' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip
                formatter={(value: number) => [`${value} 百万欧元`, '累计罚款']}
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
          <CardTitle className="text-base text-slate-800">案件涉及的 DMA 条款</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics.casesByArticle} layout="vertical" margin={{ left: 12, right: 18, top: 10 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis type="category" dataKey="article" width={105} tick={{ fontSize: 12, fill: '#334155' }} />
              <Tooltip
                formatter={(value: number) => [`${value} 项`, '案件数']}
                contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid #e2e8f0' }}
              />
              <Bar dataKey="cases" fill="#2563eb" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base text-slate-800">单笔罚款金额（百万欧元）</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={fineByCase} layout="vertical" margin={{ left: 10, right: 30, top: 10 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis type="category" dataKey="name" width={145} tick={{ fontSize: 12, fill: '#334155' }} />
              <Tooltip
                formatter={(value: number) => [`${value} 百万欧元`, '罚款']}
                contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid #e2e8f0' }}
              />
              <Bar dataKey="fine" radius={[0, 4, 4, 0]}>
                {fineByCase.map((item) => <Cell key={item.name} fill={CATEGORY_COLORS.penalty} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
