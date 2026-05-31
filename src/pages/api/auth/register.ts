import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
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
    if (!existing.verified) {
      return res.json({
        success: false,
        message: 'Пользователь уже зарегистрирован, но email не подтверждён.',
        resendLink: `/resend-verify`
      })
    }
    return res.json({ success: false, message: 'Пользователь с таким email уже существует' })
  }

  const verifyToken = crypto.randomBytes(32).toString('hex')
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    await prisma.user.create({
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

    // Пробуем отправить письмо, но не падаем если ошибка
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://noris.vercel.app'

      await resend.emails.send({
        from: 'Noris Airlines <onboarding@resend.dev>',
        to: email,
        subject: 'Подтверждение регистрации — Noris Airlines',
        html: `<div style="max-width:600px;margin:0 auto;padding:30px;font-family:Arial,sans-serif;background:#faf8ff;border-radius:12px">
          <h1 style="color:#6b3fa0">🛫 Noris Airlines</h1>
          <h2>Подтверждение регистрации</h2>
          <p>Здравствуйте, ${firstName}!</p>
          <p>Для подтверждения email перейдите по ссылке:</p>
          <a href="${baseUrl}/api/auth/verify?token=${verifyToken}" style="display:inline-block;padding:14px 30px;background:#6b3fa0;color:white;text-decoration:none;border-radius:8px;font-weight:600;margin:20px 0">✅ Подтвердить email</a>
        </div>`
      })
    } catch (mailError) {
      console.log('Email not sent (Resend free tier):', mailError)
    }

    // Показываем ссылку для подтверждения прямо на экране
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://noris.vercel.app'
    const verifyLink = `${baseUrl}/api/auth/verify?token=${verifyToken}`

    res.json({
      success: true,
      message: 'Регистрация успешна!',
      verifyLink,
      info: 'Нажмите на ссылку ниже чтобы подтвердить email (письмо также отправлено на почту)'
    })
  } catch (e: any) {
    res.json({ success: false, message: e.message })
  } finally {
    await prisma.$disconnect()
  }
}
