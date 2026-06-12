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
      .then(res => res.json())
      .then(data => { setFlights(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [router.isReady, router.query])

  const formatTime = (d: string) => new Date(d).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })

  if (loading) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div className="skeleton skeleton-card" style={{ marginBottom: 12 }}></div>
        <div className="skeleton skeleton-card" style={{ marginBottom: 12 }}></div>
      </div>
    )
  }

  if (flights.length === 0) {
    return (
      <div className="card" style={{ maxWidth: 500, margin: '40px auto', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>😕</div>
        <h3>Рейсы не найдены</h3>
        <p style={{ color: 'var(--text-light)', margin: '12px 0' }}>Попробуйте изменить параметры поиска</p>
        <button className="btn btn-outline" onClick={() => router.push('/')}>← Назад</button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h1 className="card-title">Доступные рейсы</h1>
      {flights.map((f: any) => (
        <div key={f.id} className="flight-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div className="flight-route">
                <div>
                  <div style={{ fontSize: 28, fontWeight: 800 }}>{formatTime(f.departureTime)}</div>
                  <div className="flight-route-city">{f.fromAirport?.city}</div>
                  <div className="flight-route-iata">{f.fromAirport?.iata}</div>
                </div>
                <div className="flight-route-line"></div>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 800 }}>{formatTime(f.arrivalTime)}</div>
                  <div className="flight-route-city">{f.toAirport?.city}</div>
                  <div className="flight-route-iata">{f.toAirport?.iata}</div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>
                ✈ {f.flightNumber} • {f.aircraft?.type} • {Math.floor((f.durationMin || 90) / 60)}ч {(f.durationMin || 90) % 60}м
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)' }}>
                от {f.tariffs?.[0]?.price?.toLocaleString() || '—'} ₽
              </div>
              <button className="btn btn-primary" style={{ marginTop: 8 }}
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
