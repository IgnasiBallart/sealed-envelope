import "server-only";
import { SendEmailCommand, SESv2Client } from "@aws-sdk/client-sesv2";
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

/** Sender identity from infra/app/email.tf. In the SES sandbox the recipient must be verified too. */
class SesMailer implements Mailer {
  private readonly ses = new SESv2Client({});

  async send(email: Email): Promise<void> {
    await this.ses.send(
      new SendEmailCommand({
        FromEmailAddress: env.mailFrom(),
        Destination: { ToAddresses: [email.to] },
        Content: {
          Simple: {
            Subject: { Data: email.subject, Charset: "UTF-8" },
            Body: {
              Text: { Data: email.text, Charset: "UTF-8" },
              Html: { Data: email.html, Charset: "UTF-8" },
            },
          },
        },
      }),
    );
  }
}

let mailer: Mailer | undefined;

function createMailer(): Mailer {
  switch (env.mailer()) {
    case "console":
      return new ConsoleMailer();
    case "ses":
      return new SesMailer();
  }
}

export function getMailer(): Mailer {
  mailer ??= createMailer();
  return mailer;
}
