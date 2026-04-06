import { AdminShell } from "@/components/admin/admin-shell";
import { updateOrderStatusAction } from "@/app/admin/actions";
import { requireAdminUser } from "@/lib/auth";
import { getOrders } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const user = await requireAdminUser();
  const orders = getOrders();

  return (
    <AdminShell
      title="Orders"
      description="Suivi des commandes, mode de livraison, statut de traitement, et montant total."
      userName={user.displayName}
    >
      <section className="grid gap-4">
        {orders.map((order) => (
          <article key={order.id} className="rounded-[2rem] bg-white p-6 shadow-[0_24px_80px_rgba(17,17,15,0.08)]">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-stone-500">{order.orderNumber}</p>
                <h2 className="mt-2 text-2xl font-semibold">{order.customerName}</h2>
                <p className="mt-2 text-sm text-stone-500">{order.customerPhone}</p>
                {order.customerEmail ? <p className="mt-1 text-sm text-stone-500">{order.customerEmail}</p> : null}
                <p className="mt-2 text-sm text-stone-500">Wilaya: {order.wilaya}</p>
                <p className="mt-1 text-sm text-stone-500">
                  Mode: {order.shippingMode === "desk" ? "Desk" : "Domicile"}
                </p>
                {order.shippingAddress ? (
                  <p className="mt-1 text-sm text-stone-500">Adresse: {order.shippingAddress}</p>
                ) : null}
              </div>
              <div className="space-y-3 lg:text-right">
                <p className="text-3xl font-black uppercase tracking-[0.1em]">{formatCurrency(order.total)}</p>
                <p className="text-sm uppercase tracking-[0.18em] text-stone-500">
                  Payment: {order.paymentStatus}
                </p>
                <form action={updateOrderStatusAction} className="flex flex-wrap gap-3 lg:justify-end">
                  <input type="hidden" name="orderId" value={order.id} />
                  <select
                    name="status"
                    defaultValue={order.fulfillmentStatus}
                    className="rounded-full border border-stone-200 px-4 py-2 text-sm"
                  >
                    <option value="new">New</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button className="rounded-full bg-[#c9a227] px-4 py-2 text-xs uppercase tracking-[0.18em] text-black">
                    Save
                  </button>
                </form>
              </div>
            </div>
            <div className="mt-5 grid gap-3 border-t border-stone-200 pt-5">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-stone-500">
                      {item.variant} - qty {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">{formatCurrency(item.unitPrice * item.quantity)}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </AdminShell>
  );
}
