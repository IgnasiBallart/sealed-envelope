// Sends a signed, fake checkout.session.completed event to the local webhook.
// Usage: npm run simulate-webhook -- buyer@example.com [room-slug]
// Exercises signature check, order creation and the purchase email without a Stripe account.
// For the real flow use the Stripe CLI (see README).
import { randomBytes } from "node:crypto";
import Stripe from "stripe";

const [email = "buyer@example.com", productSlug = "the-last-train"] = process.argv.slice(2);
const appUrl = process.env.APP_URL ?? "http://localhost:3000";
const secret = process.env.STRIPE_WEBHOOK_SECRET;
if (!secret) {
  console.error("STRIPE_WEBHOOK_SECRET is not set. Run with: node --env-file=.env.local ...");
  process.exit(1);
}

const sessionId = `cs_test_sim_${randomBytes(12).toString("hex")}`;
const event = {
  id: `evt_sim_${randomBytes(12).toString("hex")}`,
  object: "event",
  type: "checkout.session.completed",
  created: Math.floor(Date.now() / 1000),
  data: {
    object: {
      id: sessionId,
      object: "checkout.session",
      mode: "payment",
      payment_status: "paid",
      status: "complete",
      customer_details: { email },
      customer_email: null,
      metadata: { productSlug },
    },
  },
};

const payload = JSON.stringify(event);
const header = new Stripe("sk_test_simulator").webhooks.generateTestHeaderString({ payload, secret });

const response = await fetch(`${appUrl}/api/stripe/webhook`, {
  method: "POST",
  headers: { "Content-Type": "application/json", "Stripe-Signature": header },
  body: payload,
});
console.log(`${response.status} ${await response.text()}  (session ${sessionId})`);
