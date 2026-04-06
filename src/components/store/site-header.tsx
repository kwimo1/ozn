import Link from "next/link";
import { CartStatus } from "@/components/store/cart-status";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(8,8,12,0.82)] backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-8">
        <div className="flex items-center justify-between text-sm uppercase tracking-[0.22em] text-stone-100">
          <Link href="/" className="text-xl font-black tracking-[0.34em] text-[#f5de8b] md:text-2xl">
            OZN Store
          </Link>
          <CartStatus />
        </div>
        <nav className="mt-4 hidden items-center gap-6 text-sm uppercase tracking-[0.24em] text-stone-200 md:flex">
          <Link href="/shop" className="transition hover:text-[#c9a227]">
            Boutique
          </Link>
          <Link href="/about" className="transition hover:text-[#c9a227]">
            A propos
          </Link>
        </nav>
        <nav className="mt-4 flex gap-3 overflow-x-auto pb-1 text-xs uppercase tracking-[0.2em] text-stone-200 md:hidden">
          <Link
            href="/shop"
            className="whitespace-nowrap rounded-full border border-white/10 px-4 py-2 transition hover:border-[#c9a227] hover:text-[#f5de8b]"
          >
            Boutique
          </Link>
          <Link
            href="/about"
            className="whitespace-nowrap rounded-full border border-white/10 px-4 py-2 transition hover:border-[#c9a227] hover:text-[#f5de8b]"
          >
            A propos
          </Link>
          <Link
            href="/cart"
            className="whitespace-nowrap rounded-full border border-white/10 px-4 py-2 transition hover:border-[#c9a227] hover:text-[#f5de8b]"
          >
            Panier
          </Link>
        </nav>
      </div>
    </header>
  );
}
