"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

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
const STORAGE_EVENT = "ozn-cart-storage";
const EMPTY_CART: CartItem[] = [];
let cachedRawCart: string | null | undefined;
let cachedCartSnapshot: CartItem[] = EMPTY_CART;
const CartContext = createContext<CartContextValue | null>(null);

function readCartSnapshot() {
  if (typeof window === "undefined") {
    return EMPTY_CART;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (raw === cachedRawCart) {
    return cachedCartSnapshot;
  }

  if (!raw) {
    cachedRawCart = null;
    cachedCartSnapshot = EMPTY_CART;
    return cachedCartSnapshot;
  }

  try {
    cachedRawCart = raw;
    cachedCartSnapshot = JSON.parse(raw) as CartItem[];
    return cachedCartSnapshot;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    cachedRawCart = null;
    cachedCartSnapshot = EMPTY_CART;
    return cachedCartSnapshot;
  }
}

function readServerCartSnapshot() {
  return EMPTY_CART;
}

function writeCartSnapshot(items: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  if (items.length === 0) {
    window.localStorage.removeItem(STORAGE_KEY);
    cachedRawCart = null;
    cachedCartSnapshot = EMPTY_CART;
    window.dispatchEvent(new Event(STORAGE_EVENT));
    return;
  }

  const raw = JSON.stringify(items);
  window.localStorage.setItem(STORAGE_KEY, raw);
  cachedRawCart = raw;
  cachedCartSnapshot = items;
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = () => onStoreChange();
  window.addEventListener("storage", handleStorage);
  window.addEventListener(STORAGE_EVENT, handleStorage);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(STORAGE_EVENT, handleStorage);
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, readCartSnapshot, readServerCartSnapshot);

  const value: CartContextValue = {
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    addItem(item) {
      const current = readCartSnapshot();
      const existing = current.find(
        (entry) => entry.productId === item.productId && entry.variant === item.variant,
      );

      if (!existing) {
        writeCartSnapshot([...current, item]);
        return;
      }

      writeCartSnapshot(
        current.map((entry) =>
          entry.productId === item.productId && entry.variant === item.variant
            ? { ...entry, quantity: entry.quantity + item.quantity }
            : entry,
        ),
      );
    },
    updateQuantity(productId, variant, quantity) {
      writeCartSnapshot(
        readCartSnapshot()
          .map((entry) =>
            entry.productId === productId && entry.variant === variant ? { ...entry, quantity } : entry,
          )
          .filter((entry) => entry.quantity > 0),
      );
    },
    removeItem(productId, variant) {
      writeCartSnapshot(
        readCartSnapshot().filter(
          (entry) => !(entry.productId === productId && entry.variant === variant),
        ),
      );
    },
    clearCart() {
      writeCartSnapshot([]);
    },
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);

  if (!value) {
    throw new Error("useCart must be used within CartProvider");
  }

  return value;
}
