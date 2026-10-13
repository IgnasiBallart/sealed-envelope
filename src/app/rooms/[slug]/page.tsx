import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatPrice, getRoom, rooms } from "@/lib/catalog";
import { BuyButton } from "./buy-button";

export function generateStaticParams() {
  return rooms.map((room) => ({ slug: room.slug }));
}

export async function generateMetadata({ params }: PageProps<"/rooms/[slug]">): Promise<Metadata> {
  const room = getRoom((await params).slug);
  return room ? { title: room.name, description: room.tagline } : {};
}

// Every room is prerendered from generateStaticParams. Awaiting params outside <Suspense> keeps
// unknown slugs as a real HTTP 404 instead of a streamed not-found page with status 200.
export const instant = false;

export default async function RoomPage({ params }: PageProps<"/rooms/[slug]">) {
  const room = getRoom((await params).slug);
  if (!room) notFound();

  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl font-bold tracking-tight">{room.name}</h1>
        <p className="text-lg text-stone-600 dark:text-stone-400">{room.tagline}</p>
      </header>

      <dl className="grid grid-cols-3 gap-4 rounded-lg border border-stone-200 bg-white p-4 text-sm dark:border-stone-800 dark:bg-stone-900">
        <div>
          <dt className="text-stone-500">Players</dt>
          <dd className="font-medium">{room.players}</dd>
        </div>
        <div>
          <dt className="text-stone-500">Duration</dt>
          <dd className="font-medium">{room.duration}</dd>
        </div>
        <div>
          <dt className="text-stone-500">Difficulty</dt>
          <dd className="font-medium">{room.difficulty}</dd>
        </div>
      </dl>

      <div className="flex flex-col gap-4 text-stone-700 dark:text-stone-300">
        {room.description.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div className="flex flex-col gap-2 sm:max-w-xs">
        <BuyButton slug={room.slug} label={`Buy for ${formatPrice(room)}`} />
        <p className="text-sm text-stone-500">
          You&apos;ll get a download link by email right after paying.
        </p>
      </div>
    </article>
  );
}
