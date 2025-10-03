"use client";
import { useState } from "react";

const ADDRESS = "150 Main St E, Hamilton, ON L8N 1C3"; // Replace with actual address
const MAP_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`;

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [newsletter, setNewsletter] = useState(true);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, message, newsletter })
    });
    setLoading(false);
    if (res.ok) {
      alert("Thanks! We'll get back to you.");
      setName(""); setEmail(""); setPhone(""); setMessage("");
    } else {
      alert("Sorry, something went wrong.");
    }
  }

  function openDirections() {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDRESS)}&origin=Current+Location`, "_blank");
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold">Contact Us</h2>
        <div className="card p-0 overflow-hidden">
          <iframe src={MAP_EMBED} className="w-full h-64 border-0" loading="lazy" />
        </div>
        <button onClick={openDirections} className="btn btn-primary">
          Get Directions
        </button>
        <div className="text-sm text-gray-600">Address: {ADDRESS}</div>
      </div>

      <form onSubmit={submit} className="card space-y-3">
        <h3 className="font-semibold">Send us a message</h3>
        <input 
          className="w-full border rounded p-2"
          placeholder="Your name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input 
          className="w-full border rounded p-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input 
          className="w-full border rounded p-2"
          placeholder="Phone (optional)"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
        <textarea 
          className="w-full border rounded p-2 min-h-28"
          placeholder="Message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
        />
        <label className="flex items-center gap-2 text-sm">
          <input 
            type="checkbox"
            checked={newsletter}
            onChange={e => setNewsletter(e.target.checked)}
          />
          Subscribe to our newsletter
        </label>
        <button 
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
