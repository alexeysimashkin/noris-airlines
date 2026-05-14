import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === 'GET') {
    const tariff = await prisma.flightTariff.findUnique({
      where: { id: Number(id) }
    })
    return res.json(tariff)
  }

  res.status(405).end()
}
