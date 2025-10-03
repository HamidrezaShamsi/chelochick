import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartItem = { 
  id: string;
  name: string;
  priceCents: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  add: (item: CartItem) => void;
  update: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>(
  persist(
    (set) => ({
      items: [],
      add: (item) => set((state) => {
        const existing = state.items.find(x => x.id === item.id);
        if (existing) {
          return {
            items: state.items.map(x => 
              x.id === item.id 
                ? { ...x, quantity: x.quantity + item.quantity }
                : x
            )
          };
        }
        return { items: [...state.items, item] };
      }),
      update: (id, quantity) => set((state) => ({
        items: state.items.map(x => 
          x.id === id ? { ...x, quantity } : x
        )
      })),
      remove: (id) => set((state) => ({
        items: state.items.filter(x => x.id !== id)
      })),
      clear: () => set({ items: [] })
    }),
    { name: "cart-storage" }
  )
);