import { cases } from '@/data/cases'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'

const COMPANY_COLORS: Record<string, string> = {
  Alphabet: '#4285F4',
  Apple: '#334155',
  Meta: '#0866FF',
}

export default function Charts() {
  const penaltyCases = cases.filter((c) => c.category === 'penalty')

  const barData = penaltyCases
    .map((c) => ({
      name: c.title.replace('案', ''),
      company: c.gatekeeper,
      fine: c.fine ?? 0,
    }))
    .sort((a, b) => b.fine - a.fine)

  const byCompany = penaltyCases.reduce<Record<string, number>>((acc, c) => {
    acc[c.gatekeeper] = (acc[c.gatekeeper] ?? 0) + (c.fine ?? 0)
    return acc
  }, {})
  const pieData = Object.entries(byCompany)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base text-slate-800">各案件罚款金额（DMA，百万欧元）</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 12, fill: '#334155' }} />
              <Tooltip
                formatter={(v: number) => [`${v} 百万欧元`, '罚款']}
                contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid #e2e8f0' }}
              />
              <Bar dataKey="fine" radius={[0, 4, 4, 0]}>
                {barData.map((d) => (
                  <Cell key={d.name} fill={COMPANY_COLORS[d.company] ?? '#64748b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base text-slate-800">罚款占比（按守门人）</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                label={({ name, percent }: { name?: string; percent?: number }) =>
                  `${name ?? ''} ${((percent ?? 0) * 100).toFixed(1)}%`
                }
              >
                {pieData.map((d) => (
                  <Cell key={d.name} fill={COMPANY_COLORS[d.name] ?? '#64748b'} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: number) => [`${v} 百万欧元`, '累计罚款']}
                contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid #e2e8f0' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
