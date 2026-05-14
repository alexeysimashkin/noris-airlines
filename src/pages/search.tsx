import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

export default function SearchResults() {
  const router = useRouter()
  const [flights, setFlights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!router.isReady) return

    const from = router.query.from as string
    const to = router.query.to as string

    if (!from || !to) {
      setLoading(false)
      setError('Укажите город вылета и прилёта')
      return
    }

    fetch(`/api/flights/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setFlights(data)
          setError('')
        } else if (data.error) {
          setError(data.error)
        } else {
          setError('Неизвестная ошибка')
        }
        setLoading(false)
      })
      .catch(e => {
        setError(e.message || 'Ошибка сети')
        setLoading(false)
      })
  }, [router.isReady, router.query])

  if (loading) {
    return <div className="card"><p>Загрузка...</p></div>
  }

  if (error) {
    return (
      <div className="card">
        <p style={{ color: 'red' }}>Ошибка: {error}</p>
        <button className="btn btn-outline" onClick={() => router.push('/')}>← Назад</button>
      </div>
    )
  }

  if (flights.length === 0) {
    return (
      <div className="card">
        <p>Рейсы не найдены</p>
        <button className="btn btn-outline" onClick={() => router.push('/')}>← Назад</button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="card-title">Доступные рейсы ({flights.length})</h1>
      
      {flights.map((flight: any) => (
        <div key={flight.id} className="flight-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <strong>{flight.flightNumber}</strong>
              <br />
              {flight.fromAirport?.city} → {flight.toAirport?.city}
              <br />
              {flight.departureTime && new Date(flight.departureTime).toLocaleString('ru-RU')}
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#6b3fa0' }}>
                {flight.tariffs?.[0]?.price ? `от ${flight.tariffs[0].price} ₽` : 'Цена не указана'}
              </div>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => router.push(`/tariff?flightId=${flight.id}`)}
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
