export const LOCALES = ["en", "es", "ca"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  es: "Español",
  ca: "Català",
};

export const LOCALE_SHORT: Record<Locale, string> = {
  en: "EN",
  es: "ES",
  ca: "CA",
};

export const NUMBER_LOCALES: Record<Locale, string> = {
  en: "en-IE",
  es: "es-ES",
  ca: "ca-ES",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function localeFromParam(value: string): Locale | undefined {
  return isLocale(value) ? value : undefined;
}

/** Prefers Catalan, then Spanish, then English from Accept-Language. */
export function negotiateLocale(acceptLanguage: string | null): Locale {
  const raw = (acceptLanguage ?? "").toLowerCase();
  const parts = raw.split(",").map((part) => part.split(";")[0]?.trim() ?? "");
  for (const tag of parts) {
    if (tag === "ca" || tag.startsWith("ca-")) return "ca";
    if (tag === "es" || tag.startsWith("es-")) return "es";
    if (tag === "en" || tag.startsWith("en-")) return "en";
  }
  return DEFAULT_LOCALE;
}

export function withLocale(locale: Locale, path: string): string {
  const suffix = path.startsWith("/") ? path : `/${path}`;
  if (suffix === "/") return `/${locale}`;
  return `/${locale}${suffix}`;
}
