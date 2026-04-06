import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#09090d] px-5 py-10 text-sm text-stone-400 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-md space-y-3">
          <p className="text-xl font-black uppercase tracking-[0.3em] text-stone-100">Nova Thread</p>
          <p>
            Streetwear built like a night signal: sharp structure, strong texture, and enough edge to feel
            alive in motion.
          </p>
        </div>
        <div className="flex flex-wrap gap-5 uppercase tracking-[0.2em] text-stone-300">
          <Link href="/shop">Shop</Link>
          <Link href="/about">About</Link>
          <Link href="/admin/login">Admin Login</Link>
        </div>
      </div>
    </footer>
  );
}
