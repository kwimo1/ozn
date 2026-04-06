import { AdminShell } from "@/components/admin/admin-shell";
import { ProductForm } from "@/components/admin/product-form";
import { upsertProductAction } from "@/app/admin/actions";
import { requireAdminUser } from "@/lib/auth";

export default async function NewProductPage() {
  const user = await requireAdminUser();

  return (
    <AdminShell
      title="Create product"
      description="List a fresh piece with imagery, variants, pricing, and publication state in one form."
      userName={user.displayName}
    >
      <ProductForm action={upsertProductAction} />
    </AdminShell>
  );
}
