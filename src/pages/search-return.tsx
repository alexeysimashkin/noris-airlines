import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

export default function SearchReturn() {
  const router = useRouter()
  const [flights, setFlights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!router.isReady) return
    const { from, to, returnDate } = router.query
    fetch(`/api/flights/search?from=${to}&to=${from}&departureDate=${returnDate}`)
      .then(res => res.json())
      .then(data => { setFlights(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [router.isReady, router.query])

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
  }

  if (loading) return <div className="card" style={{ textAlign: 'center', padding: 40 }}><p style={{ fontSize: 18, color: '#6b5b8a' }}>🔍 Ищем обратные рейсы...</p></div>
  if (flights.length === 0) return <div className="card" style={{ textAlign: 'center', padding: 40 }}><p style={{ fontSize: 18, color: '#6b5b8a' }}>😕 Обратные рейсы не найдены</p><button className="btn btn-primary" style={{ marginTop: 15 }} onClick={() => router.push({ pathname: '/overview', query: router.query })}>Продолжить без обратного рейса</button></div>

  return (
    <div>
      <h1 className="card-title">Обратный рейс</h1>
      {flights.map((flight: any) => (
        <div key={flight.id} className="flight-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#6b3fa0' }}>{formatTime(flight.departureTime)}</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{flight.fromAirport?.city || '—'}</div>
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 13, color: '#999' }}>{Math.floor((flight.durationMin || 90) / 60)}ч {(flight.durationMin || 90) % 60}м</div>
                  <div style={{ height: 2, background: 'linear-gradient(to right, #c4b5fd, #8b5cf6)', margin: '5px 0' }}></div>
                  <div style={{ fontSize: 11, color: '#999' }}>✈ {flight.flightNumber}</div>
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#6b3fa0' }}>{formatTime(flight.arrivalTime)}</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{flight.toAirport?.city || '—'}</div>
                </div>
              </div>
            </div>
            <button className="btn btn-primary" onClick={() => router.push({ pathname: '/overview', query: { ...router.query, returnFlightId: flight.id } })}>Выбрать</button>
          </div>
        </div>
      ))}
      <button className="btn btn-outline" style={{ marginTop: 15, width: '100%' }} onClick={() => router.push({ pathname: '/overview', query: router.query })}>Продолжить без обратного рейса</button>
    </div>
  )
}
