# Orders table. Key: Stripe Checkout Session id (one order per paid session).
# The two indexes serve the only other lookups the app does: by token hash (download link)
# and by email (resend form). Without them those would be full-table scans.

resource "aws_dynamodb_table" "orders" {
  name         = "sealed-envelope-orders"
  billing_mode = "PAY_PER_REQUEST" # pay per read/write, nothing while idle
  hash_key     = "stripeSessionId"

  attribute {
    name = "stripeSessionId"
    type = "S"
  }

  attribute {
    name = "tokenHash"
    type = "S"
  }

  attribute {
    name = "email"
    type = "S"
  }

  global_secondary_index {
    name            = "token-hash-index"
    projection_type = "ALL"

    key_schema {
      attribute_name = "tokenHash"
      key_type       = "HASH"
    }
  }

  global_secondary_index {
    name            = "email-index"
    projection_type = "ALL"

    key_schema {
      attribute_name = "email"
      key_type       = "HASH"
    }
  }

  point_in_time_recovery {
    enabled = true
  }

  # Orders are the proof of purchase: `terraform destroy` must not be able to drop them silently.
  deletion_protection_enabled = true
}
