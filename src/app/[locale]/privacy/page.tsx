import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalDocView } from "@/components/legal-doc";
import { legalDoc } from "@/lib/legal-copy";
import { localeFromParam } from "@/lib/locale";

export async function generateMetadata({ params }: PageProps<"/[locale]/privacy">): Promise<Metadata> {
  const locale = localeFromParam((await params).locale);
  return locale ? { title: legalDoc(locale, "privacy").title } : {};
}

export default async function PrivacyPage({ params }: PageProps<"/[locale]/privacy">) {
  const locale = localeFromParam((await params).locale);
  if (!locale) notFound();
  return <LegalDocView locale={locale} doc="privacy" />;
}
