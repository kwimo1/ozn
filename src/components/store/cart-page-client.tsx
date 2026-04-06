"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/store";
import { useCart } from "@/components/store/cart-provider";
import { formatCurrency } from "@/lib/utils";

type CheckoutState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; orderNumber: string };

export function CartPageClient({ products }: { products: Product[] }) {
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const [shippingMode, setShippingMode] = useState<"desk" | "domicile">("desk");
  const [state, setState] = useState<CheckoutState>({ status: "idle" });

  const enriched = useMemo(
    () =>
      items.map((item) => {
        const product = products.find((entry) => entry.id === item.productId);
        return {
          ...item,
          product,
          subtotal: item.quantity * item.price,
        };
      }),
    [items, products],
  );

  const subtotal = enriched.reduce((sum, item) => sum + item.subtotal, 0);

  async function handleSubmit(formData: FormData) {
    setState({ status: "loading" });

    const payload = {
      customerName: String(formData.get("customerName") ?? ""),
      customerEmail: String(formData.get("customerEmail") ?? ""),
      customerPhone: String(formData.get("customerPhone") ?? ""),
      wilaya: String(formData.get("wilaya") ?? ""),
      shippingMode,
      shippingAddress: shippingMode === "domicile" ? String(formData.get("shippingAddress") ?? "") : "",
      notes: String(formData.get("notes") ?? ""),
      items: enriched.map((item) => ({
        productId: item.productId,
        title: item.title,
        variant: item.variant,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
    };

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as { error?: string; orderNumber?: string };

    if (!response.ok || !data.orderNumber) {
      setState({ status: "error", message: data.error ?? "Impossible de valider la commande maintenant." });
      return;
    }

    clearCart();
    setState({ status: "success", orderNumber: data.orderNumber });
  }

  if (state.status === "success") {
    return (
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-sm uppercase tracking-[0.28em] text-[#c9a227]">Commande creee</p>
        <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.14em] text-white">{state.orderNumber}</h1>
        <p className="mt-4 text-stone-300">
          La commande est envoyee au tableau admin avec paiement en attente. Le flux reste simple et adapte au
          marche local.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex rounded-full bg-[#c9a227] px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-black"
        >
          Retour boutique
        </Link>
      </section>
    );
  }

  if (enriched.length === 0) {
    return (
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-sm uppercase tracking-[0.28em] text-stone-400">Panier</p>
        <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.14em] text-white">Aucun article pour le moment</h1>
        <p className="mt-4 text-stone-300">Choisis ton produit puis reviens ici pour finaliser la commande.</p>
        <Link
          href="/shop"
          className="mt-8 inline-flex rounded-full bg-[#c9a227] px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-black"
        >
          Voir la boutique
        </Link>
      </section>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-4">
        {enriched.map((item) => (
          <article
            key={`${item.productId}-${item.variant}`}
            className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 md:grid-cols-[160px_1fr]"
          >
            <img src={item.image} alt={item.title} className="aspect-[4/5] w-full rounded-[1.5rem] object-cover" />
            <div className="flex flex-col justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-stone-400">{item.product?.category ?? "Drop"}</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{item.title}</h2>
                <p className="mt-2 text-sm text-stone-400">Taille: {item.variant}</p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(event) =>
                    updateQuantity(item.productId, item.variant, Math.max(1, Number(event.target.value) || 1))
                  }
                  className="w-24 rounded-full border border-white/15 bg-transparent px-4 py-2 text-white outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeItem(item.productId, item.variant)}
                  className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.2em] text-stone-300"
                >
                  Retirer
                </button>
                <p className="ml-auto text-xl font-semibold text-white">{formatCurrency(item.subtotal)}</p>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <p className="text-sm uppercase tracking-[0.28em] text-stone-400">Commande / الطلب</p>
        <h2 className="mt-3 text-3xl font-black uppercase tracking-[0.14em] text-white">Infos livraison Algerie</h2>
        <p className="mt-3 text-sm text-stone-300">
          Email optionnel. Wilaya obligatoire. Si tu choisis domicile, l&apos;adresse devient obligatoire.
        </p>

        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5 text-sm uppercase tracking-[0.18em] text-stone-300">
          <span>Sous-total</span>
          <span className="text-xl font-semibold text-white">{formatCurrency(subtotal)}</span>
        </div>

        <form action={handleSubmit} className="mt-6 grid gap-4">
          <input
            name="customerName"
            required
            placeholder="Nom complet / الاسم الكامل"
            className="rounded-[1.25rem] border border-white/15 bg-transparent px-4 py-3 text-white outline-none"
          />
          <input
            name="customerPhone"
            required
            placeholder="Telephone / الهاتف"
            className="rounded-[1.25rem] border border-white/15 bg-transparent px-4 py-3 text-white outline-none"
          />
          <input
            name="customerEmail"
            type="email"
            placeholder="Email (optionnel)"
            className="rounded-[1.25rem] border border-white/15 bg-transparent px-4 py-3 text-white outline-none"
          />
          <input
            name="wilaya"
            required
            placeholder="Wilaya"
            className="rounded-[1.25rem] border border-white/15 bg-transparent px-4 py-3 text-white outline-none"
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setShippingMode("desk")}
              className={`rounded-[1.25rem] border px-4 py-4 text-sm font-semibold uppercase tracking-[0.18em] transition ${
                shippingMode === "desk"
                  ? "border-[#c9a227] bg-[#c9a227] text-black"
                  : "border-white/15 text-stone-200"
              }`}
            >
              Desk
            </button>
            <button
              type="button"
              onClick={() => setShippingMode("domicile")}
              className={`rounded-[1.25rem] border px-4 py-4 text-sm font-semibold uppercase tracking-[0.18em] transition ${
                shippingMode === "domicile"
                  ? "border-[#c9a227] bg-[#c9a227] text-black"
                  : "border-white/15 text-stone-200"
              }`}
            >
              Domicile
            </button>
          </div>

          {shippingMode === "domicile" ? (
            <textarea
              name="shippingAddress"
              required
              rows={3}
              placeholder="Adresse de domicile / العنوان"
              className="rounded-[1.25rem] border border-white/15 bg-transparent px-4 py-3 text-white outline-none"
            />
          ) : (
            <div className="rounded-[1.25rem] border border-dashed border-white/15 px-4 py-4 text-sm text-stone-400">
              Retrait desk selectionne. Aucune adresse supplementaire n&apos;est necessaire.
            </div>
          )}

          <textarea
            name="notes"
            rows={3}
            placeholder="Note (optionnel)"
            className="rounded-[1.25rem] border border-white/15 bg-transparent px-4 py-3 text-white outline-none"
          />

          {state.status === "error" ? <p className="text-sm text-rose-400">{state.message}</p> : null}

          <button
            type="submit"
            disabled={state.status === "loading"}
            className="rounded-full bg-[#c9a227] px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-black transition hover:bg-[#e2c769] disabled:opacity-70"
          >
            {state.status === "loading" ? "Envoi..." : "Valider la commande"}
          </button>
        </form>
      </section>
    </div>
  );
}
