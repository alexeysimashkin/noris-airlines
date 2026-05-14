const { PrismaClient } = require('@prisma/client');

async function main() {
  if (!process.env.DATABASE_URL) {
    console.log("⚠️ DATABASE_URL не задан — пропускаем сидирование");
    return;
  }

  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    console.log("✅ Подключены к базе данных");
  } catch (e) {
    console.log("❌ Не удалось подключиться к базе данных — пропускаем сидирование");
    console.log("Добавьте DATABASE_URL в переменные окружения Vercel");
    return;
  }

  // Проверяем, есть ли уже аэропорты
  const airportCount = await prisma.airport.count();
  if (airportCount > 0) {
    console.log(`✅ В базе уже есть ${airportCount} аэропортов — пропускаем сидирование`);
    await prisma.$disconnect();
    return;
  }

  console.log("🔄 Начинаем заполнение базы данных...");

  // ===== ВСЕ АЭРОПОРТЫ =====
  const airportsData = [
    // Москва
    { iata: "VKO", name: "Внуково", city: "Москва", country: "Россия" },
    { iata: "SVO", name: "Шереметьево", city: "Москва", country: "Россия" },
    { iata: "DME", name: "Домодедово", city: "Москва", country: "Россия" },
    // Санкт-Петербург
    { iata: "LED", name: "Пулково", city: "Санкт-Петербург", country: "Россия" },
    // Самара (2 аэропорта)
    { iata: "KUF", name: "Курумоч", city: "Самара", country: "Россия" },
    { iata: "SMH", name: "Симашкино", city: "Самара", country: "Россия" },
    // Тюмень (2 аэропорта)
    { iata: "TJM", name: "Рощино", city: "Тюмень", country: "Россия" },
    { iata: "TUM", name: "Тюменский", city: "Тюмень", country: "Россия" },
    // Екатеринбург (2 аэропорта)
    { iata: "SVX", name: "Кольцово", city: "Екатеринбург", country: "Россия" },
    { iata: "HBS", name: "Шабровский", city: "Екатеринбург", country: "Россия" },
    // Уфа (2 аэропорта)
    { iata: "UFA", name: "Уфа", city: "Уфа", country: "Россия" },
    { iata: "BHK", name: "Башкортостан", city: "Уфа", country: "Россия" },
    // ХМАО
    { iata: "NJC", name: "Нижневартовск", city: "Нижневартовск", country: "Россия" },
    { iata: "SGC", name: "Сургут", city: "Сургут", country: "Россия" },
    { iata: "KGP", name: "Когалым", city: "Когалым", country: "Россия" },
    // Юг
    { iata: "AER", name: "Сочи", city: "Сочи", country: "Россия" },
    { iata: "KRR", name: "Пашковский", city: "Краснодар", country: "Россия" },
    { iata: "GDZ", name: "Геленджик", city: "Геленджик", country: "Россия" },
    // Калининград
    { iata: "KGD", name: "Храброво", city: "Калининград", country: "Россия" },
    // Нижний Новгород
    { iata: "GOJ", name: "Стригино", city: "Нижний Новгород", country: "Россия" },
    // Остальные города России
    { iata: "AAQ", name: "Анапа", city: "Анапа", country: "Россия" },
    { iata: "ARH", name: "Талаги", city: "Архангельск", country: "Россия" },
    { iata: "ASF", name: "Астрахань", city: "Астрахань", country: "Россия" },
    { iata: "BAX", name: "Барнаул", city: "Барнаул", country: "Россия" },
    { iata: "CEK", name: "Баландино", city: "Челябинск", country: "Россия" },
    { iata: "GRV", name: "Грозный", city: "Грозный", country: "Россия" },
    { iata: "IKT", name: "Иркутск", city: "Иркутск", country: "Россия" },
    { iata: "KJA", name: "Емельяново", city: "Красноярск", country: "Россия" },
    { iata: "KZN", name: "Казань", city: "Казань", country: "Россия" },
    { iata: "MCX", name: "Уйташ", city: "Махачкала", country: "Россия" },
    { iata: "MMK", name: "Мурманск", city: "Мурманск", country: "Россия" },
    { iata: "MRV", name: "Минеральные Воды", city: "Минеральные Воды", country: "Россия" },
    { iata: "OVB", name: "Толмачёво", city: "Новосибирск", country: "Россия" },
    { iata: "PEE", name: "Большое Савино", city: "Пермь", country: "Россия" },
    { iata: "ROV", name: "Платов", city: "Ростов-на-Дону", country: "Россия" },
    { iata: "RTW", name: "Гагарин", city: "Саратов", country: "Россия" },
    { iata: "UUD", name: "Байкал", city: "Улан-Удэ", country: "Россия" },
    { iata: "VOG", name: "Гумрак", city: "Волгоград", country: "Россия" },
    { iata: "VVO", name: "Кневичи", city: "Владивосток", country: "Россия" },
    { iata: "YKS", name: "Якутск", city: "Якутск", country: "Россия" },
    // СНГ
    { iata: "SKD", name: "Самарканд", city: "Самарканд", country: "Узбекистан" },
    { iata: "TBS", name: "Шота Руставели", city: "Тбилиси", country: "Грузия" },
    { iata: "OSS", name: "Ош", city: "Ош", country: "Киргизия" },
    { iata: "TAS", name: "Ташкент", city: "Ташкент", country: "Узбекистан" },
    { iata: "EVN", name: "Звартноц", city: "Ереван", country: "Армения" },
    { iata: "BUS", name: "Батуми", city: "Батуми", country: "Грузия" },
    { iata: "DYU", name: "Душанбе", city: "Душанбе", country: "Таджикистан" },
    { iata: "MSQ", name: "Минск", city: "Минск", country: "Беларусь" },
    { iata: "NMA", name: "Наманган", city: "Наманган", country: "Узбекистан" },
    { iata: "UGC", name: "Ургенч", city: "Ургенч", country: "Узбекистан" },
    { iata: "LBD", name: "Худжанд", city: "Худжанд", country: "Таджикистан" },
    // Турция
    { iata: "AYT", name: "Анталья", city: "Анталья", country: "Турция" },
    { iata: "IST", name: "Стамбул", city: "Стамбул", country: "Турция" },
    { iata: "TZX", name: "Трабзон", city: "Трабзон", country: "Турция" },
    // ОАЭ
    { iata: "DXB", name: "Дубай", city: "Дубай", country: "ОАЭ" },
    { iata: "RKT", name: "Рас-Эль-Хайма", city: "Рас-Эль-Хайма", country: "ОАЭ" },
    { iata: "SHJ", name: "Шарджа", city: "Шарджа", country: "ОАЭ" },
    // Египет
    { iata: "SSH", name: "Шарм-эль-Шейх", city: "Шарм-эль-Шейх", country: "Египет" },
    { iata: "HRG", name: "Хургада", city: "Хургада", country: "Египет" },
    // Азия
    { iata: "CXR", name: "Камрань", city: "Нячанг", country: "Вьетнам" },
    { iata: "PEK", name: "Шоуду", city: "Пекин", country: "Китай" },
    { iata: "HKT", name: "Пхукет", city: "Пхукет", country: "Таиланд" },
  ];

  // Удаляем дубликаты
  const uniqueAirports = airportsData.filter((a, i, self) =>
    i === self.findIndex(t => t.iata === a.iata)
  );

  // Создаём аэропорты
  await prisma.airport.createMany({
    data: uniqueAirports,
    skipDuplicates: true,
  });
  console.log(`✅ Создано ${uniqueAirports.length} аэропортов`);

  // Самолёты
  await prisma.aircraft.createMany({
    data: [
      {
        type: "Boeing 737-800",
        model: "738",
        totalRows: 31,
        seatConfig: {
          business: { rows: [1, 2], seats: ["A", "C", "D"] },
          economy: { rows: Array.from({length: 29}, (_, i) => i + 3), seats: ["A", "B", "C", "D", "E", "F"] }
        }
      },
      {
        type: "Boeing 737-8 MAX",
        model: "38M",
        totalRows: 31,
        seatConfig: {
          business: { rows: [1, 2], seats: ["A", "C", "D"] },
          economy: { rows: Array.from({length: 29}, (_, i) => i + 3), seats: ["A", "B", "C", "D", "E", "F"] }
        }
      }
    ],
    skipDuplicates: true,
  });
  console.log("✅ Самолёты созданы");

  const svo = await prisma.airport.findFirst({ where: { iata: "SVO" } });
  const led = await prisma.airport.findFirst({ where: { iata: "LED" } });
  const b738 = await prisma.aircraft.findFirst({ where: { model: "738" } });

  if (svo && led && b738) {
    const flight = await prisma.flight.create({
      data: {
        flightNumber: "NR101",
        fromAirportId: svo.id,
        toAirportId: led.id,
        aircraftId: b738.id,
        departureTime: new Date("2026-06-01T08:00:00"),
        arrivalTime: new Date("2026-06-01T09:30:00"),
        durationMin: 90,
        startDate: new Date("2026-06-01"),
        endDate: new Date("2026-09-30"),
        daysOfWeek: "1,2,3,4,5,6,7"
      }
    });

    await prisma.flightTariff.createMany({
      data: [
        { flightId: flight.id, name: "Лайт", description: "Ручная кладь до 10кг", price: 4500, baggage: "Нет", handLuggage: "10кг", seatDiscount: 0, freeSeatRows: "", refundable: false, class: "economy" },
        { flightId: flight.id, name: "Стандарт", description: "Ручная кладь 10кг + багаж 23кг", price: 6500, baggage: "23кг", handLuggage: "10кг", seatDiscount: 50, freeSeatRows: "", refundable: false, class: "economy" },
        { flightId: flight.id, name: "Бизнес Выгодно", description: "Ручная кладь 15кг + багаж 30кг", price: 12500, baggage: "30кг", handLuggage: "15кг", seatDiscount: 100, freeSeatRows: "1,2", refundable: false, class: "business" },
        { flightId: flight.id, name: "Бизнес Легко", description: "Ручная кладь 15кг + 2 багажа 30кг", price: 15000, baggage: "2x30кг", handLuggage: "15кг", seatDiscount: 100, freeSeatRows: "1,2", refundable: true, class: "business" }
      ]
    });
    console.log("✅ Тестовый рейс NR101 создан");
  }

  // Питание
  await prisma.meal.createMany({
    data: [
      { name: "Стандартный обед", description: "Горячее блюдо, салат, напиток", price: 800 },
      { name: "Вегетарианское меню", description: "Овощное рагу, свежие овощи, чай", price: 800 },
      { name: "Детское меню", description: "Наггетсы, пюре, сок", price: 600 },
      { name: "Премиум ужин", description: "Стейк, красное вино, десерт", price: 2500 }
    ],
    skipDuplicates: true,
  });
  console.log("✅ Питание создано");

  await prisma.$disconnect();
  console.log("\n🎉 Сидирование завершено!");
}

main();
