import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  createTranslator,
  getInitialLocale,
  LOCALE_STORAGE_KEY,
  type Locale,
  type Translator,
} from './i18n'

interface LanguageContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translator
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(getInitialLocale)
  const t = useMemo(() => createTranslator(locale), [locale])

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    document.documentElement.lang = locale === 'en' ? 'en' : 'zh-CN'
  }, [locale])

  return <LanguageContext.Provider value={{ locale, setLocale, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}
