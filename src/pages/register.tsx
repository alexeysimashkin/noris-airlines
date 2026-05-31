import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Register() {
  const router = useRouter()
  const [form, setForm] = useState({
    lastName: '', firstName: '', middleName: '',
    birthDate: '', gender: 'male', email: '', phone: '', password: ''
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    setMessage(data.message)
    setLoading(false)
  }

  return (
    <div className="card" style={{ maxWidth: 500, margin: '40px auto' }}>
      <h2 className="card-title">🛫 Регистрация</h2>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 15 }}>
        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">Фамилия *</label>
            <input type="text" className="form-input" value={form.lastName}
              onChange={e => setForm({...form, lastName: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Имя *</label>
            <input type="text" className="form-input" value={form.firstName}
              onChange={e => setForm({...form, firstName: e.target.value})} required />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Отчество</label>
          <input type="text" className="form-input" value={form.middleName}
            onChange={e => setForm({...form, middleName: e.target.value})} />
        </div>
        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">Дата рождения *</label>
            <input type="date" className="form-input" value={form.birthDate}
              onChange={e => setForm({...form, birthDate: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Пол</label>
            <select className="form-select" value={form.gender}
              onChange={e => setForm({...form, gender: e.target.value})}>
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Email *</label>
          <input type="email" className="form-input" value={form.email}
            onChange={e => setForm({...form, email: e.target.value})} required />
        </div>
        <div className="form-group">
          <label className="form-label">Телефон *</label>
          <input type="tel" className="form-input" value={form.phone}
            onChange={e => setForm({...form, phone: e.target.value})} required />
        </div>
        <div className="form-group">
          <label className="form-label">Пароль *</label>
          <input type="password" className="form-input" value={form.password}
            onChange={e => setForm({...form, password: e.target.value})} required minLength={6} />
        </div>

        {message && (
          <div style={{ padding: 12, borderRadius: 8, background: message.includes('успешна') ? '#f0fdf4' : '#fef2f2', color: message.includes('успешна') ? '#166534' : '#991b1b' }}>
            {message}
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: 15 }}>
        Уже есть аккаунт? <a href="/login" style={{ color: '#6b3fa0' }}>Войти</a>
      </p>
    </div>
  )
}
