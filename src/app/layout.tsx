import type { Metadata } from "next";
import { headers } from "next/headers";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { BRAND } from "@/lib/brand";
import { DEFAULT_LOCALE, localeFromParam } from "@/lib/locale";
import { THEME_BOOT_SCRIPT } from "@/lib/theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${BRAND} — printable escape rooms`,
    template: `%s · ${BRAND}`,
  },
  description: "Escape rooms you print and solve at home. Buy, download the PDF, open the first envelope.",
};

/** `html lang` comes from the request header. Without this, `/_not-found` fails `next build`. */
export const instant = false;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = localeFromParam((await headers()).get("x-locale") ?? "") ?? DEFAULT_LOCALE;
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        <Script id="td-theme" strategy="beforeInteractive">
          {THEME_BOOT_SCRIPT}
        </Script>
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
