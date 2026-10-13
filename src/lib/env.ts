import "server-only";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable ${name}. See .env.example.`);
  }
  return value;
}

function oneOf<T extends string>(name: string, allowed: readonly T[], fallback: T): T {
  const value = (process.env[name] ?? fallback) as T;
  if (!allowed.includes(value)) {
    throw new Error(`${name} must be one of ${allowed.join(", ")}; got "${value}".`);
  }
  return value;
}

export const env = {
  appUrl: () => required("APP_URL").replace(/\/+$/, ""),
  stripeSecretKey: () => required("STRIPE_SECRET_KEY"),
  stripeWebhookSecret: () => required("STRIPE_WEBHOOK_SECRET"),
  downloadTokenSecret: () => {
    const secret = required("DOWNLOAD_TOKEN_SECRET");
    if (secret.length < 32) {
      throw new Error("DOWNLOAD_TOKEN_SECRET must be at least 32 characters.");
    }
    return secret;
  },
  orderStore: () => oneOf("ORDER_STORE", ["local"] as const, "local"),
  fileStore: () => oneOf("FILE_STORE", ["local"] as const, "local"),
  mailer: () => oneOf("MAILER", ["console"] as const, "console"),
  localDataDir: () => process.env.LOCAL_DATA_DIR ?? ".data",
  localPdfDir: () => process.env.LOCAL_PDF_DIR ?? "storage/pdfs",
  mailFrom: () => process.env.MAIL_FROM ?? "Sealed Envelope <no-reply@localhost>",
};
