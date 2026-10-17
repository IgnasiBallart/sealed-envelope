# One Lambda + a Function URL. No ALB, no API Gateway, no always-on process.
# Idle cost is ~0 (you pay when someone hits the URL or Stripe sends a webhook).
# The Function URL is a public HTTPS endpoint included with Lambda.

resource "aws_cloudwatch_log_group" "app" {
  name              = "/aws/lambda/sealed-envelope"
  retention_in_days = 14
}

resource "aws_lambda_function" "app" {
  count = var.image_tag == "" ? 0 : 1

  function_name = "sealed-envelope"
  role          = aws_iam_role.lambda.arn
  package_type  = "Image"
  image_uri     = "${aws_ecr_repository.app.repository_url}:${var.image_tag}"
  architectures = ["x86_64"]
  timeout       = 30
  memory_size   = 1024
  # Next.js cold start is 1–3 s; 1024 MB is enough RAM without looking like Fargate.

  image_config {
    command = ["node", "server.js"]
  }

  environment {
    # APP_URL is omitted until you paste public_url; otherwise env.appUrl() would see "".
    variables = merge(
      {
        NODE_ENV                     = "production"
        PORT                         = "3000"
        HOSTNAME                     = "0.0.0.0"
        AWS_LWA_PORT                 = "3000"
        AWS_LWA_READINESS_CHECK_PATH = "/"
        ORDER_STORE                  = "dynamodb"
        ORDERS_TABLE                 = aws_dynamodb_table.orders.name
        FILE_STORE                   = "s3"
        PDF_BUCKET                   = aws_s3_bucket.pdfs.bucket
        MAILER                       = "ses"
        MAIL_FROM                    = "Table Detective <${var.sender_email}>"
        STRIPE_SECRET_KEY            = aws_ssm_parameter.stripe_secret_key.value
        STRIPE_WEBHOOK_SECRET        = aws_ssm_parameter.stripe_webhook_secret.value
        DOWNLOAD_TOKEN_SECRET        = aws_ssm_parameter.download_token_secret.value
      },
      var.app_url == "" ? {} : { APP_URL = var.app_url },
    )
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_app,
    aws_iam_role_policy_attachment.lambda_logs,
    aws_iam_role_policy_attachment.lambda_ecr,
    aws_cloudwatch_log_group.app,
  ]
}

resource "aws_lambda_function_url" "app" {
  count = var.image_tag == "" ? 0 : 1

  function_name      = aws_lambda_function.app[0].function_name
  authorization_type = "NONE"
  # BUFFERED: Stripe signs the raw webhook body; streaming can break that check.
  invoke_mode = "BUFFERED"
}

# Function URL with AuthType NONE still needs a resource policy; without it the URL returns 403.
resource "aws_lambda_permission" "function_url" {
  count = var.image_tag == "" ? 0 : 1

  statement_id           = "FunctionURLAllowPublicAccess"
  action                 = "lambda:InvokeFunctionUrl"
  function_name          = aws_lambda_function.app[0].function_name
  principal              = "*"
  function_url_auth_type = "NONE"
}
