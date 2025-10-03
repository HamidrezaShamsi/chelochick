import Link from "next/link";
export const dynamic = "force-dynamic";

async function getOrder(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/orders/${id}`, { cache: "no-store" });
  return res.json();
}

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const order = await getOrder(resolvedParams.id);
  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-semibold">Order {order.code}</h2>
      <div className="card">
        <div>Status: <span className="font-semibold">{order.status}</span></div>
        <div>Total: <span className="font-semibold">${(order.totalCents/100).toFixed(2)}</span></div>
      </div>
      <Link href="/menu" className="btn border">Back to menu</Link>
    </div>
  );
}