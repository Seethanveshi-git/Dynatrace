provider "aws" {
  region = var.aws_region
}

# 1. Retrieve the OAuth access token from Dynatrace SSO
data "http" "oauth_token" {
  url    = "https://sso.dynatrace.com/sso/oauth2/token"
  method = "POST"

  request_headers = {
    "Content-Type" = "application/x-www-form-urlencoded"
    "Accept"       = "application/json"
  }

  request_body = "grant_type=client_credentials&client_id=${var.client_id}&client_secret=${var.client_secret}&resource=${var.account_urn}"
}

locals {
  access_token = jsondecode(data.http.oauth_token.response_body).access_token
}

# 2. Query the dashboard document (returns a multipart response containing both metadata and content)
data "http" "dashboard_metadata" {
  url = "${var.dynatrace_env_url}/platform/document/v1/documents/${var.dashboard_id}"

  request_headers = {
    Authorization = "Bearer ${local.access_token}"
    Accept        = "application/json"
  }
}

locals {
  # Regex to capture the metadata JSON part from the multipart body
  metadata_regex = "(?s)name=\"metadata\".*?\\r?\\n\\r?\\n(\\{.*?\\})\\r?\\n--"
  metadata_json  = regex(local.metadata_regex, data.http.dashboard_metadata.response_body)[0]

  # Regex to capture the content JSON part from the multipart body
  content_regex = "(?s)name=\"content\".*?\\r?\\n\\r?\\n(\\{.*\\})"
  content_json  = regex(local.content_regex, data.http.dashboard_metadata.response_body)[0]

  metadata = jsondecode(local.metadata_json)
  content  = jsondecode(local.content_json)
  version  = local.metadata.version

  # Clean the name of slashes to avoid creating subfolders in S3
  clean_name = replace(local.metadata.name, "/", "-")
}

# 3. Upload the backup payload to S3
resource "aws_s3_object" "archive" {
  bucket       = var.s3_bucket_name
  key          = "dashboards/${local.clean_name}_${var.dashboard_id}.json"
  content_type = "application/json"

  content = jsonencode({
    metadata = local.metadata
    content  = local.content
  })
}

# 4. Perform the DELETE operation on apply (only after S3 archiving completes)
resource "terraform_data" "delete_action" {
  depends_on = [aws_s3_object.archive]

  triggers_replace = {
    dashboard_id = var.dashboard_id
    version      = local.version
  }

  provisioner "local-exec" {
    command     = "Invoke-RestMethod -Uri \"${var.dynatrace_env_url}/platform/document/v1/documents/${var.dashboard_id}?optimistic-locking-version=${local.version}\" -Method Delete -Headers @{ Authorization = \"Bearer ${local.access_token}\" }"
    interpreter = ["powershell", "-Command"]
  }
}
