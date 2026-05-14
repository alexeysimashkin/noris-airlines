import { useRouter } from 'next/router'
import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import BoardingPass from '@/components/BoardingPass'

export default function CheckIn() {
  const { t } = useLanguage()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [bookingCode, setBookingCode] = useState('')
  const [lastName, setLastName] = useState('')
  const [booking, setBooking] = useState<any>(null)
  const [boarded, setBoarded] = useState(false)

  const handleSearch = async () => {
    const res = await fetch(`/api/bookings/lookup?code=${bookingCode}&lastName=${lastName}`)
    const data = await res.json()
    if (data) {
      setBooking(data)
      setStep(2)
    } else {
      alert('Бронирование не найдено')
    }
  }

  const handleCheckIn = async () => {
    // В реальном приложении - обновление статуса в БД
    setBoarded(true)
  }

  if (boarded && booking) {
    return <BoardingPass booking={booking} />
  }

  return (
    <div className="card">
      <h2 className="card-title">{t.checkIn.title}</h2>
      
      {step === 1 ? (
        <>
          <div className="form-group">
            <label className="form-label">{t.checkIn.bookingCode}</label>
            <input 
              type="text" 
              className="form-input" 
              value={bookingCode}
              onChange={e => setBookingCode(e.target.value.toUpperCase())}
              placeholder="A1B2C3"
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t.checkIn.lastName}</label>
            <input 
              type="text" 
              className="form-input" 
              value={lastName}
              onChange={e => setLastName(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleSearch}>
            {t.checkIn.start}
          </button>
        </>
      ) : (
        <div>
          <h3 style={{ marginBottom: '20px', color: '#1a3a5c' }}>Детали рейса</h3>
          <div style={{ display: 'grid', gap: '10px', marginBottom: '20px' }}>
            <div><strong>Рейс:</strong> {booking.flight.flightNumber}</div>
            <div><strong>Маршрут:</strong> {booking.flight.fromAirport.city} → {booking.flight.toAirport.city}</div>
            <div><strong>Дата:</strong> {new Date(booking.flight.departureTime).toLocaleDateString()}</div>
            <div><strong>Время:</strong> {new Date(booking.flight.departureTime).toLocaleTimeString()}</div>
          </div>
          
          <button className="btn btn-gold" onClick={handleCheckIn} style={{ width: '100%' }}>
            Зарегистрироваться
          </button>
        </div>
      )}
    </div>
  )
}
