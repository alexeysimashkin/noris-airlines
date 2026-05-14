import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'

interface Meal {
  id: number
  name: string
  description: string
  price: number
}

export default function MealSelection() {
  const { t } = useLanguage()
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
      <h2 className="card-title">{t.meal.title}</h2>
      
      <div style={{ display: 'grid', gap: '15px' }}>
        {meals.map(meal => (
          <div 
            key={meal.id}
            style={{ 
              padding: '20px',
              border: selectedMeals.includes(meal.id) ? '2px solid #1a3a5c' : '2px solid #e0e5ec',
              borderRadius: '10px',
              cursor: 'pointer',
              background: selectedMeals.includes(meal.id) ? '#f0f4f8' : 'white'
            }}
            onClick={() => toggleMeal(meal.id)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 600 }}>{meal.name}</div>
                <div style={{ fontSize: '14px', color: '#666' }}>{meal.description}</div>
              </div>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#1a3a5c' }}>
                {meal.price.toLocaleString()} ₽
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        className="btn btn-primary" 
        style={{ marginTop: '20px', width: '100%' }}
        onClick={() => router.push({
          pathname: '/passengers',
          query: { ...router.query, meals: selectedMeals.join(',') }
        })}
      >
        {selectedMeals.length > 0 ? t.common.continue : t.meal.continue}
      </button>
    </div>
  )
}
