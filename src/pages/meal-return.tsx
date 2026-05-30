import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

interface Meal {
  id: number
  name: string
  description: string
  price: number
}

export default function MealReturn() {
  const router = useRouter()
  const [meals, setMeals] = useState<Meal[]>([])
  const [selectedMeals, setSelectedMeals] = useState<number[]>([])

  useEffect(() => {
    fetch('/api/meals')
      .then(res => res.json())
      .then(setMeals)
  }, [])

  const toggleMeal = (id: number) => {
    setSelectedMeals(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    )
  }

  return (
    <div className="card">
      <h2 className="card-title">Питание на борту — обратный рейс</h2>

      <div style={{ display: 'grid', gap: 15 }}>
        {meals.map(meal => (
          <div
            key={meal.id}
            onClick={() => toggleMeal(meal.id)}
            style={{
              padding: 20,
              border: selectedMeals.includes(meal.id) ? '2px solid #6b3fa0' : '2px solid #e8e0f0',
              borderRadius: 10,
              cursor: 'pointer',
              background: selectedMeals.includes(meal.id) ? '#f5f3ff' : 'white'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{meal.name}</div>
                <div style={{ fontSize: 14, color: '#666' }}>{meal.description}</div>
              </div>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#6b3fa0' }}>
                {meal.price.toLocaleString()} ₽
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        className="btn btn-primary"
        style={{ marginTop: 20, width: '100%' }}
        onClick={() => router.push({
          pathname: '/overview',
          query: {
            ...router.query,
            returnMeals: selectedMeals.join(',')
          }
        })}
      >
        {selectedMeals.length > 0 ? 'Продолжить' : 'Продолжить без питания'}
      </button>
    </div>
  )
}
