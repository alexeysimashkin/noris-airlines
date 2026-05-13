import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'

export default function Overview() {
  const { t } = useLanguage()
  const router = useRouter()
  const { flightId, tariffId } = router.query
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    if (!flightId || !tariffId) return
    fetch(`/api/bookings/preview?flightId=${flightId}&tariffId=${tariffId}`)
      .then(res => res.json())
      .then(setData)
  }, [flightId, tariffId])

  if (!data) return <div className="card">Загрузка...</div>

  return (
    <div className="card">
      <h2 className="card-title">Вы выбрали</h2>
      
      <div style={{ display: 'grid', gap: '15px' }}>
        <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '10px' }}>
          <strong>🛫 Рейс:</strong> {data.flight.flightNumber}
        </div>
        <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '10px' }}>
          <strong>📅 Дата:</strong> {new Date(data.flight.departureTime).toLocaleDateString('ru-RU', { 
            day: 'numeric', month: 'long', year: 'numeric' 
          })}
        </div>
        <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '10px' }}>
          <strong>🕐 Время:</strong> {new Date(data.flight.departureTime).toLocaleTimeString('ru-RU', { 
            hour: '2-digit', minute: '2-digit' 
          })} → {new Date(data.flight.arrivalTime).toLocaleTimeString('ru-RU', { 
            hour: '2-digit', minute: '2-digit' 
          })}
        </div>
        <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '10px' }}>
          <strong>✈ Самолет:</strong> {data.flight.aircraft.type}
        </div>
        <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '10px' }}>
          <strong>💰 Тариф:</strong> {data.tariff.name} — {data.tariff.price.toLocaleString()} ₽
        </div>
      </div>
      
      <button 
        className="btn btn-primary" 
        style={{ marginTop: '20px', width: '100%' }}
        onClick={() => router.push({
          pathname: '/seat',
          query: router.query
        })}
      >
        {t.common.continue}
      </button>
    </div>
  )
}
