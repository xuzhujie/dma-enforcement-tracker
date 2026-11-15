import { useEffect, useMemo, useState } from 'react'
import {
  cases, gatekeepers, officialSources,
  CATEGORY_META, DATA_AS_OF, formatDate, formatFine, type CaseCategory,
} from '@/data/cases'
import { getDashboardMetrics } from '@/data/dashboardMetrics'
import CaseCard from '@/sections/CaseCard'
import DashboardOverview from '@/sections/DashboardOverview'
import Timeline from '@/sections/Timeline'
import Charts from '@/sections/Charts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Landmark, LayoutDashboard, LayoutGrid, LineChart, ListFilter, ShieldCheck } from 'lucide-react'

const ALL = '__all__'
const companies = [...new Set(cases.map((c) => c.gatekeeper))]
const articles = [...new Set(cases.flatMap((c) => c.articles))]

interface UpdateItem {
  title: string
  link: string
  date: string
  summary: string
}

interface UpdatesData {
  updated_at: string
  items: UpdateItem[]
}

export default function Home() {
  const [category, setCategory] = useState<CaseCategory | typeof ALL>(ALL)
  const [company, setCompany] = useState<string>(ALL)
  const [article, setArticle] = useState<string>(ALL)
  const [updates, setUpdates] = useState<UpdatesData | null>(null)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/updates.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setUpdates(d))
      .catch(() => setUpdates(null))
  }, [])

  const filtered = useMemo(
    () =>
      cases.filter(
        (c) =>
          (category === ALL || c.category === category) &&
          (company === ALL || c.gatekeeper === company) &&
          (article === ALL || c.articles.includes(article)),
      ),
    [category, company, article],
  )

  const dashboardMetrics = useMemo(() => getDashboardMetrics(cases), [])

  const stats = [
    { label: 'DMA 累计罚款', value: formatFine(dashboardMetrics.dmaFineTotal), sub: '不含关联反垄断案件' },
    { label: '罚款决定', value: `${dashboardMetrics.penaltyCount} 项`, sub: `针对 ${dashboardMetrics.finedCompanyCount} 家守门人` },
    { label: '被罚守门人', value: `${dashboardMetrics.finedCompanyCount} 家`, sub: '共指定 7 家守门人' },
    { label: '在办程序', value: `${dashboardMetrics.proceedingCount} 项`, sub: '含市场调查' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <header className="bg-gradient-to-br from-[#0b2a6b] via-[#123a8f] to-[#1e56c8] text-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="flex items-center gap-2 text-sm text-blue-200">
            <Landmark className="h-4 w-4" />
            欧盟委员会 · 《数字市场法》（Regulation (EU) 2022/1925）
          </div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">DMA 执法追踪器</h1>
          <p className="mt-3 max-w-2xl text-blue-100">
            汇总欧盟委员会依据《数字市场法》作出的全部罚款决定、在办程序与关联案件，
            数据核验截至 {formatDate(DATA_AS_OF)}，以官方原文为准。
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="text-sm text-blue-200">{s.label}</div>
                <div className="mt-1 text-2xl font-bold">{s.value}</div>
                <div className="mt-1 text-xs text-blue-200/80">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Filters */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600">
            <ListFilter className="h-4 w-4" /> 筛选
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory(ALL)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                category === ALL ? 'border-slate-800 bg-slate-800 text-white' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              全部类型
            </button>
            {(Object.keys(CATEGORY_META) as CaseCategory[]).map((k) => (
              <button
                key={k}
                onClick={() => setCategory(k)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  category === k ? 'border-slate-800 bg-slate-800 text-white' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                {CATEGORY_META[k].label}
              </button>
            ))}
          </div>
          <Select value={company} onValueChange={setCompany}>
            <SelectTrigger className="h-8 w-36 bg-white text-xs">
              <SelectValue placeholder="公司" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>全部公司</SelectItem>
              {companies.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={article} onValueChange={setArticle}>
            <SelectTrigger className="h-8 w-36 bg-white text-xs">
              <SelectValue placeholder="条款" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>全部条款</SelectItem>
              {articles.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
          {(category !== ALL || company !== ALL || article !== ALL) && (
            <button
              onClick={() => { setCategory(ALL); setCompany(ALL); setArticle(ALL) }}
              className="text-xs text-blue-700 hover:underline"
            >
              清除筛选
            </button>
          )}
        </div>

        <Tabs defaultValue="dashboard">
          <TabsList className="mb-6 bg-white">
            <TabsTrigger value="dashboard" className="gap-1.5"><LayoutDashboard className="h-4 w-4" />驾驶舱</TabsTrigger>
            <TabsTrigger value="cards" className="gap-1.5"><LayoutGrid className="h-4 w-4" />案件总览</TabsTrigger>
            <TabsTrigger value="timeline" className="gap-1.5"><ShieldCheck className="h-4 w-4" />时间线</TabsTrigger>
            <TabsTrigger value="charts" className="gap-1.5"><LineChart className="h-4 w-4" />统计图表</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardOverview metrics={dashboardMetrics} lastStoredUpdate={updates?.updated_at} />
          </TabsContent>

          <TabsContent value="cards">
            {filtered.length === 0 ? (
              <p className="py-16 text-center text-sm text-slate-400">没有符合筛选条件的案件</p>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((c) => <CaseCard key={c.id} item={c} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="timeline">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <Timeline items={filtered} />
            </div>
          </TabsContent>

          <TabsContent value="charts">
            <Charts metrics={dashboardMetrics} />
          </TabsContent>
        </Tabs>

        {/* 自动监测动态 */}
        <section className="mt-14">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <h2 className="text-xl font-bold text-slate-900">自动监测动态</h2>
            <span className="text-xs text-slate-400">
              来源：欧委会 Press Corner 官方 RSS · GitHub Actions 每日自动更新
              {updates?.updated_at && ` · 动态数据最后更新 ${updates.updated_at.slice(0, 10)}`}
            </span>
          </div>
          <div className="mt-5 rounded-xl border border-slate-200 bg-white">
            {updates && updates.items.length > 0 ? (
              <ul className="divide-y divide-slate-100">
                {updates.items.map((u) => (
                  <li key={u.link} className="p-4 sm:px-6">
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <span className="text-xs font-medium text-slate-400">{u.date}</span>
                      <a
                        href={u.link}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-blue-800 hover:underline"
                      >
                        {u.title} ↗
                      </a>
                    </div>
                    {u.summary && <p className="mt-1 text-sm text-slate-500">{u.summary}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-6 text-sm text-slate-400">暂无新动态，监测任务每日运行中。</p>
            )}
          </div>
        </section>

        {/* Gatekeepers */}
        <section className="mt-14">
          <h2 className="text-xl font-bold text-slate-900">已指定守门人（7 家）</h2>
          <p className="mt-1 text-sm text-slate-500">截至 {formatDate(DATA_AS_OF)}，其中 {dashboardMetrics.finedCompanyCount} 家已被处以 DMA 罚款。</p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
            {gatekeepers.map((g) => (
              <Card key={g.name} className={`border ${g.fined ? 'border-red-200 bg-red-50/50' : 'border-slate-200 bg-white'}`}>
                <CardContent className="p-4">
                  <div className="font-semibold text-slate-800">{g.name}</div>
                  <div className={`mt-1 text-xs ${g.fined ? 'font-medium text-red-600' : 'text-slate-400'}`}>
                    {g.fined ? `已罚 ${formatFine(g.fineTotal)}` : '未被处罚'}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Fine rules */}
        <section className="mt-14 rounded-xl border border-blue-100 bg-blue-50/60 p-6">
          <h2 className="text-lg font-bold text-slate-900">DMA 处罚规则速览</h2>
          <div className="mt-3 grid gap-4 text-sm leading-relaxed text-slate-600 md:grid-cols-3">
            <div><span className="font-semibold text-slate-800">不合规罚款</span>：最高可达守门人全球总营业额的 10%；重复违规最高 20%。</div>
            <div><span className="font-semibold text-slate-800">定期罚款</span>：逾期未整改，最高为全球日均营业额的 5%，按日计罚。</div>
            <div><span className="font-semibold text-slate-800">其他救济</span>：可施加行为性乃至结构性救济，包括要求剥离部分业务。</div>
          </div>
        </section>

        {/* Sources */}
        <section className="mt-14">
          <h2 className="text-xl font-bold text-slate-900">官方数据来源</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {officialSources.map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md"
              >
                <div className="font-semibold text-blue-800">{s.label} ↗</div>
                <div className="mt-1 text-xs text-slate-500">{s.desc}</div>
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto max-w-6xl px-6 text-xs text-slate-400">
          DMA 执法追踪器 · 数据核验截至 {DATA_AS_OF} · 仅供研究参考，不构成法律意见，请以欧盟委员会官方原文为准
        </div>
      </footer>
    </div>
  )
}
