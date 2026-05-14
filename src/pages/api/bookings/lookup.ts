import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code, lastName } = req.query

  const booking = await prisma.booking.findFirst({
    where: {
      bookingCode: code?.toString(),
      passengers: {
        some: {
          passenger: {
            lastName: {
              contains: lastName?.toString(),
              mode: 'insensitive'
            }
          }
        }
      }
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
      baggage: true
    }
  })

  res.json(booking)
}
