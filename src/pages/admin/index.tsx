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
  
  // Форма аэропорта
  const [airportForm, setAirportForm] = useState({ iata: '', name: '', city: '', country: 'Россия' })
  
  // Форма рейса
  const [flightForm, setFlightForm] = useState({
    flightNumber: '',
    fromAirportId: 0,
    toAirportId: 0,
    aircraftId: 1,
    departureTime: '',
    arrivalTime: '',
    durationMin: 90,
    startDate: '',
    endDate: '',
    daysOfWeek: '1,2,3,4,5,6,7'
  })

  useEffect(() => {
    fetchAirports()
    fetchFlights()
  }, [])

  const fetchAirports = async () => {
    try {
      const res = await fetch('/api/admin/airports')
      const data = await res.json()
      if (Array.isArray(data)) setAirports(data)
    } catch (e) {
      console.error('Ошибка загрузки аэропортов:', e)
    }
  }

  const fetchFlights = async () => {
    try {
      const res = await fetch('/api/admin/flights')
      const data = await res.json()
      if (Array.isArray(data)) setFlights(data)
    } catch (e) {
      console.error('Ошибка загрузки рейсов:', e)
    }
  }

  // ДОБАВИТЬ АЭРОПОРТ
  const addAirport = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    
    const res = await fetch('/api/admin/airports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(airportForm)
    })
    
    const data = await res.json()
    if (data.success) {
      setMessage('✅ Аэропорт добавлен!')
      setAirportForm({ iata: '', name: '', city: '', country: 'Россия' })
      fetchAirports()
    } else {
      setMessage('❌ ' + (data.message || 'Ошибка'))
    }
  }

  // УДАЛИТЬ АЭРОПОРТ
  const deleteAirport = async (id: number) => {
    if (!confirm('Удалить аэропорт?')) return
    await fetch(`/api/admin/airports?id=${id}`, { method: 'DELETE' })
    fetchAirports()
  }

  // ДОБАВИТЬ РЕЙС
  const addFlight = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (flightForm.fromAirportId === 0 || flightForm.toAirportId === 0) {
      setMessage('❌ Выберите аэропорты вылета и прилёта')
      return
    }

    const res = await fetch('/api/admin/flights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(flightForm)
    })

    const data = await res.json()
    if (data.id) {
      setMessage('✅ Рейс добавлен!')
      setFlightForm({
        flightNumber: '',
        fromAirportId: 0,
        toAirportId: 0,
        aircraftId: 1,
        departureTime: '',
        arrivalTime: '',
        durationMin: 90,
        startDate: '',
        endDate: '',
        daysOfWeek: '1,2,3,4,5,6,7'
      })
      fetchFlights()
    } else {
      setMessage('❌ ' + (data.message || data.error || 'Ошибка'))
    }
  }

  // УДАЛИТЬ РЕЙС
  const deleteFlight = async (id: number) => {
    if (!confirm('Удалить рейс?')) return
    await fetch(`/api/flights/${id}`, { method: 'DELETE' })
    fetchFlights()
  }

  return (
    <div>
      <h1 className="card-title">🛫 Админ-панель Noris Airlines</h1>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button className={`btn ${activeTab === 'airports' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('airports')}>
          🏢 Аэропорты ({airports.length})
        </button>
        <button className={`btn ${activeTab === 'flights' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('flights')}>
          ✈ Рейсы ({flights.length})
        </button>
      </div>

      {message && (
        <div style={{
          padding: '12px 18px',
          borderRadius: '10px',
          marginBottom: '15px',
          background: message.includes('✅') ? '#f0fdf4' : '#fef2f2',
          color: message.includes('✅') ? '#166534' : '#991b1b',
          fontWeight: 600
        }}>
          {message}
        </div>
      )}

      {/* ВКЛАДКА АЭРОПОРТЫ */}
      {activeTab === 'airports' && (
        <div className="card">
          <h3>➕ Добавить аэропорт</h3>
          
          <form onSubmit={addAirport} style={{ display: 'grid', gap: '15px', margin: '20px 0' }}>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">IATA-код *</label>
                <input type="text" className="form-input" placeholder="SVO"
                  value={airportForm.iata}
                  onChange={e => setAirportForm({...airportForm, iata: e.target.value.toUpperCase()})}
                  required maxLength={3} />
              </div>
              <div className="form-group">
                <label className="form-label">Название *</label>
                <input type="text" className="form-input" placeholder="Шереметьево"
                  value={airportForm.name}
                  onChange={e => setAirportForm({...airportForm, name: e.target.value})}
                  required />
              </div>
              <div className="form-group">
                <label className="form-label">Город *</label>
                <input type="text" className="form-input" placeholder="Москва"
                  value={airportForm.city}
                  onChange={e => setAirportForm({...airportForm, city: e.target.value})}
                  required />
              </div>
              <div className="form-group">
                <label className="form-label">Страна</label>
                <select className="form-select" value={airportForm.country}
                  onChange={e => setAirportForm({...airportForm, country: e.target.value})}>
                  <option>Россия</option>
                  <option>Турция</option>
                  <option>ОАЭ</option>
                  <option>Египет</option>
                  <option>Узбекистан</option>
                  <option>Грузия</option>
                  <option>Армения</option>
                  <option>Таджикистан</option>
                  <option>Киргизия</option>
                  <option>Беларусь</option>
                  <option>Китай</option>
                  <option>Вьетнам</option>
                  <option>Таиланд</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">➕ Добавить аэропорт</button>
          </form>
          
          <hr style={{ margin: '20px 0', borderColor: '#e8e0f0' }} />
          
          <h3>📋 Все аэропорты ({airports.length})</h3>
          {airports.length === 0 ? (
            <p style={{ color: '#999', padding: '20px' }}>Нет аэропортов. Добавьте первый!</p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '15px' }}>
              {airports.map(a => (
                <div key={a.id} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 14px', background: '#f5f3ff',
                  borderRadius: '20px', fontSize: '13px', border: '1px solid #e8e0f0'
                }}>
                  <strong>{a.iata}</strong> — {a.city} ({a.name})
                  <button onClick={() => deleteAirport(a.id)}
                    style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'red', fontSize: '16px' }}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ВКЛАДКА РЕЙСЫ */}
      {activeTab === 'flights' && (
        <>
          <div className="card">
            <h3>➕ Добавить рейс</h3>
            
            <form onSubmit={addFlight} style={{ display: 'grid', gap: '15px', margin: '20px 0' }}>
              <div className="form-group">
                <label className="form-label">Номер рейса *</label>
                <input type="text" className="form-input" placeholder="NR102"
                  value={flightForm.flightNumber}
                  onChange={e => setFlightForm({...flightForm, flightNumber: e.target.value})}
                  required />
              </div>
              
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Аэропорт вылета *</label>
                  <select className="form-select" value={flightForm.fromAirportId}
                    onChange={e => setFlightForm({...flightForm, fromAirportId: Number(e.target.value)})}
                    required>
                    <option value={0}>Выберите...</option>
                    {airports.map(a => (
                      <option key={a.id} value={a.id}>{a.iata} — {a.city}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Аэропорт прилёта *</label>
                  <select className="form-select" value={flightForm.toAirportId}
                    onChange={e => setFlightForm({...flightForm, toAirportId: Number(e.target.value)})}
                    required>
                    <option value={0}>Выберите...</option>
                    {airports.map(a => (
                      <option key={a.id} value={a.id}>{a.iata} — {a.city}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Дата и время вылета *</label>
                  <input type="datetime-local" className="form-input"
                    value={flightForm.departureTime}
                    onChange={e => setFlightForm({...flightForm, departureTime: e.target.value})}
                    required />
                </div>
                <div className="form-group">
                  <label className="form-label">Дата и время прилёта *</label>
                  <input type="datetime-local" className="form-input"
                    value={flightForm.arrivalTime}
                    onChange={e => setFlightForm({...flightForm, arrivalTime: e.target.value})}
                    required />
                </div>
              </div>
              
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Дата начала периода *</label>
                  <input type="date" className="form-input"
                    value={flightForm.startDate}
                    onChange={e => setFlightForm({...flightForm, startDate: e.target.value})}
                    required />
                </div>
                <div className="form-group">
                  <label className="form-label">Дата окончания периода *</label>
                  <input type="date" className="form-input"
                    value={flightForm.endDate}
                    onChange={e => setFlightForm({...flightForm, endDate: e.target.value})}
                    required />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Дни недели (1-пн, 7-вс, через запятую)</label>
                <input type="text" className="form-input" placeholder="1,3,5"
                  value={flightForm.daysOfWeek}
                  onChange={e => setFlightForm({...flightForm, daysOfWeek: e.target.value})} />
              </div>
              
              <button type="submit" className="btn btn-primary">➕ Добавить рейс</button>
            </form>
          </div>
          
          <div className="card">
            <h3>📋 Все рейсы ({flights.length})</h3>
            {flights.length === 0 ? (
              <p style={{ color: '#999', padding: '20px' }}>Рейсов пока нет</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Рейс</th>
                    <th>Маршрут</th>
                    <th>Вылет</th>
                    <th>Период</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {flights.map(flight => (
                    <tr key={flight.id}>
                      <td>{flight.flightNumber}</td>
                      <td>{flight.fromAirport?.city} → {flight.toAirport?.city}</td>
                      <td>{new Date(flight.departureTime).toLocaleString('ru-RU')}</td>
                      <td>{new Date(flight.startDate).toLocaleDateString()} — {new Date(flight.endDate).toLocaleDateString()}</td>
                      <td>
                        <button className="btn btn-sm btn-outline" onClick={() => deleteFlight(flight.id)}
                          style={{ color: 'red', borderColor: 'red' }}>🗑️</button>
                      </td>
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
