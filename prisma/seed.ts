import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
async function main() {
  const cat = await db.menuCategory.create({ data: { name: "Chicken Sandwiches", sortOrder: 1 } });
  const sides = await db.menuCategory.create({ data: { name: "Sides", sortOrder: 2 } });
  await db.menuItem.createMany({
    data: [
      { name: "Classic Chelo", description: "Crispy chicken, pickles, sauce", priceCents: 999, categoryId: cat.id },
      { name: "Spicy Chelo", description: "Spicy sauce, jalapeños", priceCents: 1099, categoryId: cat.id },
      { name: "Fries", description: "Golden and crispy", priceCents: 399, categoryId: sides.id }
    ],
  });
}
main().finally(()=>db.$disconnect());