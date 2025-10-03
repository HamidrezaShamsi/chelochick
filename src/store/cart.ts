import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartItem = { 
  id: string;
  name: string;
  priceCents: number;
  quantity: number;
  notes?: string;
};

type SavedItem = {
  id: string;
  name: string;
  priceCents: number;
  savedAt: number;
};

type CartState = {
  items: CartItem[];
  savedItems: SavedItem[];
  pickupTime?: Date;
  clearAfterOrderId?: string;
  add: (item: CartItem) => void;
  update: (id: string, updates: Partial<CartItem>) => void;
  remove: (id: string) => Promise<boolean>;
  clear: () => Promise<boolean>;
  saveForLater: (id: string) => void;
  moveToCart: (id: string) => void;
  setPickupTime: (time: Date) => void;
  setClearAfterOrderId: (id: string | undefined) => void;
};

export const useCart = create<CartState>(
  persist(
    (set) => ({
      items: [],
      savedItems: [],
      pickupTime: undefined,
      clearAfterOrderId: undefined,
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
      update: (id, updates) => set((state) => ({
        items: state.items.map(x => 
          x.id === id ? { ...x, ...updates } : x
        )
      })),
      remove: async (id) => {
        const confirmed = await new Promise<boolean>(resolve => {
          if (window.confirm("Remove this item from cart?")) resolve(true);
          else resolve(false);
        });
        if (confirmed) {
          set((state) => ({
            items: state.items.filter(x => x.id !== id)
          }));
        }
        return confirmed;
      },
      clear: async () => {
        const confirmed = await new Promise<boolean>(resolve => {
          if (window.confirm("Clear your entire cart?")) resolve(true);
          else resolve(false);
        });
        if (confirmed) {
          set({ items: [] });
        }
        return confirmed;
      },
      saveForLater: (id) => set((state) => {
        const item = state.items.find(x => x.id === id);
        if (!item) return state;
        return {
          items: state.items.filter(x => x.id !== id),
          savedItems: [...state.savedItems, {
            id: item.id,
            name: item.name,
            priceCents: item.priceCents,
            savedAt: Date.now()
          }]
        };
      }),
      moveToCart: (id) => set((state) => {
        const saved = state.savedItems.find(x => x.id === id);
        if (!saved) return state;
        return {
          savedItems: state.savedItems.filter(x => x.id !== id),
          items: [...state.items, { ...saved, quantity: 1 }]
        };
      }),
      setPickupTime: (time) => set({ pickupTime: time }),
      setClearAfterOrderId: (id) => set({ clearAfterOrderId: id })
    }),
    { name: "cart-storage" }
  )
);