import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === 'POST') {
    const { refundAmount } = req.body

    await prisma.booking.update({
      where: { id: Number(id) },
      data: { status: 'refunded' }
    })

    // Создаем запись о возврате
    await prisma.payment.create({
      data: {
        bookingId: Number(id),
        amount: -Number(refundAmount),
        status: 'refunded',
        method: 'refund'
      }
    })

    return res.json({ success: true, refundAmount })
  }

  res.status(405).end()
}
