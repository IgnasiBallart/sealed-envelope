# Least-privilege for the running app, plus logs and ECR pull for a container Lambda.

data "aws_iam_policy_document" "app" {
  statement {
    sid = "Orders"
    actions = [
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:Query",
    ]
    resources = [
      aws_dynamodb_table.orders.arn,
      "${aws_dynamodb_table.orders.arn}/index/*",
    ]
  }

  statement {
    sid       = "ReadRoomPdfs"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.pdfs.arn}/rooms/*"]
  }

  statement {
    sid     = "SendEmail"
    actions = ["ses:SendEmail"]
    resources = concat(
      [aws_sesv2_email_identity.sender.arn],
      [for identity in aws_sesv2_email_identity.sandbox_recipient : identity.arn],
    )
  }
}

resource "aws_iam_policy" "app" {
  name        = "sealed-envelope-app"
  description = "Runtime permissions of the Sealed Envelope web app"
  policy      = data.aws_iam_policy_document.app.json
}

data "aws_iam_policy_document" "lambda_assume" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "lambda" {
  name               = "sealed-envelope-lambda"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

resource "aws_iam_role_policy_attachment" "lambda_app" {
  role       = aws_iam_role.lambda.name
  policy_arn = aws_iam_policy.app.arn
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Container Lambdas pull the image from ECR with this role.
resource "aws_iam_role_policy_attachment" "lambda_ecr" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}
