'use strict';
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const axios = require('axios');

const BASE_URL = process.env.DYNATRACE_BASE_URL;
const API_TOKEN = process.env.DYNATRACE_API_TOKEN;
const DASHBOARD_ID = process.env.DYNATRACE_DASHBOARD_ID;

function fail(message) { 
  console.error(message); 
  process.exit(1); 
}

if (!BASE_URL) {
  fail('Missing DYNATRACE_BASE_URL');
}

if (!API_TOKEN) {
  fail('Missing DYNATRACE_API_TOKEN (ReadConfig scope required)');
}

if (!DASHBOARD_ID) {
  fail('Missing DYNATRACE_DASHBOARD_ID');
}

(async () => {
  try {
    const normalizedBase = new URL(BASE_URL).toString().replace(/\/$/, '');
    const endpoint = new URL(`/api/config/v1/dashboards/${encodeURIComponent(DASHBOARD_ID)}`, normalizedBase);
    const res = await axios.get(endpoint.toString(), {
      headers: { Authorization: `Api-Token ${API_TOKEN}`, Accept: 'application/json' },
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

