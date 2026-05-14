import { useRouter } from 'next/router'
import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

const baggageOptions = [
  { id: 'baggage23', name: 'baggage23', price: 2500 },
  { id: 'baggage30', name: 'baggage30', price: 3500 },
  { id: 'sport', name: 'sport', price: 3000 }
]

export default function Baggage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [selectedBaggage, setSelectedBaggage] = useState<string[]>([])

  const toggleBaggage = (id: string) => {
    setSelectedBaggage(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    )
  }

  return (
    <div className="card">
      <h2 className="card-title">{t.baggage.title}</h2>
      
      <div style={{ display: 'grid', gap: '15px' }}>
        {baggageOptions.map(option => (
          <div 
            key={option.id}
            style={{ 
              padding: '20px',
              border: selectedBaggage.includes(option.id) ? '2px solid #1a3a5c' : '2px solid #e0e5ec',
              borderRadius: '10px',
              cursor: 'pointer',
              background: selectedBaggage.includes(option.id) ? '#f0f4f8' : 'white'
            }}
            onClick={() => toggleBaggage(option.id)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '16px', fontWeight: 500 }}>
                {t.baggage[option.name as keyof typeof t.baggage]}
              </span>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#1a3a5c' }}>
                {option.price.toLocaleString()} ₽
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        className="btn btn-primary" 
        style={{ marginTop: '20px', width: '100%' }}
        onClick={() => router.push({
          pathname: '/meal',
          query: { ...router.query, baggage: selectedBaggage.join(',') }
        })}
      >
        {selectedBaggage.length > 0 ? t.common.continue : t.baggage.continue}
      </button>
    </div>
  )
}
