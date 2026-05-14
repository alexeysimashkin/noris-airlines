import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const meals = await prisma.meal.findMany()
    return res.json(meals)
  }

  if (req.method === 'POST') {
    const { name, description, price } = req.body
    const meal = await prisma.meal.create({
      data: { name, description, price }
    })
    return res.json(meal)
  }

  res.status(405).end()
}
