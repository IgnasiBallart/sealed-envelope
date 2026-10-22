import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BrandMark } from "@/components/brand-mark";
import { ThemeToggle } from "@/components/theme-toggle";
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
    <Suspense fallback={<p className="text-ink-soft">…</p>}>
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
      <DownloadChrome nav={copy.nav}>
        <div className="flex max-w-2xl flex-col gap-4">
          <h1 className="td-title text-4xl">{copy.download.badTitle}</h1>
          <p className="leading-relaxed text-ink-soft">{copy.download.badBody}</p>
          <p className="leading-relaxed text-ink-soft">
            {copy.download.wait}{" "}
            <Link href={withLocale(locale, "/resend")} className="underline decoration-rule underline-offset-4">
              {copy.download.resend}
            </Link>
            .
          </p>
        </div>
      </DownloadChrome>
    );
  }

  return (
    <DownloadChrome nav={copy.nav}>
      <div className="flex max-w-2xl flex-col gap-6">
        <p className="td-kicker">{copy.nav.tagline}</p>
        <h1 className="td-title text-4xl">{room.copy[locale].name}</h1>
        <p className="leading-relaxed text-ink-soft">{copy.download.ready}</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <a href={`/d/${token}/file/dossier`} className="td-btn self-start">
            {copy.download.ctaDossier}
          </a>
          <a href={`/d/${token}/file/solution`} className="td-btn-ghost self-start">
            {copy.download.ctaSolution}
          </a>
        </div>
        <p className="text-sm text-ink-soft">{copy.download.solutionHint}</p>
        <p className="text-sm text-ink-soft">{copy.download.keep}</p>
      </div>
    </DownloadChrome>
  );
}

function DownloadChrome({
  children,
  nav,
}: {
  children: React.ReactNode;
  nav: { theme: string; themeLight: string; themeDark: string };
}) {
  return (
    <>
      <header className="border-b border-rule/80">
        <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <BrandMark href="/" />
          <ThemeToggle label={nav.theme} lightLabel={nav.themeLight} darkLabel={nav.themeDark} />
        </nav>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-14">{children}</main>
      <footer className="border-t border-rule/80 py-7 text-center text-sm text-ink-soft">
        <span className="td-kicker">{BRAND}</span>
      </footer>
    </>
  );
}
