const HST = Number(process.env.HST_RATE ?? "0.13");
export function priceCart(items: { priceCents:number; quantity:number }[], tipCents=0) {
  const subtotal = items.reduce((s,i)=> s + i.priceCents * i.quantity, 0);
  const tax = Math.round(subtotal * HST);
  const total = subtotal + tax + tipCents;
  return { subtotal, tax, total };
}