import { useRouter } from 'next/router'
import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

interface PassengerData {
  firstName: string
  lastName: string
  middleName: string
  birthDate: string
  gender: string
  email: string
  phone: string
}

export default function Passengers() {
  const { t } = useLanguage()
  const router = useRouter()

  const totalPassengers =
    (Number(router.query.adult) || 0) +
    (Number(router.query.child) || 0) +
    (Number(router.query.infantWithSeat) || 0) +
    (Number(router.query.infantNoSeat) || 0) +
    (Number(router.query.senior) || 0)

  const [passengers, setPassengers] = useState<PassengerData[]>(
    Array.from({ length: totalPassengers || 1 }, () => ({
      firstName: '',
      lastName: '',
      middleName: '',
      birthDate: '',
      gender: 'male',
      email: '',
      phone: ''
    }))
  )

  const updatePassenger = (index: number, field: keyof PassengerData, value: string) => {
    const updated = [...passengers]
    updated[index][field] = value
    setPassengers(updated)
  }

  const handleSubmit = () => {
    // Проверяем, что все обязательные поля заполнены
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i]
      if (!p.lastName || !p.firstName || !p.birthDate || !p.email || !p.phone) {
        alert(`Заполните все обязательные поля для пассажира ${i + 1}`)
        return
      }
    }

    router.push({
      pathname: '/final-overview',
      query: {
        ...router.query,
        passengers: JSON.stringify(passengers)
      }
    })
  }

  return (
    <div className="card">
      <h2 className="card-title">{t.passenger.title}</h2>

      {passengers.map((passenger, index) => (
        <div key={index} style={{
          marginBottom: '25px',
          padding: '20px',
          background: '#faf8ff',
          borderRadius: '12px',
          border: '1px solid #e8e0f0'
        }}>
          <h4 style={{ marginBottom: '15px', color: '#6b3fa0' }}>👤 Пассажир {index + 1}</h4>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">{t.passenger.lastName} *</label>
              <input type="text" className="form-input"
                value={passenger.lastName}
                onChange={e => updatePassenger(index, 'lastName', e.target.value)}
                required />
            </div>
            <div className="form-group">
              <label className="form-label">{t.passenger.firstName} *</label>
              <input type="text" className="form-input"
                value={passenger.firstName}
                onChange={e => updatePassenger(index, 'firstName', e.target.value)}
                required />
            </div>
            <div className="form-group">
              <label className="form-label">{t.passenger.middleName}</label>
              <input type="text" className="form-input"
                value={passenger.middleName}
                onChange={e => updatePassenger(index, 'middleName', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">{t.passenger.birthDate} *</label>
              <input type="date" className="form-input"
                value={passenger.birthDate}
                onChange={e => updatePassenger(index, 'birthDate', e.target.value)}
                required />
            </div>
            <div className="form-group">
              <label className="form-label">{t.passenger.gender}</label>
              <select className="form-select"
                value={passenger.gender}
                onChange={e => updatePassenger(index, 'gender', e.target.value)}>
                <option value="male">{t.passenger.male}</option>
                <option value="female">{t.passenger.female}</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{t.passenger.email} *</label>
              <input type="email" className="form-input"
                value={passenger.email}
                onChange={e => updatePassenger(index, 'email', e.target.value)}
                required />
            </div>
            <div className="form-group">
              <label className="form-label">{t.passenger.phone} *</label>
              <input type="tel" className="form-input"
                value={passenger.phone}
                onChange={e => updatePassenger(index, 'phone', e.target.value)}
                required />
            </div>
          </div>
        </div>
      ))}

      <button className="btn btn-primary" style={{ width: '100%', fontSize: '18px', padding: '16px' }}
        onClick={handleSubmit}>
        {t.passenger.continue}
      </button>
    </div>
  )
}
