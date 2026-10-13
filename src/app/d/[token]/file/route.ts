import { getRoom } from "@/lib/catalog";
import { fileStore } from "@/lib/files";
import { findPaidOrderByToken } from "@/lib/fulfillment";

export async function GET(_request: Request, ctx: RouteContext<"/d/[token]/file">) {
  const { token } = await ctx.params;
  const order = await findPaidOrderByToken(token);
  const room = order ? getRoom(order.productSlug) : undefined;
  if (!order || !room) {
    return new Response("Download link not found", { status: 404 });
  }

  try {
    return await fileStore().downloadResponse(room.pdfKey, room.downloadFileName);
  } catch (error) {
    console.error(`Could not serve ${room.pdfKey} for order ${order.stripeSessionId}:`, error);
    return new Response("The file is temporarily unavailable. Please try again later.", { status: 503 });
  }
}
