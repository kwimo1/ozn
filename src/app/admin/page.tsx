import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminUser } from "@/lib/auth";
import { getDashboardMetrics } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const user = await requireAdminUser();
  const metrics = getDashboardMetrics();

  return (
    <AdminShell
      title="Dashboard"
      description="Watch revenue, recent orders, low-stock pressure, and publishing activity from one control surface."
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
            <Link href="/admin/orders" className="text-sm uppercase tracking-[0.18em] text-[#f97316]">
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
            <Link href="/admin/products" className="text-sm uppercase tracking-[0.18em] text-[#f97316]">
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
    </AdminShell>
  );
}
