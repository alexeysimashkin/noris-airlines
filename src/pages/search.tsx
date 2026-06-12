import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

export default function SearchResults() {
  const router = useRouter()
  const [flights, setFlights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!router.isReady) return
    const from = router.query.from as string
    const to = router.query.to as string
    if (!from || !to) { setLoading(false); return }
    fetch(`/api/flights/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)
      .then(r => r.json()).then(d => { setFlights(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false))
  }, [router.isReady, router.query])

  const fmt = (d: string) => new Date(d).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })

  if (loading) return <div className="container" style={{ paddingTop: 24 }}><div className="skeleton" style={{ height: 100, borderRadius: 12, marginBottom: 10 }}></div><div className="skeleton" style={{ height: 100, borderRadius: 12 }}></div></div>
  if (flights.length === 0) return <div className="container" style={{ paddingTop: 24 }}><div className="card" style={{ textAlign: 'center' }}><h3>😕 Рейсы не найдены</h3><button className="btn btn-outline" style={{ marginTop: 12 }} onClick={() => router.push('/')}>← Назад</button></div></div>

  return (
    <div className="container" style={{ paddingTop: 24 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Доступные рейсы</h2>
      {flights.map(f => (
        <div key={f.id} className="flight-card">
          <div className="flight-card-header">
            <span>✈ {f.flightNumber} • {f.aircraft?.type}</span>
            <span>{Math.floor((f.durationMin || 90) / 60)}ч {(f.durationMin || 90) % 60}м</span>
          </div>
          <div className="flight-card-body">
            <div>
              <div className="flight-time">{fmt(f.departureTime)}</div>
              <div className="flight-city">{f.fromAirport?.city}</div>
              <div className="flight-iata">{f.fromAirport?.iata}</div>
            </div>
            <div className="flight-route-visual">
              <div className="flight-route-dot"></div>
              <div className="flight-route-line"></div>
              <div className="flight-route-plane">✈</div>
              <div className="flight-route-line"></div>
              <div className="flight-route-dot"></div>
            </div>
            <div>
              <div className="flight-time">{fmt(f.arrivalTime)}</div>
              <div className="flight-city">{f.toAirport?.city}</div>
              <div className="flight-iata">{f.toAirport?.iata}</div>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>от {f.tariffs?.[0]?.price?.toLocaleString() || '—'} ₽</div>
              <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => router.push({ pathname: '/tariff', query: { flightId: f.id, ...router.query } })}>Выбрать</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
