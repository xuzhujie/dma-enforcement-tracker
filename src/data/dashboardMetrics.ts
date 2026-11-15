import { CATEGORY_META, type DmaCase } from './cases.ts'

export interface FineByYear {
  year: string
  fine: number
  cumulative: number
}

export interface FineByCompany {
  company: string
  fine: number
  cases: number
}

export interface FineByCase {
  id: string
  title: string
  company: string
  fine: number
}

export interface CasesByArticle {
  article: string
  cases: number
}

export interface CategoryCount {
  category: DmaCase['category']
  label: string
  count: number
}

export interface AttentionItem {
  id: string
  title: string
  gatekeeper: string
  stage: string
  reasons: AttentionReason[]
  fine: number | null
  sources: DmaCase['sources']
}

export type AttentionReason = '上诉中' | '整改状态待核' | '在办程序'

export interface DashboardMetrics {
  dmaFineTotal: number
  penaltyCount: number
  finedCompanyCount: number
  proceedingCount: number
  appealCount: number
  pendingVerificationCount: number
  finesByYear: FineByYear[]
  finesByCompany: FineByCompany[]
  finesByCase: FineByCase[]
  casesByArticle: CasesByArticle[]
  categoryCounts: CategoryCount[]
  attention: AttentionItem[]
}

const DMA_CATEGORIES: DmaCase['category'][] = ['penalty', 'proceeding', 'closed']
const ATTENTION_ORDER: AttentionReason[] = ['上诉中', '整改状态待核', '在办程序']

export function getDashboardMetrics(items: DmaCase[]): DashboardMetrics {
  const dmaCases = items.filter((item) => item.category !== 'related')
  const penaltyCases = dmaCases.filter((item) => item.category === 'penalty')
  const proceedingCount = dmaCases.filter((item) => item.category === 'proceeding').length

  const finesByYearMap = new Map<string, number>()
  for (const item of penaltyCases) {
    if (!item.decisionDate || item.fine == null) continue
    const year = item.decisionDate.slice(0, 4)
    finesByYearMap.set(year, (finesByYearMap.get(year) ?? 0) + item.fine)
  }

  let cumulative = 0
  const finesByYear = [...finesByYearMap.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([year, fine]) => {
      cumulative += fine
      return { year, fine, cumulative }
    })

  const finesByCompanyMap = new Map<string, FineByCompany>()
  for (const item of penaltyCases) {
    const entry = finesByCompanyMap.get(item.gatekeeper) ?? { company: item.gatekeeper, fine: 0, cases: 0 }
    entry.fine += item.fine ?? 0
    entry.cases += 1
    finesByCompanyMap.set(item.gatekeeper, entry)
  }
  const finesByCompany = [...finesByCompanyMap.values()].sort(
    (left, right) => right.fine - left.fine || left.company.localeCompare(right.company),
  )

  const finesByCase = penaltyCases
    .filter((item): item is DmaCase & { fine: number } => item.fine != null)
    .map((item) => ({ id: item.id, title: item.title, company: item.gatekeeper, fine: item.fine }))
    .sort((left, right) => right.fine - left.fine)

  const casesByArticleMap = new Map<string, number>()
  for (const item of dmaCases) {
    for (const article of new Set(item.articles)) {
      casesByArticleMap.set(article, (casesByArticleMap.get(article) ?? 0) + 1)
    }
  }
  const casesByArticle = [...casesByArticleMap.entries()]
    .map(([article, cases]) => ({ article, cases }))
    .sort((left, right) => right.cases - left.cases || left.article.localeCompare(right.article))

  const categoryCounts = DMA_CATEGORIES
    .map((category) => ({
      category,
      label: CATEGORY_META[category].label,
      count: dmaCases.filter((item) => item.category === category).length,
    }))
    .filter((item) => item.count > 0)

  const attention = dmaCases
    .flatMap((item): AttentionItem[] => {
      const reasons: AttentionReason[] = []
      if (item.appeal) reasons.push('上诉中')
      if (item.stage.includes('待核')) reasons.push('整改状态待核')
      if (item.category === 'proceeding') reasons.push('在办程序')
      if (reasons.length === 0) return []
      return [{
        id: item.id,
        title: item.title,
        gatekeeper: item.gatekeeper,
        stage: item.stage,
        reasons,
        fine: item.fine,
        sources: item.sources,
      }]
    })
    .sort((left, right) => {
      const leftRank = Math.min(...left.reasons.map((reason) => ATTENTION_ORDER.indexOf(reason)))
      const rightRank = Math.min(...right.reasons.map((reason) => ATTENTION_ORDER.indexOf(reason)))
      return leftRank - rightRank
    })

  return {
    dmaFineTotal: penaltyCases.reduce((sum, item) => sum + (item.fine ?? 0), 0),
    penaltyCount: penaltyCases.length,
    finedCompanyCount: new Set(penaltyCases.map((item) => item.gatekeeper)).size,
    proceedingCount,
    appealCount: attention.filter((item) => item.reasons.includes('上诉中')).length,
    pendingVerificationCount: attention.filter((item) => item.reasons.includes('整改状态待核')).length,
    finesByYear,
    finesByCompany,
    finesByCase,
    casesByArticle,
    categoryCounts,
    attention,
  }
}
