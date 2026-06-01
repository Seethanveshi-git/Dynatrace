# 1. Fetch the OAuth access token from Dynatrace SSO
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
  # Parse token response and extract the access token
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
