import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalDocView } from "@/components/legal-doc";
import { legalDoc } from "@/lib/legal-copy";
import { localeFromParam } from "@/lib/locale";

export const instant = false;

export async function generateMetadata({ params }: PageProps<"/[locale]/terms">): Promise<Metadata> {
  const locale = localeFromParam((await params).locale);
  return locale ? { title: legalDoc(locale, "terms").title } : {};
}

export default async function TermsPage({ params }: PageProps<"/[locale]/terms">) {
  const locale = localeFromParam((await params).locale);
  if (!locale) notFound();
  return <LegalDocView locale={locale} doc="terms" />;
}
