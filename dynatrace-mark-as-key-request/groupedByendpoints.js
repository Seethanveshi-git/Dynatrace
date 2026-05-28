const axios = require('axios');
require('dotenv').config();

const ENV_URL = process.env.DT_ENV_URL;
const API_TOKEN = process.env.DT_API_TOKEN;
const SERVICE_ID = process.env.DT_SERVICE_ID;

if (!ENV_URL || !API_TOKEN || !SERVICE_ID) {
  throw new Error('Missing DT_ENV_URL, DT_API_TOKEN, or DT_SERVICE_ID in .env');
}

const groups = [
  { name: 'Auth APIs', prefix: '/api/auth/' },
  { name: 'Groups APIs', prefix: '/api/groups' },
  { name: 'Expense APIs', prefix: '/api/expense' }
];

async function createGroupedKeyRequests() {
  try {
    const payload = groups.map((g) => ({
      schemaId: 'builtin:service.key-request',
      scope: SERVICE_ID,
      value: {
        enabled: true,
        requestName: g.name,
        conditions: [
          {
            attribute: 'REQUEST_NAME',
            comparisonInfo: {
              type: 'STRING',
              operator: 'STARTS_WITH',
              value: g.prefix
            }
          }
        ]
      }
    }));

    const response = await axios.post(`${ENV_URL}/api/v2/settings/objects`, payload, {
      headers: {
        Authorization: `Api-Token ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error(JSON.stringify(error.response?.data || error.message, null, 2));
  }
}

createGroupedKeyRequests();
