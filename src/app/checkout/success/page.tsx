import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thanks for your purchase",
  robots: { index: false },
};

// Reaching this page proves nothing: the order is only marked paid by the Stripe webhook.
export default function CheckoutSuccessPage() {
  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Thanks! Check your inbox.</h1>
      <p className="text-stone-700 dark:text-stone-300">
        As soon as the payment is confirmed we&apos;ll email you the download link. It usually takes less than a
        minute.
      </p>
      <p className="text-stone-700 dark:text-stone-300">
        Nothing after a few minutes? Check your spam folder or{" "}
        <Link href="/resend" className="underline">
          ask us to resend your downloads
        </Link>
        .
      </p>
    </div>
  );
}
