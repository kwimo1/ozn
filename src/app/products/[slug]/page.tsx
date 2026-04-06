import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { ProductCard } from "@/components/store/product-card";
import { SiteFooter } from "@/components/store/site-footer";
import { SiteHeader } from "@/components/store/site-header";
import { getProductBySlug, getPublishedProducts } from "@/lib/store";
import { formatCurrency, parseTags } from "@/lib/utils";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product || product.status !== "published") {
    notFound();
  }

  const related = getPublishedProducts()
    .filter((entry) => entry.id !== product.id && entry.category === product.category)
    .slice(0, 3);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-4">
            {product.images.map((image) => (
              <div key={image.id} className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#111115]">
                <img src={image.url} alt={image.alt} className="aspect-[4/5] w-full object-cover" />
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-[#c9a227]">{product.category}</p>
            <h1 className="display-font text-5xl uppercase tracking-[0.12em] text-white md:text-8xl">{product.title}</h1>
            <div className="flex items-end gap-4">
              <p className="text-3xl font-semibold text-white">{formatCurrency(product.price)}</p>
              {product.comparePrice ? (
                <p className="text-lg text-stone-500 line-through">{formatCurrency(product.comparePrice)}</p>
              ) : null}
            </div>
            <p className="max-w-xl text-lg leading-8 text-stone-300">{product.description}</p>

            <div className="flex flex-wrap gap-3">
              {parseTags(product.tags).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-stone-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-stone-400">Disponibilite</p>
                <p className="mt-2 text-2xl font-semibold text-white">{product.inventory} pieces pretes</p>
              </div>
              <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-stone-400">Livraison</p>
                <p className="mt-2 text-2xl font-semibold text-white">Desk ou domicile en Algerie</p>
              </div>
            </div>

            <AddToCartButton product={product} />
          </div>
        </section>

        {related.length ? (
          <section className="section-frame mt-16 pt-16">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-stone-400">Associes</p>
              <h2 className="display-font mt-3 text-5xl uppercase tracking-[0.12em] text-white">Continue le drop</h2>
            </div>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {related.map((entry) => (
                <ProductCard key={entry.id} product={entry} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}
