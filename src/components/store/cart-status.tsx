"use client";

import Link from "next/link";
import { useCart } from "@/components/store/cart-provider";

export function CartStatus() {
  const { itemCount } = useCart();

  return (
    <Link href="/cart" className="flex items-center gap-3 transition hover:text-[#f97316]">
      <span>Cart</span>
      <span className="rounded-full border border-white/20 px-2 py-1 text-xs">{itemCount}</span>
    </Link>
  );
}
