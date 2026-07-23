# DMA 执法追踪器（DMA Enforcement Tracker）

汇总欧盟委员会依据《数字市场法》（Digital Markets Act, Regulation (EU) 2022/1925）作出的全部罚款决定、在办程序与关联案件，并通过 GitHub Actions 每日自动监测欧委会官方动态。

## 功能

- **案件总览**：全部 DMA 罚款决定（Apple €5 亿、Meta €2 亿、Alphabet €4.6 亿 + €4.3 亿）、在办程序、已结案事项与关联反垄断案件
- **筛选 / 时间线 / 统计图表**：按类型、公司、条款筛选；执法里程碑时间线；罚款金额图表
- **自动监测动态**：GitHub Actions 每天抓取欧委会 Press Corner 官方 RSS，筛出 DMA 相关新闻并自动提交更新
- **静态速览页**：`/static/` 路径下的纯 HTML 单页，适合打印与分享

## 启用自动化（一次性手动步骤）

两个 GitHub Actions 工作流已放在 `ci/` 目录（因工作流文件需要额外授权，无法自动推送）：

1. 在 GitHub 网页打开 `ci/monitor.yml` → 右上角编辑（铅笔图标）→ 将文件路径改为 `.github/workflows/monitor.yml` → Commit changes
2. 同样方法把 `ci/deploy.yml` 移到 `.github/workflows/deploy.yml`
3. 仓库 Settings → Pages → Source 选择 **GitHub Actions**

完成后：每天 UTC 06:17 自动监测更新；每次推送 main 分支自动构建并发布到 GitHub Pages。

## 数据说明

- 案件主数据在 `src/data/cases.ts`，人工维护，以官方原文为准
- 动态监测数据在 `public/data/updates.json`，由 `scripts/check_updates.py` 自动更新
- 官方来源：[DMA 官方门户](https://digital-markets-act.ec.europa.eu/index_en) · [DMA 案件登记库](https://digital-markets-act-cases.ec.europa.eu/) · [竞争案件检索系统](https://competition-cases.ec.europa.eu/) · [Press Corner](https://ec.europa.eu/commission/presscorner/home/en)

## 本地开发

```bash
npm install
npm run dev
npm run build   # 产物在 dist/
```

## 自动化说明

- `ci/monitor.yml`：每日 UTC 06:17 运行监测脚本，有新动态时自动提交 `public/data/updates.json`
- `ci/deploy.yml`：推送到 main 分支后自动构建并部署到 GitHub Pages

---

仅供研究参考，不构成法律意见。
