"use client";
import Link from "next/link";
import { useCart } from "@/store/cart";

export default function CartButton() {
  const items = useCart(s => s.items);
  const count = items.reduce((n, i) => n + i.quantity, 0);
  return (
    <Link href="/checkout" className="relative btn border">
      Cart
      {count > 0 && (
        <span className="absolute -top-2 -right-2 text-xs px-1.5 py-0.5 rounded-full bg-blue-600 text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
