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

## AWS infrastructure (Terraform)

Personal AWS account, CLI profile `personal`, region `eu-north-1` (Stockholm).

App Runner closed to new AWS accounts on 30 April 2026, so the app runs on **ECS Express Mode**
(Fargate + a managed Application Load Balancer). The ALB is billed even with almost no traffic;
destroy the Express service if you want that cost to stop.

The account needs a **default VPC** in `eu-north-1` (Express Mode puts the load balancer in it).
This account already has `vpc-05e7fb1f54e74f79d`.

```bash
# 1. Once per account: the bucket that stores Terraform state (its own state stays local).
cd infra/bootstrap
terraform init && terraform apply
terraform output -raw backend_config > ../app/backend.hcl

# 2. Data plane: PDF bucket, orders table, SES, IAM, ECR, SSM secrets. No running app yet.
cd ../app
cp terraform.tfvars.example terraform.tfvars   # emails, Stripe test keys, download secret
terraform init -backend-config=backend.hcl
terraform plan
terraform apply
```

SES emails a verification link to every address in `terraform.tfvars`; click them before testing.
Then upload the PDF, point local `.env.local` at AWS if you want, and deploy the container:

```bash
aws s3 cp storage/pdfs/rooms/the-last-train/v1.pdf \
  "s3://$(terraform output -raw pdf_bucket)/rooms/the-last-train/v1.pdf" --profile personal
terraform output -raw app_env   # paste into .env.local to run Next locally against DynamoDB/S3/SES

# 3. Image
terraform output -raw docker_push   # login, build, push
# set image_tag = "latest" in terraform.tfvars
terraform apply

# 4. Public URL → Stripe redirects and emails
terraform output -raw public_url    # paste as app_url in terraform.tfvars (https://…)
terraform apply
```

In the Stripe Dashboard (test mode) create a webhook endpoint `{public_url}/api/stripe/webhook`
for `checkout.session.completed` and `checkout.session.async_payment_succeeded`. Put that
endpoint's `whsec_…` in `stripe_webhook_secret` (it is not the secret from `stripe listen`) and
apply again.

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
- Custom domain in front of the Express Mode URL.
- SES production access and a domain identity with DKIM.
- Rate limiting on `/resend`.
