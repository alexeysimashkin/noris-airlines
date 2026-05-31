import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === 'PUT') {
    try {
      const {
        flightNumber, fromAirportId, toAirportId,
        departureTime, arrivalTime, startDate, endDate, daysOfWeek,
        tariffLight, tariffStandard, tariffBusinessValue, tariffBusinessEasy
      } = req.body

      const departureDate = new Date(departureTime)
      const arrivalDate = new Date(arrivalTime)
      const offsetMinutes = departureDate.getTimezoneOffset()
      departureDate.setMinutes(departureDate.getMinutes() - offsetMinutes)
      arrivalDate.setMinutes(arrivalDate.getMinutes() - offsetMinutes)

      // Обновляем рейс
      const flight = await prisma.flight.update({
        where: { id: Number(id) },
        data: {
          flightNumber,
          fromAirportId: Number(fromAirportId),
          toAirportId: Number(toAirportId),
          departureTime: departureDate,
          arrivalTime: arrivalDate,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          daysOfWeek: daysOfWeek || '1,2,3,4,5,6,7'
        }
      })

      // Удаляем старые тарифы и создаём новые
      await prisma.flightTariff.deleteMany({ where: { flightId: Number(id) } })

      await prisma.flightTariff.createMany({
        data: [
          { flightId: Number(id), name: 'Лайт', description: 'Ручная кладь 10кг', price: Number(tariffLight) || 4500, baggage: 'Нет', handLuggage: '10кг', seatDiscount: 0, freeSeatRows: '', refundable: false, class: 'economy' },
          { flightId: Number(id), name: 'Стандарт', description: 'Ручная кладь 10кг + багаж 23кг', price: Number(tariffStandard) || 6500, baggage: '23кг', handLuggage: '10кг', seatDiscount: 50, freeSeatRows: '', refundable: false, class: 'economy' },
          { flightId: Number(id), name: 'Бизнес Выгодно', description: 'Ручная кладь 15кг + багаж 30кг', price: Number(tariffBusinessValue) || 12500, baggage: '30кг', handLuggage: '15кг', seatDiscount: 100, freeSeatRows: '1,2', refundable: false, class: 'business' },
          { flightId: Number(id), name: 'Бизнес Легко', description: 'Ручная кладь 15кг + 2 багажа 30кг', price: Number(tariffBusinessEasy) || 15000, baggage: '2x30кг', handLuggage: '15кг', seatDiscount: 100, freeSeatRows: '1,2', refundable: true, class: 'business' }
        ]
      })

      return res.json(flight)
    } catch (e: any) {
      return res.json({ error: e.message })
    }
  }

  res.status(405).json({ error: 'Method not allowed' })
}
