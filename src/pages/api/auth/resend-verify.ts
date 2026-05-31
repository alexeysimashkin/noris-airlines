import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Resend } from 'resend'
import crypto from 'crypto'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { email } = req.body

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.json({ success: false, message: 'Пользователь не найден' })
  if (user.verified) return res.json({ success: false, message: 'Email уже подтверждён' })

  const verifyToken = crypto.randomBytes(32).toString('hex')

  await prisma.user.update({
    where: { id: user.id },
    data: { verifyToken }
  })

  const resend = new Resend(process.env.RESEND_API_KEY)
  const baseUrl = 'https://noris.vercel.app'

  await resend.emails.send({
    from: 'Noris Airlines <onboarding@resend.dev>',
    to: email,
    subject: 'Подтверждение регистрации — Noris Airlines',
    html: `<div style="max-width:600px;margin:0 auto;padding:30px;font-family:Arial,sans-serif;background:#faf8ff;border-radius:12px">
      <h1 style="color:#6b3fa0">🛫 Noris Airlines</h1>
      <h2>Подтверждение регистрации</h2>
      <p>Для подтверждения email перейдите по ссылке:</p>
      <a href="${baseUrl}/api/auth/verify?token=${verifyToken}" style="display:inline-block;padding:14px 30px;background:#6b3fa0;color:white;text-decoration:none;border-radius:8px;font-weight:600;margin:20px 0">✅ Подтвердить email</a>
    </div>`
  })

  res.json({ success: true, message: '✅ Письмо отправлено повторно!' })
}
