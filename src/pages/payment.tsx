import { useRouter } from 'next/router'
import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

export default function Payment() {
  const { t } = useLanguage()
  const router = useRouter()
  const { totalPrice, ...restQuery } = router.query
  const [isPaying, setIsPaying] = useState(false)

  const handlePayment = async () => {
    setIsPaying(true)
    
    // Имитация процесса оплаты
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Генерация кода бронирования
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numbers = '0123456789'
    let code = ''
    for (let i = 0; i < 3; i++) {
      code += letters[Math.floor(Math.random() * letters.length)]
      code += numbers[Math.floor(Math.random() * numbers.length)]
    }
    
    // Сохраняем бронирование в БД
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...restQuery,
        bookingCode: code,
        totalPrice: Number(totalPrice),
        status: 'confirmed'
      })
    })
    
    const booking = await res.json()
    
    router.push({
      pathname: '/confirmation',
      query: { bookingCode: code, bookingId: booking.id }
    })
  }

  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <h2 className="card-title">{t.payment.title}</h2>
      
      <div style={{ 
        padding: '40px', 
        background: '#f8f9fa', 
        borderRadius: '15px',
        margin: '20px 0'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>💳</div>
        <h3 style={{ marginBottom: '10px', color: '#1a3a5c' }}>{t.payment.noPayment}</h3>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Сумма к оплате: <strong>{Number(totalPrice).toLocaleString()} ₽</strong>
        </p>
        <p style={{ color: '#999', fontSize: '14px' }}>
          Это тестовый режим. Деньги не будут списаны.
        </p>
      </div>
      
      <button 
        className="btn btn-primary" 
        style={{ fontSize: '18px', padding: '15px 40px' }}
        onClick={handlePayment}
        disabled={isPaying}
      >
        {isPaying ? 'Обработка...' : t.payment.pay}
      </button>
    </div>
  )
}
