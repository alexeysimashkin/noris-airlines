import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Resend } from 'resend'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { lastName, firstName, middleName, birthDate, gender, email, phone, password } = req.body

  if (!lastName || !firstName || !birthDate || !email || !phone || !password) {
    return res.json({ success: false, message: 'Все поля обязательны' })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return res.json({ success: false, message: 'Пользователь с таким email уже существует' })
  }

  const verifyToken = crypto.randomBytes(32).toString('hex')
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const user = await prisma.user.create({
      data: {
        lastName,
        firstName,
        middleName: middleName || '',
        birthDate: new Date(birthDate),
        gender,
        email,
        phone,
        password: hashedPassword,
        verifyToken,
        verified: false
      }
    })

    // Отправляем реальное письмо через Resend
    const resend = new Resend(process.env.RESEND_API_KEY)
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'

    await resend.emails.send({
      from: 'Noris Airlines <noreply@noris-airlines.ru>',
      to: email,
      subject: 'Подтверждение регистрации — Noris Airlines',
      html: `
        <div style="max-width:600px;margin:0 auto;padding:30px;font-family:Arial,sans-serif;background:#faf8ff;border-radius:12px">
          <h1 style="color:#6b3fa0">🛫 Noris Airlines</h1>
          <h2>Подтверждение регистрации</h2>
          <p>Здравствуйте, ${firstName}!</p>
          <p>Вы зарегистрировались на сайте Noris Airlines. Для подтверждения email перейдите по ссылке:</p>
          <a href="${baseUrl}/api/auth/verify?token=${verifyToken}" 
             style="display:inline-block;padding:14px 30px;background:#6b3fa0;color:white;text-decoration:none;border-radius:8px;font-weight:600;margin:20px 0">
            ✅ Подтвердить email
          </a>
          <p style="color:#999;font-size:12px;margin-top:20px">Если вы не регистрировались — проигнорируйте это письмо.</p>
        </div>
      `
    })

    res.json({ success: true, message: 'Регистрация успешна! Проверьте почту для подтверждения.' })
  } catch (e: any) {
    res.json({ success: false, message: e.message })
  } finally {
    await prisma.$disconnect()
  }
}
