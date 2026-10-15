# Least-privilege permissions for the running app. It is a standalone managed policy so it can be
# attached to whatever role the compute service ends up using.

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
    # In the sandbox SES also checks permission on the recipient identity.
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

# Three roles, because ECS uses them at different times:
# - execution: the agent (pull image, write logs, read SSM secrets)
# - task: the Node process (DynamoDB, S3, SES)
# - infrastructure: Express Mode creating the ALB, security groups and scaling

data "aws_iam_policy_document" "ecs_tasks_assume" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "ecs_assume" {
  statement {
    sid     = "AllowAccessInfrastructureForECSExpressServices"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ecs_execution" {
  name               = "sealed-envelope-ecs-execution"
  assume_role_policy = data.aws_iam_policy_document.ecs_tasks_assume.json
}

resource "aws_iam_role_policy_attachment" "ecs_execution" {
  role       = aws_iam_role.ecs_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role" "ecs_task" {
  name               = "sealed-envelope-ecs-task"
  assume_role_policy = data.aws_iam_policy_document.ecs_tasks_assume.json
}

resource "aws_iam_role_policy_attachment" "ecs_task_app" {
  role       = aws_iam_role.ecs_task.name
  policy_arn = aws_iam_policy.app.arn
}

resource "aws_iam_role" "ecs_infrastructure" {
  name               = "sealed-envelope-ecs-infrastructure"
  assume_role_policy = data.aws_iam_policy_document.ecs_assume.json
}

resource "aws_iam_role_policy_attachment" "ecs_infrastructure" {
  role       = aws_iam_role.ecs_infrastructure.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSInfrastructureRoleforExpressGatewayServices"
}
