"use client";
import { useCart } from "@/store/cart";
export function AddButton({ item }:{ item:{ id:string; name:string; priceCents:number; quantity:number } }){
  const add = useCart(s=>s.add);
  return <button className="btn btn-primary" onClick={()=>add(item)}>Add</button>;
}