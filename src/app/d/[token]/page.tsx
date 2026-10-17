import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BRAND } from "@/lib/brand";
import { getRoom } from "@/lib/catalog";
import { findPaidOrderByToken } from "@/lib/fulfillment";
import { withLocale } from "@/lib/locale";
import { t } from "@/lib/messages";
import { isPdfLocale } from "@/lib/pdf-locale";

export const metadata: Metadata = {
  title: "Your download",
  robots: { index: false, follow: false },
};

export default function DownloadPage({ params }: PageProps<"/d/[token]">) {
  return (
    <Suspense fallback={<p className="text-stone-500">…</p>}>
      <Download params={params} />
    </Suspense>
  );
}

async function Download({ params }: Pick<PageProps<"/d/[token]">, "params">) {
  const { token } = await params;
  const order = await findPaidOrderByToken(token);
  const room = order ? getRoom(order.productSlug) : undefined;
  const locale = order && isPdfLocale(order.locale) ? order.locale : "en";
  const copy = t(locale);

  if (!order || !room) {
    return (
      <DownloadChrome>
        <div className="flex max-w-2xl flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight">{copy.download.badTitle}</h1>
          <p className="text-stone-700 dark:text-stone-300">{copy.download.badBody}</p>
          <p className="text-stone-700 dark:text-stone-300">
            {copy.download.wait}{" "}
            <Link href={withLocale(locale, "/resend")} className="underline">
              {copy.download.resend}
            </Link>
            .
          </p>
        </div>
      </DownloadChrome>
    );
  }

  return (
    <DownloadChrome>
      <div className="flex max-w-2xl flex-col gap-6">
        <h1 className="text-3xl font-bold tracking-tight">{room.copy[locale].name}</h1>
        <p className="text-stone-700 dark:text-stone-300">{copy.download.ready}</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={`/d/${token}/file/dossier`}
            className="self-start rounded-md bg-amber-700 px-6 py-3 font-semibold text-white transition hover:bg-amber-800"
          >
            {copy.download.ctaDossier}
          </a>
          <a
            href={`/d/${token}/file/solution`}
            className="self-start rounded-md border border-stone-300 px-6 py-3 font-semibold transition hover:border-amber-700 dark:border-stone-600"
          >
            {copy.download.ctaSolution}
          </a>
        </div>
        <p className="text-sm text-stone-500">{copy.download.solutionHint}</p>
        <p className="text-sm text-stone-500">{copy.download.keep}</p>
      </div>
    </DownloadChrome>
  );
}

function DownloadChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-stone-200 dark:border-stone-800">
        <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            {BRAND}
          </Link>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">{children}</main>
      <footer className="border-t border-stone-200 py-6 text-center text-sm text-stone-500 dark:border-stone-800">
        {BRAND}
      </footer>
    </>
  );
}
