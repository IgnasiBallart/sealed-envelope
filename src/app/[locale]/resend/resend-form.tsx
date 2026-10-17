"use client";

import { useActionState } from "react";
import { requestResend, type ResendState } from "./actions";

export function ResendForm({
  emailLabel,
  submitLabel,
  sendingLabel,
  doneLabel,
  invalidLabel,
}: {
  emailLabel: string;
  submitLabel: string;
  sendingLabel: string;
  doneLabel: string;
  invalidLabel: string;
}) {
  const [state, formAction, pending] = useActionState<ResendState, FormData>(requestResend, {
    status: "idle",
  });

  if (state.status === "done") {
    return (
      <p role="status" className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
        {doneLabel}
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3 sm:max-w-md">
      <label htmlFor="email" className="font-medium">
        {emailLabel}
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        className="rounded-md border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-900"
      />
      {state.status === "invalid" && (
        <p role="alert" className="text-sm text-red-700 dark:text-red-400">
          {invalidLabel}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md bg-amber-700 px-6 py-3 font-semibold text-white transition hover:bg-amber-800 disabled:opacity-60"
      >
        {pending ? sendingLabel : submitLabel}
      </button>
    </form>
  );
}
