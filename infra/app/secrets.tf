# Secrets live in SSM Parameter Store (cheaper than Secrets Manager for three strings).
# Terraform writes them from terraform.tfvars, which is git-ignored. They still end up in
# the encrypted S3 state file.

resource "aws_ssm_parameter" "stripe_secret_key" {
  name  = "/sealed-envelope/stripe-secret-key"
  type  = "SecureString"
  value = var.stripe_secret_key
}

resource "aws_ssm_parameter" "stripe_webhook_secret" {
  name  = "/sealed-envelope/stripe-webhook-secret"
  type  = "SecureString"
  value = var.stripe_webhook_secret
}

resource "aws_ssm_parameter" "download_token_secret" {
  name  = "/sealed-envelope/download-token-secret"
  type  = "SecureString"
  value = var.download_token_secret
}
