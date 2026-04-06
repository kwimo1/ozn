import Link from "next/link";
import { SiteFooter } from "@/components/store/site-footer";
import { SiteHeader } from "@/components/store/site-header";
import { ProductCard } from "@/components/store/product-card";
import { getCollections, getPublishedProducts } from "@/lib/store";

export default function HomePage() {
  const products = getPublishedProducts();
  const collections = getCollections();
  const featured = products.slice(0, 3);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="noise-overlay overflow-hidden">
          <div className="mx-auto grid min-h-[calc(100svh-72px)] max-w-7xl gap-10 px-5 py-10 md:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:py-16">
            <div className="flex flex-col justify-end">
              <p className="text-sm uppercase tracking-[0.42em] text-[#f97316]">Drop 01 / Lagos after dark</p>
              <h1 className="display-font mt-6 max-w-4xl text-[5.2rem] uppercase leading-[0.88] tracking-[0.08em] text-white sm:text-[7rem] lg:text-[10rem]">
                Streetwear cut for the city at full voltage.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-stone-300">
                Nova Thread mixes campaign-grade silhouettes with hardwearing utility details, built to feel
                sharp from first light to the last train out.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/shop"
                  className="rounded-full bg-[#f97316] px-7 py-4 text-sm font-semibold uppercase tracking-[0.26em] text-black"
                >
                  Shop the drop
                </Link>
                <Link
                  href="/admin/login"
                  className="rounded-full border border-white/15 px-7 py-4 text-sm font-semibold uppercase tracking-[0.26em] text-white"
                >
                  Admin access
                </Link>
              </div>
            </div>
            <div className="relative lg:pb-4">
              <div className="absolute inset-0 translate-x-8 translate-y-8 rounded-[2.5rem] border border-white/10 bg-white/5" />
              <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#111114]">
                <img src="/seed/home-hero.svg" alt="Nova Thread hero composition" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        <section className="section-frame px-5 py-16 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-stone-400">Featured pieces</p>
                <h2 className="display-font mt-3 text-5xl uppercase tracking-[0.12em] text-white md:text-7xl">
                  Current signal
                </h2>
              </div>
              <p className="max-w-xl text-stone-400">
                Three pieces anchor the opening drop: a cropped bomber, a technical cargo, and a breathable
                performance tee cut with oversized volume.
              </p>
            </div>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        <section className="section-frame px-5 py-16 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="story-grid gap-6">
              <div className="col-span-7 overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#101015]">
                <img src="/seed/editorial-panel.svg" alt="Editorial campaign art" className="aspect-[16/10] w-full object-cover" />
              </div>
              <div className="col-span-5 flex flex-col justify-between rounded-[2.5rem] border border-white/10 bg-white/5 p-8">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-[#f97316]">Built for movement</p>
                  <h2 className="display-font mt-4 text-5xl uppercase tracking-[0.12em] text-white md:text-6xl">
                    Layered structure. Night-ready finish.
                  </h2>
                  <p className="mt-5 max-w-md text-base leading-8 text-stone-300">
                    We keep the palette focused, the hardware crisp, and the silhouettes slightly oversized so
                    each piece lands with presence without losing daily wearability.
                  </p>
                </div>
                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  {collections.map((collection) => (
                    <Link
                      key={collection.category}
                      href={`/collections/${collection.category.toLowerCase()}`}
                      className="rounded-[1.6rem] border border-white/10 px-5 py-5 transition hover:border-[#f97316] hover:bg-white/5"
                    >
                      <p className="text-sm uppercase tracking-[0.24em] text-stone-400">{collection.count} items</p>
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
