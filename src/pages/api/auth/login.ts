import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, password } = req.body

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    return res.json({ success: false, message: 'Пользователь не найден' })
  }

  if (!user.verified) {
    return res.json({ success: false, message: 'Email не подтверждён. Проверьте почту.' })
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return res.json({ success: false, message: 'Неверный пароль' })
  }

  // Возвращаем данные пользователя (без пароля)
  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    }
  })
}
