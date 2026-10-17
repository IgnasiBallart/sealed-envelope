"use server";

import { after } from "next/server";
import { isValidEmail, normalizeEmail } from "@/lib/email-address";
import { resendDownloads } from "@/lib/fulfillment";

export type ResendState = { status: "idle" | "invalid" | "done" };

export async function requestResend(_prev: ResendState, formData: FormData): Promise<ResendState> {
  const raw = formData.get("email");
  const email = typeof raw === "string" ? normalizeEmail(raw) : "";
  if (!isValidEmail(email)) {
    return { status: "invalid" };
  }

  after(async () => {
    try {
      await resendDownloads(email);
    } catch (error) {
      console.error("Resend downloads failed:", error);
    }
  });

  return { status: "done" };
}
