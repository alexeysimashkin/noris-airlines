import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Cabinet() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) {
      router.push('/login')
      return
    }

    const userData = JSON.parse(stored)
    setUser(userData)

    fetch(`/api/bookings/my?email=${encodeURIComponent(userData.email)}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBookings(data)
        } else if (data.error) {
          setError(data.error)
        } else {
          setBookings([])
        }
        setLoading(false)
      })
      .catch(e => {
        setError(e.message)
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

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 40 }}>
        <p style={{ fontSize: 18, color: '#6b5b8a' }}>Загрузка бронирований...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 40 }}>
        <p style={{ color: 'red' }}>Ошибка: {error}</p>
        <button className="btn btn-outline" onClick={() => router.push('/')}>На главную</button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="card-title">👤 Личный кабинет</h1>
      <p style={{ color: '#6b5b8a', marginBottom: 20 }}>
        Добро пожаловать, {user?.firstName}!
      </p>

      <div style={{ marginBottom: 30, display: 'flex', gap: 10 }}>
        <button className="btn btn-outline btn-sm" onClick={() => {
          localStorage.removeItem('user')
          router.push('/login')
        }}>🚪 Выйти</button>
        <button className="btn btn-primary btn-sm" onClick={() => router.push('/')}>🔍 Найти рейсы</button>
      </div>

      <h3 style={{ marginBottom: 15 }}>📋 Мои бронирования ({bookings.length})</h3>

      {bookings.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 30 }}>
          <p style={{ color: '#999', marginBottom: 15 }}>У вас пока нет бронирований.</p>
          <button className="btn btn-primary" onClick={() => router.push('/')}>🔍 Найти и забронировать рейс</button>
        </div>
      ) : (
        bookings.map(booking => (
          <div key={booking.id} className="flight-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 15, alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 12, color: '#999', marginBottom: 5 }}>
                  Код: <strong>{booking.bookingCode}</strong> • {new Date(booking.createdAt).toLocaleDateString('ru-RU')}
                </div>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#6b3fa0' }}>
                  {booking.flight?.fromAirport?.city} → {booking.flight?.toAirport?.city}
                </div>
                <div style={{ fontSize: 14, color: '#666', marginTop: 5 }}>
                  {booking.flight?.departureTime && formatDate(booking.flight.departureTime)}
                  {' • '}
                  {booking.flight?.departureTime && formatTime(booking.flight.departureTime)}
                </div>
                <div style={{ fontSize: 13, color: '#999', marginTop: 3 }}>
                  ✈ {booking.flight?.flightNumber} • 💰 {booking.tariff?.name}
                </div>
                {booking.seats?.length > 0 && (
                  <div style={{ fontSize: 13, color: '#666', marginTop: 3 }}>
                    💺 Место: {booking.seats.map((s: any) => s.seatNumber).join(', ')}
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600, marginBottom: 8,
                  background: booking.status === 'confirmed' ? '#f0fdf4' : '#fef2f2',
                  color: booking.status === 'confirmed' ? '#166534' : '#991b1b'
                }}>
                  {booking.status === 'confirmed' ? '✅ Активно' : '↩ Возврат'}
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#6b3fa0' }}>
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
