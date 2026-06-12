import { useState } from 'react'

interface SeatMapProps {
  tariffClass: string
  freeSeatRows?: string
  seatDiscount?: number
  onSelect: (seat: string) => void
  selectedSeat?: string
}

export default function SeatMap({ tariffClass, freeSeatRows, seatDiscount, onSelect, selectedSeat: initialSeat }: SeatMapProps) {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(initialSeat || null)
  const isBusiness = tariffClass === 'business'

  // ~85% занятости, свободные равномерно: у окна, в середине, с краю
  const freeSeats = [
    '1A', '2D',
    '3A', '3F', '4C', '4D', '5B', '5E', '6A', '6F',
    '7C', '7D', '8A', '8F', '9B', '9E', '10C', '10D',
    '11A', '11F', '12B', '12E', '13C', '13D', '14A', '14F',
    '15B', '15E', '16C', '16D', '17A', '17F', '18B', '18E',
    '19C', '19D', '20A', '20F', '21B', '21E', '22C', '22D',
    '23A', '23F', '24B', '24E', '25C', '25D', '26A', '26F',
    '27B', '27E', '28C', '28D', '29A', '29F',
    '30B', '30E', '31C', '31D'
  ]

  const allRows = Array.from({ length: 31 }, (_, i) => i + 1)
  const businessSeatsArr = ['A', 'C', 'D']
  const economySeatsArr = ['A', 'B', 'C', 'D', 'E', 'F']

  const isOccupied = (seatId: string) => !freeSeats.includes(seatId)

  const handleClick = (seatId: string) => {
    if (isOccupied(seatId)) return
    setSelectedSeat(seatId)
    onSelect(seatId)
  }

  return (
    <div>
      {/* Бизнес */}
      <div style={{ marginBottom: 20 }}>
        <h4 style={{ fontWeight: 700, fontSize: 14, color: '#7c3aed', marginBottom: 8 }}>💎 Бизнес-класс</h4>
        {[1, 2].map(row => (
          <div key={row} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ width: 22, fontWeight: 700, fontSize: 12, color: '#7c3aed', textAlign: 'right' }}>{row}</span>
            {businessSeatsArr.map(seat => {
              const seatId = `${row}${seat}`
              const occ = isOccupied(seatId)
              const sel = selectedSeat === seatId
              const avail = isBusiness && !occ
              return (
                <div key={seatId}
                  onClick={() => avail && handleClick(seatId)}
                  className={`seat business ${occ ? 'occupied' : ''} ${sel ? 'selected' : ''} ${avail && !sel ? 'available' : ''}`}
                  style={{ cursor: avail ? 'pointer' : 'not-allowed', opacity: !isBusiness && !occ ? 0.35 : 1 }}>
                  {seat}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Эконом */}
      <div>
        <h4 style={{ fontWeight: 700, fontSize: 14, color: '#166534', marginBottom: 8 }}>✈ Эконом-класс</h4>
        {Array.from({ length: 29 }, (_, i) => i + 3).map(row => (
          <div key={row} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
            <span style={{ width: 22, fontWeight: 600, fontSize: 11, color: '#9ca3af', textAlign: 'right' }}>{row}</span>
            {economySeatsArr.map((seat, idx) => {
              const seatId = `${row}${seat}`
              const occ = isOccupied(seatId)
              const sel = selectedSeat === seatId
              const avail = !occ
              return (
                <div key={seatId}
                  onClick={() => avail && handleClick(seatId)}
                  className={`seat ${occ ? 'occupied' : 'available'} ${sel ? 'selected' : ''}`}
                  style={{ marginLeft: idx === 3 ? 16 : 0, cursor: occ ? 'not-allowed' : 'pointer' }}>
                  {seat}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 16, fontSize: 12, color: '#6b7280' }}>
        <span>🟢 Свободно</span><span>⚫ Занято</span><span>🟣 Выбрано</span>
      </div>
    </div>
  )
}
