"use client";

import { useState } from "react";
import type { Product } from "@/lib/store";
import { useCart } from "@/components/store/cart-provider";
import { formatCurrency } from "@/lib/utils";

export function AddToCartButton({ product }: { product: Product }) {
  const defaultVariant = product.variants[0]?.label ?? "One Size";
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  return (
    <div className="space-y-5 rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.28em] text-stone-400">Choose size</p>
        <div className="flex flex-wrap gap-3">
          {product.variants.map((variant) => (
            <button
              key={variant.id}
              type="button"
              onClick={() => setSelectedVariant(variant.label)}
              className={`rounded-full border px-4 py-2 text-sm uppercase tracking-[0.2em] transition ${
                selectedVariant === variant.label
                  ? "border-[#f97316] bg-[#f97316] text-black"
                  : "border-white/15 text-stone-200 hover:border-white/40"
              }`}
            >
              {variant.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <label className="text-sm uppercase tracking-[0.2em] text-stone-400" htmlFor="qty">
          Qty
        </label>
        <input
          id="qty"
          type="number"
          min={1}
          value={quantity}
          onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
          className="w-20 rounded-full border border-white/15 bg-transparent px-4 py-2 text-white outline-none"
        />
      </div>
      <button
        type="button"
        onClick={() =>
          addItem({
            productId: product.id,
            title: product.title,
            image: product.images[0]?.url ?? "/seed/night-shift-bomber.svg",
            price: product.price,
            variant: selectedVariant,
            quantity,
            slug: product.slug,
          })
        }
        className="w-full rounded-full bg-[#f97316] px-6 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-black transition hover:bg-[#fb923c]"
      >
        Add to Cart · {formatCurrency(product.price)}
      </button>
    </div>
  );
}
