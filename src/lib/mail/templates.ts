import type { Email } from "./index";

export type DownloadLink = { roomName: string; url: string };

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function render(to: string, subject: string, intro: string, links: DownloadLink[]): Email {
  const text = [
    intro,
    "",
    ...links.map((link) => `${link.roomName}: ${link.url}`),
    "",
    "These links don't expire. Keep this email so you can download your rooms again.",
    "— Sealed Envelope",
  ].join("\n");

  const html = `<p>${escapeHtml(intro)}</p>
<ul>
${links.map((link) => `  <li><a href="${escapeHtml(link.url)}">${escapeHtml(link.roomName)}</a></li>`).join("\n")}
</ul>
<p>These links don't expire. Keep this email so you can download your rooms again.</p>
<p>— Sealed Envelope</p>`;

  return { to, subject, text, html };
}

export function purchaseEmail(to: string, link: DownloadLink): Email {
  return render(
    to,
    `Your escape room: ${link.roomName}`,
    "Thanks for your purchase! Here is your download link:",
    [link],
  );
}

export function resendEmail(to: string, links: DownloadLink[]): Email {
  return render(
    to,
    "Your Sealed Envelope downloads",
    "You asked us to resend your downloads. Here they are:",
    links,
  );
}
