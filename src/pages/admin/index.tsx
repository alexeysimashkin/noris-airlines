import { useState, useEffect } from 'react'

interface Airport {
  id: number
  iata: string
  name: string
  city: string
  country: string
}

export default function AdminPanel() {
  const [airports, setAirports] = useState<Airport[]>([])
  const [activeTab, setActiveTab] = useState<'airports' | 'flights'>('airports')
  
  // Форма аэропорта
  const [airportForm, setAirportForm] = useState({ iata: '', name: '', city: '', country: 'Россия' })
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchAirports()
  }, [])

  const fetchAirports = async () => {
    const res = await fetch('/api/admin/airports')
    const data = await res.json()
    setAirports(data)
  }

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
      setMessage('❌ ' + data.message)
    }
  }

  const deleteAirport = async (id: number) => {
    if (!confirm('Удалить аэропорт?')) return
    await fetch(`/api/admin/airports?id=${id}`, { method: 'DELETE' })
    fetchAirports()
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
          ✈ Рейсы
        </button>
      </div>

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
          
          {message && <p style={{ color: message.includes('✅') ? 'green' : 'red', fontWeight: 600 }}>{message}</p>}
          
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

      {activeTab === 'flights' && (
        <div className="card">
          <h3>✈ Управление рейсами</h3>
          <p style={{ color: '#999' }}>Функционал будет доступен после добавления аэропортов</p>
          
          {airports.length >= 2 && (
            <div style={{ marginTop: '20px' }}>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Откуда</label>
                  <select className="form-select">
                    <option>Выберите аэропорт</option>
                    {airports.map(a => (
                      <option key={a.id} value={a.id}>{a.iata} — {a.city}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Куда</label>
                  <select className="form-select">
                    <option>Выберите аэропорт</option>
                    {airports.map(a => (
                      <option key={a.id} value={a.id}>{a.iata} — {a.city}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
