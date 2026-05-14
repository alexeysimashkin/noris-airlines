import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {
      flightId,
      tariffId,
      seats,
      baggage,
      meals,
      passengers,
      bookingCode,
      totalPrice,
      status
    } = req.body

    const booking = await prisma.booking.create({
      data: {
        bookingCode,
        flightId: Number(flightId),
        tariffId: Number(tariffId),
        totalPrice: Number(totalPrice),
        status: status || 'confirmed'
      }
    })

    // Если есть пассажиры, создаем их
    if (passengers) {
      const passengerData = JSON.parse(passengers)
      for (const p of passengerData) {
        const passenger = await prisma.passenger.create({
          data: {
            firstName: p.firstName,
            lastName: p.lastName,
            middleName: p.middleName,
            birthDate: new Date(p.birthDate),
            gender: p.gender,
            email: p.email,
            phone: p.phone,
            passengerType: 'adult'
          }
        })

        await prisma.bookingPassenger.create({
          data: {
            bookingId: booking.id,
            passengerId: passenger.id
          }
        })
      }
    }

    // Если есть места
    if (seats) {
      const seatList = seats.split(',').filter(Boolean)
      for (const seat of seatList) {
        await prisma.bookingSeat.create({
          data: {
            bookingId: booking.id,
            passengerId: 1, // Упрощенно
            seatNumber: seat,
            price: seat.startsWith('1') || seat.startsWith('2') ? 0 : 700
          }
        })
      }
    }

    return res.json(booking)
  }

  res.status(405).end()
}
