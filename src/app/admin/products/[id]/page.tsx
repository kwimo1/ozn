import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductForm } from "@/components/admin/product-form";
import { upsertProductAction } from "@/app/admin/actions";
import { requireAdminUser } from "@/lib/auth";
import { getProductById } from "@/lib/store";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdminUser();
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <AdminShell
      title="Edit product"
      description="Adjust catalog details, preserve existing images, and republish the piece when the update is ready."
      userName={user.displayName}
    >
      <ProductForm action={upsertProductAction} product={product} />
    </AdminShell>
  );
}
