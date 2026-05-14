import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const flights = await prisma.flight.findMany({
      include: {
        fromAirport: true,
        toAirport: true,
        aircraft: true
      },
      orderBy: { departureTime: 'asc' }
    })
    return res.json(flights)
  }

  if (req.method === 'POST') {
    const data = req.body
    
    const flight = await prisma.flight.create({
      data: {
        flightNumber: data.flightNumber,
        fromAirportId: data.fromAirportId,
        toAirportId: data.toAirportId,
        aircraftId: data.aircraftId,
        departureTime: new Date(data.departureTime),
        arrivalTime: new Date(data.arrivalTime),
        durationMin: data.durationMin,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        daysOfWeek: data.daysOfWeek
      }
    })
    
    return res.json(flight)
  }

  res.status(405).end()
}
