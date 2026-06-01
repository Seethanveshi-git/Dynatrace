# Get All Modern Dashboards (Grail Documents)

This folder contains the Terraform configuration to retrieve all modern (Grail-based) dashboards from your Dynatrace environment.

## Overview
In the modern Dynatrace platform, dashboards are stored as "documents" inside the Dynatrace Document Service. Since there is no native, generic data source (like `dynatrace_documents`) to list all dashboards in the provider that returns all detailed properties (such as description, access details, version, and modification timestamps), this configuration uses the official Terraform `http` provider to:
1.  **Retrieve an OAuth 2.0 Access Token** dynamically via a client credentials grant POST request to Dynatrace SSO.
2.  **Query the Document Service API** directly using the retrieved token to return a list of dashboards.

---

## What We Used

### 1. Terraform `http` Provider
We used the official HashiCorp `http` provider to make HTTP request calls during the execution of Terraform `plan` or `apply`.
*   **Source:** `hashicorp/http`
*   **Version Used:** `~> 3.4.0`
*   **Reference link:** [Terraform Registry - http Provider](https://registry.terraform.io/providers/hashicorp/http/latest/docs)

### 2. `data "http"` Data Source
This data source is used twice:
- **`oauth_token`**: Performs a `POST` request with the client credentials and URN context to get the OAuth token.
- **`get_dashboards`**: Performs a `GET` request on the Dynatrace API using the dynamic token in the Authorization header.
*   **Reference link:** [Terraform Registry - http Data Source](https://registry.terraform.io/providers/hashicorp/http/latest/docs/data-sources/http)

### 3. `jsondecode` Function
Used to parse the JSON string response from the token and document endpoints into Terraform maps/lists.
*   **Reference link:** [Terraform Language - jsondecode Function](https://developer.hashicorp.com/terraform/language/functions/jsondecode)

---

## Configuration Variables

Pre-configured variables are located in [variables.tf](file:///c:/Users/User/Dynatrace/Dashboard-Terraform/get_all_dashboards/variables.tf) and pre-populated values are in [terraform.tfvars](file:///c:/Users/User/Dynatrace/Dashboard-Terraform/get_all_dashboards/terraform.tfvars):

- **`dynatrace_env_url`**: The URL of your Dynatrace apps/environment (e.g., `https://goo63691.apps.dynatrace.com`).
- **`client_id`**: OAuth Client ID.
- **`client_secret`**: OAuth Client Secret.
- **`account_urn`**: Your Dynatrace Account URN.

---

## How It Works Under the Hood

1.  **Authentication Request:**
    ```
    POST https://sso.dynatrace.com/sso/oauth2/token
    Content-Type: application/x-www-form-urlencoded
    
    grant_type=client_credentials&client_id=<client_id>&client_secret=<client_secret>&resource=<account_urn>
    ```
2.  **Access Token Extraction:**
    The token is parsed from the response:
    ```hcl
    locals {
      access_token = jsondecode(data.http.oauth_token.response_body).access_token
    }
    ```
3.  **Retrieve Dashboards:**
    Queries the document service using the parsed token:
    ```
    GET https://{dynatrace_env_url}/platform/document/v1/documents?filter=type='dashboard'
    Authorization: Bearer <access_token>
    ```
4.  **Parse & Output:**
    Processes the raw JSON response to yield:
    - **`decoded_response`**: The fully parsed, hierarchical JSON structure from the API.
    - **`dashboards`**: A clean structured list of dashboards mapping all available attributes including:
      - `id`
      - `name`
      - `type`
      - `owner`
      - `description`
      - `is_private`
      - `external_id`
      - `version`
      - `origin_app_id`
      - `access`
      - `modification_info` (which includes metadata like `createdBy`, `createdTime`, `lastModifiedBy`, `lastModifiedTime`)
