output "archived_to_s3_uri" {
  value       = "s3://${aws_s3_object.archive.bucket}/${aws_s3_object.archive.key}"
  description = "The AWS S3 URI where the dashboard archive was uploaded."
}

output "archived_to_s3_key" {
  value       = aws_s3_object.archive.key
  description = "The S3 key of the archive file (to be passed to restore_dashboard)."
}

output "deleted_dashboard_id" {
  value       = var.dashboard_id
  description = "The ID of the dashboard that was deleted."
}

output "deleted_version" {
  value       = local.version
  description = "The optimistic locking version that was deleted."
}

output "status" {
  value       = "Success. Dashboard '${var.dashboard_id}' was archived to S3 and deleted from Dynatrace."
  description = "Execution status message."
}
