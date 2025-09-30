import { prisma } from "@/lib/prisma";
export async function GET() {
  const data = await prisma.menuCategory.findMany({
    orderBy:{ sortOrder:"asc" },
    include:{ items:{ where:{ isAvailable:true }, orderBy:{ name:"asc" } } }
  });
  return Response.json(data);
}