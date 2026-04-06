import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";

export function AdminShell({
  title,
  description,
  userName,
  children,
}: {
  title: string;
  description: string;
  userName: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7f2e2] text-[#11110f]">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-8 px-4 py-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-8">
        <aside className="rounded-[2rem] bg-[#0d0d10] p-6 text-stone-100">
          <p className="text-xs uppercase tracking-[0.3em] text-[#c9a227]/70">Admin Suite</p>
          <p className="mt-3 text-2xl font-black uppercase tracking-[0.24em] text-[#f5de8b]">OZN Store</p>
          <nav className="mt-10 space-y-3 text-sm uppercase tracking-[0.22em] text-stone-300">
            <Link className="block rounded-full px-4 py-3 transition hover:bg-white/10" href="/admin">
              Dashboard
            </Link>
            <Link className="block rounded-full px-4 py-3 transition hover:bg-white/10" href="/admin/drop">
              Hero Drop
            </Link>
            <Link className="block rounded-full px-4 py-3 transition hover:bg-white/10" href="/admin/products">
              Products
            </Link>
            <Link className="block rounded-full px-4 py-3 transition hover:bg-white/10" href="/admin/orders">
              Orders
            </Link>
            <Link className="block rounded-full px-4 py-3 transition hover:bg-white/10" href="/">
              View Store
            </Link>
          </nav>
          <div className="mt-10 rounded-[1.5rem] border border-white/10 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-stone-500">Signed in</p>
            <p className="mt-2 font-semibold text-white">{userName}</p>
            <form action={logoutAction} className="mt-4">
              <button
                type="submit"
                className="rounded-full border border-[#c9a227]/35 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#f5de8b] transition hover:border-[#f5de8b]"
              >
                Logout
              </button>
            </form>
          </div>
        </aside>
        <main className="space-y-6">
          <div className="rounded-[2rem] bg-white px-6 py-6 shadow-[0_24px_80px_rgba(17,17,15,0.08)]">
            <p className="text-xs uppercase tracking-[0.28em] text-stone-500">Operations</p>
            <h1 className="mt-3 text-4xl font-black uppercase tracking-[0.16em]">{title}</h1>
            <p className="mt-3 max-w-3xl text-base text-stone-600">{description}</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
