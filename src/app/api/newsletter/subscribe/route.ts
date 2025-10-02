import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, source } = body ?? {};
  if (!email) return new Response("email required", { status: 400 });

  await prisma.newsletterSubscriber.upsert({
    where: { email: String(email) },
    create: { email: String(email), source: source ? String(source) : null },
    update: {}
  });

  return Response.json({ ok: true });
}
