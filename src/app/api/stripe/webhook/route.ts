import type Stripe from "stripe";
import { env } from "@/lib/env";
import { fulfillCheckoutSession } from "@/lib/fulfillment";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing Stripe-Signature header", { status: 400 });
  }

  // The signature is computed over the raw body, so it must be read as text, not parsed JSON.
  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(payload, signature, env.stripeWebhookSecret());
  } catch (error) {
    console.warn("Rejected Stripe webhook:", (error as Error).message);
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        await fulfillCheckoutSession(event.data.object);
        break;
    }
  } catch (error) {
    // A non-2xx makes Stripe retry the event later.
    console.error(`Failed to process Stripe event ${event.id}:`, error);
    return new Response("Processing failed", { status: 500 });
  }

  return Response.json({ received: true });
}
