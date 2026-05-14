import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient()

  const queries = [
    `CREATE TABLE IF NOT EXISTS "Airport" (id SERIAL PRIMARY KEY, iata TEXT UNIQUE NOT NULL, name TEXT NOT NULL, city TEXT NOT NULL, country TEXT NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS "Aircraft" (id SERIAL PRIMARY KEY, type TEXT NOT NULL, model TEXT NOT NULL, "totalRows" INTEGER NOT NULL, "seatConfig" JSONB NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS "Flight" (id SERIAL PRIMARY KEY, "flightNumber" TEXT UNIQUE NOT NULL, "fromAirportId" INTEGER NOT NULL, "toAirportId" INTEGER NOT NULL, "aircraftId" INTEGER NOT NULL, "departureTime" TIMESTAMP NOT NULL, "arrivalTime" TIMESTAMP NOT NULL, "durationMin" INTEGER NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "daysOfWeek" TEXT NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS "FlightTariff" (id SERIAL PRIMARY KEY, "flightId" INTEGER NOT NULL, name TEXT NOT NULL, description TEXT NOT NULL, price DOUBLE PRECISION NOT NULL, baggage TEXT NOT NULL, "handLuggage" TEXT NOT NULL, "seatDiscount" DOUBLE PRECISION DEFAULT 0, "freeSeatRows" TEXT DEFAULT '', refundable BOOLEAN DEFAULT false, class TEXT NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS "Meal" (id SERIAL PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL, price DOUBLE PRECISION NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS "Passenger" (id SERIAL PRIMARY KEY, "firstName" TEXT NOT NULL, "lastName" TEXT NOT NULL, "middleName" TEXT, "birthDate" TIMESTAMP NOT NULL, gender TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL, "passengerType" TEXT NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS "Booking" (id SERIAL PRIMARY KEY, "bookingCode" TEXT UNIQUE NOT NULL, "flightId" INTEGER NOT NULL, "tariffId" INTEGER NOT NULL, "totalPrice" DOUBLE PRECISION NOT NULL, status TEXT DEFAULT 'confirmed', "createdAt" TIMESTAMP DEFAULT NOW(), "returnFlightId" INTEGER, "checkedIn" BOOLEAN DEFAULT false, "checkedInAt" TIMESTAMP)`,
    `CREATE TABLE IF NOT EXISTS "BookingPassenger" (id SERIAL PRIMARY KEY, "bookingId" INTEGER NOT NULL, "passengerId" INTEGER NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS "BookingSeat" (id SERIAL PRIMARY KEY, "bookingId" INTEGER NOT NULL, "passengerId" INTEGER NOT NULL, "seatNumber" TEXT NOT NULL, price DOUBLE PRECISION NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS "BookingMeal" (id SERIAL PRIMARY KEY, "bookingId" INTEGER NOT NULL, "mealId" INTEGER NOT NULL, "passengerId" INTEGER NOT NULL, quantity INTEGER DEFAULT 1)`,
    `CREATE TABLE IF NOT EXISTS "BookingBaggage" (id SERIAL PRIMARY KEY, "bookingId" INTEGER NOT NULL, "passengerId" INTEGER NOT NULL, type TEXT NOT NULL, weight DOUBLE PRECISION NOT NULL, price DOUBLE PRECISION NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS "Payment" (id SERIAL PRIMARY KEY, "bookingId" INTEGER UNIQUE NOT NULL, amount DOUBLE PRECISION NOT NULL, status TEXT DEFAULT 'pending', method TEXT DEFAULT 'no_payment', "createdAt" TIMESTAMP DEFAULT NOW())`,
    `INSERT INTO "Aircraft" (id, type, model, "totalRows", "seatConfig") VALUES (1, 'Boeing 737-800', '738', 31, '{}') ON CONFLICT (id) DO NOTHING`,
  ]

  const results: string[] = []

  try {
    for (const query of queries) {
      await prisma.$executeRawUnsafe(query)
      results.push('✅ ' + query.substring(0, 60) + '...')
    }
    res.json({ success: true, message: '✅ ВСЕ 12 таблиц созданы!', details: results })
  } catch (e: any) {
    res.json({ success: false, message: e.message, details: results })
  } finally {
    await prisma.$disconnect()
  }
}
