import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalDocView } from "@/components/legal-doc";
import { legalDoc } from "@/lib/legal-copy";
import { localeFromParam } from "@/lib/locale";

export async function generateMetadata({ params }: PageProps<"/[locale]/legal">): Promise<Metadata> {
  const locale = localeFromParam((await params).locale);
  return locale ? { title: legalDoc(locale, "notice").title } : {};
}

export default async function LegalNoticePage({ params }: PageProps<"/[locale]/legal">) {
  const locale = localeFromParam((await params).locale);
  if (!locale) notFound();
  return <LegalDocView locale={locale} doc="notice" />;
}
