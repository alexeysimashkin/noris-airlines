import { useState, useEffect } from 'react'

interface Airport {
  id: number
  iata: string
  name: string
  city: string
  country: string
}

interface Flight {
  id: number
  flightNumber: string
  fromAirport: Airport
  toAirport: Airport
  aircraft: { type: string }
  departureTime: string
  arrivalTime: string
  startDate: string
  endDate: string
  daysOfWeek: string
}

export default function AdminPanel() {
  const [airports, setAirports] = useState<Airport[]>([])
  const [flights, setFlights] = useState<Flight[]>([])
  const [activeTab, setActiveTab] = useState<'airports' | 'flights'>('airports')
  const [message, setMessage] = useState('')

  const [airportForm, setAirportForm] = useState({ iata: '', name: '', city: '', country: 'Россия' })

  const [flightForm, setFlightForm] = useState({
    flightNumber: '',
    fromAirportId: 0,
    toAirportId: 0,
    departureTime: '',
    arrivalTime: '',
    startDate: '',
    endDate: '',
    daysOfWeek: '1,2,3,4,5,6,7',
    tariffLight: 4500,
    tariffStandard: 6500,
    tariffBusinessValue: 12500,
    tariffBusinessEasy: 15000
  })

  useEffect(() => {
    fetchAirports()
    fetchFlights()
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

  const addAirport = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/admin/airports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(airportForm)
    })
    const data = await res.json()
    setMessage(data.success ? '✅ Аэропорт добавлен!' : '❌ ' + (data.message || 'Ошибка'))
    if (data.success) {
      setAirportForm({ iata: '', name: '', city: '', country: 'Россия' })
      fetchAirports()
    }
  }

  const deleteAirport = async (id: number) => {
    if (!confirm('Удалить?')) return
    await fetch(`/api/admin/airports?id=${id}`, { method: 'DELETE' })
    fetchAirports()
  }

  const addFlight = async (e: React.FormEvent) => {
    e.preventDefault()
    if (flightForm.fromAirportId === 0 || flightForm.toAirportId === 0) {
      setMessage('❌ Выберите аэропорты')
      return
    }
    const res = await fetch('/api/admin/flights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(flightForm)
    })
    const data = await res.json()
    setMessage(data.id ? '✅ Рейс добавлен!' : '❌ ' + (data.error || 'Ошибка'))
    if (data.id) {
      setFlightForm({
        flightNumber: '', fromAirportId: 0, toAirportId: 0,
        departureTime: '', arrivalTime: '', startDate: '', endDate: '',
        daysOfWeek: '1,2,3,4,5,6,7',
        tariffLight: 4500, tariffStandard: 6500, tariffBusinessValue: 12500, tariffBusinessEasy: 15000
      })
      fetchFlights()
    }
  }

  const deleteFlight = async (id: number) => {
    if (!confirm('Удалить рейс?')) return
    await fetch(`/api/flights/${id}`, { method: 'DELETE' })
    fetchFlights()
  }

  return (
    <div>
      <h1 className="card-title">🛫 Админ-панель</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button className={`btn ${activeTab === 'airports' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('airports')}>🏢 Аэропорты ({airports.length})</button>
        <button className={`btn ${activeTab === 'flights' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('flights')}>✈ Рейсы ({flights.length})</button>
      </div>

      {message && (
        <div style={{ padding: '12px', borderRadius: '10px', marginBottom: '15px',
          background: message.includes('✅') ? '#f0fdf4' : '#fef2f2',
          color: message.includes('✅') ? '#166534' : '#991b1b', fontWeight: 600 }}>
          {message}
        </div>
      )}

      {activeTab === 'airports' && (
        <div className="card">
          <h3>➕ Добавить аэропорт</h3>
          <form onSubmit={addAirport} style={{ display: 'grid', gap: '15px', margin: '20px 0' }}>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">IATA-код *</label>
                <input type="text" className="form-input" placeholder="SVO" maxLength={3}
                  value={airportForm.iata} onChange={e => setAirportForm({...airportForm, iata: e.target.value.toUpperCase()})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Название *</label>
                <input type="text" className="form-input" placeholder="Шереметьево"
                  value={airportForm.name} onChange={e => setAirportForm({...airportForm, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Город *</label>
                <input type="text" className="form-input" placeholder="Москва"
                  value={airportForm.city} onChange={e => setAirportForm({...airportForm, city: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Страна</label>
                <select className="form-select" value={airportForm.country}
                  onChange={e => setAirportForm({...airportForm, country: e.target.value})}>
                  <option>Россия</option><option>Турция</option><option>ОАЭ</option><option>Египет</option>
                  <option>Узбекистан</option><option>Грузия</option><option>Армения</option><option>Таджикистан</option>
                  <option>Киргизия</option><option>Беларусь</option><option>Китай</option><option>Вьетнам</option><option>Таиланд</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">➕ Добавить</button>
          </form>

          <h3 style={{ marginTop: '20px' }}>📋 Аэропорты ({airports.length})</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
            {airports.map(a => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 14px', background: '#f5f3ff', borderRadius: '20px', fontSize: '13px', border: '1px solid #e8e0f0' }}>
                <strong>{a.iata}</strong> — {a.city} ({a.name})
                <button onClick={() => deleteAirport(a.id)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'red', fontSize: '16px' }}>×</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'flights' && (
        <>
          <div className="card">
            <h3>➕ Добавить рейс</h3>
            <form onSubmit={addFlight} style={{ display: 'grid', gap: '15px', margin: '20px 0' }}>
              <div className="form-group">
                <label className="form-label">Номер рейса *</label>
                <input type="text" className="form-input" placeholder="NR102"
                  value={flightForm.flightNumber} onChange={e => setFlightForm({...flightForm, flightNumber: e.target.value})} required />
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Вылет *</label>
                  <select className="form-select" value={flightForm.fromAirportId}
                    onChange={e => setFlightForm({...flightForm, fromAirportId: Number(e.target.value)})} required>
                    <option value={0}>Выберите...</option>
                    {airports.map(a => <option key={a.id} value={a.id}>{a.iata} — {a.city}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Прилёт *</label>
                  <select className="form-select" value={flightForm.toAirportId}
                    onChange={e => setFlightForm({...flightForm, toAirportId: Number(e.target.value)})} required>
                    <option value={0}>Выберите...</option>
                    {airports.map(a => <option key={a.id} value={a.id}>{a.iata} — {a.city}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Дата и время вылета *</label>
                  <input type="datetime-local" className="form-input"
                    value={flightForm.departureTime} onChange={e => setFlightForm({...flightForm, departureTime: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Дата и время прилёта *</label>
                  <input type="datetime-local" className="form-input"
                    value={flightForm.arrivalTime} onChange={e => setFlightForm({...flightForm, arrivalTime: e.target.value})} required />
                </div>
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Период с *</label>
                  <input type="date" className="form-input"
                    value={flightForm.startDate} onChange={e => setFlightForm({...flightForm, startDate: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Период по *</label>
                  <input type="date" className="form-input"
                    value={flightForm.endDate} onChange={e => setFlightForm({...flightForm, endDate: e.target.value})} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Дни недели (1-пн...7-вс)</label>
                <input type="text" className="form-input" placeholder="1,2,3,4,5,6,7"
                  value={flightForm.daysOfWeek} onChange={e => setFlightForm({...flightForm, daysOfWeek: e.target.value})} />
              </div>

              <hr style={{ borderColor: '#e8e0f0' }} />
              <h4 style={{ color: '#6b3fa0' }}>💰 Тарифы (₽)</h4>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Лайт (эконом)</label>
                  <input type="number" className="form-input"
                    value={flightForm.tariffLight} onChange={e => setFlightForm({...flightForm, tariffLight: Number(e.target.value)})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Стандарт (эконом)</label>
                  <input type="number" className="form-input"
                    value={flightForm.tariffStandard} onChange={e => setFlightForm({...flightForm, tariffStandard: Number(e.target.value)})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Бизнес Выгодно</label>
                  <input type="number" className="form-input"
                    value={flightForm.tariffBusinessValue} onChange={e => setFlightForm({...flightForm, tariffBusinessValue: Number(e.target.value)})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Бизнес Легко</label>
                  <input type="number" className="form-input"
                    value={flightForm.tariffBusinessEasy} onChange={e => setFlightForm({...flightForm, tariffBusinessEasy: Number(e.target.value)})} />
                </div>
              </div>

              <button type="submit" className="btn btn-primary">➕ Добавить рейс с тарифами</button>
            </form>
          </div>

          <div className="card">
            <h3>📋 Рейсы ({flights.length})</h3>
            {flights.length === 0 ? <p style={{ color: '#999' }}>Нет рейсов</p> : (
              <table className="admin-table">
                <thead><tr><th>Рейс</th><th>Маршрут</th><th>Вылет</th><th>Период</th><th>×</th></tr></thead>
                <tbody>
                  {flights.map(f => (
                    <tr key={f.id}>
                      <td>{f.flightNumber}</td>
                      <td>{f.fromAirport?.city} → {f.toAirport?.city}</td>
                      <td>{new Date(f.departureTime).toLocaleString('ru-RU')}</td>
                      <td>{new Date(f.startDate).toLocaleDateString()} — {new Date(f.endDate).toLocaleDateString()}</td>
                      <td><button className="btn btn-sm btn-outline" style={{ color: 'red', borderColor: 'red' }}
                        onClick={() => deleteFlight(f.id)}>🗑️</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  )
}
