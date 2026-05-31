import { useState, useEffect } from 'react'

interface Airport { id: number; iata: string; name: string; city: string; country: string }
interface Flight { id: number; flightNumber: string; fromAirport: Airport; toAirport: Airport; aircraft: { type: string }; departureTime: string; arrivalTime: string; startDate: string; endDate: string; daysOfWeek: string; tariffs?: any[] }
interface Meal { id: number; name: string; description: string; price: number }
interface Booking { id: number; bookingCode: string; flight: { flightNumber: string; fromAirport: { city: string }; toAirport: { city: string } }; tariff: { name: string }; totalPrice: number; status: string; createdAt: string; passengers: any[] }

export default function AdminPanel() {
  const [airports, setAirports] = useState<Airport[]>([])
  const [flights, setFlights] = useState<Flight[]>([])
  const [meals, setMeals] = useState<Meal[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [activeTab, setActiveTab] = useState<'airports' | 'flights' | 'meals' | 'bookings'>('airports')
  const [message, setMessage] = useState('')
  const [editingFlightId, setEditingFlightId] = useState<number | null>(null)

  const [airportForm, setAirportForm] = useState({ iata: '', name: '', city: '', country: 'Россия' })
  const [flightForm, setFlightForm] = useState({ flightNumber: '', fromAirportId: 0, toAirportId: 0, departureTime: '', arrivalTime: '', startDate: '', endDate: '', daysOfWeek: '1,2,3,4,5,6,7', tariffLight: 4500, tariffStandard: 6500, tariffBusinessValue: 12500, tariffBusinessEasy: 15000 })
  const [mealForm, setMealForm] = useState({ name: '', description: '', price: 800 })
  const [bookingForm, setBookingForm] = useState({ flightId: 0, tariffId: 0, email: '', firstName: '', lastName: '', phone: '', seat: '', meal: '', departureDate: '' })

  useEffect(() => { fetchAirports(); fetchFlights(); fetchMeals(); fetchBookings() }, [])

  const fetchAirports = async () => { const res = await fetch('/api/admin/airports'); const data = await res.json(); if (Array.isArray(data)) setAirports(data) }
  const fetchFlights = async () => { const res = await fetch('/api/admin/flights'); const data = await res.json(); if (Array.isArray(data)) setFlights(data) }
  const fetchMeals = async () => { const res = await fetch('/api/admin/meals'); const data = await res.json(); if (Array.isArray(data)) setMeals(data) }
  const fetchBookings = async () => { const res = await fetch('/api/admin/bookings'); const data = await res.json(); if (Array.isArray(data)) setBookings(data) }

  const resetFlightForm = () => { setFlightForm({ flightNumber: '', fromAirportId: 0, toAirportId: 0, departureTime: '', arrivalTime: '', startDate: '', endDate: '', daysOfWeek: '1,2,3,4,5,6,7', tariffLight: 4500, tariffStandard: 6500, tariffBusinessValue: 12500, tariffBusinessEasy: 15000 }); setEditingFlightId(null) }
  const resetBookingForm = () => { setBookingForm({ flightId: 0, tariffId: 0, email: '', firstName: '', lastName: '', phone: '', seat: '', meal: '', departureDate: '' }) }

  const handleEditFlight = (flight: Flight) => {
    const fromAp = airports.find(a => a.iata === flight.fromAirport?.iata)
    const toAp = airports.find(a => a.iata === flight.toAirport?.iata)
    setFlightForm({ flightNumber: flight.flightNumber, fromAirportId: fromAp?.id || 0, toAirportId: toAp?.id || 0, departureTime: flight.departureTime.slice(0, 16), arrivalTime: flight.arrivalTime.slice(0, 16), startDate: flight.startDate.slice(0, 10), endDate: flight.endDate.slice(0, 10), daysOfWeek: flight.daysOfWeek, tariffLight: flight.tariffs?.find((t: any) => t.name === 'Лайт')?.price || 4500, tariffStandard: flight.tariffs?.find((t: any) => t.name === 'Стандарт')?.price || 6500, tariffBusinessValue: flight.tariffs?.find((t: any) => t.name === 'Бизнес Выгодно')?.price || 12500, tariffBusinessEasy: flight.tariffs?.find((t: any) => t.name === 'Бизнес Легко')?.price || 15000 })
    setEditingFlightId(flight.id); setActiveTab('flights')
  }

  const addAirport = async (e: React.FormEvent) => { e.preventDefault(); const res = await fetch('/api/admin/airports', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(airportForm) }); const data = await res.json(); setMessage(data.success ? '✅ Аэропорт добавлен!' : '❌ ' + (data.message || 'Ошибка')); if (data.success) { setAirportForm({ iata: '', name: '', city: '', country: 'Россия' }); fetchAirports() } }
  const deleteAirport = async (id: number) => { if (!confirm('Удалить?')) return; await fetch(`/api/admin/airports?id=${id}`, { method: 'DELETE' }); fetchAirports() }

  const handleFlightSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (flightForm.fromAirportId === 0 || flightForm.toAirportId === 0) { setMessage('❌ Выберите аэропорты'); return }
    const url = editingFlightId ? `/api/admin/flights/${editingFlightId}` : '/api/admin/flights'
    const method = editingFlightId ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(flightForm) })
    const data = await res.json()
    setMessage(data.id ? `✅ Рейс ${editingFlightId ? 'обновлён' : 'добавлен'}!` : '❌ ' + (data.error || 'Ошибка'))
    if (data.id) { resetFlightForm(); fetchFlights() }
  }
  const deleteFlight = async (id: number) => { if (!confirm('Удалить рейс?')) return; await fetch(`/api/flights/${id}`, { method: 'DELETE' }); fetchFlights() }

  const addMeal = async (e: React.FormEvent) => { e.preventDefault(); const res = await fetch('/api/admin/meals', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(mealForm) }); const data = await res.json(); setMessage(data.id ? '✅ Питание добавлено!' : '❌ Ошибка'); if (data.id) { setMealForm({ name: '', description: '', price: 800 }); fetchMeals() } }
  const deleteMeal = async (id: number) => { await fetch(`/api/admin/meals?id=${id}`, { method: 'DELETE' }); fetchMeals() }

  const addBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bookingForm.flightId || !bookingForm.tariffId || !bookingForm.email || !bookingForm.firstName || !bookingForm.lastName) {
      setMessage('❌ Заполните обязательные поля: рейс, тариф, email, имя, фамилия'); return
    }
    const res = await fetch('/api/admin/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(bookingForm) })
    const data = await res.json()
    setMessage(data.id ? `✅ Бронирование создано! Код: ${data.bookingCode}` : '❌ ' + (data.error || data.message || 'Ошибка'))
    if (data.id) { resetBookingForm(); fetchBookings() }
  }

  const formatTime = (dateStr: string) => { const d = new Date(dateStr); return d.toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) }

  return (
    <div>
      <h1 className="card-title">🛫 Админ-панель</h1>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button className={`btn ${activeTab === 'airports' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('airports')}>🏢 Аэропорты ({airports.length})</button>
        <button className={`btn ${activeTab === 'flights' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('flights')}>✈ Рейсы ({flights.length})</button>
        <button className={`btn ${activeTab === 'meals' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('meals')}>🍽️ Питание ({meals.length})</button>
        <button className={`btn ${activeTab === 'bookings' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('bookings')}>📋 Бронирования ({bookings.length})</button>
      </div>

      {message && <div style={{ padding: 12, borderRadius: 10, marginBottom: 15, background: message.includes('✅') ? '#f0fdf4' : '#fef2f2', color: message.includes('✅') ? '#166534' : '#991b1b', fontWeight: 600 }}>{message}</div>}

      {/* АЭРОПОРТЫ */}
      {activeTab === 'airports' && (
        <div className="card">
          <h3>➕ Аэропорт</h3>
          <form onSubmit={addAirport} style={{ display: 'grid', gap: 15 }}>
            <div className="grid grid-2">
              <div className="form-group"><label className="form-label">IATA *</label><input type="text" className="form-input" maxLength={3} value={airportForm.iata} onChange={e => setAirportForm({...airportForm, iata: e.target.value.toUpperCase()})} required /></div>
              <div className="form-group"><label className="form-label">Название *</label><input type="text" className="form-input" value={airportForm.name} onChange={e => setAirportForm({...airportForm, name: e.target.value})} required /></div>
              <div className="form-group"><label className="form-label">Город *</label><input type="text" className="form-input" value={airportForm.city} onChange={e => setAirportForm({...airportForm, city: e.target.value})} required /></div>
              <div className="form-group"><label className="form-label">Страна</label><select className="form-select" value={airportForm.country} onChange={e => setAirportForm({...airportForm, country: e.target.value})}><option>Россия</option><option>Турция</option><option>ОАЭ</option><option>Египет</option><option>Узбекистан</option><option>Грузия</option><option>Армения</option><option>Таджикистан</option><option>Киргизия</option><option>Беларусь</option><option>Китай</option><option>Вьетнам</option><option>Таиланд</option></select></div>
            </div>
            <button type="submit" className="btn btn-primary">➕ Добавить аэропорт</button>
          </form>
          <h3 style={{ marginTop: 20 }}>📋 Все аэропорты ({airports.length})</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
            {airports.map(a => <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: '#f5f3ff', borderRadius: 20, fontSize: 13, border: '1px solid #e8e0f0' }}><strong>{a.iata}</strong> — {a.city} ({a.name})<button onClick={() => deleteAirport(a.id)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'red', fontSize: 16, marginLeft: 4 }}>×</button></div>)}
          </div>
        </div>
      )}

      {/* РЕЙСЫ */}
      {activeTab === 'flights' && (
        <div className="card">
          <h3>{editingFlightId ? '✏️ Редактировать рейс' : '➕ Добавить рейс'}</h3>
          <form onSubmit={handleFlightSubmit} style={{ display: 'grid', gap: 15 }}>
            <div className="form-group"><label className="form-label">Номер рейса *</label><input type="text" className="form-input" value={flightForm.flightNumber} onChange={e => setFlightForm({...flightForm, flightNumber: e.target.value})} required /></div>
            <div className="grid grid-2">
              <div className="form-group"><label className="form-label">Вылет *</label><select className="form-select" value={flightForm.fromAirportId} onChange={e => setFlightForm({...flightForm, fromAirportId: Number(e.target.value)})} required><option value={0}>Выберите...</option>{airports.map(a => <option key={a.id} value={a.id}>{a.iata} — {a.city}</option>)}</select></div>
              <div className="form-group"><label className="form-label">Прилёт *</label><select className="form-select" value={flightForm.toAirportId} onChange={e => setFlightForm({...flightForm, toAirportId: Number(e.target.value)})} required><option value={0}>Выберите...</option>{airports.map(a => <option key={a.id} value={a.id}>{a.iata} — {a.city}</option>)}</select></div>
            </div>
            <div className="grid grid-2">
              <div className="form-group"><label className="form-label">Дата/время вылета *</label><input type="datetime-local" className="form-input" value={flightForm.departureTime} onChange={e => setFlightForm({...flightForm, departureTime: e.target.value})} required /></div>
              <div className="form-group"><label className="form-label">Дата/время прилёта *</label><input type="datetime-local" className="form-input" value={flightForm.arrivalTime} onChange={e => setFlightForm({...flightForm, arrivalTime: e.target.value})} required /></div>
            </div>
            <div className="grid grid-2">
              <div className="form-group"><label className="form-label">Период с *</label><input type="date" className="form-input" value={flightForm.startDate} onChange={e => setFlightForm({...flightForm, startDate: e.target.value})} required /></div>
              <div className="form-group"><label className="form-label">Период по *</label><input type="date" className="form-input" value={flightForm.endDate} onChange={e => setFlightForm({...flightForm, endDate: e.target.value})} required /></div>
            </div>
            <div className="form-group"><label className="form-label">Дни недели (1-пн...7-вс)</label><input type="text" className="form-input" value={flightForm.daysOfWeek} onChange={e => setFlightForm({...flightForm, daysOfWeek: e.target.value})} /></div>
            <hr /><h4 style={{ color: '#6b3fa0' }}>💰 Тарифы (₽)</h4>
            <div className="grid grid-2">
              <div className="form-group"><label className="form-label">Лайт (эконом)</label><input type="number" className="form-input" value={flightForm.tariffLight} onChange={e => setFlightForm({...flightForm, tariffLight: Number(e.target.value)})} /></div>
              <div className="form-group"><label className="form-label">Стандарт (эконом)</label><input type="number" className="form-input" value={flightForm.tariffStandard} onChange={e => setFlightForm({...flightForm, tariffStandard: Number(e.target.value)})} /></div>
              <div className="form-group"><label className="form-label">Бизнес Выгодно</label><input type="number" className="form-input" value={flightForm.tariffBusinessValue} onChange={e => setFlightForm({...flightForm, tariffBusinessValue: Number(e.target.value)})} /></div>
              <div className="form-group"><label className="form-label">Бизнес Легко</label><input type="number" className="form-input" value={flightForm.tariffBusinessEasy} onChange={e => setFlightForm({...flightForm, tariffBusinessEasy: Number(e.target.value)})} /></div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn btn-primary">{editingFlightId ? '💾 Сохранить изменения' : '➕ Добавить рейс'}</button>
              {editingFlightId && <button type="button" className="btn btn-outline" onClick={resetFlightForm}>Отмена</button>}
            </div>
          </form>
          <h3 style={{ marginTop: 30 }}>📋 Все рейсы ({flights.length})</h3>
          {flights.length === 0 ? <p style={{ color: '#999' }}>Нет рейсов</p> : (
            <table className="admin-table"><thead><tr><th>Рейс</th><th>Маршрут</th><th>Вылет</th><th>Действия</th></tr></thead><tbody>{flights.map(f => (
              <tr key={f.id}><td>{f.flightNumber}</td><td>{f.fromAirport?.city} → {f.toAirport?.city}</td><td>{formatTime(f.departureTime)}</td><td style={{ display: 'flex', gap: 5 }}><button className="btn btn-sm btn-outline" onClick={() => handleEditFlight(f)}>✏️</button><button className="btn btn-sm btn-outline" style={{ color: 'red', borderColor: 'red' }} onClick={() => deleteFlight(f.id)}>🗑️</button></td></tr>
            ))}</tbody></table>
          )}
        </div>
      )}

      {/* ПИТАНИЕ */}
      {activeTab === 'meals' && (
        <div className="card">
          <h3>🍽️ Добавить питание</h3>
          <form onSubmit={addMeal} style={{ display: 'grid', gap: 15 }}>
            <div className="grid grid-2">
              <div className="form-group"><label className="form-label">Название *</label><input type="text" className="form-input" value={mealForm.name} onChange={e => setMealForm({...mealForm, name: e.target.value})} required /></div>
              <div className="form-group"><label className="form-label">Цена (₽)</label><input type="number" className="form-input" value={mealForm.price} onChange={e => setMealForm({...mealForm, price: Number(e.target.value)})} /></div>
            </div>
            <div className="form-group"><label className="form-label">Описание</label><input type="text" className="form-input" value={mealForm.description} onChange={e => setMealForm({...mealForm, description: e.target.value})} /></div>
            <button type="submit" className="btn btn-primary">➕ Добавить питание</button>
          </form>
          <h3 style={{ marginTop: 20 }}>📋 Всё питание ({meals.length})</h3>
          {meals.length === 0 ? <p style={{ color: '#999' }}>Нет питания</p> : (
            <table className="admin-table"><thead><tr><th>Название</th><th>Описание</th><th>Цена</th><th>×</th></tr></thead><tbody>{meals.map(m => <tr key={m.id}><td>{m.name}</td><td>{m.description}</td><td>{m.price} ₽</td><td><button className="btn btn-sm btn-outline" style={{ color: 'red', borderColor: 'red' }} onClick={() => deleteMeal(m.id)}>🗑️</button></td></tr>)}</tbody></table>
          )}
        </div>
      )}

      {/* БРОНИРОВАНИЯ */}
      {activeTab === 'bookings' && (
        <div className="card">
          <h3>➕ Создать бронирование для пассажира</h3>
          <form onSubmit={addBooking} style={{ display: 'grid', gap: 15 }}>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Рейс *</label>
                <select className="form-select" value={bookingForm.flightId} onChange={e => { setBookingForm({...bookingForm, flightId: Number(e.target.value), tariffId: 0 }) }} required>
                  <option value={0}>Выберите рейс...</option>
                  {flights.map(f => <option key={f.id} value={f.id}>{f.flightNumber} — {f.fromAirport?.city} → {f.toAirport?.city}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Тариф *</label>
                <select className="form-select" value={bookingForm.tariffId} onChange={e => setBookingForm({...bookingForm, tariffId: Number(e.target.value)})} required>
                  <option value={0}>Выберите тариф...</option>
                  {flights.find(f => f.id === bookingForm.flightId)?.tariffs?.map((t: any) => <option key={t.id} value={t.id}>{t.name} — {t.price?.toLocaleString()} ₽</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Дата вылета</label>
              <input type="date" className="form-input" value={bookingForm.departureDate} onChange={e => setBookingForm({...bookingForm, departureDate: e.target.value})} />
              <small style={{ color: '#999' }}>Оставьте пустым — будет использована дата из рейса</small>
            </div>
            <div className="grid grid-2">
              <div className="form-group"><label className="form-label">Email пассажира *</label><input type="email" className="form-input" value={bookingForm.email} onChange={e => setBookingForm({...bookingForm, email: e.target.value})} required /></div>
              <div className="form-group"><label className="form-label">Телефон</label><input type="tel" className="form-input" value={bookingForm.phone} onChange={e => setBookingForm({...bookingForm, phone: e.target.value})} /></div>
            </div>
            <div className="grid grid-2">
              <div className="form-group"><label className="form-label">Имя *</label><input type="text" className="form-input" value={bookingForm.firstName} onChange={e => setBookingForm({...bookingForm, firstName: e.target.value})} required /></div>
              <div className="form-group"><label className="form-label">Фамилия *</label><input type="text" className="form-input" value={bookingForm.lastName} onChange={e => setBookingForm({...bookingForm, lastName: e.target.value})} required /></div>
            </div>
            <div className="grid grid-2">
              <div className="form-group"><label className="form-label">Место</label><input type="text" className="form-input" placeholder="3A" value={bookingForm.seat} onChange={e => setBookingForm({...bookingForm, seat: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Питание</label><select className="form-select" value={bookingForm.meal} onChange={e => setBookingForm({...bookingForm, meal: e.target.value})}><option value="">Без питания</option>{meals.map(m => <option key={m.id} value={m.id}>{m.name} — {m.price}₽</option>)}</select></div>
            </div>
            <button type="submit" className="btn btn-primary">➕ Создать бронирование</button>
          </form>

          <h3 style={{ marginTop: 30 }}>📋 Все бронирования ({bookings.length})</h3>
          {bookings.length === 0 ? <p style={{ color: '#999' }}>Нет бронирований</p> : (
            <table className="admin-table"><thead><tr><th>Код</th><th>Пассажир</th><th>Рейс</th><th>Тариф</th><th>Сумма</th><th>Статус</th></tr></thead><tbody>{bookings.map(b => (
              <tr key={b.id}><td><strong>{b.bookingCode}</strong></td><td>{b.passengers?.[0]?.passenger?.lastName} {b.passengers?.[0]?.passenger?.firstName}</td><td>{b.flight?.flightNumber} — {b.flight?.fromAirport?.city}→{b.flight?.toAirport?.city}</td><td>{b.tariff?.name}</td><td>{b.totalPrice?.toLocaleString()} ₽</td><td>{b.status === 'confirmed' ? '✅ Активно' : '↩ Возврат'}</td></tr>
            ))}</tbody></table>
          )}
        </div>
      )}
    </div>
  )
}
