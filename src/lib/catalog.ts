import { NUMBER_LOCALES, type Locale } from "@/lib/locale";
import type { PdfLocale } from "@/lib/pdf-locale";

export type { PdfLocale } from "@/lib/pdf-locale";
export { isPdfLocale, PDF_LOCALES, PDF_LOCALE_LABELS } from "@/lib/pdf-locale";

export type RoomCopy = {
  name: string;
  tagline: string;
  description: string[];
  players: string;
  duration: string;
  difficulty: string;
};

export type Room = {
  slug: string;
  copy: Record<Locale, RoomCopy>;
  priceCents: number;
  currency: "eur";
  taxCode: string;
  /** Player dossier. Pattern: rooms/<slug>/v1.<locale>.pdf */
  pdfKeys: Record<PdfLocale, string>;
  downloadFileNames: Record<PdfLocale, string>;
  /** Answer key. Same purchase, separate file. Pattern: rooms/<slug>/v1.<locale>.solution.pdf */
  solutionPdfKeys: Record<PdfLocale, string>;
  solutionDownloadFileNames: Record<PdfLocale, string>;
};

export const PDF_KINDS = ["dossier", "solution"] as const;
export type PdfKind = (typeof PDF_KINDS)[number];

export function isPdfKind(value: unknown): value is PdfKind {
  return typeof value === "string" && (PDF_KINDS as readonly string[]).includes(value);
}

export function pdfFor(room: Room, locale: PdfLocale, kind: PdfKind = "dossier"): { key: string; fileName: string } {
  if (kind === "solution") {
    return { key: room.solutionPdfKeys[locale], fileName: room.solutionDownloadFileNames[locale] };
  }
  return { key: room.pdfKeys[locale], fileName: room.downloadFileNames[locale] };
}

export function roomCopy(room: Room, locale: Locale): RoomCopy {
  return room.copy[locale];
}

export const rooms: Room[] = [
  {
    slug: "the-last-train",
    copy: {
      en: {
        name: "The Last Train",
        tagline: "A night train, a missing passenger and one hour before the border.",
        description: [
          "The 23:40 to Trieste has stopped in the middle of nowhere. Compartment 7 is empty, the conductor swears nobody left, and the only clue is a sealed envelope addressed to you.",
          "Print the dossier, open the envelopes in order and work out what happened before the train starts moving again.",
        ],
        players: "1–4 players",
        duration: "60–90 min",
        difficulty: "Medium",
      },
      es: {
        name: "El último tren",
        tagline: "Un tren nocturno, una pasajera que falta y una hora antes de la frontera.",
        description: [
          "El 23:40 a Trieste se ha detenido en medio de ninguna parte. El compartimento 7 está vacío, el revisor jura que nadie se ha bajado, y la única pista es un sobre cerrado a tu nombre.",
          "Imprime el dossier, abre los sobres en orden y averigua qué ha pasado antes de que el tren vuelva a moverse.",
        ],
        players: "1–4 jugadores",
        duration: "60–90 min",
        difficulty: "Media",
      },
      ca: {
        name: "L'últim tren",
        tagline: "Un tren nocturn, una passatgera que falta i una hora abans de la frontera.",
        description: [
          "El 23:40 a Trieste s’ha aturat enmig de no-res. El compartiment 7 és buit, el revisor jura que ningú no s’ha baixat, i l’única pista és un sobre tancat a nom teu.",
          "Imprimeix el dossier, obre els sobres en ordre i esbrina què ha passat abans que el tren torni a moure’s.",
        ],
        players: "1–4 jugadors",
        duration: "60–90 min",
        difficulty: "Mitjana",
      },
    },
    priceCents: 1200,
    currency: "eur",
    taxCode: "txcd_10503000",
    pdfKeys: {
      en: "rooms/the-last-train/v1.en.pdf",
      es: "rooms/the-last-train/v1.es.pdf",
      ca: "rooms/the-last-train/v1.ca.pdf",
    },
    downloadFileNames: {
      en: "table-detective-the-last-train-en.pdf",
      es: "table-detective-the-last-train-es.pdf",
      ca: "table-detective-the-last-train-ca.pdf",
    },
    solutionPdfKeys: {
      en: "rooms/the-last-train/v1.en.solution.pdf",
      es: "rooms/the-last-train/v1.es.solution.pdf",
      ca: "rooms/the-last-train/v1.ca.solution.pdf",
    },
    solutionDownloadFileNames: {
      en: "table-detective-the-last-train-en-solution.pdf",
      es: "table-detective-the-last-train-es-solution.pdf",
      ca: "table-detective-the-last-train-ca-solution.pdf",
    },
  },
];

export function getRoom(slug: string): Room | undefined {
  return rooms.find((room) => room.slug === slug);
}

export function formatPrice(room: Pick<Room, "priceCents" | "currency">, locale: Locale): string {
  return new Intl.NumberFormat(NUMBER_LOCALES[locale], {
    style: "currency",
    currency: room.currency,
  }).format(room.priceCents / 100);
}
