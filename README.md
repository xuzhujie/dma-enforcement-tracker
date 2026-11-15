# DMA 执法追踪器（DMA Enforcement Tracker）

汇总欧盟委员会依据《数字市场法》（Digital Markets Act, Regulation (EU) 2022/1925）作出的全部罚款决定、在办程序与关联案件，并通过 GitHub Actions 每日自动监测欧委会官方动态。

## 功能

- **案件总览**：全部 DMA 罚款决定（Apple €5 亿、Meta €2 亿、Alphabet €4.6 亿 + €4.3 亿）、在办程序、已结案事项与关联反垄断案件
- **筛选 / 时间线 / 统计图表**：按类型、公司、条款筛选；执法里程碑时间线；罚款金额图表
- **自动监测动态**：GitHub Actions 每天抓取欧委会 Press Corner 官方 RSS，筛出 DMA 相关新闻；有新内容才提交更新
- **静态速览页**：`/static/` 路径下的纯 HTML 单页，适合打印与分享

## GitHub 自动化

工作流已位于 GitHub 识别的 `.github/workflows/` 目录：

- `.github/workflows/monitor.yml`：每天 UTC 06:17（北京时间 14:17）运行，也支持手动触发；无新动态时不产生提交
- `.github/workflows/deploy.yml`：推送到 `main` 后执行 `npm ci`、Lint、构建并部署到 GitHub Pages
- 首次使用时，在仓库 Settings → Pages → Source 选择 **GitHub Actions**

每次监测运行都会写入 GitHub Actions Summary。GitHub 自带的失败运行通知继续有效；默认不向第三方发送消息。

### 可选 Webhook 通知

如需 Slack、Discord、飞书或其他兼容 Webhook 的渠道，在仓库 Settings 中配置：

- Actions secret：`NOTIFY_WEBHOOK_URL`
- Actions variable：`NOTIFY_WEBHOOK_KIND`，可填 `slack`、`discord`、`feishu` 或 `generic`（默认按通用 `{ "text": "..." }` 格式发送）

只有发现新动态时才发送通知；通知失败不会阻断数据提交，但会在运行日志中显示。不要把 Webhook 地址写入代码或公开配置文件。

## 数据说明

- 案件主数据在 `src/data/cases.ts`，人工维护，以官方原文为准；罚款金额、上诉案号、启动/决定日期等字段不由 RSS 自动推断
- 静态速览页在 `public/static/index.html`，更新案件主数据时需同步维护
- 动态监测数据在 `public/data/updates.json`，由 `scripts/check_updates.py` 自动更新
- 监测脚本只覆盖 Press Corner RSS 当前返回窗口内的新闻，不是欧委会案件登记库的完整同步；“没有新动态”不等于“没有新案件或程序变化”
- 官方来源：[DMA 官方门户](https://digital-markets-act.ec.europa.eu/index_en) · [DMA 案件登记库](https://digital-markets-act-cases.ec.europa.eu/) · [竞争案件检索系统](https://competition-cases.ec.europa.eu/) · [Press Corner](https://ec.europa.eu/commission/presscorner/home/en)

## 本地开发

```bash
npm install
npm run dev
npm run lint
npm run build   # 产物在 dist/
```

CI 使用锁文件安装依赖；本地优先使用 `npm ci` 保持一致。监测脚本也可以手动运行：

```bash
python3 scripts/check_updates.py
python3 -m unittest discover -s tests -v
```

## 项目状态

仓库目前可以公开访问；公开使用前仍建议补充一个明确的开源许可证。数据仅供研究参考，不构成法律意见；处罚状态和整改进展请以欧盟委员会最新原文为准。

---

仅供研究参考，不构成法律意见。
