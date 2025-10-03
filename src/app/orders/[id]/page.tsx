"use client";
import Link from "next/link";
import { useCart } from "@/store/cart";
import { useEffect } from "react";

async function getOrder(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/orders/${id}`, { cache: "no-store" });
  return res.json();
}

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const order = await getOrder(resolvedParams.id);
  const { clearAfterOrderId, clear, setClearAfterOrderId } = useCart();

  useEffect(() => {
    // Check URL parameters for payment success
    const searchParams = new URLSearchParams(window.location.search);
    const status = searchParams.get('redirect_status');
    
    if (status === 'succeeded' && clearAfterOrderId === resolvedParams.id) {
      clear();
      setClearAfterOrderId(undefined);
    }
  }, [clearAfterOrderId, resolvedParams.id, clear, setClearAfterOrderId]);

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