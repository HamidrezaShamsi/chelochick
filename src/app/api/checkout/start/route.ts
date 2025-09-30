import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { priceCart } from "@/lib/pricing";
export async function POST(req:Request){
  const body = await req.json();
  const items = body.items as { id:string; name:string; priceCents:number; quantity:number }[];
  const name = String(body.name||"").slice(0,100);
  const phone = String(body.phone||"").slice(0,30);
  const pickup = body.pickup ? new Date(body.pickup) : new Date(Date.now() + Number(process.env.PICKUP_PREP_MINUTES ?? "15")*60*1000);
  if (!items?.length) return new Response("No items", { status:400 });
  const priced = priceCart(items, 0);
  const code = Math.random().toString(36).slice(2,6).toUpperCase();
  const order = await prisma.order.create({
    data: {
      code, customerName:name, customerPhone:phone, pickupSlot: pickup,
      subtotalCents: priced.subtotal, taxCents: priced.tax, totalCents: priced.total,
      items: { create: items.map(i=>({ menuItemId:i.id, name:i.name, unitPriceCents:i.priceCents, quantity:i.quantity })) }
    }
  });
  const stripe = new Stripe(process.env.STRIPE_SK!, { apiVersion: "2024-06-20" });
  const pi = await stripe.paymentIntents.create({
    amount: priced.total,
    currency: "cad",
    automatic_payment_methods: { enabled: true },
    metadata: { orderId: order.id, orderCode: order.code }
  });
  await prisma.payment.create({
    data: { orderId: order.id, paymentIntentId: pi.id, status: String(pi.status), amountCents: priced.total, raw: {} }
  });
  return Response.json({ client_secret: pi.client_secret, orderId: order.id });
}