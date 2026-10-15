# ECS Express Mode: AWS provisions the ALB, TLS, security groups and scaling.
# App Runner closed to new accounts on 2026-04-30; this is the replacement AWS recommends.

resource "aws_ecs_cluster" "app" {
  name = "sealed-envelope"
}

resource "aws_ecs_cluster_capacity_providers" "app" {
  cluster_name       = aws_ecs_cluster.app.name
  capacity_providers = ["FARGATE"]

  default_capacity_provider_strategy {
    capacity_provider = "FARGATE"
    weight            = 1
  }
}

resource "aws_cloudwatch_log_group" "app" {
  name              = "/ecs/sealed-envelope"
  retention_in_days = 14
}

resource "aws_ecs_express_gateway_service" "app" {
  count = var.image_tag == "" ? 0 : 1

  service_name            = "sealed-envelope"
  cluster                 = aws_ecs_cluster.app.name
  cpu                     = "512"
  memory                  = "1024"
  health_check_path       = "/"
  execution_role_arn      = aws_iam_role.ecs_execution.arn
  task_role_arn           = aws_iam_role.ecs_task.arn
  infrastructure_role_arn = aws_iam_role.ecs_infrastructure.arn
  wait_for_steady_state   = true

  # 0.5 vCPU / 1 GB is the cheap Fargate size that still runs Next.js.
  # min 1 keeps the shop up; max 2 caps the bill if traffic spikes.
  scaling_target {
    min_task_count            = 1
    max_task_count            = 2
    auto_scaling_metric       = "AVERAGE_CPU"
    auto_scaling_target_value = 60
  }

  primary_container {
    image          = "${aws_ecr_repository.app.repository_url}:${var.image_tag}"
    container_port = 3000

    aws_logs_configuration {
      log_group         = aws_cloudwatch_log_group.app.name
      log_stream_prefix = "app"
    }

    environment {
      name  = "NODE_ENV"
      value = "production"
    }

    environment {
      name  = "PORT"
      value = "3000"
    }

    environment {
      name  = "HOSTNAME"
      value = "0.0.0.0"
    }

    environment {
      name  = "AWS_REGION"
      value = var.aws_region
    }

    environment {
      name  = "ORDER_STORE"
      value = "dynamodb"
    }

    environment {
      name  = "ORDERS_TABLE"
      value = aws_dynamodb_table.orders.name
    }

    environment {
      name  = "FILE_STORE"
      value = "s3"
    }

    environment {
      name  = "PDF_BUCKET"
      value = aws_s3_bucket.pdfs.bucket
    }

    environment {
      name  = "MAILER"
      value = "ses"
    }

    environment {
      name  = "MAIL_FROM"
      value = "Sealed Envelope <${var.sender_email}>"
    }

    dynamic "environment" {
      for_each = var.app_url == "" ? [] : [var.app_url]
      content {
        name  = "APP_URL"
        value = environment.value
      }
    }

    secret {
      name       = "STRIPE_SECRET_KEY"
      value_from = aws_ssm_parameter.stripe_secret_key.arn
    }

    secret {
      name       = "STRIPE_WEBHOOK_SECRET"
      value_from = aws_ssm_parameter.stripe_webhook_secret.arn
    }

    secret {
      name       = "DOWNLOAD_TOKEN_SECRET"
      value_from = aws_ssm_parameter.download_token_secret.arn
    }
  }

  # Without this, destroying the service can hang in DRAINING because the
  # infrastructure role loses its policy before ECS can delete the ALB.
  depends_on = [
    aws_iam_role_policy_attachment.ecs_execution,
    aws_iam_role_policy_attachment.ecs_task_app,
    aws_iam_role_policy_attachment.ecs_infrastructure,
    aws_ecs_cluster_capacity_providers.app,
  ]
}
