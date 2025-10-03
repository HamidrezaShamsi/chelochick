"use client";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  async function register(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, phone })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        alert("Registration successful! Please login.");
        window.location.href = "/login";
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={register} className="card space-y-4">
        <h2 className="text-xl font-semibold">Create Account</h2>
        
        <input 
          type="text" 
          placeholder="Full name" 
          className="w-full border rounded p-2"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        
        <input 
          type="email" 
          placeholder="Email" 
          className="w-full border rounded p-2"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        
        <input 
          type="tel" 
          placeholder="Phone (optional)" 
          className="w-full border rounded p-2"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
        
        <input 
          type="password" 
          placeholder="Password (min 6 characters)" 
          className="w-full border rounded p-2"
          value={password}
          onChange={e => setPassword(e.target.value)}
          minLength={6}
          required
        />
        
        <button 
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>
        
        <p className="text-sm text-center">
          Already have an account? <Link href="/login" className="text-blue-600">Login</Link>
        </p>
      </form>
    </div>
  );
}