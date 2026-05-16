import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const meals = await prisma.meal.findMany({ orderBy: { id: 'asc' } })
    return res.json(meals)
  }
  if (req.method === 'POST') {
    const { name, description, price } = req.body
    const meal = await prisma.meal.create({ data: { name, description, price: Number(price) } })
    return res.json(meal)
  }
  if (req.method === 'DELETE') {
    await prisma.meal.delete({ where: { id: Number(req.query.id) } })
    return res.json({ success: true })
  }
  res.status(405).end()
}
