import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
const next = { pending: "in_kitchen", in_kitchen:"ready_for_pickup", ready_for_pickup:"completed" } as const;
export async function POST(req:NextRequest, { params }:{ params:{ id:string } }){
  const o = await prisma.order.findUnique({ where:{ id: params.id } });
  if (!o) return new Response("Not found", { status:404 });
  // @ts-ignore
  const nextStatus = next[o.status] ?? o.status;
  const updated = await prisma.order.update({ where:{ id:o.id }, data:{ status: nextStatus as any } });
  return Response.json(updated);
}