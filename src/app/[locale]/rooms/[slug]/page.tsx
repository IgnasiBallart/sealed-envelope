import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatPrice, getRoom, roomCopy, rooms } from "@/lib/catalog";
import { LOCALES, localeFromParam } from "@/lib/locale";
import { t } from "@/lib/messages";
import { BuyButton } from "./buy-button";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => rooms.map((room) => ({ locale, slug: room.slug })));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/rooms/[slug]">): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = localeFromParam(localeParam);
  const room = getRoom(slug);
  if (!locale || !room) return {};
  const copy = roomCopy(room, locale);
  return { title: copy.name, description: copy.tagline };
}

export const instant = false;

export default async function RoomPage({ params }: PageProps<"/[locale]/rooms/[slug]">) {
  const { locale: localeParam, slug } = await params;
  const locale = localeFromParam(localeParam);
  const room = getRoom(slug);
  if (!locale || !room) notFound();

  const ui = t(locale);
  const copy = roomCopy(room, locale);
  const caseNo = String(rooms.findIndex((item) => item.slug === room.slug) + 1).padStart(2, "0");

  return (
    <article className="flex flex-col gap-10">
      <header className="flex max-w-2xl flex-col gap-4">
        <p className="td-kicker">{ui.home.caseFile(caseNo)}</p>
        <h1 className="td-title text-4xl sm:text-5xl">{copy.name}</h1>
        <p className="text-lg leading-relaxed text-ink-soft">{copy.tagline}</p>
      </header>

      <dl className="td-card grid grid-cols-1 divide-y divide-rule text-sm sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div className="px-4 py-4">
          <dt className="td-kicker mb-2">{ui.room.players}</dt>
          <dd className="font-medium">{copy.players}</dd>
        </div>
        <div className="px-4 py-4">
          <dt className="td-kicker mb-2">{ui.room.duration}</dt>
          <dd className="font-medium">{copy.duration}</dd>
        </div>
        <div className="px-4 py-4">
          <dt className="td-kicker mb-2">{ui.room.difficulty}</dt>
          <dd className="font-medium">{copy.difficulty}</dd>
        </div>
      </dl>

      <div className="flex max-w-2xl flex-col gap-4 leading-relaxed text-ink-soft">
        {copy.description.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div className="td-card flex max-w-md flex-col gap-3 p-6">
        <BuyButton
          slug={room.slug}
          uiLocale={locale}
          label={ui.room.buy(formatPrice(room, locale))}
          pdfLegend={ui.room.pdfLanguage}
          pendingLabel={ui.room.pending}
        />
        <p className="text-sm text-ink-soft">{ui.room.checkoutHint}</p>
      </div>
    </article>
  );
}
