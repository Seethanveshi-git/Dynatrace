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
