import type { HeroDrop } from "@/lib/store";

export function DropForm({
  action,
  heroDrop,
}: {
  action: (formData: FormData) => void | Promise<void>;
  heroDrop?: HeroDrop | null;
}) {
  return (
    <form action={action} className="grid gap-6 rounded-[2rem] bg-white p-6 shadow-[0_24px_80px_rgba(17,17,15,0.08)]">
      {heroDrop ? <input type="hidden" name="existingImage" value={heroDrop.imageUrl} /> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Badge</span>
          <input
            name="badge"
            defaultValue={heroDrop?.badge ?? "Nouveau Drop / جديد"}
            required
            className="rounded-[1.25rem] border border-stone-200 px-4 py-3 outline-none focus:border-[#c9a227]"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">CTA</span>
          <input
            name="ctaLabel"
            defaultValue={heroDrop?.ctaLabel ?? "Voir le drop"}
            required
            className="rounded-[1.25rem] border border-stone-200 px-4 py-3 outline-none focus:border-[#c9a227]"
          />
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Titre</span>
        <textarea
          name="title"
          defaultValue={heroDrop?.title ?? "OZN Store capsule noire et dorée pour la street algérienne."}
          rows={3}
          required
          className="rounded-[1.25rem] border border-stone-200 px-4 py-3 outline-none focus:border-[#c9a227]"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Description</span>
        <textarea
          name="description"
          defaultValue={
            heroDrop?.description ??
            "Pièces fortes, palette noir-or, coupe moderne. Une seule vitrine de drop pensée pour convertir vite sur mobile."
          }
          rows={4}
          required
          className="rounded-[1.25rem] border border-stone-200 px-4 py-3 outline-none focus:border-[#c9a227]"
        />
      </label>

      {heroDrop?.imageUrl ? (
        <div className="overflow-hidden rounded-[1.75rem] border border-stone-200 bg-stone-50">
          <img src={heroDrop.imageUrl} alt={heroDrop.title} className="aspect-[16/10] w-full object-cover" />
        </div>
      ) : null}

      <input
        type="file"
        name="image"
        accept="image/*"
        className="rounded-[1.25rem] border border-dashed border-stone-300 bg-stone-50 px-4 py-6"
      />

      <button
        type="submit"
        className="rounded-full bg-[#c9a227] px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-black transition hover:bg-[#e2c769]"
      >
        Enregistrer le drop
      </button>
    </form>
  );
}
