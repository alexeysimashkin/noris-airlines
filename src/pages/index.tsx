import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  const [airports, setAirports] = useState<any[]>([])
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [departureDate, setDepartureDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip'>('oneway')
  const [passengers, setPassengers] = useState({ adult: 1, child: 0, infantWithSeat: 0, infantNoSeat: 0, senior: 0 })
  const [showPassengers, setShowPassengers] = useState(false)
  const ddRef = useRef<HTMLDivElement>(null)
  const total = Object.values(passengers).reduce((a, b) => a + b, 0)

  useEffect(() => {
    fetch('/api/admin/airports').then(r => r.json()).then(d => { if (Array.isArray(d)) setAirports(d) })
  }, [])
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ddRef.current && !ddRef.current.contains(e.target as Node)) setShowPassengers(false) }
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h)
  }, [])

  const search = () => {
    const p = new URLSearchParams()
    p.append('from', from); p.append('to', to); p.append('departureDate', departureDate)
    if (tripType === 'roundtrip') p.append('returnDate', returnDate)
    p.append('tripType', tripType)
    p.append('adult', String(passengers.adult)); p.append('child', String(passengers.child))
    p.append('infantWithSeat', String(passengers.infantWithSeat)); p.append('infantNoSeat', String(passengers.infantNoSeat))
    p.append('senior', String(passengers.senior))
    router.push(`/search?${p.toString()}`)
  }

  return (
    <>
      <div className="hero">
        <div className="hero-badge">🛫 Премиум-авиакомпания</div>
        <h1 className="hero-title">Откройте мир<br />с Noris Airlines</h1>
        <p className="hero-subtitle">Изысканные путешествия по России и миру — ваш комфорт наш приоритет</p>
      </div>

      <div className="container">
        <div className="search-card">
          <div className="search-tabs">
            <button className={`search-tab ${tripType === 'oneway' ? 'active' : ''}`} onClick={() => setTripType('oneway')}>✈ В одну сторону</button>
            <button className={`search-tab ${tripType === 'roundtrip' ? 'active' : ''}`} onClick={() => setTripType('roundtrip')}>↔ Туда-обратно</button>
          </div>

          <div className="search-grid">
            <div className="form-group">
              <label className="form-label">Откуда</label>
              <select className="form-select" value={from} onChange={e => setFrom(e.target.value)}>
                <option value="">Город или аэропорт</option>
                {airports.map((a: any) => <option key={a.id} value={a.city}>{a.city} ({a.iata})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Куда</label>
              <select className="form-select" value={to} onChange={e => setTo(e.target.value)}>
                <option value="">Город или аэропорт</option>
                {airports.map((a: any) => <option key={a.id} value={a.city}>{a.city} ({a.iata})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Туда</label>
              <input type="date" className="form-input" value={departureDate} onChange={e => setDepartureDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Обратно</label>
              <input type="date" className="form-input" value={returnDate} onChange={e => setReturnDate(e.target.value)} disabled={tripType === 'oneway'} />
            </div>
            <div className="form-group" ref={ddRef} style={{ position: 'relative' }}>
              <label className="form-label">Пассажиры</label>
              <button type="button" className="form-input" style={{ textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
                onClick={() => setShowPassengers(!showPassengers)}>
                <span>{total} {total === 1 ? 'пассажир' : total < 5 ? 'пассажира' : 'пассажиров'}</span>
                <span>{showPassengers ? '▲' : '▼'}</span>
              </button>
              {showPassengers && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid rgba(192,132,252,0.15)', borderRadius: 14, padding: 8, boxShadow: 'var(--shadow-xl)', zIndex: 50, marginTop: 4 }}>
                  {[
                    { key: 'adult', label: 'Взрослый (12+)', desc: '' },
                    { key: 'child', label: 'Ребёнок (2–11)', desc: '' },
                    { key: 'infantWithSeat', label: 'Младенец с местом', desc: 'до 2 лет' },
                    { key: 'infantNoSeat', label: 'Младенец без места', desc: 'до 2 лет' },
                    { key: 'senior', label: 'Пенсионер (57+)', desc: 'скидка 10%' },
                  ].map(t => (
                    <div key={t.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 10px', borderRadius: 10 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{t.label}</div>
                        {t.desc && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.desc}</div>}
                      </div>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <button onClick={() => setPassengers(p => ({...p, [t.key]: Math.max(0, p[t.key as keyof typeof p] - 1)}))}
                          style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid rgba(192,132,252,0.2)', background: 'white', cursor: 'pointer', fontWeight: 700, color: 'var(--primary)', fontSize: 18 }}
                          disabled={passengers[t.key as keyof typeof passengers] <= 0}>−</button>
                        <span style={{ fontWeight: 700, fontSize: 16, minWidth: 24, textAlign: 'center' }}>{passengers[t.key as keyof typeof passengers]}</span>
                        <button onClick={() => setPassengers(p => ({...p, [t.key]: Math.min(9, p[t.key as keyof typeof p] + 1)}))}
                          style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid rgba(192,132,252,0.2)', background: 'white', cursor: 'pointer', fontWeight: 700, color: 'var(--primary)', fontSize: 18 }}
                          disabled={passengers[t.key as keyof typeof passengers] >= 9}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button className="btn btn-primary btn-lg btn-block" onClick={search}>🔍 Найти билеты</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
