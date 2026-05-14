import { useState } from 'react'

export default function AdminSeed() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  const loadAirports = async () => {
    setLoading(true)
    setResult('Загружаем аэропорты...')
    try {
      const res = await fetch('/api/admin/seed')
      const data = await res.json()
      setResult(data.message)
    } catch (e: any) {
      setResult('Ошибка: ' + e.message)
    }
    setLoading(false)
  }

  return (
    <div className="card" style={{ textAlign: 'center', maxWidth: '500px', margin: '40px auto' }}>
      <h2 className="card-title">🛫 Загрузка аэропортов</h2>
      <p style={{ color: '#6b5b8a', marginBottom: '20px' }}>
        Нажми кнопку чтобы загрузить все 55 аэропортов России и мира в базу данных
      </p>
      <button
        className="btn btn-primary"
        onClick={loadAirports}
        disabled={loading}
        style={{ width: '100%', fontSize: '18px', padding: '16px' }}
      >
        {loading ? '⏳ Загружаем...' : '🚀 Загрузить аэропорты'}
      </button>
      {result && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          borderRadius: '12px',
          background: result.includes('✅') ? '#f0fdf4' : '#fef2f2',
          color: result.includes('✅') ? '#166534' : '#991b1b',
          fontWeight: 500
        }}>
          {result}
        </div>
      )}
      <p style={{ marginTop: '15px', fontSize: '12px', color: '#999' }}>
        После загрузки обнови страницу админки
      </p>
    </div>
  )
}
