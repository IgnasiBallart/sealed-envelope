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
    MAIL_FROM=Sealed Envelope <${var.sender_email}>
  EOT
}

output "ecr_repository_url" {
  value = aws_ecr_repository.app.repository_url
}

output "docker_push" {
  description = "Commands to build and push the image from Ubuntu"
  value       = <<-EOT
    aws ecr get-login-password --profile ${var.aws_profile} --region ${var.aws_region} | docker login --username AWS --password-stdin ${aws_ecr_repository.app.repository_url}
    docker build -t sealed-envelope:latest .
    docker tag sealed-envelope:latest ${aws_ecr_repository.app.repository_url}:latest
    docker push ${aws_ecr_repository.app.repository_url}:latest
  EOT
}

output "public_url" {
  description = "Set this as app_url in terraform.tfvars and re-apply. Also point the Stripe webhook here: {url}/api/stripe/webhook"
  value       = try(aws_ecs_express_gateway_service.app[0].ingress_paths[0].endpoint, null)
}
