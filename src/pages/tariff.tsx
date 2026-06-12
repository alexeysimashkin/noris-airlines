import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'

interface Tariff {
  id: number; name: string; description: string; price: number
  baggage: string; handLuggage: string; refundable: boolean; class: string
}

export default function TariffSelection() {
  const { t } = useLanguage()
  const router = useRouter()
  const { flightId, returnFlightId } = router.query
  const [tariffs, setTariffs] = useState<Tariff[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!flightId) return
    fetch(`/api/flights/${flightId}/tariffs`)
      .then(res => res.json())
      .then(data => { setTariffs(data); setLoading(false) })
  }, [flightId])

  const handleSelect = (tariff: Tariff) => {
    const query = { ...router.query, tariffId: tariff.id }

    if (router.query.tripType === 'roundtrip' && router.query.returnDate) {
      if (!returnFlightId) {
        // Сначала выбрали тариф туда — идём выбирать обратный рейс
        router.push({ pathname: '/search-return', query })
      } else {
        // Уже есть обратный рейс — идём выбирать тариф для обратного
        router.push({ pathname: '/tariff-return', query })
      }
    } else {
      router.push({ pathname: '/overview', query })
    }
  }

  const economyTariffs = tariffs.filter(t => t.class === 'economy')
  const businessTariffs = tariffs.filter(t => t.class === 'business')

  if (loading) return <div className="card">Загрузка тарифов...</div>

  return (
    <div className="card">
      <h2 className="card-title">{t.tariff.title}</h2>
      {economyTariffs.length > 0 && (
        <>
          <h3 style={{ marginBottom: 20, color: '#166534' }}>{t.tariff.economy}</h3>
          <div className="grid grid-2">
            {economyTariffs.map(tariff => (
              <div key={tariff.id} className="card" style={{ border: '2px solid #e5e7eb' }}>
                <h4 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{tariff.name}</h4>
                <p style={{ color: '#6b7280', marginBottom: 12, fontSize: 14 }}>{tariff.description}</p>
                <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: 13 }}>
                  <div><strong>🧳 Багаж:</strong> {tariff.baggage}</div>
                  <div><strong>🎒 Ручная:</strong> {tariff.handLuggage}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>{tariff.price.toLocaleString()} ₽</div>
                  <button className="btn btn-primary" onClick={() => handleSelect(tariff)}>Выбрать</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {businessTariffs.length > 0 && (
        <>
          <h3 style={{ margin: '28px 0 20px', color: '#7c3aed' }}>💎 {t.tariff.business}</h3>
          <div className="grid grid-2">
            {businessTariffs.map(tariff => (
              <div key={tariff.id} className="card" style={{ border: '2px solid #c4b5fd', background: '#faf8ff' }}>
                <h4 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{tariff.name}</h4>
                <p style={{ color: '#6b7280', marginBottom: 12, fontSize: 14 }}>{tariff.description}</p>
                <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: 13 }}>
                  <div><strong>🧳 Багаж:</strong> {tariff.baggage}</div>
                  <div><strong>🎒 Ручная:</strong> {tariff.handLuggage}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#7c3aed' }}>{tariff.price.toLocaleString()} ₽</div>
                  <button className="btn btn-primary" onClick={() => handleSelect(tariff)}>Выбрать</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
