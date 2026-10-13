import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getRoom } from "@/lib/catalog";
import { findPaidOrderByToken } from "@/lib/fulfillment";

export const metadata: Metadata = {
  title: "Your download",
  robots: { index: false, follow: false },
};

export default function DownloadPage({ params }: PageProps<"/d/[token]">) {
  return (
    <Suspense fallback={<p className="text-stone-500">Checking your link…</p>}>
      <Download params={params} />
    </Suspense>
  );
}

async function Download({ params }: Pick<PageProps<"/d/[token]">, "params">) {
  const { token } = await params;
  const order = await findPaidOrderByToken(token);
  const room = order ? getRoom(order.productSlug) : undefined;

  if (!order || !room) {
    return (
      <div className="flex max-w-2xl flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">This link doesn&apos;t work</h1>
        <p className="text-stone-700 dark:text-stone-300">
          Check that you copied the whole link from the email. If you just paid, wait a minute and reload.
        </p>
        <p className="text-stone-700 dark:text-stone-300">
          You can also{" "}
          <Link href="/resend" className="underline">
            ask us to resend your downloads
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">{room.name}</h1>
      <p className="text-stone-700 dark:text-stone-300">
        Your room is ready. Print it single-sided and don&apos;t open the envelopes until the dossier tells you to.
      </p>
      <a
        href={`/d/${token}/file`}
        className="self-start rounded-md bg-amber-700 px-6 py-3 font-semibold text-white transition hover:bg-amber-800"
      >
        Download PDF
      </a>
      <p className="text-sm text-stone-500">
        This page works whenever you need it. Bookmark it or keep the email.
      </p>
    </div>
  );
}
