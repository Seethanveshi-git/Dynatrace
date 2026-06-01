# Restore Dynatrace Dashboard from S3

This directory contains the Terraform configuration to restore a modern Dynatrace dashboard from a JSON backup file stored in your AWS S3 bucket.

## How it Works
1.  **Download Backup:** Queries your AWS S3 bucket at `s3://dynatrace-archived-dashboards/dashboards/{dashboard_id}.json` to download the archived metadata and layout content.
2.  **Recreate Dashboard:** Parses the backup body and deploys the dashboard back to Dynatrace using the native `dynatrace_document` resource.
3.  **Identify New ID:** Once deployed, Dynatrace automatically generates a new, unique ID for the restored document. Terraform outputs this new ID so you can update any bookmarks or references.

---

## Prerequisites
*   An archived dashboard file in the S3 bucket.
*   AWS credentials set up locally via `aws configure`.
*   You must set `$env:DYNATRACE_HTTP_OAUTH_PREFERENCE="true"` in your shell before running Terraform commands since we use the native Dynatrace provider.

---

## How to Execute

1.  **Initialize the workspace:**
    ```powershell
    C:\Users\User\terraform\terraform_1.15.5_windows_amd64\terraform.exe init
    ```

2.  **Run Restore:**
    Pass the **original** dashboard's ID as the `dashboard_id` variable:
    ```powershell
    # Make sure to set the OAuth preference env var first
    $env:DYNATRACE_HTTP_OAUTH_PREFERENCE="true"
    
    # Run the apply
    C:\Users\User\terraform\terraform_1.15.5_windows_amd64\terraform.exe apply -var="dashboard_id=original-dashboard-id" -auto-approve
    ```
