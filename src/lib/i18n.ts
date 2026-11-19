import type { CaseCategory, DmaCase } from '@/data/cases'

export type Locale = 'zh' | 'en'

export const DEFAULT_LOCALE: Locale = 'zh'
export const LOCALE_STORAGE_KEY = 'dma-tracker-locale'

const ZH_COPY = {
  'app.eyebrow': '欧盟委员会 · 《数字市场法》（Regulation (EU) 2022/1925）',
  'app.title': 'DMA 执法追踪器',
  'app.description': '汇总欧盟委员会依据《数字市场法》作出的全部罚款决定、在办程序与关联案件，数据核验截至 {date}，以官方原文为准。',
  'stats.totalFine': 'DMA 累计罚款',
  'stats.totalFineSub': '不含关联反垄断案件',
  'stats.penalties': '罚款决定',
  'stats.penaltiesSub': '针对 {count} 家守门人',
  'stats.finedGatekeepers': '被罚守门人',
  'stats.finedGatekeepersSub': '共指定 7 家守门人',
  'stats.proceedings': '在办程序',
  'stats.proceedingsSub': '含市场调查',
  'filters.label': '筛选',
  'filters.allTypes': '全部类型',
  'filters.allCompanies': '全部公司',
  'filters.allArticles': '全部条款',
  'filters.companyPlaceholder': '公司',
  'filters.articlePlaceholder': '条款',
  'filters.clear': '清除筛选',
  'tabs.dashboard': '驾驶舱',
  'tabs.cards': '案件总览',
  'tabs.timeline': '时间线',
  'tabs.charts': '统计图表',
  'charts.loading': '正在加载统计图表…',
  'case.noMatches': '没有符合筛选条件的案件',
  'updates.title': '自动监测动态',
  'updates.source': '来源：欧委会 Press Corner 官方 RSS · GitHub Actions 每日自动更新',
  'updates.lastUpdated': '动态数据最后更新 {date}',
  'updates.empty': '暂无新动态，监测任务每日运行中。',
  'dashboard.appeals': '上诉中',
  'dashboard.pending': '整改状态待核',
  'dashboard.proceeding': '在办程序',
  'dashboard.attentionTitle': '待关注案件',
  'dashboard.attentionDescription': '按上诉、整改状态和在办程序排序，便于下一步人工复核。',
  'dashboard.attentionEmpty': '当前没有需要人工复核的案件。',
  'dashboard.officialSource': '官方来源',
  'freshness.title': '数据新鲜度',
  'freshness.description': '区分人工核验的案件库与 RSS 动态文件。',
  'freshness.caseData': '案件主数据核验截至',
  'freshness.rssData': 'RSS 动态文件最后更新',
  'freshness.noArchive': '尚无存档',
  'freshness.note': 'RSS 日期表示动态文件最后一次发生变化。没有新动态的每日监控不会改写文件，也不会制造空提交。',
  'case.fine': '罚款',
  'case.keyPoints': '案件要点',
  'case.opened': '启动程序',
  'case.decision': '作出决定',
  'gatekeepers.title': '已指定守门人（7 家）',
  'gatekeepers.description': '截至 {date}，其中 {count} 家已被处以 DMA 罚款。',
  'gatekeepers.fined': '已罚 {fine}',
  'gatekeepers.notFined': '未被处罚',
  'rules.title': 'DMA 处罚规则速览',
  'rules.nonCompliance': '不合规罚款',
  'rules.nonComplianceBody': '最高可达守门人全球总营业额的 10%；重复违规最高 20%。',
  'rules.periodic': '定期罚款',
  'rules.periodicBody': '逾期未整改，最高为全球日均营业额的 5%，按日计罚。',
  'rules.otherRemedies': '其他救济',
  'rules.otherRemediesBody': '可施加行为性乃至结构性救济，包括要求剥离部分业务。',
  'sources.title': '官方数据来源',
  'footer': 'DMA 执法追踪器 · 数据核验截至 {date} · 仅供研究参考，不构成法律意见，请以欧盟委员会官方原文为准',
  'language.label': '语言',
  'language.zh': '中文',
  'language.en': 'English',
  'language.switchTo': '切换到 {language}',
  'charts.fineTrend': '累计罚款趋势（百万欧元）',
  'charts.companyFines': '各守门人 DMA 累计罚款',
  'charts.articles': '案件涉及的 DMA 条款',
  'charts.singleFines': '单笔罚款金额（百万欧元）',
  'charts.cumulativeFine': '累计罚款',
  'charts.fine': '罚款',
  'charts.caseCount': '案件数',
  'charts.fineUnit': '百万欧元',
  'charts.itemUnit': '项',
} as const

export type TranslationKey = keyof typeof ZH_COPY

const EN_COPY: Record<TranslationKey, string> = {
  'app.eyebrow': 'European Commission · Digital Markets Act (Regulation (EU) 2022/1925)',
  'app.title': 'DMA Enforcement Tracker',
  'app.description': 'A source-backed view of European Commission DMA penalty decisions, proceedings, and related cases. Data verified through {date}; consult the official sources for the controlling text.',
  'stats.totalFine': 'Total DMA fines',
  'stats.totalFineSub': 'Related antitrust cases excluded',
  'stats.penalties': 'Penalty decisions',
  'stats.penaltiesSub': 'Across {count} gatekeepers',
  'stats.finedGatekeepers': 'Fined gatekeepers',
  'stats.finedGatekeepersSub': '7 gatekeepers designated in total',
  'stats.proceedings': 'Active proceedings',
  'stats.proceedingsSub': 'Including market investigations',
  'filters.label': 'Filters',
  'filters.allTypes': 'All types',
  'filters.allCompanies': 'All companies',
  'filters.allArticles': 'All articles',
  'filters.companyPlaceholder': 'Company',
  'filters.articlePlaceholder': 'Article',
  'filters.clear': 'Clear filters',
  'tabs.dashboard': 'Dashboard',
  'tabs.cards': 'Case overview',
  'tabs.timeline': 'Timeline',
  'tabs.charts': 'Charts',
  'charts.loading': 'Loading charts…',
  'case.noMatches': 'No cases match the selected filters',
  'updates.title': 'Automatically monitored updates',
  'updates.source': 'Source: European Commission Press Corner RSS · Updated daily by GitHub Actions',
  'updates.lastUpdated': 'Updates last changed {date}',
  'updates.empty': 'No new updates. The monitor runs daily.',
  'dashboard.appeals': 'Under appeal',
  'dashboard.pending': 'Remediation pending verification',
  'dashboard.proceeding': 'Active proceedings',
  'dashboard.attentionTitle': 'Cases needing attention',
  'dashboard.attentionDescription': 'Prioritized by appeals, remediation status, and active proceedings for the next human review.',
  'dashboard.attentionEmpty': 'No cases currently need manual review.',
  'dashboard.officialSource': 'Official source',
  'freshness.title': 'Data freshness',
  'freshness.description': 'Separates the manually verified case catalogue from the RSS update file.',
  'freshness.caseData': 'Case catalogue verified through',
  'freshness.rssData': 'RSS update file last changed',
  'freshness.noArchive': 'No archived update yet',
  'freshness.note': 'The RSS date changes only when the update file changes. A daily run with no new content does not rewrite the file or create an empty commit.',
  'case.fine': 'Fine',
  'case.keyPoints': 'Key points',
  'case.opened': 'Proceeding opened',
  'case.decision': 'Decision issued',
  'gatekeepers.title': 'Designated gatekeepers (7)',
  'gatekeepers.description': 'As of {date}, {count} gatekeepers have received DMA fines.',
  'gatekeepers.fined': 'Fined {fine}',
  'gatekeepers.notFined': 'No fine recorded',
  'rules.title': 'DMA penalty rules at a glance',
  'rules.nonCompliance': 'Non-compliance fines',
  'rules.nonComplianceBody': 'Up to 10% of worldwide turnover; up to 20% for repeated infringements.',
  'rules.periodic': 'Periodic penalty payments',
  'rules.periodicBody': 'Up to 5% of average daily worldwide turnover for each day of delay.',
  'rules.otherRemedies': 'Other remedies',
  'rules.otherRemediesBody': 'Behavioural and structural remedies may be imposed, including divestiture requirements.',
  'sources.title': 'Official data sources',
  'footer': 'DMA Enforcement Tracker · Data verified through {date} · For research only; not legal advice. Consult the European Commission source text.',
  'language.label': 'Language',
  'language.zh': '中文',
  'language.en': 'English',
  'language.switchTo': 'Switch to {language}',
  'charts.fineTrend': 'Cumulative fines over time (€ millions)',
  'charts.companyFines': 'Cumulative DMA fines by gatekeeper',
  'charts.articles': 'DMA articles involved in cases',
  'charts.singleFines': 'Individual fines (€ millions)',
  'charts.cumulativeFine': 'Cumulative fines',
  'charts.fine': 'Fine',
  'charts.caseCount': 'Cases',
  'charts.fineUnit': '€ millions',
  'charts.itemUnit': 'cases',
}

export type Translator = (key: TranslationKey, variables?: Record<string, string | number>) => string

export function createTranslator(locale: Locale): Translator {
  return (key, variables = {}) => {
    const template = (locale === 'en' ? EN_COPY : ZH_COPY)[key] ?? ZH_COPY[key]
    return template.replace(/\{(\w+)\}/g, (_, name: string) => String(variables[name] ?? `{${name}}`))
  }
}

export function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY)
  if (stored === 'zh' || stored === 'en') return stored
  return DEFAULT_LOCALE
}

const CATEGORY_LABELS: Record<CaseCategory, Record<Locale, string>> = {
  penalty: { zh: '罚款决定', en: 'Penalty decision' },
  proceeding: { zh: '在办程序', en: 'Active proceeding' },
  closed: { zh: '已结案', en: 'Closed' },
  related: { zh: '关联案件（非 DMA）', en: 'Related case (non-DMA)' },
}

const ATTENTION_LABELS: Record<string, Record<Locale, string>> = {
  上诉中: { zh: '上诉中', en: 'Under appeal' },
  整改状态待核: { zh: '整改状态待核', en: 'Remediation pending verification' },
  在办程序: { zh: '在办程序', en: 'Active proceeding' },
}

const SOURCE_LABELS: Record<string, string> = {
  '欧委会新闻稿（Google €890m）': 'Commission press release (Google €890m)',
  'DMA 案件（Google Article 6(11)）': 'DMA case (Google Article 6(11))',
  '欧委会新闻稿（Apple 与 Meta）': 'Commission press release (Apple and Meta)',
  'DMA 案件登记库': 'DMA Case Register',
  '欧委会新闻稿（Apple 新业务条款）': 'Commission press release (Apple new business terms)',
  '欧委会新闻稿（网站声誉滥用）': 'Commission press release (site reputation abuse)',
  '欧委会新闻稿（云计算市场调查）': 'Commission press release (cloud market investigation)',
  '欧委会初步立场（AWS 与 Azure）': 'Commission preliminary position (AWS and Azure)',
  'DMA 案件（Apple 互操作性）': 'DMA case (Apple interoperability)',
  '欧委会新闻稿': 'Commission press release',
}

const SERVICE_LABELS: Record<string, string> = {
  'Google 搜索': 'Google Search',
  'Facebook · Instagram': 'Facebook · Instagram',
  'iOS · App Store': 'iOS · App Store',
  'iOS · Safari · App Store': 'iOS · Safari · App Store',
  '云计算（AWS · Azure）': 'Cloud computing (AWS · Azure)',
  '广告技术服务': 'Ad tech services',
}

interface LocalizedCaseFields {
  title: string
  stage: string
  openedLabel?: string
  decisionLabel?: string
  deadline?: string
  appeal?: string
  summary: string
  keyPoints: string[]
}

const EN_CASE_COPY: Record<string, LocalizedCaseFields> = {
  'google-search-2026': {
    title: 'Google self-preferencing in Search',
    stage: 'Fined (remediation status pending)',
    openedLabel: 'Non-compliance investigation opened',
    decisionLabel: 'Fine imposed',
    deadline: 'Remediation required within 60 days of the decision notice; current compliance status pending official update',
    summary: 'Google gave its own vertical services — including shopping, hotels, transport, and sports — more prominent rankings and visual treatment in Search, amounting to self-preferencing.',
    keyPoints: [
      'Breaches DMA Article 6(5), which prohibits gatekeepers from favouring their own services in ranking, indexing, and crawling.',
      'Covers Google Shopping, hotel booking, transport, sports scores, and other vertical search services.',
      'The €460 million fine is the largest single DMA fine since the regulation took effect.',
      'The Commission required Google to stop the infringement within 60 days of the decision notice; the current compliance status awaits an official update.',
    ],
  },
  'google-play-2026': {
    title: 'Google Play anti-steering restrictions',
    stage: 'Fined (remediation status pending)',
    openedLabel: 'Non-compliance investigation opened',
    decisionLabel: 'Fine imposed',
    deadline: 'Remediation required within 60 days of the decision notice; current compliance status pending official update',
    summary: 'Google Play restricted developers from freely telling users about cheaper purchasing options outside the store, while its commission arrangements also exceeded the compliant scope.',
    keyPoints: [
      'Breaches DMA Article 5(4), which prohibits gatekeepers from blocking business users from steering end users to third-party channels.',
      'Developers could not freely tell users that cheaper purchasing options existed outside Google Play.',
      'The commission arrangements for steered transactions were also found non-compliant.',
      'The €430 million fine was announced alongside the Search decision, bringing the combined total to €890 million.',
    ],
  },
  'apple-appstore-2025': {
    title: 'Apple App Store anti-steering case',
    stage: 'Under appeal',
    openedLabel: 'Non-compliance investigation opened',
    decisionLabel: 'Fine imposed',
    appeal: 'Appealed before the General Court of the European Union (case T-438/25); proceedings ongoing',
    summary: 'App Store rules restricted developers from steering users to external purchasing channels, resulting in the first fine issued under the DMA.',
    keyPoints: [
      'Breaches DMA Article 5(4): developers must be allowed to steer users to external offers free of charge.',
      'The €500 million fine was the first DMA fine.',
      'The Commission also required Apple to remove the relevant restrictions within 60 days.',
      'Apple appealed to the General Court; the case remains pending.',
    ],
  },
  'meta-consent-2025': {
    title: 'Meta “Consent or Pay” model',
    stage: 'Under appeal',
    openedLabel: 'Non-compliance investigation opened',
    decisionLabel: 'Fine imposed',
    appeal: 'Appealed before the General Court of the European Union (case T-435/25); proceedings ongoing',
    summary: 'Meta’s “Consent or Pay” model required users either to pay or to consent to the use of personal data for personalised advertising, without offering a genuinely equivalent choice.',
    keyPoints: [
      'Breaches DMA Article 5(2): gatekeepers must not force users to consent to combining personal data across services.',
      'The Commission found that the binary choice did not offer an equivalent alternative using less personal data.',
      'The €200 million fine has been appealed by Meta.',
      'Meta introduced a revised advertising model in June 2025, which the Commission is assessing for compliance.',
    ],
  },
  'apple-ctf-64': {
    title: 'Apple new business terms (Core Technology Fee) investigation',
    stage: 'Under investigation',
    openedLabel: 'Additional non-compliance investigation opened',
    summary: 'The Commission is investigating whether Apple’s new contractual terms for alternative app stores and app sideloading, including the Core Technology Fee, materially hinder competition.',
    keyPoints: [
      'Examines whether the Core Technology Fee structure weakens the commercial viability of alternative distribution channels.',
      'Concerns DMA Article 6(4), which requires gatekeepers to allow third-party app stores and sideloading.',
      'The investigation is ongoing and no fine has been imposed.',
    ],
  },
  'google-site-reputation-2025': {
    title: 'Google “site reputation abuse” policy investigation',
    stage: 'Under investigation',
    openedLabel: 'Investigation opened',
    summary: 'The Commission opened proceedings on how Google Search’s “site reputation abuse” policy affects the ranking of third-party websites, including news publishers.',
    keyPoints: [
      'Examines whether the policy causes unjustified demotion or discrimination against publisher websites.',
      'Concerns DMA Article 6(5), which requires fair, reasonable, and non-discriminatory ranking conditions.',
      'The proceeding is ongoing and no decision has been issued.',
    ],
  },
  'cloud-investigation-2025': {
    title: 'Cloud computing services market investigation',
    stage: 'Under investigation',
    openedLabel: 'Market investigation opened',
    summary: 'The Commission launched a DMA market investigation into competition in cloud computing, including whether AWS and Azure should be designated as gatekeepers.',
    keyPoints: [
      'The DMA allows the Commission to use market investigations to bring new services or companies within the gatekeeper designation framework.',
      'The scope includes cloud interoperability, data portability, and other structural issues.',
      'A market investigation is not a penalty proceeding, but it may lead to new gatekeeper designations.',
    ],
  },
  'apple-interop-67': {
    title: 'Apple interoperability specification decision',
    stage: 'Closed (specification decision)',
    openedLabel: 'Specification proceeding opened',
    decisionLabel: 'Follow-up specification decision issued',
    summary: 'Through a specification proceeding, the Commission defined Apple’s concrete interoperability obligations for iOS, including access to connectivity features and the process for developer interoperability requests.',
    keyPoints: [
      'A specification proceeding is not a penalty proceeding; it defines the execution standard for an obligation.',
      'The first decision covers opening iOS connectivity features, such as notifications and device pairing, to third parties.',
      'The second decision sets the process and timelines for Apple to handle developer interoperability requests.',
    ],
  },
  'apple-63-closed': {
    title: 'Apple choice screen and app uninstallation investigation',
    stage: 'Closed (no fine)',
    openedLabel: 'Non-compliance investigation opened',
    decisionLabel: 'Investigation closed',
    summary: 'The investigation into browser choice screens, app uninstallation, and related Article 6(3) obligations closed after Apple made compliance adjustments, without a fine.',
    keyPoints: [
      'Examined whether the browser choice screen genuinely gave users a meaningful choice.',
      'Examined whether pre-installed apps could be uninstalled and default settings changed easily.',
      'The Commission closed the investigation after Apple’s remediation and imposed no fine.',
    ],
  },
  'google-adtech-2025': {
    title: 'Google ad tech antitrust case',
    stage: 'Fined (traditional antitrust)',
    decisionLabel: 'Fine imposed',
    summary: 'The Commission found that Google self-preferenced across its ad tech stack and fined it €2.95 billion. This case relies on traditional competition law (Article 102 TFEU), not the DMA, and is listed for comparison only.',
    keyPoints: [
      'The €2.95 billion fine is larger than all current DMA fines combined.',
      'The legal basis is Article 102 TFEU on abuse of a dominant position, not the DMA.',
      'The case concerns conflicts of interest and self-preferencing across Google’s ad buying and selling tools.',
      'It is listed for comparison and excluded from the DMA fine statistics.',
    ],
  },
}

export function localizeCategory(category: CaseCategory, locale: Locale): string {
  return CATEGORY_LABELS[category][locale]
}

export function localizeAttentionReason(reason: string, locale: Locale): string {
  return ATTENTION_LABELS[reason]?.[locale] ?? reason
}

export function localizeArticle(article: string, locale: Locale): string {
  if (locale === 'zh') return article
  if (article === '市场调查') return 'Market investigation'
  return article.replace(/^第\s*(.+?)\s*条/, 'Article $1')
}

export function localizeGatekeeper(gatekeeper: string, locale: Locale): string {
  if (locale === 'en' && gatekeeper === '市场调查') return 'Market investigation'
  return gatekeeper
}

export function localizeService(service: string, locale: Locale): string {
  if (locale === 'en') return SERVICE_LABELS[service] ?? service
  return service
}

export function localizeSourceLabel(label: string, locale: Locale): string {
  if (locale === 'en') return SOURCE_LABELS[label] ?? label
  return label
}

export function getCaseFields(id: string, locale: Locale): Partial<LocalizedCaseFields> {
  return locale === 'en' ? EN_CASE_COPY[id] ?? {} : {}
}

export function getCaseCopy(item: DmaCase, locale: Locale): DmaCase {
  if (locale === 'zh') return item
  const fields = EN_CASE_COPY[item.id]
  return {
    ...item,
    ...fields,
    gatekeeper: localizeGatekeeper(item.gatekeeper, locale),
    cps: localizeService(item.cps, locale),
    articles: item.articles.map((article) => localizeArticle(article, locale)),
    sources: item.sources.map((source) => ({ ...source, label: localizeSourceLabel(source.label, locale) })),
  }
}

export function localizeOfficialSource(label: string, desc: string, locale: Locale): { label: string; desc: string } {
  if (locale === 'zh') return { label, desc }
  const copies: Record<string, { label: string; desc: string }> = {
    'DMA 官方门户': { label: 'DMA official portal', desc: 'Gatekeeper designations, obligations, and annual reports' },
    'DMA 案件登记库': { label: 'DMA Case Register', desc: 'Original non-compliance decisions and compliance reports' },
    '竞争案件检索系统': { label: 'Competition Case Search', desc: 'Search full decisions by case number' },
    '欧委会 Press Corner': { label: 'Commission Press Corner', desc: 'First publication channel for enforcement news' },
  }
  return copies[label] ?? { label, desc }
}
