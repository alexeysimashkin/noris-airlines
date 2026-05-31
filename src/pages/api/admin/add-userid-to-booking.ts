import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "userId" INTEGER`)
    res.json({ success: true, message: '✅ Колонка userId добавлена в Booking' })
  } catch (e: any) {
    res.json({ success: false, message: e.message })
  } finally {
    await prisma.$disconnect()
  }
}
