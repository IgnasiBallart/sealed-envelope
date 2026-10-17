import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice, roomCopy, rooms } from "@/lib/catalog";
import { localeFromParam, withLocale } from "@/lib/locale";
import { t } from "@/lib/messages";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const locale = localeFromParam((await params).locale);
  if (!locale) notFound();
  const copy = t(locale);

  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{copy.home.h1}</h1>
        <p className="max-w-2xl text-lg text-stone-600 dark:text-stone-400">{copy.home.lead}</p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">{copy.home.rooms}</h2>
        <ul className="grid gap-6 sm:grid-cols-2">
          {rooms.map((room) => {
            const roomText = roomCopy(room, locale);
            return (
              <li key={room.slug}>
                <Link
                  href={withLocale(locale, `/rooms/${room.slug}`)}
                  className="flex h-full flex-col gap-3 rounded-lg border border-stone-200 bg-white p-6 transition hover:border-amber-700 dark:border-stone-800 dark:bg-stone-900"
                >
                  <h3 className="text-lg font-semibold">{roomText.name}</h3>
                  <p className="text-stone-600 dark:text-stone-400">{roomText.tagline}</p>
                  <p className="mt-auto text-sm text-stone-500">
                    {roomText.players} · {roomText.duration} · {roomText.difficulty} ·{" "}
                    <span className="font-medium text-foreground">{formatPrice(room, locale)}</span>
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
