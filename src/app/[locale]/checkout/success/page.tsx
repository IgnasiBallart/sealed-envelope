import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { localeFromParam, withLocale } from "@/lib/locale";
import { t } from "@/lib/messages";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/checkout/success">): Promise<Metadata> {
  const locale = localeFromParam((await params).locale);
  return locale ? { title: t(locale).success.title, robots: { index: false } } : { robots: { index: false } };
}

export default async function CheckoutSuccessPage({ params }: PageProps<"/[locale]/checkout/success">) {
  const locale = localeFromParam((await params).locale);
  if (!locale) notFound();
  const copy = t(locale);

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">{copy.success.title}</h1>
      <p className="text-stone-700 dark:text-stone-300">{copy.success.body}</p>
      <p className="text-stone-700 dark:text-stone-300">
        {copy.success.spam}{" "}
        <Link href={withLocale(locale, "/resend")} className="underline">
          {copy.success.resendLink}
        </Link>
        .
      </p>
    </div>
  );
}
