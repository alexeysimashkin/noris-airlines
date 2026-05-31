import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Cabinet() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) {
      router.push('/login')
      return
    }

    const userData = JSON.parse(stored)
    setUser(userData)

    fetch(`/api/bookings/my?email=${userData.email}`)
      .then(res => res.json())
      .then(data => {
        setBookings(Array.isArray(data) ? data : [])
        setLoading(false)
      })
  }, [])

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
  }

  if (loading) return <div className="card"><p>Загрузка...</p></div>

  return (
    <div>
      <h1 className="card-title">👤 Личный кабинет</h1>
      <p style={{ color: '#6b5b8a', marginBottom: 20 }}>
        Добро пожаловать, {user?.firstName}!
      </p>

      <div style={{ marginBottom: 30 }}>
        <button className="btn btn-outline btn-sm" onClick={() => {
          localStorage.removeItem('user')
          router.push('/login')
        }}>🚪 Выйти</button>
      </div>

      <h3 style={{ marginBottom: 15 }}>📋 Мои бронирования ({bookings.length})</h3>

      {bookings.length === 0 ? (
        <div className="card">
          <p style={{ color: '#999' }}>У вас пока нет бронирований.</p>
          <button className="btn btn-primary" onClick={() => router.push('/')}>🔍 Найти рейсы</button>
        </div>
      ) : (
        bookings.map(booking => (
          <div key={booking.id} className="flight-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 15 }}>
              <div>
                <div style={{ fontSize: 12, color: '#999' }}>Код: <strong>{booking.bookingCode}</strong></div>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#6b3fa0', marginTop: 5 }}>
                  {booking.flight.fromAirport?.city} → {booking.flight.toAirport?.city}
                </div>
                <div style={{ fontSize: 14, color: '#666', marginTop: 5 }}>
                  {formatDate(booking.flight.departureTime)} • {formatTime(booking.flight.departureTime)}
                </div>
                <div style={{ fontSize: 13, color: '#999', marginTop: 3 }}>
                  Рейс {booking.flight.flightNumber} • {booking.tariff.name}
                </div>

                {booking.returnFlight && (
                  <div style={{ marginTop: 8, padding: 8, background: '#f5f3ff', borderRadius: 8, fontSize: 13 }}>
                    🔙 Обратно: {booking.returnFlight.fromAirport?.city} → {booking.returnFlight.toAirport?.city}
                    <br />{formatDate(booking.returnFlight.departureTime)} • {formatTime(booking.returnFlight.departureTime)}
                  </div>
                )}
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{
                  padding: '6px 12px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  display: 'inline-block',
                  background: booking.status === 'confirmed' ? '#f0fdf4' : booking.status === 'refunded' ? '#fef2f2' : '#fff7ed',
                  color: booking.status === 'confirmed' ? '#166534' : booking.status === 'refunded' ? '#991b1b' : '#c2410c'
                }}>
                  {booking.status === 'confirmed' ? '✅ Активно' : booking.status === 'refunded' ? '↩ Возврат' : booking.status}
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#6b3fa0', marginTop: 10 }}>
                  {booking.totalPrice?.toLocaleString()} ₽
                </div>
                <button className="btn btn-sm btn-outline" style={{ marginTop: 10 }}
                  onClick={() => router.push(`/booking-detail?id=${booking.id}`)}>
                  🔍 Подробнее
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
