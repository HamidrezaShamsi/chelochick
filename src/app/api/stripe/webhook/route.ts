import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
export const runtime = "nodejs";
export async function POST(req:Request){
  const text = await req.text();
  const sig = (req.headers.get("stripe-signature")||"");
  const stripe = new Stripe(process.env.STRIPE_SK!, { apiVersion:"2024-06-20" });
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(text, sig, process.env.STRIPE_WH_SECRET!);
  } catch (err:any) {
    return new Response(`Webhook Error: ${err.message}`, { status:400 });
  }
  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;
    const orderId = String(pi.metadata.orderId || "");
    if (orderId) {
      await prisma.payment.update({ where:{ paymentIntentId: pi.id }, data:{ status: pi.status, raw: pi as any } }).catch(()=>{});
      await prisma.order.update({ where:{ id: orderId }, data:{ status: "in_kitchen" } }).catch(()=>{});
    }
  }
  return new Response(JSON.stringify({ received:true }), { status:200 });
}