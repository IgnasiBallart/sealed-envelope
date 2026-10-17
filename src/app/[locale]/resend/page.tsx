import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { localeFromParam } from "@/lib/locale";
import { t } from "@/lib/messages";
import { ResendForm } from "./resend-form";

export async function generateMetadata({ params }: PageProps<"/[locale]/resend">): Promise<Metadata> {
  const locale = localeFromParam((await params).locale);
  return locale ? { title: t(locale).resend.title } : {};
}

export default async function ResendPage({ params }: PageProps<"/[locale]/resend">) {
  const locale = localeFromParam((await params).locale);
  if (!locale) notFound();
  const copy = t(locale);

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{copy.resend.title}</h1>
        <p className="text-stone-700 dark:text-stone-300">{copy.resend.lead}</p>
      </header>
      <ResendForm
        emailLabel={copy.resend.emailLabel}
        submitLabel={copy.resend.submit}
        sendingLabel={copy.resend.sending}
        doneLabel={copy.resend.done}
        invalidLabel={copy.resend.invalid}
      />
    </div>
  );
}
