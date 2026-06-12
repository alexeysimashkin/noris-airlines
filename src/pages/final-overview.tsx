import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

export default function FinalOverview() {
  const router = useRouter()
  const { flightId, tariffId, returnFlightId, returnTariffId, seats, returnSeats, baggage, returnBaggage, meals, returnMeals, passengers } = router.query
  const [data, setData] = useState<any>(null)
  const [returnData, setReturnData] = useState<any>(null)
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

        let returnFlight = null
        let returnTariffPrice = 0
        if (returnFlightId) {
          const returnRes = await fetch(`/api/flights/${returnFlightId}`)
          returnFlight = await returnRes.json()
        }
        if (returnTariffId) {
          const returnTariffRes = await fetch(`/api/tariffs/${returnTariffId}`)
          const returnTariff = await returnTariffRes.json()
          returnTariffPrice = returnTariff?.price || 0
        }

        let price = (tariff.price || 0) + returnTariffPrice
        const passengerList = passengers ? JSON.parse(passengers as string) : []
        const paxCount = passengerList.length || 1

        // Места туда
        if (seats && tariff.class === 'economy') {
          const freeRows = tariff.freeSeatRows?.split(',').map(Number) || []
          const seat = (seats as string).split(',')[0]
          const seatRow = parseInt(seat)
          if (!freeRows.includes(seatRow) && seat) price += 700 * (1 - (tariff.seatDiscount || 0) / 100)
        }
        // Места обратно
        if (returnSeats) price += 700

        // Багаж туда
        const bag = baggage ? (baggage as string).split(',').filter(Boolean) : []
        if (bag.includes('baggage23')) price += 2500
        if (bag.includes('baggage30')) price += 3500
        if (bag.includes('sport')) price += 3000
        // Багаж обратно
        const bagR = returnBaggage ? (returnBaggage as string).split(',').filter(Boolean) : []
        if (bagR.includes('baggage23')) price += 2500
        if (bagR.includes('baggage30')) price += 3500
        if (bagR.includes('sport')) price += 3000

        // Питание
        const ml = meals ? (meals as string).split(',').filter(Boolean) : []
        const mlR = returnMeals ? (returnMeals as string).split(',').filter(Boolean) : []
        for (const id of [...ml, ...mlR]) {
          const meal = allMeals.find((m: any) => m.id === Number(id))
          if (meal) price += meal.price
        }

        setTotalPrice(price * paxCount)
        setData({ flight, tariff })
        setReturnData(returnFlight)
        setLoading(false)
      } catch (e) {
        console.error(e)
        setLoading(false)
      }
    }
    fetchData()
  }, [router.isReady, flightId, tariffId, returnFlightId, returnTariffId, seats, returnSeats, baggage, returnBaggage, meals, returnMeals, passengers])

  if (loading) return <div className="card"><p>Загрузка...</p></div>
  if (!data) return <div className="card"><p>Ошибка</p></div>

  const { flight, tariff } = data
  const passengerList = passengers ? JSON.parse(passengers as string) : []

  return (
    <div className="card">
      <h2 className="card-title">Обзор заказа</h2>
      <div style={{ display: 'grid', gap: 10 }}>
        <div style={{ padding: 12, background: '#f8f9fa', borderRadius: 10 }}>
          <strong>🛫 Туда:</strong> {flight.flightNumber} — {flight.fromAirport?.city} → {flight.toAirport?.city}
          <br />{new Date(flight.departureTime).toLocaleString('ru-RU', { timeZone: 'UTC' })}
        </div>
        {returnData && (
          <div style={{ padding: 12, background: '#f5f3ff', borderRadius: 10 }}>
            <strong>🛬 Обратно:</strong> {returnData.flightNumber} — {returnData.fromAirport?.city} → {returnData.toAirport?.city}
            <br />{new Date(returnData.departureTime).toLocaleString('ru-RU', { timeZone: 'UTC' })}
          </div>
        )}
        <div style={{ padding: 12, background: '#f8f9fa', borderRadius: 10 }}><strong>💰 Тариф туда:</strong> {tariff.name} — {tariff.price?.toLocaleString()} ₽</div>
        {returnTariffId && <div style={{ padding: 12, background: '#f8f9fa', borderRadius: 10 }}><strong>💰 Тариф обратно</strong></div>}
        {seats && <div style={{ padding: 12, background: '#f8f9fa', borderRadius: 10 }}><strong>💺 Место туда:</strong> {(seats as string).split(',')[0]}</div>}
        {returnSeats && <div style={{ padding: 12, background: '#f8f9fa', borderRadius: 10 }}><strong>💺 Место обратно:</strong> {(returnSeats as string).split(',')[0]}</div>}
        <div style={{ padding: 12, background: '#f8f9fa', borderRadius: 10 }}><strong>👥 Пассажиры:</strong> {passengerList.length}</div>
        <div style={{ padding: 18, background: 'var(--primary)', color: 'white', borderRadius: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 14, opacity: 0.8 }}>Итого к оплате</div>
          <div style={{ fontSize: 32, fontWeight: 800 }}>{totalPrice.toLocaleString()} ₽</div>
        </div>
      </div>
      <button className="btn btn-primary btn-lg btn-block" style={{ marginTop: 16 }}
        onClick={() => router.push({ pathname: '/payment', query: { ...router.query, totalPrice: String(totalPrice) } })}>
        💳 Оплатить
      </button>
    </div>
  )
}
