'use strict';

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const axios = require('axios');

function fail(message) {
  console.error(message);
  process.exit(1);
}

function getPlatformBaseUrl() {
  const base = process.env.DYNATRACE_BASE_URL;
  if (!base) fail('Missing DYNATRACE_BASE_URL in .env');

  try {
    return new URL(base).toString().replace(/\/$/, '');
  } catch {
    fail('DYNATRACE_BASE_URL is not a valid URL');
  }
}

async function resolveBearerToken() {
  const directToken = process.env.DYNATRACE_PLATFORM_BEARER_TOKEN;
  if (directToken) return directToken;

  const tokenUrl = process.env.DYNATRACE_OAUTH_TOKEN_URL;
  const clientId = process.env.DYNATRACE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.DYNATRACE_OAUTH_CLIENT_SECRET;
  const resource = process.env.DYNATRACE_OAUTH_RESOURCE;
  const scope = process.env.DYNATRACE_OAUTH_SCOPE;

  if (!tokenUrl || !clientId || !clientSecret || !resource || !scope) {
    fail('Missing OAuth config. Set DYNATRACE_PLATFORM_BEARER_TOKEN or all DYNATRACE_OAUTH_* variables in .env');
  }

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    resource,
    scope
  });

  try {
    const response = await axios.post(tokenUrl, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 30000
    });

    if (!response.data || !response.data.access_token) {
      fail('OAuth response does not contain access_token');
    }

    return response.data.access_token;
  } catch (error) {
    if (error.response) {
      const details = typeof error.response.data === 'string'
        ? error.response.data
        : JSON.stringify(error.response.data, null, 2);
      fail(`Failed to get OAuth token (${error.response.status} ${error.response.statusText})\n${details}`);
    }

    fail(`Failed to get OAuth token: ${error.message}`);
  }
}

module.exports = {
  axios,
  getPlatformBaseUrl,
  resolveBearerToken,
  fail
};
