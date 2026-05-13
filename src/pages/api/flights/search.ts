import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  const { from, to, departureDate } = req.query

  const flights = await prisma.flight.findMany({
    where: {
      fromAirport: {
        OR: [
          { iata: from?.toString().toUpperCase() },
          { city: { contains: from?.toString(), mode: 'insensitive' } }
        ]
      },
      toAirport: {
        OR: [
          { iata: to?.toString().toUpperCase() },
          { city: { contains: to?.toString(), mode: 'insensitive' } }
        ]
      },
      startDate: { lte: new Date(departureDate as string) },
      endDate: { gte: new Date(departureDate as string) }
    },
    include: {
      fromAirport: true,
      toAirport: true,
      aircraft: true,
      tariffs: {
        where: { name: 'Лайт' },
        take: 1
      }
    }
  })

  res.json(flights)
}
