import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const o = await prisma.order.findUnique({ where: { id: resolvedParams.id } });
  if (!o) return new Response("Not found", { status: 404 });
  return Response.json(o);
}