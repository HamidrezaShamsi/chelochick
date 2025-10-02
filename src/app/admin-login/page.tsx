"use client";
import { useState } from "react";

export default function Page(){
  const [p,setP] = useState("");
  async function submit(e:React.FormEvent){
    e.preventDefault();
    const res = await fetch("/api/admin-login", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ password:p }) });
    if (res.ok) { window.location.href="/admin"; } else { alert("Invalid password"); }
  }
  return <form onSubmit={submit} className="card max-w-sm space-y-3">
    <h3 className="font-semibold">Admin Sign-in</h3>
    <input className="w-full border rounded p-2" type="password" placeholder="Password" value={p} onChange={e=>setP(e.target.value)} />
    <button className="btn btn-primary w-full">Enter</button>
  </form>;
}