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
  fromAirport: { iata: string; city: string }
  toAirport: { iata: string; city: string }
  aircraft: { type: string }
  departureTime: string
  arrivalTime: string
  startDate: string
  endDate: string
  daysOfWeek: string
}

export default function AdminPanel() {
  const [flights, setFlights] = useState<Flight[]>([])
  const [airports, setAirports] = useState<Airport[]>([])
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null)
  const [activeTab, setActiveTab] = useState<'flights' | 'airports'>('flights')
  const [formData, setFormData] = useState({
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
    fetchFlights()
    fetchAirports()
  }, [])

  const fetchFlights = async () => {
    const res = await fetch('/api/admin/flights')
    const data = await res.json()
    setFlights(data)
  }

  const fetchAirports = async () => {
    const res = await fetch('/api/admin/airports')
    const data = await res.json()
    setAirports(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingFlight) {
      await fetch(`/api/flights/${editingFlight.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
    } else {
      await fetch('/api/admin/flights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
    }
    
    setEditingFlight(null)
    setFormData({
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
  }

  const handleEdit = (flight: Flight) => {
    setEditingFlight(flight)
    setFormData({
      flightNumber: flight.flightNumber,
      fromAirportId: airports.find(a => a.iata === flight.fromAirport.iata)?.id || 0,
      toAirportId: airports.find(a => a.iata === flight.toAirport.iata)?.id || 0,
      aircraftId: 1,
      departureTime: flight.departureTime.slice(0, 16),
      arrivalTime: flight.arrivalTime.slice(0, 16),
      durationMin: 90,
      startDate: flight.startDate.slice(0, 10),
      endDate: flight.endDate.slice(0, 10),
      daysOfWeek: flight.daysOfWeek
    })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить рейс?')) return
    await fetch(`/api/flights/${id}`, { method: 'DELETE' })
    fetchFlights()
  }

  return (
    <div>
      <h1 className="card-title">🛫 Админ-панель Noris Airlines</h1>
      
      {/* Табы */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          className={`btn ${activeTab === 'flights' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('flights')}
        >
          ✈ Рейсы ({flights.length})
        </button>
        <button 
          className={`btn ${activeTab === 'airports' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('airports')}
        >
          🏢 Аэропорты ({airports.length})
        </button>
      </div>

      {/* Вкладка АЭРОПОРТЫ */}
      {activeTab === 'airports' && (
        <div className="card">
          <h3>Все аэропорты ({airports.length})</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '15px' }}>
            {airports.map(a => (
              <span key={a.id} style={{
                padding: '6px 12px',
                background: '#f5f3ff',
                borderRadius: '20px',
                fontSize: '13px',
                color: '#6b3fa0',
                border: '1px solid #e8e0f0'
              }}>
                {a.iata} — {a.city} ({a.name})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Вкладка РЕЙСЫ */}
      {activeTab === 'flights' && (
        <>
          <div className="card">
            <h3>{editingFlight ? '✏️ Редактировать рейс' : '➕ Добавить рейс'}</h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
              <div className="form-group">
                <label className="form-label">Номер рейса</label>
                <input type="text" className="form-input" value={formData.flightNumber}
                  onChange={e => setFormData({...formData, flightNumber: e.target.value})} required />
              </div>
              
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Аэропорт вылета</label>
                  <select className="form-select" value={formData.fromAirportId}
                    onChange={e => setFormData({...formData, fromAirportId: Number(e.target.value)})}>
                    <option value={0}>Выберите...</option>
                    {airports.map(a => (
                      <option key={a.id} value={a.id}>{a.iata} — {a.city} ({a.name})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Аэропорт прилёта</label>
                  <select className="form-select" value={formData.toAirportId}
                    onChange={e => setFormData({...formData, toAirportId: Number(e.target.value)})}>
                    <option value={0}>Выберите...</option>
                    {airports.map(a => (
                      <option key={a.id} value={a.id}>{a.iata} — {a.city} ({a.name})</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Время вылета</label>
                  <input type="datetime-local" className="form-input" value={formData.departureTime}
                    onChange={e => setFormData({...formData, departureTime: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Время прилёта</label>
                  <input type="datetime-local" className="form-input" value={formData.arrivalTime}
                    onChange={e => setFormData({...formData, arrivalTime: e.target.value})} required />
                </div>
              </div>
              
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Дата начала</label>
                  <input type="date" className="form-input" value={formData.startDate}
                    onChange={e => setFormData({...formData, startDate: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Дата окончания</label>
                  <input type="date" className="form-input" value={formData.endDate}
                    onChange={e => setFormData({...formData, endDate: e.target.value})} required />
                </div>
              </div>
              
              <button type="submit" className="btn btn-primary">
                {editingFlight ? '💾 Сохранить' : '➕ Добавить рейс'}
              </button>
              {editingFlight && (
                <button type="button" className="btn btn-outline" onClick={() => {
                  setEditingFlight(null)
                  setFormData({ flightNumber: '', fromAirportId: 0, toAirportId: 0, aircraftId: 1, departureTime: '', arrivalTime: '', durationMin: 90, startDate: '', endDate: '', daysOfWeek: '1,2,3,4,5,6,7' })
                }}>Отмена</button>
              )}
            </form>
          </div>
          
          <div className="card">
            <h3>Список рейсов</h3>
            {flights.length === 0 ? (
              <p style={{ color: '#999', padding: '20px' }}>Рейсов пока нет. Добавьте первый рейс!</p>
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
                      <td>{flight.fromAirport.city} → {flight.toAirport.city}</td>
                      <td>{new Date(flight.departureTime).toLocaleTimeString()}</td>
                      <td>{new Date(flight.startDate).toLocaleDateString()} — {new Date(flight.endDate).toLocaleDateString()}</td>
                      <td>
                        <button className="btn btn-sm btn-outline" onClick={() => handleEdit(flight)} style={{ marginRight: '5px' }}>✏️</button>
                        <button className="btn btn-sm btn-outline" onClick={() => handleDelete(flight.id)} style={{ color: 'red', borderColor: 'red' }}>🗑️</button>
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
