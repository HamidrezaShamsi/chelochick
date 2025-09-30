import { prisma } from "@/lib/prisma";
export async function GET(){
  const orders = await prisma.order.findMany({ orderBy:{ createdAt:"desc" }, take: 50 });
  return Response.json(orders);
}