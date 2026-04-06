import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/store/site-footer";
import { SiteHeader } from "@/components/store/site-header";
import { ProductCard } from "@/components/store/product-card";
import { getCollectionProducts } from "@/lib/store";

function toCategory(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = toCategory(slug);
  const products = getCollectionProducts(category);

  if (products.length === 0) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <section className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-[#c9a227]">Collection</p>
          <h1 className="display-font mt-4 text-6xl uppercase tracking-[0.12em] text-white md:text-8xl">{category}</h1>
          <p className="mt-4 max-w-2xl text-stone-300">
            Articles filtres par collection pour une navigation plus rapide sur mobile et desktop.
          </p>
        </section>
        <section className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
