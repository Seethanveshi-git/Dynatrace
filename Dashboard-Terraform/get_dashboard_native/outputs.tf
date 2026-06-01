output "dashboards" {
  value       = data.dynatrace_documents.all_dashboards.values
  description = "List of modern Dynatrace dashboards retrieved via the native documents data source."
}
