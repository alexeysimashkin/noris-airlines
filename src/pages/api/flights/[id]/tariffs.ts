import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === 'GET') {
    const tariffs = await prisma.flightTariff.findMany({
      where: { flightId: Number(id) }
    })
    return res.json(tariffs)
  }

  res.status(405).end()
}
