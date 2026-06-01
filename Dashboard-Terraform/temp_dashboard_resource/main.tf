provider "dynatrace" {
  dt_env_url               = var.dynatrace_env_url
  automation_client_id     = var.client_id
  automation_client_secret = var.client_secret
}

# Create a modern dashboard using the native dynatrace_document resource
resource "dynatrace_document" "temp_dashboard" {
  name    = "Temp Terraform Dashboard"
  type    = "dashboard"
  private = false

  # Core dashboard widget/tile JSON layout
  content = jsonencode({
    version   = 1
    variables = []
    tiles = {
      "0" = {
        type    = "markdown"
        title   = "Hello World"
        content = "This dashboard was created dynamically using Terraform and the native dynatrace_document resource."
      }
    }
  })
}
