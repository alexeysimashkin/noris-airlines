import { useRouter } from 'next/router'
import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

export default function BookingManagement() {
  const { t } = useLanguage()
  const [bookingCode, setBookingCode] = useState('')
  const [lastName, setLastName] = useState('')
  const [booking, setBooking] = useState<any>(null)
  const [refundAmount, setRefundAmount] = useState<number | null>(null)

  const handleSearch = async () => {
    const res = await fetch(`/api/bookings/lookup?code=${bookingCode}&lastName=${lastName}`)
    const data = await res.json()
    setBooking(data)
    
    if (data) {
      const hoursUntilFlight = (new Date(data.flight.departureTime).getTime() - Date.now()) / 3600000
      if (hoursUntilFlight > 24) {
        setRefundAmount(data.totalPrice)
      } else {
        setRefundAmount(data.totalPrice * 0.5)
      }
    }
  }

  const handleRefund = async () => {
    if (!confirm('Вы уверены, что хотите оформить возврат?')) return
    
    await fetch(`/api/bookings/${booking.id}/refund`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refundAmount })
    })
    
    alert(`Возврат оформлен. Сумма к возврату: ${refundAmount?.toLocaleString()} ₽`)
    setBooking(null)
  }

  return (
    <div className="card">
      <h2 className="card-title">{t.booking.title}</h2>
      
      {!booking ? (
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
            Найти бронирование
          </button>
        </>
      ) : (
        <div>
          <h3 style={{ marginBottom: '20px', color: '#1a3a5c' }}>Информация о бронировании</h3>
          
          <div style={{ display: 'grid', gap: '10px', marginBottom: '20px' }}>
            <div><strong>Код:</strong> {booking.bookingCode}</div>
            <div><strong>Рейс:</strong> {booking.flight.flightNumber}</div>
            <div><strong>Маршрут:</strong> {booking.flight.fromAirport.city} → {booking.flight.toAirport.city}</div>
            <div><strong>Дата:</strong> {new Date(booking.flight.departureTime).toLocaleDateString()}</div>
            <div><strong>Статус:</strong> {booking.status}</div>
            <div><strong>Сумма:</strong> {booking.totalPrice.toLocaleString()} ₽</div>
          </div>
          
          {refundAmount !== null && (
            <div style={{ 
              padding: '15px', 
              background: '#fff3e0', 
              borderRadius: '10px',
              marginBottom: '20px'
            }}>
              <p>{t.booking.returnPolicy}</p>
              <p style={{ fontSize: '18px', fontWeight: 700, marginTop: '10px' }}>
                Сумма к возврату: {refundAmount.toLocaleString()} ₽
              </p>
            </div>
          )}
          
          <button className="btn btn-gold" onClick={handleRefund}>
            {t.booking.return}
          </button>
        </div>
      )}
    </div>
  )
}
