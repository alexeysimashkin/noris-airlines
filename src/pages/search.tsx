import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'

export default function SearchResults() {
  const { t } = useLanguage()
  const router = useRouter()
  const [flights, setFlights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!router.isReady) return

    const { from, to, departureDate } = router.query
    
    if (!from || !to) {
      setLoading(false)
      setError('Укажите город вылета и прилёта')
      return
    }

    fetch(`/api/flights/search?from=${from}&to=${to}&departureDate=${departureDate || ''}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setFlights(data)
        } else {
          setError(data.error || 'Ошибка загрузки')
        }
        setLoading(false)
      })
      .catch(e => {
        setError(e.message)
        setLoading(false)
      })
  }, [router.isReady, router.query])

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ fontSize: '18px', color: '#6b5b8a' }}>🔍 Ищем рейсы...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: 'red' }}>❌ {error}</p>
        <button className="btn btn-outline" onClick={() => router.push('/')} style={{ marginTop: '15px' }}>
          ← Назад к поиску
        </button>
      </div>
    )
  }

  if (flights.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ fontSize: '18px', color: '#6b5b8a' }}>😕 Рейсы не найдены</p>
        <p style={{ color: '#999' }}>Попробуйте изменить параметры поиска</p>
        <button className="btn btn-outline" onClick={() => router.push('/')} style={{ marginTop: '15px' }}>
          ← Назад к поиску
        </button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="card-title">Доступные рейсы</h1>
      
      {flights.map((flight: any) => (
        <div key={flight.id} className="flight-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#6b3fa0' }}>
                    {new Date(flight.departureTime).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 600 }}>{flight.fromAirport?.city || '—'}</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>{flight.fromAirport?.iata}</div>
                </div>
                
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', color: '#999' }}>
                    {Math.floor((flight.durationMin || 90) / 60)}ч {(flight.durationMin || 90) % 60}м
                  </div>
                  <div style={{ height: '2px', background: 'linear-gradient(to right, #c4b5fd, #8b5cf6)', margin: '5px 0' }}></div>
                  <div style={{ fontSize: '11px', color: '#999' }}>✈ {flight.flightNumber}</div>
                </div>
                
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#6b3fa0' }}>
                    {new Date(flight.arrivalTime).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 600 }}>{flight.toAirport?.city || '—'}</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>{flight.toAirport?.iata}</div>
                </div>
              </div>
              
              <div style={{ marginTop: '10px', fontSize: '13px', color: '#999' }}>
                📅 {new Date(flight.departureTime).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'short' })}
                &nbsp;|&nbsp; ✈ {flight.aircraft?.type || 'Boeing 737-800'}
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#6b3fa0', marginBottom: '10px' }}>
                от {flight.tariffs?.[0]?.price?.toLocaleString() || '—'} ₽
              </div>
              <button 
                className="btn btn-primary"
                onClick={() => router.push({
                  pathname: '/tariff',
                  query: { 
                    flightId: flight.id,
                    ...router.query 
                  }
                })}
              >
                Выбрать
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
