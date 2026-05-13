import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'

interface Flight {
  id: number
  flightNumber: string
  fromAirport: { iata: string; city: string }
  toAirport: { iata: string; city: string }
  aircraft: { type: string }
  departureTime: string
  arrivalTime: string
  durationMin: number
  tariffs: Array<{ price: number; name: string }>
}

export default function SearchResults() {
  const { t } = useLanguage()
  const router = useRouter()
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFlights = async () => {
      const { from, to, departureDate } = router.query
      if (!from || !to || !departureDate) return

      const res = await fetch(`/api/flights/search?from=${from}&to=${to}&departureDate=${departureDate}`)
      const data = await res.json()
      setFlights(data)
      setLoading(false)
    }
    
    if (router.isReady) fetchFlights()
  }, [router.isReady, router.query])

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'short' })
  }

  if (loading) return <div className="card"><p>Загрузка рейсов...</p></div>

  return (
    <>
      <h1 className="card-title">Доступные рейсы</h1>
      
      {flights.length === 0 ? (
        <div className="card">
          <p>Рейсы не найдены. Попробуйте изменить параметры поиска.</p>
        </div>
      ) : (
        flights.map(flight => (
          <div key={flight.id} className="flight-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <div className="flight-route">
                  <div>
                    <div className="flight-time">{formatTime(flight.departureTime)}</div>
                    <div className="flight-city">{flight.fromAirport.city}</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>{flight.fromAirport.iata}</div>
                  </div>
                  
                  <div style={{ flex: 1, margin: '0 30px', textAlign: 'center' }}>
                    <div className="flight-line" style={{ margin: '10px 0' }}></div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      {Math.floor(flight.durationMin / 60)}ч {flight.durationMin % 60}м
                    </div>
                  </div>
                  
                  <div>
                    <div className="flight-time">{formatTime(flight.arrivalTime)}</div>
                    <div className="flight-city">{flight.toAirport.city}</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>{flight.toAirport.iata}</div>
                  </div>
                </div>
                
                <div style={{ marginTop: '15px', display: 'flex', gap: '20px', fontSize: '14px', color: '#666' }}>
                  <span>🛫 {flight.flightNumber}</span>
                  <span>✈ {flight.aircraft.type}</span>
                  <span>📅 {formatDate(flight.departureTime)}</span>
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#1a3a5c', marginBottom: '10px' }}>
                  от {flight.tariffs[0]?.price?.toLocaleString() || '—'} ₽
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
        ))
      )}
    </>
  )
}
