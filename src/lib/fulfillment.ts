import "server-only";
import type Stripe from "stripe";
import { getRoom, roomCopy } from "@/lib/catalog";
import { isPdfLocale } from "@/lib/pdf-locale";
import { downloadUrlFor, hashDownloadToken, downloadTokenFor, isWellFormedToken } from "@/lib/download-token";
import { normalizeEmail } from "@/lib/email-address";
import { getMailer } from "@/lib/mail";
import { purchaseEmail, resendEmail } from "@/lib/mail/templates";
import { orderStore, type Order } from "@/lib/orders";

/**
 * Called from the Stripe webhook only: this is the single place where an order becomes paid.
 * Safe to run more than once for the same session (Stripe retries until it gets a 2xx).
 */
export async function fulfillCheckoutSession(session: Stripe.Checkout.Session): Promise<void> {
  if (session.mode !== "payment" || session.payment_status !== "paid") {
    // Delayed payment methods arrive later as checkout.session.async_payment_succeeded.
    return;
  }

  const productSlug = session.metadata?.productSlug;
  const room = productSlug ? getRoom(productSlug) : undefined;
  if (!room) {
    console.error(`Checkout session ${session.id} has unknown productSlug "${productSlug}". Skipping.`);
    return;
  }
  const locale = isPdfLocale(session.metadata?.locale) ? session.metadata.locale : "en";

  const email = session.customer_details?.email ?? session.customer_email;
  if (!email) {
    throw new Error(`Checkout session ${session.id} is paid but has no customer email.`);
  }

  const order = await orderStore().savePaidOrder({
    stripeSessionId: session.id,
    email: normalizeEmail(email),
    productSlug: room.slug,
    locale,
    paid: true,
    tokenHash: hashDownloadToken(downloadTokenFor(session.id)),
    createdAt: new Date().toISOString(),
  });

  if (!order.emailSentAt) {
    await getMailer().send(
      purchaseEmail(order.email, locale, {
        roomName: roomCopy(room, locale).name,
        url: downloadUrlFor(order.stripeSessionId),
      }),
    );
    await orderStore().markEmailSent(order.stripeSessionId, new Date().toISOString());
  }
}

export async function findPaidOrderByToken(token: string): Promise<Order | null> {
  if (!isWellFormedToken(token)) return null;
  const order = await orderStore().findByTokenHash(hashDownloadToken(token));
  return order?.paid ? order : null;
}

export async function resendDownloads(email: string): Promise<void> {
  const orders = await orderStore().listPaidByEmail(email);
  const links = orders.flatMap((order) => {
    const room = getRoom(order.productSlug);
    if (!room) return [];
    const locale = isPdfLocale(order.locale) ? order.locale : "en";
    return [{ roomName: roomCopy(room, locale).name, url: downloadUrlFor(order.stripeSessionId), locale }];
  });
  if (links.length > 0) {
    const locale = links[0]?.locale ?? "en";
    await getMailer().send(
      resendEmail(
        email,
        locale,
        links.map(({ roomName, url }) => ({ roomName, url })),
      ),
    );
  }
}
