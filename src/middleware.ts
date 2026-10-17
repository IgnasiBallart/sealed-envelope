import { NextRequest, NextResponse } from "next/server";
import { LOCALES, negotiateLocale } from "@/lib/locale";

/** Cloudflare Worker sends the Lambda Function URL as Host; the public name is X-Forwarded-Host. */
function publicUrl(request: NextRequest): URL {
  const url = request.nextUrl.clone();
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  if (forwardedHost) {
    url.host = forwardedHost;
    url.protocol = "https:";
    url.port = "";
  }
  return url;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = LOCALES.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
  if (hasLocale) return NextResponse.next();

  const locale = negotiateLocale(request.headers.get("accept-language"));
  const url = publicUrl(request);
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|d/|_next/static|_next/image|favicon.ico).*)"],
};
