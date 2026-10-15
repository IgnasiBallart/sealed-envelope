export type Room = {
  slug: string;
  name: string;
  tagline: string;
  description: string[];
  players: string;
  duration: string;
  difficulty: "Easy" | "Medium" | "Hard";
  priceCents: number;
  currency: "eur";
  /** Stripe product tax code; must be eligible for Managed Payments. */
  taxCode: string;
  /** Object key of the PDF in the private file store. Never exposed to the browser. */
  pdfKey: string;
  downloadFileName: string;
};

export const rooms: Room[] = [
  {
    slug: "the-last-train",
    name: "The Last Train",
    tagline: "A night train, a missing passenger and one hour before the border.",
    description: [
      "The 23:40 to Trieste has stopped in the middle of nowhere. Compartment 7 is empty, the conductor swears nobody left, and the only clue is a sealed envelope addressed to you.",
      "Print the dossier, open the envelopes in order and work out what happened before the train starts moving again.",
    ],
    players: "1–4 players",
    duration: "60–90 min",
    difficulty: "Medium",
    priceCents: 1200,
    currency: "eur",
    // Digital stand-alone document, downloadable, permanent rights.
    taxCode: "txcd_10503000",
    pdfKey: "rooms/the-last-train/v1.pdf",
    downloadFileName: "sealed-envelope-the-last-train.pdf",
  },
];

export function getRoom(slug: string): Room | undefined {
  return rooms.find((room) => room.slug === slug);
}

export function formatPrice(room: Pick<Room, "priceCents" | "currency">): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: room.currency,
  }).format(room.priceCents / 100);
}
