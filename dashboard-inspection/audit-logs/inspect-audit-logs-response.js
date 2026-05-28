'use strict';

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const axios = require('axios');

const BASE_URL = process.env.DYNATRACE_ENV_API_BASE_URL || process.env.DYNATRACE_BASE_URL;
const API_TOKEN = process.env.DYNATRACE_API_TOKEN;

function fail(message) {
  console.error(message);
  process.exit(1);
}

(async () => {
  try {
    const endpoint = new URL('/api/v2/auditlogs', BASE_URL);

    const response = await axios.get(endpoint.toString(), {
      headers: {
        Authorization: `Api-Token ${API_TOKEN}`,
        Accept: 'application/json'
      },
      timeout: 30000
    });

    const data = response.data || {};
    const entries = Array.isArray(data.auditLogs) ? data.auditLogs : [];
    const first = entries[0] || null;

    console.log(JSON.stringify({
      endpoint: endpoint.toString(),
      topLevelKeys: Object.keys(data),
      totalCount: data.totalCount ?? null,
      nextPageKey: data.nextPageKey ?? null,
      entryCountInThisResponse: entries.length,
      firstEntryKeys: first ? Object.keys(first) : [],
      firstEntrySample: first
    }, null, 2));
  } catch (error) {
    if (error.response) {
      const details = typeof error.response.data === 'string'
        ? error.response.data
        : JSON.stringify(error.response.data, null, 2);
      fail(`Request failed (${error.response.status} ${error.response.statusText})\n${details}`);
    }

    fail(error.message);
  }
})();
