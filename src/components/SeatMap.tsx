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

  // 93% мест занято — свободны только несколько
  const occupiedSeats = [
    '1A','1C','1D','2A','2C','2D',
    '3A','3B','3C','3D','3E','3F',
    '4A','4B','4C','4D','4E','4F',
    '5A','5B','5C','5D','5E','5F',
    '6A','6B','6C','6D','6E','6F',
    '7A','7B','7C','7D','7E','7F',
    '8A','8B','8C','8D','8E','8F',
    '9A','9B','9C','9D','9E',
    '10A','10B','10C','10D','10E','10F',
    '11A','11B','11C','11D','11E',
    '12A','12B','12C','12D','12E','12F',
    '13A','13B','13C','13D','13E','13F',
    '14A','14B','14C','14D','14E','14F',
    '15A','15B','15C','15D','15E','15F',
    '16A','16B','16C','16D','16E','16F',
    '17A','17B','17C','17D','17E','17F',
    '18A','18B','18C','18D','18E','18F',
    '19A','19B','19C','19D','19E','19F',
    '20A','20B','20C','20D','20E','20F',
    '21A','21B','21C','21D','21E','21F',
    '22A','22B','22C','22D','22E',
    '23A','23B','23C','23D','23E','23F',
    '24A','24B','24C','24D','24E','24F',
    '25A','25B','25C','25D','25E','25F',
    '26A','26B','26C','26D','26E','26F',
    '27A','27B','27C','27D','27E','27F',
    '28A','28B','28C','28D','28E','28F',
    '29A','29B','29C','29D','29E','29F',
    '30A','30B','30C','30D','30E','30F',
    '31A','31B','31C','31D','31E','31F',
  ]

  const handleSeatClick = (seatId: string, available: boolean) => {
    if (!available || occupiedSeats.includes(seatId)) return
    setSelectedSeat(seatId)
    onSelect(seatId)
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ fontWeight: 700, fontSize: 14, color: '#7c3aed', marginBottom: 10 }}>💎 Бизнес-класс (ряды 1–2)</h4>
        {[1, 2].map(row => (
          <div key={row} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
            <span style={{ width: 22, textAlign: 'right', fontWeight: 700, fontSize: 12, color: '#7c3aed' }}>{row}</span>
            {['A','C','D'].map(seat => {
              const seatId = `${row}${seat}`
              const occ = occupiedSeats.includes(seatId)
              const sel = selectedSeat === seatId
              const avail = isBusiness && !occ
              return <div key={seatId} onClick={() => handleSeatClick(seatId, avail)}
                className={`seat business ${occ ? 'occupied' : ''} ${sel ? 'selected' : ''} ${avail && !sel ? 'available' : ''}`}
                style={{ cursor: avail ? 'pointer' : 'not-allowed', opacity: !isBusiness && !occ ? 0.4 : 1 }}>
                {seat}
              </div>
            })}
          </div>
        ))}
      </div>

      <div>
        <h4 style={{ fontWeight: 700, fontSize: 14, color: '#166534', marginBottom: 10 }}>✈ Эконом-класс (ряды 3–31)</h4>
        {Array.from({ length: 29 }, (_, i) => i + 3).map(row => (
          <div key={row} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ width: 22, textAlign: 'right', fontWeight: 600, fontSize: 11, color: '#9ca3af' }}>{row}</span>
            {['A','B','C','D','E','F'].map((seat, idx) => {
              const seatId = `${row}${seat}`
              const occ = occupiedSeats.includes(seatId)
              const sel = selectedSeat === seatId
              const avail = !occ
              return <div key={seatId} onClick={() => handleSeatClick(seatId, avail)}
                className={`seat ${occ ? 'occupied' : 'available'} ${sel ? 'selected' : ''}`}
                style={{ marginLeft: idx === 3 ? 16 : 0, cursor: occ ? 'not-allowed' : 'pointer' }}>
                {seat}
              </div>
            })}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 20, fontSize: 12, color: '#6b7280' }}>
        <span>🟢 Свободно</span><span>⚫ Занято</span><span>🟣 Выбрано</span>
      </div>
    </div>
  )
}
