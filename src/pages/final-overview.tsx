import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'

export default function FinalOverview() {
  const { t } = useLanguage()
  const router = useRouter()
  const { flightId, tariffId, seats, baggage, meals, passengers } = router.query
  const [data, setData] = useState<any>(null)
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    if (!flightId || !tariffId) return
    
    const fetchData = async () => {
      const [flightRes, tariffRes, mealsRes] = await Promise.all([
        fetch(`/api/flights/${flightId}`),
        fetch(`/api/tariffs/${tariffId}`),
        fetch('/api/meals')
      ])
      
      const flight = await flightRes.json()
      const tariff = await tariffRes.json()
      const allMeals = await mealsRes.json()
      
      // Расчет стоимости
      let price = tariff.price
      
      // Скидки
      const passengerList = passengers ? JSON.parse(passengers as string) : []
      const totalPassengers = passengerList.length
      
      // Стоимость мест
      if (seats && tariff.class === 'economy' && !tariff.freeSeatRows?.split(',').some((r: string) => seats.toString().split(',')[0]?.startsWith(r))) {
        const seatPrice = 700 * (1 - (tariff.seatDiscount || 0) / 100)
        price += seatPrice
      }
      
      // Стоимость багажа
      const selectedBaggage = baggage ? (baggage as string).split(',').filter(Boolean) : []
      if (selectedBaggage.includes('baggage23')) price += 2500
      if (selectedBaggage.includes('baggage30')) price += 3500
      if (selectedBaggage.includes('sport')) price += 3000
      
      // Стоимость питания
      const selectedMeals = meals ? (meals as string).split(',').filter(Boolean) : []
      selectedMeals.forEach(mealId => {
        const meal = allMeals.find((m: any) => m.id === Number(mealId))
        if (meal) price += meal.price
      })
      
      setTotalPrice(price * totalPassengers)
      setData({ flight, tariff })
    }
    
    fetchData()
  }, [flightId, tariffId, seats, baggage, meals, passengers])

  if (!data) return <div className="card">Загрузка...</div>

  const handlePay = () => {
    router.push({
      pathname: '/payment',
      query: { ...router.query, totalPrice: totalPrice.toString() }
    })
  }

  return (
    <div className="card">
      <h2 className="card-title">{t.overview.title}</h2>
      
      <div style={{ display: 'grid', gap: '15px' }}>
        <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '10px' }}>
          <strong>🛫 {t.overview.flight}:</strong> {data.flight.flightNumber}
          <div style={{ marginTop: '5px', color: '#666' }}>
            {data.flight.fromAirport.city} → {data.flight.toAirport.city}
          </div>
        </div>
        
        <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '10px' }}>
          <strong>💰 {t.overview.tariff}:</strong> {data.tariff.name}
        </div>
        
        {seats && (
          <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '10px' }}>
            <strong>💺 {t.overview.seats}:</strong> {(seats as string).split(',').join(', ')}
          </div>
        )}
        
        {baggage && (
          <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '10px' }}>
            <strong>🧳 {t.overview.baggage}:</strong> {(baggage as string).split(',').filter(Boolean).join(', ')}
          </div>
        )}
        
        {meals && (
          <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '10px' }}>
            <strong>🍽️ {t.overview.meals}:</strong> {(meals as string).split(',').filter(Boolean).join(', ')}
          </div>
        )}
        
        <div style={{ 
          padding: '20px', 
          background: 'linear-gradient(135deg, #1a3a5c 0%, #2d5a8e 100%)', 
          color: 'white',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '18px', marginBottom: '5px' }}>{t.overview.total}</div>
          <div style={{ fontSize: '32px', fontWeight: 700 }}>
            {totalPrice.toLocaleString()} ₽
          </div>
        </div>
      </div>
      
      <button 
        className="btn btn-gold" 
        style={{ marginTop: '20px', width: '100%', fontSize: '18px', padding: '15px' }}
        onClick={handlePay}
      >
        {t.overview.pay}
      </button>
    </div>
  )
}
