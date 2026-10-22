"use client";

import { useActionState, useState } from "react";
import { localeChipClass } from "@/components/language-switcher";
import { LOCALE_SHORT, type Locale } from "@/lib/locale";
import { PDF_LOCALES, PDF_LOCALE_LABELS, type PdfLocale } from "@/lib/pdf-locale";
import { startCheckout, type CheckoutState } from "./actions";

export function BuyButton({
  slug,
  uiLocale,
  label,
  pdfLegend,
  pendingLabel,
}: {
  slug: string;
  uiLocale: Locale;
  label: string;
  pdfLegend: string;
  pendingLabel: string;
}) {
  const [state, formAction, pending] = useActionState<CheckoutState, FormData>(
    startCheckout.bind(null, slug, uiLocale),
    {},
  );
  const [pdfLocale, setPdfLocale] = useState<PdfLocale>(uiLocale);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <fieldset className="flex flex-col gap-2">
        <legend className="td-kicker">{pdfLegend}</legend>
        <div className="flex items-center gap-1 text-sm">
          {PDF_LOCALES.map((locale: PdfLocale) => {
            const current = locale === pdfLocale;
            return (
              <label key={locale} className={`cursor-pointer ${localeChipClass(current)}`}>
                <input
                  type="radio"
                  name="locale"
                  value={locale}
                  checked={current}
                  onChange={() => setPdfLocale(locale)}
                  required
                  className="sr-only"
                />
                <span lang={locale}>{LOCALE_SHORT[locale]}</span>
                <span className="sr-only">{PDF_LOCALE_LABELS[locale]}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <button type="submit" disabled={pending} className="td-btn">
        {pending ? pendingLabel : label}
      </button>
      {state.error && (
        <p role="alert" className="text-sm text-wax">
          {state.error}
        </p>
      )}
    </form>
  );
}
