import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Показываем сообщение о подтверждении
  const verified = router.query.verified

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()

    if (data.success) {
      localStorage.setItem('user', JSON.stringify(data.user))
      router.push('/cabinet')
    } else {
      setMessage(data.message)
    }
    setLoading(false)
  }

  return (
    <div className="card" style={{ maxWidth: 400, margin: '40px auto' }}>
      <h2 className="card-title">🔑 Вход</h2>

      {verified === 'success' && (
        <div style={{ padding: 12, borderRadius: 8, background: '#f0fdf4', color: '#166534', marginBottom: 15 }}>
          ✅ Email подтверждён! Войдите в аккаунт.
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 15 }}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input type="email" className="form-input" value={email}
            onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">Пароль</label>
          <input type="password" className="form-input" value={password}
            onChange={e => setPassword(e.target.value)} required />
        </div>

        {message && (
          <div style={{ padding: 12, borderRadius: 8, background: '#fef2f2', color: '#991b1b' }}>
            {message}
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Вход...' : 'Войти'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: 15 }}>
        Нет аккаунта? <a href="/register" style={{ color: '#6b3fa0' }}>Зарегистрироваться</a>
      </p>
    </div>
  )
}
