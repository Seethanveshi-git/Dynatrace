variable "dynatrace_env_url" {
  type        = string
  description = "The Dynatrace environment URL (e.g., https://abc12345.live.dynatrace.com)"
}

variable "client_id" {
  type        = string
  description = "The Dynatrace OAuth Client ID"
}

variable "client_secret" {
  type        = string
  description = "The Dynatrace OAuth Client Secret"
  sensitive   = true
}

variable "account_urn" {
  type        = string
  description = "The Dynatrace account URN (e.g., urn:dtaccount:xxxx-xxxx)"
}

variable "dashboard_id" {
  type        = string
  description = "The ID of the modern dashboard to be archived and deleted"
  validation {
    condition     = var.dashboard_id != ""
    error_message = "The dashboard_id must not be empty."
  }
}

variable "aws_region" {
  type        = string
  description = "The AWS Region where the S3 bucket is located"
  default     = "ap-south-1"
}

variable "s3_bucket_name" {
  type        = string
  description = "The name of the S3 bucket for storing archived dashboards"
  default     = "dynatrace-archived-dashboards"
}
