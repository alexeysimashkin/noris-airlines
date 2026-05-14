import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === 'GET') {
    const booking = await prisma.booking.findUnique({
      where: { id: Number(id) },
      include: {
        flight: {
          include: {
            fromAirport: true,
            toAirport: true,
            aircraft: true
          }
        },
        tariff: true,
        passengers: {
          include: {
            passenger: true
          }
        },
        seats: true,
        meals: {
          include: {
            meal: true
          }
        },
        baggage: true
      }
    })
    return res.json(booking)
  }

  res.status(405).end()
}
