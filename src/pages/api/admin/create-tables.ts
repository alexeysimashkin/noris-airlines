import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient()

  try {
    // Удаляем таблицу Booking и создаём заново с userId
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Booking" CASCADE`)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE "Booking" (
        id SERIAL PRIMARY KEY,
        "bookingCode" TEXT UNIQUE NOT NULL,
        "flightId" INTEGER NOT NULL,
        "tariffId" INTEGER NOT NULL,
        "totalPrice" DOUBLE PRECISION NOT NULL,
        status TEXT DEFAULT 'confirmed',
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "returnFlightId" INTEGER,
        "checkedIn" BOOLEAN DEFAULT false,
        "checkedInAt" TIMESTAMP,
        "userId" INTEGER
      )
    `)

    res.json({ success: true, message: '✅ Таблица Booking пересоздана с userId' })
  } catch (e: any) {
    res.json({ success: false, message: e.message })
  } finally {
    await prisma.$disconnect()
  }
}
