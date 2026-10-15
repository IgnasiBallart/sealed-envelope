# Creates the S3 bucket that stores the state of infra/app.
# This stack keeps its own (tiny) state locally: it cannot store state in a bucket it creates.
# Apply it once per account; afterwards it rarely changes.

terraform {
  required_version = ">= 1.10"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile

  default_tags {
    tags = {
      Project   = "sealed-envelope"
      ManagedBy = "terraform"
      Stack     = "bootstrap"
    }
  }
}

variable "aws_region" {
  type    = string
  default = "eu-north-1"
}

variable "aws_profile" {
  type    = string
  default = "personal"
}

data "aws_caller_identity" "current" {}

resource "aws_s3_bucket" "tfstate" {
  # Bucket names are global across all AWS accounts; the account id keeps this one unique.
  bucket = "sealed-envelope-tfstate-${data.aws_caller_identity.current.account_id}"

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_versioning" "tfstate" {
  bucket = aws_s3_bucket.tfstate.id

  # Every state write becomes a new version, so a corrupted or deleted state can be restored.
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "tfstate" {
  bucket = aws_s3_bucket.tfstate.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "tfstate" {
  bucket = aws_s3_bucket.tfstate.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "tfstate" {
  bucket = aws_s3_bucket.tfstate.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

data "aws_iam_policy_document" "tfstate_tls_only" {
  statement {
    sid     = "DenyInsecureTransport"
    effect  = "Deny"
    actions = ["s3:*"]
    resources = [
      aws_s3_bucket.tfstate.arn,
      "${aws_s3_bucket.tfstate.arn}/*",
    ]

    principals {
      type        = "*"
      identifiers = ["*"]
    }

    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values   = ["false"]
    }
  }
}

resource "aws_s3_bucket_policy" "tfstate" {
  bucket = aws_s3_bucket.tfstate.id
  policy = data.aws_iam_policy_document.tfstate_tls_only.json

  depends_on = [aws_s3_bucket_public_access_block.tfstate]
}

output "state_bucket" {
  value = aws_s3_bucket.tfstate.bucket
}

output "backend_config" {
  description = "Paste into infra/app/backend.hcl"
  value       = <<-EOT
    bucket  = "${aws_s3_bucket.tfstate.bucket}"
    region  = "${var.aws_region}"
    profile = "${var.aws_profile}"
  EOT
}
