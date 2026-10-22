import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BrandMark } from "@/components/brand-mark";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { LOCALES, localeFromParam, withLocale } from "@/lib/locale";
import { t } from "@/lib/messages";

export const instant = false;

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
      <header className="border-b border-rule/80">
        <nav className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <BrandMark href={withLocale(locale, "/")} />
          <div className="flex items-center gap-4 sm:gap-5">
            <LanguageSwitcher locale={locale} label={copy.nav.language} />
            <ThemeToggle label={copy.nav.theme} lightLabel={copy.nav.themeLight} darkLabel={copy.nav.themeDark} />
            <Link href={withLocale(locale, "/resend")} className="text-sm text-ink-soft hover:text-foreground">
              {copy.nav.resend}
            </Link>
          </div>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-14">{children}</main>
      <footer className="border-t border-rule/80 py-7 text-sm text-ink-soft">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 px-6 sm:flex-row sm:justify-between">
          <span className="td-kicker">{copy.nav.tagline}</span>
          <nav aria-label={copy.nav.legal} className="flex flex-wrap justify-center gap-4">
            <Link href={withLocale(locale, "/legal")} className="hover:text-foreground">
              {copy.nav.legal}
            </Link>
            <Link href={withLocale(locale, "/privacy")} className="hover:text-foreground">
              {copy.nav.privacy}
            </Link>
            <Link href={withLocale(locale, "/terms")} className="hover:text-foreground">
              {copy.nav.terms}
            </Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
