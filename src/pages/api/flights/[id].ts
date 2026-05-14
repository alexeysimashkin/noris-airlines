import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === 'GET') {
    const flight = await prisma.flight.findUnique({
      where: { id: Number(id) },
      include: {
        fromAirport: true,
        toAirport: true,
        aircraft: true,
        tariffs: true
      }
    })
    return res.json(flight)
  }

  if (req.method === 'PUT') {
    const data = req.body
    const flight = await prisma.flight.update({
      where: { id: Number(id) },
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

  if (req.method === 'DELETE') {
    await prisma.flight.delete({
      where: { id: Number(id) }
    })
    return res.json({ success: true })
  }

  res.status(405).end()
}
