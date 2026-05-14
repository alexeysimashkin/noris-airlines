import { useLanguage } from '@/context/LanguageContext'
import QRCode from './QRCode'

export default function BoardingPass({ booking }: { booking: any }) {
  const { t } = useLanguage()
  
  const flight = booking.flight
  const departureTime = new Date(flight.departureTime)
  const boardingStart = new Date(departureTime.getTime() - 40 * 60000)
  const boardingEnd = new Date(departureTime.getTime() - 20 * 60000)

  return (
    <div className="boarding-pass">
      <div className="boarding-pass-header">
        <div className="logo" style={{ fontSize: '24px' }}>NORIS</div>
        <div style={{ fontSize: '18px', fontWeight: 600, color: '#1a3a5c', marginTop: '10px' }}>
          {t.checkIn.boardingPass}
        </div>
      </div>
      
      <div className="boarding-pass-grid">
        <div className="boarding-pass-item">
          <div className="boarding-pass-label">Рейс</div>
          <div className="boarding-pass-value">{flight.flightNumber}</div>
        </div>
        <div className="boarding-pass-item">
          <div className="boarding-pass-label">Дата</div>
          <div className="boarding-pass-value">
            {departureTime.toLocaleDateString('ru-RU')}
          </div>
        </div>
        <div className="boarding-pass-item">
          <div className="boarding-pass-label">Отправление</div>
          <div className="boarding-pass-value">
            {flight.fromAirport.iata} {flight.fromAirport.city}
          </div>
        </div>
        <div className="boarding-pass-item">
          <div className="boarding-pass-label">Прибытие</div>
          <div className="boarding-pass-value">
            {flight.toAirport.iata} {flight.toAirport.city}
          </div>
        </div>
        <div className="boarding-pass-item">
          <div className="boarding-pass-label">Время вылета</div>
          <div className="boarding-pass-value">
            {departureTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div className="boarding-pass-item">
          <div className="boarding-pass-label">Время прилета</div>
          <div className="boarding-pass-value">
            {new Date(flight.arrivalTime).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div className="boarding-pass-item">
          <div className="boarding-pass-label">Посадка</div>
          <div className="boarding-pass-value">
            {boardingStart.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} - {boardingEnd.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div className="boarding-pass-item">
          <div className="boarding-pass-label">Пассажир</div>
          <div className="boarding-pass-value">
            {booking.passengers?.[0]?.passenger?.lastName} {booking.passengers?.[0]?.passenger?.firstName}
          </div>
        </div>
        <div className="boarding-pass-item">
          <div className="boarding-pass-label">Место</div>
          <div className="boarding-pass-value" style={{ fontSize: '24px', color: '#c4a962' }}>
            {booking.seats?.[0]?.seatNumber || '—'}
          </div>
        </div>
      </div>
      
      <div className="qr-code">
        <QRCode data={`NORIS-${flight.flightNumber}-${booking.bookingCode}`} />
        <p style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
          {t.checkIn.scanQR}
        </p>
      </div>
    </div>
  )
}
