import "server-only";
import Stripe from "stripe";
import { env } from "@/lib/env";

let client: Stripe | undefined;

export function stripe(): Stripe {
  if (!client) {
    const key = env.stripeSecretKey();
    // Live payments need the legal notice and VAT handling first.
    if (!key.startsWith("sk_test_") && !key.startsWith("rk_test_")) {
      throw new Error("Only Stripe test-mode keys (sk_test_… / rk_test_…) are allowed for now.");
    }
    client = new Stripe(key);
  }
  return client;
}
