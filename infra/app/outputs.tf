output "pdf_bucket" {
  value = aws_s3_bucket.pdfs.bucket
}

output "orders_table" {
  value = aws_dynamodb_table.orders.name
}

output "app_policy_arn" {
  value = aws_iam_policy.app.arn
}

output "app_env" {
  description = "Lines for .env.local to run the app locally against AWS"
  value       = <<-EOT
    AWS_PROFILE=${var.aws_profile}
    AWS_REGION=${var.aws_region}
    ORDER_STORE=dynamodb
    ORDERS_TABLE=${aws_dynamodb_table.orders.name}
    FILE_STORE=s3
    PDF_BUCKET=${aws_s3_bucket.pdfs.bucket}
    MAILER=ses
    MAIL_FROM=Table Detective <hola@${var.mail_domain}>
  EOT
}

output "ecr_repository_url" {
  value = aws_ecr_repository.app.repository_url
}

output "docker_push" {
  description = "Build/push the Lambda image. --provenance=false --sbom=false: Lambda rejects OCI image indexes. Temp Docker config: Docker Desktop + wincred often fails to store the ECR password."
  value       = <<-EOT
    mkdir -p /tmp/docker-ecr && printf '%s\n' '{}' > /tmp/docker-ecr/config.json
    aws ecr get-login-password --profile ${var.aws_profile} --region ${var.aws_region} | docker --config /tmp/docker-ecr login --username AWS --password-stdin ${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com
    docker build --platform linux/amd64 --provenance=false --sbom=false -t sealed-envelope:latest .
    docker tag sealed-envelope:latest ${aws_ecr_repository.app.repository_url}:latest
    docker --config /tmp/docker-ecr push ${aws_ecr_repository.app.repository_url}:latest
    rm -rf /tmp/docker-ecr
  EOT
}

output "public_url" {
  description = "Raw Lambda Function URL. Shop traffic should go through tabledetective.com (Cloudflare Worker). Stripe webhook: https://tabledetective.com/api/stripe/webhook"
  value       = try(trimsuffix(aws_lambda_function_url.app[0].function_url, "/"), null)
}

output "ses_dns" {
  description = "Cloudflare DNS for SES (grey cloud is fine). Add these, wait until the domain identity is Verified, then switch MAIL_FROM to hola@tabledetective.com."
  value       = <<-EOT
    # DKIM — CNAME, DNS only (grey) is enough
    %{for token in aws_sesv2_email_identity.domain.dkim_signing_attributes[0].tokens~}
    ${token}._domainkey.${var.mail_domain}  CNAME  ${token}.dkim.amazonses.com
    %{endfor~}

    # Custom MAIL FROM (return-path)
    bounce.${var.mail_domain}  MX   10  feedback-smtp.${var.aws_region}.amazonses.com
    bounce.${var.mail_domain}  TXT      "v=spf1 include:amazonses.com -all"

    # Apex (together with Cloudflare Email Routing for inbound hola@)
    ${var.mail_domain}         TXT      "v=spf1 include:amazonses.com include:_spf.mx.cloudflare.net ~all"
    _dmarc.${var.mail_domain}  TXT      "v=DMARC1; p=quarantine; rua=mailto:hola@${var.mail_domain}"
  EOT
}
