import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import {
  cases, gatekeepers, officialSources,
  DATA_AS_OF, formatDate, formatFine, type CaseCategory,
} from '@/data/cases'
import { getDashboardMetrics } from '@/data/dashboardMetrics'
import { localizeArticle, localizeCategory, localizeOfficialSource } from '@/lib/i18n'
import { useLanguage } from '@/lib/LanguageContext'
import CaseCard from '@/sections/CaseCard'
import DashboardOverview from '@/sections/DashboardOverview'
import Timeline from '@/sections/Timeline'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Languages, Landmark, LayoutDashboard, LayoutGrid, LineChart, ListFilter, ShieldCheck } from 'lucide-react'

const ALL = '__all__'
const Charts = lazy(() => import('@/sections/Charts'))
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
  const { locale, setLocale, t } = useLanguage()
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
    { label: t('stats.totalFine'), value: formatFine(dashboardMetrics.dmaFineTotal, locale), sub: t('stats.totalFineSub') },
    { label: t('stats.penalties'), value: `${dashboardMetrics.penaltyCount}${locale === 'en' ? '' : ' 项'}`, sub: t('stats.penaltiesSub', { count: dashboardMetrics.finedCompanyCount }) },
    { label: t('stats.finedGatekeepers'), value: `${dashboardMetrics.finedCompanyCount}${locale === 'en' ? '' : ' 家'}`, sub: t('stats.finedGatekeepersSub') },
    { label: t('stats.proceedings'), value: `${dashboardMetrics.proceedingCount}${locale === 'en' ? '' : ' 项'}`, sub: t('stats.proceedingsSub') },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <header className="bg-gradient-to-br from-[#0b2a6b] via-[#123a8f] to-[#1e56c8] text-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-blue-200">
                <Landmark className="h-4 w-4" />
                {t('app.eyebrow')}
              </div>
              <h1 className="mt-3 text-4xl font-bold tracking-tight">{t('app.title')}</h1>
              <p className="mt-3 max-w-2xl text-blue-100">{t('app.description', { date: formatDate(DATA_AS_OF, locale) })}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1 self-start rounded-full border border-white/20 bg-white/10 p-1 text-xs backdrop-blur-sm" aria-label={t('language.label')}>
              <Languages className="ml-2 h-3.5 w-3.5 text-blue-200" />
              <button
                type="button"
                aria-pressed={locale === 'zh'}
                onClick={() => setLocale('zh')}
                className={`rounded-full px-2.5 py-1 transition-colors ${locale === 'zh' ? 'bg-white text-blue-900' : 'text-blue-100 hover:bg-white/10'}`}
              >
                {t('language.zh')}
              </button>
              <button
                type="button"
                aria-pressed={locale === 'en'}
                onClick={() => setLocale('en')}
                className={`rounded-full px-2.5 py-1 transition-colors ${locale === 'en' ? 'bg-white text-blue-900' : 'text-blue-100 hover:bg-white/10'}`}
              >
                {t('language.en')}
              </button>
            </div>
          </div>
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
            <ListFilter className="h-4 w-4" /> {t('filters.label')}
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory(ALL)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                category === ALL ? 'border-slate-800 bg-slate-800 text-white' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t('filters.allTypes')}
            </button>
            {(['penalty', 'proceeding', 'closed', 'related'] as CaseCategory[]).map((k) => (
              <button
                key={k}
                onClick={() => setCategory(k)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  category === k ? 'border-slate-800 bg-slate-800 text-white' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                {localizeCategory(k, locale)}
              </button>
            ))}
          </div>
          <Select value={company} onValueChange={setCompany}>
            <SelectTrigger className="h-8 w-36 bg-white text-xs">
              <SelectValue placeholder={t('filters.companyPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>{t('filters.allCompanies')}</SelectItem>
              {companies.map((c) => <SelectItem key={c} value={c}>{c === '市场调查' && locale === 'en' ? 'Market investigation' : c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={article} onValueChange={setArticle}>
            <SelectTrigger className="h-8 w-36 bg-white text-xs">
              <SelectValue placeholder={t('filters.articlePlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>{t('filters.allArticles')}</SelectItem>
              {articles.map((a) => <SelectItem key={a} value={a}>{localizeArticle(a, locale)}</SelectItem>)}
            </SelectContent>
          </Select>
          {(category !== ALL || company !== ALL || article !== ALL) && (
            <button
              onClick={() => { setCategory(ALL); setCompany(ALL); setArticle(ALL) }}
              className="text-xs text-blue-700 hover:underline"
            >
              {t('filters.clear')}
            </button>
          )}
        </div>

        <Tabs defaultValue="dashboard">
          <TabsList className="mb-6 bg-white">
            <TabsTrigger value="dashboard" className="gap-1.5"><LayoutDashboard className="h-4 w-4" />{t('tabs.dashboard')}</TabsTrigger>
            <TabsTrigger value="cards" className="gap-1.5"><LayoutGrid className="h-4 w-4" />{t('tabs.cards')}</TabsTrigger>
            <TabsTrigger value="timeline" className="gap-1.5"><ShieldCheck className="h-4 w-4" />{t('tabs.timeline')}</TabsTrigger>
            <TabsTrigger value="charts" className="gap-1.5"><LineChart className="h-4 w-4" />{t('tabs.charts')}</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardOverview metrics={dashboardMetrics} lastStoredUpdate={updates?.updated_at} />
          </TabsContent>

          <TabsContent value="cards">
            {filtered.length === 0 ? (
              <p className="py-16 text-center text-sm text-slate-400">{t('case.noMatches')}</p>
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
            <Suspense
              fallback={
                <div className="flex min-h-80 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm text-slate-400">
                  {t('charts.loading')}
                </div>
              }
            >
              <Charts metrics={dashboardMetrics} />
            </Suspense>
          </TabsContent>
        </Tabs>

        {/* 自动监测动态 */}
        <section className="mt-14">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <h2 className="text-xl font-bold text-slate-900">{t('updates.title')}</h2>
            <span className="text-xs text-slate-400">
              {t('updates.source')}
              {updates?.updated_at && ` · ${t('updates.lastUpdated', { date: formatDate(updates.updated_at.slice(0, 10), locale) })}`}
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
              <p className="p-6 text-sm text-slate-400">{t('updates.empty')}</p>
            )}
          </div>
        </section>

        {/* Gatekeepers */}
        <section className="mt-14">
          <h2 className="text-xl font-bold text-slate-900">{t('gatekeepers.title')}</h2>
          <p className="mt-1 text-sm text-slate-500">{t('gatekeepers.description', { date: formatDate(DATA_AS_OF, locale), count: dashboardMetrics.finedCompanyCount })}</p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
            {gatekeepers.map((g) => (
              <Card key={g.name} className={`border ${g.fined ? 'border-red-200 bg-red-50/50' : 'border-slate-200 bg-white'}`}>
                <CardContent className="p-4">
                  <div className="font-semibold text-slate-800">{g.name}</div>
                  <div className={`mt-1 text-xs ${g.fined ? 'font-medium text-red-600' : 'text-slate-400'}`}>
                    {g.fined ? t('gatekeepers.fined', { fine: formatFine(g.fineTotal, locale) }) : t('gatekeepers.notFined')}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Fine rules */}
        <section className="mt-14 rounded-xl border border-blue-100 bg-blue-50/60 p-6">
          <h2 className="text-lg font-bold text-slate-900">{t('rules.title')}</h2>
          <div className="mt-3 grid gap-4 text-sm leading-relaxed text-slate-600 md:grid-cols-3">
            <div><span className="font-semibold text-slate-800">{t('rules.nonCompliance')}</span>：{t('rules.nonComplianceBody')}</div>
            <div><span className="font-semibold text-slate-800">{t('rules.periodic')}</span>：{t('rules.periodicBody')}</div>
            <div><span className="font-semibold text-slate-800">{t('rules.otherRemedies')}</span>：{t('rules.otherRemediesBody')}</div>
          </div>
        </section>

        {/* Sources */}
        <section className="mt-14">
          <h2 className="text-xl font-bold text-slate-900">{t('sources.title')}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {officialSources.map((s) => (
              (() => {
                const copy = localizeOfficialSource(s.label, s.desc, locale)
                return (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md"
              >
                <div className="font-semibold text-blue-800">{copy.label} ↗</div>
                <div className="mt-1 text-xs text-slate-500">{copy.desc}</div>
              </a>
                )
              })()
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto max-w-6xl px-6 text-xs text-slate-400">
          {t('footer', { date: formatDate(DATA_AS_OF, locale) })}
        </div>
      </footer>
    </div>
  )
}
