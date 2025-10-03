
import { OrderDetails } from "./OrderDetails";

async function getOrder(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/orders/${id}`, { cache: "no-store" });
  if (!res.ok) {
    // Handle error appropriately in a real app
    // For now, we can throw an error to be caught by Next.js error boundary
    throw new Error(`Failed to fetch order: ${res.statusText}`);
  }
  return res.json();
}

export default async function OrderPage({ params }: { params: { id: string } }) {
  const order = await getOrder(params.id);

  // The client component is rendered here with the server-fetched data
  return <OrderDetails order={order} />;
}