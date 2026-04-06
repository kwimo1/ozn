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
          <p className="text-sm uppercase tracking-[0.3em] text-[#c9a227]">Panier / السلة</p>
          <h1 className="display-font mt-4 text-5xl uppercase tracking-[0.12em] text-white md:text-8xl">Commande rapide</h1>
          <p className="mt-4 max-w-2xl text-stone-300">
            Formulaire adapte pour l&apos;Algerie: wilaya, mode de livraison, et adresse uniquement si la livraison est a domicile.
          </p>
        </section>
        <CartPageClient products={products} />
      </main>
      <SiteFooter />
    </>
  );
}
