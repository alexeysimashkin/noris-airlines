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
  const [showPass, setShowPass] = useState(false)
  const ddRef = useRef<HTMLDivElement>(null)
  const total = Object.values(passengers).reduce((a, b) => a + b, 0)

  useEffect(() => {
    fetch('/api/admin/airports').then(r => r.json()).then(d => { if (Array.isArray(d)) setAirports(d) })
  }, [])
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ddRef.current && !ddRef.current.contains(e.target as Node)) setShowPass(false) }
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

  const pt = [
    { key: 'adult', label: 'Взрослый', desc: 'от 12 лет' },
    { key: 'child', label: 'Ребёнок', desc: '2–11 лет' },
    { key: 'infantWithSeat', label: 'Младенец с местом', desc: 'до 2 лет' },
    { key: 'infantNoSeat', label: 'Младенец без места', desc: 'до 2 лет' },
    { key: 'senior', label: 'Пенсионер', desc: '57+ лет, скидка 10%' },
  ]

  return (
    <>
      <div className="hero">
        <h1>Откройте мир с <span>Noris Airlines</span></h1>
        <p>Путешествуйте с комфортом по России и миру</p>
      </div>

      <div className="search-wrapper">
        <div className="search-card">
          <div className="search-tabs">
            <button className={`search-tab ${tripType === 'oneway' ? 'active' : ''}`} onClick={() => setTripType('oneway')}>В одну сторону</button>
            <button className={`search-tab ${tripType === 'roundtrip' ? 'active' : ''}`} onClick={() => setTripType('roundtrip')}>Туда-обратно</button>
          </div>

          <div className="search-grid">
            <div className="form-group">
              <label className="form-label">Откуда</label>
              <select className="form-select" value={from} onChange={e => setFrom(e.target.value)}>
                <option value="">Город</option>
                {airports.map((a: any) => <option key={a.id} value={a.city}>{a.city}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Куда</label>
              <select className="form-select" value={to} onChange={e => setTo(e.target.value)}>
                <option value="">Город</option>
                {airports.map((a: any) => <option key={a.id} value={a.city}>{a.city}</option>)}
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
            <div className="form-group passenger-wrap" ref={ddRef}>
              <label className="form-label">Пассажиры</label>
              <button type="button" className="passenger-trigger" onClick={() => setShowPass(!showPass)}>
                <span>{total} {total === 1 ? 'пассажир' : total < 5 ? 'пассажира' : 'пассажиров'}</span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{showPass ? '▲' : '▼'}</span>
              </button>
              {showPass && (
                <div className="passenger-menu">
                  {pt.map(t => (
                    <div key={t.key} className="passenger-item">
                      <div>
                        <div className="passenger-label">{t.label}</div>
                        <div className="passenger-desc">{t.desc}</div>
                      </div>
                      <div className="passenger-counter">
                        <button onClick={() => setPassengers(p => ({...p, [t.key]: Math.max(0, p[t.key as keyof typeof p] - 1)}))}
                          disabled={passengers[t.key as keyof typeof passengers] <= 0}>−</button>
                        <span>{passengers[t.key as keyof typeof passengers]}</span>
                        <button onClick={() => setPassengers(p => ({...p, [t.key]: Math.min(9, p[t.key as keyof typeof p] + 1)}))}
                          disabled={passengers[t.key as keyof typeof passengers] >= 9}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button className="btn btn-primary btn-lg btn-block" style={{ marginTop: 16 }} onClick={search}>
            Найти билеты
          </button>
        </div>
      </div>
    </>
  )
}
