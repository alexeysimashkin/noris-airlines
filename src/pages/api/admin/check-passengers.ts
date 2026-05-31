import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const passengers = await prisma.passenger.findMany({ take: 10 })
  const bookings = await prisma.booking.findMany({
    include: { passengers: { include: { passenger: true } } },
    take: 5
  })
  res.json({ passengers, bookings })
}
