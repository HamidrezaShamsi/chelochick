"use client";
import Link from "next/link";
import { useCart } from "@/store/cart";
import { useEffect } from "react";

// This is the type for the order object. It's good practice to define this.
interface Order {
  id: string;
  code: string;
  status: string;
  totalCents: number;
}

export function OrderDetails({ order }: { order: Order }) {
  const { clearAfterOrderId, clearCartForCheckout, setClearAfterOrderId } = useCart();

  useEffect(() => {
    // Check URL parameters for payment success
    const searchParams = new URLSearchParams(window.location.search);
    const status = searchParams.get('redirect_status');
    
    if (status === 'succeeded' && clearAfterOrderId === order.id) {
      clearCartForCheckout();
      setClearAfterOrderId(undefined);
    }
  }, [clearAfterOrderId, order.id, clearCartForCheckout, setClearAfterOrderId]);

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
