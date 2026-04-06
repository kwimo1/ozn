import Link from "next/link";
import { CartStatus } from "@/components/store/cart-status";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(8,8,12,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 text-sm uppercase tracking-[0.28em] text-stone-100 md:px-8">
        <Link href="/" className="text-2xl font-black tracking-[0.36em] text-white">
          Nova Thread
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/shop" className="transition hover:text-[#f97316]">
            Shop
          </Link>
          <Link href="/collections/outerwear" className="transition hover:text-[#f97316]">
            Outerwear
          </Link>
          <Link href="/collections/tops" className="transition hover:text-[#f97316]">
            Tops
          </Link>
          <Link href="/about" className="transition hover:text-[#f97316]">
            About
          </Link>
          <Link href="/admin" className="transition hover:text-[#f97316]">
            Admin
          </Link>
        </nav>
        <CartStatus />
      </div>
    </header>
  );
}
