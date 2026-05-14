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
      // Сначала создаём таблицу Aircraft если нет
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Aircraft" (
          id SERIAL PRIMARY KEY,
          type TEXT NOT NULL,
          model TEXT NOT NULL,
          "totalRows" INTEGER NOT NULL,
          "seatConfig" JSONB NOT NULL
        )
      `);

      // Добавляем самолёт если нет
      await prisma.$executeRawUnsafe(`
        INSERT INTO "Aircraft" (id, type, model, "totalRows", "seatConfig") 
        VALUES (1, 'Boeing 737-800', '738', 31, '{"business":{"rows":[1,2],"seats":["A","C","D"]},"economy":{"rows":[3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],"seats":["A","B","C","D","E","F"]}}')
        ON CONFLICT (id) DO NOTHING
      `);

      // Создаём Flight если нет
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Flight" (
          id SERIAL PRIMARY KEY,
          "flightNumber" TEXT UNIQUE NOT NULL,
          "fromAirportId" INTEGER NOT NULL,
          "toAirportId" INTEGER NOT NULL,
          "aircraftId" INTEGER NOT NULL,
          "departureTime" TIMESTAMP NOT NULL,
          "arrivalTime" TIMESTAMP NOT NULL,
          "durationMin" INTEGER NOT NULL,
          "startDate" TIMESTAMP NOT NULL,
          "endDate" TIMESTAMP NOT NULL,
          "daysOfWeek" TEXT NOT NULL
        )
      `);

      const {
        flightNumber,
        fromAirportId,
        toAirportId,
        departureTime,
        arrivalTime,
        startDate,
        endDate,
        daysOfWeek
      } = req.body

      const flight = await prisma.flight.create({
        data: {
          flightNumber,
          fromAirportId: Number(fromAirportId),
          toAirportId: Number(toAirportId),
          aircraftId: 1,
          departureTime: new Date(departureTime),
          arrivalTime: new Date(arrivalTime),
          durationMin: 90,
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
