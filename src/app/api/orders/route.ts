import { NextResponse } from "next/server";
import { z } from "zod";
import { createOrder, getProductById } from "@/lib/store";

const orderSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(5),
  shippingAddress: z.string().min(5),
  city: z.string().min(2),
  country: z.string().min(2),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        title: z.string().min(1),
        variant: z.string().min(1),
        quantity: z.number().int().positive(),
        unitPrice: z.number().int().nonnegative(),
      }),
    )
    .min(1),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const payload = orderSchema.parse(json);

    for (const item of payload.items) {
      const product = getProductById(item.productId);

      if (!product || product.status !== "published") {
        return NextResponse.json({ error: "One of the selected products is no longer available." }, { status: 400 });
      }

      if (product.inventory < item.quantity) {
        return NextResponse.json({ error: `${product.title} does not have enough stock.` }, { status: 400 });
      }
    }

    const order = createOrder(payload);
    return NextResponse.json({ orderNumber: order.orderNumber });
  } catch {
    return NextResponse.json({ error: "Unable to create order." }, { status: 400 });
  }
}
