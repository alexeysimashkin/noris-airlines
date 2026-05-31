import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const results: string[] = []

  try {
    // Добавляем колонку
    await prisma.$executeRawUnsafe(`ALTER TABLE "Booking" ADD COLUMN "userId" INTEGER`)
    results.push('✅ userId добавлен')
  } catch (e: any) {
    results.push('⚠️ ' + e.message)
  }

  try {
    // Создаём таблицу User если нет
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "User" (
        id SERIAL PRIMARY KEY,
        "lastName" TEXT NOT NULL,
        "firstName" TEXT NOT NULL,
        "middleName" TEXT,
        "birthDate" TIMESTAMP NOT NULL,
        gender TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT NOT NULL,
        password TEXT NOT NULL,
        verified BOOLEAN DEFAULT false,
        "verifyToken" TEXT,
        "createdAt" TIMESTAMP DEFAULT NOW()
      )
    `)
    results.push('✅ User создан')
  } catch (e: any) {
    results.push('⚠️ ' + e.message)
  }

  res.json({ success: true, results })
}
