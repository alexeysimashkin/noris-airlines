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
  const occupiedSeats = ['3A', '4B', '5C', '10A', '15F']
  const isBusiness = tariffClass === 'business'
  const freeRows = freeSeatRows?.split(',').map(Number) || []

  const handleSeatClick = (seatId: string, available: boolean) => {
    if (!available || occupiedSeats.includes(seatId)) return
    setSelectedSeat(seatId)
    onSelect(seatId)
  }

  return (
    <div>
      {/* Бизнес-класс */}
      <div style={{ marginBottom: 25 }}>
        <h4 style={{ color: '#7c3aed', marginBottom: 10, fontSize: 16 }}>
          💎 Бизнес-класс (ряды 1–2)
          {isBusiness && <span style={{ fontSize: 12, color: '#4caf50', marginLeft: 8 }}>— доступен для вашего тарифа</span>}
          {!isBusiness && <span style={{ fontSize: 12, color: '#999', marginLeft: 8 }}>— недоступен (только бизнес-тарифы)</span>}
        </h4>
        {[1, 2].map(row => (
          <div key={row} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
            <span style={{ width: 24, textAlign: 'right', fontWeight: 600, color: '#6b5b8a', fontSize: 13 }}>{row}</span>
            {['A', 'C', 'D'].map(seat => {
              const seatId = `${row}${seat}`
              const occupied = occupiedSeats.includes(seatId)
              const selected = selectedSeat === seatId
              const available = isBusiness && !occupied
              let bg = '#f5f3ff'
              let border = '1px solid #e8e0f0'
              let color = '#999'
              let cursor = 'not-allowed'
              if (occupied) { bg = '#f5f5f5'; color = '#ccc' }
              if (available) { bg = '#faf5ff'; border = '1px solid #c084fc'; color = '#7c3aed'; cursor = 'pointer' }
              if (selected) { bg = '#8b5cf6'; border = '1px solid #7c3aed'; color = 'white' }
              return (
                <div key={seatId} onClick={() => handleSeatClick(seatId, available)} style={{
                  width: 35, height: 35, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 600, background: bg, border, color, cursor, transition: 'all 0.2s'
                }}>{seat}</div>
              )
            })}
            <span style={{ marginLeft: 10, fontSize: 11, color: '#7c3aed' }}>Бизнес</span>
          </div>
        ))}
      </div>

      {/* Эконом-класс */}
      <div>
        <h4 style={{ color: '#4caf50', marginBottom: 10, fontSize: 16 }}>✈ Эконом-класс (ряды 3–31)</h4>
        {Array.from({ length: 29 }, (_, i) => i + 3).map(row => (
          <div key={row} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
            <span style={{ width: 24, textAlign: 'right', fontWeight: 600, color: '#6b5b8a', fontSize: 13 }}>{row}</span>
            {['A', 'B', 'C', 'D', 'E', 'F'].map((seat, idx) => {
              const seatId = `${row}${seat}`
              const occupied = occupiedSeats.includes(seatId)
              const selected = selectedSeat === seatId
              const available = !occupied
              let bg = '#f0fdf0'
              let border = '1px solid #86efac'
              let color = '#166534'
              let cursor = 'pointer'
              if (occupied) { bg = '#f5f5f5'; border = '1px solid #e0d8f0'; color = '#ccc'; cursor = 'not-allowed' }
              if (selected) { bg = '#8b5cf6'; border = '1px solid #7c3aed'; color = 'white' }
              const gap = idx === 3 ? { marginLeft: 22 } : {}
              return (
                <div key={seatId} onClick={() => handleSeatClick(seatId, available)} style={{
                  width: 35, height: 35, borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 600, background: bg, border, color, cursor, transition: 'all 0.2s', ...gap
                }}>{seat}</div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Легенда */}
      <div style={{ marginTop: 20, display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 20, height: 20, borderRadius: 6, background: '#f0fdf0', border: '1px solid #86efac' }}></div><span style={{ fontSize: 12 }}>Свободно</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 20, height: 20, borderRadius: 6, background: '#f5f5f5', border: '1px solid #ddd' }}></div><span style={{ fontSize: 12 }}>Занято</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 20, height: 20, borderRadius: 6, background: '#8b5cf6' }}></div><span style={{ fontSize: 12 }}>Выбрано</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 20, height: 20, borderRadius: 6, background: '#faf5ff', border: '1px solid #c084fc' }}></div><span style={{ fontSize: 12 }}>Бизнес</span></div>
      </div>
    </div>
  )
}
