import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
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
    res.json({ success: true, message: '✅ Таблица User создана' })
  } catch (e: any) {
    res.json({ success: false, message: e.message })
  } finally {
    await prisma.$disconnect()
  }
}
