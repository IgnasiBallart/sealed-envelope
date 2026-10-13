import "server-only";
import { env } from "@/lib/env";

export type Email = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export interface Mailer {
  send(email: Email): Promise<void>;
}

/** Development-only: prints the email so the download link can be copied from the terminal. */
class ConsoleMailer implements Mailer {
  async send(email: Email): Promise<void> {
    console.info(
      [
        "──── email (MAILER=console) ────",
        `From: ${env.mailFrom()}`,
        `To: ${email.to}`,
        `Subject: ${email.subject}`,
        "",
        email.text,
        "───────────────────────────────",
      ].join("\n"),
    );
  }
}

let mailer: Mailer | undefined;

function createMailer(): Mailer {
  switch (env.mailer()) {
    case "console":
      return new ConsoleMailer();
  }
}

export function getMailer(): Mailer {
  mailer ??= createMailer();
  return mailer;
}
