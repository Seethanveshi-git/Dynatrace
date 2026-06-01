variable "dynatrace_env_url" {
  type        = string
  description = "The Dynatrace environment URL"
}

variable "client_id" {
  type        = string
  description = "OAuth Client ID"
}

variable "client_secret" {
  type        = string
  description = "OAuth Client Secret"
  sensitive   = true
}
