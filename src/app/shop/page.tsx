import { SiteFooter } from "@/components/store/site-footer";
import { SiteHeader } from "@/components/store/site-header";
import { ProductCard } from "@/components/store/product-card";
import { getCollections, getPublishedProducts } from "@/lib/store";

export default function ShopPage() {
  const products = getPublishedProducts();
  const collections = getCollections();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <section className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-[#c9a227]">Boutique / المتجر</p>
          <h1 className="display-font mt-4 text-6xl uppercase tracking-[0.12em] text-white md:text-8xl">
            Toute la selection
          </h1>
          <p className="mt-4 max-w-2xl text-stone-300">
            Tous les produits publies sont visibles ici. Les brouillons restent caches jusqu&apos;a validation admin.
          </p>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-stone-400">Collections</p>
            <div className="mt-4 space-y-3">
              {collections.map((collection) => (
                <a
                  key={collection.category}
                  href={`/collections/${collection.category.toLowerCase()}`}
                  className="flex items-center justify-between rounded-full border border-white/10 px-4 py-3 text-sm uppercase tracking-[0.18em] text-stone-200"
                >
                  <span>{collection.category}</span>
                  <span className="text-stone-500">{collection.count}</span>
                </a>
              ))}
            </div>
          </aside>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
