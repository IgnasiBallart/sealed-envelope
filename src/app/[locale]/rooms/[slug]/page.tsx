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

  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl font-bold tracking-tight">{copy.name}</h1>
        <p className="text-lg text-stone-600 dark:text-stone-400">{copy.tagline}</p>
      </header>

      <dl className="grid grid-cols-3 gap-4 rounded-lg border border-stone-200 bg-white p-4 text-sm dark:border-stone-800 dark:bg-stone-900">
        <div>
          <dt className="text-stone-500">{ui.room.players}</dt>
          <dd className="font-medium">{copy.players}</dd>
        </div>
        <div>
          <dt className="text-stone-500">{ui.room.duration}</dt>
          <dd className="font-medium">{copy.duration}</dd>
        </div>
        <div>
          <dt className="text-stone-500">{ui.room.difficulty}</dt>
          <dd className="font-medium">{copy.difficulty}</dd>
        </div>
      </dl>

      <div className="flex flex-col gap-4 text-stone-700 dark:text-stone-300">
        {copy.description.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div className="flex flex-col gap-2 sm:max-w-xs">
        <BuyButton
          slug={room.slug}
          uiLocale={locale}
          label={ui.room.buy(formatPrice(room, locale))}
          pdfLegend={ui.room.pdfLanguage}
          pendingLabel={ui.room.pending}
        />
        <p className="text-sm text-stone-500">{ui.room.checkoutHint}</p>
      </div>
    </article>
  );
}
