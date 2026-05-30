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
    if (!from || !to) { setLoading(false); setError('Укажите город вылета и прилёта'); return }

    fetch(`/api/flights/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) { setFlights(data); setError('') }
        else if (data.error) setError(data.error)
        else setError('Неизвестная ошибка')
        setLoading(false)
      })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [router.isReady, router.query])

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
  }
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'short', timeZone: 'UTC' })
  }

  if (loading) return <div className="card" style={{ textAlign: 'center', padding: 40 }}><p style={{ fontSize: 18, color: '#6b5b8a' }}>🔍 Ищем рейсы...</p></div>
  if (error) return <div className="card" style={{ textAlign: 'center', padding: 40 }}><p style={{ color: 'red' }}>❌ {error}</p><button className="btn btn-outline" onClick={() => router.push('/')} style={{ marginTop: 15 }}>← Назад</button></div>
  if (flights.length === 0) return <div className="card" style={{ textAlign: 'center', padding: 40 }}><p style={{ fontSize: 18, color: '#6b5b8a' }}>😕 Рейсы не найдены</p><button className="btn btn-outline" onClick={() => router.push('/')} style={{ marginTop: 15 }}>← Назад</button></div>

  return (
    <div>
      <h1 className="card-title">Доступные рейсы</h1>
      {flights.map((flight: any) => (
        <div key={flight.id} className="flight-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#6b3fa0' }}>{formatTime(flight.departureTime)}</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{flight.fromAirport?.city || '—'}</div>
                  <div style={{ fontSize: 12, color: '#999' }}>{flight.fromAirport?.iata}</div>
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 13, color: '#999' }}>{Math.floor((flight.durationMin || 90) / 60)}ч {(flight.durationMin || 90) % 60}м</div>
                  <div style={{ height: 2, background: 'linear-gradient(to right, #c4b5fd, #8b5cf6)', margin: '5px 0' }}></div>
                  <div style={{ fontSize: 11, color: '#999' }}>✈ {flight.flightNumber}</div>
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#6b3fa0' }}>{formatTime(flight.arrivalTime)}</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{flight.toAirport?.city || '—'}</div>
                  <div style={{ fontSize: 12, color: '#999' }}>{flight.toAirport?.iata}</div>
                </div>
              </div>
              <div style={{ marginTop: 10, fontSize: 13, color: '#999' }}>📅 {formatDate(flight.departureTime)} &nbsp;|&nbsp; ✈ {flight.aircraft?.type || 'Boeing 737-800'}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#6b3fa0', marginBottom: 10 }}>от {flight.tariffs?.[0]?.price?.toLocaleString() || '—'} ₽</div>
              <button className="btn btn-primary" onClick={() => router.push({ pathname: '/tariff', query: { flightId: flight.id, ...router.query } })}>Выбрать</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
