import Link from "next/link";
import { formatPrice, rooms } from "@/lib/catalog";

export default function Home() {
  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Escape rooms you open at home.</h1>
        <p className="max-w-2xl text-lg text-stone-600 dark:text-stone-400">
          Buy a room, download the PDF, print it and open the first envelope. No app, no account, no timer
          ticking on a screen.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Rooms</h2>
        <ul className="grid gap-6 sm:grid-cols-2">
          {rooms.map((room) => (
            <li key={room.slug}>
              <Link
                href={`/rooms/${room.slug}`}
                className="flex h-full flex-col gap-3 rounded-lg border border-stone-200 bg-white p-6 transition hover:border-amber-700 dark:border-stone-800 dark:bg-stone-900"
              >
                <h3 className="text-lg font-semibold">{room.name}</h3>
                <p className="text-stone-600 dark:text-stone-400">{room.tagline}</p>
                <p className="mt-auto text-sm text-stone-500">
                  {room.players} · {room.duration} · {room.difficulty} ·{" "}
                  <span className="font-medium text-foreground">{formatPrice(room)}</span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
