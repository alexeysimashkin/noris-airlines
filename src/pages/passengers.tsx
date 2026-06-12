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
  documentType: string
  documentSeries: string
  documentNumber: string
  citizenship: string
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
      phone: '',
      documentType: 'passport',
      documentSeries: '',
      documentNumber: '',
      citizenship: 'Россия'
    }))
  )

  const updatePassenger = (index: number, field: keyof PassengerData, value: string) => {
    const updated = [...passengers]
    updated[index][field] = value
    setPassengers(updated)
  }

  const handleSubmit = () => {
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i]
      if (!p.lastName || !p.firstName || !p.birthDate || !p.email || !p.phone) {
        alert(`Заполните все обязательные поля для пассажира ${i + 1}`)
        return
      }
      if (!p.documentNumber) {
        alert(`Укажите номер документа для пассажира ${i + 1}`)
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
    <div className="card" style={{ maxWidth: 800, margin: '0 auto' }}>
      <h2 className="card-title">👤 Данные пассажиров</h2>

      {passengers.map((passenger, index) => (
        <div key={index} style={{
          marginBottom: 24,
          padding: 24,
          background: 'rgba(245, 243, 255, 0.5)',
          borderRadius: 16,
          border: '1px solid rgba(139, 92, 246, 0.08)'
        }}>
          <h4 style={{ marginBottom: 18, color: '#5b21b6', fontSize: 18, fontWeight: 700 }}>
            👤 Пассажир {index + 1}
          </h4>

          <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <div className="form-group">
              <label className="form-label">Фамилия *</label>
              <input type="text" className="form-input" value={passenger.lastName}
                onChange={e => updatePassenger(index, 'lastName', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Имя *</label>
              <input type="text" className="form-input" value={passenger.firstName}
                onChange={e => updatePassenger(index, 'firstName', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Отчество</label>
              <input type="text" className="form-input" value={passenger.middleName}
                onChange={e => updatePassenger(index, 'middleName', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Дата рождения *</label>
              <input type="date" className="form-input" value={passenger.birthDate}
                onChange={e => updatePassenger(index, 'birthDate', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Пол</label>
              <select className="form-select" value={passenger.gender}
                onChange={e => updatePassenger(index, 'gender', e.target.value)}>
                <option value="male">Мужской</option>
                <option value="female">Женский</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Гражданство</label>
              <select className="form-select" value={passenger.citizenship}
                onChange={e => updatePassenger(index, 'citizenship', e.target.value)}>
                <option>Россия</option><option>Беларусь</option><option>Казахстан</option>
                <option>Узбекистан</option><option>Таджикистан</option><option>Киргизия</option>
                <option>Армения</option><option>Грузия</option><option>Турция</option>
                <option>ОАЭ</option><option>Египет</option><option>Китай</option>
                <option>Вьетнам</option><option>Таиланд</option><option>Другое</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Тип документа</label>
              <select className="form-select" value={passenger.documentType}
                onChange={e => updatePassenger(index, 'documentType', e.target.value)}>
                <option value="passport">Загранпаспорт РФ</option>
                <option value="internal">Паспорт РФ</option>
                <option value="foreign">Иностранный паспорт</option>
                <option value="birth">Свидетельство о рождении</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Серия</label>
              <input type="text" className="form-input" placeholder="0000" maxLength={4}
                value={passenger.documentSeries}
                onChange={e => updatePassenger(index, 'documentSeries', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Номер документа *</label>
              <input type="text" className="form-input" placeholder="000000" maxLength={10}
                value={passenger.documentNumber}
                onChange={e => updatePassenger(index, 'documentNumber', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input type="email" className="form-input" value={passenger.email}
                onChange={e => updatePassenger(index, 'email', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Телефон *</label>
              <input type="tel" className="form-input" value={passenger.phone}
                onChange={e => updatePassenger(index, 'phone', e.target.value)} required />
            </div>
          </div>
        </div>
      ))}

      <button className="btn btn-primary btn-lg btn-block" onClick={handleSubmit}>
        Продолжить →
      </button>
    </div>
  )
}
