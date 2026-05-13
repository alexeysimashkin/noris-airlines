import { useState } from 'react'
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

  const handleSearch = () => {
    const params = new URLSearchParams({
      from,
      to,
      departureDate,
      returnDate,
      tripType,
      ...passengers
    })
    router.push(`/search?${params.toString()}`)
  }

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', color: '#1a3a5c', fontWeight: 700, marginBottom: '10px' }}>
          {t.search.title}
        </h1>
        <p style={{ color: '#5a6c7d', fontSize: '18px' }}>
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
            {t.search.oneWay}
          </button>
          <button 
            className={`btn ${tripType === 'roundtrip' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setTripType('roundtrip')}
          >
            {t.search.roundTrip}
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
            {t.search.reset}
          </button>
        </div>

        <div className="form-group">
          <label className="form-label">{t.search.passengers}</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {Object.entries(passengers).map(([key, value]) => (
              <div key={key} style={{ flex: '1', minWidth: '150px' }}>
                <label style={{ fontSize: '13px', color: '#5a6c7d' }}>
                  {t.search[key as keyof typeof t.search]}
                </label>
                <input 
                  type="number" 
                  className="form-input"
                  min="0"
                  max="9"
                  value={value}
                  onChange={e => setPassengers(p => ({...p, [key]: parseInt(e.target.value) || 0}))}
                />
              </div>
            ))}
          </div>
        </div>

        <button className="btn btn-primary" style={{ width: '100%', fontSize: '18px', padding: '15px' }} onClick={handleSearch}>
          {t.search.search}
        </button>
      </div>
    </>
  )
}
