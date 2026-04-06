import { CartPageClient } from "@/components/store/cart-page-client";
import { SiteFooter } from "@/components/store/site-footer";
import { SiteHeader } from "@/components/store/site-header";
import { getPublishedProducts } from "@/lib/store";

export default function CartPage() {
  const products = getPublishedProducts();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <section className="mb-10 rounded-[2.5rem] border border-white/10 bg-white/5 p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-[#f97316]">Cart</p>
          <h1 className="display-font mt-4 text-6xl uppercase tracking-[0.12em] text-white md:text-8xl">Checkout intake</h1>
          <p className="mt-4 max-w-2xl text-stone-300">
            Orders created here land directly in the admin dashboard so inventory and revenue reporting stay in sync.
          </p>
        </section>
        <CartPageClient products={products} />
      </main>
      <SiteFooter />
    </>
  );
}
