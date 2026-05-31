import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  const { email } = req.query

  if (!email) return res.json([])

  const bookings = await prisma.booking.findMany({
    where: {
      OR: [
        { userId: { not: null }, user: { email: email as string } },
        {
          passengers: {
            some: {
              passenger: {
                email: { equals: email as string, mode: 'insensitive' }
              }
            }
          }
        }
      ]
    },
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
      meals: { include: { meal: true } },
      baggage: true,
      payment: true,
      returnFlight: {
        include: {
          fromAirport: true,
          toAirport: true,
          aircraft: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  res.json(bookings)
}
