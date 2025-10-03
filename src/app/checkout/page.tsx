"use client";
import { useCart } from "@/store/cart";
import { fmt } from "@/lib/money";
import { useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK!);

export default function CheckoutPage() {
  const { items, savedItems, update, remove, clear, saveForLater, moveToCart } = useCart();
  const [clientSecret, setClientSecret] = useState<string|null>(null);
  const [orderId, setOrderId] = useState<string|null>(null);
  const [name, setName] = useState(""); 
  const [phone, setPhone] = useState("");
  const [pickup, setPickup] = useState("");
  const [newsletter, setNewsletter] = useState(true);
  
  const subtotal = useMemo(() => 
    items.reduce((s,i) => s + i.priceCents * i.quantity, 0),
    [items]
  );

  // Calculate earliest pickup time (15 min from now)
  const minPickup = useMemo(() => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + 15);
    return date.toISOString().slice(0, 16);
  }, []);

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
      <div className="space-y-6">
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Your cart</h3>
            {items.length > 0 && (
              <button 
                onClick={() => clear()}
                className="text-sm text-red-600 hover:text-red-500"
              >
                Clear cart
              </button>
            )}
          </div>
          
          {!items.length && <div className="text-sm text-gray-500">Cart is empty</div>}
          
          {items.map(item => (
            <div key={item.id} className="py-3 border-b last:border-0">
              <div className="flex justify-between mb-2">
                <span className="font-medium">{item.name}</span>
                <span>{fmt(item.priceCents * item.quantity)}</span>
              </div>
              
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2">
                  <button 
                    className="w-8 h-8 rounded-full border flex items-center justify-center"
                    onClick={() => update(item.id, { quantity: Math.max(0, item.quantity - 1) })}
                  >−</button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button 
                    className="w-8 h-8 rounded-full border flex items-center justify-center"
                    onClick={() => update(item.id, { quantity: item.quantity + 1 })}
                  >+</button>
                </div>
                
                <div className="flex gap-2 ml-auto">
                  <button 
                    onClick={() => saveForLater(item.id)}
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Save for later
                  </button>
                  <button 
                    onClick={() => remove(item.id)}
                    className="text-sm text-red-600 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
              
              <textarea
                placeholder="Special instructions..."
                className="mt-2 w-full text-sm border rounded p-2"
                value={item.notes || ""}
                onChange={e => update(item.id, { notes: e.target.value })}
              />
            </div>
          ))}
          
          {items.length > 0 && (
            <div className="mt-3 font-medium">
              Subtotal: {fmt(subtotal)}
            </div>
          )}
        </div>

        {savedItems.length > 0 && (
          <div className="card">
            <h3 className="font-semibold mb-3">Saved for later</h3>
            {savedItems.map(item => (
              <div key={item.id} className="flex justify-between py-2 border-b last:border-0">
                <span>{item.name}</span>
                <button 
                  onClick={() => moveToCart(item.id)}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Move to cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="card">
          <h3 className="font-semibold mb-4">Order details</h3>
          <div className="space-y-3">
            <input 
              placeholder="Your name" 
              className="w-full border rounded p-2"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input 
              placeholder="Phone" 
              className="w-full border rounded p-2"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Pickup time (minimum 15 minutes)
              </label>
              <input 
                type="datetime-local"
                className="w-full border rounded p-2"
                min={minPickup}
                value={pickup}
                onChange={e => setPickup(e.target.value)}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input 
                type="checkbox"
                checked={newsletter}
                onChange={e => setNewsletter(e.target.checked)}
              />
              Subscribe to our newsletter
            </label>
          </div>
        </div>

        {/* Payment section */}
        <div className="card">
          <h3 className="font-semibold mb-2">Payment</h3>
          {!clientSecret ? (
            <button 
              className="btn btn-primary w-full"
              disabled={!items.length || !name || !phone}
              onClick={start}
            >
              Start payment
            </button>
          ) : (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PayForm orderId={orderId!} />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}

function PayForm({ orderId }:{ orderId:string }){
  const stripe = useStripe(); 
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const setClearAfterOrderId = useCart(s => s.setClearAfterOrderId);

  const pay = async (e:React.FormEvent)=> {
    e.preventDefault(); 
    if(!stripe||!elements) return;
    setLoading(true);
    setClearAfterOrderId(orderId); // Set the order ID to clear cart after success
    const { error } = await stripe.confirmPayment({ 
      elements, 
      confirmParams:{ 
        return_url: window.location.origin + "/orders/" + orderId 
      }
    });
    if (error) {
      alert(error.message);
      setClearAfterOrderId(undefined); // Clear the flag if payment failed
    }
    setLoading(false);
  };

  return <form onSubmit={pay} className="space-y-3">
    <PaymentElement />
    <button 
      disabled={!stripe||!elements||loading} 
      className="btn btn-primary w-full"
    >
      {loading ? "Processing…" : "Pay now"}
    </button>
  </form>;
}