import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

export default function BookingDetail() {
  const router = useRouter()
  const { id } = router.query
  const [booking, setBooking] = useState<any>(null)
  const [refundAmount, setRefundAmount] = useState(0)

  useEffect(() => {
    if (!id) return
    fetch(`/api/bookings/${id}`)
      .then(res => res.json())
      .then(data => {
        setBooking(data)
        if (data) {
          const hoursUntilFlight = (new Date(data.flight.departureTime).getTime() - Date.now()) / 3600000
          setRefundAmount(hoursUntilFlight > 24 ? data.totalPrice : data.totalPrice * 0.5)
        }
      })
  }, [id])

  const handleRefund = async () => {
    if (!confirm(`Оформить возврат на сумму ${refundAmount.toLocaleString()} ₽?`)) return
    await fetch(`/api/bookings/${id}/refund`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refundAmount })
    })
    alert('Возврат оформлен')
    router.push('/cabinet')
  }

  if (!booking) return <div className="card"><p>Загрузка...</p></div>

  return (
    <div className="card">
      <h2 className="card-title">📋 Бронирование {booking.bookingCode}</h2>

      <div style={{ display: 'grid', gap: 12 }}>
        <div style={{ padding: 12, background: '#f8f9fa', borderRadius: 10 }}>
          <strong>🛫 Рейс:</strong> {booking.flight.flightNumber}
          <br />{booking.flight.fromAirport?.city} → {booking.flight.toAirport?.city}
          <br />{new Date(booking.flight.departureTime).toLocaleString('ru-RU', { timeZone: 'UTC' })}
        </div>

        {booking.returnFlight && (
          <div style={{ padding: 12, background: '#f5f3ff', borderRadius: 10 }}>
            <strong>🔙 Обратный рейс:</strong> {booking.returnFlight.flightNumber}
            <br />{booking.returnFlight.fromAirport?.city} → {booking.returnFlight.toAirport?.city}
            <br />{new Date(booking.returnFlight.departureTime).toLocaleString('ru-RU', { timeZone: 'UTC' })}
          </div>
        )}

        <div style={{ padding: 12, background: '#f8f9fa', borderRadius: 10 }}>
          <strong>💰 Тариф:</strong> {booking.tariff.name} • {booking.totalPrice?.toLocaleString()} ₽
        </div>

        {booking.seats?.length > 0 && (
          <div style={{ padding: 12, background: '#f8f9fa', borderRadius: 10 }}>
            <strong>💺 Места:</strong> {booking.seats.map((s: any) => s.seatNumber).join(', ')}
          </div>
        )}

        <div style={{ padding: 12, background: '#f8f9fa', borderRadius: 10 }}>
          <strong>👥 Пассажиры:</strong>
          {booking.passengers?.map((bp: any, i: number) => (
            <div key={i}>{bp.passenger.lastName} {bp.passenger.firstName}</div>
          ))}
        </div>

        {booking.status === 'confirmed' && (
          <div style={{ display: 'flex', gap: 10, marginTop: 15 }}>
            <button className="btn btn-primary" onClick={() => router.push(`/check-in?code=${booking.bookingCode}`)}>
              🎫 Онлайн-регистрация
            </button>
            <button className="btn btn-outline" onClick={handleRefund}
              style={{ color: 'red', borderColor: 'red' }}>
              ↩ Оформить возврат ({refundAmount.toLocaleString()} ₽)
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
