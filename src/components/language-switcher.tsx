"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, LOCALE_SHORT, type Locale } from "@/lib/locale";

export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname() ?? `/${locale}`;
  const rest = pathname.replace(/^\/(en|es|ca)(?=\/|$)/, "") || "/";

  return (
    <nav aria-label={label} className="flex items-center gap-1 text-sm">
      {LOCALES.map((item) => {
        const href = rest === "/" ? `/${item}` : `/${item}${rest}`;
        const current = item === locale;
        return (
          <Link
            key={item}
            href={href}
            hrefLang={item}
            lang={item}
            aria-current={current ? "true" : undefined}
            className={
              current
                ? "rounded-sm border border-rule bg-paper px-2 py-0.5 font-semibold"
                : "px-2 py-0.5 text-ink-soft hover:text-foreground"
            }
          >
            {LOCALE_SHORT[item]}
          </Link>
        );
      })}
    </nav>
  );
}
