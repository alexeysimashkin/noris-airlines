import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET — список рейсов
  if (req.method === 'GET') {
    try {
      const flights = await prisma.flight.findMany({
        include: {
          fromAirport: true,
          toAirport: true,
          aircraft: true
        },
        orderBy: { departureTime: 'asc' }
      })
      return res.status(200).json(flights)
    } catch (e: any) {
      return res.status(500).json({ error: e.message })
    }
  }

  // POST — создать рейс
  if (req.method === 'POST') {
    try {
      const {
        flightNumber,
        fromAirportId,
        toAirportId,
        aircraftId,
        departureTime,
        arrivalTime,
        durationMin,
        startDate,
        endDate,
        daysOfWeek
      } = req.body

      // Проверяем, что Aircraft есть, иначе создаём
      let aircraft = await prisma.aircraft.findFirst({ where: { id: Number(aircraftId) || 1 } })
      if (!aircraft) {
        aircraft = await prisma.aircraft.create({
          data: {
            type: "Boeing 737-800",
            model: "738",
            totalRows: 31,
            seatConfig: {
              business: { rows: [1, 2], seats: ["A", "C", "D"] },
              economy: { rows: Array.from({length: 29}, (_, i) => i + 3), seats: ["A", "B", "C", "D", "E", "F"] }
            }
          }
        })
      }

      const flight = await prisma.flight.create({
        data: {
          flightNumber,
          fromAirportId: Number(fromAirportId),
          toAirportId: Number(toAirportId),
          aircraftId: aircraft.id,
          departureTime: new Date(departureTime),
          arrivalTime: new Date(arrivalTime),
          durationMin: Number(durationMin) || 90,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          daysOfWeek: daysOfWeek || '1,2,3,4,5,6,7'
        }
      })

      return res.status(200).json(flight)
    } catch (e: any) {
      return res.status(200).json({ error: e.message })
    }
  }

  res.status(405).json({ error: 'Method not allowed' })
}
