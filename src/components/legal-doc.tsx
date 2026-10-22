import type { LegalDoc } from "@/lib/legal-copy";
import { legalDoc } from "@/lib/legal-copy";
import type { Locale } from "@/lib/locale";

export function LegalDocView({ locale, doc }: { locale: Locale; doc: LegalDoc }) {
  const copy = legalDoc(locale, doc);
  return (
    <article className="flex max-w-2xl flex-col gap-8">
      <h1 className="td-title text-4xl">{copy.title}</h1>
      {copy.sections.map((section) => (
        <section key={section.heading ?? section.paragraphs[0]} className="flex flex-col gap-3">
          {section.heading ? <h2 className="td-title text-2xl">{section.heading}</h2> : null}
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph} className="leading-relaxed text-ink-soft">
              {paragraph}
            </p>
          ))}
        </section>
      ))}
    </article>
  );
}
