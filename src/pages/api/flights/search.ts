import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { from, to, departureDate } = req.query

    if (!from || !to) {
      return res.json([])
    }

    const flights = await prisma.flight.findMany({
      where: {
        fromAirport: {
          OR: [
            { iata: { equals: from.toString().toUpperCase(), mode: 'insensitive' } },
            { city: { contains: from.toString(), mode: 'insensitive' } }
          ]
        },
        toAirport: {
          OR: [
            { iata: { equals: to.toString().toUpperCase(), mode: 'insensitive' } },
            { city: { contains: to.toString(), mode: 'insensitive' } }
          ]
        }
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

    return res.json(flights)
  } catch (e: any) {
    console.error('Search error:', e)
    return res.status(500).json({ error: e.message })
  }
}
