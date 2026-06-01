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

variable "archive_key" {
  type        = string
  description = "The full S3 key of the archived dashboard JSON file (e.g., dashboards/Temp Terraform Dashboard_0e2515f8-f165-4cc4-b72f-7b4e6d1ef480.json)"
  validation {
    condition     = var.archive_key != ""
    error_message = "The archive_key must not be empty."
  }
}

variable "aws_region" {
  type        = string
  description = "The AWS Region where the S3 bucket is located"
  default     = "ap-south-1"
}

variable "s3_bucket_name" {
  type        = string
  description = "The name of the S3 bucket where archives are stored"
  default     = "dynatrace-archived-dashboards"
}
