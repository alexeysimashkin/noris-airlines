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
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', timeZone: 'UTC' })
  }

  if (loading) {
    return <div className="card" style={{ textAlign: 'center', padding: 40 }}><p>Загрузка...</p></div>
  }

  if (error) {
    return <div className="card" style={{ textAlign: 'center', padding: 40 }}><p style={{ color: 'red' }}>{error}</p></div>
  )

  return (
    <div>
      <h1 className="card-title">👤 Личный кабинет</h1>
      <p style={{ color: '#6b5b8a', marginBottom: 20 }}>Добро пожаловать, {user?.firstName}!</p>
      <p style={{ fontSize: 13, color: '#999', marginBottom: 20 }}>Email: {user?.email}</p>

      <div style={{ marginBottom: 30, display: 'flex', gap: 10 }}>
        <button className="btn btn-outline btn-sm" onClick={() => { localStorage.removeItem('user'); router.push('/login') }}>🚪 Выйти</button>
        <button className="btn btn-primary btn-sm" onClick={() => router.push('/')}>🔍 Найти рейсы</button>
      </div>

      <h3>📋 Бронирования ({bookings.length})</h3>

      {bookings.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 30, marginTop: 15 }}>
          <p style={{ color: '#999' }}>У вас пока нет бронирований</p>
        </div>
      ) : (
        bookings.map(b => (
          <div key={b.id} className="flight-card" style={{ marginTop: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 15 }}>
              <div>
                <div style={{ fontSize: 12, color: '#999' }}>Код: <strong>{b.bookingCode}</strong></div>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#6b3fa0', marginTop: 5 }}>
                  {b.flight?.fromAirport?.city} → {b.flight?.toAirport?.city}
                </div>
                <div style={{ fontSize: 14, color: '#666', marginTop: 5 }}>
                  {b.flight?.departureTime && formatDate(b.flight.departureTime)} • {b.flight?.departureTime && formatTime(b.flight.departureTime)}
                </div>
                <div style={{ fontSize: 13, color: '#999' }}>✈ {b.flight?.flightNumber} • 💰 {b.tariff?.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#6b3fa0' }}>{b.totalPrice?.toLocaleString()} ₽</div>
                <button className="btn btn-sm btn-outline" style={{ marginTop: 8 }} onClick={() => router.push(`/booking-detail?id=${b.id}`)}>🔍 Подробнее</button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
