output "decoded_response" {
  value       = local.response_data
  description = "The fully decoded JSON response from the Dynatrace Document Service API."
}

locals {
  # Decode the JSON response body
  response_data = jsondecode(data.http.get_dashboards.response_body)

  # Extract documents array, defaulting to empty list if none exist
  dashboards = lookup(local.response_data, "documents", [])
}

output "dashboards" {
  value = [
    for db in local.dashboards : {
      id                = db.id
      name              = db.name
      type              = db.type
      owner             = lookup(db, "owner", null)
      description       = lookup(db, "description", null)
      is_private        = lookup(db, "isPrivate", null)
      external_id       = lookup(db, "externalId", null)
      version           = lookup(db, "version", null)
      origin_app_id     = lookup(db, "originAppId", null)
      access            = lookup(db, "access", null)
      modification_info = lookup(db, "modificationInfo", null)
    }
  ]
  description = "List of modern Dynatrace dashboards with all available metadata attributes."
}

