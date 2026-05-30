import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

interface SeatMapProps {
  tariffClass: string
  freeSeatRows?: string
  seatDiscount?: number
  onSelect: (seat: string) => void
  selectedSeat?: string
}

export default function SeatMap({ tariffClass, freeSeatRows, seatDiscount, onSelect, selectedSeat: initialSeat }: SeatMapProps) {
  const { t } = useLanguage()
  const [selectedSeat, setSelectedSeat] = useState<string | null>(initialSeat || null)

  const occupiedSeats = ['3A', '4B', '5C', '10A', '15F']
  const isBusiness = tariffClass === 'business'
  const freeRows = freeSeatRows?.split(',').map(Number) || []
  const businessSeats = ['A', 'C', 'D']
  const economySeats = ['A', 'B', 'C', 'D', 'E', 'F']

  const getSeatPrice = (row: number) => {
    if (freeRows.includes(row)) return 0
    if (isBusiness) return 0
    const basePrice = 700
    const discount = seatDiscount || 0
    return Math.round(basePrice * (1 - discount / 100))
  }

  const isSeatAvailable = (row: number, seat: string) => {
    if (isBusiness) {
      if (row <= 2 && businessSeats.includes(seat)) return true
      return false
    }
    if (row >= 3) return true
    return false
  }

  const handleSeatClick = (seatId: string) => {
    if (occupiedSeats.includes(seatId)) return
    const row = parseInt(seatId)
    const letter = seatId.replace(row.toString(), '')
    if (!isSeatAvailable(row, letter)) return
    setSelectedSeat(seatId)
    onSelect(seatId)
  }

  return (
    <div>
      <div style={{ marginBottom: '25px' }}>
        <h4 style={{ color: '#7c3aed', marginBottom: '10px', fontSize: '16px' }}>
          💎 Бизнес-класс (ряды 1–2)
          {isBusiness && <span style={{ fontSize: '12px', color: '#4caf50', marginLeft: '8px' }}>— доступен для вашего тарифа</span>}
          {!isBusiness && <span style={{ fontSize: '12px', color: '#999', marginLeft: '8px' }}>— только для бизнес-тарифов</span>}
        </h4>
        <div className="seat-map">
          {[1, 2].map(row => (
            <div key={row} className="seat-row">
              <span className="seat-row-label">{row}</span>
              {businessSeats.map(seat => {
                const seatId = `${row}${seat}`
                const occupied = occupiedSeats.includes(seatId)
                const selected = selectedSeat === seatId
                const available = isBusiness && !occupied
                return (
                  <div
                    key={seatId}
                    className={`seat business ${occupied ? 'occupied' : ''} ${selected ? 'selected' : ''} ${available && !selected ? 'available' : ''}`}
                    style={{ cursor: available ? 'pointer' : 'not-allowed', opacity: !isBusiness && !occupied ? 0.5 : 1 }}
                    onClick={() => available && handleSeatClick(seatId)}
                    title={available ? (getSeatPrice(row) === 0 ? 'Бесплатно' : getSeatPrice(row) + ' ₽') : occupied ? 'Занято' : 'Недоступно'}
                  >
                    {seat}
                  </div>
                )
              })}
              <span style={{ marginLeft: '15px', fontSize: '11px', color: '#7c3aed' }}>Бизнес</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 style={{ color: '#4caf50', marginBottom: '10px', fontSize: '16px' }}>
          ✈ Эконом-класс (ряды 3–31)
        </h4>
        <div className="seat-map">
          {Array.from({ length: 29 }, (_, i) => i + 3).map(row => (
            <div key={row} className="seat-row">
              <span className="seat-row-label">{row}</span>
              {economySeats.map((seat, index) => {
                const seatId = `${row}${seat}`
                const occupied = occupiedSeats.includes(seatId)
                const selected = selectedSeat === seatId
                const available = !occupied
                return (
                  <div key={seatId}>
                    {index === 3 && <div style={{ width: '22px', display: 'inline-block' }}></div>}
                    <div
                      className={`seat ${occupied ? 'occupied' : 'available'} ${selected ? 'selected' : ''}`}
                      style={{ cursor: occupied ? 'not-allowed' : 'pointer' }}
                      onClick={() => available && handleSeatClick(seatId)}
                      title={available ? (getSeatPrice(row) === 0 ? 'Бесплатно' : getSeatPrice(row) + ' ₽') : 'Занято'}
                    >
                      {seat}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div className="seat available" style={{ width: '24px', height: '24px' }}></div>
          <span style={{ fontSize: '13px' }}>Свободно</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div className="seat occupied" style={{ width: '24px', height: '24px' }}></div>
          <span style={{ fontSize: '13px' }}>Занято</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div className="seat selected" style={{ width: '24px', height: '24px' }}></div>
          <span style={{ fontSize: '13px' }}>Выбрано</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div className="seat business" style={{ width: '24px', height: '24px', opacity: 0.5 }}></div>
          <span style={{ fontSize: '13px' }}>Бизнес</span>
        </div>
      </div>
    </div>
  )
}
