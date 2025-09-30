import { prisma } from "@/lib/prisma";
export async function GET(_:Request, { params }:{ params:{ id:string } }){
  const o = await prisma.order.findUnique({ where:{ id: params.id } });
  if(!o) return new Response("Not found", { status:404 });
  return Response.json(o);
}