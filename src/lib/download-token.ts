import "server-only";
import { createHash, createHmac } from "node:crypto";
import { env } from "@/lib/env";

/**
 * The token is derived from the order id with a server-side secret instead of being random.
 * The order store only keeps its SHA-256 hash, and the "resend my downloads" flow can still
 * rebuild the exact same link. Rotating DOWNLOAD_TOKEN_SECRET invalidates every link sent so far.
 */
export function downloadTokenFor(orderId: string): string {
  return createHmac("sha256", env.downloadTokenSecret())
    .update(`download:v1:${orderId}`)
    .digest("base64url");
}

export function hashDownloadToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

const TOKEN_FORMAT = /^[A-Za-z0-9_-]{43}$/;

export function isWellFormedToken(token: string): boolean {
  return TOKEN_FORMAT.test(token);
}

export function downloadUrlFor(orderId: string): string {
  return `${env.appUrl()}/d/${downloadTokenFor(orderId)}`;
}
