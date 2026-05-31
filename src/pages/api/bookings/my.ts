import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  const { email } = req.query

  if (!email) return res.json([])

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          {
            passengers: {
              some: {
                passenger: {
                  email: { equals: email as string, mode: 'insensitive' }
                }
              }
            }
          },
          {
            user: {
              email: { equals: email as string, mode: 'insensitive' }
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
        meals: {
          include: {
            meal: true
          }
        },
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

    return res.json(bookings)
  } catch (e: any) {
    console.error('Bookings error:', e)
    return res.status(500).json({ error: e.message })
  } finally {
    await prisma.$disconnect()
  }
}
