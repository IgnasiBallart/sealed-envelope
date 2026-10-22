"use client";

import { useActionState } from "react";
import { PDF_LOCALES, PDF_LOCALE_LABELS, type PdfLocale } from "@/lib/pdf-locale";
import type { Locale } from "@/lib/locale";
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

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <fieldset className="flex flex-col gap-2">
        <legend className="td-kicker">{pdfLegend}</legend>
        {PDF_LOCALES.map((locale: PdfLocale) => (
          <label key={locale} className="flex cursor-pointer items-center gap-2 text-sm">
            <input type="radio" name="locale" value={locale} defaultChecked={locale === uiLocale} required />
            {PDF_LOCALE_LABELS[locale]}
          </label>
        ))}
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
