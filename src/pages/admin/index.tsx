import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

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
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null)
  const [formData, setFormData] = useState({
    flightNumber: '',
    fromAirportId: 1,
    toAirportId: 2,
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
  }, [])

  const fetchFlights = async () => {
    const res = await fetch('/api/admin/flights')
    const data = await res.json()
    setFlights(data)
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
      fromAirportId: 1,
      toAirportId: 2,
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
      fromAirportId: flight.fromAirport.iata === 'SVO' ? 1 : 2,
      toAirportId: flight.toAirport.iata === 'LED' ? 2 : 1,
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
      <h1 className="card-title">Админ-панель</h1>
      
      <div className="card">
        <h3>{editingFlight ? 'Редактировать рейс' : 'Добавить рейс'}</h3>
        
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
          <div className="form-group">
            <label className="form-label">Номер рейса</label>
            <input 
              type="text" 
              className="form-input"
              value={formData.flightNumber}
              onChange={e => setFormData({...formData, flightNumber: e.target.value})}
              required
            />
          </div>
          
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Аэропорт вылета</label>
              <select 
                className="form-select"
                value={formData.fromAirportId}
                onChange={e => setFormData({...formData, fromAirportId: Number(e.target.value)})}
              >
                <option value={1}>SVO - Москва</option>
                <option value={2}>LED - Санкт-Петербург</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Аэропорт прилета</label>
              <select 
                className="form-select"
                value={formData.toAirportId}
                onChange={e => setFormData({...formData, toAirportId: Number(e.target.value)})}
              >
                <option value={2}>LED - Санкт-Петербург</option>
                <option value={1}>SVO - Москва</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Время вылета</label>
              <input 
                type="datetime-local" 
                className="form-input"
                value={formData.departureTime}
                onChange={e => setFormData({...formData, departureTime: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Время прилета</label>
              <input 
                type="datetime-local" 
                className="form-input"
                value={formData.arrivalTime}
                onChange={e => setFormData({...formData, arrivalTime: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Дата начала</label>
              <input 
                type="date" 
                className="form-input"
                value={formData.startDate}
                onChange={e => setFormData({...formData, startDate: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Дата окончания</label>
              <input 
                type="date" 
                className="form-input"
                value={formData.endDate}
                onChange={e => setFormData({...formData, endDate: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Дни недели (через запятую: 1-пн, 7-вс)</label>
            <input 
              type="text" 
              className="form-input"
              value={formData.daysOfWeek}
              onChange={e => setFormData({...formData, daysOfWeek: e.target.value})}
            />
          </div>
          
          <button type="submit" className="btn btn-primary">
            {editingFlight ? 'Сохранить изменения' : 'Добавить рейс'}
          </button>
          
          {editingFlight && (
            <button 
              type="button" 
              className="btn btn-outline"
              onClick={() => {
                setEditingFlight(null)
                setFormData({
                  flightNumber: '',
                  fromAirportId: 1,
                  toAirportId: 2,
                  aircraftId: 1,
                  departureTime: '',
                  arrivalTime: '',
                  durationMin: 90,
                  startDate: '',
                  endDate: '',
                  daysOfWeek: '1,2,3,4,5,6,7'
                })
              }}
            >
              Отмена
            </button>
          )}
        </form>
      </div>
      
      <div className="card" style={{ marginTop: '30px' }}>
        <h3>Список рейсов</h3>
        
        <table className="admin-table">
          <thead>
            <tr>
              <th>Рейс</th>
              <th>Маршрут</th>
              <th>Вылет</th>
              <th>Период</th>
              <th>Дни</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {flights.map(flight => (
              <tr key={flight.id}>
                <td>{flight.flightNumber}</td>
                <td>{flight.fromAirport.city} → {flight.toAirport.city}</td>
                <td>{new Date(flight.departureTime).toLocaleTimeString()}</td>
                <td>
                  {new Date(flight.startDate).toLocaleDateString()} - {new Date(flight.endDate).toLocaleDateString()}
                </td>
                <td>{flight.daysOfWeek}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-outline"
                    onClick={() => handleEdit(flight)}
                    style={{ marginRight: '5px' }}
                  >
                    ✏️
                  </button>
                  <button 
                    className="btn btn-sm btn-outline"
                    onClick={() => handleDelete(flight.id)}
                    style={{ color: 'red', borderColor: 'red' }}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
