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
      <p role="status" className="td-card p-5 leading-relaxed">
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
        className="td-input"
      />
      {state.status === "invalid" && (
        <p role="alert" className="text-sm text-wax">
          {invalidLabel}
        </p>
      )}
      <button type="submit" disabled={pending} className="td-btn self-start">
        {pending ? sendingLabel : submitLabel}
      </button>
    </form>
  );
}
