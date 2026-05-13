import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

interface SeatMapProps {
  flightId: number
  tariffClass: string
  freeSeatRows?: string
  seatDiscount?: number
  onSelect: (seat: string) => void
}

export default function SeatMap({ flightId, tariffClass, freeSeatRows, seatDiscount, onSelect }: SeatMapProps) {
  const { t } = useLanguage()
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null)
  const [occupiedSeats] = useState<string[]>(['3A', '4B', '5C', '10A', '15F']) // Тестовые занятые места
  
  const isBusiness = tariffClass === 'business'
  const freeRows = freeSeatRows?.split(',').map(Number) || []
  const businessRows = [1, 2]
  const economyRows = Array.from({ length: 29 }, (_, i) => i + 3)
  const businessSeats = ['A', 'C', 'D']
  const economySeats = ['A', 'B', 'C', 'D', 'E', 'F']
  
  const getSeatPrice = (row: number) => {
    if (freeRows.includes(row)) return 0
    if (isBusiness) return 0
    const basePrice = 700
    const discount = seatDiscount || 0
    return basePrice * (1 - discount / 100)
  }

  const handleSeatClick = (seat: string) => {
    if (occupiedSeats.includes(seat)) return
    setSelectedSeat(seat)
    onSelect(seat)
  }

  return (
    <div>
      {isBusiness && (
        <div style={{ marginBottom: '30px' }}>
          <h4 style={{ color: '#9c27b0', marginBottom: '15px' }}>💎 {t.seat.business}</h4>
          <div className="seat-map">
            {businessRows.map(row => (
              <div key={row} className="seat-row">
                <span className="seat-row-label">{row}</span>
                <div style={{ width: '15px' }}></div>
                {businessSeats.map(seat => {
                  const seatId = `${row}${seat}`
                  const isOccupied = occupiedSeats.includes(seatId)
                  const isSelected = selectedSeat === seatId
                  
                  return (
                    <div
                      key={seatId}
                      className={`seat business ${isOccupied ? 'occupied' : 'available'} ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSeatClick(seatId)}
                    >
                      {seat}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div>
        <h4 style={{ color: '#4caf50', marginBottom: '15px' }}>✈ {t.seat.economy}</h4>
        <div className="seat-map">
          {economyRows.map(row => (
            <div key={row} className="seat-row">
              <span className="seat-row-label">{row}</span>
              {economySeats.map((seat, index) => {
                const seatId = `${row}${seat}`
                const isOccupied = occupiedSeats.includes(seatId)
                const isSelected = selectedSeat === seatId
                
                return (
                  <div key={seatId}>
                    {index === 3 && <div style={{ width: '25px' }}></div>}
                    <div
                      className={`seat ${isOccupied ? 'occupied' : 'available'} ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSeatClick(seatId)}
                      title={`${seatId} - ${getSeatPrice(row) > 0 ? getSeatPrice(row) + ' ₽' : t.seat.free}`}
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
      
      <div style={{ marginTop: '20px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div className="seat available" style={{ width: '20px', height: '20px' }}></div>
          <span>{t.seat.free}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div className="seat occupied" style={{ width: '20px', height: '20px' }}></div>
          <span>{t.seat.occupied}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div className="seat selected" style={{ width: '20px', height: '20px' }}></div>
          <span>{t.seat.selected}</span>
        </div>
      </div>
    </div>
  )
}
