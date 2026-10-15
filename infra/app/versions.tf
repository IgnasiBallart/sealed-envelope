terraform {
  required_version = ">= 1.10"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }

  # Partial configuration: bucket, region and profile come from backend.hcl
  # (`terraform init -backend-config=backend.hcl`), because the bucket name contains the account id.
  backend "s3" {
    key     = "sealed-envelope/app.tfstate"
    encrypt = true
    # S3-native state locking (Terraform >= 1.10): no DynamoDB lock table needed.
    use_lockfile = true
  }
}

provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile

  default_tags {
    tags = {
      Project   = "sealed-envelope"
      ManagedBy = "terraform"
      Stack     = "app"
    }
  }
}

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}
