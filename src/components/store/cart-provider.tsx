"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type CartItem = {
  productId: string;
  title: string;
  image: string;
  price: number;
  variant: string;
  quantity: number;
  slug: string;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, variant: string, quantity: number) => void;
  removeItem: (productId: string, variant: string) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "nova-thread-cart";
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as CartItem[];
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      addItem(item) {
        setItems((current) => {
          const existing = current.find(
            (entry) => entry.productId === item.productId && entry.variant === item.variant,
          );

          if (!existing) {
            return [...current, item];
          }

          return current.map((entry) =>
            entry.productId === item.productId && entry.variant === item.variant
              ? { ...entry, quantity: entry.quantity + item.quantity }
              : entry,
          );
        });
      },
      updateQuantity(productId, variant, quantity) {
        setItems((current) =>
          current
            .map((entry) =>
              entry.productId === productId && entry.variant === variant ? { ...entry, quantity } : entry,
            )
            .filter((entry) => entry.quantity > 0),
        );
      },
      removeItem(productId, variant) {
        setItems((current) =>
          current.filter((entry) => !(entry.productId === productId && entry.variant === variant)),
        );
      },
      clearCart() {
        setItems([]);
      },
    }),
    [items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);

  if (!value) {
    throw new Error("useCart must be used within CartProvider");
  }

  return value;
}
