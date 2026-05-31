import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.query

  if (!token) {
    return res.redirect('/login?verified=error')
  }

  const user = await prisma.user.findFirst({
    where: { verifyToken: token as string }
  })

  if (!user) {
    return res.redirect('/login?verified=invalid')
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { verified: true, verifyToken: null }
  })

  res.redirect('/login?verified=success')
}
