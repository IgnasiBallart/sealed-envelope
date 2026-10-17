import { BRAND } from "@/lib/brand";

/**
 * Shop operator for LSSI / RGPD pages. Fill nif and address before Stripe live.
 * Sending address is hola@tabledetective.com (SES); receiving is Cloudflare Email Routing.
 */
export const LEGAL = {
  brand: BRAND,
  domain: "tabledetective.com",
  siteUrl: "https://tabledetective.com",
  email: "hola@tabledetective.com",
  operatorName: "Ignasi Ballart",
  nif: "",
  addressLines: [] as string[],
  country: "España",
} as const;
