import assert from 'node:assert/strict'
import test from 'node:test'
import type { DmaCase } from '../src/data/cases.ts'
import { getDashboardMetrics } from '../src/data/dashboardMetrics.ts'

function makeCase(overrides: Partial<DmaCase> = {}): DmaCase {
  return {
    id: 'case-default',
    title: '测试案件',
    gatekeeper: 'Apple',
    cps: '测试服务',
    articles: ['第 5(4) 条'],
    category: 'penalty',
    stage: '已罚款',
    fine: 100,
    decisionDate: '2025-04-23',
    summary: '测试数据',
    keyPoints: [],
    sources: [],
    ...overrides,
  }
}

test('excludes related fines and builds cumulative decision-year totals', () => {
  const metrics = getDashboardMetrics([
    makeCase({ id: 'apple', fine: 500, gatekeeper: 'Apple' }),
    makeCase({ id: 'google', fine: 430, gatekeeper: 'Alphabet', decisionDate: '2026-07-23' }),
    makeCase({ id: 'adtech', category: 'related', fine: 2950, gatekeeper: 'Alphabet', decisionDate: '2025-09-05' }),
  ])

  assert.equal(metrics.dmaFineTotal, 930)
  assert.equal(metrics.penaltyCount, 2)
  assert.deepEqual(metrics.finesByYear, [
    { year: '2025', fine: 500, cumulative: 500 },
    { year: '2026', fine: 430, cumulative: 930 },
  ])
  assert.deepEqual(metrics.finesByCompany, [
    { company: 'Apple', fine: 500, cases: 1 },
    { company: 'Alphabet', fine: 430, cases: 1 },
  ])
})

test('counts a multi-article case once under each applicable article', () => {
  const metrics = getDashboardMetrics([
    makeCase({ id: 'multi', articles: ['第 5(2) 条', '第 6(5) 条'] }),
    makeCase({ id: 'single', articles: ['第 5(2) 条'] }),
  ])

  assert.deepEqual(metrics.casesByArticle, [
    { article: '第 5(2) 条', cases: 2 },
    { article: '第 6(5) 条', cases: 1 },
  ])
})

test('flags appeals, pending verification, and active proceedings for attention', () => {
  const metrics = getDashboardMetrics([
    makeCase({ id: 'appeal', stage: '上诉中', appeal: '案件号 T-1/25' }),
    makeCase({ id: 'pending', stage: '已罚款（整改状态待核）' }),
    makeCase({ id: 'proceeding', category: 'proceeding', fine: null, stage: '调查中' }),
  ])

  assert.equal(metrics.appealCount, 1)
  assert.equal(metrics.pendingVerificationCount, 1)
  assert.equal(metrics.proceedingCount, 1)
  assert.deepEqual(metrics.attention.map((item) => item.reason), [
    '上诉中',
    '整改状态待核',
    '在办程序',
  ])
})

test('returns stable empty metric arrays for an empty catalogue', () => {
  const metrics = getDashboardMetrics([])

  assert.deepEqual(metrics, {
    dmaFineTotal: 0,
    penaltyCount: 0,
    finedCompanyCount: 0,
    proceedingCount: 0,
    appealCount: 0,
    pendingVerificationCount: 0,
    finesByYear: [],
    finesByCompany: [],
    casesByArticle: [],
    categoryCounts: [],
    attention: [],
  })
})
