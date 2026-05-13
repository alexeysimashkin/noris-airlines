import { useLanguage } from '@/context/LanguageContext'

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()

  return (
    <div style={{ display: 'flex', gap: '5px' }}>
      <button 
        onClick={() => setLang('ru')}
        style={{ 
          padding: '5px 10px',
          border: lang === 'ru' ? '2px solid #1a3a5c' : '1px solid #ddd',
          borderRadius: '5px',
          background: lang === 'ru' ? '#1a3a5c' : 'white',
          color: lang === 'ru' ? 'white' : '#1a3a5c',
          cursor: 'pointer',
          fontWeight: 600
        }}
      >
        RU
      </button>
      <button 
        onClick={() => setLang('en')}
        style={{ 
          padding: '5px 10px',
          border: lang === 'en' ? '2px solid #1a3a5c' : '1px solid #ddd',
          borderRadius: '5px',
          background: lang === 'en' ? '#1a3a5c' : 'white',
          color: lang === 'en' ? 'white' : '#1a3a5c',
          cursor: 'pointer',
          fontWeight: 600
        }}
      >
        EN
      </button>
    </div>
  )
}
