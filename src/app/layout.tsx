import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Sealed Envelope — printable escape rooms",
    template: "%s · Sealed Envelope",
  },
  description: "Escape rooms you print and solve at home. Buy, download the PDF, open the first envelope.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-stone-200 dark:border-stone-800">
          <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              Sealed Envelope
            </Link>
            <Link href="/resend" className="text-sm text-stone-600 hover:underline dark:text-stone-400">
              Resend my downloads
            </Link>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">{children}</main>
        <footer className="border-t border-stone-200 py-6 text-center text-sm text-stone-500 dark:border-stone-800">
          Sealed Envelope
        </footer>
      </body>
    </html>
  );
}
