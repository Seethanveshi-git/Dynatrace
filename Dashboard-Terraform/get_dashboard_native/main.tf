provider "dynatrace" {
  dt_env_url               = var.dynatrace_env_url
  automation_client_id     = var.client_id
  automation_client_secret = var.client_secret
}

# Query all dashboards from the environment using the native documents data source
data "dynatrace_documents" "all_dashboards" {
  type = "dashboard"
}
