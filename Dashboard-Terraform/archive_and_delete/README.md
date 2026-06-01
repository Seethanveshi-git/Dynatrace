# Archive Dashboard to S3 & Delete from Dynatrace

This directory contains the Terraform configuration to safely archive a modern Dynatrace dashboard configuration to an AWS S3 bucket, and then delete the dashboard from the environment.

## How it Works
1.  **Retrieve Token:** Requests a temporary OAuth 2.0 token from Dynatrace SSO.
2.  **Fetch Configuration:** Queries the dashboard endpoint to receive a multipart response containing both `metadata` and the layout `content`.
3.  **Upload to S3:** Uploads a combined JSON file to your S3 bucket at `s3://dynatrace-archived-dashboards/dashboards/{dashboard_id}.json`.
4.  **Delete:** Once the S3 upload succeeds, it runs a PowerShell command to call the `DELETE` API on the dashboard using the correct `optimistic-locking-version`.

---

## Prerequisites
*   An S3 bucket named `dynatrace-archived-dashboards` in region `ap-south-1`.
*   AWS credentials set up locally via `aws configure`.

---

## How to Execute

1.  **Initialize the workspace:**
    ```powershell
    C:\Users\User\terraform\terraform_1.15.5_windows_amd64\terraform.exe init
    ```

2.  **Run Archive and Delete:**
    Pass the target dashboard's ID as the `dashboard_id` variable:
    ```powershell
    C:\Users\User\terraform\terraform_1.15.5_windows_amd64\terraform.exe apply -var="dashboard_id=your-dashboard-id" -auto-approve
    ```
