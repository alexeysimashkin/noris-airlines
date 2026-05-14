import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient()

  try {
    // Шаг 1: Создаём таблицы
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Airport" (
        id SERIAL PRIMARY KEY,
        iata TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        city TEXT NOT NULL,
        country TEXT NOT NULL
      )
    `);

    // Шаг 2: Загружаем аэропорты
    const airports = [
      { iata: 'VKO', name: 'Внуково', city: 'Москва', country: 'Россия' },
      { iata: 'SVO', name: 'Шереметьево', city: 'Москва', country: 'Россия' },
      { iata: 'DME', name: 'Домодедово', city: 'Москва', country: 'Россия' },
      { iata: 'LED', name: 'Пулково', city: 'Санкт-Петербург', country: 'Россия' },
      { iata: 'KUF', name: 'Курумоч', city: 'Самара', country: 'Россия' },
      { iata: 'SMH', name: 'Симашкино', city: 'Самара', country: 'Россия' },
      { iata: 'TJM', name: 'Рощино', city: 'Тюмень', country: 'Россия' },
      { iata: 'TUM', name: 'Тюменский', city: 'Тюмень', country: 'Россия' },
      { iata: 'SVX', name: 'Кольцово', city: 'Екатеринбург', country: 'Россия' },
      { iata: 'HBS', name: 'Шабровский', city: 'Екатеринбург', country: 'Россия' },
      { iata: 'UFA', name: 'Уфа', city: 'Уфа', country: 'Россия' },
      { iata: 'BHK', name: 'Башкортостан', city: 'Уфа', country: 'Россия' },
      { iata: 'NJC', name: 'Нижневартовск', city: 'Нижневартовск', country: 'Россия' },
      { iata: 'SGC', name: 'Сургут', city: 'Сургут', country: 'Россия' },
      { iata: 'KGP', name: 'Когалым', city: 'Когалым', country: 'Россия' },
      { iata: 'AER', name: 'Сочи', city: 'Сочи', country: 'Россия' },
      { iata: 'KRR', name: 'Пашковский', city: 'Краснодар', country: 'Россия' },
      { iata: 'GDZ', name: 'Геленджик', city: 'Геленджик', country: 'Россия' },
      { iata: 'KGD', name: 'Храброво', city: 'Калининград', country: 'Россия' },
      { iata: 'GOJ', name: 'Стригино', city: 'Нижний Новгород', country: 'Россия' },
      { iata: 'AAQ', name: 'Анапа', city: 'Анапа', country: 'Россия' },
      { iata: 'CEK', name: 'Баландино', city: 'Челябинск', country: 'Россия' },
      { iata: 'GRV', name: 'Грозный', city: 'Грозный', country: 'Россия' },
      { iata: 'IKT', name: 'Иркутск', city: 'Иркутск', country: 'Россия' },
      { iata: 'KJA', name: 'Емельяново', city: 'Красноярск', country: 'Россия' },
      { iata: 'KZN', name: 'Казань', city: 'Казань', country: 'Россия' },
      { iata: 'MCX', name: 'Уйташ', city: 'Махачкала', country: 'Россия' },
      { iata: 'MMK', name: 'Мурманск', city: 'Мурманск', country: 'Россия' },
      { iata: 'MRV', name: 'Минеральные Воды', city: 'Минеральные Воды', country: 'Россия' },
      { iata: 'OVB', name: 'Толмачёво', city: 'Новосибирск', country: 'Россия' },
      { iata: 'PEE', name: 'Большое Савино', city: 'Пермь', country: 'Россия' },
      { iata: 'ROV', name: 'Платов', city: 'Ростов-на-Дону', country: 'Россия' },
      { iata: 'VOG', name: 'Гумрак', city: 'Волгоград', country: 'Россия' },
      { iata: 'VVO', name: 'Кневичи', city: 'Владивосток', country: 'Россия' },
      { iata: 'SKD', name: 'Самарканд', city: 'Самарканд', country: 'Узбекистан' },
      { iata: 'TBS', name: 'Тбилиси', city: 'Тбилиси', country: 'Грузия' },
      { iata: 'OSS', name: 'Ош', city: 'Ош', country: 'Киргизия' },
      { iata: 'TAS', name: 'Ташкент', city: 'Ташкент', country: 'Узбекистан' },
      { iata: 'EVN', name: 'Ереван', city: 'Ереван', country: 'Армения' },
      { iata: 'BUS', name: 'Батуми', city: 'Батуми', country: 'Грузия' },
      { iata: 'DYU', name: 'Душанбе', city: 'Душанбе', country: 'Таджикистан' },
      { iata: 'MSQ', name: 'Минск', city: 'Минск', country: 'Беларусь' },
      { iata: 'NMA', name: 'Наманган', city: 'Наманган', country: 'Узбекистан' },
      { iata: 'UGC', name: 'Ургенч', city: 'Ургенч', country: 'Узбекистан' },
      { iata: 'LBD', name: 'Худжанд', city: 'Худжанд', country: 'Таджикистан' },
      { iata: 'AYT', name: 'Анталья', city: 'Анталья', country: 'Турция' },
      { iata: 'IST', name: 'Стамбул', city: 'Стамбул', country: 'Турция' },
      { iata: 'TZX', name: 'Трабзон', city: 'Трабзон', country: 'Турция' },
      { iata: 'DXB', name: 'Дубай', city: 'Дубай', country: 'ОАЭ' },
      { iata: 'RKT', name: 'Рас-Эль-Хайма', city: 'Рас-Эль-Хайма', country: 'ОАЭ' },
      { iata: 'SHJ', name: 'Шарджа', city: 'Шарджа', country: 'ОАЭ' },
      { iata: 'SSH', name: 'Шарм-эль-Шейх', city: 'Шарм-эль-Шейх', country: 'Египет' },
      { iata: 'HRG', name: 'Хургада', city: 'Хургада', country: 'Египет' },
      { iata: 'CXR', name: 'Нячанг', city: 'Нячанг', country: 'Вьетнам' },
      { iata: 'PEK', name: 'Пекин', city: 'Пекин', country: 'Китай' },
      { iata: 'HKT', name: 'Пхукет', city: 'Пхукет', country: 'Таиланд' },
    ];

    let count = 0;
    for (const a of airports) {
      await prisma.$executeRawUnsafe(
        `INSERT INTO "Airport" (iata, name, city, country) VALUES ($1, $2, $3, $4) ON CONFLICT (iata) DO NOTHING`,
        a.iata, a.name, a.city, a.country
      );
      count++;
    }

    res.json({ success: true, message: `✅ Готово! Загружено ${count} аэропортов. Обнови страницу админки.` });
  } catch (e: any) {
    res.status(500).json({ success: false, message: '❌ Ошибка: ' + e.message });
  } finally {
    await prisma.$disconnect();
  }
}
