import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { deleteProductAction, setProductStatusAction } from "@/app/admin/actions";
import { requireAdminUser } from "@/lib/auth";
import { getAllProducts } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export default async function AdminProductsPage() {
  const user = await requireAdminUser();
  const products = getAllProducts();

  return (
    <AdminShell
      title="Products"
      description="Create new products, update live catalog entries, switch publish state, and archive pieces when a drop closes."
      userName={user.displayName}
    >
      <div className="flex justify-end">
        <Link
          href="/admin/products/new"
          className="rounded-full bg-[#11110f] px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#f97316] hover:text-black"
        >
          Add new product
        </Link>
      </div>
      <section className="grid gap-4">
        {products.map((product) => (
          <article key={product.id} className="grid gap-5 rounded-[2rem] bg-white p-5 shadow-[0_24px_80px_rgba(17,17,15,0.08)] lg:grid-cols-[120px_1fr_auto] lg:items-center">
            <img src={product.images[0]?.url} alt={product.title} className="aspect-[4/5] w-full rounded-[1.5rem] object-cover" />
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-stone-500">{product.category}</p>
              <h2 className="mt-2 text-2xl font-semibold">{product.title}</h2>
              <p className="mt-2 text-sm text-stone-500">
                {product.status} · {formatCurrency(product.price)} · {product.inventory} in stock
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link
                href={`/admin/products/${product.id}`}
                className="rounded-full border border-stone-200 px-4 py-2 text-xs uppercase tracking-[0.18em]"
              >
                Edit
              </Link>
              <form action={setProductStatusAction}>
                <input type="hidden" name="productId" value={product.id} />
                <input type="hidden" name="status" value={product.status === "published" ? "draft" : "published"} />
                <button className="rounded-full border border-stone-200 px-4 py-2 text-xs uppercase tracking-[0.18em]">
                  {product.status === "published" ? "Unpublish" : "Publish"}
                </button>
              </form>
              <form action={setProductStatusAction}>
                <input type="hidden" name="productId" value={product.id} />
                <input type="hidden" name="status" value="archived" />
                <button className="rounded-full border border-stone-200 px-4 py-2 text-xs uppercase tracking-[0.18em]">
                  Archive
                </button>
              </form>
              <form action={deleteProductAction}>
                <input type="hidden" name="productId" value={product.id} />
                <button className="rounded-full border border-rose-200 px-4 py-2 text-xs uppercase tracking-[0.18em] text-rose-600">
                  Delete
                </button>
              </form>
            </div>
          </article>
        ))}
      </section>
    </AdminShell>
  );
}
