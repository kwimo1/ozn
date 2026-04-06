import { SiteFooter } from "@/components/store/site-footer";
import { SiteHeader } from "@/components/store/site-header";

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <section className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-[#f97316]">About</p>
            <h1 className="display-font mt-4 text-6xl uppercase tracking-[0.12em] text-white md:text-8xl">Nova Thread</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-300">
              We design clothing with the energy of a campaign shoot and the practicality of everyday city
              wear. The store is product-led, but the brand language stays cinematic: confident typography,
              stark surfaces, and materials that feel tough enough to keep pace.
            </p>
          </div>
          <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#111115]">
            <img src="/seed/about-panel.svg" alt="Nova Thread brand panel" className="aspect-square w-full object-cover" />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
