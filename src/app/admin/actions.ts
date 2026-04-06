"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authenticateAdmin, createSession, destroySession } from "@/lib/auth";
import {
  clearHeroDrop,
  deleteProduct,
  getAllProducts,
  getProductById,
  saveHeroDrop,
  saveProduct,
  updateOrderStatus,
  updateProductStatus,
} from "@/lib/store";
import { slugify } from "@/lib/utils";

export type LoginState = {
  error?: string;
};

function ensureUniqueSlug(rawSlug: string, productId?: string) {
  const base = slugify(rawSlug);
  const existing = getAllProducts().filter((product) => product.id !== productId);

  if (!existing.some((product) => product.slug === base)) {
    return base;
  }

  let counter = 2;
  let candidate = `${base}-${counter}`;

  while (existing.some((product) => product.slug === candidate)) {
    counter += 1;
    candidate = `${base}-${counter}`;
  }

  return candidate;
}

async function storeUpload(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const mimeType = file.type || "application/octet-stream";
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}

export async function loginAction(_: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const user = await authenticateAdmin(email, password);

  if (!user) {
    return { error: "Invalid admin email or password." };
  }

  await createSession(user);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

export async function upsertProductAction(formData: FormData) {
  const productId = String(formData.get("productId") ?? "").trim() || undefined;
  const title = String(formData.get("title") ?? "").trim();
  const requestedSlug = String(formData.get("slug") ?? "").trim() || title;
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const tags = String(formData.get("tags") ?? "").trim();
  const status = String(formData.get("status") ?? "draft") as "draft" | "published" | "archived";
  const price = Math.round(Number(formData.get("price") ?? 0) * 100);
  const comparePriceRaw = Number(formData.get("comparePrice") ?? 0);
  const comparePrice = comparePriceRaw > 0 ? Math.round(comparePriceRaw * 100) : null;
  const inventory = Number(formData.get("inventory") ?? 0);
  const featured = formData.get("featured") === "on";
  const existingImages = formData
    .getAll("existingImages")
    .map((entry) => String(entry))
    .filter(Boolean);

  const uploads = await Promise.all(
    formData
      .getAll("images")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0)
      .map((file) => storeUpload(file)),
  );

  const variantLabels = formData.getAll("variantLabel").map((entry) => String(entry).trim());
  const variantSkus = formData.getAll("variantSku").map((entry) => String(entry).trim());
  const variantStocks = formData.getAll("variantStock").map((entry) => Number(entry) || 0);
  const variants = variantLabels
    .map((label, index) => ({
      label,
      sku: variantSkus[index],
      stock: variantStocks[index],
    }))
    .filter((variant) => variant.label && variant.sku);

  if (!title || !description || !category || price < 0 || inventory < 0 || variants.length === 0) {
    throw new Error("Invalid product payload.");
  }

  const imageUrls = [...existingImages, ...uploads].map((url) => ({
    url,
    alt: title,
  }));

  if (imageUrls.length === 0) {
    throw new Error("At least one product image is required.");
  }

  const slug = ensureUniqueSlug(requestedSlug, productId);

  saveProduct({
    id: productId,
    title,
    slug,
    description,
    category,
    tags,
    price,
    comparePrice,
    inventory,
    featured,
    status,
    variants,
    imageUrls,
  });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath(`/products/${slug}`);
  redirect("/admin/products");
}

export async function upsertHeroDropAction(formData: FormData) {
  const badge = String(formData.get("badge") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const ctaLabel = String(formData.get("ctaLabel") ?? "").trim() || "Voir le drop";
  const existingImage = String(formData.get("existingImage") ?? "").trim();
  const upload = formData.get("image");
  const uploadedImage =
    upload instanceof File && upload.size > 0 ? await storeUpload(upload) : "";
  const imageUrl = uploadedImage || existingImage;

  if (!badge || !title || !description || !imageUrl) {
    throw new Error("Invalid hero drop payload.");
  }

  saveHeroDrop({
    badge,
    title,
    description,
    ctaLabel,
    imageUrl,
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/drop");
  redirect("/admin/drop");
}

export async function clearHeroDropAction() {
  clearHeroDrop();
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/drop");
  redirect("/admin/drop");
}

export async function setProductStatusAction(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  const status = String(formData.get("status") ?? "draft") as "draft" | "published" | "archived";
  updateProductStatus(productId, status);
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
}

export async function deleteProductAction(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  const product = getProductById(productId);

  if (product) {
    deleteProduct(productId);
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/admin/products");
  }
}

export async function updateOrderStatusAction(formData: FormData) {
  const orderId = String(formData.get("orderId") ?? "");
  const status = String(formData.get("status") ?? "new") as
    | "new"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";

  updateOrderStatus(orderId, status);
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
}
