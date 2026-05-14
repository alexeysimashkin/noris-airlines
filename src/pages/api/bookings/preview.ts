import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { flightId, tariffId } = req.query

  const [flight, tariff] = await Promise.all([
    prisma.flight.findUnique({
      where: { id: Number(flightId) },
      include: {
        fromAirport: true,
        toAirport: true,
        aircraft: true
      }
    }),
    prisma.flightTariff.findUnique({
      where: { id: Number(tariffId) }
    })
  ])

  res.json({ flight, tariff })
}
