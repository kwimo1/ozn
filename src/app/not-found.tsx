import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <section className="max-w-2xl rounded-[2.5rem] border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-sm uppercase tracking-[0.32em] text-[#f97316]">404</p>
        <h1 className="display-font mt-4 text-6xl uppercase tracking-[0.14em] text-white">Page not found</h1>
        <p className="mt-4 text-stone-300">That route does not exist in the current storefront or admin flow.</p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-[#f97316] px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-black"
        >
          Back home
        </Link>
      </section>
    </main>
  );
}
