import { getRoom, isPdfKind, pdfFor } from "@/lib/catalog";
import { isPdfLocale } from "@/lib/pdf-locale";
import { fileStore } from "@/lib/files";
import { findPaidOrderByToken } from "@/lib/fulfillment";

export async function GET(_request: Request, ctx: RouteContext<"/d/[token]/file/[kind]">) {
  const { token, kind: kindParam } = await ctx.params;
  if (!isPdfKind(kindParam)) {
    return new Response("Download link not found", { status: 404 });
  }

  const order = await findPaidOrderByToken(token);
  const room = order ? getRoom(order.productSlug) : undefined;
  if (!order || !room) {
    return new Response("Download link not found", { status: 404 });
  }

  const locale = isPdfLocale(order.locale) ? order.locale : "en";
  const pdf = pdfFor(room, locale, kindParam);

  try {
    return await fileStore().downloadResponse(pdf.key, pdf.fileName);
  } catch (error) {
    console.error(`Could not serve ${pdf.key} for order ${order.stripeSessionId}:`, error);
    return new Response("The file is temporarily unavailable. Please try again later.", { status: 503 });
  }
}
