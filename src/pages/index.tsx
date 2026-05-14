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
            <div style={{ flex: '1', minWidth: '150px' }}>
              <label style={{ fontSize: '13px', color: '#5a6c7d' }}>
                {t.search.adult}
              </label>
              <input 
                type="number" 
                className="form-input"
                min="0"
                max="9"
                value={passengers.adult}
                onChange={e => setPassengers(p => ({...p, adult: parseInt(e.target.value) || 0}))}
              />
            </div>
            <div style={{ flex: '1', minWidth: '150px' }}>
              <label style={{ fontSize: '13px', color: '#5a6c7d' }}>
                {t.search.child}
              </label>
              <input 
                type="number" 
                className="form-input"
                min="0"
                max="9"
                value={passengers.child}
                onChange={e => setPassengers(p => ({...p, child: parseInt(e.target.value) || 0}))}
              />
            </div>
            <div style={{ flex: '1', minWidth: '150px' }}>
              <label style={{ fontSize: '13px', color: '#5a6c7d' }}>
                {t.search.infantWithSeat}
              </label>
              <input 
                type="number" 
                className="form-input"
                min="0"
                max="9"
                value={passengers.infantWithSeat}
                onChange={e => setPassengers(p => ({...p, infantWithSeat: parseInt(e.target.value) || 0}))}
              />
            </div>
            <div style={{ flex: '1', minWidth: '150px' }}>
              <label style={{ fontSize: '13px', color: '#5a6c7d' }}>
                {t.search.infantNoSeat}
              </label>
              <input 
                type="number" 
                className="form-input"
                min="0"
                max="9"
                value={passengers.infantNoSeat}
                onChange={e => setPassengers(p => ({...p, infantNoSeat: parseInt(e.target.value) || 0}))}
              />
            </div>
            <div style={{ flex: '1', minWidth: '150px' }}>
              <label style={{ fontSize: '13px', color: '#5a6c7d' }}>
                {t.search.senior}
              </label>
              <input 
                type="number" 
                className="form-input"
                min="0"
                max="9"
                value={passengers.senior}
                onChange={e => setPassengers(p => ({...p, senior: parseInt(e.target.value) || 0}))}
              />
            </div>
          </div>
        </div>

        <button className="btn btn-primary" style={{ width: '100%', fontSize: '18px', padding: '15px' }} onClick={handleSearch}>
          {t.search.search}
        </button>
      </div>
    </>
  )
}
