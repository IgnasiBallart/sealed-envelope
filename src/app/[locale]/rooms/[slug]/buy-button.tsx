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
        <legend className="text-sm font-medium text-stone-700 dark:text-stone-300">{pdfLegend}</legend>
        {PDF_LOCALES.map((locale: PdfLocale) => (
          <label key={locale} className="flex cursor-pointer items-center gap-2 text-sm">
            <input type="radio" name="locale" value={locale} defaultChecked={locale === uiLocale} required />
            {PDF_LOCALE_LABELS[locale]}
          </label>
        ))}
      </fieldset>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-amber-700 px-6 py-3 font-semibold text-white transition hover:bg-amber-800 disabled:opacity-60"
      >
        {pending ? pendingLabel : label}
      </button>
      {state.error && (
        <p role="alert" className="text-sm text-red-700 dark:text-red-400">
          {state.error}
        </p>
      )}
    </form>
  );
}
