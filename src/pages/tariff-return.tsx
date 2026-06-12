import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

export default function TariffReturn() {
  const router = useRouter()
  const { returnFlightId } = router.query
  const [tariffs, setTariffs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!returnFlightId) return
    fetch(`/api/flights/${returnFlightId}/tariffs`)
      .then(r => r.json()).then(d => { setTariffs(d); setLoading(false) })
  }, [returnFlightId])

  const handleSelect = (tariff: any) => {
    router.push({
      pathname: '/overview',
      query: { ...router.query, returnTariffId: tariff.id }
    })
  }

  if (loading) return <div className="card">Загрузка тарифов...</div>

  return (
    <div className="card">
      <h2 className="card-title">Тариф для обратного рейса</h2>
      {tariffs.filter((t: any) => t.class === 'economy').length > 0 && (
        <>
          <h3 style={{ marginBottom: 20, color: '#166534' }}>Эконом-класс</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
            {tariffs.filter((t: any) => t.class === 'economy').map((tariff: any) => (
              <div key={tariff.id} style={{ border: '2px solid #e5e7eb', borderRadius: 16, padding: 20 }}>
                <h4 style={{ fontWeight: 700, marginBottom: 6 }}>{tariff.name}</h4>
                <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 10 }}>{tariff.description}</p>
                <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>{tariff.price.toLocaleString()} ₽</div>
                <button className="btn btn-primary btn-sm" onClick={() => handleSelect(tariff)}>Выбрать</button>
              </div>
            ))}
          </div>
        </>
      )}
      {tariffs.filter((t: any) => t.class === 'business').length > 0 && (
        <>
          <h3 style={{ margin: '24px 0 20px', color: '#7c3aed' }}>💎 Бизнес-класс</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
            {tariffs.filter((t: any) => t.class === 'business').map((tariff: any) => (
              <div key={tariff.id} style={{ border: '2px solid #c4b5fd', borderRadius: 16, padding: 20, background: '#faf8ff' }}>
                <h4 style={{ fontWeight: 700, marginBottom: 6 }}>{tariff.name}</h4>
                <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 10 }}>{tariff.description}</p>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#7c3aed', marginBottom: 10 }}>{tariff.price.toLocaleString()} ₽</div>
                <button className="btn btn-primary btn-sm" onClick={() => handleSelect(tariff)}>Выбрать</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
