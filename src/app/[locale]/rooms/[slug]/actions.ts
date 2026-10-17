"use server";

import { redirect } from "next/navigation";
import { getRoom, roomCopy } from "@/lib/catalog";
import { withLocale, type Locale } from "@/lib/locale";
import { t } from "@/lib/messages";
import { isPdfLocale } from "@/lib/pdf-locale";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";

export type CheckoutState = { error?: string };

export async function startCheckout(
  slug: string,
  uiLocale: Locale,
  _prev: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const copy = t(uiLocale);
  const room = getRoom(slug);
  if (!room) {
    return { error: copy.room.errorExist };
  }

  const pdfLocale = String(formData.get("locale") ?? "");
  if (!isPdfLocale(pdfLocale)) {
    return { error: copy.room.errorMissingLocale };
  }

  const product = roomCopy(room, pdfLocale);

  let checkoutUrl: string | null;
  try {
    const appUrl = env.appUrl();
    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      locale: uiLocale,
      managed_payments: { enabled: true },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: room.currency,
            unit_amount: room.priceCents,
            tax_behavior: "inclusive",
            product_data: { name: product.name, description: product.tagline, tax_code: room.taxCode },
          },
        },
      ],
      metadata: { productSlug: room.slug, locale: pdfLocale },
      success_url: `${appUrl}${withLocale(uiLocale, "/checkout/success")}`,
      cancel_url: `${appUrl}${withLocale(uiLocale, `/rooms/${room.slug}`)}`,
    });
    checkoutUrl = session.url;
  } catch (error) {
    console.error("Could not create Stripe Checkout session:", error);
    return { error: copy.room.errorPay };
  }

  if (!checkoutUrl) {
    return { error: copy.room.errorPay };
  }
  redirect(checkoutUrl);
}
