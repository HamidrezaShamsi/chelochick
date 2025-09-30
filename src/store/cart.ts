import { create } from "zustand";
type CartItem = { id:string; name:string; priceCents:number; quantity:number };
type State = { items: CartItem[]; add:(i:CartItem)=>void; update:(id:string,q:number)=>void; remove:(id:string)=>void; clear:()=>void; };
export const useCart = create<State>((set)=>({
  items: [],
  add: (i)=> set((s)=> {
    const existing = s.items.find(x=>x.id===i.id);
    if (existing) return { items: s.items.map(x=> x.id===i.id ? {...x, quantity:x.quantity+i.quantity} : x) };
    return { items: [...s.items, i] };
  }),
  update:(id,q)=> set((s)=>({ items: s.items.map(x=> x.id===id ? {...x, quantity:q} : x)})),
  remove:(id)=> set((s)=>({ items: s.items.filter(x=> x.id!==id)})),
  clear:()=> set({ items: [] }),
}));