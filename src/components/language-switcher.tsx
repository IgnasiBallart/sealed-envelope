"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, LOCALE_SHORT, type Locale } from "@/lib/locale";

export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname() ?? `/${locale}`;
  const rest = pathname.replace(/^\/(en|es|ca)(?=\/|$)/, "") || "/";

  return (
    <nav aria-label={label} className="flex items-center gap-2 text-sm">
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
                ? "font-semibold text-stone-900 dark:text-stone-100"
                : "text-stone-500 hover:underline dark:text-stone-400"
            }
          >
            {LOCALE_SHORT[item]}
          </Link>
        );
      })}
    </nav>
  );
}
