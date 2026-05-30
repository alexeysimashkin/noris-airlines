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
  const { flightId } = router.query
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
    if (router.query.tripType === 'roundtrip' && router.query.returnDate && !router.query.returnFlightId) {
      router.push({ pathname: '/search-return', query })
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
          <h3 style={{ marginBottom: 20, color: '#6b3fa0' }}>{t.tariff.economy}</h3>
          <div className="grid grid-2">
            {economyTariffs.map(tariff => (
              <div key={tariff.id} className="card" style={{ border: '2px solid #e8e0f0' }}>
                <h4 style={{ fontSize: 20, color: '#6b3fa0', marginBottom: 10 }}>{tariff.name}</h4>
                <p style={{ color: '#666', marginBottom: 15 }}>{tariff.description}</p>
                <div style={{ display: 'flex', gap: 20, marginBottom: 15, fontSize: 14 }}>
                  <div><strong>🧳 {t.tariff.baggage}:</strong> {tariff.baggage}</div>
                  <div><strong>🎒 {t.tariff.handLuggage}:</strong> {tariff.handLuggage}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#6b3fa0' }}>{tariff.price.toLocaleString()} ₽</div>
                  <button className="btn btn-primary" onClick={() => handleSelect(tariff)}>{t.tariff.select} {tariff.price.toLocaleString()} ₽</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {businessTariffs.length > 0 && (
        <>
          <h3 style={{ margin: '30px 0 20px', color: '#7c3aed' }}>{t.tariff.business}</h3>
          <div className="grid grid-2">
            {businessTariffs.map(tariff => (
              <div key={tariff.id} className="card" style={{ border: '2px solid #c4b5fd', background: 'linear-gradient(135deg, #faf8ff 0%, #f5f3ff 100%)' }}>
                <h4 style={{ fontSize: 20, color: '#6b3fa0', marginBottom: 10 }}>✨ {tariff.name}</h4>
                <p style={{ color: '#666', marginBottom: 15 }}>{tariff.description}</p>
                <div style={{ display: 'flex', gap: 20, marginBottom: 15, fontSize: 14 }}>
                  <div><strong>🧳 {t.tariff.baggage}:</strong> {tariff.baggage}</div>
                  <div><strong>🎒 {t.tariff.handLuggage}:</strong> {tariff.handLuggage}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#7c3aed' }}>{tariff.price.toLocaleString()} ₽</div>
                  <button className="btn btn-primary" onClick={() => handleSelect(tariff)}>{t.tariff.select} {tariff.price.toLocaleString()} ₽</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
