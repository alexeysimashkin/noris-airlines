import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

export default function FinalOverview() {
  const router = useRouter()
  const { flightId, tariffId, seats, baggage, meals, passengers } = router.query
  const [data, setData] = useState<any>(null)
  const [totalPrice, setTotalPrice] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!router.isReady || !flightId || !tariffId) return

    const fetchData = async () => {
      try {
        const [flightRes, tariffRes, mealsRes] = await Promise.all([
          fetch(`/api/flights/${flightId}`),
          fetch(`/api/tariffs/${tariffId}`),
          fetch('/api/meals')
        ])

        const flight = await flightRes.json()
        const tariff = await tariffRes.json()
        const allMeals = await mealsRes.json()

        // Базовая цена тарифа
        let price = tariff.price || 0

        // Стоимость места
        if (seats && tariff.class === 'economy') {
          const freeRows = tariff.freeSeatRows?.split(',').map(Number) || []
          const selectedSeat = (seats as string).split(',')[0]
          const seatRow = parseInt(selectedSeat)
          if (!freeRows.includes(seatRow) && selectedSeat) {
            const seatPrice = 700 * (1 - (tariff.seatDiscount || 0) / 100)
            price += seatPrice
          }
        }

        // Багаж
        const selectedBaggage = baggage ? (baggage as string).split(',').filter(Boolean) : []
        if (selectedBaggage.includes('baggage23')) price += 2500
        if (selectedBaggage.includes('baggage30')) price += 3500
        if (selectedBaggage.includes('sport')) price += 3000

        // Питание
        const selectedMeals = meals ? (meals as string).split(',').filter(Boolean) : []
        selectedMeals.forEach(mealId => {
          const meal = allMeals.find((m: any) => m.id === Number(mealId))
          if (meal) price += meal.price
        })

        // Количество пассажиров
        const passengerList = passengers ? JSON.parse(passengers as string) : []
        const total = price * (passengerList.length || 1)

        setTotalPrice(total)
        setData({ flight, tariff })
        setLoading(false)
      } catch (e) {
        console.error(e)
        setLoading(false)
      }
    }

    fetchData()
  }, [router.isReady, flightId, tariffId, seats, baggage, meals, passengers])

  if (loading) return <div className="card"><p>Загрузка...</p></div>
  if (!data) return <div className="card"><p>Ошибка загрузки данных</p></div>

  const { flight, tariff } = data
  const passengerList = passengers ? JSON.parse(passengers as string) : []

  const handlePay = () => {
    router.push({
      pathname: '/payment',
      query: { ...router.query, totalPrice: String(totalPrice) }
    })
  }

  return (
    <div className="card">
      <h2 className="card-title">Обзор заказа</h2>

      <div style={{ display: 'grid', gap: '12px' }}>
        <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '10px' }}>
          <strong>🛫 Рейс:</strong> {flight.flightNumber}
          <div style={{ color: '#666', marginTop: '4px' }}>
            {flight.fromAirport?.city} → {flight.toAirport?.city}
            &nbsp;|&nbsp;
            {new Date(flight.departureTime).toLocaleDateString('ru-RU')}
            &nbsp;
            {new Date(flight.departureTime).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '10px' }}>
          <strong>💰 Тариф:</strong> {tariff.name} — {tariff.price?.toLocaleString()} ₽
        </div>

        {seats && (
          <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '10px' }}>
            <strong>💺 Место:</strong> {(seats as string).split(',').join(', ')}
          </div>
        )}

        {baggage && (
          <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '10px' }}>
            <strong>🧳 Багаж:</strong> {(baggage as string).split(',').filter(Boolean).join(', ')}
          </div>
        )}

        {meals && (
          <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '10px' }}>
            <strong>🍽️ Питание:</strong> выбрано
          </div>
        )}

        <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '10px' }}>
          <strong>👥 Пассажиры:</strong> {passengerList.length}
          {passengerList.map((p: any, i: number) => (
            <div key={i} style={{ fontSize: '13px', color: '#666' }}>
              {p.lastName} {p.firstName}
            </div>
          ))}
        </div>

        <div style={{
          padding: '20px',
          background: 'linear-gradient(135deg, #6b3fa0, #8b5cf6)',
          color: 'white',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '16px', opacity: 0.9 }}>Итого к оплате</div>
          <div style={{ fontSize: '36px', fontWeight: 700 }}>{totalPrice.toLocaleString()} ₽</div>
        </div>
      </div>

      <button className="btn btn-primary" style={{ marginTop: '20px', width: '100%', fontSize: '18px', padding: '16px' }}
        onClick={handlePay}>
        💳 Оплатить
      </button>
    </div>
  )
}
