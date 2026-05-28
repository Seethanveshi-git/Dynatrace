'use strict';
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const axios = require('axios');

const BASE_URL = process.env.DYNATRACE_BASE_URL;
const API_TOKEN = process.env.DYNATRACE_API_TOKEN;
const PAYLOAD_PATH = process.env.DYNATRACE_PAYLOAD_PATH || './dashboard-create-payload.json';

function fail(message) { 
  console.error(message); 
  process.exit(1); 
}

if (!BASE_URL) {
  fail('Missing DYNATRACE_BASE_URL');
}

if (!API_TOKEN) {
  fail('Missing DYNATRACE_API_TOKEN (WriteConfig scope required)');
}

if (!fs.existsSync(PAYLOAD_PATH)) {
  fail(`Payload file not found: ${PAYLOAD_PATH}`);
}

(async () => {
  try {
    const payload = JSON.parse(fs.readFileSync(PAYLOAD_PATH, 'utf8'));
    const normalizedBase = new URL(BASE_URL).toString().replace(/\/$/, '');
    const endpoint = new URL('/api/config/v1/dashboards', normalizedBase);
    const res = await axios.post(endpoint.toString(), payload, {
      headers: { Authorization: `Api-Token ${API_TOKEN}`, Accept: 'application/json', 'Content-Type': 'application/json' },
      timeout: 30000
    });
    console.log(JSON.stringify(res.data, null, 2));
  } catch (error) {
    if (error.response) {
      console.error(`Request failed (${error.response.status} ${error.response.statusText})`);
      console.error(typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data, null, 2));
      process.exit(1);
    }
    fail(error.message);
  }
})();

