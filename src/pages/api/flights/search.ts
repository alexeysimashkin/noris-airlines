import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient()

  try {
    const from = req.query.from as string
    const to = req.query.to as string

    if (!from || !to) {
      return res.json([])
    }

    const flights = await prisma.flight.findMany({
      where: {
        fromAirport: {
          OR: [
            { iata: from.toUpperCase() },
            { city: { contains: from, mode: 'insensitive' } }
          ]
        },
        toAirport: {
          OR: [
            { iata: to.toUpperCase() },
            { city: { contains: to, mode: 'insensitive' } }
          ]
        }
      },
      include: {
        fromAirport: true,
        toAirport: true,
        aircraft: true,
        tariffs: true
      },
      take: 20
    })

    return res.json(flights)
  } catch (e: any) {
    return res.json({ error: e.message })
  } finally {
    await prisma.$disconnect()
  }
}
