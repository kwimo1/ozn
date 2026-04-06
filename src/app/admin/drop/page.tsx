import { AdminShell } from "@/components/admin/admin-shell";
import { DropForm } from "@/components/admin/drop-form";
import { clearHeroDropAction, upsertHeroDropAction } from "@/app/admin/actions";
import { requireAdminUser } from "@/lib/auth";
import { getHeroDrop } from "@/lib/store";

export default async function AdminDropPage() {
  const user = await requireAdminUser();
  const heroDrop = getHeroDrop() ?? null;

  return (
    <AdminShell
      title="Hero Drop"
      description="Pilote la grande bannière d'accueil: texte, image, et message commercial. Un seul drop actif à la fois."
      userName={user.displayName}
    >
      <div className="flex flex-wrap justify-end gap-3">
        {heroDrop ? (
          <form action={clearHeroDropAction}>
            <button className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-stone-700 transition hover:border-stone-500">
              Retirer le drop actuel
            </button>
          </form>
        ) : null}
      </div>
      <DropForm action={upsertHeroDropAction} heroDrop={heroDrop} />
    </AdminShell>
  );
}
