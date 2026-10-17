import type { Locale } from "@/lib/locale";
import { t } from "@/lib/messages";
import type { Email } from "./index";

export type DownloadLink = { roomName: string; url: string };

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function render(to: string, locale: Locale, subject: string, intro: string, links: DownloadLink[]): Email {
  const copy = t(locale);
  const text = [
    intro,
    "",
    ...links.map((link) => `${link.roomName}: ${link.url}`),
    "",
    copy.mail.keep,
    copy.mail.signoff,
  ].join("\n");

  const html = `<p>${escapeHtml(intro)}</p>
<ul>
${links.map((link) => `  <li><a href="${escapeHtml(link.url)}">${escapeHtml(link.roomName)}</a></li>`).join("\n")}
</ul>
<p>${escapeHtml(copy.mail.keep)}</p>
<p>${escapeHtml(copy.mail.signoff)}</p>`;

  return { to, subject, text, html };
}

export function purchaseEmail(to: string, locale: Locale, link: DownloadLink): Email {
  const copy = t(locale);
  return render(to, locale, copy.mail.purchaseSubject(link.roomName), copy.mail.purchaseIntro, [link]);
}

export function resendEmail(to: string, locale: Locale, links: DownloadLink[]): Email {
  const copy = t(locale);
  return render(to, locale, copy.mail.resendSubject, copy.mail.resendIntro, links);
}
