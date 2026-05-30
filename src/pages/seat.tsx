import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import SeatMap from '@/components/SeatMap'
import { useLanguage } from '@/context/LanguageContext'

export default function SeatSelection() {
  const { t } = useLanguage()
  const router = useRouter()
  const { tariffId } = router.query
  const [tariff, setTariff] = useState<any>(null)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])

  useEffect(() => {
    if (!tariffId) return
    fetch(`/api/tariffs/${tariffId}`)
      .then(res => res.json())
      .then(setTariff)
  }, [tariffId])

  const handleSeatSelect = (seat: string) => {
    setSelectedSeats([seat])
  }

  if (!tariff) return <div className="card">Загрузка...</div>

  return (
    <div className="card">
      <h2 className="card-title">{t.seat.title}</h2>

      <SeatMap
        tariffClass={tariff.class}
        freeSeatRows={tariff.freeSeatRows}
        seatDiscount={tariff.seatDiscount}
        onSelect={handleSeatSelect}
      />

      <button
        className="btn btn-primary"
        style={{ marginTop: '20px', width: '100%' }}
        onClick={() => router.push({
          pathname: '/baggage',
          query: { ...router.query, seats: selectedSeats.join(',') }
        })}
      >
        {t.common.continue}
      </button>
    </div>
  )
}
