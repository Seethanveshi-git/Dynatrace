const axios = require('axios');
require('dotenv').config();

const ENV_URL = process.env.DT_ENV_URL;
const API_TOKEN = process.env.DT_API_TOKEN;
const SERVICE_ID = process.env.DT_SERVICE_ID;

if (!ENV_URL || !API_TOKEN || !SERVICE_ID) {
  throw new Error('Missing DT_ENV_URL, DT_API_TOKEN, or DT_SERVICE_ID in .env');
}

const endpoints = ['/api/auth/login', '/api/auth/signup', '/api/groups', '/api/expense'];

async function createKeyRequests() {
  try {
    const payload = endpoints.map((ep) => ({
      schemaId: 'builtin:service.key-request',
      scope: SERVICE_ID,
      value: {
        enabled: true,
        requestName: ep,
        conditions: [
          {
            attribute: 'REQUEST_NAME',
            comparisonInfo: {
              type: 'STRING',
              operator: 'EQUALS',
              value: ep
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

createKeyRequests();
