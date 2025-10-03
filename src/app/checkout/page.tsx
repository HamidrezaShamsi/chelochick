"use client";
import { useCart } from "@/store/cart";
import { fmt } from "@/lib/money";
import { useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK!);
export default function CheckoutPage(){
  const items = useCart(s=>s.items);
  const [clientSecret,setClientSecret]=useState<string|null>(null);
  const [orderId,setOrderId]=useState<string|null>(null);
  const [name,setName]=useState(""); const [phone,setPhone]=useState(""); const [pickup,setPickup]=useState<string>("");
  const [newsletter,setNewsletter] = useState(true);
  const subtotal = useMemo(()=> items.reduce((s,i)=>s + i.priceCents*i.quantity,0),[items]);
  async function start(){
    if(!items.length) return alert("Your cart is empty.");
    if(!name || !phone) return alert("Enter name & phone.");
    const res = await fetch("/api/checkout/start",{ method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ items, name, phone, pickup })});
    const data = await res.json();
    setClientSecret(data.client_secret); setOrderId(data.orderId);
    if (newsletter) {
      await fetch("/api/newsletter/subscribe", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: phone, // Use phone as identifier since we don't collect email
          source: "checkout"
        })
      });
    }
  }
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card">
        <h3 className="font-semibold mb-2">Your cart</h3>
        {!items.length && <div className="text-sm text-gray-500">Empty</div>}
        {items.map(i=>(
          <div key={i.id} className="flex justify-between py-2 border-b">
            <span>{i.name} × {i.quantity}</span>
            <span>{fmt(i.priceCents*i.quantity)}</span>
          </div>
        ))}
        <div className="mt-3 font-medium">Subtotal: {fmt(subtotal)}</div>
        <div className="mt-4 space-y-2">
          <input placeholder="Your name" className="w-full border rounded p-2" value={name} onChange={e=>setName(e.target.value)} />
          <input placeholder="Phone" className="w-full border rounded p-2" value={phone} onChange={e=>setPhone(e.target.value)} />
          <input placeholder="Pickup time (ISO, optional)" className="w-full border rounded p-2" value={pickup} onChange={e=>setPickup(e.target.value)} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={newsletter} onChange={e=>setNewsletter(e.target.checked)} />
            Subscribe to our newsletter
          </label>
          <button className="btn btn-primary w-full" onClick={start}>Start payment</button>
        </div>
      </div>
      <div className="card">
        <h3 className="font-semibold mb-2">Payment</h3>
        {!clientSecret ? <div className="text-sm text-gray-500">Click “Start payment” to load Stripe.</div> :
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PayForm orderId={orderId!} />
          </Elements>
        }
      </div>
    </div>
  );
}
function PayForm({ orderId }:{ orderId:string }){
  const stripe = useStripe(); const elements = useElements();
  const [loading,setLoading]=useState(false);
  const pay = async (e:React.FormEvent)=> {
    e.preventDefault(); if(!stripe||!elements) return;
    setLoading(true);
    const { error } = await stripe.confirmPayment({ elements, confirmParams:{ return_url: window.location.origin + "/orders/" + orderId }});
    if (error) alert(error.message);
    setLoading(false);
  };
  return <form onSubmit={pay} className="space-y-3">
    <PaymentElement />
    <button disabled={!stripe||!elements||loading} className="btn btn-primary w-full">{loading?"Processing…":"Pay now"}</button>
  </form>;
}