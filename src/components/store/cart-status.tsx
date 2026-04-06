"use client";

import Link from "next/link";
import { useCart } from "@/components/store/cart-provider";

export function CartStatus() {
  const { itemCount } = useCart();

  return (
    <Link href="/cart" className="flex items-center gap-3 transition hover:text-[#c9a227]">
      <span>Panier</span>
      <span className="rounded-full border border-[#c9a227]/30 px-2 py-1 text-xs text-[#f5de8b]">{itemCount}</span>
    </Link>
  );
}
