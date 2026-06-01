provider "aws" {
  region = var.aws_region
}

provider "dynatrace" {
  dt_env_url               = var.dynatrace_env_url
  automation_client_id     = var.client_id
  automation_client_secret = var.client_secret
}

# 1. Download the backup JSON file from the S3 bucket
data "aws_s3_object" "archive" {
  bucket = var.s3_bucket_name
  key    = var.archive_key
}

locals {
  # Decode the S3 object body
  archive_data = jsondecode(data.aws_s3_object.archive.body)
}

# 2. Re-create the dashboard in Dynatrace using the native provider
resource "dynatrace_document" "restored" {
  name    = local.archive_data.metadata.name
  type    = "dashboard"
  private = lookup(local.archive_data.metadata, "isPrivate", false)
  content = jsonencode(local.archive_data.content)
}
