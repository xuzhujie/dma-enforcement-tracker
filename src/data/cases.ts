// DMA 执法案件数据
// 数据截至 2026-07-23，来源：欧盟委员会 DMA 官方门户、DMA 案件登记库、Press Corner

export type CaseCategory = 'penalty' | 'proceeding' | 'closed' | 'related'

export interface DmaCase {
  id: string
  title: string
  gatekeeper: string
  cps: string
  articles: string[]
  category: CaseCategory
  stage: string
  fine: number | null // 百万欧元
  openedDate?: string
  openedLabel?: string
  decisionDate?: string
  decisionLabel?: string
  deadline?: string
  appeal?: string
  summary: string
  keyPoints: string[]
  sources: { label: string; url: string }[]
}

export const CATEGORY_META: Record<CaseCategory, { label: string; color: string }> = {
  penalty: { label: '罚款决定', color: 'bg-red-100 text-red-800 border-red-200' },
  proceeding: { label: '在办程序', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  closed: { label: '已结案', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  related: { label: '关联案件（非 DMA）', color: 'bg-amber-100 text-amber-800 border-amber-200' },
}

export const cases: DmaCase[] = [
  {
    id: 'google-search-2026',
    title: '谷歌搜索自我优待案',
    gatekeeper: 'Alphabet',
    cps: 'Google 搜索',
    articles: ['第 6(5) 条'],
    category: 'penalty',
    stage: '已罚款（整改期内）',
    fine: 460,
    openedDate: '2024-03-25',
    openedLabel: '启动不合规调查',
    decisionDate: '2026-07-23',
    decisionLabel: '作出罚款决定',
    deadline: '60 天内整改，逾期面临最高全球日营业额 5% 的定期罚款',
    summary:
      '谷歌在搜索结果中对自家垂直服务（购物、酒店、交通、体育等）给予更优排名和更醒目的视觉展示，构成自我优待。',
    keyPoints: [
      '违反 DMA 第 6(5) 条：守门人不得在排名、索引、抓取中优待自家服务',
      '涉及谷歌购物、酒店预订、交通出行、体育比分等垂直搜索服务',
      '罚款 4.6 亿欧元，为 DMA 生效以来最大单笔罚款',
      '谷歌须在 60 天内停止违规行为，否则将被处以定期罚款',
    ],
    sources: [
      { label: '欧委会新闻稿', url: 'https://ec.europa.eu/commission/presscorner/home/en' },
      { label: 'DMA 案件登记库', url: 'https://digital-markets-act-cases.ec.europa.eu/' },
    ],
  },
  {
    id: 'google-play-2026',
    title: 'Google Play 反引导限制案',
    gatekeeper: 'Alphabet',
    cps: 'Google Play',
    articles: ['第 5(4) 条'],
    category: 'penalty',
    stage: '已罚款（整改期内）',
    fine: 430,
    openedDate: '2024-03-25',
    openedLabel: '启动不合规调查',
    decisionDate: '2026-07-23',
    decisionLabel: '作出罚款决定',
    deadline: '60 天内整改，逾期面临最高全球日营业额 5% 的定期罚款',
    summary:
      'Google Play 限制开发者免费向用户告知商店外更便宜的购买渠道，且相关佣金的金额与期限超出合规范围。',
    keyPoints: [
      '违反 DMA 第 5(4) 条：守门人不得阻碍商业用户引导终端用户使用第三方渠道',
      '开发者无法免费告知用户在 Play 商店之外存在更便宜的购买方式',
      '对引导交易的佣金安排同样被认定不合规',
      '罚款 4.3 亿欧元，与搜索案同日宣布，合计 8.9 亿欧元',
    ],
    sources: [
      { label: '欧委会新闻稿', url: 'https://ec.europa.eu/commission/presscorner/home/en' },
      { label: 'DMA 案件登记库', url: 'https://digital-markets-act-cases.ec.europa.eu/' },
    ],
  },
  {
    id: 'apple-appstore-2025',
    title: 'Apple App Store 反引导案',
    gatekeeper: 'Apple',
    cps: 'App Store',
    articles: ['第 5(4) 条'],
    category: 'penalty',
    stage: '上诉中',
    fine: 500,
    openedDate: '2024-03-25',
    openedLabel: '启动不合规调查',
    decisionDate: '2025-04-23',
    decisionLabel: '作出罚款决定',
    appeal: '已向欧盟普通法院提起上诉（案件号 T-438/25），审理中',
    summary:
      'App Store 规则限制开发者引导用户至商店外渠道完成购买，构成 DMA 生效后的首张罚单。',
    keyPoints: [
      '违反 DMA 第 5(4) 条：不得限制开发者免费向用户引导外部优惠',
      '罚款 5 亿欧元，为 DMA 历史上首笔罚款',
      '欧委会同时要求 Apple 在 60 天内移除相关限制',
      'Apple 已上诉至欧盟普通法院，案件尚在审理',
    ],
    sources: [
      { label: '欧委会新闻稿', url: 'https://ec.europa.eu/commission/presscorner/home/en' },
      { label: 'DMA 案件登记库', url: 'https://digital-markets-act-cases.ec.europa.eu/' },
    ],
  },
  {
    id: 'meta-consent-2025',
    title: 'Meta「付费或同意」模式案',
    gatekeeper: 'Meta',
    cps: 'Facebook · Instagram',
    articles: ['第 5(2) 条'],
    category: 'penalty',
    stage: '上诉中',
    fine: 200,
    openedDate: '2024-03-25',
    openedLabel: '启动不合规调查',
    decisionDate: '2025-04-23',
    decisionLabel: '作出罚款决定',
    appeal: '已向欧盟普通法院提起上诉（案件号 T-432/25），审理中',
    summary:
      'Meta 的「Consent or Pay」模式要求用户要么付费、要么同意个人数据被用于个性化广告，被认定未提供真正等效的选择。',
    keyPoints: [
      '违反 DMA 第 5(2) 条：守门人不得强制用户同意跨服务数据合并',
      '欧委会认定该二元选择未提供使用更少个人数据的等效替代方案',
      '罚款 2 亿欧元；Meta 已提起上诉',
      '2025 年 6 月 Meta 推出新版广告模式，欧委会正在评估其合规性',
    ],
    sources: [
      { label: '欧委会新闻稿', url: 'https://ec.europa.eu/commission/presscorner/home/en' },
      { label: 'DMA 案件登记库', url: 'https://digital-markets-act-cases.ec.europa.eu/' },
    ],
  },
  {
    id: 'apple-ctf-64',
    title: 'Apple 新业务条款（核心技术费）调查',
    gatekeeper: 'Apple',
    cps: 'iOS · App Store',
    articles: ['第 6(4) 条'],
    category: 'proceeding',
    stage: '调查中',
    fine: null,
    openedDate: '2024-06-24',
    openedLabel: '启动新的不合规调查',
    summary:
      '针对 Apple 为替代应用商店和应用侧载引入的新合同条款（含核心技术费 Core Technology Fee）是否实质阻碍竞争展开调查。',
    keyPoints: [
      '关注核心技术费的费率结构是否削弱替代分发渠道的商业可行性',
      '涉及 DMA 第 6(4) 条：守门人应允许第三方应用商店与侧载',
      '调查仍在进行，尚未作出罚款决定',
    ],
    sources: [
      { label: 'DMA 案件登记库', url: 'https://digital-markets-act-cases.ec.europa.eu/' },
    ],
  },
  {
    id: 'google-site-reputation-2025',
    title: '谷歌「网站声誉滥用」政策调查',
    gatekeeper: 'Alphabet',
    cps: 'Google 搜索',
    articles: ['第 6(5) 条'],
    category: 'proceeding',
    stage: '调查中',
    fine: null,
    openedDate: '2025-11-01',
    openedLabel: '启动调查',
    summary:
      '欧委会就谷歌搜索的「网站声誉滥用」（site reputation abuse）政策对新闻出版商等第三方网站排名的影响启动程序。',
    keyPoints: [
      '关注该政策是否对出版商网站构成不合理的降权与歧视',
      '涉及 DMA 第 6(5) 条公平、合理、非歧视的排名条件义务',
      '程序进行中，尚未作出决定',
    ],
    sources: [
      { label: 'DMA 案件登记库', url: 'https://digital-markets-act-cases.ec.europa.eu/' },
    ],
  },
  {
    id: 'cloud-investigation-2025',
    title: '云计算服务市场调查',
    gatekeeper: '市场调查',
    cps: '云计算（AWS · Azure）',
    articles: ['市场调查'],
    category: 'proceeding',
    stage: '调查中',
    fine: null,
    openedDate: '2025-11-01',
    openedLabel: '启动市场调查',
    summary:
      '欧委会启动 DMA 项下市场调查，评估云计算领域的竞争状况，包括 AWS 与 Azure 是否应被指定为守门人。',
    keyPoints: [
      'DMA 允许欧委会通过市场调查将新服务或新企业纳入守门人指定范围',
      '调查对象涵盖云服务互操作性、数据可迁移性等结构性问题',
      '市场调查非处罚程序，但可能导致新的守门人指定',
    ],
    sources: [
      { label: 'DMA 官方门户', url: 'https://digital-markets-act.ec.europa.eu/index_en' },
    ],
  },
  {
    id: 'apple-interop-67',
    title: 'Apple 互操作性细化决定',
    gatekeeper: 'Apple',
    cps: 'iOS',
    articles: ['第 6(7) 条'],
    category: 'closed',
    stage: '已结案（细化决定）',
    fine: null,
    openedDate: '2024-09-19',
    openedLabel: '启动细化程序',
    decisionDate: '2025-03-19',
    decisionLabel: '作出两项细化决定',
    summary:
      '欧委会通过细化程序明确 Apple 在 iOS 互操作性方面的具体义务，涉及连接功能开放与开发者互操作请求流程。',
    keyPoints: [
      '细化程序（specification proceeding）非处罚程序，用于明确义务的执行标准',
      '第一项决定涉及 iOS 连接功能（通知、设备配对等）向第三方开放',
      '第二项决定规范 Apple 处理开发者互操作请求的流程与时限',
    ],
    sources: [
      { label: 'DMA 案件登记库', url: 'https://digital-markets-act-cases.ec.europa.eu/' },
    ],
  },
  {
    id: 'apple-63-closed',
    title: 'Apple 选择界面与应用卸载调查',
    gatekeeper: 'Apple',
    cps: 'iOS · Safari · App Store',
    articles: ['第 6(3) 条'],
    category: 'closed',
    stage: '已结案（未罚款）',
    fine: null,
    openedDate: '2024-03-25',
    openedLabel: '启动不合规调查',
    decisionDate: '2025-04-23',
    decisionLabel: '结案',
    summary:
      '针对默认浏览器选择界面、应用卸载便利性等第 6(3) 条义务的调查，在 Apple 作出合规调整后结案，未予罚款。',
    keyPoints: [
      '涉及浏览器选择界面设计是否真正赋予用户选择权',
      '涉及预装应用能否便捷卸载、默认设置能否便捷更改',
      'Apple 整改后欧委会关闭调查，未处以罚款',
    ],
    sources: [
      { label: 'DMA 案件登记库', url: 'https://digital-markets-act-cases.ec.europa.eu/' },
    ],
  },
  {
    id: 'google-adtech-2025',
    title: '谷歌广告技术（AdTech）反垄断案',
    gatekeeper: 'Alphabet',
    cps: '广告技术服务',
    articles: ['第 102 条 TFEU'],
    category: 'related',
    stage: '已罚款（传统反垄断）',
    fine: 2950,
    decisionDate: '2025-09-05',
    decisionLabel: '作出罚款决定',
    summary:
      '欧委会认定谷歌在广告技术栈中自我优待，罚款 29.5 亿欧元。本案依据传统竞争法（第 102 条 TFEU），不属于 DMA 案件，常被混淆，特此区分。',
    keyPoints: [
      '罚款 29.5 亿欧元，金额远超目前所有 DMA 罚单',
      '法律依据为《欧盟运行条约》第 102 条（滥用市场支配地位），非 DMA',
      '涉及谷歌在广告买卖两侧工具中的利益冲突与自我优待',
      '列入本站仅为便于区分，不计入 DMA 罚款统计',
    ],
    sources: [
      { label: '欧委会新闻稿', url: 'https://ec.europa.eu/commission/presscorner/home/en' },
    ],
  },
]

export const gatekeepers = [
  { name: 'Alphabet', fined: true, fineTotal: 890 },
  { name: 'Apple', fined: true, fineTotal: 500 },
  { name: 'Meta', fined: true, fineTotal: 200 },
  { name: 'Amazon', fined: false, fineTotal: 0 },
  { name: 'Booking', fined: false, fineTotal: 0 },
  { name: 'ByteDance', fined: false, fineTotal: 0 },
  { name: 'Microsoft', fined: false, fineTotal: 0 },
]

export const officialSources = [
  { label: 'DMA 官方门户', url: 'https://digital-markets-act.ec.europa.eu/index_en', desc: '守门人指定、义务清单、年度报告' },
  { label: 'DMA 案件登记库', url: 'https://digital-markets-act-cases.ec.europa.eu/', desc: '不合规决定与合规报告原文' },
  { label: '竞争案件检索系统', url: 'https://competition-cases.ec.europa.eu/', desc: '按案件编号检索决定全文' },
  { label: '欧委会 Press Corner', url: 'https://ec.europa.eu/commission/presscorner/home/en', desc: '执法新闻稿首发渠道' },
]

export function formatFine(millions: number): string {
  if (millions >= 100) return `€${(millions / 100).toFixed(millions % 100 === 0 ? 0 : 1)}亿`
  return `€${millions}00 万`
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return `${y} 年 ${m} 月 ${d} 日`
}

export const DMA_TOTAL_FINE = cases
  .filter((c) => c.category === 'penalty')
  .reduce((s, c) => s + (c.fine ?? 0), 0)
