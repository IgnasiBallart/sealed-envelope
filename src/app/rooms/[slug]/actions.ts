"use server";

import { redirect } from "next/navigation";
import { getRoom } from "@/lib/catalog";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";

export type CheckoutState = { error?: string };

export async function startCheckout(slug: string): Promise<CheckoutState> {
  const room = getRoom(slug);
  if (!room) {
    return { error: "This room doesn't exist." };
  }

  let checkoutUrl: string | null;
  try {
    const appUrl = env.appUrl();
    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: room.currency,
            unit_amount: room.priceCents,
            product_data: { name: room.name, description: room.tagline },
          },
        },
      ],
      metadata: { productSlug: room.slug },
      success_url: `${appUrl}/checkout/success`,
      cancel_url: `${appUrl}/rooms/${room.slug}`,
    });
    checkoutUrl = session.url;
  } catch (error) {
    console.error("Could not create Stripe Checkout session:", error);
    return { error: "We couldn't start the payment. Please try again in a moment." };
  }

  if (!checkoutUrl) {
    return { error: "We couldn't start the payment. Please try again in a moment." };
  }
  // Outside the try: redirect() works by throwing.
  redirect(checkoutUrl);
}
