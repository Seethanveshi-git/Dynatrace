# Get All Dashboards API

## Overview

The **Get All Dashboards API** is used to retrieve all available dashboards from a Dynatrace environment.

This API returns:

- Dashboard IDs
- Dashboard names
- Owner details
- Sharing information

---

# API Endpoint

```http
GET <URL>/api/config/v1/dashboards
```

---

# Required Permission

Your Dynatrace API token must have:

```text
ReadConfig
```

---

# Node.js Implementation

## Code

```javascript
'use strict';

const axios = require('axios');

const BASE_URL = '<URL>';
const API_TOKEN = '<TOKEN>';

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!BASE_URL) {
  fail('Missing BASE_URL');
}

if (!API_TOKEN) {
  fail('Missing API_TOKEN (ReadConfig scope required)');
}

let endpoint;

try {
  const normalizedBase = new URL(BASE_URL)
    .toString()
    .replace(/\/$/, '');

  endpoint = new URL(
    '/api/config/v1/dashboards',
    normalizedBase
  );
} catch {
  fail('BASE_URL is invalid');
}

(async () => {
  try {
    const res = await axios.get(endpoint.toString(), {
      headers: {
        Authorization: `Api-Token ${API_TOKEN}`,
        Accept: 'application/json'
      },
      timeout: 30000
    });

    console.log(JSON.stringify(res.data, null, 2));
  } catch (error) {

    if (error.response) {
      console.error(
        `Request failed (${error.response.status} ${error.response.statusText})`
      );

      console.error(
        typeof error.response.data === 'string'
          ? error.response.data
          : JSON.stringify(error.response.data, null, 2)
      );

      process.exit(1);
    }

    fail(error.message);
  }
})();
```

---

# Expected Response

## Success Response

```json
{
  "dashboards": [
    {
      "id": "123456789",
      "name": "Kubernetes Dashboard",
      "owner": "admin@example.com",
      "shared": true
    },
    {
      "id": "987654321",
      "name": "Application Overview",
      "owner": "devops@example.com",
      "shared": false
    }
  ]
}
```
---

# Dynatrace API Documentation

Official Documentation:

https://docs.dynatrace.com/docs/dynatrace-api/configuration-api/dashboards-api/get-all

--- 


# Get Dashboard API

## Overview

The **Get Dashboard API** is used to retrieve complete details of a specific dashboard from a Dynatrace environment.

This API returns:

- Dashboard metadata
- Dashboard tiles
- Dashboard filters
- Dashboard sharing configuration
- Tile configuration details

---

# API Endpoint

```http
GET <URL>/api/config/v1/dashboards/{dashboard-id}
```

---

# Required Permission

Your Dynatrace API token must have:

```text
ReadConfig
```

---

# Node.js Implementation

## Code

```javascript
'use strict';

const axios = require('axios');

const BASE_URL = '<URL>';
const API_TOKEN = '<TOKEN>';
const DASHBOARD_ID = '<DASHBOARD_ID>';

function fail(message) { 
  console.error(message); 
  process.exit(1); 
}

if (!BASE_URL) {
  fail('Missing BASE_URL');
}

if (!API_TOKEN) {
  fail('Missing API_TOKEN (ReadConfig scope required)');
}

if (!DASHBOARD_ID) {
  fail('Missing DASHBOARD_ID');
}

(async () => {
  try {
    const normalizedBase = new URL(BASE_URL)
      .toString()
      .replace(/\/$/, '');

    const endpoint = new URL(
      `/api/config/v1/dashboards/${encodeURIComponent(DASHBOARD_ID)}`,
      normalizedBase
    );

    const res = await axios.get(endpoint.toString(), {
      headers: {
        Authorization: `Api-Token ${API_TOKEN}`,
        Accept: 'application/json'
      },
      timeout: 30000
    });

    console.log(JSON.stringify(res.data, null, 2));

  } catch (error) {

    if (error.response) {
      console.error(
        `Request failed (${error.response.status} ${error.response.statusText})`
      );

      console.error(
        typeof error.response.data === 'string'
          ? error.response.data
          : JSON.stringify(error.response.data, null, 2)
      );

      process.exit(1);
    }

    fail(error.message);
  }
})();
```

---

# Expected Response

## Success Response

```json
{
  "dashboardMetadata": {
    "name": "Kubernetes Dashboard",
    "shared": true,
    "owner": "admin@example.com"
  },
  "tiles": [
    {
      "name": "CPU Usage",
      "tileType": "CUSTOM_CHARTING"
    }
  ]
}
```

---

# Dynatrace API Documentation

Official Documentation:

https://docs.dynatrace.com/docs/dynatrace-api/configuration-api/dashboards-api/get-dashboard

---

# Create Dashboard API

## Overview

The **Create Dashboard API** is used to create a new dashboard in a Dynatrace environment.

This API allows you to:

- Create dashboards programmatically
- Import dashboard JSON
- Clone dashboards
- Automate dashboard deployment

---

# API Endpoint

```http
POST <URL>/api/config/v1/dashboards
```

---

# Required Permission

Your Dynatrace API token must have:

```text
WriteConfig
```

---

# Node.js Implementation

## Code

```javascript
'use strict';

const fs = require('fs');
const axios = require('axios');

const BASE_URL = '<URL>';
const API_TOKEN = '<TOKEN>';
const PAYLOAD_PATH = '<PAYLOAD>';

function fail(message) { 
  console.error(message); 
  process.exit(1); 
}

if (!BASE_URL) {
  fail('Missing BASE_URL');
}

if (!API_TOKEN) {
  fail('Missing API_TOKEN (WriteConfig scope required)');
}

if (!fs.existsSync(PAYLOAD_PATH)) {
  fail(`Payload file not found: ${PAYLOAD_PATH}`);
}

(async () => {
  try {

    const payload = JSON.parse(
      fs.readFileSync(PAYLOAD_PATH, 'utf8')
    );

    const normalizedBase = new URL(BASE_URL)
      .toString()
      .replace(/\/$/, '');

    const endpoint = new URL(
      '/api/config/v1/dashboards',
      normalizedBase
    );

    const res = await axios.post(
      endpoint.toString(),
      payload,
      {
        headers: {
          Authorization: `Api-Token ${API_TOKEN}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    console.log(JSON.stringify(res.data, null, 2));

  } catch (error) {

    if (error.response) {
      console.error(
        `Request failed (${error.response.status} ${error.response.statusText})`
      );

      console.error(
        typeof error.response.data === 'string'
          ? error.response.data
          : JSON.stringify(error.response.data, null, 2)
      );

      process.exit(1);
    }

    fail(error.message);
  }
})();
```

---

# Example Payload

## dashboard-create-payload.json

```json
{
  "dashboardMetadata": {
    "name": "My Dashboard",
    "shared": true,
    "owner": "admin@example.com"
  },
  "tiles": []
}
```

---

# Expected Response

## Success Response

```json
{
  "id": "123456789"
}
```

---

# Dynatrace API Documentation

Official Documentation:

https://docs.dynatrace.com/docs/dynatrace-api/configuration-api/dashboards-api/post-dashboard

---

# Update Dashboard API

## Overview

The **Update Dashboard API** is used to update an existing dashboard in a Dynatrace environment.

This API allows you to:

- Modify dashboard configuration
- Update dashboard tiles
- Rename dashboards
- Change dashboard settings
- Automate dashboard updates

---

# API Endpoint

```http
PUT <URL>/api/config/v1/dashboards/{dashboard-id}
```

---

# Required Permission

Your Dynatrace API token must have:

```text
WriteConfig
```

---

# Node.js Implementation

## Code

```javascript
'use strict';

const fs = require('fs');
const axios = require('axios');

const BASE_URL = '<URL>';
const API_TOKEN = '<TOKEN>';
const DASHBOARD_ID = '<DASHBOARD_ID>';
const PAYLOAD_PATH = '<PAYLOAD>';

function fail(message) { 
  console.error(message); 
  process.exit(1); 
}

if (!BASE_URL) {
  fail('Missing BASE_URL');
}

if (!API_TOKEN) {
  fail('Missing API_TOKEN (WriteConfig scope required)');
}

if (!DASHBOARD_ID) {
  fail('Missing DASHBOARD_ID');
}

if (!fs.existsSync(PAYLOAD_PATH)) {
  fail(`Payload file not found: ${PAYLOAD_PATH}`);
}

(async () => {
  try {

    const payload = JSON.parse(
      fs.readFileSync(PAYLOAD_PATH, 'utf8')
    );

    const normalizedBase = new URL(BASE_URL)
      .toString()
      .replace(/\/$/, '');

    const endpoint = new URL(
      `/api/config/v1/dashboards/${encodeURIComponent(DASHBOARD_ID)}`,
      normalizedBase
    );

    const res = await axios.put(
      endpoint.toString(),
      payload,
      {
        headers: {
          Authorization: `Api-Token ${API_TOKEN}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    console.log(JSON.stringify(res.data, null, 2));

  } catch (error) {

    if (error.response) {
      console.error(
        `Request failed (${error.response.status} ${error.response.statusText})`
      );

      console.error(
        typeof error.response.data === 'string'
          ? error.response.data
          : JSON.stringify(error.response.data, null, 2)
      );

      process.exit(1);
    }

    fail(error.message);
  }
})();
```

---

# Example Payload

## dashboard-update-payload.json

```json
{
  "dashboardMetadata": {
    "name": "Updated Dashboard",
    "shared": true,
    "owner": "admin@example.com"
  },
  "tiles": []
}
```

---

# Expected Response

## Success Response

```json
{
  "id": "123456789"
}
```

---

# Dynatrace API Documentation

Official Documentation:

https://docs.dynatrace.com/docs/dynatrace-api/configuration-api/dashboards-api/put-dashboard

--- 

# Delete Dashboard API

## Overview

The **Delete Dashboard API** is used to delete an existing dashboard from a Dynatrace environment.

This API allows you to:

- Remove dashboards programmatically
- Clean up unused dashboards
- Automate dashboard management

---

# API Endpoint

```http
DELETE <URL>/api/config/v1/dashboards/{dashboard-id}
```

---

# Required Permission

Your Dynatrace API token must have:

```text
WriteConfig
```

---

# Node.js Implementation

## Code

```javascript
'use strict';

const axios = require('axios');

const BASE_URL = '<URL>';
const API_TOKEN = '<TOKEN>';
const DASHBOARD_ID = '<DASHBOARD_ID>';

function fail(message) { 
  console.error(message); 
  process.exit(1); 
}

if (!BASE_URL) {
  fail('Missing BASE_URL');
}

if (!API_TOKEN) {
  fail('Missing API_TOKEN (WriteConfig scope required)');
}

if (!DASHBOARD_ID) {
  fail('Missing DASHBOARD_ID');
}

(async () => {
  try {

    const normalizedBase = new URL(BASE_URL)
      .toString()
      .replace(/\/$/, '');

    const endpoint = new URL(
      `/api/config/v1/dashboards/${encodeURIComponent(DASHBOARD_ID)}`,
      normalizedBase
    );

    const res = await axios.delete(
      endpoint.toString(),
      {
        headers: {
          Authorization: `Api-Token ${API_TOKEN}`,
          Accept: 'application/json'
        },
        timeout: 30000
      }
    );

    console.log(JSON.stringify(res.data, null, 2));

  } catch (error) {

    if (error.response) {
      console.error(
        `Request failed (${error.response.status} ${error.response.statusText})`
      );

      console.error(
        typeof error.response.data === 'string'
          ? error.response.data
          : JSON.stringify(error.response.data, null, 2)
      );

      process.exit(1);
    }

    fail(error.message);
  }
})();
```

---

# Expected Response

## Success Response

```json
{}
```

---

# Dynatrace API Documentation

Official Documentation:

https://docs.dynatrace.com/docs/dynatrace-api/configuration-api/dashboards-api/del-dashboard