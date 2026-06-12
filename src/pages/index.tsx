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
      <section className="hero-section">
        <div className="hero-content container">
          <h1 className="hero-title">Поиск авиабилетов</h1>
          <p className="hero-subtitle">Noris Airlines — летайте с комфортом</p>
        </div>
      </section>

      <div className="container search-section">
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
            <div className="form-group" ref={ddRef}>
              <label className="form-label">Пассажиры</label>
              <button type="button" className="form-input" style={{ textAlign: 'left', cursor: 'pointer' }} onClick={() => setShowPassengers(!showPassengers)}>
                {total} {total === 1 ? 'пассажир' : 'пассажира'} {showPassengers ? '▲' : '▼'}
              </button>
              {showPassengers && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, padding: 8, boxShadow: 'var(--shadow-lg)', zIndex: 50 }}>
                  {['adult','child','infantWithSeat','infantNoSeat','senior'].map(k => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 8px' }}>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{k === 'adult' ? 'Взрослый' : k === 'child' ? 'Ребёнок' : k === 'infantWithSeat' ? 'Младенец с местом' : k === 'infantNoSeat' ? 'Младенец без места' : 'Пенсионер'}</span>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <button onClick={() => setPassengers(p => ({...p, [k]: Math.max(0, p[k as keyof typeof p] - 1)}))} style={{ border: '1px solid #ddd', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', background: 'white' }}>−</button>
                        <span style={{ fontWeight: 700 }}>{passengers[k as keyof typeof passengers]}</span>
                        <button onClick={() => setPassengers(p => ({...p, [k]: Math.min(9, p[k as keyof typeof p] + 1)}))} style={{ border: '1px solid #ddd', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', background: 'white' }}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button className="btn btn-primary btn-lg btn-block" onClick={search}>🔍 Найти</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
