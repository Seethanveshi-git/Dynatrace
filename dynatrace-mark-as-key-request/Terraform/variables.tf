variable "dynatrace_token" {
  type        = string
  description = "Dynatrace API token"
  sensitive   = true
}

variable "dynatrace_env" {
  type        = string
  description = "Dynatrace environment URL"
}

variable "service_id" {
  type        = string
  description = "Dynatrace service ID"
}
