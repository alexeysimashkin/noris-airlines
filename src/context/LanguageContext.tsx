import { createContext, useContext, useState, ReactNode } from 'react'
import ru from '@/i18n/ru.json'
import en from '@/i18n/en.json'

type Lang = 'ru' | 'en'
type Translations = typeof ru

const translations = { ru, en } as Record<Lang, Translations>

const LanguageContext = createContext<{
  lang: Lang
  setLang: (l: Lang) => void
  t: Translations
}>({
  lang: 'ru',
  setLang: () => {},
  t: ru
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('ru')
  const t = translations[lang]

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
