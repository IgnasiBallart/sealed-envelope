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

The public site runs on **AWS Lambda** (container image + Function URL). There is no load balancer
and no always-on process: idle compute is ~€0. The first request after a quiet period can take
1–3 seconds (cold start). DynamoDB, S3 and SES are unchanged.

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
Then upload the PDF, point local `.env.local` at AWS if you want, and deploy the container.
`terraform output` only works from `infra/app` (or with `-chdir=infra/app` from the repo root):

```bash
# from the repo root
BUCKET=$(terraform -chdir=infra/app output -raw pdf_bucket)
aws s3 cp storage/pdfs/rooms/the-last-train/v1.es.pdf \
  "s3://$BUCKET/rooms/the-last-train/v1.es.pdf" --profile personal
aws s3 cp storage/pdfs/rooms/the-last-train/v1.es.solution.pdf \
  "s3://$BUCKET/rooms/the-last-train/v1.es.solution.pdf" --profile personal
terraform -chdir=infra/app output -raw app_env   # paste into .env.local to run Next locally against DynamoDB/S3/SES

# 3. Image (includes the Lambda Web Adapter). docker build needs the repo root (Dockerfile).
terraform -chdir=infra/app output -raw docker_push
# First time only: set image_tag = "latest" in terraform.tfvars, then:
terraform -chdir=infra/app plan    # creates the Lambda + Function URL; review before apply
terraform -chdir=infra/app apply
# Later deploys: push :latest again, then tell Lambda to pick up the new digest
# (Terraform will not notice a change if image_tag is still "latest"):
# aws lambda update-function-code --function-name sealed-envelope \
#   --image-uri "$(terraform -chdir=infra/app output -raw ecr_repository_url):latest" \
#   --profile personal --region eu-north-1


# 4. Shop URL is https://tabledetective.com (Cloudflare Worker in cloudflare/).
# app_url in terraform.tfvars, then plan/apply so emails and Stripe redirects use it.
```

Public hostname: Cloudflare Free cannot override `Host` (that is Pro/Enterprise). `cloudflare/worker.js` fetches the Function URL so Lambda sees its own hostname. Orange-cloud CNAME `@` to the Function URL host, `www` to `@`, SSL Full (strict), then from `cloudflare/`: `npx wrangler login && npx wrangler deploy`. Stripe webhook: `https://tabledetective.com/api/stripe/webhook`.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server on http://localhost:3000 |
| `npm run build` / `npm start` | Production build / server |
| `npm run lint` | ESLint |
| `npm run typecheck` | Route type generation + `tsc` |
| `npm run sample-pdf` | Writes placeholder PDFs to `LOCAL_PDF_DIR` |
| `npm run simulate-webhook -- <email> [slug] [en|es|ca]` | Fake signed Stripe webhook |

## Before charging real money

- Legal notice, terms and privacy policy.
- VAT handling for digital goods.
- Custom domain in front of the Lambda Function URL.
- SES production access and a domain identity with DKIM.
- Rate limiting on `/resend`.
