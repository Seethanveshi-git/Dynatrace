'use strict';
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const axios = require('axios');

const BASE_URL = process.env.DYNATRACE_BASE_URL;
const API_TOKEN = process.env.DYNATRACE_API_TOKEN;
const OWNER = process.env.DYNATRACE_DASHBOARD_OWNER;
const TAGS_CSV = process.env.DYNATRACE_DASHBOARD_TAGS;

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

let endpoint;
try {
  const normalizedBase = new URL(BASE_URL).toString().replace(/\/$/, '');
  endpoint = new URL('/api/config/v1/dashboards', normalizedBase);
} catch {
  fail('DYNATRACE_BASE_URL is invalid');
}

if (OWNER) endpoint.searchParams.set('owner', OWNER);
if (TAGS_CSV) {
  TAGS_CSV.split(',').map(t => t.trim()).filter(Boolean).forEach(tag => endpoint.searchParams.append('tags', tag));
}

(async () => {
  try {
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
