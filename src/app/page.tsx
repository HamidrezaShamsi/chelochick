import Link from "next/link";
export default function Page(){
  return (
    <section className="grid md:grid-cols-2 gap-6 items-center">
      <div>
        <h1 className="text-3xl font-bold mb-2">Order Checlo Chick online</h1>
        <p className="mb-4">Pickup now in Hamilton. Pay securely with Stripe.</p>
        <div className="flex gap-3">
          <Link href="/menu" className="btn btn-primary">Browse Menu</Link>
          <Link href="/checkout" className="btn border">Checkout</Link>
        </div>
      </div>
      <div className="card">Fast MVP, delivery-ready later.</div>
      <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg">Tailwind is working properly now!</div>

    </section>
  );
}