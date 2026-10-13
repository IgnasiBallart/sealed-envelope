# Sealed Envelope

Printable escape rooms sold as PDFs. The buyer pays with Stripe Checkout and gets a permanent
download link (`/d/<token>`) by email. No user accounts: the checkout email identifies the buyer.

Next.js 16 (App Router, TypeScript, Tailwind). Pages and server code live in this single project.

## How a purchase works

1. `/rooms/[slug]` → server action creates a Stripe Checkout Session and redirects to Stripe.
2. Stripe calls `POST /api/stripe/webhook`. **Only this webhook marks an order as paid**;
   `/checkout/success` is just a "check your inbox" page.
3. The webhook stores the order (email, product, Stripe session id, paid, token hash) and emails
   `APP_URL/d/<token>`.
4. `/d/<token>` checks the order; `/d/<token>/file` hands over the PDF (locally the file itself,
   on AWS a fresh ~15 min S3 signed URL).
5. `/resend` emails the same links again for every paid order of an address. The on-screen answer
   is always the same.

The token is `HMAC-SHA256(DOWNLOAD_TOKEN_SECRET, orderId)`. The store keeps only its SHA-256 hash,
and the resend flow can still rebuild the exact link. Rotating the secret breaks every link sent.

## Local development

Requires Node 20.9+.

```bash
npm install
cp .env.example .env.local   # then fill DOWNLOAD_TOKEN_SECRET (openssl rand -hex 32)
npm run sample-pdf           # placeholder PDF in storage/pdfs (git-ignored)
npm run dev
```

Local adapters: orders in `.data/orders.json`, PDFs in `storage/pdfs/`, emails printed in the
`npm run dev` terminal. None of them are committed.

### Without a Stripe account

```bash
npm run simulate-webhook -- buyer@example.com
```

Sends a signed fake `checkout.session.completed` to the local webhook. The email with the
download link appears in the dev server output.

### With Stripe test mode

1. Put your test secret key (`sk_test_…`) in `STRIPE_SECRET_KEY`. Live keys are rejected on purpose.
2. Install the [Stripe CLI](https://docs.stripe.com/stripe-cli), then:
   ```bash
   stripe login
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
3. Copy the printed `whsec_…` into `STRIPE_WEBHOOK_SECRET` and restart `npm run dev`.
4. Buy a room with card `4242 4242 4242 4242`, any future date and any CVC.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server on http://localhost:3000 |
| `npm run build` / `npm start` | Production build / server |
| `npm run lint` | ESLint |
| `npm run typecheck` | Route type generation + `tsc` |
| `npm run sample-pdf` | Writes placeholder PDFs to `LOCAL_PDF_DIR` |
| `npm run simulate-webhook -- <email> [slug]` | Fake signed Stripe webhook |

## Before charging real money

- Legal notice, terms and privacy policy.
- VAT handling for digital goods.
- AWS adapters (DynamoDB, S3, SES) and Terraform infrastructure.
- Rate limiting on `/resend`.
