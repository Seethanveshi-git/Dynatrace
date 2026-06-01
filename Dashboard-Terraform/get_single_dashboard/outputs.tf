locals {
  # Regex to capture the metadata JSON part from the multipart body
  metadata_regex = "(?s)name=\"metadata\".*?\\r?\\n\\r?\\n(\\{.*?\\})\\r?\\n--"
  metadata_json  = regex(local.metadata_regex, data.http.dashboard_metadata.response_body)[0]

  # Regex to capture the content JSON part from the multipart body (greedy match to ignore trailing boundary format)
  content_regex = "(?s)name=\"content\".*?\\r?\\n\\r?\\n(\\{.*\\})"
  content_json  = regex(local.content_regex, data.http.dashboard_metadata.response_body)[0]
}

output "dashboard_metadata" {
  value       = jsondecode(local.metadata_json)
  description = "The fully parsed metadata (name, owner, permissions, etc.) for the requested Dynatrace dashboard."
}

#output "dashboard_content" {
#  value       = jsondecode(local.content_json)
#  description = "The fully parsed visual content, widget/tile layout, and analytics definitions for the requested Dynatrace dashboard."
#}
