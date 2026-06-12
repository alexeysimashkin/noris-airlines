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

  if (loading) return (
    <div style={{ paddingTop: 20 }}>
      <div className="skeleton" style={{ height: 100, marginBottom: 10 }}></div>
      <div className="skeleton" style={{ height: 100, marginBottom: 10 }}></div>
      <div className="skeleton" style={{ height: 100 }}></div>
    </div>
  )

  if (flights.length === 0) return (
    <div className="card" style={{ textAlign: 'center', padding: 40 }}>
      <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>Рейсы не найдены</p>
      <button className="btn btn-outline" style={{ marginTop: 12 }} onClick={() => router.push('/')}>Назад к поиску</button>
    </div>
  )

  return (
    <div style={{ paddingTop: 20 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Доступные рейсы</h2>
      {flights.map(f => (
        <div key={f.id} className="flight-card">
          <div className="flight-row">
            <div>
              <div className="flight-time">{fmt(f.departureTime)}</div>
              <div className="flight-city">{f.fromAirport?.city}</div>
              <div className="flight-iata">{f.fromAirport?.iata}</div>
            </div>
            <div className="flight-route">
              <div className="flight-route-line"></div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{Math.floor((f.durationMin||90)/60)}ч{(f.durationMin||90)%60}м</span>
              <div className="flight-route-line"></div>
            </div>
            <div>
              <div className="flight-time">{fmt(f.arrivalTime)}</div>
              <div className="flight-city">{f.toAirport?.city}</div>
              <div className="flight-iata">{f.toAirport?.iata}</div>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div className="flight-price">от {f.tariffs?.[0]?.price?.toLocaleString() || '—'} ₽</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{f.flightNumber} • {f.aircraft?.type}</div>
              <button className="btn btn-primary btn-sm" style={{ marginTop: 8 }}
                onClick={() => router.push({ pathname: '/tariff', query: { flightId: f.id, ...router.query } })}>
                Выбрать
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
