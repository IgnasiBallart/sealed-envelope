import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { localeFromParam, withLocale } from "@/lib/locale";
import { t } from "@/lib/messages";

export const instant = false;

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
      <p className="td-kicker">{copy.nav.tagline}</p>
      <h1 className="td-title text-4xl">{copy.success.title}</h1>
      <p className="leading-relaxed text-ink-soft">{copy.success.body}</p>
      <p className="leading-relaxed text-ink-soft">
        {copy.success.spam}{" "}
        <Link href={withLocale(locale, "/resend")} className="underline decoration-rule underline-offset-4">
          {copy.success.resendLink}
        </Link>
        .
      </p>
    </div>
  );
}
