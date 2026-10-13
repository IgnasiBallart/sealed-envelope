"use client";

import { useActionState } from "react";
import { startCheckout, type CheckoutState } from "./actions";

export function BuyButton({ slug, label }: { slug: string; label: string }) {
  const [state, formAction, pending] = useActionState<CheckoutState>(
    startCheckout.bind(null, slug),
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-amber-700 px-6 py-3 font-semibold text-white transition hover:bg-amber-800 disabled:opacity-60"
      >
        {pending ? "Opening secure checkout…" : label}
      </button>
      {state.error && (
        <p role="alert" className="text-sm text-red-700 dark:text-red-400">
          {state.error}
        </p>
      )}
    </form>
  );
}
