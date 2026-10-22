variable "aws_region" {
  type    = string
  default = "eu-north-1"
}

variable "aws_profile" {
  type    = string
  default = "personal"
}

variable "sender_email" {
  description = "Sandbox-era Gmail identity. Shop From is hola@mail_domain; keep this for the SES identity resource."
  type        = string
}

variable "mail_domain" {
  description = "Shop domain for SES Easy DKIM and later From hola@…"
  type        = string
  default     = "tabledetective.com"
}

variable "sandbox_recipients" {
  description = "While SES is in the sandbox it only delivers to verified addresses. List the ones you test with."
  type        = list(string)
  default     = []
}

variable "stripe_secret_key" {
  description = "Stripe test secret (sk_test_…). Stored in SSM; never put a live key here until legal/VAT are done."
  type        = string
  sensitive   = true
}

variable "stripe_webhook_secret" {
  description = "Signing secret of the Stripe Dashboard webhook endpoint (whsec_…), not the one from `stripe listen`."
  type        = string
  sensitive   = true
}

variable "download_token_secret" {
  description = "HMAC secret for download links. At least 32 characters. Rotating it breaks every link already sent."
  type        = string
  sensitive   = true

  validation {
    condition     = length(var.download_token_secret) >= 32
    error_message = "download_token_secret must be at least 32 characters."
  }
}

variable "image_tag" {
  description = "ECR tag to deploy (e.g. latest). Leave empty on the first apply so the data plane exists before any image is pushed."
  type        = string
  default     = ""
}

variable "app_url" {
  description = "Public shop URL (https://tabledetective.com). Used in Stripe redirects and download emails. Not the raw Lambda Function URL."
  type        = string
  default     = ""
}
