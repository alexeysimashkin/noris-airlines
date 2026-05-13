const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Создаем аэропорты
  const svo = await prisma.airport.create({
    data: {
      iata: "SVO",
      name: "Шереметьево",
      city: "Москва",
      country: "Россия"
    }
  });

  const led = await prisma.airport.create({
    data: {
      iata: "LED",
      name: "Пулково",
      city: "Санкт-Петербург",
      country: "Россия"
    }
  });

  // Создаем самолеты
  const b738 = await prisma.aircraft.create({
    data: {
      type: "Boeing 737-800",
      model: "738",
      totalRows: 31,
      seatConfig: {
        business: { rows: [1, 2], seats: ["A", "C", "D"] },
        economy: { rows: Array.from({length: 29}, (_, i) => i + 3), seats: ["A", "B", "C", "D", "E", "F"] }
      }
    }
  });

  const b38m = await prisma.aircraft.create({
    data: {
      type: "Boeing 737-8 MAX",
      model: "38M",
      totalRows: 31,
      seatConfig: {
        business: { rows: [1, 2], seats: ["A", "C", "D"] },
        economy: { rows: Array.from({length: 29}, (_, i) => i + 3), seats: ["A", "B", "C", "D", "E", "F"] }
      }
    }
  });

  // Создаем тестовый рейс
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

  // Тарифы
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

  // Питание
  await prisma.meal.createMany({
    data: [
      { name: "Стандартный обед", description: "Горячее блюдо, салат, напиток", price: 800 },
      { name: "Вегетарианское меню", description: "Овощное рагу, свежие овощи, чай", price: 800 },
      { name: "Детское меню", description: "Наггетсы, пюре, сок", price: 600 },
      { name: "Премиум ужин", description: "Стейк, красное вино, десерт", price: 2500 }
    ]
  });

  console.log("✅ Тестовые данные созданы!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
