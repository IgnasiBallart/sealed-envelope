# Private bucket with the room PDFs. Nothing is public: the app hands out ~15 minute signed URLs.

resource "aws_s3_bucket" "pdfs" {
  bucket = "sealed-envelope-pdfs-${data.aws_caller_identity.current.account_id}"
}

resource "aws_s3_bucket_public_access_block" "pdfs" {
  bucket = aws_s3_bucket.pdfs.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "pdfs" {
  bucket = aws_s3_bucket.pdfs.id

  # Disables ACLs entirely: access is decided only by IAM and the bucket policy.
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "pdfs" {
  bucket = aws_s3_bucket.pdfs.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_versioning" "pdfs" {
  bucket = aws_s3_bucket.pdfs.id

  # Overwriting or deleting a PDF by mistake can be undone.
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "pdfs" {
  bucket = aws_s3_bucket.pdfs.id

  rule {
    id     = "expire-old-versions"
    status = "Enabled"

    filter {}

    noncurrent_version_expiration {
      noncurrent_days = 90
    }
  }

  depends_on = [aws_s3_bucket_versioning.pdfs]
}

data "aws_iam_policy_document" "pdfs_tls_only" {
  statement {
    sid     = "DenyInsecureTransport"
    effect  = "Deny"
    actions = ["s3:*"]
    resources = [
      aws_s3_bucket.pdfs.arn,
      "${aws_s3_bucket.pdfs.arn}/*",
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

resource "aws_s3_bucket_policy" "pdfs" {
  bucket = aws_s3_bucket.pdfs.id
  policy = data.aws_iam_policy_document.pdfs_tls_only.json

  depends_on = [aws_s3_bucket_public_access_block.pdfs]
}
