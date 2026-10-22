# Domain identity (DKIM) is the shop From: hola@tabledetective.com.
# bounce.tabledetective.com may stay PENDING; USE_DEFAULT_VALUE falls back to amazonses.com.
# Gmail identities remain for the old sandbox-era resources.

resource "aws_sesv2_email_identity" "sender" {
  email_identity = var.sender_email
}

resource "aws_sesv2_email_identity" "sandbox_recipient" {
  # The sender is already an identity; SES rejects a second resource with the same address.
  for_each       = toset([for email in var.sandbox_recipients : email if email != var.sender_email])
  email_identity = each.value
}

resource "aws_sesv2_email_identity" "domain" {
  email_identity = var.mail_domain

  dkim_signing_attributes {
    next_signing_key_length = "RSA_2048_BIT"
  }
}

resource "aws_sesv2_email_identity_mail_from_attributes" "domain" {
  email_identity         = aws_sesv2_email_identity.domain.email_identity
  mail_from_domain       = "bounce.${var.mail_domain}"
  behavior_on_mx_failure = "USE_DEFAULT_VALUE"
}
