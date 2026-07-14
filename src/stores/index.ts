"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, CartItem, Address, PaymentMethod } from "@/types";

interface CartStore {
  items: CartItem[];
  coupon: string | null;
  couponDiscount: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      couponDiscount: 0,
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        });
      },
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.product.id !== productId) })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.product.id !== productId)
              : state.items.map((i) =>
                  i.product.id === productId ? { ...i, quantity } : i
                ),
        })),
      clearCart: () => set({ items: [], coupon: null, couponDiscount: 0 }),
      applyCoupon: (code, discount) => set({ coupon: code, couponDiscount: discount }),
      removeCoupon: () => set({ coupon: null, couponDiscount: 0 }),
      getSubtotal: () => get().items.reduce((s, i) => s + i.product.price * i.quantity, 0),
      getItemCount: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    { name: "highrange-cart" }
  )
);

interface WishlistStore {
  ids: string[];
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (productId) =>
        set((state) => ({
          ids: state.ids.includes(productId)
            ? state.ids.filter((id) => id !== productId)
            : [...state.ids, productId],
        })),
      has: (productId) => get().ids.includes(productId),
      clear: () => set({ ids: [] }),
    }),
    { name: "highrange-wishlist" }
  )
);

interface CompareStore {
  ids: string[];
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
  clear: () => void;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (productId) =>
        set((state) => {
          if (state.ids.includes(productId)) {
            return { ids: state.ids.filter((id) => id !== productId) };
          }
          if (state.ids.length >= 4) return state;
          return { ids: [...state.ids, productId] };
        }),
      has: (productId) => get().ids.includes(productId),
      clear: () => set({ ids: [] }),
    }),
    { name: "highrange-compare" }
  )
);

interface CheckoutStore {
  address: Address | null;
  paymentMethod: PaymentMethod;
  setAddress: (address: Address) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
}

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  address: null,
  paymentMethod: "upi",
  setAddress: (address) => set({ address }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
}));
