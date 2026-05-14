import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient()

  const SQL = `
    CREATE TABLE IF NOT EXISTS "Airport" (id SERIAL PRIMARY KEY, iata TEXT UNIQUE NOT NULL, name TEXT NOT NULL, city TEXT NOT NULL, country TEXT NOT NULL);
    
    CREATE TABLE IF NOT EXISTS "Aircraft" (id SERIAL PRIMARY KEY, type TEXT NOT NULL, model TEXT NOT NULL, "totalRows" INTEGER NOT NULL, "seatConfig" JSONB NOT NULL);
    
    CREATE TABLE IF NOT EXISTS "Flight" (id SERIAL PRIMARY KEY, "flightNumber" TEXT UNIQUE NOT NULL, "fromAirportId" INTEGER NOT NULL, "toAirportId" INTEGER NOT NULL, "aircraftId" INTEGER NOT NULL, "departureTime" TIMESTAMP NOT NULL, "arrivalTime" TIMESTAMP NOT NULL, "durationMin" INTEGER NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "daysOfWeek" TEXT NOT NULL);
    
    CREATE TABLE IF NOT EXISTS "FlightTariff" (id SERIAL PRIMARY KEY, "flightId" INTEGER NOT NULL, name TEXT NOT NULL, description TEXT NOT NULL, price DOUBLE PRECISION NOT NULL, baggage TEXT NOT NULL, "handLuggage" TEXT NOT NULL, "seatDiscount" DOUBLE PRECISION DEFAULT 0, "freeSeatRows" TEXT DEFAULT '', refundable BOOLEAN DEFAULT false, class TEXT NOT NULL);
    
    CREATE TABLE IF NOT EXISTS "Meal" (id SERIAL PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL, price DOUBLE PRECISION NOT NULL);
    
    CREATE TABLE IF NOT EXISTS "Passenger" (id SERIAL PRIMARY KEY, "firstName" TEXT NOT NULL, "lastName" TEXT NOT NULL, "middleName" TEXT, "birthDate" TIMESTAMP NOT NULL, gender TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL, "passengerType" TEXT NOT NULL);
    
    CREATE TABLE IF NOT EXISTS "Booking" (id SERIAL PRIMARY KEY, "bookingCode" TEXT UNIQUE NOT NULL, "flightId" INTEGER NOT NULL, "tariffId" INTEGER NOT NULL, "totalPrice" DOUBLE PRECISION NOT NULL, status TEXT DEFAULT 'confirmed', "createdAt" TIMESTAMP DEFAULT NOW(), "returnFlightId" INTEGER, "checkedIn" BOOLEAN DEFAULT false, "checkedInAt" TIMESTAMP);
    
    CREATE TABLE IF NOT EXISTS "BookingPassenger" (id SERIAL PRIMARY KEY, "bookingId" INTEGER NOT NULL, "passengerId" INTEGER NOT NULL);
    
    CREATE TABLE IF NOT EXISTS "BookingSeat" (id SERIAL PRIMARY KEY, "bookingId" INTEGER NOT NULL, "passengerId" INTEGER NOT NULL, "seatNumber" TEXT NOT NULL, price DOUBLE PRECISION NOT NULL);
    
    CREATE TABLE IF NOT EXISTS "BookingMeal" (id SERIAL PRIMARY KEY, "bookingId" INTEGER NOT NULL, "mealId" INTEGER NOT NULL, "passengerId" INTEGER NOT NULL, quantity INTEGER DEFAULT 1);
    
    CREATE TABLE IF NOT EXISTS "BookingBaggage" (id SERIAL PRIMARY KEY, "bookingId" INTEGER NOT NULL, "passengerId" INTEGER NOT NULL, type TEXT NOT NULL, weight DOUBLE PRECISION NOT NULL, price DOUBLE PRECISION NOT NULL);
    
    CREATE TABLE IF NOT EXISTS "Payment" (id SERIAL PRIMARY KEY, "bookingId" INTEGER UNIQUE NOT NULL, amount DOUBLE PRECISION NOT NULL, status TEXT DEFAULT 'pending', method TEXT DEFAULT 'no_payment', "createdAt" TIMESTAMP DEFAULT NOW());

    INSERT INTO "Aircraft" (id, type, model, "totalRows", "seatConfig") VALUES (1, 'Boeing 737-800', '738', 31, '{"business":{"rows":[1,2],"seats":["A","C","D"]},"economy":{"rows":[3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],"seats":["A","B","C","D","E","F"]}}') ON CONFLICT (id) DO NOTHING;
    
    INSERT INTO "Aircraft" (id, type, model, "totalRows", "seatConfig") VALUES (2, 'Boeing 737-8 MAX', '38M', 31, '{"business":{"rows":[1,2],"seats":["A","C","D"]},"economy":{"rows":[3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],"seats":["A","B","C","D","E","F"]}}') ON CONFLICT (id) DO NOTHING;
  `

  try {
    await prisma.$executeRawUnsafe(SQL)
    res.json({ success: true, message: '✅ ВСЕ 12 таблиц созданы! 2 самолёта добавлены. Сайт готов к работе.' })
  } catch (e: any) {
    res.json({ success: false, message: e.message })
  } finally {
    await prisma.$disconnect()
  }
}
