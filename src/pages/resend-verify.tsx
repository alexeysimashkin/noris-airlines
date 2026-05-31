import { useState } from 'react'

export default function ResendVerify() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/auth/resend-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    const data = await res.json()
    setMessage(data.message)
  }

  return (
    <div className="card" style={{ maxWidth: 400, margin: '40px auto' }}>
      <h2>📧 Повторная отправка подтверждения</h2>
      <form onSubmit={handleResend} style={{ display: 'grid', gap: 15, marginTop: 20 }}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input type="email" className="form-input" value={email}
            onChange={e => setEmail(e.target.value)} required />
        </div>
        {message && <p style={{ color: message.includes('✅') ? 'green' : 'red' }}>{message}</p>}
        <button type="submit" className="btn btn-primary">Отправить повторно</button>
      </form>
    </div>
  )
}
