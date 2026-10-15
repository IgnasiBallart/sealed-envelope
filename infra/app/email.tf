# SES identities. Creating an email identity makes SES send a verification link to that address;
# it can't send (or, in the sandbox, receive) until someone clicks it.
# Later, with a domain, replace the sender with a domain identity plus DKIM records.

resource "aws_sesv2_email_identity" "sender" {
  email_identity = var.sender_email
}

resource "aws_sesv2_email_identity" "sandbox_recipient" {
  for_each       = toset(var.sandbox_recipients)
  email_identity = each.value
}
