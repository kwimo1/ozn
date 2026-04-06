import Link from "next/link";
import { SiteFooter } from "@/components/store/site-footer";
import { SiteHeader } from "@/components/store/site-header";
import { ProductCard } from "@/components/store/product-card";
import { getCollections, getHeroDrop, getPublishedProducts } from "@/lib/store";

export default function HomePage() {
  const products = getPublishedProducts();
  const collections = getCollections();
  const featured = products.slice(0, 3);
  const heroDrop = getHeroDrop();

  return (
    <>
      <SiteHeader />
      <main>
        <section className="noise-overlay overflow-hidden">
          <div className="mx-auto grid min-h-[calc(100svh-86px)] max-w-7xl gap-8 px-4 py-8 md:px-8 md:py-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-end lg:gap-12 lg:py-16">
            <div className="flex flex-col justify-end">
              <p className="text-xs uppercase tracking-[0.42em] text-[#c9a227] md:text-sm">
                {heroDrop?.badge ?? "Nouveau Drop / جديد"}
              </p>
              <p className="mt-4 text-sm uppercase tracking-[0.38em] text-stone-300">OZN Store</p>
              <h1 className="display-font mt-4 max-w-4xl text-[3.8rem] uppercase leading-[0.9] tracking-[0.08em] text-white sm:text-[5.3rem] lg:text-[8.5rem]">
                {heroDrop?.title ?? "Noir. Dorure. Silhouette street pour l&apos;Algerie."}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-stone-300 md:text-lg md:leading-8">
                {heroDrop?.description ??
                  "Une lecture simple, un drop unique en vitrine, et une experience pensee pour convertir vite sur mobile."}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/shop"
                  className="rounded-full bg-[#c9a227] px-7 py-4 text-sm font-semibold uppercase tracking-[0.26em] text-black transition hover:bg-[#e2c769]"
                >
                  {heroDrop?.ctaLabel ?? "Voir le drop"}
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2rem] border border-[#c9a227]/20 bg-[#c9a227]/10 md:translate-x-8 md:translate-y-8 md:rounded-[2.5rem]" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#111114] md:rounded-[2.5rem]">
                <img
                  src={heroDrop?.imageUrl ?? "/seed/ozn-hero-drop.svg"}
                  alt={heroDrop?.title ?? "OZN Store hero drop"}
                  className="aspect-[4/5] w-full object-cover lg:aspect-[5/6]"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="section-frame px-4 py-14 md:px-8 md:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-stone-400">Selection / مختارات</p>
                <h2 className="display-font mt-3 text-4xl uppercase tracking-[0.12em] text-white md:text-7xl">
                  Pieces du moment
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-stone-400 md:text-base">
                Les produits publies apparaissent ici automatiquement. L&apos;admin peut garder des brouillons sans les
                montrer a la boutique.
              </p>
            </div>
            <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        <section className="section-frame px-4 py-14 md:px-8 md:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="story-grid gap-6">
              <div className="col-span-7 overflow-hidden rounded-[2rem] border border-white/10 bg-[#101015]">
                <img src="/seed/editorial-panel.svg" alt="Campagne OZN Store" className="aspect-[16/10] w-full object-cover" />
              </div>
              <div className="col-span-5 flex flex-col justify-between rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-[#c9a227]">Algerie ready / جاهز</p>
                  <h2 className="display-font mt-4 text-4xl uppercase tracking-[0.12em] text-white md:text-6xl">
                    Navigation claire. Achat rapide. Look fort.
                  </h2>
                  <p className="mt-5 max-w-md text-sm leading-7 text-stone-300 md:text-base md:leading-8">
                    Mix de francais et d&apos;arabe leger, checkout plus simple, et design noir-or pour mettre le produit
                    en avant sans encombrer l&apos;ecran.
                  </p>
                </div>
                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  {collections.map((collection) => (
                    <Link
                      key={collection.category}
                      href={`/collections/${collection.category.toLowerCase()}`}
                      className="rounded-[1.4rem] border border-white/10 px-5 py-5 transition hover:border-[#c9a227] hover:bg-white/5"
                    >
                      <p className="text-sm uppercase tracking-[0.24em] text-stone-400">{collection.count} articles</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{collection.category}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
