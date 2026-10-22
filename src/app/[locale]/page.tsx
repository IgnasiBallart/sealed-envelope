import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice, roomCopy, rooms } from "@/lib/catalog";
import { localeFromParam, withLocale } from "@/lib/locale";
import { t } from "@/lib/messages";

export const instant = false;

export default async function Home({ params }: PageProps<"/[locale]">) {
  const locale = localeFromParam((await params).locale);
  if (!locale) notFound();
  const copy = t(locale);

  return (
    <div className="flex flex-col gap-16">
      <section className="flex max-w-2xl flex-col gap-5">
        <p className="td-kicker">{copy.home.kicker}</p>
        <h1 className="td-title text-4xl sm:text-6xl">{copy.home.h1}</h1>
        <p className="text-lg leading-relaxed text-ink-soft">{copy.home.lead}</p>
      </section>

      <section className="flex flex-col gap-5">
        <div className="flex items-end justify-between gap-4 border-b border-rule pb-3">
          <h2 className="td-title text-2xl">{copy.home.rooms}</h2>
        </div>
        <ul className="grid gap-6 sm:grid-cols-2">
          {rooms.map((room, index) => {
            const roomText = roomCopy(room, locale);
            const caseNo = String(index + 1).padStart(2, "0");
            return (
              <li key={room.slug}>
                <Link
                  href={withLocale(locale, `/rooms/${room.slug}`)}
                  className="td-card group relative flex h-full flex-col gap-4 overflow-hidden p-6 pl-7 transition hover:-translate-y-0.5"
                >
                  <span aria-hidden className="absolute inset-y-0 left-0 w-1.5 bg-wax" />
                  <p className="td-kicker">{copy.home.caseFile(caseNo)}</p>
                  <h3 className="td-title text-2xl">{roomText.name}</h3>
                  <p className="leading-relaxed text-ink-soft">{roomText.tagline}</p>
                  <p className="mt-auto flex flex-wrap gap-x-3 gap-y-1 text-sm text-ink-soft">
                    <span>{roomText.players}</span>
                    <span aria-hidden>·</span>
                    <span>{roomText.duration}</span>
                    <span aria-hidden>·</span>
                    <span>{roomText.difficulty}</span>
                    <span className="font-semibold text-foreground">{formatPrice(room, locale)}</span>
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
