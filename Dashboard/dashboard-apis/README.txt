Dashboard API Folder Structure

Each folder contains:
- One Node.js axios script
- notes.txt with API details + docs URL + run info
- Example payload JSON where request body is required

Folders:
1) get-all-dashboards
2) get-dashboard-details
3) create-dashboard
4) update-dashboard
5) delete-dashboard
6) get-sharing-config
7) update-sharing-config

Common env vars:
- DYNATRACE_BASE_URL
- DYNATRACE_API_TOKEN
- DYNATRACE_DASHBOARD_ID (for id-based APIs)
- DYNATRACE_PAYLOAD_PATH (for POST/PUT body APIs)

Dependency:
- npm install axios
