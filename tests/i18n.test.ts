import assert from 'node:assert/strict'
import test from 'node:test'
import { cases } from '../src/data/cases'
import {
  createTranslator,
  getInitialLocale,
  getCaseCopy,
  localizeArticle,
  localizeCategory,
} from '../src/lib/i18n'

test('defaults to Chinese when no saved preference is available', () => {
  assert.equal(getInitialLocale(), 'zh')
})

test('provides English copy for the dashboard shell', () => {
  const t = createTranslator('en')

  assert.equal(t('app.title'), 'DMA Enforcement Tracker')
  assert.equal(t('tabs.dashboard'), 'Dashboard')
  assert.equal(t('freshness.title'), 'Data freshness')
})

test('localizes categories and DMA articles', () => {
  assert.equal(localizeCategory('penalty', 'en'), 'Penalty decision')
  assert.equal(localizeCategory('related', 'en'), 'Related case (non-DMA)')
  assert.equal(localizeArticle('第 6(5) 条', 'en'), 'Article 6(5)')
  assert.equal(localizeArticle('市场调查', 'en'), 'Market investigation')
})

test('localizes case copy while preserving the official source URL', () => {
  const sourceCase = cases.find((item) => item.id === 'google-search-2026')
  assert.ok(sourceCase)

  const localized = getCaseCopy(sourceCase, 'en')

  assert.equal(localized.title, 'Google self-preferencing in Search')
  assert.equal(localized.stage, 'Fined (remediation status pending)')
  assert.equal(localized.articles[0], 'Article 6(5)')
  assert.equal(localized.sources[0].url, sourceCase.sources[0].url)
  assert.notEqual(localized.summary, sourceCase.summary)
})
