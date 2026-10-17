import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LanguageSwitcher } from "@/components/language-switcher";
import { BRAND } from "@/lib/brand";
import { LOCALES, localeFromParam, withLocale, type Locale } from "@/lib/locale";
import { t } from "@/lib/messages";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const locale = localeFromParam((await params).locale);
  if (!locale) return {};
  const copy = t(locale);
  return { title: copy.meta.titleDefault, description: copy.meta.description };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const locale = localeFromParam((await params).locale);
  if (!locale) notFound();
  const copy = t(locale);

  return (
    <>
      <HtmlLang locale={locale} />
      <header className="border-b border-stone-200 dark:border-stone-800">
        <nav className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-4">
          <Link href={withLocale(locale, "/")} className="text-lg font-semibold tracking-tight">
            {BRAND}
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSwitcher locale={locale} label={copy.nav.language} />
            <Link
              href={withLocale(locale, "/resend")}
              className="text-sm text-stone-600 hover:underline dark:text-stone-400"
            >
              {copy.nav.resend}
            </Link>
          </div>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">{children}</main>
      <footer className="border-t border-stone-200 py-6 text-sm text-stone-500 dark:border-stone-800">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 px-6 sm:flex-row sm:justify-between">
          <span>{BRAND}</span>
          <nav aria-label={copy.nav.legal} className="flex flex-wrap justify-center gap-4">
            <Link href={withLocale(locale, "/legal")} className="hover:underline">
              {copy.nav.legal}
            </Link>
            <Link href={withLocale(locale, "/privacy")} className="hover:underline">
              {copy.nav.privacy}
            </Link>
            <Link href={withLocale(locale, "/terms")} className="hover:underline">
              {copy.nav.terms}
            </Link>
          </nav>
        </div>
      </footer>
    </>
  );
}

function HtmlLang({ locale }: { locale: Locale }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `document.documentElement.lang=${JSON.stringify(locale)};`,
      }}
    />
  );
}
