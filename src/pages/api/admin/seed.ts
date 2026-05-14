import type { NextApiRequest, NextApiResponse } from 'next'

// Этот SQL точно создаст таблицу и зальёт аэропорты
const BULK_SQL = `
CREATE TABLE IF NOT EXISTS "Airport" (
  id SERIAL PRIMARY KEY,
  iata TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL
);

INSERT INTO "Airport" (iata, name, city, country) VALUES
('VKO','Внуково','Москва','Россия'),
('SVO','Шереметьево','Москва','Россия'),
('DME','Домодедово','Москва','Россия'),
('LED','Пулково','Санкт-Петербург','Россия'),
('KUF','Курумоч','Самара','Россия'),
('SMH','Симашкино','Самара','Россия'),
('TJM','Рощино','Тюмень','Россия'),
('TUM','Тюменский','Тюмень','Россия'),
('SVX','Кольцово','Екатеринбург','Россия'),
('HBS','Шабровский','Екатеринбург','Россия'),
('UFA','Уфа','Уфа','Россия'),
('BHK','Башкортостан','Уфа','Россия'),
('NJC','Нижневартовск','Нижневартовск','Россия'),
('SGC','Сургут','Сургут','Россия'),
('KGP','Когалым','Когалым','Россия'),
('AER','Сочи','Сочи','Россия'),
('KRR','Пашковский','Краснодар','Россия'),
('GDZ','Геленджик','Геленджик','Россия'),
('KGD','Храброво','Калининград','Россия'),
('GOJ','Стригино','Нижний Новгород','Россия'),
('CEK','Баландино','Челябинск','Россия'),
('GRV','Грозный','Грозный','Россия'),
('IKT','Иркутск','Иркутск','Россия'),
('KJA','Емельяново','Красноярск','Россия'),
('KZN','Казань','Казань','Россия'),
('MCX','Уйташ','Махачкала','Россия'),
('MMK','Мурманск','Мурманск','Россия'),
('MRV','Минеральные Воды','Минеральные Воды','Россия'),
('OVB','Толмачёво','Новосибирск','Россия'),
('PEE','Большое Савино','Пермь','Россия'),
('ROV','Платов','Ростов-на-Дону','Россия'),
('VOG','Гумрак','Волгоград','Россия'),
('VVO','Кневичи','Владивосток','Россия'),
('SKD','Самарканд','Самарканд','Узбекистан'),
('TBS','Тбилиси','Тбилиси','Грузия'),
('OSS','Ош','Ош','Киргизия'),
('TAS','Ташкент','Ташкент','Узбекистан'),
('EVN','Ереван','Ереван','Армения'),
('BUS','Батуми','Батуми','Грузия'),
('DYU','Душанбе','Душанбе','Таджикистан'),
('MSQ','Минск','Минск','Беларусь'),
('NMA','Наманган','Наманган','Узбекистан'),
('UGC','Ургенч','Ургенч','Узбекистан'),
('LBD','Худжанд','Худжанд','Таджикистан'),
('AYT','Анталья','Анталья','Турция'),
('IST','Стамбул','Стамбул','Турция'),
('TZX','Трабзон','Трабзон','Турция'),
('DXB','Дубай','Дубай','ОАЭ'),
('RKT','Рас-Эль-Хайма','Рас-Эль-Хайма','ОАЭ'),
('SHJ','Шарджа','Шарджа','ОАЭ'),
('SSH','Шарм-эль-Шейх','Шарм-эль-Шейх','Египет'),
('HRG','Хургада','Хургада','Египет'),
('CXR','Нячанг','Нячанг','Вьетнам'),
('PEK','Пекин','Пекин','Китай'),
('HKT','Пхукет','Пхукет','Таиланд')
ON CONFLICT (iata) DO NOTHING;
`

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const neonUrl = process.env.DATABASE_URL
    if (!neonUrl) return res.status(500).json({ error: 'DATABASE_URL не задан' })

    // Используем fetch к Neon HTTP API
    const projectId = neonUrl.match(/ep-[a-z0-9-]+/i)?.[0]
    if (!projectId) return res.status(500).json({ error: 'Не удалось извлечь projectId из DATABASE_URL' })

    const apiUrl = `https://console.neon.tech/api/v2/projects/${projectId}/sql`
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEON_API_KEY || ''}`
      },
      body: JSON.stringify({
        sql: BULK_SQL,
        database: 'noris',
        project_id: projectId
      })
    })

    const result = await response.json()
    res.json({ success: true, message: '✅ Аэропорты загружены через Neon API!', details: result })
  } catch (e: any) {
    res.status(500).json({ success: false, message: '❌ ' + e.message })
  }
}
