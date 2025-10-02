import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, message, newsletter } = body ?? {};
    if (!name || !email || !message) {
      return new Response("Missing fields", { status: 400 });
    }

    await prisma.contactMessage.create({
      data: { name: String(name), email: String(email), phone: phone ? String(phone) : null, message: String(message) }
    });

    if (newsletter === true) {
      await prisma.newsletterSubscriber.upsert({
        where: { email: String(email) },
        create: { email: String(email), source: "contact" },
        update: {}
      });
    }

    return Response.json({ ok: true });
  } catch (e:any) {
    return new Response("Server error: " + e.message, { status: 500 });
  }
}