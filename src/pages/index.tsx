import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { useLanguage } from '@/context/LanguageContext'

export default function Home() {
  const { t } = useLanguage()
  const router = useRouter()
  const [airports, setAirports] = useState<any[]>([])
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [departureDate, setDepartureDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip'>('oneway')
  const [passengers, setPassengers] = useState({
    adult: 1, child: 0, infantWithSeat: 0, infantNoSeat: 0, senior: 0
  })
  const [showPassengers, setShowPassengers] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const totalPassengers = Object.values(passengers).reduce((a, b) => a + b, 0)

  useEffect(() => {
    fetch('/api/admin/airports')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setAirports(data) })
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowPassengers(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    params.append('from', from)
    params.append('to', to)
    params.append('departureDate', departureDate)
    if (tripType === 'roundtrip') params.append('returnDate', returnDate)
    params.append('tripType', tripType)
    params.append('adult', String(passengers.adult))
    params.append('child', String(passengers.child))
    params.append('infantWithSeat', String(passengers.infantWithSeat))
    params.append('infantNoSeat', String(passengers.infantNoSeat))
    params.append('senior', String(passengers.senior))
    router.push(`/search?${params.toString()}`)
  }

  return (
    <>
      <div className="hero">
        <h1 className="hero-title">Поиск авиабилетов</h1>
        <p className="hero-subtitle">Откройте мир с Noris Airlines</p>
      </div>

      <div className="card" style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <button className={`btn ${tripType === 'oneway' ? 'btn-primary' : 'btn-outline'} btn-sm`}
            onClick={() => setTripType('oneway')}>✈ В одну сторону</button>
          <button className={`btn ${tripType === 'roundtrip' ? 'btn-primary' : 'btn-outline'} btn-sm`}
            onClick={() => setTripType('roundtrip')}>↔ Туда-обратно</button>
        </div>

        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div className="form-group">
            <label className="form-label">Откуда</label>
            <select className="form-select" value={from} onChange={e => setFrom(e.target.value)}>
              <option value="">Выберите город</option>
              {airports.map((a: any) => (
                <option key={a.id} value={a.city}>{a.city} ({a.iata})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Куда</label>
            <select className="form-select" value={to} onChange={e => setTo(e.target.value)}>
              <option value="">Выберите город</option>
              {airports.map((a: any) => (
                <option key={a.id} value={a.city}>{a.city} ({a.iata})</option>
              ))}
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
        </div>

        <div className="form-group" ref={dropdownRef}>
          <label className="form-label">Пассажиры</label>
          <button type="button" className="passenger-trigger" onClick={() => setShowPassengers(!showPassengers)}>
            <span>{totalPassengers} {totalPassengers === 1 ? 'пассажир' : totalPassengers < 5 ? 'пассажира' : 'пассажиров'}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{showPassengers ? '▲' : '▼'}</span>
          </button>
          {showPassengers && (
            <div className="passenger-menu">
              {[
                { key: 'adult', label: 'Взрослый', desc: 'от 12 лет' },
                { key: 'child', label: 'Ребёнок', desc: '2–11 лет' },
                { key: 'infantWithSeat', label: 'Младенец с местом', desc: 'до 2 лет' },
                { key: 'infantNoSeat', label: 'Младенец без места', desc: 'до 2 лет' },
                { key: 'senior', label: 'Пенсионер', desc: 'от 57 лет, скидка 10%' },
              ].map(type => (
                <div key={type.key} className="passenger-item">
                  <div>
                    <div className="passenger-item-label">{type.label}</div>
                    <div className="passenger-item-desc">{type.desc}</div>
                  </div>
                  <div className="passenger-counter">
                    <button onClick={() => setPassengers(p => ({...p, [type.key]: Math.max(0, (p[type.key as keyof typeof p] || 0) - 1)}))}
                      disabled={passengers[type.key as keyof typeof passengers] <= 0}>−</button>
                    <span>{passengers[type.key as keyof typeof passengers]}</span>
                    <button onClick={() => setPassengers(p => ({...p, [type.key]: Math.min(9, (p[type.key as keyof typeof p] || 0) + 1)}))}
                      disabled={passengers[type.key as keyof typeof passengers] >= 9}>+</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="btn btn-primary btn-lg btn-block" style={{ marginTop: 8 }} onClick={handleSearch}>
          🔍 Найти билеты
        </button>
      </div>
    </>
  )
}
