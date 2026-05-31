import { useState, useEffect } from 'react'

interface Airport {
  id: number; iata: string; name: string; city: string; country: string
}
interface Flight {
  id: number; flightNumber: string; fromAirport: Airport; toAirport: Airport
  aircraft: { type: string }; departureTime: string; arrivalTime: string
  startDate: string; endDate: string; daysOfWeek: string
  tariffs?: any[]
}
interface Meal {
  id: number; name: string; description: string; price: number
}

export default function AdminPanel() {
  const [airports, setAirports] = useState<Airport[]>([])
  const [flights, setFlights] = useState<Flight[]>([])
  const [meals, setMeals] = useState<Meal[]>([])
  const [activeTab, setActiveTab] = useState<'airports' | 'flights' | 'meals'>('airports')
  const [message, setMessage] = useState('')
  const [editingFlightId, setEditingFlightId] = useState<number | null>(null)

  const [airportForm, setAirportForm] = useState({ iata: '', name: '', city: '', country: 'Россия' })
  const [flightForm, setFlightForm] = useState({
    flightNumber: '', fromAirportId: 0, toAirportId: 0,
    departureTime: '', arrivalTime: '', startDate: '', endDate: '',
    daysOfWeek: '1,2,3,4,5,6,7',
    tariffLight: 4500, tariffStandard: 6500, tariffBusinessValue: 12500, tariffBusinessEasy: 15000
  })
  const [mealForm, setMealForm] = useState({ name: '', description: '', price: 800 })

  useEffect(() => {
    fetchAirports(); fetchFlights(); fetchMeals()
  }, [])

  const fetchAirports = async () => {
    const res = await fetch('/api/admin/airports')
    const data = await res.json()
    if (Array.isArray(data)) setAirports(data)
  }
  const fetchFlights = async () => {
    const res = await fetch('/api/admin/flights')
    const data = await res.json()
    if (Array.isArray(data)) setFlights(data)
  }
  const fetchMeals = async () => {
    const res = await fetch('/api/admin/meals')
    const data = await res.json()
    if (Array.isArray(data)) setMeals(data)
  }

  const resetFlightForm = () => {
    setFlightForm({
      flightNumber: '', fromAirportId: 0, toAirportId: 0,
      departureTime: '', arrivalTime: '', startDate: '', endDate: '',
      daysOfWeek: '1,2,3,4,5,6,7',
      tariffLight: 4500, tariffStandard: 6500, tariffBusinessValue: 12500, tariffBusinessEasy: 15000
    })
    setEditingFlightId(null)
  }

  const handleEditFlight = (flight: Flight) => {
    const fromAp = airports.find(a => a.iata === flight.fromAirport?.iata)
    const toAp = airports.find(a => a.iata === flight.toAirport?.iata)
    const lightTariff = flight.tariffs?.find(t => t.name === 'Лайт')
    const standardTariff = flight.tariffs?.find(t => t.name === 'Стандарт')
    const bizValueTariff = flight.tariffs?.find(t => t.name === 'Бизнес Выгодно')
    const bizEasyTariff = flight.tariffs?.find(t => t.name === 'Бизнес Легко')

    setFlightForm({
      flightNumber: flight.flightNumber,
      fromAirportId: fromAp?.id || 0,
      toAirportId: toAp?.id || 0,
      departureTime: flight.departureTime.slice(0, 16),
      arrivalTime: flight.arrivalTime.slice(0, 16),
      startDate: flight.startDate.slice(0, 10),
      endDate: flight.endDate.slice(0, 10),
      daysOfWeek: flight.daysOfWeek,
      tariffLight: lightTariff?.price || 4500,
      tariffStandard: standardTariff?.price || 6500,
      tariffBusinessValue: bizValueTariff?.price || 12500,
      tariffBusinessEasy: bizEasyTariff?.price || 15000
    })
    setEditingFlightId(flight.id)
    setActiveTab('flights')
  }

  const addAirport = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/admin/airports', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(airportForm) })
    const data = await res.json()
    setMessage(data.success ? '✅ Аэропорт добавлен!' : '❌ ' + (data.message || 'Ошибка'))
    if (data.success) { setAirportForm({ iata: '', name: '', city: '', country: 'Россия' }); fetchAirports() }
  }
  const deleteAirport = async (id: number) => {
    if (!confirm('Удалить?')) return
    await fetch(`/api/admin/airports?id=${id}`, { method: 'DELETE' })
    fetchAirports()
  }

  const handleFlightSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (flightForm.fromAirportId === 0 || flightForm.toAirportId === 0) { setMessage('❌ Выберите аэропорты'); return }

    const url = editingFlightId ? `/api/admin/flights/${editingFlightId}` : '/api/admin/flights'
    const method = editingFlightId ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(flightForm)
    })
    const data = await res.json()
    setMessage(data.id ? `✅ Рейс ${editingFlightId ? 'обновлён' : 'добавлен'}!` : '❌ ' + (data.error || 'Ошибка'))
    if (data.id) {
      resetFlightForm()
      fetchFlights()
    }
  }
  const deleteFlight = async (id: number) => {
    if (!confirm('Удалить рейс?')) return
    await fetch(`/api/flights/${id}`, { method: 'DELETE' })
    fetchFlights()
  }

  const addMeal = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/admin/meals', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(mealForm) })
    const data = await res.json()
    setMessage(data.id ? '✅ Питание добавлено!' : '❌ Ошибка')
    if (data.id) { setMealForm({ name: '', description: '', price: 800 }); fetchMeals() }
  }
  const deleteMeal = async (id: number) => {
    await fetch(`/api/admin/meals?id=${id}`, { method: 'DELETE' })
    fetchMeals()
  }

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
  }

  return (
    <div>
      <h1 className="card-title">🛫 Админ-панель</h1>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button className={`btn ${activeTab === 'airports' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('airports')}>🏢 Аэропорты ({airports.length})</button>
        <button className={`btn ${activeTab === 'flights' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('flights')}>✈ Рейсы ({flights.length})</button>
        <button className={`btn ${activeTab === 'meals' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('meals')}>🍽️ Питание ({meals.length})</button>
      </div>

      {message && (
        <div style={{ padding: '12px', borderRadius: '10px', marginBottom: '15px', background: message.includes('✅') ? '#f0fdf4' : '#fef2f2', color: message.includes('✅') ? '#166534' : '#991b1b', fontWeight: 600 }}>{message}</div>
      )}

      {activeTab === 'airports' && (
        <div className="card">
          <h3>➕ Аэропорт</h3>
          <form onSubmit={addAirport} style={{ display: 'grid', gap: '15px' }}>
            <div className="grid grid-2">
              <div className="form-group"><label className="form-label">IATA</label><input type="text" className="form-input" maxLength={3} value={airportForm.iata} onChange={e => setAirportForm({...airportForm, iata: e.target.value.toUpperCase()})} required /></div>
              <div className="form-group"><label className="form-label">Название</label><input type="text" className="form-input" value={airportForm.name} onChange={e => setAirportForm({...airportForm, name: e.target.value})} required /></div>
              <div className="form-group"><label className="form-label">Город</label><input type="text" className="form-input" value={airportForm.city} onChange={e => setAirportForm({...airportForm, city: e.target.value})} required /></div>
              <div className="form-group"><label className="form-label">Страна</label><select className="form-select" value={airportForm.country} onChange={e => setAirportForm({...airportForm, country: e.target.value})}><option>Россия</option><option>Турция</option><option>ОАЭ</option><option>Египет</option><option>Узбекистан</option><option>Грузия</option><option>Армения</option><option>Таджикистан</option><option>Киргизия</option><option>Беларусь</option><option>Китай</option><option>Вьетнам</option><option>Таиланд</option></select></div>
            </div>
            <button type="submit" className="btn btn-primary">➕ Добавить</button>
          </form>
          <h3 style={{ marginTop: 20 }}>📋 Аэропорты ({airports.length})</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
            {airports.map(a => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: '#f5f3ff', borderRadius: 20, fontSize: 13, border: '1px solid #e8e0f0' }}>
                <strong>{a.iata}</strong> — {a.city} ({a.name})
                <button onClick={() => deleteAirport(a.id)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'red', fontSize: 16 }}>×</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'flights' && (
        <div className="card">
          <h3>{editingFlightId ? '✏️ Редактировать рейс' : '➕ Добавить рейс'}</h3>
          <form onSubmit={handleFlightSubmit} style={{ display: 'grid', gap: 15 }}>
            <div className="form-group"><label className="form-label">Номер рейса</label><input type="text" className="form-input" value={flightForm.flightNumber} onChange={e => setFlightForm({...flightForm, flightNumber: e.target.value})} required /></div>
            <div className="grid grid-2">
              <div className="form-group"><label className="form-label">Вылет</label><select className="form-select" value={flightForm.fromAirportId} onChange={e => setFlightForm({...flightForm, fromAirportId: Number(e.target.value)})} required><option value={0}>Выберите...</option>{airports.map(a => <option key={a.id} value={a.id}>{a.iata} — {a.city}</option>)}</select></div>
              <div className="form-group"><label className="form-label">Прилёт</label><select className="form-select" value={flightForm.toAirportId} onChange={e => setFlightForm({...flightForm, toAirportId: Number(e.target.value)})} required><option value={0}>Выберите...</option>{airports.map(a => <option key={a.id} value={a.id}>{a.iata} — {a.city}</option>)}</select></div>
            </div>
            <div className="grid grid-2">
              <div className="form-group"><label className="form-label">Дата/время вылета</label><input type="datetime-local" className="form-input" value={flightForm.departureTime} onChange={e => setFlightForm({...flightForm, departureTime: e.target.value})} required /></div>
              <div className="form-group"><label className="form-label">Дата/время прилёта</label><input type="datetime-local" className="form-input" value={flightForm.arrivalTime} onChange={e => setFlightForm({...flightForm, arrivalTime: e.target.value})} required /></div>
            </div>
            <div className="grid grid-2">
              <div className="form-group"><label className="form-label">Период с</label><input type="date" className="form-input" value={flightForm.startDate} onChange={e => setFlightForm({...flightForm, startDate: e.target.value})} required /></div>
              <div className="form-group"><label className="form-label">Период по</label><input type="date" className="form-input" value={flightForm.endDate} onChange={e => setFlightForm({...flightForm, endDate: e.target.value})} required /></div>
            </div>
            <div className="form-group"><label className="form-label">Дни недели (1-пн...7-вс)</label><input type="text" className="form-input" value={flightForm.daysOfWeek} onChange={e => setFlightForm({...flightForm, daysOfWeek: e.target.value})} /></div>
            <hr /><h4>💰 Тарифы (₽)</h4>
            <div className="grid grid-2">
              <div className="form-group"><label className="form-label">Лайт</label><input type="number" className="form-input" value={flightForm.tariffLight} onChange={e => setFlightForm({...flightForm, tariffLight: Number(e.target.value)})} /></div>
              <div className="form-group"><label className="form-label">Стандарт</label><input type="number" className="form-input" value={flightForm.tariffStandard} onChange={e => setFlightForm({...flightForm, tariffStandard: Number(e.target.value)})} /></div>
              <div className="form-group"><label className="form-label">Бизнес Выгодно</label><input type="number" className="form-input" value={flightForm.tariffBusinessValue} onChange={e => setFlightForm({...flightForm, tariffBusinessValue: Number(e.target.value)})} /></div>
              <div className="form-group"><label className="form-label">Бизнес Легко</label><input type="number" className="form-input" value={flightForm.tariffBusinessEasy} onChange={e => setFlightForm({...flightForm, tariffBusinessEasy: Number(e.target.value)})} /></div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn btn-primary">{editingFlightId ? '💾 Сохранить изменения' : '➕ Добавить рейс'}</button>
              {editingFlightId && <button type="button" className="btn btn-outline" onClick={resetFlightForm}>Отмена</button>}
            </div>
          </form>

          <h3 style={{ marginTop: 30 }}>📋 Рейсы ({flights.length})</h3>
          {flights.length === 0 ? <p style={{ color: '#999' }}>Нет рейсов</p> : (
            <table className="admin-table"><thead><tr><th>Рейс</th><th>Маршрут</th><th>Вылет</th><th>Действия</th></tr></thead><tbody>{flights.map(f => (
              <tr key={f.id}><td>{f.flightNumber}</td><td>{f.fromAirport?.city} → {f.toAirport?.city}</td><td>{formatTime(f.departureTime)}</td><td style={{ display: 'flex', gap: 5 }}>
                <button className="btn btn-sm btn-outline" onClick={() => handleEditFlight(f)}>✏️</button>
                <button className="btn btn-sm btn-outline" style={{ color: 'red', borderColor: 'red' }} onClick={() => deleteFlight(f.id)}>🗑️</button>
              </td></tr>
            ))}</tbody></table>
          )}
        </div>
      )}

      {activeTab === 'meals' && (
        <div className="card">
          <h3>🍽️ Добавить питание</h3>
          <form onSubmit={addMeal} style={{ display: 'grid', gap: 15 }}>
            <div className="grid grid-2">
              <div className="form-group"><label className="form-label">Название</label><input type="text" className="form-input" value={mealForm.name} onChange={e => setMealForm({...mealForm, name: e.target.value})} required /></div>
              <div className="form-group"><label className="form-label">Цена (₽)</label><input type="number" className="form-input" value={mealForm.price} onChange={e => setMealForm({...mealForm, price: Number(e.target.value)})} /></div>
            </div>
            <div className="form-group"><label className="form-label">Описание</label><input type="text" className="form-input" value={mealForm.description} onChange={e => setMealForm({...mealForm, description: e.target.value})} /></div>
            <button type="submit" className="btn btn-primary">➕ Добавить</button>
          </form>
          <h3 style={{ marginTop: 20 }}>📋 Питание ({meals.length})</h3>
          {meals.length === 0 ? <p style={{ color: '#999' }}>Нет питания</p> : (
            <table className="admin-table"><thead><tr><th>Название</th><th>Описание</th><th>Цена</th><th>×</th></tr></thead><tbody>{meals.map(m => (
              <tr key={m.id}><td>{m.name}</td><td>{m.description}</td><td>{m.price} ₽</td><td><button className="btn btn-sm btn-outline" style={{ color: 'red', borderColor: 'red' }} onClick={() => deleteMeal(m.id)}>🗑️</button></td></tr>
            ))}</tbody></table>
          )}
        </div>
      )}
    </div>
  )
}
