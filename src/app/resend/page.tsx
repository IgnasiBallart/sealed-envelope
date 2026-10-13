import type { Metadata } from "next";
import { ResendForm } from "./resend-form";

export const metadata: Metadata = {
  title: "Resend my downloads",
};

export default function ResendPage() {
  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Resend my downloads</h1>
        <p className="text-stone-700 dark:text-stone-300">
          Lost the email? Enter the address you used to pay and we&apos;ll send your download links to it again.
        </p>
      </header>
      <ResendForm />
    </div>
  );
}
