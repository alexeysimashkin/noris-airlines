import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'

export default function Confirmation() {
  const { t } = useLanguage()
  const router = useRouter()
  const { bookingCode, bookingId } = router.query
  const [booking, setBooking] = useState<any>(null)

  useEffect(() => {
    if (!bookingId) return
    fetch(`/api/bookings/${bookingId}`)
      .then(res => res.json())
      .then(setBooking)
  }, [bookingId])

  if (!booking) return <div className="card">Загрузка...</div>

  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
      <h2 className="card-title">{t.confirmation.title}</h2>
      
      <div style={{ 
        padding: '30px', 
        background: 'linear-gradient(135deg, #1a3a5c 0%, #2d5a8e 100%)', 
        color: 'white',
        borderRadius: '15px',
        margin: '20px 0'
      }}>
        <div style={{ fontSize: '14px', marginBottom: '10px', opacity: 0.9 }}>
          {t.confirmation.bookingCode}
        </div>
        <div style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '3px' }}>
          {bookingCode}
        </div>
      </div>
      
      <div style={{ textAlign: 'left', marginTop: '20px' }}>
        <h3 style={{ marginBottom: '15px', color: '#1a3a5c' }}>Детали бронирования:</h3>
        
        <div style={{ display: 'grid', gap: '10px' }}>
          <div><strong>Рейс:</strong> {booking.flight.flightNumber}</div>
          <div><strong>Маршрут:</strong> {booking.flight.fromAirport.city} → {booking.flight.toAirport.city}</div>
          <div><strong>Дата:</strong> {new Date(booking.flight.departureTime).toLocaleDateString('ru-RU', { 
            day: 'numeric', month: 'long', year: 'numeric' 
          })}</div>
          <div><strong>Время:</strong> {new Date(booking.flight.departureTime).toLocaleTimeString('ru-RU', { 
            hour: '2-digit', minute: '2-digit' 
          })}</div>
          <div><strong>Тариф:</strong> {booking.tariff.name}</div>
          <div><strong>Сумма:</strong> {booking.totalPrice.toLocaleString()} ₽</div>
        </div>
      </div>
      
      <p style={{ marginTop: '20px', color: '#666' }}>
        {t.confirmation.sendEmail}
      </p>
      
      <button 
        className="btn btn-primary" 
        style={{ marginTop: '20px' }}
        onClick={() => router.push('/')}
      >
        На главную
      </button>
    </div>
  )
}
