import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET — список всех аэропортов
  if (req.method === 'GET') {
    try {
      const airports = await prisma.airport.findMany({
        orderBy: { city: 'asc' }
      })
      return res.json(airports)
    } catch (e: any) {
      return res.status(500).json({ error: e.message })
    }
  }

  // POST — добавить новый аэропорт
  if (req.method === 'POST') {
    try {
      const { iata, name, city, country } = req.body
      
      if (!iata || !name || !city || !country) {
        return res.status(400).json({ 
          success: false, 
          message: 'Все поля обязательны: iata, name, city, country' 
        })
      }

      const airport = await prisma.airport.create({
        data: {
          iata: iata.toUpperCase(),
          name,
          city,
          country
        }
      })
      
      return res.json({ success: true, airport })
    } catch (e: any) {
      // Если дубликат IATA
      if (e.code === 'P2002') {
        return res.json({ 
          success: false, 
          message: 'Аэропорт с таким IATA-кодом уже существует' 
        })
      }
      return res.json({ success: false, message: e.message })
    }
  }

  // DELETE — удалить аэропорт
  if (req.method === 'DELETE') {
    try {
      const id = Number(req.query.id)
      
      if (!id) {
        return res.status(400).json({ success: false, message: 'Укажите id аэропорта' })
      }

      await prisma.airport.delete({
        where: { id }
      })
      
      return res.json({ success: true })
    } catch (e: any) {
      return res.json({ success: false, message: e.message })
    }
  }

  // PUT — обновить аэропорт
  if (req.method === 'PUT') {
    try {
      const { id, iata, name, city, country } = req.body
      
      const airport = await prisma.airport.update({
        where: { id: Number(id) },
        data: {
          iata: iata.toUpperCase(),
          name,
          city,
          country
        }
      })
      
      return res.json({ success: true, airport })
    } catch (e: any) {
      return res.json({ success: false, message: e.message })
    }
  }

  res.status(405).json({ error: 'Метод не поддерживается' })
}
