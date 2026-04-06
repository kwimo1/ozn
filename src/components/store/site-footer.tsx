import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#09090d] px-5 py-10 text-sm text-stone-400 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-md space-y-3">
          <p className="text-xl font-black uppercase tracking-[0.3em] text-[#f5de8b]">OZN Store</p>
          <p>
            Mode urbaine noir et or, pensee pour l&apos;Algerie moderne. Style clair, achat rapide, experience mobile.
          </p>
        </div>
        <div className="flex flex-wrap gap-5 uppercase tracking-[0.2em] text-stone-300">
          <Link href="/shop">Boutique</Link>
          <Link href="/about">A propos</Link>
          <Link href="/admin/login">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
