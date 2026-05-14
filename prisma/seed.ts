const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // ===== ВСЕ АЭРОПОРТЫ =====
  const airportsData = [
    // === МОСКВА ===
    { iata: "VKO", name: "Внуково", city: "Москва", country: "Россия" },
    { iata: "SVO", name: "Шереметьево", city: "Москва", country: "Россия" },
    { iata: "DME", name: "Домодедово", city: "Москва", country: "Россия" },
    
    // === САНКТ-ПЕТЕРБУРГ ===
    { iata: "LED", name: "Пулково", city: "Санкт-Петербург", country: "Россия" },
    
    // === САМАРА (2 аэропорта) ===
    { iata: "KUF", name: "Курумоч", city: "Самара", country: "Россия" },
    { iata: "SMH", name: "Симашкино", city: "Самара", country: "Россия" },
    
    // === ТЮМЕНЬ (2 аэропорта) ===
    { iata: "TJM", name: "Рощино", city: "Тюмень", country: "Россия" },
    { iata: "TUM", name: "Тюменский", city: "Тюмень", country: "Россия" },
    
    // === ЕКАТЕРИНБУРГ (2 аэропорта) ===
    { iata: "SVX", name: "Кольцово", city: "Екатеринбург", country: "Россия" },
    { iata: "HBS", name: "Шабровский", city: "Екатеринбург", country: "Россия" },
    
    // === УФА (2 аэропорта) ===
    { iata: "UFA", name: "Уфа", city: "Уфа", country: "Россия" },
    { iata: "BHK", name: "Башкортостан", city: "Уфа", country: "Россия" },
    
    // === ХАНТЫ-МАНСИЙСКИЙ АО ===
    { iata: "NJC", name: "Нижневартовск", city: "Нижневартовск", country: "Россия" },
    { iata: "SGC", name: "Сургут", city: "Сургут", country: "Россия" },
    { iata: "KGP", name: "Когалым", city: "Когалым", country: "Россия" },
    
    // === ЮГ РОССИИ ===
    { iata: "AER", name: "Сочи", city: "Сочи", country: "Россия" },
    { iata: "KRR", name: "Пашковский", city: "Краснодар", country: "Россия" },
    { iata: "GDZ", name: "Геленджик", city: "Геленджик", country: "Россия" },
    
    // === КАЛИНИНГРАД ===
    { iata: "KGD", name: "Храброво", city: "Калининград", country: "Россия" },
    
    // === НИЖНИЙ НОВГОРОД ===
    { iata: "GOJ", name: "Стригино", city: "Нижний Новгород", country: "Россия" },
    
    // === ОСТАЛЬНЫЕ ГОРОДА РОССИИ С АЭРОПОРТАМИ ===
    { iata: "AAQ", name: "Анапа", city: "Анапа", country: "Россия" },
    { iata: "ARH", name: "Талаги", city: "Архангельск", country: "Россия" },
    { iata: "ASF", name: "Астрахань", city: "Астрахань", country: "Россия" },
    { iata: "BAX", name: "Барнаул", city: "Барнаул", country: "Россия" },
    { iata: "BQS", name: "Игнатьево", city: "Благовещенск", country: "Россия" },
    { iata: "BTK", name: "Братск", city: "Братск", country: "Россия" },
    { iata: "BZK", name: "Брянск", city: "Брянск", country: "Россия" },
    { iata: "CEK", name: "Баландино", city: "Челябинск", country: "Россия" },
    { iata: "CSY", name: "Чебоксары", city: "Чебоксары", country: "Россия" },
    { iata: "DYR", name: "Угольный", city: "Анадырь", country: "Россия" },
    { iata: "EGO", name: "Белгород", city: "Белгород", country: "Россия" },
    { iata: "GDX", name: "Сокол", city: "Магадан", country: "Россия" },
    { iata: "GRV", name: "Грозный", city: "Грозный", country: "Россия" },
    { iata: "HTA", name: "Кадала", city: "Чита", country: "Россия" },
    { iata: "IAA", name: "Игарка", city: "Игарка", country: "Россия" },
    { iata: "IJK", name: "Ижевск", city: "Ижевск", country: "Россия" },
    { iata: "IKT", name: "Иркутск", city: "Иркутск", country: "Россия" },
    { iata: "IWA", name: "Иваново", city: "Иваново", country: "Россия" },
    { iata: "JOK", name: "Йошкар-Ола", city: "Йошкар-Ола", country: "Россия" },
    { iata: "KHV", name: "Новый", city: "Хабаровск", country: "Россия" },
    { iata: "KJA", name: "Емельяново", city: "Красноярск", country: "Россия" },
    { iata: "KRO", name: "Курган", city: "Курган", country: "Россия" },
    { iata: "KSZ", name: "Котлас", city: "Котлас", country: "Россия" },
    { iata: "KUF", name: "Курумоч", city: "Самара", country: "Россия" },
    { iata: "KVX", name: "Победилово", city: "Киров", country: "Россия" },
    { iata: "KZN", name: "Казань", city: "Казань", country: "Россия" },
    { iata: "LPK", name: "Липецк", city: "Липецк", country: "Россия" },
    { iata: "MCX", name: "Уйташ", city: "Махачкала", country: "Россия" },
    { iata: "MMK", name: "Мурманск", city: "Мурманск", country: "Россия" },
    { iata: "MQF", name: "Магнитогорск", city: "Магнитогорск", country: "Россия" },
    { iata: "MRV", name: "Минеральные Воды", city: "Минеральные Воды", country: "Россия" },
    { iata: "NAL", name: "Нальчик", city: "Нальчик", country: "Россия" },
    { iata: "NFG", name: "Нефтеюганск", city: "Нефтеюганск", country: "Россия" },
    { iata: "NNM", name: "Нарьян-Мар", city: "Нарьян-Мар", country: "Россия" },
    { iata: "NOJ", name: "Ноябрьск", city: "Ноябрьск", country: "Россия" },
    { iata: "NSK", name: "Алыкель", city: "Норильск", country: "Россия" },
    { iata: "NUX", name: "Новый Уренгой", city: "Новый Уренгой", country: "Россия" },
    { iata: "OGZ", name: "Беслан", city: "Владикавказ", country: "Россия" },
    { iata: "OMS", name: "Центральный", city: "Омск", country: "Россия" },
    { iata: "OSW", name: "Орск", city: "Орск", country: "Россия" },
    { iata: "OVB", name: "Толмачёво", city: "Новосибирск", country: "Россия" },
    { iata: "PEE", name: "Большое Савино", city: "Пермь", country: "Россия" },
    { iata: "PES", name: "Бесовец", city: "Петрозаводск", country: "Россия" },
    { iata: "PEZ", name: "Пенза", city: "Пенза", country: "Россия" },
    { iata: "PKC", name: "Елизово", city: "Петропавловск-Камчатский", country: "Россия" },
    { iata: "PWE", name: "Певек", city: "Певек", country: "Россия" },
    { iata: "REN", name: "Оренбург", city: "Оренбург", country: "Россия" },
    { iata: "ROV", name: "Платов", city: "Ростов-на-Дону", country: "Россия" },
    { iata: "RTW", name: "Гагарин", city: "Саратов", country: "Россия" },
    { iata: "RYB", name: "Староселье", city: "Рыбинск", country: "Россия" },
    { iata: "SKX", name: "Саранск", city: "Саранск", country: "Россия" },
    { iata: "SLY", name: "Салехард", city: "Салехард", country: "Россия" },
    { iata: "STW", name: "Шпаковское", city: "Ставрополь", country: "Россия" },
    { iata: "TBW", name: "Донское", city: "Тамбов", country: "Россия" },
    { iata: "TOF", name: "Богашёво", city: "Томск", country: "Россия" },
    { iata: "UUD", name: "Байкал", city: "Улан-Удэ", country: "Россия" },
    { iata: "UUS", name: "Хомутово", city: "Южно-Сахалинск", country: "Россия" },
    { iata: "VGD", name: "Вологда", city: "Вологда", country: "Россия" },
    { iata: "VKO", name: "Внуково", city: "Москва", country: "Россия" },
    { iata: "VOG", name: "Гумрак", city: "Волгоград", country: "Россия" },
    { iata: "VOZ", name: "Чертовицкое", city: "Воронеж", country: "Россия" },
    { iata: "VVO", name: "Кневичи", city: "Владивосток", country: "Россия" },
    { iata: "YKS", name: "Якутск", city: "Якутск", country: "Россия" },
    { iata: "YMK", name: "Мыс Каменный", city: "Мыс Каменный", country: "Россия" },
    
    // === МЕЖДУНАРОДНЫЕ ===
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

  // Удаляем дубликаты по IATA-коду
  const uniqueAirports = airportsData.filter((airport, index, self) =>
    index === self.findIndex((a) => a.iata === airport.iata)
  );

  // Создаем аэропорты
  for (const airport of uniqueAirports) {
    await prisma.airport.upsert({
      where: { iata: airport.iata },
      update: airport,
      create: airport,
    });
  }

  console.log(`✅ Создано ${uniqueAirports.length} аэропортов`);

  // ===== САМОЛЕТЫ =====
  const b738 = await prisma.aircraft.upsert({
    where: { id: 1 },
    update: {},
    create: {
      type: "Boeing 737-800",
      model: "738",
      totalRows: 31,
      seatConfig: {
        business: { rows: [1, 2], seats: ["A", "C", "D"] },
        economy: { rows: Array.from({length: 29}, (_, i) => i + 3), seats: ["A", "B", "C", "D", "E", "F"] }
      }
    }
  });

  const b38m = await prisma.aircraft.upsert({
    where: { id: 2 },
    update: {},
    create: {
      type: "Boeing 737-8 MAX",
      model: "38M",
      totalRows: 31,
      seatConfig: {
        business: { rows: [1, 2], seats: ["A", "C", "D"] },
        economy: { rows: Array.from({length: 29}, (_, i) => i + 3), seats: ["A", "B", "C", "D", "E", "F"] }
      }
    }
  });

  console.log("✅ Самолеты созданы");

  // ===== ТЕСТОВЫЙ РЕЙС =====
  const svo = await prisma.airport.findUnique({ where: { iata: "SVO" } });
  const led = await prisma.airport.findUnique({ where: { iata: "LED" } });

  if (svo && led) {
    const existingFlight = await prisma.flight.findFirst({
      where: { flightNumber: "NR101" }
    });

    let flight;
    if (!existingFlight) {
      flight = await prisma.flight.create({
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
      console.log("✅ Тестовый рейс NR101 создан");
    } else {
      flight = existingFlight;
      console.log("✅ Тестовый рейс NR101 уже существует");
    }

    // Тарифы
    const tariffCount = await prisma.flightTariff.count({
      where: { flightId: flight.id }
    });

    if (tariffCount === 0) {
      await prisma.flightTariff.createMany({
        data: [
          {
            flightId: flight.id,
            name: "Лайт",
            description: "Ручная кладь до 10кг",
            price: 4500,
            baggage: "Нет",
            handLuggage: "10кг",
            seatDiscount: 0,
            freeSeatRows: "",
            refundable: false,
            class: "economy"
          },
          {
            flightId: flight.id,
            name: "Стандарт",
            description: "Ручная кладь 10кг + багаж 23кг",
            price: 6500,
            baggage: "23кг",
            handLuggage: "10кг",
            seatDiscount: 50,
            freeSeatRows: "",
            refundable: false,
            class: "economy"
          },
          {
            flightId: flight.id,
            name: "Бизнес Выгодно",
            description: "Ручная кладь 15кг + багаж 30кг",
            price: 12500,
            baggage: "30кг",
            handLuggage: "15кг",
            seatDiscount: 100,
            freeSeatRows: "1,2",
            refundable: false,
            class: "business"
          },
          {
            flightId: flight.id,
            name: "Бизнес Легко",
            description: "Ручная кладь 15кг + 2 багажа 30кг",
            price: 15000,
            baggage: "2x30кг",
            handLuggage: "15кг",
            seatDiscount: 100,
            freeSeatRows: "1,2",
            refundable: true,
            class: "business"
          }
        ]
      });
      console.log("✅ Тарифы созданы");
    }
  }

  // ===== ПИТАНИЕ =====
  const mealCount = await prisma.meal.count();
  if (mealCount === 0) {
    await prisma.meal.createMany({
      data: [
        { name: "Стандартный обед", description: "Горячее блюдо, салат, напиток", price: 800 },
        { name: "Вегетарианское меню", description: "Овощное рагу, свежие овощи, чай", price: 800 },
        { name: "Детское меню", description: "Наггетсы, пюре, сок", price: 600 },
        { name: "Премиум ужин", description: "Стейк, красное вино, десерт", price: 2500 }
      ]
    });
    console.log("✅ Питание создано");
  }

  console.log("\n🎉 Сидирование завершено успешно!");
  console.log(`   Аэропортов: ${uniqueAirports.length}`);
  console.log("   Тестовый рейс: NR101 (SVO → LED)");
}

main()
  .catch((e) => {
    console.error("❌ Ошибка сидирования:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
