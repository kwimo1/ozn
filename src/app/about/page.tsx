import { SiteFooter } from "@/components/store/site-footer";
import { SiteHeader } from "@/components/store/site-header";

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <section className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-[#c9a227]">A propos</p>
            <h1 className="display-font mt-4 text-6xl uppercase tracking-[0.12em] text-white md:text-8xl">OZN Store</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-300">
              OZN Store propose une direction noire et doree, inspiree par la rue, mais avec une lecture simple
              pour l&apos;achat en Algerie. Le produit reste au centre, la mise en scene sert juste a mieux vendre.
            </p>
          </div>
          <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#111115]">
            <img src="/seed/about-panel.svg" alt="OZN Store brand panel" className="aspect-square w-full object-cover" />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
