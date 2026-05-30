import { useRouter } from 'next/router'
import { useState } from 'react'

const baggageOptions = [
  { id: 'baggage23', name: 'Багаж до 23кг — 2 500 ₽', price: 2500 },
  { id: 'baggage30', name: 'Багаж до 30кг — 3 500 ₽', price: 3500 },
  { id: 'sport', name: 'Спортинвентарь — 3 000 ₽', price: 3000 }
]

export default function BaggageReturn() {
  const router = useRouter()
  const [selectedBaggage, setSelectedBaggage] = useState<string[]>([])

  const toggleBaggage = (id: string) => {
    setSelectedBaggage(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    )
  }

  return (
    <div className="card">
      <h2 className="card-title">Дополнительный багаж — обратный рейс</h2>

      <div style={{ display: 'grid', gap: 15 }}>
        {baggageOptions.map(option => (
          <div
            key={option.id}
            onClick={() => toggleBaggage(option.id)}
            style={{
              padding: 20,
              border: selectedBaggage.includes(option.id) ? '2px solid #6b3fa0' : '2px solid #e8e0f0',
              borderRadius: 10,
              cursor: 'pointer',
              background: selectedBaggage.includes(option.id) ? '#f5f3ff' : 'white'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 16, fontWeight: 500 }}>{option.name}</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#6b3fa0' }}>{option.price.toLocaleString()} ₽</span>
            </div>
          </div>
        ))}
      </div>

      <button
        className="btn btn-primary"
        style={{ marginTop: 20, width: '100%' }}
        onClick={() => router.push({
          pathname: '/meal-return',
          query: { ...router.query, returnBaggage: selectedBaggage.join(',') }
        })}
      >
        {selectedBaggage.length > 0 ? 'Продолжить' : 'Продолжить без багажа'}
      </button>
    </div>
  )
}
