import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminUser } from "@/lib/auth";
import { getDashboardMetrics, getHeroDrop } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const user = await requireAdminUser();
  const metrics = getDashboardMetrics();
  const heroDrop = getHeroDrop();

  return (
    <AdminShell
      title="Dashboard"
      description="Suivi rapide des ventes, du stock faible, des commandes recentes et du hero drop."
      userName={user.displayName}
    >
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Revenue", value: formatCurrency(metrics.revenue) },
          { label: "Orders", value: String(metrics.ordersCount) },
          { label: "Products", value: String(metrics.productCount) },
          { label: "Low stock", value: String(metrics.lowStock) },
        ].map((card) => (
          <article key={card.label} className="rounded-[2rem] bg-white p-6 shadow-[0_24px_80px_rgba(17,17,15,0.08)]">
            <p className="text-sm uppercase tracking-[0.24em] text-stone-500">{card.label}</p>
            <p className="mt-4 text-4xl font-black uppercase tracking-[0.1em]">{card.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[2rem] bg-white p-6 shadow-[0_24px_80px_rgba(17,17,15,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-stone-500">Recent orders</p>
              <h2 className="mt-2 text-2xl font-semibold">Sales pulse</h2>
            </div>
            <Link href="/admin/orders" className="text-sm uppercase tracking-[0.18em] text-[#c9a227]">
              Manage
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {metrics.orders.slice(0, 5).map((order) => (
              <div key={order.id} className="grid gap-2 rounded-[1.5rem] border border-stone-200 p-4 md:grid-cols-[1fr_auto_auto] md:items-center">
                <div>
                  <p className="font-semibold">{order.orderNumber}</p>
                  <p className="text-sm text-stone-500">{order.customerName}</p>
                </div>
                <p className="text-sm uppercase tracking-[0.18em] text-stone-500">{order.fulfillmentStatus}</p>
                <p className="text-lg font-semibold">{formatCurrency(order.total)}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] bg-white p-6 shadow-[0_24px_80px_rgba(17,17,15,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-stone-500">Catalog watch</p>
              <h2 className="mt-2 text-2xl font-semibold">Low stock</h2>
            </div>
            <Link href="/admin/products" className="text-sm uppercase tracking-[0.18em] text-[#c9a227]">
              Products
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {metrics.products
              .filter((product) => product.inventory <= 12)
              .slice(0, 5)
              .map((product) => (
                <div key={product.id} className="flex items-center justify-between rounded-[1.5rem] border border-stone-200 p-4">
                  <div>
                    <p className="font-semibold">{product.title}</p>
                    <p className="text-sm text-stone-500">{product.status}</p>
                  </div>
                  <p className="text-lg font-semibold">{product.inventory}</p>
                </div>
              ))}
          </div>
        </article>
      </section>

      <section className="rounded-[2rem] bg-white p-6 shadow-[0_24px_80px_rgba(17,17,15,0.08)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-stone-500">Homepage drop</p>
            <h2 className="mt-2 text-2xl font-semibold">Hero control</h2>
            <p className="mt-2 max-w-2xl text-sm text-stone-500">
              Une seule campagne active a la fois. Mets a jour le texte, l&apos;image et l&apos;appel a l&apos;action du premier ecran.
            </p>
          </div>
          <Link
            href="/admin/drop"
            className="rounded-full bg-[#c9a227] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-[#e2c769]"
          >
            Gerer le drop
          </Link>
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_280px]">
          <div className="rounded-[1.5rem] border border-stone-200 p-5">
            <p className="text-sm uppercase tracking-[0.18em] text-stone-500">{heroDrop?.badge ?? "Aucun drop actif"}</p>
            <p className="mt-3 text-2xl font-semibold">{heroDrop?.title ?? "Le hero affiche le fallback de la boutique."}</p>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              {heroDrop?.description ??
                "Ajoute un drop pour controler la grande banniere d&apos;accueil avec une image marketing dediee."}
            </p>
          </div>
          <div className="overflow-hidden rounded-[1.5rem] border border-stone-200 bg-stone-50">
            {heroDrop ? (
              <img src={heroDrop.imageUrl} alt={heroDrop.title} className="aspect-[4/3] h-full w-full object-cover" />
            ) : (
              <div className="flex h-full min-h-[220px] items-center justify-center px-6 text-center text-sm text-stone-500">
                Aucun visuel actif
              </div>
            )}
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
