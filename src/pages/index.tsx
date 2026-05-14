import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useLanguage } from '@/context/LanguageContext'

export default function Home() {
  const { t } = useLanguage()
  const router = useRouter()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [departureDate, setDepartureDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip'>('oneway')
  const [passengers, setPassengers] = useState({
    adult: 1,
    child: 0,
    infantWithSeat: 0,
    infantNoSeat: 0,
    senior: 0
  })
  const [showPassengers, setShowPassengers] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const totalPassengers = Object.values(passengers).reduce((a, b) => a + b, 0)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowPassengers(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    params.append('from', from)
    params.append('to', to)
    params.append('departureDate', departureDate)
    if (tripType === 'roundtrip') {
      params.append('returnDate', returnDate)
    }
    params.append('tripType', tripType)
    params.append('adult', String(passengers.adult))
    params.append('child', String(passengers.child))
    params.append('infantWithSeat', String(passengers.infantWithSeat))
    params.append('infantNoSeat', String(passengers.infantNoSeat))
    params.append('senior', String(passengers.senior))
    router.push(`/search?${params.toString()}`)
  }

  const updatePassenger = (type: string, delta: number) => {
    setPassengers(prev => ({
      ...prev,
      [type]: Math.max(0, Math.min(9, (prev[type as keyof typeof prev] || 0) + delta))
    }))
  }

  const passengerTypes = [
    { key: 'adult', label: t.search.adult, desc: 'от 12 лет' },
    { key: 'child', label: t.search.child, desc: '2–11 лет' },
    { key: 'infantWithSeat', label: t.search.infantWithSeat, desc: 'до 2 лет, с местом' },
    { key: 'infantNoSeat', label: t.search.infantNoSeat, desc: 'до 2 лет, без места' },
    { key: 'senior', label: t.search.senior, desc: 'от 57 лет, скидка 10%' },
  ]

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', background: 'linear-gradient(135deg, #6b3fa0, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700, marginBottom: '10px' }}>
          {t.search.title}
        </h1>
        <p style={{ color: '#6b5b8a', fontSize: '18px' }}>
          Откройте мир с Noris Airlines
        </p>
      </div>

      <div className="card">
        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">{t.search.from}</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Москва (SVO)"
              value={from}
              onChange={e => setFrom(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t.search.to}</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Санкт-Петербург (LED)"
              value={to}
              onChange={e => setTo(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t.search.departure}</label>
            <input 
              type="date" 
              className="form-input"
              value={departureDate}
              onChange={e => setDepartureDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t.search.return}</label>
            <input 
              type="date" 
              className="form-input"
              value={returnDate}
              onChange={e => setReturnDate(e.target.value)}
              disabled={tripType === 'oneway'}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button 
            className={`btn ${tripType === 'oneway' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setTripType('oneway')}
          >
            ✈ {t.search.oneWay}
          </button>
          <button 
            className={`btn ${tripType === 'roundtrip' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setTripType('roundtrip')}
          >
            ↔ {t.search.roundTrip}
          </button>
          <button 
            className="btn btn-outline btn-sm"
            onClick={() => {
              setFrom('')
              setTo('')
              setDepartureDate('')
              setReturnDate('')
              setTripType('oneway')
              setPassengers({ adult: 1, child: 0, infantWithSeat: 0, infantNoSeat: 0, senior: 0 })
            }}
          >
            ↺ {t.search.reset}
          </button>
        </div>

        {/* Passenger Dropdown */}
        <div className="form-group" ref={dropdownRef}>
          <label className="form-label">{t.search.passengers}</label>
          <div className="passenger-dropdown">
            <button 
              type="button"
              className="passenger-trigger"
              onClick={() => setShowPassengers(!showPassengers)}
            >
              <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>
                  {totalPassengers} пассажир{totalPassengers > 1 ? (totalPassengers < 5 ? 'а' : 'ов') : ''}
                </span>
                <span style={{ fontSize: '12px', color: '#6b5b8a' }}>
                  {showPassengers ? '▲' : '▼'}
                </span>
              </span>
            </button>
            
            {showPassengers && (
              <div className="passenger-menu">
                {passengerTypes.map(type => (
                  <div key={type.key} className="passenger-item">
                    <div className="passenger-item-info">
                      <div className="passenger-item-label">{type.label}</div>
                      <div className="passenger-item-desc">{type.desc}</div>
                    </div>
                    <div className="passenger-counter">
                      <button 
                        type="button"
                        onClick={() => updatePassenger(type.key, -1)}
                        disabled={passengers[type.key as keyof typeof passengers] <= 0}
                      >
                        −
                      </button>
                      <span>{passengers[type.key as keyof typeof passengers]}</span>
                      <button 
                        type="button"
                        onClick={() => updatePassenger(type.key, 1)}
                        disabled={passengers[type.key as keyof typeof passengers] >= 9}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button className="btn btn-primary" style={{ width: '100%', fontSize: '18px', padding: '16px' }} onClick={handleSearch}>
          🔍 {t.search.search}
        </button>
      </div>
    </>
  )
}
