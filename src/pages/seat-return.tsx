import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import SeatMap from '@/components/SeatMap'

export default function SeatReturn() {
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

  if (!tariff) return <div className="card"><p>Загрузка...</p></div>

  return (
    <div className="card">
      <h2 className="card-title">Выбор места — обратный рейс</h2>

      <SeatMap
        tariffClass={tariff.class}
        freeSeatRows={tariff.freeSeatRows}
        seatDiscount={tariff.seatDiscount}
        onSelect={handleSeatSelect}
      />

      <button
        className="btn btn-primary"
        style={{ marginTop: 20, width: '100%' }}
        onClick={() => router.push({
          pathname: '/baggage-return',
          query: { ...router.query, returnSeats: selectedSeats.join(',') }
        })}
      >
        Продолжить
      </button>
    </div>
  )
}
