# Get Single Modern Dashboard (Grail Document)

This folder contains the Terraform configuration to retrieve the detailed metadata and content layout for a specific modern (Grail-based) dashboard by its ID.

## Overview
In the modern Dynatrace platform, a dashboard's definition is split into two parts:
1.  **Metadata:** General info about the document (such as name, type, owner, modification dates, and system attributes).
2.  **Content:** The core definition containing the tiles, widgets, data queries (DQL), variables, and visualization styles.

When requesting a document via `GET /platform/document/v1/documents/{id}`, the Dynatrace API returns a **`multipart/form-data`** response containing **both** the metadata block (part name: `metadata`) and content block (part name: `content`) combined.

To handle this multipart string in Terraform, this configuration uses regular expression mapping (`regex`) to extract each JSON block dynamically from the response body.

---

## What We Used

### 1. Terraform `http` Provider
We used the official HashiCorp `http` provider to perform the API request.
*   **Source:** `hashicorp/http`
*   **Version Used:** `~> 3.4.0`
*   **Reference link:** [Terraform Registry - http Provider](https://registry.terraform.io/providers/hashicorp/http/latest/docs)

### 2. `data "http"` Data Source
Used twice:
- **`oauth_token`**: Request the OAuth access token from SSO.
- **`dashboard_metadata`**: Performs a `GET` request on the document endpoint which returns the multipart body.
*   **Reference link:** [Terraform Registry - http Data Source](https://registry.terraform.io/providers/hashicorp/http/latest/docs/data-sources/http)

### 3. `regex` and `jsondecode` Functions
Used in `outputs.tf` to parse the multipart body:
- **`regex`**: Extracts the specific JSON string for both metadata and content using RE2 patterns.
- **`jsondecode`**: Parses the extracted JSON strings into native HCL maps and lists.
*   **Reference link:** [Terraform Language - regex Function](https://developer.hashicorp.com/terraform/language/functions/regex)
*   **Reference link:** [Terraform Language - jsondecode Function](https://developer.hashicorp.com/terraform/language/functions/jsondecode)

---

## Configuration Variables

Pre-configured variables are located in [variables.tf](file:///c:/Users/User/Dynatrace/Dashboard-Terraform/get_single_dashboard/variables.tf) and pre-populated values are in [terraform.tfvars](file:///c:/Users/User/Dynatrace/Dashboard-Terraform/get_single_dashboard/terraform.tfvars):

- **`dynatrace_env_url`**: The URL of your Dynatrace apps/environment.
- **`client_id`**: OAuth Client ID.
- **`client_secret`**: OAuth Client Secret.
- **`account_urn`**: Your Dynatrace Account URN.
- **`dashboard_id`**: The target dashboard ID (defaults to `"dynatrace.clouds.aws-eks"`).

---

## How It Works Under the Hood

1.  **Authentication:**
    Queries the token service `POST https://sso.dynatrace.com/sso/oauth2/token` to get an access token.
2.  **Document Request:**
    Queries `GET https://{dynatrace_env_url}/platform/document/v1/documents/{dashboard_id}` which returns a multipart body.
3.  **Multipart Regex Extraction:**
    We parse the raw body using regex capture groups in `outputs.tf`:
    *   **Metadata Regex:** `(?s)name="metadata".*?\r?\n\r?\n(\{.*?\})\r?\n--`
    *   **Content Regex:** `(?s)name="content".*?\r?\n\r?\n(\{.*?\})\r?\n--`
4.  **HCL Output:**
    The outputs `dashboard_metadata` and `dashboard_content` render the decoded JSON objects in your terminal.
