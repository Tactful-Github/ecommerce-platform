import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const itemsJson = session.metadata?.items;

    if (!userId || !itemsJson) {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    const items = JSON.parse(itemsJson) as { id: string; qty: number; price: number }[];
    const shipping = (session as unknown as { shipping_details?: { name?: string; address?: { line1?: string; city?: string; state?: string; postal_code?: string } } }).shipping_details;

    await prisma.order.create({
      data: {
        userId,
        status: "PROCESSING",
        total: session.amount_total! / 100,
        stripeSessionId: session.id,
        shippingName: shipping?.name ?? "",
        shippingAddress: shipping?.address?.line1 ?? "",
        shippingCity: shipping?.address?.city ?? "",
        shippingState: shipping?.address?.state ?? "",
        shippingZip: shipping?.address?.postal_code ?? "",
        items: {
          create: items.map((item) => ({
            productId: item.id,
            quantity: item.qty,
            priceAtPurchase: item.price,
          })),
        },
      },
    });

    for (const item of items) {
      await prisma.product.update({
        where: { id: item.id },
        data: { stock: { decrement: item.qty } },
      });
    }
  }

  return NextResponse.json({ received: true });
}
