import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const bookings = await prisma.booking.findMany({
      include: {
        flight: { include: { fromAirport: true, toAirport: true } },
        tariff: true,
        passengers: { include: { passenger: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    })
    return res.json(bookings)
  }

  if (req.method === 'POST') {
    try {
      const { flightId, tariffId, email, firstName, lastName, phone, seat, meal } = req.body

      // Находим или создаём пассажира
      let passenger = await prisma.passenger.findFirst({ where: { email } })
      if (!passenger) {
        passenger = await prisma.passenger.create({
          data: {
            firstName,
            lastName,
            middleName: '',
            birthDate: new Date('1990-01-01'),
            gender: 'male',
            email,
            phone: phone || '+70000000000',
            passengerType: 'adult'
          }
        })
      }

      // Получаем тариф для расчёта цены
      const tariff = await prisma.flightTariff.findUnique({ where: { id: Number(tariffId) } })
      let totalPrice = tariff?.price || 0

      // Генерируем код бронирования
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      const numbers = '0123456789'
      let code = ''
      for (let i = 0; i < 3; i++) {
        code += letters[Math.floor(Math.random() * letters.length)]
        code += numbers[Math.floor(Math.random() * numbers.length)]
      }

      const booking = await prisma.booking.create({
        data: {
          bookingCode: code,
          flightId: Number(flightId),
          tariffId: Number(tariffId),
          totalPrice,
          status: 'confirmed',
          passengers: {
            create: { passengerId: passenger.id }
          }
        }
      })

      // Место
      if (seat) {
        await prisma.bookingSeat.create({
          data: { bookingId: booking.id, passengerId: passenger.id, seatNumber: seat, price: 700 }
        })
        totalPrice += 700
        await prisma.booking.update({ where: { id: booking.id }, data: { totalPrice } })
      }

      // Питание
      if (meal) {
        const mealData = await prisma.meal.findUnique({ where: { id: Number(meal) } })
        if (mealData) {
          await prisma.bookingMeal.create({
            data: { bookingId: booking.id, mealId: Number(meal), passengerId: passenger.id, quantity: 1 }
          })
          totalPrice += mealData.price
          await prisma.booking.update({ where: { id: booking.id }, data: { totalPrice } })
        }
      }

      const fullBooking = await prisma.booking.findUnique({
        where: { id: booking.id },
        include: {
          flight: { include: { fromAirport: true, toAirport: true } },
          tariff: true,
          passengers: { include: { passenger: true } }
        }
      })

      return res.json(fullBooking)
    } catch (e: any) {
      return res.json({ error: e.message })
    }
  }

  res.status(405).end()
}
