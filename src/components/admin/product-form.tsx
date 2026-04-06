import type { Product } from "@/lib/store";

type ProductFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  product?: Product | null;
};

function rowValues(product?: Product | null) {
  if (!product) {
    return [
      { label: "", sku: "", stock: 0 },
      { label: "", sku: "", stock: 0 },
      { label: "", sku: "", stock: 0 },
    ];
  }

  const rows = product.variants.map((variant) => ({
    label: variant.label,
    sku: variant.sku,
    stock: variant.stock,
  }));

  while (rows.length < 3) {
    rows.push({ label: "", sku: "", stock: 0 });
  }

  return rows;
}

export function ProductForm({ action, product }: ProductFormProps) {
  const rows = rowValues(product);

  return (
    <form action={action} className="grid gap-6 rounded-[2rem] bg-white p-6 shadow-[0_24px_80px_rgba(17,17,15,0.08)]">
      {product ? <input type="hidden" name="productId" value={product.id} /> : null}
      {product?.images.map((image) => (
        <input key={image.id} type="hidden" name="existingImages" value={image.url} />
      ))}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Title</span>
          <input
            name="title"
            defaultValue={product?.title}
            required
            className="rounded-[1.25rem] border border-stone-200 px-4 py-3 outline-none focus:border-[#f97316]"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Slug</span>
          <input
            name="slug"
            defaultValue={product?.slug}
            placeholder="leave blank to auto-generate"
            className="rounded-[1.25rem] border border-stone-200 px-4 py-3 outline-none focus:border-[#f97316]"
          />
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Description</span>
        <textarea
          name="description"
          defaultValue={product?.description}
          required
          rows={5}
          className="rounded-[1.25rem] border border-stone-200 px-4 py-3 outline-none focus:border-[#f97316]"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-4">
        <label className="grid gap-2">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Category</span>
          <input
            name="category"
            defaultValue={product?.category}
            required
            className="rounded-[1.25rem] border border-stone-200 px-4 py-3 outline-none focus:border-[#f97316]"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Tags</span>
          <input
            name="tags"
            defaultValue={product?.tags}
            placeholder="drop-01,featured"
            className="rounded-[1.25rem] border border-stone-200 px-4 py-3 outline-none focus:border-[#f97316]"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Price (NGN)</span>
          <input
            name="price"
            defaultValue={product ? product.price / 100 : ""}
            required
            type="number"
            min={0}
            className="rounded-[1.25rem] border border-stone-200 px-4 py-3 outline-none focus:border-[#f97316]"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
            Compare Price (NGN)
          </span>
          <input
            name="comparePrice"
            defaultValue={product?.comparePrice ? product.comparePrice / 100 : ""}
            type="number"
            min={0}
            className="rounded-[1.25rem] border border-stone-200 px-4 py-3 outline-none focus:border-[#f97316]"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="grid gap-2">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Inventory</span>
          <input
            name="inventory"
            defaultValue={product?.inventory ?? 0}
            required
            type="number"
            min={0}
            className="rounded-[1.25rem] border border-stone-200 px-4 py-3 outline-none focus:border-[#f97316]"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Status</span>
          <select
            name="status"
            defaultValue={product?.status ?? "draft"}
            className="rounded-[1.25rem] border border-stone-200 px-4 py-3 outline-none focus:border-[#f97316]"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        <label className="flex items-center gap-3 rounded-[1.25rem] border border-stone-200 px-4 py-3">
          <input type="checkbox" name="featured" defaultChecked={product?.featured} className="size-4" />
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Featured drop</span>
        </label>
      </div>

      <div className="grid gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Variants</p>
          <p className="mt-1 text-sm text-stone-500">Leave unused rows blank. Labels can be sizes like S, M, 32.</p>
        </div>
        <div className="grid gap-3">
          {rows.map((row, index) => (
            <div key={`${row.sku}-${index}`} className="grid gap-3 md:grid-cols-[1fr_1fr_160px]">
              <input
                name="variantLabel"
                defaultValue={row.label}
                placeholder="Variant label"
                className="rounded-[1.25rem] border border-stone-200 px-4 py-3 outline-none focus:border-[#f97316]"
              />
              <input
                name="variantSku"
                defaultValue={row.sku}
                placeholder="SKU"
                className="rounded-[1.25rem] border border-stone-200 px-4 py-3 outline-none focus:border-[#f97316]"
              />
              <input
                name="variantStock"
                defaultValue={row.stock}
                placeholder="Stock"
                type="number"
                min={0}
                className="rounded-[1.25rem] border border-stone-200 px-4 py-3 outline-none focus:border-[#f97316]"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Product images</p>
          <p className="mt-1 text-sm text-stone-500">Upload one or more images. Existing images are kept when editing.</p>
        </div>
        {product?.images.length ? (
          <div className="grid gap-3 md:grid-cols-3">
            {product.images.map((image) => (
              <div key={image.id} className="overflow-hidden rounded-[1.5rem] border border-stone-200 bg-stone-50">
                <img src={image.url} alt={image.alt} className="aspect-[4/5] w-full object-cover" />
              </div>
            ))}
          </div>
        ) : null}
        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          className="rounded-[1.25rem] border border-dashed border-stone-300 bg-stone-50 px-4 py-6"
        />
      </div>

      <button
        type="submit"
        className="rounded-full bg-[#11110f] px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#f97316] hover:text-black"
      >
        {product ? "Update product" : "Create product"}
      </button>
    </form>
  );
}
