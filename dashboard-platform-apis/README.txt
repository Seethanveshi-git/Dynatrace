Latest Dynatrace Dashboard Platform APIs (separate from Classic)

This folder does NOT modify classic endpoints under /api/config/v1/dashboards.
It uses platform Document Service endpoints under /platform/document/v1/documents.

Folders:
1) list-dashboards
2) get-dashboard
3) create-dashboard
4) update-dashboard
5) delete-dashboard

Auth model:
- Preferred: set DYNATRACE_PLATFORM_BEARER_TOKEN in .env
- Or configure OAuth client credentials in .env and the scripts fetch token automatically.

Required .env additions for platform APIs:
- DYNATRACE_PLATFORM_BEARER_TOKEN=
- DYNATRACE_DOCUMENT_ID=
- DYNATRACE_DOCUMENT_PAYLOAD_PATH=
- DYNATRACE_OAUTH_TOKEN_URL=
- DYNATRACE_OAUTH_CLIENT_ID=
- DYNATRACE_OAUTH_CLIENT_SECRET=
- DYNATRACE_OAUTH_RESOURCE=
- DYNATRACE_OAUTH_SCOPE=document:documents:read document:documents:write

Sources:
- https://docs.dynatrace.com/docs/analyze-explore-automate/dashboards-and-notebooks/document-api
- https://developer.dynatrace.com/develop/platform-services/core-concepts/authentication/
- https://developer.dynatrace.com/develop/access-platform-apis-from-outside/
