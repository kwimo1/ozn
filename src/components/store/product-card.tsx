import Link from "next/link";
import type { Product } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0]?.url ?? "/seed/night-shift-bomber.svg";

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col gap-4 border-t border-white/15 pt-5 transition hover:border-[#f97316]"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.8rem] bg-[#141418]">
        <img
          src={image}
          alt={product.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-x-4 bottom-4 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-white">
          <span>{product.category}</span>
          <span>{product.inventory > 0 ? "In Stock" : "Sold Out"}</span>
        </div>
      </div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xl font-semibold text-white">{product.title}</p>
          <p className="mt-1 text-sm text-stone-400">
            {product.variants.map((variant) => variant.label).join(" / ")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-white">{formatCurrency(product.price)}</p>
          {product.comparePrice ? (
            <p className="text-sm text-stone-500 line-through">{formatCurrency(product.comparePrice)}</p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
