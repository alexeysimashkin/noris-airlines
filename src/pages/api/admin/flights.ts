import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const flights = await prisma.flight.findMany({
      include: { fromAirport: true, toAirport: true, aircraft: true, tariffs: true },
      orderBy: { departureTime: 'asc' }
    })
    return res.json(flights)
  }

  if (req.method === 'POST') {
    try {
      const {
        flightNumber, fromAirportId, toAirportId,
        departureTime, arrivalTime, startDate, endDate, daysOfWeek,
        tariffLight, tariffStandard, tariffBusinessValue, tariffBusinessEasy
      } = req.body

      // Преобразуем локальное время в UTC, вычитая часовой пояс
      const departureDate = new Date(departureTime)
      const arrivalDate = new Date(arrivalTime)
      
      // Получаем смещение часового пояса в минутах и компенсируем
      const offsetMinutes = departureDate.getTimezoneOffset()
      departureDate.setMinutes(departureDate.getMinutes() - offsetMinutes)
      arrivalDate.setMinutes(arrivalDate.getMinutes() - offsetMinutes)

      const flight = await prisma.flight.create({
        data: {
          flightNumber,
          fromAirportId: Number(fromAirportId),
          toAirportId: Number(toAirportId),
          aircraftId: 1,
          departureTime: departureDate,
          arrivalTime: arrivalDate,
          durationMin: 90,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          daysOfWeek: daysOfWeek || '1,2,3,4,5,6,7',
          tariffs: {
            create: [
              { name: 'Лайт', description: 'Ручная кладь 10кг', price: Number(tariffLight) || 4500, baggage: 'Нет', handLuggage: '10кг', seatDiscount: 0, freeSeatRows: '', refundable: false, class: 'economy' },
              { name: 'Стандарт', description: 'Ручная кладь 10кг + багаж 23кг', price: Number(tariffStandard) || 6500, baggage: '23кг', handLuggage: '10кг', seatDiscount: 50, freeSeatRows: '', refundable: false, class: 'economy' },
              { name: 'Бизнес Выгодно', description: 'Ручная кладь 15кг + багаж 30кг', price: Number(tariffBusinessValue) || 12500, baggage: '30кг', handLuggage: '15кг', seatDiscount: 100, freeSeatRows: '1,2', refundable: false, class: 'business' },
              { name: 'Бизнес Легко', description: 'Ручная кладь 15кг + 2 багажа 30кг', price: Number(tariffBusinessEasy) || 15000, baggage: '2x30кг', handLuggage: '15кг', seatDiscount: 100, freeSeatRows: '1,2', refundable: true, class: 'business' }
            ]
          }
        }
      })

      return res.json(flight)
    } catch (e: any) {
      return res.json({ error: e.message })
    }
  }

  res.status(405).json({ error: 'Method not allowed' })
}
